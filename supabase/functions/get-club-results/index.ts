import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import CryptoJS from "https://esm.sh/crypto-js@4.1.1"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const APP_ID = "SX046";
const APP_PASSWORD = "NQC2rNs85g";
const CLUB_NUMBER = "10330022";
const API_BASE_URL = "https://www.fftt.com/mobile/pxml";

function getTimestamp() {
  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
}

function generateSmartpingHash(tm: string) {
  const passwordMd5 = CryptoJS.MD5(APP_PASSWORD).toString();
  return CryptoJS.HmacSHA1(tm, passwordMd5).toString();
}

function parseXmlList(xml: string, tagName: string) {
  const regex = new RegExp(`<${tagName}>([\\s\\S]*?)<\\/${tagName}>`, 'g');
  const results = [];
  let match;
  while ((match = regex.exec(xml)) !== null) {
    const content = match[1];
    const obj: any = {};
    const tagRegex = /<([\w]+)>([\s\S]*?)<\/\1>/g;
    let tagMatch;
    while ((tagMatch = tagRegex.exec(content)) !== null) {
      let val = tagMatch[2].trim()
        .replace(/&/g, '&')
        .replace(/&nbsp;/g, ' ')
        .replace(/&ndash;/g, '-')
        .replace(/&mdash;/g, '-')
        .replace(/&quot;/g, '"');
      obj[tagMatch[1]] = val;
    }
    results.push(obj);
  }
  return results;
}

/**
 * Détermine la phase actuelle en fonction du mois
 * Janvier (1) à Août (8) -> Phase 2
 * Septembre (9) à Décembre (12) -> Phase 1
 */
function getCurrentPhase(): string {
  const month = new Date().getMonth() + 1;
  return (month >= 1 && month <= 8) ? "2" : "1";
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const tm = getTimestamp();
    const tmc = generateSmartpingHash(tm);
    const serie = "STLB" + Math.random().toString(36).substring(2, 13).toUpperCase().padEnd(11, 'X');

    // Initialisation de la session Smartping
    await fetch(`${API_BASE_URL}/xml_initialisation.php?id=${APP_ID}&serie=${serie}&tm=${tm}&tmc=${tmc}`);

    // Récupération de toutes les équipes du club (Type A = Toutes)
    const teamsUrl = `${API_BASE_URL}/xml_equipe.php?id=${APP_ID}&serie=${serie}&tm=${tm}&tmc=${tmc}&numclu=${CLUB_NUMBER}&type=A`;
    const teamsRes = await fetch(teamsUrl);
    const teamsXml = await teamsRes.text();
    const allTeams = parseXmlList(teamsXml, 'equipe');

    const currentPhase = getCurrentPhase();
    console.log(`[get-club-results] Phase actuelle détectée : ${currentPhase}`);

    // Filtrage des équipes pour ne garder que le championnat et la phase en cours
    const filteredTeams = allTeams.filter(team => {
      const lib = (team.libepr || "").toLowerCase();
      const div = (team.libdivision || "").toLowerCase();
      const combined = `${lib} ${div}`;

      // On ne garde que le championnat
      if (!combined.includes("championnat")) return false;

      // Logique de filtrage par phase
      if (combined.includes(`phase ${currentPhase}`) || combined.includes(`ph ${currentPhase}`)) {
        return true;
      }

      // Si on est en Phase 2, on exclut explicitement la Phase 1
      if (currentPhase === "2" && (combined.includes("phase 1") || combined.includes("ph 1"))) {
        return false;
      }

      // Si on est en Phase 1, on exclut explicitement la Phase 2
      if (currentPhase === "1" && (combined.includes("phase 2") || combined.includes("ph 2"))) {
        return false;
      }

      // Par défaut, si aucune phase n'est mentionnée, on garde (cas rare)
      return true;
    });

    // On garde chaque équipe unique par son lien de division
    const uniqueTeams = filteredTeams.filter((team, index, self) =>
      index === self.findIndex((t) => t.liendivision === team.liendivision)
    );

    // Enrichissement avec les classements
    const enrichedTeams = await Promise.all(uniqueTeams.map(async (team) => {
      const rawLink = team.liendivision || "";
      const d1Match = rawLink.match(/[Dd]1=([^&]+)/);
      const pouleMatch = rawLink.match(/cx_poule=([^&]+)/);
      
      const d1 = d1Match ? d1Match[1] : null;
      const cx_poule = pouleMatch ? pouleMatch[1] : null;

      if (d1 && cx_poule) {
        const rankingUrl = `${API_BASE_URL}/xml_result_equ.php?id=${APP_ID}&serie=${serie}&tm=${tm}&tmc=${tmc}&action=classement&D1=${d1}&cx_poule=${cx_poule}`;
        const rankingRes = await fetch(rankingUrl);
        const rankingXml = await rankingRes.text();
        const ranking = parseXmlList(rankingXml, 'classement');
        
        return { 
          ...team, 
          phase: currentPhase,
          ranking 
        };
      }
      return { ...team, phase: currentPhase };
    }));

    console.log(`[get-club-results] ${enrichedTeams.length} équipes renvoyées pour la Phase ${currentPhase}`);

    return new Response(JSON.stringify({ teams: enrichedTeams }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error(`[get-club-results] Erreur: ${error.message}`);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
})