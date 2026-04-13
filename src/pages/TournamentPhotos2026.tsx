"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Camera } from 'lucide-react';
import { useLightbox } from '@/context/LightboxContext';

const tournamentPhotos = [
  { id: 1, url: "/images/tournoi/2026/photo-1.jpg", alt: "Action de jeu tournoi 2026 - 1" },
  { id: 2, url: "/images/tournoi/2026/photo-2.jpg", alt: "Action de jeu tournoi 2026 - 2" },
  { id: 3, url: "/images/tournoi/2026/photo-3.jpg", alt: "Action de jeu tournoi 2026 - 3" },
  { id: 4, url: "/images/tournoi/2026/photo-4.jpg", alt: "Action de jeu tournoi 2026 - 4" },
];

const TournamentPhotos2026 = () => {
  const { openLightbox } = useLightbox();

  return (
    <div className="container mx-auto px-4 py-8 bg-clubLight text-clubLight-foreground">
      <h1 className="text-4xl font-bold text-center mb-12 text-clubDark">Photos - Édition 2026</h1>

      <section className="mb-12">
        <Card className="max-w-6xl mx-auto bg-clubLight shadow-lg rounded-xl border-clubPrimary/20">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Camera className="h-12 w-12 text-clubPrimary" />
            </div>
            <CardTitle className="text-2xl text-clubDark">Galerie Photos 2026</CardTitle>
            <CardDescription>
              Revivez les meilleurs moments et les plus beaux échanges de cette édition.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {tournamentPhotos.map((photo) => (
                <div 
                  key={photo.id} 
                  className="relative aspect-video overflow-hidden rounded-lg shadow-md group cursor-zoom-in"
                  onClick={() => openLightbox(photo.url)}
                >
                  <img 
                    src={photo.url} 
                    alt={photo.alt} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="text-white text-sm font-medium bg-clubPrimary/80 px-3 py-1 rounded-full">Agrandir</span>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-8 text-center text-sm text-muted-foreground italic">
              D'autres photos seront ajoutées prochainement. Merci à nos photographes bénévoles !
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default TournamentPhotos2026;