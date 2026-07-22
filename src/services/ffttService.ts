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
const CACHE_KEY = "stloub_club_players_v12";
const CACHE_TIME_KEY = "stloub_club_players_time_v12";
const CACHE_DURATION_MS = 1000 * 60 * 60 * 2; // 2 heures

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
    // Erreur de lecture du cache ignorée
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
    // Erreur écriture ignorée
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

    let progmens = pingData?.progmens ?? player.progmens ?? 0;
    let progans = pingData?.progans ?? player.progans ?? 0;

    // Si la progression est à 0 et qu'il y a une différence valmen / valinit
    if (progmens === 0 && player.valmen && player.valmen !== player.points) {
      progmens = Math.round((player.points - player.valmen) * 10) / 10;
    }
    if (progans === 0 && player.valinit && player.valinit !== player.points) {
      progans = Math.round((player.points - player.valinit) * 10) / 10;
    }

    return {
      ...player,
      progmens,
      progans,
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
    const getVal = (...tags: string[]) => {
      for (const tag of tags) {
        const el = node.querySelector(tag);
        if (el?.textContent?.trim()) return el.textContent.trim();
      }
      return "";
    };

    const nom = getVal("nom", "NOM");
    const prenom = getVal("prenom", "PRENOM");
    const licence = getVal("licence", "LICENCE");
    const pointsStr = getVal("point", "POINT", "pointm", "POINTM") || "500";
    const points = Math.round(parseFloat(pointsStr) || 500);
    const clast = getVal("clast", "CLAST", "clst", "CLST") || Math.floor(points / 100).toString();
    const cat = getVal("cat", "CAT", "categorie");
    const rang = getVal("rang", "RANG", "clast_glo");

    const valinitStr = getVal("valinit", "VALINIT", "init", "pointi");
    const valmenStr = getVal("valmen", "VALMEN", "men", "pointm");

    const valinit = valinitStr ? parseFloat(valinitStr) : points;
    const valmen = valmenStr ? parseFloat(valmenStr) : points;

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
// Fetch et Scrape Pingpocket HTML & JSON (Mensuel + Annuel)
// ----------------------------------------------------------------------
async function fetchAllPingpocketProgressions(): Promise<Map<string, { progmens?: number; progans?: number; cat?: string }>> {
  const result = new Map<string, { progmens?: number; progans?: number; cat?: string }>();

  const [monthlyHtml, seasonHtml] = await Promise.all([
    fetchPingpocketHtml('MONTHLY_INCREASE'),
    fetchPingpocketHtml('SEASON_INCREASE'),
  ]);

  parseAndMergePingpocketContent(result, monthlyHtml, 'progmens');
  parseAndMergePingpocketContent(result, seasonHtml, 'progans');

  return result;
}

async function fetchPingpocketHtml(sortParam: string): Promise<string> {
  const targetUrl = `https://www.pingpocket.fr/app/fftt/clubs/${CLUB_NUMBER}/licencies?SORT=${sortParam}`;
  
  const proxies = [
    `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`,
    `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`
  ];

  for (const proxyUrl of proxies) {
    try {
      const res = await fetch(proxyUrl, { signal: AbortSignal.timeout(6000) });
      if (res.ok) {
        if (proxyUrl.includes('allorigins')) {
          const json = await res.json();
          if (json.contents) return json.contents;
        } else {
          const text = await res.text();
          if (text) return text;
        }
      }
    } catch (e) {
      // Proxy suivant
    }
  }

  return "";
}

function parseAndMergePingpocketContent(
  map: Map<string, { progmens?: number; progans?: number; cat?: string }>,
  rawContent: string,
  field: 'progmens' | 'progans'
) {
  if (!rawContent) return;

  try {
    // 1. Extraction JSON si disponible dans les scripts
    const jsonMatches = rawContent.match(/\{[\s\S]*?"licencies"[\s\S]*?\}/g);
    if (jsonMatches) {
      for (const jsonStr of jsonMatches) {
        try {
          const parsed = JSON.parse(jsonStr);
          const list = parsed.licencies || parsed.players || parsed.items;
          if (Array.isArray(list)) {
            list.forEach((item: any) => {
              const licence = item.licence || item.numlic;
              const val = parseFloat(item.progression || item.diff || item.pointsGained);
              if (licence && !isNaN(val)) {
                const current = map.get(String(licence)) || {};
                current[field] = val;
                if (item.cat || item.category) current.cat = item.cat || item.category;
                map.set(String(licence), current);
              }
            });
          }
        } catch (e) {
          // Inscription JSON ignorée
        }
      }
    }

    // 2. Parsing HTML par DOMParser
    const parser = new DOMParser();
    const doc = parser.parseFromString(rawContent, "text/html");
    const items = Array.from(doc.querySelectorAll("tr, li, .row, .licencie, [class*='licenc']"));

    items.forEach(node => {
      const text = node.textContent || "";
      if (!text || text.length < 5) return;

      const licenceMatch = text.match(/\b\d{6,8}\b/);
      const licence = licenceMatch ? licenceMatch[0] : null;

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
          const cleanKey = text.replace(/\s+/g, ' ').trim().toLowerCase();
          const current = map.get(cleanKey) || {};
          current[field] = val;
          map.set(cleanKey, current);
        }
      }
    });
  } catch (e) {
    console.error("Erreur de parsing Pingpocket:", e);
  }
}