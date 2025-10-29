"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

// Dummy data for teams
const teams = [
  {
    id: '1',
    name: 'Équipe A',
    division: 'Nationale 1',
    captain: 'Olivier Dupont', // Le nom du capitaine a été changé ici
    players: ['Joueur 1', 'Joueur 2', 'Joueur 3', 'Joueur 4'],
  },
  {
    id: '2',
    name: 'Équipe B',
    division: 'Régionale 2',
    captain: 'Marie Curie',
    players: ['Joueur 5', 'Joueur 6', 'Joueur 7', 'Joueur 8'],
  },
  {
    id: '3',
    name: 'Équipe C',
    division: 'Départementale 1',
    captain: 'Jean Valjean',
    players: ['Joueur 9', 'Joueur 10', 'Joueur 11', 'Joueur 12'],
  },
];

const CompetitionsEquipes: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-extrabold text-center text-clubPrimary mb-10">Compétitions par Équipes</h1>

      <section className="mb-12">
        <h2 className="text-3xl font-bold text-clubSecondary mb-6 text-center">Nos Équipes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teams.map((team) => (
            <Card key={team.id} className="bg-clubLight shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-clubPrimary">{team.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-gray-700 mb-2">Division: <span className="font-semibold text-clubAccent">{team.division}</span></p>
                <p className="text-lg text-gray-700 mb-4">Capitaine: <span className="font-semibold text-clubAccent">{team.captain}</span></p>
                <Separator className="my-4 bg-clubBorder" />
                <h3 className="text-xl font-bold text-clubPrimary mb-3">Joueurs:</h3>
                <ul className="list-disc list-inside text-gray-600">
                  {team.players.map((player, index) => (
                    <li key={index} className="mb-1">{player}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Add more sections for results, calendar, etc. */}
    </div>
  );
};

export default CompetitionsEquipes;