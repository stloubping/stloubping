import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import CryptoJS from "https://esm.sh/crypto-js@4.1.1"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Configuration Smartping fournie par l'utilisateur
const APP_ID = "SX046";
const APP_PASSWORD = "NQC2rNs85g";
const API_BASE_URL = "https://www.fftt.com/wp-content/plugins/fftt-api/api.php";

/**
 * Génère le timestamp au format YYYYMMDDHHMMSSmmm (17 caractères)
 */
function getTimestamp() {
  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}000`;
}

/**
 * Calcule le hash requis par la FFTT : HMAC_SHA1(serie, MD5(password))
 */
function generateSmartpingHash(serie: string) {
  // 1. Calcul du MD5 du mot de passe
  const passwordMd5 = CryptoJS.MD5(APP_PASSWORD).toString();
  
  // 2. Calcul du HMAC-SHA1 de la série en utilisant le MD5 comme clé
  const hash = CryptoJS.HmacSHA1(serie, passwordMd5).toString();
  
  return hash;
}

/**
 * Parseur XML ultra-léger
 */
function extractXmlTag(xml: string, tag: string) {
  const match = xml.match(new RegExp(`<${tag}>(.*?)<\/${tag}>`));
  return match ? match[1].trim() : "";
}

serve(async (req) => {
  // Gestion du CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { licence } = await req.json();
    if (!licence) throw new Error('Numéro de licence manquant');

    console.log(`[get-player-points] Requête pour la licence : ${licence}`);

    const serie = getTimestamp();
    const tm = generateSmartpingHash(serie);

    // URL de l'API FFTT
    const url = `${API_BASE_URL}?id=${APP_ID}&serie=${serie}&tm=${tm}&action=xml_licence&licence=${licence}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Erreur serveur FFTT: ${response.status}`);
    }
    
    const xmlText = await response.text();

    // Vérification des erreurs dans le XML renvoyé par la FFTT
    if (xmlText.includes("<erreur>") || !xmlText.includes("<licence>")) {
      const errorMsg = extractXmlTag(xmlText, "message") || "Joueur non trouvé";
      console.warn(`[get-player-points] FFTT a renvoyé une erreur : ${errorMsg}`);
      return new Response(JSON.stringify({ error: errorMsg }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Extraction des données
    const result = {
      points: extractXmlTag(xmlText, "point") || "500",
      first_name: extractXmlTag(xmlText, "prenom"),
      last_name: extractXmlTag(xmlText, "nom"),
      club: extractXmlTag(xmlText, "nomclub")
    };

    console.log(`[get-player-points] Succès pour ${result.first_name} ${result.last_name}`);
    
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error(`[get-player-points] Erreur critique : ${error.message}`);
    return new Response(JSON.stringify({ error: "Erreur interne du service de recherche" }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
})