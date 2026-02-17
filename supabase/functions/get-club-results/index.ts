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

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const tm = getTimestamp();
    const tmc = generateSmartpingHash(tm);
    const serie = "STLB" + Math.random().toString(36).substring(2, 13).toUpperCase().padEnd(11, 'X');

    await fetch(`${API_BASE_URL}/xml_initialisation.php?id=${APP_ID}&serie=${serie}&tm=${tm}&tmc=${tmc}`);

    const teamsUrl = `${API_BASE_URL}/xml_equipe.php?id=${APP_ID}&serie=${serie}&tm=${tm}&tmc=${tmc}&numclu=${CLUB_NUMBER}&type=A`;
    const teamsRes = await fetch(teamsUrl);
    const teamsXml = await teamsRes.text();
    const allTeams = parseXmlList(teamsXml, 'equipe');

    // Filtrage et détection de phase améliorée
    const processedTeams = allTeams
      .filter(t => (t.libepr || "").toLowerCase().includes("championnat"))
      .map(team => {
        const lib = (team.libepr || "").toLowerCase();
        const div = (team.libdivision || "").toLowerCase();
        const fullText = `${div} ${lib}`; // Priorité au texte de la division
        
        let phase = "2"; // Par défaut Phase 2 (actuelle)

        // 1. Détection par mots clés explicites
        if (/phase.*2|ph.*2|2.*phase|2.*eme|2.*ème/.test(fullText)) {
          phase = "2";
        }
        else if (/phase.*1|ph.*1|1.*phase|1.*ere|1.*ère/.test(fullText)) {
          phase = "1";
        }
        // 2. Détection par année si le mot "Phase" est absent
        else if (fullText.includes("2024") && !fullText.includes("2025")) {
          phase = "1";
        }
        else if (fullText.includes("2025")) {
          phase = "2";
        }

        return { ...team, phase };
      });

    // Nettoyage des doublons : on ne garde qu'une seule fois la même équipe par phase
    const uniqueTeams = processedTeams.filter((team, index, self) =>
      index === self.findIndex((t) => (
        t.libequipe === team.libequipe && 
        t.phase === team.phase
      ))
    );

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