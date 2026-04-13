"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Image as ImageIcon, Camera } from 'lucide-react';

const TournamentPhotos2026 = () => {
  return (
    <div className="container mx-auto px-4 py-8 bg-clubLight text-clubLight-foreground">
      <h1 className="text-4xl font-bold text-center mb-12 text-clubDark">Photos - Édition 2026</h1>

      <section className="mb-12">
        <Card className="max-w-4xl mx-auto bg-clubLight shadow-lg rounded-xl border-clubPrimary/20">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Camera className="h-12 w-12 text-clubPrimary" />
            </div>
            <CardTitle className="text-2xl text-clubDark">Galerie Photos 2026</CardTitle>
            <CardDescription>
              Retrouvez ici les meilleurs moments du tournoi après l'événement.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center py-12">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="w-24 h-24 bg-clubSection rounded-full flex items-center justify-center">
                <ImageIcon className="h-10 w-10 text-muted-foreground" />
              </div>
              <p className="text-lg text-muted-foreground max-w-md">
                L'album photo sera disponible quelques jours après la fin du tournoi. 
                Préparez vos plus beaux sourires (et vos plus beaux topspins) !
              </p>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default TournamentPhotos2026;