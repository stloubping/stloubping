import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"; // Import Dialog components

const teams = [
  { name: "Équipe 1", division: "Régionale 2", captain: "Wesley" },
  { name: "Équipe 2", division: "Pré-régionale", captain: "Vincent" },
  { name: "Équipe 3", division: "Départementale 2", captain: "Yanick" },
  { name: "Équipe 4", division: "Départementale 2", captain: "Patrice" },
  { name: "Équipe 5", division: "Départementale 3", captain: "Pierre" },
  { name: "Équipe 6", division: "Départementale 4", captain: "Olivier" },
];

const matchCalendar = [
  { date: "20/10/2024", opponent: "TT Villeurbanne", team: "Équipe A", location: "Extérieur", result: "À venir" },
  { date: "27/10/2024", opponent: "ASPTT Lyon", team: "Équipe B", location: "Domicile", result: "À venir" },
  { date: "03/11/2024", opponent: "MJC Rillieux", team: "Équipe C", location: "Extérieur", result: "À venir" },
];

const recentMatchResults = [
  {
    id: 1,
    image: "https://picsum.photos/400/300?random=match1", // Updated to placeholder
    alt: "Équipe St Loub Ping 4",
    result: "Égalité 7-7 contre C STE HELENE 4",
  },
  {
    id: 2,
    image: "https://picsum.photos/400/300?random=match2", // Updated to placeholder
    alt: "Équipe St Loub Ping 2",
    result: "Défaite 11-3 contre US CENON 5",
  },
  {
    id: 3,
    image: "https://picsum.photos/400/300?random=match3", // Updated to placeholder
    alt: "Équipe St Loub Ping 5",
    result: "Défaite 11-3 contre LE HAILLAN TT 7",
  },
  {
    id: 4,
    image: "https://picsum.photos/400/300?random=match4", // Updated to placeholder
    alt: "Équipe St Loub Ping 6",
    result: "Victoire 12-2 contre TT FARGUIAIS 4",
  },
];

const CompetitionsEquipes = () => {
  return (
    <div className="container mx-auto px-4 py-8 bg-clubLight text-clubLight-foreground">
      <h1 className="text-4xl font-bold text-center mb-12 text-clubDark">Compétitions & Équipes</h1>

      <section className="mb-12">
        <Card className="bg-clubLight shadow-lg rounded-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-clubDark">Nos Équipes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
          </CardContent>
        </Card>
      </section>

      {/* Calendrier des Compétitions Section */}
      <section className="mb-12">
        <Card className="bg-clubLight shadow-lg rounded-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-clubDark text-center">Calendrier des Compétitions 2025-2026</CardTitle>
          </CardHeader>
          <CardContent>
            <Dialog>
              <DialogTrigger asChild>
                <img
                  src="/images/schedule/match-calendar-2025-2026.jpg"
                  alt="Calendrier des Compétitions 2025-2026"
                  className="w-full h-auto object-contain rounded-lg shadow-md max-h-96 mx-auto cursor-zoom-in hover:opacity-80 transition-opacity duration-200"
                />
              </DialogTrigger>
              <DialogContent className="max-w-6xl bg-background p-6 rounded-lg">
                <img
                  src="/images/schedule/match-calendar-2025-2026.jpg"
                  alt="Calendrier des Compétitions 2025-2026"
                  className="w-full h-auto max-w-[90vw] max-h-[90vh] object-scale-down"
                />
              </DialogContent>
            </Dialog>
            <p className="mt-4 text-sm text-muted-foreground text-center">
              Retrouvez toutes les dates importantes des championnats et tournois de la saison. Cliquez sur l'image pour l'agrandir.
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="mb-12">
        <Card className="bg-clubLight shadow-lg rounded-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-clubDark">Calendrier des Matchs</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="bg-clubDark text-clubDark-foreground hover:bg-clubDark">
                  <TableHead className="text-clubDark-foreground">Date</TableHead>
                  <TableHead className="text-clubDark-foreground">Adversaire</TableHead>
                  <TableHead className="text-clubDark-foreground">Équipe</TableHead>
                  <TableHead className="text-clubDark-foreground">Lieu</TableHead>
                  <TableHead className="text-clubDark-foreground">Résultat</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {matchCalendar.map((match, index) => (
                  <TableRow key={index} className="text-clubLight-foreground">
                    <TableCell className="font-medium">{match.date}</TableCell>
                    <TableCell>{match.opponent}</TableCell>
                    <TableCell>{match.team}</TableCell>
                    <TableCell>{match.location}</TableCell>
                    <TableCell>{match.result}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>

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
                    <img src={match.image} alt={match.alt} className="w-full h-auto object-cover rounded-md mb-4" />
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