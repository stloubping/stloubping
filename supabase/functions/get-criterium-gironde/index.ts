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
  const Y = now.getFullYear();
  const M = String(now.getMonth() + 1).padStart(2, '0');
  const D = String(now.getDate()).padStart(2, '0');
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  const s = String(now.getSeconds()).padStart(2, '0');
  const ms = String(now.getMilliseconds()).padStart(3, '0');
  return `${Y}${M}${D}${h}${m}${s}${ms}`;
}

function generateHash(tm: string): string {
  const key = CryptoJS.MD5(APP_PASSWORD).toString();
  return CryptoJS.HmacSHA1(tm, key).toString();
}

async function callSmartping(script: string, params: Record<string, string> = {}): Promise<string> {
  const tm = getTimestamp();
  const tmc = generateHash(tm);

  const queryParams = new URLSearchParams({
    id: APP_ID,
    serie: SERIE,
    tm,
    tmc,
    ...params,
  });

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
    const fieldRegex = /<([\w]+)>([\s\S]*?)<\/\1>/g;
    let fieldMatch;

    while ((fieldMatch = fieldRegex.exec(content)) !== null) {
      obj[fieldMatch[1]] = fieldMatch[2]
        .trim()
        .replace(/&/g, '&')
        .replace(/</g, '<')
        .replace(/>/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&apos;/g, "'")
        .replace(/&nbsp;/g, ' ');
    }
    results.push(obj);
  }
  return results;
}

function parseLienDivision(lien: string): Record<string, string> {
  const params: Record<string, string> = {};
  if (!lien) return params;

  const clean = lien
    .replace(/&amp;/g, '&')
    .replace(/&/g, '&')
    .replace(/&/g, '&');

  clean.split('&').forEach(part => {
    const idx = part.indexOf('=');
    if (idx > 0) {
      params[part.substring(0, idx).trim()] = part.substring(idx + 1).trim();
    }
  });
  return params;
}

function detectPhaseFromText(text: string): string {
  const lower = text.toLowerCase();
  if (lower.includes('phase 2') || lower.includes('ph.2') || lower.includes('ph 2')) return "2";
  if (lower.includes('phase 1') || lower.includes('ph.1') || lower.includes('ph 1')) return "1";
  return "unknown";
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    await callSmartping('xml_initialisation.php');

    // Récupérer les équipes départementales (sans type)
    const teamsXml = await callSmartping('xml_equipe.php', { numclu: CLUB_NUMBER });
    const allTeams = parseXmlList(teamsXml, 'equipe');

    // Filtrer pour le Critérium
    const criteriumTeams = allTeams.filter(team => {
      const lib = `${team.libepr || ''} ${team.libdivision || ''}`.toLowerCase();
      return lib.includes('crit') || lib.includes('critérium') || lib.includes('criterium');
    });

    // Gestion des phases
    const teamsWithPhase = (criteriumTeams.length > 0 ? criteriumTeams : allTeams).map(team => ({
      ...team,
      _phase: detectPhaseFromText(`${team.libepr || ''} ${team.libdivision || ''}`),
    }));

    const byName: Record<string, any[]> = {};
    teamsWithPhase.forEach(team => {
      const name = team.libequipe || 'unknown';
      if (!byName[name]) byName[name] = [];
      byName[name].push(team);
    });

    const selectedTeams: any[] = [];
    Object.entries(byName).forEach(([_, versions]) => {
      const p2 = versions.find(v => v._phase === "2");
      if (p2) selectedTeams.push(p2);
      else selectedTeams.push(versions.sort((a, b) => parseInt(b.idepr || '0') - parseInt(a.idepr || '0'))[0]);
    });

    const finalTeams = [];
    for (const team of selectedTeams) {
      const lienParams = parseLienDivision(team.liendivision || '');
      if (!lienParams.D1) {
        finalTeams.push({
          libequipe: team.libequipe || '',
          libdivision: team.libdivision || '',
          libepr: team.libepr || '',
          phase: team._phase === "unknown" ? "2" : team._phase,
          ranking: [],
          rencontres: [],
        });
        continue;
      }

      try {
        // Classement
        const classXml = await callSmartping('xml_result_equ.php', { action: 'classement', auto: '1', D1: lienParams.D1, cx_poule: lienParams.cx_poule || '' });
        const ranking = parseXmlList(classXml, 'classement');

        // Rencontres
        const rencXml = await callSmartping('xml_result_equ.php', { action: '', auto: '1', D1: lienParams.D1, cx_poule: lienParams.cx_poule || '' });
        const rencontres = parseXmlList(rencXml, 'tour');

        finalTeams.push({
          libequipe: team.libequipe || '',
          libdivision: team.libdivision || '',
          libepr: team.libepr || '',
          phase: team._phase === "unknown" ? "2" : team._phase,
          ranking: ranking.map(c => ({
            clt: c.clt || '', equipe: c.equipe || '', joue: c.joue || '0', pts: c.pts || '0',
            vic: c.vic || '0', nul: c.nul || '0', def: c.def || '0', pf: c.pf || '0',
          })),
          rencontres: rencontres.map(r => ({
            libelle: r.libelle || '', equa: r.equa || '', equb: r.equb || '',
            scorea: r.scorea || '', scoreb: r.scoreb || '', dateprevue: r.dateprevue || '', datereelle: r.datereelle || '',
          })),
        });
      } catch (err) {
        finalTeams.push({ libequipe: team.libequipe || '', libdivision: team.libdivision || '', libepr: team.libepr || '', phase: team._phase, ranking: [], rencontres: [] });
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
    return new Response(JSON.stringify({ error: error.message, teams: [] }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
})