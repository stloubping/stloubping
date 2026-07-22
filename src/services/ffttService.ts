import CryptoJS from 'crypto-js';

export interface Player {
  licence: string;
  nom: string;
  prenom: string;
  points: number;
  clast: string;
  cat: string;
  rang?: string;
  source?: string;
}

const APP_ID = "SX046";
const APP_PASSWORD = "NQC2rNs85g";
const CLUB_NUMBER = "10330022";
const CACHE_KEY = "stloub_club_141_members_cache_v4";
const CACHE_TIME_KEY = "stloub_club_141_members_time_v4";
const CACHE_DURATION_MS = 1000 * 60 * 60 * 12; // 12h cache

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
  // 1. Check local cache first
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    const cachedTime = localStorage.getItem(CACHE_TIME_KEY);
    if (cached && cachedTime) {
      const age = Date.now() - parseInt(cachedTime, 10);
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        if (age > CACHE_DURATION_MS) {
          refreshMembersInBackground();
        }
        return parsed;
      }
    }
  } catch (e) {
    // Ignore cache error
  }

  // 2. Fetch fresh members from FFTT Smartping via CORS proxy
  const freshMembers = await fetchFreshClubMembers();
  if (freshMembers.length > 0) {
    saveToCache(freshMembers);
    return freshMembers;
  }

  return [];
}

async function refreshMembersInBackground() {
  try {
    const freshMembers = await fetchFreshClubMembers();
    if (freshMembers.length > 0) {
      saveToCache(freshMembers);
    }
  } catch (e) {
    // Ignore background refresh errors
  }
}

function saveToCache(members: Player[]) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(members));
    localStorage.setItem(CACHE_TIME_KEY, Date.now().toString());
  } catch (e) {
    // Ignore quota errors
  }
}

async function fetchFreshClubMembers(): Promise<Player[]> {
  const tm = getTimestamp();
  const tmc = generateHash(tm);

  const scripts = ['xml_licence_b.php', 'xml_joueur.php'];
  const proxies = [
    (url: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
    (url: string) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
    (url: string) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`,
  ];

  const fetchPromises: Promise<Player[]>[] = [];

  for (const script of scripts) {
    const targetUrl = `https://www.fftt.com/mobile/pxml/${script}?id=${APP_ID}&serie=STLBP2025MEMB1&tm=${tm}&tmc=${tmc}&club=${CLUB_NUMBER}`;
    for (const makeProxy of proxies) {
      fetchPromises.push(
        (async () => {
          const proxyUrl = makeProxy(targetUrl);
          const res = await fetch(proxyUrl, { signal: AbortSignal.timeout(3000) });
          if (!res.ok) throw new Error("HTTP error");
          const xmlText = await res.text();
          const players = parseSmartpingXml(xmlText);
          if (players.length === 0) throw new Error("No players in XML");
          return players;
        })()
      );
    }
  }

  try {
    const result = await Promise.any(fetchPromises);
    return result;
  } catch (e) {
    console.warn("Smartping API fetch failed or timed out:", e);
    return [];
  }
}

function parseSmartpingXml(xmlText: string): Player[] {
  if (!xmlText || !xmlText.includes("<")) return [];
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlText, "text/xml");
  const nodes = Array.from(xmlDoc.querySelectorAll("joueur, licence"));

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

    if (nom || prenom) {
      players.push({
        licence,
        nom: nom.toUpperCase(),
        prenom,
        points,
        clast,
        cat,
        rang,
        source: "FFTT Officiel",
      });
    }
  });

  return players.sort((a, b) => b.points - a.points);
}