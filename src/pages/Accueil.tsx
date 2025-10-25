"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, MapPin, Facebook } from "lucide-react";
import { Link } from 'react-router-dom';
import NewsCard from "@/components/NewsCard";
import { useLightbox } from '@/context/LightboxContext';
import HeroSection from "@/components/HeroSection"; // Import HeroSection
// import TrainingSchedule from "@/components/TrainingSchedule"; // Removed TrainingSchedule import

const newsItems = [
  {
    id: 1,
    title: "Championnat par équipe - Journée 4 Phase 1",
    date: "20 Octobre 2024",
    location: "Salle du club",
    description: "Venez nombreux encourager nos équipes lors de la 4ème journée du championnat par équipe. Ambiance garantie et matchs de haut niveau en perspective !",
    link: "/actualites/championnat-journee-4",
    image: "/images/actualites/championnat-equipe-journee-4-phase-1.jpg",
  },
  {
    id: 2,
    title: "Tournoi Régional Saint-Loub'Ping 2026",
    date: "15 Février 2026",
    location: "Gymnase de Saint-Loubès",
    description: "Préparez vos raquettes ! Notre tournoi régional annuel revient avec de nouvelles catégories et de nombreux lots à gagner. Inscriptions ouvertes prochainement.",
    link: "/tournoi-inscription",
    image: "/images/actualites/Gemini_Generated_Image_mlgzatmlgzatmlgz.png",
  },
  {
    id: 3,
    title: "Assemblée Générale Annuelle du Club",
    date: "25 Septembre 2025",
    location: "Club House",
    description: "Tous les membres sont invités à l'Assemblée Générale pour faire le bilan de la saison passée et discuter des projets futurs. Votre présence est essentielle !",
    link: "/actualites/assemblee-generale",
    image: "/images/actualites/FB_IMG_1759672948691.jpg",
  },
  {
    id: 4,
    title: "Championnat par équipe - Journée 3 Phase 1",
    date: "06 Octobre 2024",
    location: "Salle du club",
    description: "Retour sur la 3ème journée du championnat par équipe. Des matchs intenses et de belles performances de nos joueurs. Découvrez les résultats détaillés !",
    link: "/actualites/championnat-journee-3",
    image: "/images/actualites/championnat-equipe-journee-3-phase-1.png",
  },
];

const eventItems = [
  {
    id: 1,
    title: "Portes Ouvertes du Club",
    date: "02 Septembre 2025",
    time: "14h00 - 18h00",
    location: "Salle du club",
    description: "Venez découvrir le tennis de table, essayer nos tables et rencontrer nos entraîneurs. Initiation gratuite pour tous !",
    image: "/images/actualites/FB_IMG_1759672898128.jpg",
  },
  {
    id: 2,
    title: "Stage de Perfectionnement Jeunes",
    date: "20-24 Août 2025",
    time: "Toute la journée",
    location: "Salle du club",
    description: "Un stage intensif pour les jeunes compétiteurs souhaitant améliorer leur technique et leur stratégie. Encadrement par nos meilleurs entraîneurs.",
    image: "/images/actualites/FB_IMG_1759672983725.jpg",
  },
  {
    id: 3,
    title: "Soirée des Bénévoles",
    date: "10 Décembre 2025",
    time: "19h00",
    location: "Club House",
    description: "Une soirée conviviale pour remercier tous les bénévoles qui œuvrent pour le club. Repas et animations au programme !",
    image: "/images/actualites/559050727_785921184279805_5144790509263314206_n.jpg",
  },
];

const Accueil = () => {
  const { openLightbox } = useLightbox();

  return (
    <div className="bg-clubLight text-clubLight-foreground">
      {/* Hero Section */}
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
          <div className="text-center mt-8">
            <Button asChild className="bg-clubPrimary hover:bg-clubPrimary/90 text-clubPrimary-foreground px-8 py-4 text-lg rounded-md shadow-lg">
              <Link to="/actualites">Voir toutes les actualités</Link>
            </Button>
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
                    <Link to="#">En savoir plus</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>

        {/* Rejoignez-nous Section */}
        <section className="text-center mb-12">
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

        {/* Suivez-nous Section */}
        <section className="text-center">
          <Card className="bg-clubLight shadow-lg p-8 rounded-xl">
            <CardTitle className="text-2xl text-clubDark mb-4">Suivez-nous sur les réseaux sociaux !</CardTitle>
            <CardContent>
              <p className="mb-6 text-clubLight-foreground">
                Restez connecté avec le club et ne manquez aucune actualité, événement ou résultat.
              </p>
              <div className="flex justify-center space-x-6">
                <a href="https://www.facebook.com/votrepageclub" target="_blank" rel="noopener noreferrer" className="text-clubPrimary hover:text-clubPrimary/80 transition-colors">
                  <Facebook size={40} />
                </a>
                {/* Ajoutez d'autres icônes de réseaux sociaux si nécessaire */}
              </div>
              {/* Pour intégrer un flux Facebook dynamique (timeline de page), vous devrez utiliser le "Page Plugin" de Facebook.
                  1. Rendez-vous sur https://developers.facebook.com/docs/plugins/page-plugin/
                  2. Configurez votre plugin avec l'URL de votre page Facebook et les options souhaitées.
                  3. Copiez le code HTML (généralement un iframe) et collez-le ici.
                  Exemple (remplacez YOUR_FACEBOOK_PAGE_URL par l'URL de votre page) :
                  <div className="mt-8">
                    <iframe
                      src="https://www.facebook.com/plugins/page.php?href=YOUR_FACEBOOK_PAGE_URL&tabs=timeline&width=340&height=500&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId"
                      width="340"
                      height="500"
                      style={{ border: 'none', overflow: 'hidden' }}
                      scrolling="no"
                      frameBorder="0"
                      allowFullScreen={true}
                      allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                    ></iframe>
                  </div>
              */}
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default Accueil;