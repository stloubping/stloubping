"use client";

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLightbox } from '@/context/LightboxContext'; // Import useLightbox

interface NewsItem {
  id: number;
  title: string;
  date: string;
  location: string;
  description: string;
  link: string;
  image: string;
}

interface NewsCardProps {
  news: NewsItem;
}

const NewsCard: React.FC<NewsCardProps> = ({ news }) => {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const truncateLength = 200; // Nombre de caractères pour l'aperçu
  const { openLightbox } = useLightbox(); // Use the lightbox hook

  const truncatedDescription = news.description.length > truncateLength
    ? news.description.substring(0, truncateLength) + "..."
    : news.description;

  return (
    <Card className="bg-clubLight shadow-lg rounded-xl overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <img
        src={news.image}
        alt={news.title}
        className="w-full h-48 object-cover cursor-zoom-in"
        onClick={() => openLightbox(news.image)} // Open lightbox on image click
      />
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-clubPrimary">{news.title}</CardTitle>
        <CardDescription className="flex items-center text-clubLight-foreground/80 mt-2">
          <CalendarDays className="mr-2 h-4 w-4" /> {news.date}
        </CardDescription>
        <CardDescription className="flex items-center text-clubLight-foreground/80">
          <MapPin className="mr-2 h-4 w-4" /> {news.location}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className={cn("text-clubDarker", { "whitespace-pre-line": showFullDescription })}>
          {showFullDescription ? news.description : truncatedDescription}
        </p>
        {news.description.length > truncateLength && (
          <Button
            variant="link"
            onClick={() => setShowFullDescription(!showFullDescription)}
            className="p-0 h-auto text-clubPrimary hover:text-clubPrimary/80 mt-2"
          >
            {showFullDescription ? "Réduire" : "Lire la suite"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default NewsCard;