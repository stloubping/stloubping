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

const APP_ID = "SX046";
const APP_PASSWORD = "NQC2rNs85g";
const CLUB_NUMBER = "10330022";
const API_BASE_URL = "https://www.fftt.com/mobile/pxml";
const SERIE = "STLBP2025MEMB1";

const CACHE_KEY = "stloub_club_players_v20";
const CACHE_TIME_KEY = "stloub_club_players_time_v20";
const CACHE_DURATION_MS = 1000 * 60 * 60 * 2; // 2 heures

function getTimestamp(): string {
  const now = new Date();
  return `${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}${String(now.getHours()).padStart(2,'0')}${String(now.getMinutes()).padStart(2,'0')}${String(now.getSeconds()).padStart(2,'0')}${String(now.getMilliseconds()).padStart(3,'0')}`;
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

async function fetchSmartpingXml(script: string, params: Record<string, string> = {}): Promise<string> {
  const tm = getTimestamp();
  const tmc = generateHash(tm);
  const queryParams = new URLSearchParams({ id: APP_ID, serie: SERIE, tm, tmc, ...params });
  const rawUrl = `${API_BASE_URL}/${script}?${queryParams.toString()}`;

  // Utilisation de proxies CORS pour les requêtes client directes vers l'API FFTT
  const proxies = [
    `https://api.allorigins.win/raw?url=${encodeURIComponent(rawUrl)}`,
    `https://corsproxy.io/?${encodeURIComponent(rawUrl)}`,
    rawUrl
  ];

  for (const proxyUrl of proxies) {
    try {
      const res = await fetch(proxyUrl, { headers: { 'Accept': 'text/xml, application/xml, text/plain' } });
      if (res.ok) {
        const text = await res.text();
        if (text && text.includes("xml")) {
          return text;
        }
      }
    } catch (e) {
      // essayer le proxy suivant
    }
  }
  return "";
}

export async function fetchClubPlayers(): Promise<Player[]> {
  // 1. Vérification du cache local
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    const cachedTime = localStorage.getItem(CACHE_TIME_KEY);
    if (cached && cachedTime) {
      const age = Date.now() - parseInt(cachedTime, 10);
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0 && age < CACHE_DURATION_MS) {
        return parsed;
      }
    }
  } catch (e) {}

  // 2. Appel Smartping FFTT
  try {
    let playersXml = await fetchSmartpingXml('xml_licence_b.php', { club: CLUB_NUMBER, numclu: CLUB_NUMBER });
    let rawPlayers = parseXmlList(playersXml, 'licence');

    if (rawPlayers.length === 0) {
      playersXml = await fetchSmartpingXml('xml_joueur_b.php', { club: CLUB_NUMBER, numclu: CLUB_NUMBER });
      rawPlayers = parseXmlList(playersXml, 'joueur');
    }

    if (rawPlayers.length > 0) {
      const processedPlayers: Player[] = rawPlayers.map((p) => {
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
      saveToCache(processedPlayers);
      return processedPlayers;
    }
  } catch (err) {
    console.warn("Erreur chargement Smartping client:", err);
  }

  // 3. Fallback cache / données par défaut
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {}

  return defaultPlayersData;
}

function saveToCache(members: Player[]) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(members));
    localStorage.setItem(CACHE_TIME_KEY, Date.now().toString());
  } catch (e) {}
}