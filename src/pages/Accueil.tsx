"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, MapPin } from "lucide-react";
import { Link } from 'react-router-dom';
import NewsCard from "@/components/NewsCard";
import { useLightbox } from '@/context/LightboxContext';
import HeroSection from "@/components/HeroSection";
import VideoCard from '@/components/VideoCard'; // Import VideoCard
import { allVideos } from '@/data/videos'; // Import allVideos

const newsItems = [
  // Stage de Perfectionnement Jeunes
  {
    id: 101, // Nouvel ID unique
    title: "Stage de Perfectionnement Jeunes",
    date: "20-25 Octobre 2025", // Date mise à jour ici
    location: "Salle du club",
    description: "Un stage intensif pour les jeunes compétiteurs souhaitant améliorer leur technique et leur stratégie. Encadrement par nos meilleurs entraîneurs.",
    link: "/actualites/stage-perfectionnement", // Ajout d'un lien pour la carte d'actualité
    image: "/images/actualites/FB_IMG_1759672983725.jpg",
  },
  // Tournoi des Familles (Déplacé ici)
  {
    id: 3,
    title: "Tournoi des Familles",
    date: "17 Octobre 2025",
    location: "Salle du club",
    description: "Un événement convivial pour toute la famille ! Venez partager un moment sportif et ludique autour du tennis de table. Ouvert à tous les âges et niveaux.",
    link: "/actualites/tournoi-familles", // Lien mis à jour pour l'actualité
    image: "/images/actualites/559050727_785921184279805_5144790509263314206_n.jpg",
  },
  {
    id: 4,
    title: "Championnat par équipe - Journée 5 Phase 1",
    date: "20 Octobre 2024",
    location: "Salle du club",
    description: "Résultats de la 5ème journée de championnat par équipe. L'équipe 1 s'impose, l'équipe 2 assure le maintien. Tous les détails et les feuilles de match sont disponibles sur la page Compétitions.",
    link: "/competitions-equipes",
    image: "/images/actualites/championnat-equipe-journee-4-phase-1.jpg", // Utilisation d'une autre image disponible
  },
];

const eventItems = [
  // Tournoi Régional Saint-Loub'Ping 2026
  {
    id: 102, // Nouvel ID unique
    title: "Tournoi Régional Saint-Loub'Ping 2026",
    date: "11 Avril 2026", // Date mise à jour ici
    time: "Dès 8h30", // Ajout de l'heure pour la carte d'événement
    location: "Gymnase de Saint-Loubès",
    description: "Préparez vos raquettes ! Notre tournoi régional annuel revient avec de nouvelles catégories et de nombreux lots à gagner. Inscriptions ouvertes prochainement.",
    image: "/images/actualites/Gemini_Generated_Image_mlgzatmlgzatmlgz.png",
    link: "/tournoi-inscription", // Ajout du lien vers la page d'inscription au tournoi
  },
  // Championnat par équipe - Journée 4 Phase 1 (Nouveau bloc)
  {
    id: 202,
    title: "Championnat par équipe - Journée 4 Phase 1",
    date: "15 Novembre 2025",
    time: "Dès 14h00",
    location: "Salle du club",
    description: "Venez encourager nos équipes lors de la 4ème journée de championnat ! Ambiance garantie et matchs décisifs pour le classement.",
    image: "/images/events/IMG-20251003-WA0001.jpg", // Chemin de l'image mis à jour
    link: "/competitions-equipes",
  },
  {
    id: 201, // Nouvel ID unique pour le Tournoi de Noël
    title: "Tournoi de Noël",
    date: "20 Decembre 2025",
    time: "Dès 14h00",
    location: "Salle du club",
    description: "Venez célébrer les fêtes de fin d'année avec un tournoi convivial ouvert à tous les membres du club. Ambiance garantie avec des lots de Noël à gagner !",
    image: "/images/events/481155043_605704212301504_4050174989924491844_n.jpg", // Nouvelle image
    link: "#", // Lien par défaut pour cet événement
  },
];

const Accueil = () => {
  const { openLightbox } = useLightbox();

  // Get the 2 latest videos
  const latestVideos = [...allVideos]
    .sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime())
    .slice(0, 2);

  return (
    <div className="bg-clubLight text-clubLight-foreground">
      <HeroSection
        title="Bienvenue au St Loub Ping"
        description="Votre club de tennis de table à Saint-Loubès. Passion, convivialité et compétition pour tous les âges et tous les niveaux."
        imageUrl="/images/hero/club-training.jpg"
        imageAlt="Joueurs de tennis de table en plein entraînement"
      />

      <div className="container mx-auto px-4 py-8">
        {/* Actualités Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8 text-clubDark">Dernières Actualités</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {newsItems.map((news) => (
              <NewsCard key={news.id} news={news} />
            ))}
          </div>
        </section>

        {/* Événements à Venir Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8 text-clubDark">Événements à Venir</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {eventItems.map((event) => (
              <Card key={event.id} className="bg-clubLight shadow-lg rounded-xl overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-48 object-cover cursor-zoom-in"
                  onClick={() => openLightbox(event.image)}
                />
                <CardHeader>
                  <CardTitle className="text-2xl font-semibold text-clubPrimary">{event.title}</CardTitle>
                  <CardDescription className="flex items-center text-clubLight-foreground/80 mt-2">
                    <CalendarDays className="mr-2 h-4 w-4" /> {event.date} - {event.time}
                  </CardDescription>
                  <CardDescription className="flex items-center text-clubLight-foreground/80">
                    <MapPin className="mr-2 h-4 w-4" /> {event.location}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-clubDarker">{event.description}</p>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full bg-clubSecondary hover:bg-clubPrimary text-white">
                    <Link to={event.link}>En savoir plus</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>

        {/* Dernières Vidéos Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8 text-clubDark">Dernières Vidéos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {latestVideos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        </section>

        {/* Suivez-nous Section avec flux Facebook */}
        <section className="text-center mb-12">
          <Card className="bg-clubLight shadow-lg p-8 rounded-xl">
            <CardTitle className="text-2xl font-bold text-clubDark mb-4">Suivez-nous sur Facebook !</CardTitle>
            <CardContent>
              <p className="mb-6 text-clubLight-foreground">
                Restez connecté avec le club et ne manquez aucune actualité, événement ou résultat directement depuis notre page Facebook.
              </p>
              <div className="mt-8 flex justify-center w-full">
                <iframe 
                  src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fp%2FSaint-LoubPing-100085857905183%2F&tabs=timeline&width=500&height=600&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId"
                  width="500"
                  height="600"
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
        
        {/* Rejoignez-nous Section (Déplacée en bas) */}
        <section className="text-center">
          <Card className="bg-clubLight shadow-lg p-8 rounded-xl">
            <CardTitle className="text-2xl text-clubDark mb-4">Prêt à nous rejoindre ?</CardTitle>
            <CardContent>
              <p className="mb-6 text-clubLight-foreground">
                Que vous soyez débutant ou expert, jeune ou moins jeune, le St Loub Ping vous attend !
                Découvrez nos différentes formules d'adhésion et trouvez celle qui vous convient.
              </p>
              <Button asChild className="bg-clubPrimary hover:bg-clubPrimary/90 text-clubPrimary-foreground px-8 py-4 text-lg rounded-md shadow-lg">
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