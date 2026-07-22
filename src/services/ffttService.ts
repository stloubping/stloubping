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
const CACHE_KEY = "stloub_club_players_pingpocket_v6";
const CACHE_TIME_KEY = "stloub_club_players_time_v6";
const CACHE_DURATION_MS = 1000 * 60 * 60 * 6; // Cache 6h

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
  // 1. Verification du cache local
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
    // Erreur cache ignoree
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
    // Ignore error
  }
}

function saveToCache(members: Player[]) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(members));
    localStorage.setItem(CACHE_TIME_KEY, Date.now().toString());
  } catch (e) {
    // Ignore quota error
  }
}

async function loadFreshData(): Promise<Player[]> {
  // Charge la liste de base FFTT Smartping
  const ffttPlayers = await fetchFreshClubMembersFromFFTT();
  
  // Tente d'extraire la progression exacte sur Pingpocket
  const pingpocketData = await fetchPingpocketProgressions();

  if (pingpocketData.size > 0 && ffttPlayers.length > 0) {
    // Fusionne la progression Pingpocket dans les joueurs FFTT
    return ffttPlayers.map(player => {
      const pingData = pingpocketData.get(player.licence) || 
                       pingpocketData.get(`${player.nom}_${player.prenom}`) ||
                       findMatchByName(pingpocketData, player.nom, player.prenom);

      return {
        ...player,
        progmens: pingData?.progmens ?? player.progmens ?? 0,
        progans: pingData?.progans ?? player.progans ?? 0,
        cat: pingData?.cat || player.cat,
      };
    });
  }

  return ffttPlayers;
}

function findMatchByName(pingMap: Map<string, any>, nom: string, prenom: string) {
  const normNom = nom.toLowerCase().trim();
  const normPrenom = prenom.toLowerCase().trim();

  for (const [key, val] of pingMap.entries()) {
    if (key.includes(normNom) && key.includes(normPrenom)) {
      return val;
    }
  }
  return null;
}

// ----------------------------------------------------------------------
// Fetch FFTT Smartping
// ----------------------------------------------------------------------
async function fetchFreshClubMembersFromFFTT(): Promise<Player[]> {
  const tm = getTimestamp();
  const tmc = generateHash(tm);

  const scripts = ['xml_licence_b.php', 'xml_joueur.php'];
  const proxies = [
    (url: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
    (url: string) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
  ];

  for (const script of scripts) {
    const targetUrl = `https://www.fftt.com/mobile/pxml/${script}?id=${APP_ID}&serie=STLBP2025MEMB1&tm=${tm}&tmc=${tmc}&club=${CLUB_NUMBER}`;
    for (const makeProxy of proxies) {
      try {
        const proxyUrl = makeProxy(targetUrl);
        const res = await fetch(proxyUrl, { signal: AbortSignal.timeout(4000) });
        if (res.ok) {
          const xmlText = await res.text();
          const players = parseSmartpingXml(xmlText);
          if (players.length > 0) return players;
        }
      } catch (e) {
        // Essayons le suivant
      }
    }
  }

  return [];
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
        progmens: 0,
        progans: 0,
        source: "FFTT + Pingpocket",
      });
    }
  });

  return players.sort((a, b) => b.points - a.points);
}

// ----------------------------------------------------------------------
// Fetch et Scrape Pingpocket HTML
// ----------------------------------------------------------------------
async function fetchPingpocketProgressions(): Promise<Map<string, { progmens?: number; progans?: number; cat?: string }>> {
  const map = new Map<string, { progmens?: number; progans?: number; cat?: string }>();

  const urls = [
    `https://www.pingpocket.fr/app/fftt/clubs/${CLUB_NUMBER}/licencies?SORT=MONTHLY_INCREASE`,
    `https://www.pingpocket.fr/app/fftt/clubs/${CLUB_NUMBER}/licencies?SORT=SEASON_INCREASE`,
    `https://www.pingpocket.fr/app/fftt/clubs/${CLUB_NUMBER}/licencies`
  ];

  const proxies = [
    (url: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
    (url: string) => `https://corsproxy.io/?${encodeURIComponent(url)}`
  ];

  for (const targetUrl of urls) {
    const isMonthly = targetUrl.includes("MONTHLY_INCREASE");
    const isSeason = targetUrl.includes("SEASON_INCREASE");

    for (const makeProxy of proxies) {
      try {
        const res = await fetch(makeProxy(targetUrl), { signal: AbortSignal.timeout(4000) });
        if (res.ok) {
          const html = await res.text();
          const parsedData = parsePingpocketHtml(html, isMonthly, isSeason);
          
          parsedData.forEach((val, key) => {
            const existing = map.get(key) || {};
            if (val.progmens !== undefined) existing.progmens = val.progmens;
            if (val.progans !== undefined) existing.progans = val.progans;
            if (val.cat) existing.cat = val.cat;
            map.set(key, existing);
          });
          break; // Proxy a reussi, passer a l'URL suivante
        }
      } catch (e) {
        // Continuons
      }
    }
  }

  return map;
}

function parsePingpocketHtml(htmlText: string, isMonthly: boolean, isSeason: boolean) {
  const result = new Map<string, { progmens?: number; progans?: number; cat?: string }>();
  if (!htmlText) return result;

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlText, "text/html");
    const rows = Array.from(doc.querySelectorAll("tr, .row, li, .licencie-item"));

    rows.forEach(row => {
      const text = row.textContent || "";
      
      // Recherche de numero de licence (ex: 3312345 ou 10330022)
      const licenceMatch = text.match(/\b\d{6,8}\b/);
      const licence = licenceMatch ? licenceMatch[0] : null;

      // Recherche des variations (+12.5, -5, +42...)
      const diffMatches = Array.from(text.matchAll(/([+-]\s*\d+(?:[\.,]\d+)?)/g)).map(m => {
        return parseFloat(m[1].replace(',', '.').replace(/\s+/g, ''));
      });

      if (licence && diffMatches.length > 0) {
        const val = diffMatches[0];
        if (isMonthly) {
          result.set(licence, { progmens: val });
        } else if (isSeason) {
          result.set(licence, { progans: val });
        }
      } else {
        // Extraction par Nom / Prenom si pas de licence claire
        const cleanText = text.replace(/\s+/g, ' ').trim().toLowerCase();
        if (diffMatches.length > 0 && cleanText.length > 5) {
          result.set(cleanText, {
            progmens: isMonthly ? diffMatches[0] : undefined,
            progans: isSeason ? diffMatches[0] : undefined,
          });
        }
      }
    });
  } catch (e) {
    // Erreur de parse HTML
  }

  return result;
}