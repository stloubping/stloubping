import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useLightbox } from '@/context/LightboxContext';
import { Button } from "@/components/ui/button";
import { ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom'; // Import Link

const teams = [
  { name: "Équipe 1", division: "Régionale 2", captain: "Wesley" },
  { name: "Équipe 2", division: "Pré-régionale", captain: "Vincent" },
  { name: "Équipe 3", division: "Départementale 2", captain: "Yanick" },
  { name: "Équipe 4", division: "Départementale 2", captain: "Patrice" },
  { name: "Équipe 5", division: "Départementale 3", captain: "Olivier" },
  { name: "Équipe 6", division: "Départementale 4", captain: "Pierre" },
];

const matchCalendar = [
  { date: "20/10/2024", opponent: "TT Villeurbanne", team: "Équipe A", location: "Extérieur", result: "À venir" },
  { date: "27/10/2024", opponent: "ASPTT Lyon", team: "Équipe B", location: "Domicile", result: "À venir" },
  { date: "03/11/2024", opponent: "MJC Rillieux", team: "Équipe C", location: "Extérieur", result: "À venir" },
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
    id: 6, // Nouvelle entrée pour l'Équipe 3
    image: "https://picsum.photos/400/300?random=match6", // Image de remplacement
    alt: "Équipe St Loub Ping 3",
    result: "Exempt",
    title: "Équipe 3 Départementale 2",
  },
  {
    id: 1,
    image: "/images/actualites/561606494_777489285122995_5427379147122871235_n.jpg", // Chemin mis à jour
    alt: "Équipe St Loub Ping 4",
    result: "Égalité 7-7 contre C STE HELENE 4",
    title: "Équipe 4 Départementale 2",
  },
  {
    id: 3,
    image: "/images/actualites/559465112_777489365122987_5984336681092815830_n.jpg", // Chemin mis à jour
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

      <section className="mb-12">
        <Card className="bg-clubLight shadow-lg rounded-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-clubDark">Nos Équipes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {teams.map((team, index) => (
                <Card key={index} className="bg-clubLight shadow-md rounded-lg">
                  <CardHeader>
                    <CardTitle className="text-xl text-clubDark">{team.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-clubLight-foreground">
                    <p>Division: <span className="font-semibold">{team.division}</span></p>
                    <p>Capitaine: <span className="font-semibold">{team.captain}</span></p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="text-center mt-8">
              <Button asChild className="bg-clubPrimary hover:bg-clubPrimary/90 text-clubPrimary-foreground px-6 py-3 rounded-md text-lg font-medium transition-colors shadow-lg">
                <a href="https://www.pingpocket.fr/app/fftt/clubs/10330022/equipes" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
                  <ExternalLink className="mr-2 h-5 w-5" />
                  Liste des équipes (phase en cours)
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* La section Calendrier des Compétitions a été déplacée vers la page d'Accueil */}

      <section className="mb-12">
        <Card className="bg-clubLight shadow-lg rounded-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-clubDark">Derniers Résultats des Matchs</CardTitle>
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