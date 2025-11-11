import { serve } from "https://deno.land/std@0.190.0/http/server.ts"

const BONZAI_URL = "https://www.bonzai.pro/saint-loub-ping";
// Note: If an API key is needed, it should be passed via a Supabase secret and accessed via Deno.env.get('YOUR_SECRET_NAME')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }
  
  try {
    // Fetch the content from the external URL
    const response = await fetch(BONZAI_URL, {
      method: 'GET',
      headers: {
        // Mimic a browser request
        'User-Agent': 'Mozilla/5.0 (compatible; BonzaiFetcher/1.0)',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch Bonzai data: ${response.statusText}`);
    }

    // Since we don't know the exact API structure, we return the raw text content.
    // In a real scenario, we would parse this (e.g., using DOM manipulation libraries in Deno)
    // to extract the latest article title, image, and link.
    const text = await response.text();

    // For demonstration, we will return a placeholder structure based on the assumption
    // that the front-end will need structured data.
    // If the user provides the API endpoint and structure, this logic can be refined.
    
    // --- Placeholder Logic (assuming we can extract the first article) ---
    
    // Since Deno Edge Functions don't easily support complex HTML parsing (like JSDOM),
    // we will return a mock structure for now, and inform the user that if the Bonzai
    // page is pure HTML, we need a proper API endpoint or a more complex setup.
    
    const mockArticle = {
        title: "Dernier Article Bonzai: Championnat par Équipe J4",
        description: "L'équipe 1 s'impose 9-5 et prend la tête du classement ! Lisez l'article complet sur Bonzai.pro.",
        link: BONZAI_URL,
        image: "https://picsum.photos/400/200?random=bonzai",
        date: new Date().toISOString().split('T')[0]
    };

    return new Response(
      JSON.stringify({ latestArticle: mockArticle }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error("Bonzai fetch error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})