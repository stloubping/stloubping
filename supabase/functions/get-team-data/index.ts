import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import CryptoJS from "https://esm.sh/crypto-js@4.1.1"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const APP_ID = "SX046";
const APP_PASSWORD = "NQC2rNs85g";
const API_BASE_URL = "https://www.fftt.com/wp-content/plugins/fftt-api/api.php";
const CLUB_NUMBER = "10330022";

function getTimestamp() {
  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}000`;
}

function generateSmartpingHash(serie: string) {
  const passwordMd5 = CryptoJS.MD5(APP_PASSWORD).toString();
  return CryptoJS.HmacSHA1(serie, passwordMd5).toString();
}

function extractXmlTags(xml: string, tagName: string) {
  const regex = new RegExp(`<${tagName}>(.*?)<\/${tagName}>`, 'gs');
  const matches = [];
  let match;
  while ((match = regex.exec(xml)) !== null) {
    matches.push(match[1].trim());
  }
  return matches;
}

function extractSingleTag(xml: string, tagName: string) {
  const match = xml.match(new RegExp(`<${tagName}>(.*?)<\/${tagName}>`, 's'));
  return match ? match[1].trim() : "";
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    console.log("[get-team-data] Début de la récupération des données...");
    const serie = getTimestamp();
    const tm = generateSmartpingHash(serie);

    // 1. Récupérer la liste des équipes du club
    const teamsUrl = `${API_BASE_URL}?id=${APP_ID}&serie=${serie}&tm=${tm}&action=xml_equipe&numclu=${CLUB_NUMBER}&type=M`;
    const teamsRes = await fetch(teamsUrl);
    const teamsXml = await teamsRes.text();
    
    const teamBlocks = teamsXml.match(/<equipe>.*?<\/equipe>/gs) || [];
    
    const teams = await Promise.all(teamBlocks.map(async (block) => {
      const libequipe = extractSingleTag(block, "libequipe");
      const liendivision = extractSingleTag(block, "liendivision");
      
      // Pour chaque équipe, on récupère son classement
      // On doit extraire les paramètres de liendivision (cx_poule, etc.)
      const params = new URLSearchParams(liendivision.split('?')[1]);
      const resserie = getTimestamp();
      const restm = generateSmartpingHash(resserie);
      
      const rankingUrl = `${API_BASE_URL}?id=${APP_ID}&serie=${resserie}&tm=${restm}&action=xml_classement&${params.toString()}`;
      const rankingRes = await fetch(rankingUrl);
      const rankingXml = await rankingRes.text();
      
      const rankingBlocks = rankingXml.match(/<classement>.*?<\/classement>/gs) || [];
      const ranking = rankingBlocks.map(rBlock => ({
        poule: extractSingleTag(rBlock, "poule"),
        clast: extractSingleTag(rBlock, "clast"),
        equipe: extractSingleTag(rBlock, "equipe"),
        joue: extractSingleTag(rBlock, "joue"),
        pts: extractSingleTag(rBlock, "pts"),
        vic: extractSingleTag(rBlock, "vic"),
        nul: extractSingleTag(rBlock, "nul"),
        def: extractSingleTag(rBlock, "def"),
      }));

      return {
        name: libequipe,
        division: extractSingleTag(block, "libdivision"),
        ranking: ranking
      };
    }));

    console.log(`[get-team-data] ${teams.length} équipes récupérées.`);

    return new Response(JSON.stringify(teams), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error(`[get-team-data] Erreur: ${error.message}`);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
})