"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Camera } from 'lucide-react';
import { useLightbox } from '@/context/LightboxContext';

const tournamentPhotos = [
  { id: 1, url: "/images/tournoi/2026/photo-1.jpg", alt: "Action de jeu tournoi 2026 - 1" },
  { id: 3, url: "/images/tournoi/2026/photo-3.jpg", alt: "Action de jeu tournoi 2026 - 3" },
  { id: 4, url: "/images/tournoi/2026/photo-4.jpg", alt: "Action de jeu tournoi 2026 - 4" },
  { id: 5, url: "/images/tournoi/2026/photo-5.jpg", alt: "Action de jeu tournoi 2026 - 5" },
  { id: 6, url: "/images/tournoi/2026/photo-6.jpg", alt: "Action de jeu tournoi 2026 - 6" },
  { id: 7, url: "/images/tournoi/2026/photo-7.jpg", alt: "Action de jeu tournoi 2026 - 7" },
  { id: 8, url: "/images/tournoi/2026/photo-8.jpg", alt: "Action de jeu tournoi 2026 - 8" },
  { id: 9, url: "/images/tournoi/2026/photo-9.jpg", alt: "Action de jeu tournoi 2026 - 9" },
  { id: 10, url: "/images/tournoi/2026/photo-10.jpg", alt: "Action de jeu tournoi 2026 - 10" },
  { id: 11, url: "/images/tournoi/2026/photo-11.jpg", alt: "Action de jeu tournoi 2026 - 11" },
  { id: 12, url: "/images/tournoi/2026/photo-12.jpg", alt: "Action de jeu tournoi 2026 - 12" },
  { id: 13, url: "/images/tournoi/2026/photo-13.jpg", alt: "Action de jeu tournoi 2026 - 13" },
  { id: 14, url: "/images/tournoi/2026/photo-14.jpg", alt: "Action de jeu tournoi 2026 - 14" },
  { id: 15, url: "/images/tournoi/2026/photo-15.jpg", alt: "Action de jeu tournoi 2026 - 15" },
  { id: 16, url: "/images/tournoi/2026/photo-16.jpg", alt: "Action de jeu tournoi 2026 - 16" },
  { id: 17, url: "/images/tournoi/2026/photo-17.jpg", alt: "Action de jeu tournoi 2026 - 17" },
  { id: 18, url: "/images/tournoi/2026/photo-18.jpg", alt: "Action de jeu tournoi 2026 - 18" },
  { id: 19, url: "/images/tournoi/2026/photo-19.jpg", alt: "Action de jeu tournoi 2026 - 19" },
  { id: 20, url: "/images/tournoi/2026/photo-20.jpg", alt: "Action de jeu tournoi 2026 - 20" },
  { id: 21, url: "/images/tournoi/2026/photo-21.jpg", alt: "Action de jeu tournoi 2026 - 21" },
  { id: 22, url: "/images/tournoi/2026/photo-22.jpg", alt: "Action de jeu tournoi 2026 - 22" },
  { id: 23, url: "/images/tournoi/2026/photo-23.jpg", alt: "Action de jeu tournoi 2026 - 23" },
  { id: 24, url: "/images/tournoi/2026/photo-24.jpg", alt: "Action de jeu tournoi 2026 - 24" },
  { id: 25, url: "/images/tournoi/2026/photo-25.jpg", alt: "Action de jeu tournoi 2026 - 25" },
  { id: 26, url: "/images/tournoi/2026/photo-26.jpg", alt: "Action de jeu tournoi 2026 - 26" },
  { id: 27, url: "/images/tournoi/2026/photo-27.jpg", alt: "Action de jeu tournoi 2026 - 27" },
  { id: 28, url: "/images/tournoi/2026/photo-28.jpg", alt: "Action de jeu tournoi 2026 - 28" },
  { id: 29, url: "/images/tournoi/2026/photo-29.jpg", alt: "Action de jeu tournoi 2026 - 29" },
  { id: 30, url: "/images/tournoi/2026/photo-30.jpg", alt: "Action de jeu tournoi 2026 - 30" },
  { id: 31, url: "/images/tournoi/2026/photo-31.jpg", alt: "Action de jeu tournoi 2026 - 31" },
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