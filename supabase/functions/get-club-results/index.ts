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

// Numéro de série fixe pour la session
const SERIE = "STLBP2025ABCD1";

/**
 * Génère le timestamp au format YYYYMMDDHHMMSSmmm (17 caractères)
 */
function getTimestamp() {
  const now = new Date();
  const pad = (n: number, l = 2) => n.toString().padStart(l, '0');
  return `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}${pad(now.getMilliseconds(), 3)}`;
}

function generateSmartpingHash(tm: string) {
  const passwordMd5 = CryptoJS.MD5(APP_PASSWORD).toString();
  return CryptoJS.HmacSHA1(tm, passwordMd5).toString();
}

/**
 * Effectue un appel à l'API FFTT avec une authentification fraîche (timestamp + hash)
 */
async function callSmartping(script: string, params: Record<string, string> = {}): Promise<string> {
  const tm = getTimestamp();
  const tmc = generateSmartpingHash(tm);
  
  const allParams = new URLSearchParams({
    id: APP_ID,
    serie: SERIE,
    tm,
    tmc,
    ...params
  });
  
  const url = `${API_BASE_URL}/${script}?${allParams.toString()}`;
  console.log(`[get-club-results] Appel API: ${script} avec params: ${JSON.stringify(params)}`);
  
  const response = await fetch(url);
  const text = await response.text();
  return text;
}

function parseXmlList(xml: string, tagName: string) {
  const regex = new RegExp(`<${tagName}>([\\s\\S]*?)<\\/${tagName}>`, 'g');
  const results: Record<string, string>[] = [];
  let match;
  while ((match = regex.exec(xml)) !== null) {
    const content = match[1];
    const obj: Record<string, string> = {};
    const tagRegex = /<([\w]+)>([\s\S]*?)<\/\1>/g;
    let tagMatch;
    while ((tagMatch = tagRegex.exec(content)) !== null) {
      let val = tagMatch[2].trim()
        .replace(/&/g, '&')
        .replace(/&nbsp;/g, ' ')
        .replace(/&ndash;/g, '-')
        .replace(/&mdash;/g, '-')
        .replace(/&quot;/g, '"');
      obj[tagMatch[1]] = val;
    }
    results.push(obj);
  }
  return results;
}

function parseLienDivision(lien: string): Record<string, string> {
  const params: Record<string, string> = {};
  if (!lien) return params;
  
  const clean = lien.replace(/&/g, '&');
  
  clean.split('&').forEach(part => {
    const eqIndex = part.indexOf('=');
    if (eqIndex > 0) {
      const key = part.substring(0, eqIndex).trim();
      const value = part.substring(eqIndex + 1).trim();
      params[key] = value;
    }
  });
  
  return params;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // 1. Initialisation
    await callSmartping('xml_initialisation.php');

    // 2. Récupérer toutes les équipes (Type A)
    const teamsXml = await callSmartping('xml_equipe.php', {
      numclu: CLUB_NUMBER,
      type: 'A'
    });
    
    const allTeams = parseXmlList(teamsXml, 'equipe');
    
    console.log(`[get-club-results] Total équipes reçues: ${allTeams.length}`);

    // 3. Détection de phase et filtrage intelligent
    const teamsWithPhase = allTeams.map(team => {
      const lib = `${team.libepr || ''} ${team.libdivision || ''}`.toLowerCase();
      let phase = "unknown";
      
      if (lib.includes('phase 2') || lib.includes('ph.2') || lib.includes('ph 2') || lib.includes('p2')) {
        phase = "2";
      } else if (lib.includes('phase 1') || lib.includes('ph.1') || lib.includes('ph 1') || lib.includes('p1')) {
        phase = "1";
      }
      
      return { ...team, _detectedPhase: phase };
    });

    // Regroupement par nom d'équipe pour ne garder que la version la plus récente (Phase 2)
    const teamsByName: Record<string, typeof teamsWithPhase> = {};
    teamsWithPhase.forEach(team => {
      const name = team.libequipe || 'unknown';
      if (!teamsByName[name]) teamsByName[name] = [];
      teamsByName[name].push(team);
    });

    const filteredTeams: typeof teamsWithPhase = [];
    Object.entries(teamsByName).forEach(([name, versions]) => {
      if (versions.length === 1) {
        filteredTeams.push(versions[0]);
      } else {
        const phase2 = versions.find(v => v._detectedPhase === "2");
        if (phase2) {
          filteredTeams.push(phase2);
        } else {
          // Si pas de Phase 2 explicite, on prend l'ID d'épreuve le plus élevé
          const sorted = versions.sort((a, b) => parseInt(b.idepr || '0') - parseInt(a.idepr || '0'));
          filteredTeams.push(sorted[0]);
        }
      }
    });

    // 4. Récupération des classements avec authentification fraîche pour chaque appel
    const enrichedTeams = [];
    for (const team of filteredTeams) {
      try {
        const params = parseLienDivision(team.liendivision || '');
        
        if (!params.D1) {
          enrichedTeams.push({
            libequipe: team.libequipe || '',
            libdivision: team.libdivision || '',
            libepr: team.libepr || '',
            phase: team._detectedPhase === "unknown" ? "2" : team._detectedPhase,
            ranking: []
          });
          continue;
        }

        const rankingParams: Record<string, string> = {
          action: 'classement',
          auto: '1',
          D1: params.D1,
        };
        if (params.cx_poule) {
          rankingParams.cx_poule = params.cx_poule;
        }

        const rankingXml = await callSmartping('xml_result_equ.php', rankingParams);
        const ranking = parseXmlList(rankingXml, 'classement');
        
        enrichedTeams.push({
          libequipe: team.libequipe || '',
          libdivision: team.libdivision || '',
          libepr: team.libepr || '',
          phase: team._detectedPhase === "unknown" ? "2" : team._detectedPhase,
          ranking: ranking.map(c => ({
            clt: c.clt || '',
            equipe: c.equipe || '',
            joue: c.joue || '0',
            pts: c.pts || '0',
            vic: c.vic || '0',
            nul: c.nul || '0',
            def: c.def || '0',
          }))
        });
      } catch (err) {
        console.error(`[get-club-results] Erreur classement pour ${team.libequipe}:`, err.message);
      }
    }

    return new Response(JSON.stringify({ 
      teams: enrichedTeams,
      debug: {
        totalFromAPI: allTeams.length,
        afterFilter: filteredTeams.length
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error(`[get-club-results] Erreur fatale: ${error.message}`);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
})