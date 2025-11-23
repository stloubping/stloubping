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

const recentMatchResults = [
  {
    id: 5,
    image: "/images/actualites/561695574_777489311789659_3783358259365139184_n.jpg",
    alt: "Équipe St Loub Ping 1",
    result: "Victoire 9-5 contre CA BEGLAIS 4",
    title: "Équipe 1 Régionale 2",
  },
  {
    id: 2,
    image: "/images/actualites/equipe-2-pre-regionale.png",
    alt: "Équipe St Loub Ping 2",
    result: "Défaite 11-3 contre US CENON 5",
    title: "Équipe 2 Pré-régionale",
  },
  {
    id: 6,
    image: "https://picsum.photos/400/300?random=match6",
    alt: "Équipe St Loub Ping 3",
    result: "Exempt",
    title: "Équipe 3 Départementale 2",
  },
  {
    id: 1,
    image: "/images/actualites/561606494_777489285122995_5427379147122871235_n.jpg",
    alt: "Équipe St Loub Ping 4",
    result: "Égalité 7-7 contre C STE HELENE 4",
    title: "Équipe 4 Départementale 2",
  },
  {
    id: 3,
    image: "/images/actualites/559465112_777489365122987_5984336681092815830_n.jpg",
    alt: "Équipe St Loub Ping 5",
    result: "Défaite 11-3 contre LE HAILLAN TT 7",
    title: "Équipe 5 Départementale 3",
  },
  {
    id: 4,
    image: "/images/actualites/equipe-6-departementale-4.png",
    alt: "Équipe St Loub Ping 6",
    result: "Victoire 12-2 contre TT FARGUIAIS 4",
    title: "Équipe 6 Départementale 4",
  },
];

const CompetitionsEquipes = () => {
  const { openLightbox } = useLightbox();

  return (
    <div className="container mx-auto px-4 py-8 bg-clubLight text-clubLight-foreground">
      <h1 className="text-4xl font-bold text-center mb-12 text-clubDark">Compétitions & Équipes</h1>

      {/* Section des classements détaillés (maintenue) */}
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

      <section className="mb-12">
        <Card className="bg-clubLight shadow-lg rounded-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-clubDark">Derniers Résultats des Matchs (Photos)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {recentMatchResults.map((match) => (
                <Card key={match.id} className="bg-clubLight shadow-md rounded-lg text-center">
                  <CardContent className="p-4">
                    {match.title && (
                      <h3 className="text-xl font-semibold text-clubPrimary mb-3">{match.title}</h3>
                    )}
                    <img
                      src={match.image}
                      alt={match.alt}
                      className="w-full h-auto object-cover rounded-md mb-4 cursor-zoom-in"
                      onClick={() => openLightbox(match.image)}
                    />
                    <p className="text-lg font-semibold text-clubDark">{match.result}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <p className="mt-6 text-sm text-muted-foreground text-center">
              Retrouvez les feuilles de matchs détaillées dans la section "Résultats et Feuilles de Rencontres".
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default CompetitionsEquipes;