"use client";

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, MapPin, ArrowRight, Download } from "lucide-react";
import { useLightbox } from '@/context/LightboxContext';

interface NewsItem {
  id: string | number;
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

  const isPdfOrExternal = news.link.endsWith('.pdf') || news.link.startsWith('http') || news.link.startsWith('/documents');

  const getButtonText = (link: string) => {
    if (link.includes('Convocation') || link.endsWith('.pdf')) return "Télécharger la convocation";
    if (link.includes('inscription')) return "S'inscrire";
    if (link.includes('live')) return "Voir les inscrits";
    if (link.includes('boutique')) return "Boutique";
    if (link.includes('adhesions')) return "Infos";
    return "En savoir plus";
  };

  const hasLink = news.link && news.link !== "#";

  const renderFullDescription = () => {
    const blocks = news.description.split(/\n\s*\n/).map((block) => block.trim()).filter(Boolean);

    return blocks.map((block, index) => {
      const lines = block.split("\n").map((line) => line.trim()).filter(Boolean);
      const listItems = lines.filter((line) => line.startsWith("•"));

      if (listItems.length === lines.length && listItems.length > 0) {
        return (
          <ul key={`${block}-${index}`} className="my-2 list-disc space-y-1 pl-5">
            {listItems.map((line) => <li key={line}>{line.replace(/^•\s*/, "")}</li>)}
          </ul>
        );
      }

      return <p key={`${block}-${index}`} className="my-2 first:mt-0 last:mb-0">{block}</p>;
    });
  };

  return (
    <Card className="bg-clubLight shadow-lg rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      <div className="relative h-40 md:h-48 overflow-hidden">
        <img loading="lazy" decoding="async"
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
        {showFullDescription ? (
          <div className="text-xs leading-5 text-clubLight-foreground/90 md:text-sm md:leading-6">
            {renderFullDescription()}
          </div>
        ) : (
          <p className="text-xs leading-5 text-clubLight-foreground/90 md:text-sm md:leading-6">
            {truncatedDescription}
          </p>
        )}
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
            {isPdfOrExternal ? (
              <a href={news.link} target="_blank" rel="noopener noreferrer">
                {news.link.endsWith('.pdf') && <Download className="mr-1.5 h-3.5 w-3.5" />}
                {getButtonText(news.link)}
                {!news.link.endsWith('.pdf') && <ArrowRight className="ml-1 h-3 w-3 md:h-4 md:w-4 group-hover:translate-x-1 transition-transform" />}
              </a>
            ) : (
              <Link to={news.link}>
                {getButtonText(news.link)}
                <ArrowRight className="ml-1 h-3 w-3 md:h-4 md:w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            )}
          </Button>
        ) : (
          <div className="h-9 md:h-10 w-full" />
        )}
      </CardFooter>
    </Card>
  );
};

export default NewsCard;
