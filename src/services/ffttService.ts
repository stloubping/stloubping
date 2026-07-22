import CryptoJS from 'crypto-js';
import { supabase } from '@/integrations/supabase/client';

export interface Player {
  licence: string;
  nom: string;
  prenom: string;
  points: number;
  clast: string;
  cat: string;
  rang?: string;
  source?: string;
  valinit?: number;
  valmen?: number;
  progmens?: number;
  progans?: number;
}

const APP_ID = "SX046";
const APP_PASSWORD = "NQC2rNs85g";
const CLUB_NUMBER = "10330022";
const CACHE_KEY = "stloub_club_players_v7";
const CACHE_TIME_KEY = "stloub_club_players_time_v7";
const CACHE_DURATION_MS = 1000 * 60 * 60 * 2; // Cache 2h

function getTimestamp(): string {
  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}000`;
}

function generateHash(tm: string): string {
  const key = CryptoJS.MD5(APP_PASSWORD).toString();
  return CryptoJS.HmacSHA1(tm, key).toString();
}

export async function fetchClubPlayers(): Promise<Player[]> {
  // 1. Vérification du cache local
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    const cachedTime = localStorage.getItem(CACHE_TIME_KEY);
    if (cached && cachedTime) {
      const age = Date.now() - parseInt(cachedTime, 10);
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        if (age > CACHE_DURATION_MS) {
          refreshInBackground();
        }
        return parsed;
      }
    }
  } catch (e) {
    // Erreur cache ignorée
  }

  // 2. Chargement frais depuis Supabase Edge Function ou Fallback Client
  const freshMembers = await loadFreshData();
  if (freshMembers.length > 0) {
    saveToCache(freshMembers);
    return freshMembers;
  }

  return [];
}

async function refreshInBackground() {
  try {
    const freshMembers = await loadFreshData();
    if (freshMembers.length > 0) {
      saveToCache(freshMembers);
    }
  } catch (e) {
    // Erreur ignorée
  }
}

function saveToCache(members: Player[]) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(members));
    localStorage.setItem(CACHE_TIME_KEY, Date.now().toString());
  } catch (e) {
    // Quota ignoré
  }
}

async function loadFreshData(): Promise<Player[]> {
  // 1. Essai prioritaire via Edge Function Supabase
  try {
    const { data, error } = await supabase.functions.invoke('get-club-players');
    if (!error && data?.players && Array.isArray(data.players) && data.players.length > 0) {
      return data.players;
    }
  } catch (err) {
    console.warn("Edge function get-club-players non disponible, fallback direct FFTT", err);
  }

  // 2. Fallback client direct FFTT avec calcul automatique valinit / valmen
  return await fetchFreshClubMembersFromFFTT();
}

async function fetchFreshClubMembersFromFFTT(): Promise<Player[]> {
  const tm = getTimestamp();
  const tmc = generateHash(tm);

  const targetUrl = `https://www.fftt.com/mobile/pxml/xml_licence_b.php?id=${APP_ID}&serie=STLBP2025MEMB1&tm=${tm}&tmc=${tmc}&club=${CLUB_NUMBER}`;
  
  const proxies = [
    (url: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
    (url: string) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
  ];

  for (const makeProxy of proxies) {
    try {
      const proxyUrl = makeProxy(targetUrl);
      const res = await fetch(proxyUrl, { signal: AbortSignal.timeout(5000) });
      if (res.ok) {
        const xmlText = await res.text();
        const players = parseSmartpingXml(xmlText);
        if (players.length > 0) return players;
      }
    } catch (e) {
      // Suite au proxy suivant
    }
  }

  return [];
}

function parseSmartpingXml(xmlText: string): Player[] {
  if (!xmlText || !xmlText.includes("<")) return [];
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlText, "text/xml");
  const nodes = Array.from(xmlDoc.querySelectorAll("licence, joueur"));

  const players: Player[] = [];
  nodes.forEach((node) => {
    const getVal = (tag: string) => node.querySelector(tag)?.textContent?.trim() || "";
    const nom = getVal("nom");
    const prenom = getVal("prenom");
    const licence = getVal("licence");
    const pointsStr = getVal("point") || getVal("pointm") || "500";
    const points = Math.round(parseFloat(pointsStr) || 500);
    const clast = getVal("clast") || getVal("clst") || Math.floor(points / 100).toString();
    const cat = getVal("cat");
    const rang = getVal("rang") || getVal("clast_glo");

    const valinit = parseFloat(getVal("valinit") || pointsStr);
    const valmen = parseFloat(getVal("valmen") || pointsStr);

    const progmens = Math.round((points - valmen) * 10) / 10;
    const progans = Math.round((points - valinit) * 10) / 10;

    if (nom || prenom) {
      players.push({
        licence,
        nom: nom.toUpperCase(),
        prenom,
        points,
        clast,
        cat,
        rang,
        valinit,
        valmen,
        progmens,
        progans,
        source: "FFTT Direct",
      });
    }
  });

  return players.sort((a, b) => b.points - a.points);
}