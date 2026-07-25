import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import CryptoJS from "https://esm.sh/crypto-js@4.1.1"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const APP_ID = Deno.env.get('FFTT_APP_ID') || "SX046";
const APP_PASSWORD = Deno.env.get('FFTT_APP_PASSWORD') || "NQC2rNs85g";
const CLUB_NUMBER = Deno.env.get('FFTT_CLUB_NUMBER') || "10330022";
const API_BASE_URL = "https://www.fftt.com/mobile/pxml";
const SERIE = Deno.env.get('FFTT_SERIAL') || "STLBP2025MEMB1";

function getTimestamp(): string {
  const now = new Date();
  return `${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}${String(now.getHours()).padStart(2,'0')}${String(now.getMinutes()).padStart(2,'0')}${String(now.getSeconds()).padStart(2,'0')}${String(now.getMilliseconds()).padStart(3,'0')}`;
}

function generateHash(tm: string): string {
  const key = CryptoJS.MD5(APP_PASSWORD).toString();
  return CryptoJS.HmacSHA1(tm, key).toString();
}

async function callSmartping(script: string, params: Record<string, string> = {}): Promise<string> {
  const tm = getTimestamp();
  const tmc = generateHash(tm);
  const queryParams = new URLSearchParams({ id: APP_ID, serie: SERIE, tm, tmc, ...params });
  const url = `${API_BASE_URL}/${script}?${queryParams.toString()}`;
  console.log(`[get-club-players] Appel: ${script}`, params);
  const res = await fetch(url);
  return await res.text();
}

function parseXmlList(xml: string, tagName: string): Record<string, string>[] {
  const results: Record<string, string>[] = [];
  const regex = new RegExp(`<${tagName}>([\\s\\S]*?)<\\/${tagName}>`, 'gi');
  let match;

  while ((match = regex.exec(xml)) !== null) {
    const content = match[1];
    const obj: Record<string, string> = {};
    const openTagRegex = /<(\w+)>/g;
    let tagMatch;
    
    while ((tagMatch = openTagRegex.exec(content)) !== null) {
      const fieldName = tagMatch[1];
      const afterOpenTag = tagMatch.index + tagMatch[0].length;
      const closeTag = `</${fieldName}>`;
      const closeIdx = content.indexOf(closeTag, afterOpenTag);
      
      if (closeIdx !== -1) {
        obj[fieldName] = content.substring(afterOpenTag, closeIdx).trim();
        openTagRegex.lastIndex = closeIdx + closeTag.length;
      }
    }
    results.push(obj);
  }
  return results;
}

function decodeEntities(str: string): string {
  return str
    .replace(/&/g, '&')
    .replace(/</g, '<')
    .replace(/>/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, ' ');
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    await callSmartping('xml_initialisation.php');

    let playersXml = await callSmartping('xml_licence_b.php', { club: CLUB_NUMBER, numclu: CLUB_NUMBER });
    let rawPlayers = parseXmlList(playersXml, 'licence');

    if (rawPlayers.length === 0) {
      playersXml = await callSmartping('xml_joueur_b.php', { club: CLUB_NUMBER, numclu: CLUB_NUMBER });
      rawPlayers = parseXmlList(playersXml, 'joueur');
    }

    const processedPlayers = rawPlayers.map((p) => {
      const nom = decodeEntities(p.nom || '').toUpperCase();
      const prenom = decodeEntities(p.prenom || '');
      const licence = p.licence || p.numlic || '';
      
      const points = Math.round(parseFloat(p.point || p.pointm || '500') || 500);
      const valinit = p.valinit ? Math.round(parseFloat(p.valinit)) : points;
      const valmen = p.valmen ? Math.round(parseFloat(p.valmen)) : points;
      const clast = p.clast || p.clst || Math.floor(points / 100).toString();
      const cat = p.cat || p.categorie || '';

      const progmens = Math.round((points - valmen) * 10) / 10;
      const progans = Math.round((points - valinit) * 10) / 10;

      return {
        licence,
        nom,
        prenom,
        points,
        clast,
        cat,
        valinit,
        valmen,
        progmens,
        progans,
      };
    });

    processedPlayers.sort((a, b) => b.points - a.points);

    return new Response(JSON.stringify({ players: processedPlayers }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message, players: [] }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});