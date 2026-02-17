import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import CryptoJS from "https://esm.sh/crypto-js@4.1.1"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const APP_ID = "SX046";
const APP_PASSWORD = "NQC2rNs85g";
const CLUB_NUMBER = "10330022";
const API_BASE_URL = "http://www.fftt.com/mobile/pxml";

function getTimestamp() {
  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');
  const ms = now.getMilliseconds().toString().padStart(3, '0');
  return `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}${ms}`;
}

function generateSmartpingHash(tm: string) {
  const passwordMd5 = CryptoJS.MD5(APP_PASSWORD).toString();
  const hash = CryptoJS.HmacSHA1(tm, passwordMd5).toString();
  return hash;
}

function parseXmlList(xml: string, tagName: string) {
  const regex = new RegExp(`<${tagName}>([\\s\\S]*?)<\\/${tagName}>`, 'g');
  const results = [];
  let match;
  while ((match = regex.exec(xml)) !== null) {
    const content = match[1];
    const obj: any = {};
    // Regex améliorée pour capturer le contenu des balises
    const tagRegex = /<([\w]+)>([\s\S]*?)<\/\1>/g;
    let tagMatch;
    while ((tagMatch = tagRegex.exec(content)) !== null) {
      obj[tagMatch[1]] = tagMatch[2].trim();
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
    const serie = "STLB" + Math.random().toString(36).substring(2, 13).toUpperCase();

    // 1. Initialisation
    await fetch(`${API_BASE_URL}/xml_initialisation.php?id=${APP_ID}&serie=${serie}&tm=${tm}&tmc=${tmc}`);

    // 2. Récupérer les équipes
    const teamsUrl = `${API_BASE_URL}/xml_equipe.php?id=${APP_ID}&serie=${serie}&tm=${tm}&tmc=${tmc}&numclu=${CLUB_NUMBER}&type=A`;
    const teamsRes = await fetch(teamsUrl);
    const teamsXml = await teamsRes.text();
    const teams = parseXmlList(teamsXml, 'equipe');

    console.log(`[get-club-results] ${teams.length} équipes trouvées. Tentative de récupération des classements...`);

    // 3. Enrichir avec les classements
    const enrichedTeams = await Promise.all(teams.map(async (team) => {
      // IMPORTANT : Remplacer les entités HTML pour que URLSearchParams fonctionne
      const rawLink = team.liendivision || "";
      const decodedLink = rawLink.replace(/&/g, '&');
      
      const queryString = decodedLink.includes('?') ? decodedLink.split('?')[1] : decodedLink;
      const params = new URLSearchParams(queryString);
      
      const d1 = params.get('D1');
      const cx_poule = params.get('cx_poule');

      if (d1 && cx_poule) {
        const rankingUrl = `${API_BASE_URL}/xml_result_equ.php?id=${APP_ID}&serie=${serie}&tm=${tm}&tmc=${tmc}&action=classement&D1=${d1}&cx_poule=${cx_poule}`;
        const rankingRes = await fetch(rankingUrl);
        const rankingXml = await rankingRes.text();
        
        // On cherche la balise <classement>
        const ranking = parseXmlList(rankingXml, 'classement');
        console.log(`[get-club-results] Classement pour ${team.libequipe} : ${ranking.length} lignes trouvées.`);
        
        return { ...team, ranking };
      }
      
      console.warn(`[get-club-results] Paramètres manquants pour ${team.libequipe} (Lien: ${decodedLink})`);
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