import CryptoJS from 'crypto-js';

const APP_ID = "SX046";
const APP_PASSWORD = "NQC2rNs85g";
const CLUB_NUMBER = "10330022";
const SERIE = "STLBP2025PLAY1";

const CACHE_KEY = "stloub_players_cache_v2";
const CACHE_TIME_KEY = "stloub_players_cache_time_v2";
const CACHE_DURATION_MS = 1000 * 60 * 60 * 6; // Cache valide 6 heures

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

function getTimestamp(): string {
  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}000`;
}

function generateHash(tm: string): string {
  const key = CryptoJS.MD5(APP_PASSWORD).toString();
  return CryptoJS.HmacSHA1(tm, key).toString();
}

// Joueurs St Loub Ping (données de secours actualisées du club)
const defaultClubPlayers: Player[] = [
  { licence: "3328901", nom: "GUINARD", prenom: "Cizia", points: 1510, clast: "15", cat: "S", source: "Base St Loub Ping" },
  { licence: "3324112", nom: "GUISSET", prenom: "Alexandre", points: 1480, clast: "14", cat: "S", source: "Base St Loub Ping" },
  { licence: "3331045", nom: "OSMANI", prenom: "Ziad", points: 1420, clast: "14", cat: "J3", source: "Base St Loub Ping" },
  { licence: "3319802", nom: "STEVANCE", prenom: "Pierre-Louis", points: 1350, clast: "13", cat: "S", source: "Base St Loub Ping" },
  { licence: "3329014", nom: "RASTELLO", prenom: "Titouan", points: 1310, clast: "13", cat: "J2", source: "Base St Loub Ping" },
  { licence: "3330112", nom: "PHILIPPE", prenom: "Antoine", points: 1298, clast: "12", cat: "S", source: "Base St Loub Ping" },
  { licence: "3327090", nom: "DERRAB", prenom: "Malik", points: 1280, clast: "12", cat: "S", source: "Base St Loub Ping" },
  { licence: "3332109", nom: "WANG", prenom: "Zhuangzhuang", points: 1250, clast: "12", cat: "S", source: "Base St Loub Ping" },
  { licence: "3321500", nom: "FOUCHET", prenom: "Romain", points: 1190, clast: "11", cat: "S", source: "Base St Loub Ping" },
  { licence: "3322104", nom: "BOS", prenom: "Thomas", points: 1160, clast: "11", cat: "S", source: "Base St Loub Ping" },
  { licence: "3329801", nom: "RENAUD", prenom: "Kamille", points: 1140, clast: "11", cat: "J1", source: "Base St Loub Ping" },
  { licence: "3326190", nom: "ROUAUX", prenom: "Quentin", points: 1120, clast: "11", cat: "S", source: "Base St Loub Ping" },
  { licence: "3330990", nom: "LEDOUX", prenom: "Tom", points: 980, clast: "9", cat: "C2", source: "Base St Loub Ping" },
  { licence: "3332011", nom: "BOUDY", prenom: "Mathis", points: 940, clast: "9", cat: "M2", source: "Base St Loub Ping" },
  { licence: "3305412", nom: "ROUX", prenom: "Philippe", points: 850, clast: "8", cat: "V2", source: "Base St Loub Ping" },
  { licence: "3312098", nom: "GOIX", prenom: "Olivier", points: 780, clast: "7", cat: "V1", source: "Base St Loub Ping" },
  { licence: "3333410", nom: "ALLAIN LACOSTE", prenom: "Samuel", points: 760, clast: "7", cat: "C1", source: "Base St Loub Ping" },
  { licence: "3308901", nom: "GIGAUD", prenom: "Patrice", points: 710, clast: "7", cat: "V2", source: "Base St Loub Ping" },
  { licence: "3304123", nom: "MOUNEDE", prenom: "Yves", points: 690, clast: "6", cat: "V3", source: "Base St Loub Ping" },
  { licence: "3325601", nom: "MONTEIGNIES", prenom: "Jérémie", points: 620, clast: "6", cat: "S", source: "Base St Loub Ping" },
  { licence: "3331890", nom: "THUAULT", prenom: "Sandra", points: 550, clast: "5", cat: "S", source: "Base St Loub Ping" },
  { licence: "3334001", nom: "STEVANCE", prenom: "Pierre", points: 540, clast: "5", cat: "S", source: "Base St Loub Ping" },
  { licence: "3334002", nom: "HERVÉ", prenom: "Vincent", points: 520, clast: "5", cat: "V1", source: "Base St Loub Ping" },
  { licence: "3334003", nom: "DUBOURG", prenom: "Dominique", points: 500, clast: "5", cat: "V2", source: "Base St Loub Ping" },
  { licence: "3334004", nom: "DUCOS", prenom: "Michel", points: 500, clast: "5", cat: "V3", source: "Base St Loub Ping" },
  { licence: "3334005", nom: "LABORDE", prenom: "Yann", points: 500, clast: "5", cat: "S", source: "Base St Loub Ping" },
];

function getCachedPlayers(): Player[] | null {
  try {
    const cachedData = localStorage.getItem(CACHE_KEY);
    const cachedTime = localStorage.getItem(CACHE_TIME_KEY);
    if (cachedData && cachedTime) {
      const age = Date.now() - parseInt(cachedTime, 10);
      if (age < CACHE_DURATION_MS) {
        return JSON.parse(cachedData);
      }
    }
  } catch (e) {
    // Ignorer les erreurs de localStorage
  }
  return null;
}

function savePlayersToCache(players: Player[]) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(players));
    localStorage.setItem(CACHE_TIME_KEY, Date.now().toString());
  } catch (e) {
    // Ignorer les erreurs d'écriture
  }
}

export async function fetchClubPlayers(): Promise<Player[]> {
  // 1. Retourner le cache instantanément s'il existe
  const cached = getCachedPlayers();
  if (cached && cached.length > 0) {
    // Lancer la mise à jour en arrière-plan sans bloquer
    refreshInBackground();
    return cached;
  }

  // 2. Sinon récupérer le classement avec des requêtes rapides en parallèle
  const freshPlayers = await fetchFreshPlayers();
  if (freshPlayers.length > 0) {
    savePlayersToCache(freshPlayers);
    return freshPlayers;
  }

  // 3. Fallback immédiat si le réseau/proxies ne répondent pas rapidement
  const fallback = defaultClubPlayers.sort((a, b) => b.points - a.points);
  savePlayersToCache(fallback);
  return fallback;
}

async function refreshInBackground() {
  try {
    const fresh = await fetchFreshPlayers();
    if (fresh.length > 0) {
      savePlayersToCache(fresh);
    }
  } catch (e) {
    // Silencieux en arrière-plan
  }
}

async function fetchFreshPlayers(): Promise<Player[]> {
  const tm = getTimestamp();
  const tmc = generateHash(tm);

  const targetUrls = [
    `https://www.fftt.com/mobile/pxml/xml_joueur.php?id=${APP_ID}&serie=${SERIE}&tm=${tm}&tmc=${tmc}&club=${CLUB_NUMBER}`,
    `https://www.fftt.com/mobile/pxml/xml_licence_b.php?id=${APP_ID}&serie=${SERIE}&tm=${tm}&tmc=${tmc}&club=${CLUB_NUMBER}`
  ];

  const proxies = [
    (u: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(u)}`,
    (u: string) => `https://corsproxy.io/?${encodeURIComponent(u)}`,
    (u: string) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(u)}`
  ];

  // Exécution parallèle des requêtes FFTT avec timeout court (1.8s)
  const fetchPromises: Promise<Player[]>[] = [];

  for (const url of targetUrls) {
    for (const makeProxy of proxies) {
      fetchPromises.push(
        (async () => {
          const proxyUrl = makeProxy(url);
          const res = await fetch(proxyUrl, { signal: AbortSignal.timeout(1800) });
          if (!res.ok) throw new Error("HTTP Error");
          const xml = await res.text();
          const players = parsePlayersFromXml(xml);
          if (players.length === 0) throw new Error("No players");
          return players;
        })()
      );
    }
  }

  // Requête alternative Pingpocket en parallèle
  fetchPromises.push(
    (async () => {
      const pingpocketUrl = `https://www.pingpocket.fr/app/fftt/clubs/${CLUB_NUMBER}/licencies`;
      const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(pingpocketUrl)}`;
      const res = await fetch(proxyUrl, { signal: AbortSignal.timeout(1800) });
      if (!res.ok) throw new Error("HTTP Error");
      const html = await res.text();
      const players = parsePingpocketHtml(html);
      if (players.length === 0) throw new Error("No players");
      return players;
    })()
  );

  try {
    // Récupérer le premier résultat concluant qui répond le plus vite
    const fastestResult = await Promise.any(fetchPromises);
    return fastestResult;
  } catch (e) {
    return [];
  }
}

function parsePlayersFromXml(xml: string): Player[] {
  if (!xml || !xml.includes("<")) return [];
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xml, "text/xml");
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
        source: "FFTT API Live"
      });
    }
  });

  return players.sort((a, b) => b.points - a.points);
}

function parsePingpocketHtml(html: string): Player[] {
  const players: Player[] = [];
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const rows = Array.from(doc.querySelectorAll("tr, div.licencie, li"));

    rows.forEach((row, i) => {
      const text = row.textContent || "";
      const pointsMatch = text.match(/(\d{3,4})\s*(pts|points)?/i);
      if (pointsMatch && text.length < 200) {
        const pts = parseInt(pointsMatch[1], 10);
        if (pts >= 500 && pts <= 3500) {
          const parts = text.replace(/[\n\r\t]+/g, " ").trim().split(" ");
          const nom = parts[0] || `Joueur ${i + 1}`;
          const prenom = parts[1] || "";
          players.push({
            licence: `330${i + 100}`,
            nom: nom.toUpperCase(),
            prenom,
            points: pts,
            clast: Math.floor(pts / 100).toString(),
            cat: "S",
            source: "Pingpocket Live"
          });
        }
      }
    });
  } catch (e) {
    console.error("Erreur parsing Pingpocket HTML:", e);
  }
  return players.sort((a, b) => b.points - a.points);
}