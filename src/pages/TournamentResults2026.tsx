"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Trophy, Award, Star } from 'lucide-react';

const TournamentResults2026 = () => {
  return (
    <div className="container mx-auto px-4 py-8 bg-clubLight text-clubLight-foreground">
      <h1 className="text-4xl font-bold text-center mb-12 text-clubDark">Résultats - Édition 2026</h1>

      <section className="mb-12">
        <Card className="max-w-4xl mx-auto bg-clubLight shadow-lg rounded-xl border-clubPrimary/20">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Trophy className="h-12 w-12 text-clubPrimary" />
            </div>
            <CardTitle className="text-2xl text-clubDark">Palmarès du Tournoi Régional 2026</CardTitle>
            <CardDescription>
              Les résultats seront affichés ici en direct le jour de la compétition (11 avril 2026).
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center py-12">
            <div className="space-y-6">
              <div className="p-6 bg-clubSection rounded-lg border border-dashed border-clubPrimary/30">
                <p className="text-lg italic text-muted-foreground">
                  Rendez-vous le 11 avril pour découvrir les vainqueurs de chaque tableau !
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                <div className="flex flex-col items-center p-4">
                  <Award className="h-8 w-8 text-yellow-500 mb-2" />
                  <span className="font-bold">Tableaux Individuels</span>
                  <span className="text-sm text-muted-foreground">6 catégories</span>
                </div>
                <div className="flex flex-col items-center p-4">
                  <Star className="h-8 w-8 text-clubPrimary mb-2" />
                  <span className="font-bold">Tableau Doubles</span>
                  <span className="text-sm text-muted-foreground">Moins de 2800 pts</span>
                </div>
                <div className="flex flex-col items-center p-4">
                  <Trophy className="h-8 w-8 text-blue-500 mb-2" />
                  <span className="font-bold">Challenge Club</span>
                  <span className="text-sm text-muted-foreground">Meilleure délégation</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default TournamentResults2026;