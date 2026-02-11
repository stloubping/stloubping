"use client";

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, MapPin, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLightbox } from '@/context/LightboxContext';

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
  const truncateLength = 150; 
  const { openLightbox } = useLightbox();

  const truncatedDescription = news.description.length > truncateLength
    ? news.description.substring(0, truncateLength) + "..."
    : news.description;

  // Déterminer le texte du bouton en fonction du lien
  const getButtonText = (link: string) => {
    if (link.includes('inscription')) return "S'inscrire au tournoi";
    if (link.includes('live')) return "Voir les inscrits";
    if (link.includes('boutique')) return "Voir la boutique";
    if (link.includes('adhesions')) return "Voir les infos";
    return "En savoir plus";
  };

  const hasLink = news.link && news.link !== "#";

  return (
    <Card className="bg-clubLight shadow-lg rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      <div className="relative h-48 overflow-hidden">
        <img
          src={news.image}
          alt={news.title}
          className="w-full h-full object-cover cursor-zoom-in hover:scale-105 transition-transform duration-500"
          onClick={() => openLightbox(news.image)}
        />
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold text-clubPrimary line-clamp-2 h-14">{news.title}</CardTitle>
        <div className="space-y-1 mt-2">
          <CardDescription className="flex items-center text-clubLight-foreground/70 text-xs">
            <CalendarDays className="mr-2 h-3 w-3 text-clubPrimary" /> {news.date}
          </CardDescription>
          <CardDescription className="flex items-center text-clubLight-foreground/70 text-xs">
            <MapPin className="mr-2 h-3 w-3 text-clubPrimary" /> {news.location}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className={cn("text-sm text-clubLight-foreground/90", { "whitespace-pre-line": showFullDescription })}>
          {showFullDescription ? news.description : truncatedDescription}
        </p>
        {news.description.length > truncateLength && (
          <button
            onClick={() => setShowFullDescription(!showFullDescription)}
            className="text-xs font-semibold text-clubPrimary hover:underline mt-2"
          >
            {showFullDescription ? "Réduire" : "Lire la suite"}
          </button>
        )}
      </CardContent>
      <CardFooter className="pt-0 pb-6 px-6">
        {hasLink ? (
          <Button asChild className="w-full bg-clubPrimary hover:bg-clubPrimary/90 text-white shadow-md group">
            <Link to={news.link}>
              {getButtonText(news.link)}
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        ) : (
          <div className="h-10 w-full" /> // Spacer if no link
        )}
      </CardFooter>
    </Card>
  );
};

export default NewsCard;