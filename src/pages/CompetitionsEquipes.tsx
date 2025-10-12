import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const teams = [
  { name: "Équipe A", division: "Régionale 1", captain: "Marc Dubois" },
  { name: "Équipe B", division: "Départementale 1", captain: "Sophie Lefevre" },
  { name: "Équipe C", division: "Départementale 2", captain: "Lucas Bernard" },
];

const players = [
  { name: "Félix Lebrun", ranking: "N°1 Français", equipment: "Bois : Tibhar Samsonov Carbon, Revêtement : Tibhar Evolution MX-P", image: "https://picsum.photos/150/150?random=6" },
  { name: "Alexis Lebrun", ranking: "N°2 Français", equipment: "Bois : Butterfly Viscaria, Revêtement : Butterfly Dignics 09C", image: "https://picsum.photos/150/150?random=7" },
  { name: "Simon Gauzy", ranking: "N°3 Français", equipment: "Bois : Cornilleau Gatien Absolum, Revêtement : Michelin Pilot Power", image: "https://picsum.photos/150/150?random=8" },
  { name: "Prithika Pavade", ranking: "N°1 Féminine", equipment: "Bois : Stiga Carbonado 145, Revêtement : Stiga DNA Platinum XH", image: "https://picsum.photos/150/150?random=9" },
];

const matchCalendar = [
  { date: "20/10/2024", opponent: "TT Villeurbanne", team: "Équipe A", location: "Extérieur", result: "À venir" },
  { date: "27/10/2024", opponent: "ASPTT Lyon", team: "Équipe B", location: "Domicile", result: "À venir" },
  { date: "03/11/2024", opponent: "MJC Rillieux", team: "Équipe C", location: "Extérieur", result: "À venir" },
];

const recentMatchResults = [
  {
    id: 1,
    image: "https://picsum.photos/800/600?random=21", // Placeholder for DYAD_ATTACHMENT_1
    alt: "Équipe St Loub Ping 4",
    result: "Égalité 7-7 contre C STE HELENE 4",
  },
  {
    id: 2,
    image: "https://picsum.photos/800/600?random=22", // Placeholder for DYAD_ATTACHMENT_2
    alt: "Équipe St Loub Ping 2",
    result: "Défaite 11-3 contre US CENON 5",
  },
  {
    id: 3,
    image: "https://picsum.photos/800/600?random=23", // Placeholder for DYAD_ATTACHMENT_3
    alt: "Équipe St Loub Ping 5",
    result: "Défaite 11-3 contre LE HAILLAN TT 7",
  },
  {
    id: 4,
    image: "https://picsum.photos/800/600?random=24", // Placeholder for DYAD_ATTACHMENT_4
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

      <section className="mb-12">
        <Card className="bg-clubLight shadow-lg rounded-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-clubDark">Profils des Joueurs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {players.map((player, index) => (
                <Card key={index} className="bg-clubLight shadow-md rounded-lg text-center">
                  <CardContent className="p-4">
                    <img src={player.image} alt={player.name} className="rounded-full mx-auto mb-4 w-24 h-24 object-cover border-2 border-clubPrimary" />
                    <h3 className="text-lg font-semibold text-clubDark">{player.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{player.ranking}</p>
                    <p className="text-xs text-clubLight-foreground">{player.equipment}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
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

      <section>
        <Card className="bg-clubLight shadow-lg rounded-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-clubDark">Résultats et Feuilles de Rencontres</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-clubLight-foreground">
              Retrouvez ici les résultats détaillés de toutes nos équipes ainsi que les feuilles de rencontres.
              Les mises à jour sont effectuées après chaque journée de championnat.
            </p>
            <img src="https://picsum.photos/800/600?random=20" alt="Jeunes joueurs en entraînement" className="w-full h-auto object-cover rounded-lg mb-6 shadow-md" /> {/* Placeholder for DYAD_ATTACHMENT_0 */}
            <ul className="list-disc list-inside space-y-2 text-clubLight-foreground">
              <li><a href="#" className="text-clubPrimary hover:underline">Résultats de la journée 1 (Régionale 1)</a></li>
              <li><a href="#" className="text-clubPrimary hover:underline">Feuille de rencontre Équipe B - Journée 2</a></li>
              <li><a href="#" className="text-clubPrimary hover:underline">Classements généraux</a></li>
            </ul>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default CompetitionsEquipes;