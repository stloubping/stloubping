import { serve } from "https://deno.land/std@0.190.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Configuration Smartping fournie par l'utilisateur
const APP_ID = "SX046";
const APP_PASSWORD = "NQC2rNs85g";
const API_BASE_URL = "https://www.fftt.com/wp-content/plugins/fftt-api/api.php";

/**
 * Génère le timestamp au format YYYYMMDDHHMMSSmmm
 */
function getTimestamp() {
  const now = new Date();
  const pad = (n: number, l = 2) => n.toString().padStart(l, '0');
  return `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}000`;
}

/**
 * Calcule le hash HMAC-SHA1 requis par la FFTT
 * Note: La FFTT demande HMAC_SHA1(serie, MD5(password))
 */
async function generateSmartpingHash(serie: string) {
  const encoder = new TextEncoder();
  
  // 1. MD5 du mot de passe
  const md5Buffer = await crypto.subtle.digest("MD5", encoder.encode(APP_PASSWORD));
  const md5Hex = Array.from(new Uint8Array(md5Buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');

  // 2. HMAC-SHA1 de la série avec le MD5 comme clé
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(md5Hex),
    { name: "HMAC", hash: "SHA-1" },
    false,
    ["sign"]
  );
  
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(serie));
  return Array.from(new Uint8Array(signature))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Parseur XML ultra-léger pour extraire les champs simples
 */
function extractXmlTag(xml: string, tag: string) {
  const match = xml.match(new RegExp(`<${tag}>(.*?)<\/${tag}>`));
  return match ? match[1].trim() : "";
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { licence } = await req.json();
    if (!licence) throw new Error('Licence manquante');

    console.log(`[get-player-points] Interrogation FFTT pour : ${licence}`);

    const serie = getTimestamp();
    const tm = await generateSmartpingHash(serie);

    // Construction de l'URL officielle Smartping
    const url = `${API_BASE_URL}?id=${APP_ID}&serie=${serie}&tm=${tm}&action=xml_licence&licence=${licence}`;
    
    const response = await fetch(url);
    const xmlText = await response.text();

    // Vérification si le joueur existe dans le XML
    if (xmlText.includes("<licence>") && !xmlText.includes("<erreur>")) {
      const result = {
        points: extractXmlTag(xmlText, "point") || "500",
        first_name: extractXmlTag(xmlText, "prenom"),
        last_name: extractXmlTag(xmlText, "nom"),
        club: extractXmlTag(xmlText, "nomclub")
      };

      console.log(`[get-player-points] Joueur trouvé : ${result.first_name} ${result.last_name}`);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Joueur non trouvé sur les serveurs FFTT' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error(`[get-player-points] Erreur : ${error.message}`);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
})