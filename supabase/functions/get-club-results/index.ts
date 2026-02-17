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
      // Décodage plus complet des entités XML/HTML courantes
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

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const tm = getTimestamp();
    const tmc = generateSmartpingHash(tm);
    const serie = "STLB" + Math.random().toString(36).substring(2, 13).toUpperCase().padEnd(11, 'X');

    // 1. Initialisation
    await fetch(`${API_BASE_URL}/xml_initialisation.php?id=${APP_ID}&serie=${serie}&tm=${tm}&tmc=${tmc}`);

    // 2. Récupérer les équipes
    const teamsUrl = `${API_BASE_URL}/xml_equipe.php?id=${APP_ID}&serie=${serie}&tm=${tm}&tmc=${tmc}&numclu=${CLUB_NUMBER}&type=A`;
    const teamsRes = await fetch(teamsUrl);
    const teamsXml = await teamsRes.text();
    const allTeams = parseXmlList(teamsXml, 'equipe');

    // FILTRE HYBRIDE
    const phase2Teams = allTeams.filter(team => {
      const lib = (team.libepr || "").toLowerCase();
      const div = (team.libdivision || "").toLowerCase();
      const fullText = `${lib} ${div}`;
      
      // Détection large de la Phase 2 (accepte "Phase 2", "Ph 2", "2ème Phase", etc.)
      const isExplicitP2 = /phase.*2|ph.*2|2.*phase|2.*eme|2.*ème/.test(fullText);
      
      // Détection large de la Phase 1 pour l'exclure
      const isExplicitP1 = /phase.*1|ph.*1|1.*phase|1.*ere|1.*ère/.test(fullText);
      
      if (isExplicitP2) return true;
      if (isExplicitP1) return false;
      
      // Si aucune phase n'est mentionnée (cas de certaines départementales), 
      // on garde si c'est un championnat et qu'on n'a pas détecté de Phase 1.
      return fullText.includes("championnat");
    });

    console.log(`[get-club-results] ${phase2Teams.length} équipes retenues.`);

    // 3. Enrichir avec les classements
    const enrichedTeams = await Promise.all(phase2Teams.map(async (team) => {
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
        
        if (ranking.length === 0) {
          const altUrl = `${API_BASE_URL}/xml_result_equ.php?id=${APP_ID}&serie=${serie}&tm=${tm}&tmc=${tmc}&D1=${d1}&cx_poule=${cx_poule}`;
          const altRes = await fetch(altUrl);
          const altXml = await altRes.text();
          const altRanking = parseXmlList(altXml, 'classement');
          return { ...team, ranking: altRanking };
        }

        return { ...team, ranking };
      }
      return team;
    }));

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