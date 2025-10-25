"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, MapPin, Facebook } from "lucide-react";
import { Link } from 'react-router-dom';
import NewsCard from "@/components/NewsCard"; // Import the new NewsCard component

const newsItems = [
  {
    id: 1,
    title: "🏓 Tournoi des Familles 2025 : une soirée pleine d’énergie et de sourires !",
    date: "Vendredi dernier",
    location: "Club de Tennis de Table",
    description: "Vendredi dernier, notre club a accueilli le traditionnel Tournoi des Familles, un moment toujours très attendu où chaque licencié peut faire découvrir le tennis de table à un proche — parent, enfant, ami… le temps d’une soirée placée sous le signe du partage et de la convivialité.\n\n🎉 43 équipes se sont affrontées dans une ambiance bon enfant, avec 108 matchs disputés et 324 manches jouées ! Autant dire que les balles ont volé dans tous les sens… et les rires aussi !\n\n🍽️ Pendant que certains s’acharnaient à la table, d’autres profitaient du buffet façon auberge espagnole, riche en saveurs et en échanges. Un vrai régal pour les papilles et pour les liens humains.\n\n🥇 Le podium 2025 :\n- Famille Serelle\n- Famille Legoix\n- Famille Reynaud\n\nBravo à tous les participants pour leur bonne humeur et leur esprit sportif ! Et un grand merci à celles et ceux qui ont contribué à l’organisation de cette belle soirée 💙\n\nMerci à Margaux pour les photos ci jointes.",
    link: "/actualites/tournoi-familles-2025", // Un lien plus spécifique si une page dédiée existe
    image: "/images/actualites/559050727_785921184279805_5144790509263314206_n.jpg"
  },
  {
    id: 2,
    title: "Championnat par équipe : Journée 3 Phase 1",
    date: "Samedi prochain",
    location: "Divers lieux",
    description: "Découvrez le programme de la 3ème journée de la Phase 1 du Championnat par équipe ! Nos équipes Saint Loub' Ping 1 (R2), 2 (PR), 4 (D2), 5 (D3) et 6 (D4) seront en action contre des adversaires comme CA Beglais 4, US Cenon 5, CA Ste Helene 4, Le Haillan TT 7 et TT Farguais 4. L'équipe Saint Loub' Ping 3 (D2) sera exempte cette journée. Venez nombreux encourager nos joueurs !",
    link: "/competitions-equipes", // Lien vers la page des compétitions
    image: "/images/actualites/championnat-equipe-journee-3-phase-1.png"
  },
  {
    id: 3,
    title: "Assemblée Générale Annuelle",
    date: "20 Septembre 2025",
    location: "Maison des Associations",
    description: "Venez participer aux décisions importantes de la vie du club. Votre avis compte !",
    link: "/evenements",
    image: "/images/actualites/FB_IMG_1759672898128.jpg"
  },
];

const eventItems = [
  {
    id: 1,
    title: "Championnat par équipe : Journée 3 Phase 1",
    date: "Samedi 26 Octobre 2025",
    location: "Divers lieux",
    description: "Découvrez le programme de la 3ème journée de la Phase 1 du Championnat par équipe ! Nos équipes Saint Loub' Ping 1 (R2), 2 (PR), 4 (D2), 5 (D3) et 6 (D4) seront en action contre des adversaires comme CA Beglais 4, US Cenon 5, CA Ste Helene 4, Le Haillan TT 7 et TT Farguais 4. L'équipe Saint Loub' Ping 3 (D2) sera exempte cette journée. Venez nombreux encourager nos joueurs !",
    link: "/competitions-equipes",
    image: "/images/events/championnat-equipe-journee-3-phase-1.png"
  },
];

const Accueil = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-clubLight to-clubLighter text-clubDark">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center text-center bg-cover bg-center" style={{ backgroundImage: "url('/images/hero/club-training.jpg')" }}>
        <div className="absolute inset-0 bg-black opacity-60"></div>
        <div className="relative z-10 text-white p-6 max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 leading-tight">
            Bienvenue au Club de Tennis de Table
          </h1>
          <p className="text-xl md:text-2xl mb-8">
            Passion, Compétition et Convivialité
          </p>
          <Button asChild className="bg-clubPrimary hover:bg-clubSecondary text-white text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
            <Link to="/inscription">Rejoignez-nous !</Link>
          </Button>
        </div>
      </section>

      {/* Actualités Section */}
      <section className="py-16 px-4 md:px-8 lg:px-16">
        <h2 className="text-3xl font-bold text-center text-clubDark mb-8">Dernières Actualités</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsItems.map((news) => (
            <NewsCard key={news.id} news={news} />
          ))}
        </div>
      </section>

      {/* Section du Plugin de Page Facebook */}
      <section className="py-16 px-4 md:px-8 lg:px-16 bg-clubSection text-clubDark">
        <h2 className="text-3xl font-bold text-center mb-8">Notre Page Facebook</h2>
        <div className="max-w-2xl mx-auto flex justify-center">
          <iframe
            src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fp%2FSaint-LoubPing-100085857905183%2F&tabs=timeline&width=500&height=500&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true"
            width="100%"
            height="500"
            style={{ border: 'none', overflow: 'hidden' }}
            scrolling="no"
            frameBorder="0"
            allowFullScreen={true}
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            title="Facebook Page Plugin"
            className="rounded-lg shadow-lg"
          ></iframe>
        </div>
        <p className="mt-8 text-center text-muted-foreground">
          Suivez notre page Facebook pour toutes les dernières nouvelles et mises à jour !
        </p>
      </section>

      {/* Prochains Événements Section */}
      <section className="bg-clubDark py-16 px-4 md:px-8 lg:px-16 text-white">
        <h2 className="text-3xl font-bold text-center mb-8">Prochains Événements</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {eventItems.map((event) => (
            <NewsCard key={event.id} news={event} />
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4 md:px-8 lg:px-16 text-center bg-clubLighter">
        <h2 className="text-3xl font-bold text-clubDark mb-8">Contactez-nous</h2>
        <p className="text-lg text-clubDarker mb-8 max-w-2xl mx-auto">
          Vous avez des questions ? N'hésitez pas à nous contacter. Nous serons ravis de vous aider.
        </p>
        <Button asChild className="bg-clubPrimary hover:bg-clubSecondary text-white text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
          <Link to="/contact">Nous Contacter</Link>
        </Button>
      </section>
    </div>
  );
};

export default Accueil;