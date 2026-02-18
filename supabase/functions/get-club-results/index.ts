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
  console.log(`[API] ${script}`, JSON.stringify(params));
  const res = await fetch(url);
  return await res.text();
}

/**
 * Parse XML robuste qui gère correctement les attributs contenant &
 */
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
        const rawValue = content.substring(afterOpenTag, closeIdx);
        obj[fieldName] = rawValue.trim();
        openTagRegex.lastIndex = closeIdx + closeTag.length;
      }
    }

    results.push(obj);
  }

  return results;
}

function decodeEntities(str: string): string {
  return str
    .replace(/&/g, '&')
    .replace(/</g, '<')
    .replace(/>/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, ' ');
}

/**
 * Parse le liendivision BRUT
 */
function parseLien(lienBrut: string): Record<string, string> {
  const params: Record<string, string> = {};
  if (!lienBrut) return params;

  const decoded = lienBrut
    .replace(/&amp;/g, '&')
    .replace(/&/g, '&');

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

function getCurrentPhase(): string {
  return (new Date().getMonth() + 1 >= 1 && new Date().getMonth() + 1 <= 8) ? "2" : "1";
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    await callSmartping('xml_initialisation.php');

    const teamsXml = await callSmartping('xml_equipe.php', { numclu: CLUB_NUMBER });
    const allTeams = parseXmlList(teamsXml, 'equipe');

    const currentPhase = getCurrentPhase();

    // Filtrage des équipes (Critérium ou toutes si non trouvé)
    const criteriumTeams = allTeams.filter(team => {
      const lib = decodeEntities(`${team.libepr || ''} ${team.libdivision || ''}`).toLowerCase();
      return lib.includes('crit') || lib.includes('gironde') || lib.includes('départ') || lib.includes('depart');
    });

    const teamsToProcess = criteriumTeams.length > 0 ? criteriumTeams : allTeams;

    const teamsWithPhase = teamsToProcess.map(team => ({
      ...team,
      _phase: detectPhase(decodeEntities(`${team.libepr || ''} ${team.libdivision || ''}`)),
    }));

    const byName: Record<string, any[]> = {};
    teamsWithPhase.forEach(team => {
      const name = decodeEntities(team.libequipe || 'unknown');
      if (!byName[name]) byName[name] = [];
      byName[name].push(team);
    });

    const selectedTeams: any[] = [];
    Object.entries(byName).forEach(([name, versions]) => {
      if (versions.length === 1) {
        selectedTeams.push(versions[0]);
      } else {
        const p2 = versions.find(v => v._phase === "2");
        if (p2) selectedTeams.push(p2);
        else {
          versions.sort((a, b) => parseInt(b.idepr || '0') - parseInt(a.idepr || '0'));
          selectedTeams.push(versions[0]);
        }
      }
    });

    const finalTeams = [];

    for (const team of selectedTeams) {
      const lienBrut = team.liendivision || '';
      const lienParams = parseLien(lienBrut);
      const teamName = decodeEntities(team.libequipe || '');

      if (!lienParams.D1) {
        finalTeams.push({
          libequipe: teamName,
          libdivision: decodeEntities(team.libdivision || ''),
          libepr: decodeEntities(team.libepr || ''),
          phase: team._phase === "unknown" ? currentPhase : team._phase,
          ranking: [],
          rencontres: [],
        });
        continue;
      }

      try {
        const classParams: Record<string, string> = {
          action: 'classement',
          auto: '1',
          D1: lienParams.D1,
        };
        if (lienParams.cx_poule) {
          classParams.cx_poule = lienParams.cx_poule;
        }

        let classXml = await callSmartping('xml_result_equ.php', classParams);
        let ranking = parseXmlList(classXml, 'classement');

        // AUTO-CORRECTION : Vérifier si le club est dans ce classement
        const hasClub = ranking.some(r =>
          decodeEntities(r.equipe || '').toLowerCase().includes('loub')
        );

        if (!hasClub) {
          console.log(`[get-club-results] ${teamName} absent de la poule ${lienParams.cx_poule}. Scan des poules...`);
          
          const poulesXml = await callSmartping('xml_result_equ.php', { action: 'poule', auto: '1', D1: lienParams.D1 });
          const poules = parseXmlList(poulesXml, 'poule');

          for (const poule of poules) {
            const pouleLienParams = parseLien(poule.lien || '');
            if (pouleLienParams.cx_poule === lienParams.cx_poule) continue;

            const testXml = await callSmartping('xml_result_equ.php', { action: 'classement', auto: '1', D1: lienParams.D1, cx_poule: pouleLienParams.cx_poule });
            const testRanking = parseXmlList(testXml, 'classement');

            if (testRanking.some(r => decodeEntities(r.equipe || '').toLowerCase().includes('loub'))) {
              console.log(`[get-club-results] Bonne poule trouvée pour ${teamName} : ${pouleLienParams.cx_poule}`);
              ranking = testRanking;
              lienParams.cx_poule = pouleLienParams.cx_poule;
              break;
            }
          }
        }

        // Récupérer les rencontres de la poule finale
        const rencXml = await callSmartping('xml_result_equ.php', { action: '', auto: '1', D1: lienParams.D1, cx_poule: lienParams.cx_poule });
        const rencontres = parseXmlList(rencXml, 'tour');

        finalTeams.push({
          libequipe: teamName,
          libdivision: decodeEntities(team.libdivision || ''),
          libepr: decodeEntities(team.libepr || ''),
          phase: team._phase === "unknown" ? currentPhase : team._phase,
          ranking: ranking.map(c => ({
            clt: c.clt || '', equipe: decodeEntities(c.equipe || ''),
            joue: c.joue || '0', pts: c.pts || '0',
            vic: c.vic || '0', nul: c.nul || '0', def: c.def || '0',
          })),
          rencontres: rencontres.map(r => ({
            libelle: decodeEntities(r.libelle || ''),
            equa: decodeEntities(r.equa || ''), equb: decodeEntities(r.equb || ''),
            scorea: r.scorea || '', scoreb: r.scoreb || '',
            dateprevue: r.dateprevue || '',
          })),
        });
      } catch (err) {
        console.error(`[get-club-results] Erreur pour ${teamName}:`, err);
        finalTeams.push({
          libequipe: teamName, libdivision: decodeEntities(team.libdivision || ''),
          libepr: decodeEntities(team.libepr || ''), phase: team._phase || currentPhase,
          ranking: [], rencontres: [],
        });
      }
    }

    finalTeams.sort((a, b) => {
      const numA = parseInt((a.libequipe.match(/\d+$/) || ['99'])[0]);
      const numB = parseInt((b.libequipe.match(/\d+$/) || ['99'])[0]);
      return numA - numB;
    });

    return new Response(JSON.stringify({ teams: finalTeams }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error(`[get-club-results] Erreur fatale:`, error);
    return new Response(JSON.stringify({ error: error.message, teams: [] }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});