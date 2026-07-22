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

function getTimestamp(): string {
  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}000`;
}

function generateHash(tm: string): string {
  const key = CryptoJS.MD5(APP_PASSWORD).toString();
  return CryptoJS.HmacSHA1(tm, key).toString();
}

function extractXmlTag(xml: string, tag: string): string {
  const match = xml.match(new RegExp(`<${tag}>(.*?)<\/${tag}>`, "i"));
  return match ? match[1].trim() : "";
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

// Scrape Pingpocket HTML depuis le serveur Deno (sans blocage CORS)
async function fetchPingpocketData(sortParam: string): Promise<Map<string, number>> {
  const map = new Map<string, number>();
  try {
    const url = `https://www.pingpocket.fr/app/fftt/clubs/${CLUB_NUMBER}/licencies?SORT=${sortParam}`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      }
    });

    if (!res.ok) return map;

    const html = await res.text();
    
    // Découpage par lignes ou blocs de joueurs
    const lines = html.split(/<\/tr>|<\/li>|<\/div>/i);
    for (const line of lines) {
      const licenceMatch = line.match(/\b\d{6,8}\b/);
      if (!licenceMatch) continue;

      const licence = licenceMatch[0];
      // Cherche une variation de points du style +12.5, +15, -4, -3.5, 12, etc.
      const pointMatches = Array.from(line.matchAll(/([+-]\s*\d+(?:[\.,]\d+)?)/g));
      if (pointMatches.length > 0) {
        const valStr = pointMatches[0][1].replace(',', '.').replace(/\s+/g, '');
        const val = parseFloat(valStr);
        if (!isNaN(val)) {
          map.set(licence, val);
        }
      }
    }
  } catch (e) {
    console.error(`Erreur fetch Pingpocket (${sortParam}):`, e);
  }
  return map;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const tm = getTimestamp();
    const tmc = generateHash(tm);

    // 1. Récupération des joueurs FFTT Smartping
    const ffttUrl = `${API_BASE_URL}/xml_licence_b.php?id=${APP_ID}&serie=STLBP2025MEMB1&tm=${tm}&tmc=${tmc}&club=${CLUB_NUMBER}`;
    const ffttRes = await fetch(ffttUrl);
    const xmlText = await ffttRes.text();
    const ffttList = parseXmlList(xmlText, 'licence');

    // 2. Récupération simultanée des données Pingpocket
    const [monthlyMap, seasonMap] = await Promise.all([
      fetchPingpocketData('MONTHLY_INCREASE'),
      fetchPingpocketData('SEASON_INCREASE'),
    ]);

    // 3. Fusion des données
    const players = ffttList.map((item) => {
      const licence = item.licence || "";
      const points = Math.round(parseFloat(item.point || item.pointm || "500") || 500);
      const valinit = parseFloat(item.valinit || item.point || "500");
      const valmen = parseFloat(item.valmen || item.point || "500");

      // Si Pingpocket a une valeur enregistrée, on l'utilise. Sinon on calcule point - valmen / valinit
      const progmens = monthlyMap.has(licence)
        ? monthlyMap.get(licence)!
        : Math.round((points - valmen) * 10) / 10;

      const progans = seasonMap.has(licence)
        ? seasonMap.get(licence)!
        : Math.round((points - valinit) * 10) / 10;

      return {
        licence,
        nom: (item.nom || "").toUpperCase(),
        prenom: item.prenom || "",
        points,
        clast: item.clast || item.clst || Math.floor(points / 100).toString(),
        cat: item.cat || "",
        rang: item.rang || item.clast_glo || "",
        valinit,
        valmen,
        progmens,
        progans,
      };
    });

    // Tri par points décroissants par défaut
    players.sort((a, b) => b.points - a.points);

    return new Response(JSON.stringify({ players }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message, players: [] }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});