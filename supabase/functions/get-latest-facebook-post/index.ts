import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Récupérer les secrets de l'environnement Supabase
    const FACEBOOK_PAGE_ID = Deno.env.get('FACEBOOK_PAGE_ID');
    const FACEBOOK_PAGE_ACCESS_TOKEN = Deno.env.get('FACEBOOK_PAGE_ACCESS_TOKEN');

    if (!FACEBOOK_PAGE_ID || !FACEBOOK_PAGE_ACCESS_TOKEN) {
      return new Response(JSON.stringify({ error: 'Facebook Page ID or Access Token not set in environment variables.' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Requête à l'API Facebook Graph pour le dernier post
    const response = await fetch(
      `https://graph.facebook.com/v19.0/${FACEBOOK_PAGE_ID}/posts?fields=message,permalink_url,created_time&limit=1&access_token=${FACEBOOK_PAGE_ACCESS_TOKEN}`
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Facebook API error:', errorData);
      return new Response(JSON.stringify({ error: 'Failed to fetch Facebook posts', details: errorData }), {
        status: response.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    const latestPost = data.data && data.data.length > 0 ? data.data[0] : null;

    return new Response(JSON.stringify({ latestPost }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Edge Function error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error', details: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});