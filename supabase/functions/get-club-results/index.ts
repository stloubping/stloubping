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
const SERIE = "STLBP2025ABCD1";

function getTimestamp(): string {
  const now = new Date();
  return `${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}${String(now.getHours()).padStart(2,'0')}${String(now.getMinutes()).padStart(2,'0')}${String(now.getSeconds()).padStart(2,'0')}${String(now.getMilliseconds()).padStart(3,'0')}`;
}

function generateHash(tm: string): string {
  const key = CryptoJS.MD5(APP_PASSWORD).toString();
  return CryptoJS.HmacSHA1(tm, key).toString();
}

async function callSmartping(script: string, params: Record<string, string> = {}): Promise<string> {
  const tm = getTimestamp();
  const tmc = generateHash(tm);
  const queryParams = new URLSearchParams({ id: APP_ID, serie: SERIE, tm, tmc, ...params });
  const url = `${API_BASE_URL}/${script}?${queryParams.toString()}`;
  const res = await fetch(url);
  return await res.text();
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

function decodeEntities(str: string): string {
  return str.replace(/&/g, '&').replace(/</g, '<').replace(/>/g, '>').replace(/&quot;/g, '"').replace(/&nbsp;/g, ' ');
}

function parseLien(lienBrut: string): Record<string, string> {
  const params: Record<string, string> = {};
  if (!lienBrut) return params;
  const decoded = lienBrut.replace(/&amp;/g, '&').replace(/&/g, '&');
  decoded.split('&').forEach(part => {
    const eq = part.indexOf('=');
    if (eq > 0) {
      const key = part.substring(0, eq).trim();
      const val = part.substring(eq + 1).trim();
      if (key && val) params[key] = val;
    }
  });
  return params;
}

function detectPhase(text: string): string {
  const l = text.toLowerCase();
  if (l.includes('phase 2') || l.includes('ph.2') || l.includes('ph 2')) return "2";
  if (l.includes('phase 1') || l.includes('ph.1') || l.includes('ph 1')) return "1";
  return "unknown";
}

function extractTeamNumber(libequipe: string): string {
  const match = libequipe.match(/(\d+)\s*$/);
  return match ? match[1] : "1";
}

function isTeamInRanking(ranking: Record<string, string>[], teamNumber: string): boolean {
  return ranking.some(r => {
    const equipe = decodeEntities(r.equipe || '').toLowerCase();
    const hasClub = equipe.includes('loub') || equipe.includes('st lou') || equipe.includes('saint lou');
    if (!hasClub) return false;
    
    const matchNum = equipe.match(/(\d+)\s*$/);
    const rankingTeamNum = matchNum ? matchNum[1] : "1";
    
    return rankingTeamNum === teamNumber;
  });
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    await callSmartping('xml_initialisation.php');

    const teamsXml = await callSmartping('xml_equipe.php', { numclu: CLUB_NUMBER });
    const allTeams = parseXmlList(teamsXml, 'equipe');

    const finalTeams = [];

    for (const team of allTeams) {
      const lienBrut = team.liendivision || '';
      const lienParams = parseLien(lienBrut);
      const teamName = decodeEntities(team.libequipe || '');
      const teamNumber = extractTeamNumber(teamName);
      const phase = detectPhase(decodeEntities(`${team.libepr || ''} ${team.libdivision || ''}`));

      if (!lienParams.D1) {
        finalTeams.push({
          libequipe: teamName,
          libdivision: decodeEntities(team.libdivision || ''),
          libepr: decodeEntities(team.libepr || ''),
          phase: phase === "unknown" ? "2" : phase,
          ranking: [],
        });
        continue;
      }

      try {
        const classParams: Record<string, string> = { action: 'classement', auto: '1', D1: lienParams.D1 };
        if (lienParams.cx_poule) classParams.cx_poule = lienParams.cx_poule;

        let classXml = await callSmartping('xml_result_equ.php', classParams);
        let ranking = parseXmlList(classXml, 'classement');
        let usedCxPoule = lienParams.cx_poule || '';

        const teamFound = isTeamInRanking(ranking, teamNumber);

        if (!teamFound && ranking.length > 0) {
          const poulesXml = await callSmartping('xml_result_equ.php', { action: 'poule', auto: '1', D1: lienParams.D1 });
          const poules = parseXmlList(poulesXml, 'poule');

          for (const poule of poules) {
            const pouleLienParams = parseLien(poule.lien || '');
            const testCxPoule = pouleLienParams.cx_poule || '';
            if (testCxPoule === usedCxPoule) continue;

            const testXml = await callSmartping('xml_result_equ.php', { action: 'classement', auto: '1', D1: lienParams.D1, cx_poule: testCxPoule });
            const testRanking = parseXmlList(testXml, 'classement');

            if (isTeamInRanking(testRanking, teamNumber)) {
              ranking = testRanking;
              usedCxPoule = testCxPoule;
              break;
            }
          }
        }

        finalTeams.push({
          libequipe: teamName,
          libdivision: decodeEntities(team.libdivision || ''),
          libepr: decodeEntities(team.libepr || ''),
          phase: phase === "unknown" ? "2" : phase,
          ranking: ranking.map(c => ({
            clt: c.clt || '',
            equipe: decodeEntities(c.equipe || ''),
            joue: c.joue || '0',
            pts: c.pts || '0',
            vic: c.vic || '0',
            nul: c.nul || '0',
            def: c.def || '0',
          })),
        });
      } catch (err) {
        finalTeams.push({
          libequipe: teamName,
          libdivision: decodeEntities(team.libdivision || ''),
          libepr: decodeEntities(team.libepr || ''),
          phase: phase === "unknown" ? "2" : phase,
          ranking: [],
        });
      }
    }

    finalTeams.sort((a, b) => {
      const numA = parseInt((a.libequipe.match(/\d+$/) || ['99'])[0]);
      const numB = parseInt((b.libequipe.match(/\d+$/) || ['99'])[0]);
      if (numA !== numB) return numA - numB;
      return a.phase.localeCompare(b.phase);
    });

    return new Response(JSON.stringify({ teams: finalTeams }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message, teams: [] }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});