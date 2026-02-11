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
  const truncateLength = 120; 
  const { openLightbox } = useLightbox();

  const truncatedDescription = news.description.length > truncateLength
    ? news.description.substring(0, truncateLength) + "..."
    : news.description;

  const getButtonText = (link: string) => {
    if (link.includes('inscription')) return "S'inscrire";
    if (link.includes('live')) return "Voir les inscrits";
    if (link.includes('boutique')) return "Boutique";
    if (link.includes('adhesions')) return "Infos";
    return "En savoir plus";
  };

  const hasLink = news.link && news.link !== "#";

  return (
    <Card className="bg-clubLight shadow-lg rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      <div className="relative h-40 md:h-48 overflow-hidden">
        <img
          src={news.image}
          alt={news.title}
          className="w-full h-full object-cover cursor-zoom-in hover:scale-105 transition-transform duration-500"
          onClick={() => openLightbox(news.image)}
        />
      </div>
      <CardHeader className="pb-2 px-4">
        <CardTitle className="text-lg md:text-xl font-bold text-clubPrimary line-clamp-2 h-12 md:h-14">{news.title}</CardTitle>
        <div className="space-y-1 mt-1">
          <CardDescription className="flex items-center text-clubLight-foreground/70 text-[10px] md:text-xs">
            <CalendarDays className="mr-1 h-3 w-3 text-clubPrimary" /> {news.date}
          </CardDescription>
          <CardDescription className="flex items-center text-clubLight-foreground/70 text-[10px] md:text-xs">
            <MapPin className="mr-1 h-3 w-3 text-clubPrimary" /> {news.location}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex-grow px-4">
        <p className={cn("text-xs md:text-sm text-clubLight-foreground/90", { "whitespace-pre-line": showFullDescription })}>
          {showFullDescription ? news.description : truncatedDescription}
        </p>
        {news.description.length > truncateLength && (
          <button
            onClick={() => setShowFullDescription(!showFullDescription)}
            className="text-[10px] md:text-xs font-semibold text-clubPrimary hover:underline mt-1"
          >
            {showFullDescription ? "Réduire" : "Lire la suite"}
          </button>
        )}
      </CardContent>
      <CardFooter className="pt-0 pb-4 px-4">
        {hasLink ? (
          <Button asChild className="w-full bg-clubPrimary hover:bg-clubPrimary/90 text-white shadow-md group h-9 md:h-10 text-xs md:text-sm">
            <Link to={news.link}>
              {getButtonText(news.link)}
              <ArrowRight className="ml-1 h-3 w-3 md:h-4 md:w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        ) : (
          <div className="h-9 md:h-10 w-full" />
        )}
      </CardFooter>
    </Card>
  );
};

export default NewsCard;