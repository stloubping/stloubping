"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import NewsCard from "@/components/NewsCard";
import HeroSection from "@/components/HeroSection";
import VideoCard from "@/components/VideoCard";
import { allVideos } from '@/data/videos';
import { fallbackHomeNewsItems, fetchHomeNewsItems } from '@/lib/homeNews';
import CompetitionCalendar from '@/components/CompetitionCalendar';
import WeeklyRoomAttendance from '@/components/WeeklyRoomAttendance';
import { ArrowRight, CalendarDays, Clock3, Newspaper } from 'lucide-react';

const Accueil = () => {
  const [homeNewsItems, setHomeNewsItems] = useState(fallbackHomeNewsItems);

  useEffect(() => {
    fetchHomeNewsItems()
      .then((items) => { if (items.length > 0) setHomeNewsItems(items); })
      .catch((error) => console.error("Impossible de charger les actualités de l’accueil.", error));
  }, []);

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
        <section className="mx-auto mb-8 max-w-5xl rounded-3xl bg-clubDark p-4 shadow-xl sm:p-6" aria-label="Informations saison 2026-2027">
          <div className="mb-4 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-clubPrimary">Saison 2026–2027</p>
            <h2 className="mt-1 text-xl font-black text-white sm:text-2xl">Toutes les dates et tous les horaires du club</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Link to="/competitions-equipes/calendrier" className="group flex items-center gap-4 rounded-2xl bg-clubPrimary px-5 py-4 text-white shadow-md transition-transform hover:-translate-y-0.5 hover:bg-clubPrimary/90">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/15"><CalendarDays className="h-6 w-6" /></span>
              <span><span className="block text-xs font-bold uppercase tracking-wider text-white/75">Compétitions</span><span className="block text-lg font-black">Calendrier 2026/2027</span></span>
              <ArrowRight className="ml-auto h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link to="/adhesions#training-schedule-title" className="group flex items-center gap-4 rounded-2xl bg-white px-5 py-4 text-clubDark shadow-md transition-transform hover:-translate-y-0.5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-clubPrimary/10"><Clock3 className="h-6 w-6 text-clubPrimary" /></span>
              <span><span className="block text-xs font-bold uppercase tracking-wider text-clubDark/55">Entraînements</span><span className="block text-lg font-black">Horaires 2026/2027</span></span>
              <ArrowRight className="ml-auto h-5 w-5 text-clubPrimary transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </section>
        <WeeklyRoomAttendance />

        {/* ---------- Les 3 dernières actualités ---------- */}
        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8 text-clubDark">
            Dernières Actualités
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
            {homeNewsItems.map((news) => (
              <NewsCard key={news.id} news={news} />
            ))}
          </div>

          {/* Bouton vers toutes les actualités */}
          <div className="text-center mt-8">
            <Button asChild variant="outline" className="border-2 border-clubPrimary text-clubPrimary hover:bg-clubPrimary hover:text-white font-semibold rounded-full px-6 py-5">
              <Link to="/actualites" className="flex items-center gap-2">
                <Newspaper className="h-4 w-4" />
                Voir toutes les actualités
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>

        {/* ---------- Calendrier des compétitions (limité aux 6 premières dates) ---------- */}
        <CompetitionCalendar initialLimit={6} />

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

        <section className="mt-12 rounded-2xl border border-clubPrimary/20 bg-white p-6 text-center shadow-sm md:p-8" aria-labelledby="zone-desservie">
          <h2 id="zone-desservie" className="text-xl font-bold text-clubDark md:text-2xl">
            Un club de tennis de table près de chez vous
          </h2>
          <p className="mx-auto mt-3 max-w-3xl text-sm leading-6 text-clubLight-foreground md:text-base">
            Saint-Loub’Ping accueille les joueurs de Saint-Loubès et des communes voisines : Sainte-Eulalie, Ambarès-et-Lagrave, Carbon-Blanc, Bassens, Yvrac, Montussan, Izon et Vayres. Que vous cherchiez une activité loisir, une section jeunes ou la compétition, venez découvrir le club.
          </p>
          <Button asChild variant="outline" className="mt-5 rounded-full border-clubPrimary text-clubPrimary hover:bg-clubPrimary hover:text-white">
            <Link to="/essai-gratuit">Réserver une séance d’essai</Link>
          </Button>
        </section>
      </div>
    </div>
  );
};

export default Accueil;
