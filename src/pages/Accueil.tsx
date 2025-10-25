"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, MapPin, Facebook, Loader2 } from "lucide-react"; // Import Facebook and Loader2 icon
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { showError } from '@/utils/toast';

const newsItems = [
  {
    id: 1,
    title: "Tournoi de Printemps 2025",
    date: "15 Mai 2025",
    location: "Salle Omnisports, Ville",
    description: "Inscrivez-vous dès maintenant pour notre tournoi annuel de printemps ! Catégories jeunes et adultes.",
    link: "/tournois",
    image: "/images/actualites/FB_IMG_1759672983725.jpg" // Ajout de l'image
  },
  {
    id: 2,
    title: "Cours d'été pour débutants",
    date: "1er Juillet 2025",
    location: "Club de Tennis de Table",
    description: "Découvrez le tennis de table avec nos cours intensifs d'été. Tous niveaux acceptés.",
    link: "/cours",
    image: "/images/actualites/FB_IMG_1759672948691.jpg" // Ajout de l'image
  },
  {
    id: 3,
    title: "Assemblée Générale Annuelle",
    date: "20 Septembre 2025",
    location: "Maison des Associations",
    description: "Venez participer aux décisions importantes de la vie du club. Votre avis compte !",
    link: "/evenements",
    image: "/images/actualites/FB_IMG_1759672898128.jpg" // Ajout de l'image
  },
];

const eventItems = [
  {
    id: 1,
    title: "Match de Championnat Régional",
    date: "22 Juin 2025",
    time: "14:00",
    location: "Gymnase Municipal",
    description: "Venez soutenir notre équipe première lors de ce match crucial pour le maintien !",
  },
  {
    id: 2,
    title: "Journée Portes Ouvertes",
    date: "6 Septembre 2025",
    time: "10:00 - 17:00",
    location: "Club de Tennis de Table",
    description: "Découvrez nos installations, rencontrez nos entraîneurs et essayez le tennis de table gratuitement.",
  },
];

interface FacebookPost {
  message: string;
  permalink_url: string;
  created_time: string;
}

const Accueil = () => {
  const [latestFacebookPost, setLatestFacebookPost] = useState<FacebookPost | null>(null);
  const [loadingFacebookPost, setLoadingFacebookPost] = useState(true);

  useEffect(() => {
    const fetchLatestFacebookPost = async () => {
      setLoadingFacebookPost(true);
      try {
        const { data, error } = await supabase.functions.invoke('get-latest-facebook-post');

        if (error) {
          console.error("Error fetching latest Facebook post:", error);
          showError("Erreur lors du chargement du dernier post Facebook.");
          setLatestFacebookPost(null);
        } else if (data && data.latestPost) {
          setLatestFacebookPost(data.latestPost);
        } else {
          setLatestFacebookPost(null);
        }
      } catch (err) {
        console.error("Unexpected error fetching Facebook post:", err);
        showError("Une erreur inattendue est survenue lors du chargement du post Facebook.");
        setLatestFacebookPost(null);
      } finally {
        setLoadingFacebookPost(false);
      }
    };

    fetchLatestFacebookPost();
  }, []);

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
            <Card key={news.id} className="bg-clubLight shadow-lg rounded-xl overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <img src={news.image} alt={news.title} className="w-full h-48 object-cover" /> {/* Ajout de l'image */}
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-clubPrimary">{news.title}</CardTitle>
                <CardDescription className="flex items-center text-clubGray mt-2">
                  <CalendarDays className="mr-2 h-4 w-4" /> {news.date}
                </CardDescription>
                <CardDescription className="flex items-center text-clubGray">
                  <MapPin className="mr-2 h-4 w-4" /> {news.location}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-clubDarker">{news.description}</p>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full bg-clubSecondary hover:bg-clubPrimary text-white">
                  <Link to={news.link}>En savoir plus</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* Dernier Post Facebook Section */}
      <section className="py-16 px-4 md:px-8 lg:px-16 bg-clubSection text-clubDark">
        <h2 className="text-3xl font-bold text-center mb-8">Dernier Post Facebook</h2>
        <div className="max-w-2xl mx-auto">
          {loadingFacebookPost ? (
            <div className="flex justify-center items-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-clubPrimary" />
              <p className="ml-2 text-clubDark">Chargement du post Facebook...</p>
            </div>
          ) : latestFacebookPost ? (
            <Card className="bg-clubLight shadow-lg rounded-xl overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-clubPrimary">
                  {latestFacebookPost.message ? latestFacebookPost.message.substring(0, 100) + '...' : 'Nouveau post sur Facebook !'}
                </CardTitle>
                <CardDescription className="flex items-center text-clubGray mt-2">
                  <CalendarDays className="mr-2 h-4 w-4" /> {new Date(latestFacebookPost.created_time).toLocaleDateString('fr-FR')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-clubDarker line-clamp-3">{latestFacebookPost.message}</p>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full bg-[#1877F2] hover:bg-[#1877F2]/90 text-white">
                  <a href={latestFacebookPost.permalink_url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
                    <Facebook className="mr-2 h-4 w-4" /> Voir le post sur Facebook
                  </a>
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <p className="text-center text-muted-foreground">Impossible de charger le dernier post Facebook pour le moment.</p>
          )}
        </div>
      </section>

      {/* Prochains Événements Section */}
      <section className="bg-clubDark py-16 px-4 md:px-8 lg:px-16 text-white">
        <h2 className="text-3xl font-bold text-center mb-8">Prochains Événements</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {eventItems.map((event) => (
            <Card key={event.id} className="bg-clubLight shadow-lg rounded-xl overflow-hidden text-clubDark">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-clubPrimary">{event.title}</CardTitle>
                <CardDescription className="flex items-center text-clubGray mt-2">
                  <CalendarDays className="mr-2 h-4 w-4" /> {event.date} à {event.time}
                </CardDescription>
                <CardDescription className="flex items-center text-clubGray">
                  <MapPin className="mr-2 h-4 w-4" /> {event.location}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-clubDarker">{event.description}</p>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-clubSecondary hover:bg-clubPrimary text-white">
                  Détails
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* Facebook Section (existing, kept for the main link) */}
      <section className="py-16 px-4 md:px-8 lg:px-16 text-center bg-clubLighter">
        <h2 className="text-3xl font-bold text-clubDark mb-8">Suivez-nous sur Facebook !</h2>
        <p className="text-lg text-clubDarker mb-8 max-w-2xl mx-auto">
          Restez connecté avec toutes les dernières nouvelles, photos et événements de notre club.
        </p>
        <Button asChild className="bg-[#1877F2] hover:bg-[#1877F2]/90 text-white text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
          <a href="https://www.facebook.com/p/Saint-LoubPing-100085857905183/?locale=fr_FR" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
            <Facebook className="mr-3 h-6 w-6" /> Notre Page Facebook
          </a>
        </Button>
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