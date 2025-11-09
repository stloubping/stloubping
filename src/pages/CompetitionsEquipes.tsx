"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CalendarDays, MapPin, Users } from "lucide-react";
import { useLightbox } from '@/context/LightboxContext';

// Définition des types pour la clarté
interface Match {
  id: number;
  team: string;
  division: string;
  opponent: string;
  date: string;
  time: string;
  location: 'Domicile' | 'Extérieur';
  result: 'Victoire' | 'Défaite' | 'Nul' | 'À venir';
  score?: string;
  image: string;
  alt: string;
  report?: string;
}

interface Phase {
  name: string;
  matches: Match[];
}

const phases: Phase[] = [
  {
    name: "Phase 1 - Saison 2025/2026",
    matches: [
      {
        id: 1,
        team: "Régionale 2 - Équipe 1",
        division: "Régionale 2",
        opponent: "TT Marmande 2",
        date: "14 Septembre 2025",
        time: "16h00",
        location: 'Extérieur',
        result: 'Victoire',
        score: '10 - 4',
        image: "/images/events/IMG-20251003-WA0001.jpg",
        alt: "Équipe 1 après leur victoire",
        report: "L'équipe 1 commence la saison avec une victoire convaincante à l'extérieur. Une performance solide de toute l'équipe.",
      },
      {
        id: 2,
        team: "Départementale 1 - Équipe 2",
        division: "D1",
        opponent: "ASPTT Bordeaux 3",
        date: "14 Septembre 2025",
        time: "16h00",
        location: 'Domicile',
        result: 'Défaite',
        score: '6 - 8',
        image: "/images/events/IMG-20251003-WA0002.jpg",
        alt: "Équipe 2 en pleine action",
        report: "Match serré pour l'équipe 2 qui s'incline de peu à domicile. De belles promesses pour les prochaines journées.",
      },
      {
        id: 3,
        team: "Départementale 3 - Équipe 3",
        division: "D3",
        opponent: "Cenon 4",
        date: "14 Septembre 2025",
        time: "16h00",
        location: 'Extérieur',
        result: 'Nul',
        score: '7 - 7',
        image: "/images/events/IMG-20251003-WA0003.jpg",
        alt: "Équipe 3 célébrant un point",
        report: "Un match nul mérité pour l'équipe 3 qui a su se battre jusqu'au bout pour arracher le point du match nul.",
      },
      {
        id: 4,
        team: "Régionale 2 - Équipe 1",
        division: "Régionale 2",
        opponent: "Pessac 1",
        date: "15 Novembre 2025",
        time: "16h00",
        location: 'Domicile',
        result: 'À venir',
        image: "/images/events/Generated Image November 09, 2025 - 3_07PM.png", // NOUVELLE IMAGE
        alt: "Équipe 1 prête pour la Journée 4",
      },
    ],
  },
  {
    name: "Phase 2 - Saison 2025/2026",
    matches: [
      {
        id: 5,
        team: "Régionale 2 - Équipe 1",
        division: "Régionale 2",
        opponent: "Adversaire à déterminer",
        date: "Février 2026",
        time: "16h00",
        location: 'Domicile',
        result: 'À venir',
        image: "/images/events/default-match.jpg",
        alt: "Match à venir",
      },
    ],
  },
];

const getResultClasses = (result: Match['result']) => {
  switch (result) {
    case 'Victoire':
      return 'bg-green-500 text-white';
    case 'Défaite':
      return 'bg-red-500 text-white';
    case 'Nul':
      return 'bg-yellow-500 text-gray-900';
    case 'À venir':
    default:
      return 'bg-gray-500 text-white';
  }
};

const CompetitionsEquipes = () => {
  const { openLightbox } = useLightbox();

  return (
    <div className="bg-clubLight min-h-screen py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-extrabold text-clubDark text-center mb-4">Compétitions par Équipes</h1>
        <p className="text-center text-lg text-clubLight-foreground mb-10">
          Suivez les résultats et le calendrier de nos équipes engagées dans les championnats régionaux et départementaux.
        </p>

        {phases.map((phase, index) => (
          <section key={index} className="mb-12">
            <h2 className="text-3xl font-bold text-clubPrimary border-b-4 border-clubPrimary pb-2 mb-8">{phase.name}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {phase.matches.map((match) => (
                <Card key={match.id} className="bg-white shadow-xl rounded-lg overflow-hidden transition-transform duration-300 hover:scale-[1.02]">
                  <CardHeader className="p-4 pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl font-bold text-clubDark">{match.team}</CardTitle>
                      <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getResultClasses(match.result)}`}>
                        {match.result}
                      </span>
                    </div>
                    <CardDescription className="text-clubLight-foreground/80 mt-1">{match.division}</CardDescription>
                  </CardHeader>
                  
                  <CardContent className="p-4 pt-0">
                    <div className="flex items-center text-clubDarker mb-2">
                      <Users className="mr-2 h-4 w-4 text-clubSecondary" />
                      <span className="font-medium">vs {match.opponent}</span>
                    </div>
                    <div className="flex items-center text-clubDarker mb-2">
                      <CalendarDays className="mr-2 h-4 w-4 text-clubSecondary" />
                      {match.date} à {match.time}
                    </div>
                    <div className="flex items-center text-clubDarker mb-4">
                      <MapPin className="mr-2 h-4 w-4 text-clubSecondary" />
                      {match.location === 'Domicile' ? (
                        <span className="font-semibold text-clubPrimary">À Domicile (Salle du club)</span>
                      ) : (
                        <span>À l'Extérieur</span>
                      )}
                    </div>

                    {match.image && (
                      <img
                        src={match.image}
                        alt={match.alt}
                        className="w-full h-auto object-cover rounded-md mb-4 cursor-zoom-in"
                        onClick={() => openLightbox(match.image)}
                      />
                    )}

                    {match.score && (
                      <div className="text-center mb-4">
                        <p className="text-3xl font-extrabold text-clubDark">{match.score}</p>
                      </div>
                    )}

                    {match.report && (
                      <>
                        <Separator className="my-3 bg-clubSecondary/50" />
                        <h4 className="text-lg font-semibold text-clubDark mb-2">Résumé du match</h4>
                        <p className="text-sm text-clubDarker italic">{match.report}</p>
                      </>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};

export default CompetitionsEquipes;