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
const SERIE = "STLBP2025PLAY1";

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

    let xml = await callSmartping('xml_joueur.php', { club: CLUB_NUMBER });
    let players = parseXmlList(xml, 'joueur');

    if (players.length === 0) {
      xml = await callSmartping('xml_joueur.php', { numclu: CLUB_NUMBER });
      players = parseXmlList(xml, 'joueur');
    }

    if (players.length === 0) {
      xml = await callSmartping('xml_licence_b.php', { club: CLUB_NUMBER });
      players = parseXmlList(xml, 'licence');
    }

    const formattedPlayers = players.map((p) => {
      const nom = decodeEntities(p.nom || '');
      const prenom = decodeEntities(p.prenom || '');
      const licence = p.licence || '';
      const points = parseFloat(p.point || p.pointm || '500') || 500;
      const clast = p.clast || p.clst || '5';
      const cat = p.cat || '';
      const rang = p.rang || p.clast_glo || '';

      return {
        licence,
        nom,
        prenom,
        points: Math.round(points),
        clast,
        cat,
        rang,
      };
    });

    // Tri par points décroissant
    formattedPlayers.sort((a, b) => b.points - a.points);

    return new Response(JSON.stringify({ players: formattedPlayers, count: formattedPlayers.length }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message, players: [] }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});