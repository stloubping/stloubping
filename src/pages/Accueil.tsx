"use client";

import React from 'react';
// Importations commentées pour le débogage
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { CalendarDays, MapPin, Facebook } from "lucide-react";
// import { Link } from 'react-router-dom';
// import NewsCard from "@/components/NewsCard";
// import { useLightbox } from '@/context/LightboxContext';

// Données commentées pour le débogage
// const newsItems = [...];
// const eventItems = [...];

const Accueil = () => {
  // const { openLightbox } = useLightbox(); // Commenté pour le débogage

  return (
    <div className="min-h-screen bg-gradient-to-br from-clubLight to-clubLighter text-clubDark p-8">
      <h1 className="text-4xl font-bold text-center text-clubPrimary">Débogage en cours : Accueil simplifié</h1>
      <p className="text-center mt-4 text-clubDark">Si vous voyez ce message, le problème n'est pas dans le squelette de la page d'accueil.</p>
    </div>
  );
};

export default Accueil;