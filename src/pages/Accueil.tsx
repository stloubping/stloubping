"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, MapPin } from "lucide-react";
import { Link } from 'react-router-dom';

const newsItems = [
  {
    id: 1,
    title: "Tournoi de Printemps 2025",
    date: "15 Mai 2025",
    location: "Salle Omnisports, Ville",
    description: "Inscrivez-vous dès maintenant pour notre tournoi annuel de printemps ! Catégories jeunes et adultes.",
    link: "/tournois"
  },
  {
    id: 2,
    title: "Cours d'été pour débutants",
    date: "1er Juillet 2025",
    location: "Club de Tennis de Table",
    description: "Découvrez le tennis de table avec nos cours intensifs d'été. Tous niveaux acceptés.",
    link: "/cours"
  },
  {
    id: 3,
    title: "Assemblée Générale Annuelle",
    date: "20 Septembre 2025",
    location: "Maison des Associations",
    description: "Venez participer aux décisions importantes de la vie du club. Votre avis compte !",
    link: "/evenements"
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

const Accueil = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-clubLight to-clubLighter text-clubDark">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center text-center bg-cover bg-center" style={{ backgroundImage: "url('/images/hero-bg.jpg')" }}>
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