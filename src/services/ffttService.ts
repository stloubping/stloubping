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
  valinit?: number;
  valmen?: number;
  progmens?: number;
  progans?: number;
}

const APP_ID = "SX046";
const APP_PASSWORD = "NQC2rNs85g";
const CLUB_NUMBER = "10330022";
const CACHE_KEY = "stloub_club_players_v8";
const CACHE_TIME_KEY = "stloub_club_players_time_v8";
const CACHE_DURATION_MS = 1000 * 60 * 60 * 2; // Cache de 2 heures

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

  // 2. Chargement frais depuis FFTT + Pingpocket
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
    // Erreur d'écriture ignorée
  }
}

async function loadFreshData(): Promise<Player[]> {
  // 1. Chargement de la liste des joueurs depuis Smartping FFTT
  const ffttPlayers = await fetchFreshClubMembersFromFFTT();

  // 2. Récupération des données de progression Pingpocket
  const pingpocketMap = await fetchAllPingpocketProgressions();

  if (ffttPlayers.length === 0) {
    return [];
  }

  // 3. Fusion des progressions Pingpocket avec les joueurs FFTT
  return ffttPlayers.map(player => {
    const keyLicence = player.licence;
    const keyName = `${player.nom.toLowerCase()}_${player.prenom.toLowerCase()}`;
    
    const pingData = pingpocketMap.get(keyLicence) || pingpocketMap.get(keyName) || findMatchInMap(pingpocketMap, player.nom, player.prenom);

    return {
      ...player,
      progmens: pingData?.progmens ?? player.progmens ?? 0,
      progans: pingData?.progans ?? player.progans ?? 0,
      cat: pingData?.cat || player.cat,
    };
  });
}

function findMatchInMap(map: Map<string, { progmens?: number; progans?: number; cat?: string }>, nom: string, prenom: string) {
  const normNom = nom.toLowerCase().trim();
  const normPrenom = prenom.toLowerCase().trim();

  for (const [k, val] of map.entries()) {
    if (k.includes(normNom) && k.includes(normPrenom)) {
      return val;
    }
  }
  return null;
}

// ----------------------------------------------------------------------
// Fetch FFTT Smartping API
// ----------------------------------------------------------------------
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
      // Proxy suivant
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

// ----------------------------------------------------------------------
// Fetch et Scrape Pingpocket HTML (Mensuel + Annuel)
// ----------------------------------------------------------------------
async function fetchAllPingpocketProgressions(): Promise<Map<string, { progmens?: number; progans?: number; cat?: string }>> {
  const result = new Map<string, { progmens?: number; progans?: number; cat?: string }>();

  const [monthlyHtml, seasonHtml] = await Promise.all([
    fetchPingpocketHtml('MONTHLY_INCREASE'),
    fetchPingpocketHtml('SEASON_INCREASE'),
  ]);

  parseAndMergePingpocketHtml(result, monthlyHtml, 'progmens');
  parseAndMergePingpocketHtml(result, seasonHtml, 'progans');

  return result;
}

async function fetchPingpocketHtml(sortParam: string): Promise<string> {
  const targetUrl = `https://www.pingpocket.fr/app/fftt/clubs/${CLUB_NUMBER}/licencies?SORT=${sortParam}`;
  
  try {
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`;
    const res = await fetch(proxyUrl, { signal: AbortSignal.timeout(6000) });
    if (res.ok) {
      const json = await res.json();
      return json.contents || "";
    }
  } catch (e) {
    console.warn(`Erreur lors de la récupération Pingpocket (${sortParam}) via allorigins:`, e);
  }

  return "";
}

function parseAndMergePingpocketHtml(
  map: Map<string, { progmens?: number; progans?: number; cat?: string }>,
  htmlText: string,
  field: 'progmens' | 'progans'
) {
  if (!htmlText) return;

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlText, "text/html");

    // Extraction des lignes de tableau ou éléments de liste
    const items = Array.from(doc.querySelectorAll("tr, li, .row, .licencie, [class*='licenc']"));

    items.forEach(node => {
      const text = node.textContent || "";
      if (!text || text.length < 5) return;

      // Détection numéro de licence (ex: 3312345)
      const licenceMatch = text.match(/\b\d{6,8}\b/);
      const licence = licenceMatch ? licenceMatch[0] : null;

      // Détection des variations (+12.5, +15, -4, -3.5, etc.)
      const diffMatches = Array.from(text.matchAll(/([+-]\s*\d+(?:[\.,]\d+)?)/g)).map(m => {
        return parseFloat(m[1].replace(',', '.').replace(/\s+/g, ''));
      });

      if (diffMatches.length > 0) {
        const val = diffMatches[0];
        
        if (licence) {
          const current = map.get(licence) || {};
          current[field] = val;
          map.set(licence, current);
        } else {
          // Alternative par nom d'utilisateur
          const cleanKey = text.replace(/\s+/g, ' ').trim().toLowerCase();
          const current = map.get(cleanKey) || {};
          current[field] = val;
          map.set(cleanKey, current);
        }
      }
    });
  } catch (e) {
    console.error("Erreur de parsing HTML Pingpocket:", e);
  }
}