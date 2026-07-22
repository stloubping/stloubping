"use client";

import React from 'react';
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import NewsCard from "@/components/NewsCard";
import HeroSection from "@/components/HeroSection";
import VideoCard from "@/components/VideoCard";
import { allVideos } from '@/data/videos';
import { allNewsItems } from '@/data/news';
import CompetitionCalendar from '@/components/CompetitionCalendar';
import { ArrowRight, Archive } from 'lucide-react';

const Accueil = () => {
  // Sélection des 6 articles les plus récents pour la page d'accueil
  const homeNewsItems = allNewsItems.slice(0, 6);

  const latestVideos = [...allVideos]
    .sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime())
    .slice(0, 2);

  return (
    <div className="bg-clubLight text-clubLight-foreground">
      <HeroSection
        title="Bienvenue au St Loub Ping"
        description="Votre club de tennis de table à Saint-Loubès. Passion, convivialité et compétition pour tous les ages et tous les niveaux."
        imageUrl="/images/hero/club-training.jpg"
        imageAlt="Joueurs de tennis de table en plein entraînement"
      />
      <div className="container mx-auto px-4 py-4 md:py-8">
        {/* ---------- Dernières Actualités (6 articles) ---------- */}
        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8 text-clubDark">
            Dernières Actualités
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
            {homeNewsItems.map((news) => (
              <NewsCard key={news.id} news={news} />
            ))}
          </div>

          {/* Bouton vers les archives */}
          <div className="text-center mt-8">
            <Button asChild variant="outline" className="border-2 border-clubPrimary text-clubPrimary hover:bg-clubPrimary hover:text-white font-semibold rounded-full px-6 py-5">
              <Link to="/actualites" className="flex items-center gap-2">
                <Archive className="h-4 w-4" />
                Voir toutes les actualités (Archives)
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>

        {/* ---------- Facebook ---------- */}
        <section className="text-center mb-12">
          <Card className="bg-clubLight shadow-lg p-4 md:p-8 rounded-xl">
            <CardTitle className="text-xl md:text-2xl font-bold text-clubDark mb-4">
              Suivez-nous sur Facebook !
            </CardTitle>
            <CardContent className="px-0">
              <p className="mb-6 text-sm md:text-base text-clubLight-foreground">
                Restez connecté avec le club et ne manquez aucune actualité directement depuis notre page Facebook.
              </p>
              <div className="mt-4 flex justify-center w-full max-w-[320px] mx-auto overflow-hidden rounded-lg border">
                <iframe
                  src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fp%2FSaint-LoubPing-100085857905183%2F&tabs=timeline&width=320&height=500&small_header=true&adapt_container_width=true&hide_cover=false&show_facepile=true&appId"
                  width="320"
                  height="500"
                  style={{ border: 'none', overflow: 'hidden' }}
                  scrolling="no"
                  frameBorder="0"
                  allowFullScreen={true}
                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                  title="Page Facebook Saint-LoubPing"
                ></iframe>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* ---------- Calendrier des compétitions (limité aux 10 premières dates) ---------- */}
        <CompetitionCalendar initialLimit={10} />

        {/* ---------- Dernières Vidéos ---------- */}
        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8 text-clubDark">
            Dernières Vidéos
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8">
            {latestVideos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        </section>

        {/* ---------- Invitation ---------- */}
        <section className="text-center">
          <Card className="bg-clubLight shadow-lg p-6 md:p-8 rounded-xl">
            <CardTitle className="text-xl md:text-2xl text-clubDark mb-4">
              Prêt à nous rejoindre ?
            </CardTitle>
            <CardContent>
              <p className="mb-6 text-sm md:text-base text-clubLight-foreground">
                Que vous soyez débutant ou expert, le St Loub Ping vous attend !
              </p>
              <Button
                asChild
                className="bg-clubPrimary hover:bg-clubPrimary/90 text-clubPrimary-foreground px-6 md:px-8 py-4 md:py-4 text-base md:text-lg rounded-md shadow-lg"
              >
                <Link to="/adhesions">Découvrir nos Adhésions</Link>
              </Button>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default Accueil;