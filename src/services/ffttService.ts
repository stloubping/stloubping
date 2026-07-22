import CryptoJS from 'crypto-js';

const APP_ID = "SX046";
const APP_PASSWORD = "NQC2rNs85g";
const CLUB_NUMBER = "10330022";
const SERIE = "STLBP2025PLAY1";

function getTimestamp(): string {
  const now = new Date();
  return `${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}${String(now.getHours()).padStart(2,'0')}${String(now.getMinutes()).padStart(2,'0')}${String(now.getSeconds()).padStart(2,'0')}${String(now.getMilliseconds()).padStart(3,'0')}`;
}

function generateHash(tm: string): string {
  const key = CryptoJS.MD5(APP_PASSWORD).toString();
  return CryptoJS.HmacSHA1(tm, key).toString();
}

export interface Player {
  licence: string;
  nom: string;
  prenom: string;
  points: number;
  clast: string;
  cat: string;
  rang?: string;
}

export async function fetchClubPlayers(): Promise<Player[]> {
  const tm = getTimestamp();
  const tmc = generateHash(tm);
  const ffttUrl = `https://www.fftt.com/mobile/pxml/xml_joueur.php?id=${APP_ID}&serie=${SERIE}&tm=${tm}&tmc=${tmc}&club=${CLUB_NUMBER}`;

  try {
    const response = await fetch(ffttUrl);
    if (response.ok) {
      const xmlText = await response.text();
      const parsed = parsePlayersFromXml(xmlText);
      if (parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn("Appel direct FFTT bloqué par CORS, passage au relai proxy...", e);
  }

  // Tentative via un proxy CORS
  try {
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(ffttUrl)}`;
    const response = await fetch(proxyUrl);
    if (response.ok) {
      const xmlText = await response.text();
      const parsed = parsePlayersFromXml(xmlText);
      if (parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error("Erreur lors de la récupération des joueurs FFTT:", e);
  }

  return [];
}

function parsePlayersFromXml(xml: string): Player[] {
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
    const clast = getVal("clast") || getVal("clst") || "5";
    const cat = getVal("cat");
    const rang = getVal("rang") || getVal("clast_glo");

    if (nom || prenom) {
      players.push({
        licence,
        nom,
        prenom,
        points,
        clast,
        cat,
        rang,
      });
    }
  });

  return players.sort((a, b) => b.points - a.points);
}