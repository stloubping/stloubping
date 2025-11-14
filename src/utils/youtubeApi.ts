import axios from 'axios';

const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
const YOUTUBE_API_BASE_URL = "https://www.googleapis.com/youtube/v3";

interface YouTubeVideoDetails {
  title: string;
  // Vous pouvez ajouter d'autres champs si nécessaire, comme la description, la durée, etc.
}

export const getYouTubeVideoDetails = async (videoId: string): Promise<YouTubeVideoDetails | null> => {
  if (!YOUTUBE_API_KEY) {
    console.error("VITE_YOUTUBE_API_KEY n'est pas défini dans les variables d'environnement.");
    return null;
  }
  
  // Log temporaire pour vérifier si la clé est chargée (ne pas afficher la clé complète)
  console.log("YouTube API Key loaded:", !!YOUTUBE_API_KEY);

  try {
    const response = await axios.get(`${YOUTUBE_API_BASE_URL}/videos`, {
      params: {
        id: videoId,
        key: YOUTUBE_API_KEY,
        part: 'snippet', // Nous voulons le snippet pour le titre
      },
    });

    // Log temporaire pour vérifier la réponse de l'API
    console.log(`YouTube API response status for ${videoId}:`, response.status);
    
    if (response.data.items && response.data.items.length > 0) {
      const snippet = response.data.items[0].snippet;
      return {
        title: snippet.title,
      };
    }
    console.warn(`No items found in YouTube API response for videoId: ${videoId}`);
    return null;
  } catch (error) {
    // Log l'erreur complète de l'appel API
    if (axios.isAxiosError(error) && error.response) {
        console.error(`Erreur API YouTube pour ${videoId}:`, error.response.status, error.response.data);
    } else {
        console.error(`Erreur lors de la récupération des détails de la vidéo YouTube pour ${videoId}:`, error);
    }
    return null;
  }
};