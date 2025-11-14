"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { useLightbox } from '@/context/LightboxContext';
import { VideoItem } from '@/data/videos'; // Import VideoItem interface
import { getYouTubeVideoDetails } from '@/utils/youtubeApi'; // Import the new utility function

interface VideoCardProps {
  video: VideoItem;
}

const VideoCard: React.FC<VideoCardProps> = ({ video }) => {
  const { openLightbox } = useLightbox();
  const [videoTitle, setVideoTitle] = useState(video.title); // Utilise le titre par défaut, puis le met à jour
  const youtubeEmbedUrl = `https://www.youtube.com/embed/${video.youtubeId}`;
  const youtubeThumbnailUrl = `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`; // Standard YouTube thumbnail

  useEffect(() => {
    const fetchTitle = async () => {
      const details = await getYouTubeVideoDetails(video.youtubeId);
      if (details && details.title) {
        setVideoTitle(details.title);
      }
    };
    fetchTitle();
  }, [video.youtubeId]);

  return (
    <Card className="bg-clubLight shadow-lg rounded-xl overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="relative w-full h-64 bg-black flex items-center justify-center">
        <img
          src={youtubeThumbnailUrl}
          alt={videoTitle}
          className="w-full h-full object-cover cursor-zoom-in opacity-80 hover:opacity-100 transition-opacity duration-200"
          onClick={() => openLightbox(youtubeEmbedUrl)} // Open lightbox with embed URL
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <Button
            variant="ghost"
            size="icon"
            className="h-16 w-16 rounded-full bg-white/70 text-clubPrimary hover:bg-white hover:text-clubPrimary-foreground transition-all duration-200"
            onClick={() => openLightbox(youtubeEmbedUrl)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10">
              <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.38 2.872-1.667l11.55 6.416c1.343.742 1.343 2.53 0 3.272L7.372 19.01c-1.343.713-2.872-.234-2.872-1.667V5.653Z" clipRule="evenodd" />
            </svg>
            <span className="sr-only">Play video</span>
          </Button>
        </div>
      </div>
      <CardHeader className="p-4 pb-0">
        <CardTitle className="text-xl font-semibold text-clubDark line-clamp-2">{videoTitle}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <Button onClick={() => openLightbox(youtubeEmbedUrl)} className="w-full bg-clubPrimary hover:bg-clubPrimary/90 text-clubPrimary-foreground">
          Voir la vidéo
        </Button>
      </CardContent>
    </Card>
  );
};

export default VideoCard;