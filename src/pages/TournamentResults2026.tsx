"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Trophy, Medal, Users, Star } from 'lucide-react';

const results = [
  {
    tableau: "Tableau 1: -799",
    winner: "Antoine PHILIPPE",
    finalist: "Samuel ALLAIN LACOSTE",
    icon: <Trophy className="h-6 w-6 text-yellow-500" />
  },
  {
    tableau: "Tableau 2: -1399",
    winner: "Alexandre GUISSET",
    finalist: "Titouan RASTELLO",
    icon: <Trophy className="h-6 w-6 text-yellow-500" />
  },
  {
    tableau: "Tableau 3: -999",
    winner: "Tom LEDOUX",
    finalist: "Mathis BOUDY",
    icon: <Trophy className="h-6 w-6 text-yellow-500" />
  },
  {
    tableau: "Tableau 4: -1599",
    winner: "Ziad OSMANI",
    finalist: "Cizia GUINARD",
    icon: <Trophy className="h-6 w-6 text-yellow-500" />
  },
  {
    tableau: "Tableau 5: -1199",
    winner: "Quentin ROUAUX",
    finalist: "Kamille RENAUD",
    icon: <Trophy className="h-6 w-6 text-yellow-500" />
  },
  {
    tableau: "Tableau 6: Non numéroté",
    winner: "Malik DERRAB",
    finalist: "Zhuangzhuang WANG",
    icon: <Trophy className="h-6 w-6 text-yellow-500" />
  },
  {
    tableau: "Tableau 7: Doubles",
    winner: "Alexandre GUISSET & Ziad OSMANI",
    finalist: "Romain FOUCHET & Thomas BOS",
    icon: <Users className="h-6 w-6 text-clubPrimary" />
  }
];

const TournamentResults2026 = () => {
  return (
    <div className="container mx-auto px-4 py-8 bg-clubLight text-clubLight-foreground">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-clubDark mb-4">Palmarès - Édition 2026</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Félicitations à tous les participants et particulièrement aux vainqueurs de cette édition exceptionnelle du tournoi régional de Saint-Loubès.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {results.map((res, index) => (
          <Card key={index} className="bg-clubLight shadow-lg border-clubPrimary/10 hover:border-clubPrimary/30 transition-all duration-300 overflow-hidden">
            <CardHeader className="bg-clubSection/50 pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-bold text-clubDark">{res.tableau}</CardTitle>
                {res.icon}
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-yellow-100 p-2 rounded-full">
                  <Star className="h-4 w-4 text-yellow-600" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Vainqueur</p>
                  <p className="text-lg font-bold text-clubPrimary">{res.winner}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-gray-100 p-2 rounded-full">
                  <Medal className="h-4 w-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Finaliste</p>
                  <p className="text-base font-semibold text-clubDark">{res.finalist}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <section className="text-center">
        <Card className="bg-clubDark text-white p-8 rounded-xl shadow-xl">
          <CardTitle className="text-2xl mb-4">Merci à tous !</CardTitle>
          <CardContent>
            <p className="text-gray-300">
              Le club remercie l'ensemble des joueurs, les bénévoles et nos partenaires pour la réussite de cet événement. 
              Rendez-vous l'année prochaine pour une nouvelle édition riche en émotions !
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default TournamentResults2026;