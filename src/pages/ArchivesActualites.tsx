"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import NewsCard from "@/components/NewsCard";
import { allNewsItems } from "@/data/news";
import { Search, Archive } from "lucide-react";

const ArchivesActualites = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredNews = allNewsItems.filter((news) => {
    const query = searchQuery.toLowerCase();
    return (
      news.title.toLowerCase().includes(query) ||
      news.description.toLowerCase().includes(query) ||
      news.location.toLowerCase().includes(query) ||
      news.date.toLowerCase().includes(query)
    );
  });

  return (
    <div className="container mx-auto px-4 py-8 bg-clubLight text-clubLight-foreground">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-clubDark mb-3 flex items-center justify-center gap-3">
          <Archive className="h-8 w-8 text-clubPrimary" /> Archives des Actualités
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base">
          Retrouvez l'historique de toutes les informations, événements et moments forts de la vie du club St Loub Ping.
        </p>
      </div>

      {/* Barre de recherche */}
      <div className="max-w-md mx-auto mb-8 relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Rechercher une actualité, une date, un lieu..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 bg-input text-clubLight-foreground border-clubPrimary"
        />
      </div>

      {/* Grille des articles */}
      {filteredNews.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          Aucun article trouvé pour "{searchQuery}".
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {filteredNews.map((news) => (
            <NewsCard key={news.id} news={news} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ArchivesActualites;