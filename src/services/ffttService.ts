import CryptoJS from "crypto-js";
import { defaultPlayersData } from "@/data/playersData";

export interface Player {
  licence: string;
  nom: string;
  prenom: string;
  points: number;
  clast: string;
  cat: string;
  rang?: string;
  valinit?: number;
  valmen?: number;
  progmens?: number;
  progans?: number;
}

const APP_ID = import.meta.env.VITE_FFTT_APP_ID || "SX046";
const APP_PASSWORD = import.meta.env.VITE_FFTT_APP_PASSWORD || "NQC2rNs85g";
const SERIAL = import.meta.env.VITE_FFTT_SERIAL || "STLBP2025MEMB1";
const CLUB_NUMBER = import.meta.env.VITE_FFTT_CLUB_NUMBER || "10330022";
const API_BASE_URL = "https://www.fftt.com/mobile/pxml";

const CACHE_KEY = "stloub_club_players_v26_real";

function getTimestamp(): string {
  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}000`;
}

function generateHash(tm: string): string {
  const key = CryptoJS.MD5(APP_PASSWORD).toString();
  return CryptoJS.HmacSHA1(tm, key).toString();
}

function decodeEntities(str: string): string {
  return str
    .replace(/&/g, '&')
    .replace(/</g, '<')
    .replace(/>/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, ' ');
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

async function fetchWithTimeout(url: string, timeoutMs = 2500): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(id);
    return response;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
}

async function fetchDirectSmartping(): Promise<Player[] | null> {
  const tm = getTimestamp();
  const tmc = generateHash(tm);

  const queryParams = new URLSearchParams({ 
    id: APP_ID, 
    serie: SERIAL, 
    tm, 
    tmc, 
    club: CLUB_NUMBER, 
    numclu: CLUB_NUMBER 
  });
  
  const rawUrl = `${API_BASE_URL}/xml_licence_b.php?${queryParams.toString()}`;
  
  const proxies = [
    `https://corsproxy.io/?${encodeURIComponent(rawUrl)}`,
    `https://api.allorigins.win/raw?url=${encodeURIComponent(rawUrl)}`,
    `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(rawUrl)}`
  ];

  for (const proxyUrl of proxies) {
    try {
      const res = await fetchWithTimeout(proxyUrl, 2500);
      if (res.ok) {
        const text = await res.text();
        const rawPlayers = parseXmlList(text, 'licence');

        if (rawPlayers.length > 0) {
          const processed: Player[] = rawPlayers.map((p) => {
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

            return { licence, nom, prenom, points, clast, cat, valinit, valmen, progmens, progans };
          });

          processed.sort((a, b) => b.points - a.points);
          return processed;
        }
      }
    } catch (e) {}
  }
  return null;
}

export async function fetchClubPlayers(): Promise<Player[]> {
  // 1. Tente l'accès direct Smartping FFTT
  try {
    const livePlayers = await fetchDirectSmartping();
    if (livePlayers && livePlayers.length > 0) {
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(livePlayers));
      } catch (e) {}
      return livePlayers;
    }
  } catch (e) {}

  // 2. Si disponible en cache local, renvoie la sauvegarde
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {}

  // 3. Fallback immédiat sur les vrais licenciés du St Loub Ping (10330022)
  return [...defaultPlayersData].sort((a, b) => b.points - a.points);
}