import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useLightbox } from '@/context/LightboxContext';
import TeamRankingIframe from '@/components/TeamRankingIframe'; // Import the new component

// Définition des équipes avec les informations nécessaires pour Pingpocket
const teams = [
  { id: "equipe-1", name: "Équipe 1", division: "Régionale 2", captain: "Wesley", number: 1, championship: "masculin" as const },
  { id: "equipe-2", name: "Équipe 2", division: "Pré-régionale", captain: "Vincent", number: 2, championship: "masculin" as const },
  { id: "equipe-3", name: "Équipe 3", division: "Départementale 2", captain: "Yanick", number: 3, championship: "masculin" as const },
  { id: "equipe-4", name: "Équipe 4", division: "Départementale 2", captain: "Patrice", number: 4, championship: "masculin" as const },
  { id: "equipe-5", name: "Équipe 5", division: "Départementale 3", captain: "Olivier", number: 5, championship: "masculin" as const },
  { id: "equipe-6", name: "Équipe 6", division: "Départementale 4", captain: "Pierre", number: 6, championship: "masculin" as const },
];

// Suppression de la liste `recentMatchResults` car elle n'est plus utilisée.

const CompetitionsEquipes = () => {
  const { openLightbox } = useLightbox();

  return (
    <div className="container mx-auto px-4 py-8 bg-clubLight text-clubLight-foreground">
      <h1 className="text-4xl font-bold text-center mb-12 text-clubDark">Compétitions & Équipes</h1>

      <section className="mb-12">
        <h2 className="text-3xl font-bold text-center mb-8 text-clubDark">Résultats et Classements Détaillés</h2>
        <Tabs defaultValue={teams[0].id} className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 h-auto bg-clubSection/50">
            {teams.map((team) => (
              <TabsTrigger 
                key={team.id} 
                value={team.id} 
                className="data-[state=active]:bg-clubPrimary data-[state=active]:text-clubPrimary-foreground text-clubDark font-semibold text-xs sm:text-sm p-2"
              >
                {team.name}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {teams.map((team) => (
            <TabsContent key={team.id} value={team.id} className="mt-6">
              <TeamRankingIframe 
                teamNumber={team.number} 
                championshipType={team.championship} 
                teamName={team.name} 
              />
            </TabsContent>
          ))}
        </Tabs>
      </section>
    </div>
  );
};

export default CompetitionsEquipes;