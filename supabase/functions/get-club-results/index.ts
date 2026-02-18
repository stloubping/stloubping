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

    // Initialisation
    await fetch(`${API_BASE_URL}/xml_initialisation.php?id=${APP_ID}&serie=${serie}&tm=${tm}&tmc=${tmc}`);

    // Récupération des équipes (Type A = Masculin + Féminin)
    const teamsUrl = `${API_BASE_URL}/xml_equipe.php?id=${APP_ID}&serie=${serie}&tm=${tm}&tmc=${tmc}&numclu=${CLUB_NUMBER}&type=A`;
    const teamsRes = await fetch(teamsUrl);
    const teamsXml = await teamsRes.text();
    const allTeams = parseXmlList(teamsXml, 'equipe');

    const currentPhase = getCurrentPhase();
    
    // Filtrage par phase et par type d'épreuve (Championnat)
    const filteredTeams = allTeams.filter(team => {
      const lib = (team.libepr || "").toLowerCase();
      const div = (team.libdivision || "").toLowerCase();
      const combined = `${lib} ${div}`;

      if (!combined.includes("championnat")) return false;

      if (combined.includes(`phase ${currentPhase}`) || combined.includes(`ph ${currentPhase}`)) {
        return true;
      }

      if (currentPhase === "2" && (combined.includes("phase 1") || combined.includes("ph 1"))) {
        return false;
      }

      if (currentPhase === "1" && (combined.includes("phase 2") || combined.includes("ph 2"))) {
        return false;
      }

      return true;
    });

    // Enrichissement avec les classements
    const enrichedTeams = await Promise.all(filteredTeams.map(async (team) => {
      const lien = (team.liendivision || '').replace(/&/g, '&');
      const params: Record<string, string> = {};
      lien.split('&').forEach((part: string) => {
        const [key, value] = part.split('=');
        if (key && value) params[key.trim()] = value.trim();
      });

      if (params.D1) {
        const rankingUrl = `${API_BASE_URL}/xml_result_equ.php?id=${APP_ID}&serie=${serie}&tm=${tm}&tmc=${tmc}&action=classement&auto=1&D1=${params.D1}${params.cx_poule ? `&cx_poule=${params.cx_poule}` : ''}`;
        const rankingRes = await fetch(rankingUrl);
        const rankingXml = await rankingRes.text();
        const ranking = parseXmlList(rankingXml, 'classement');
        
        return { ...team, phase: currentPhase, ranking };
      }
      return { ...team, phase: currentPhase };
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