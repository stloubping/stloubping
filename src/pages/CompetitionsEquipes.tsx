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
  { name: "Félix Lebrun", ranking: "N°1 Français", equipment: "Bois : Tibhar Samsonov Carbon, Revêtement : Tibhar Evolution MX-P", image: "https://via.placeholder.com/150/FF0000/FFFFFF?text=Félix+Lebrun" },
  { name: "Alexis Lebrun", ranking: "N°2 Français", equipment: "Bois : Butterfly Viscaria, Revêtement : Butterfly Dignics 09C", image: "https://via.placeholder.com/150/000000/FFFFFF?text=Alexis+Lebrun" },
  { name: "Simon Gauzy", ranking: "N°3 Français", equipment: "Bois : Cornilleau Gatien Absolum, Revêtement : Michelin Pilot Power", image: "https://via.placeholder.com/150/FF0000/FFFFFF?text=Simon+Gauzy" },
  { name: "Prithika Pavade", ranking: "N°1 Féminine", equipment: "Bois : Stiga Carbonado 145, Revêtement : Stiga DNA Platinum XH", image: "https://via.placeholder.com/150/000000/FFFFFF?text=Prithika+Pavade" },
];

const matchCalendar = [
  { date: "20/10/2024", opponent: "TT Villeurbanne", team: "Équipe A", location: "Extérieur", result: "À venir" },
  { date: "27/10/2024", opponent: "ASPTT Lyon", team: "Équipe B", location: "Domicile", result: "À venir" },
  { date: "03/11/2024", opponent: "MJC Rillieux", team: "Équipe C", location: "Extérieur", result: "À venir" },
];

const CompetitionsEquipes = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-12 text-clubBlack">Compétitions & Équipes</h1>

      <section className="mb-12">
        <Card className="bg-card shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-clubRed">Nos Équipes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {teams.map((team, index) => (
                <Card key={index} className="bg-secondary text-secondary-foreground shadow-md">
                  <CardHeader>
                    <CardTitle className="text-xl text-clubRed">{team.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
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
        <Card className="bg-card shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-clubRed">Profils des Joueurs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {players.map((player, index) => (
                <Card key={index} className="bg-secondary text-secondary-foreground shadow-md text-center">
                  <CardContent className="p-4">
                    <img src={player.image} alt={player.name} className="rounded-full mx-auto mb-4 w-24 h-24 object-cover border-2 border-clubRed" />
                    <h3 className="text-lg font-semibold text-clubBlack">{player.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{player.ranking}</p>
                    <p className="text-xs text-foreground">{player.equipment}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="mb-12">
        <Card className="bg-card shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-clubRed">Calendrier des Matchs</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="bg-clubBlack text-clubBlack-foreground hover:bg-clubBlack">
                  <TableHead className="text-clubRed-foreground">Date</TableHead>
                  <TableHead className="text-clubRed-foreground">Adversaire</TableHead>
                  <TableHead className="text-clubRed-foreground">Équipe</TableHead>
                  <TableHead className="text-clubRed-foreground">Lieu</TableHead>
                  <TableHead className="text-clubRed-foreground">Résultat</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {matchCalendar.map((match, index) => (
                  <TableRow key={index} className="text-foreground">
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

      <section>
        <Card className="bg-card shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-clubRed">Résultats et Feuilles de Rencontres</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-foreground">
              Retrouvez ici les résultats détaillés de toutes nos équipes ainsi que les feuilles de rencontres.
              Les mises à jour sont effectuées après chaque journée de championnat.
            </p>
            <ul className="list-disc list-inside space-y-2 text-foreground">
              <li><a href="#" className="text-clubRed hover:underline">Résultats de la journée 1 (Régionale 1)</a></li>
              <li><a href="#" className="text-clubRed hover:underline">Feuille de rencontre Équipe B - Journée 2</a></li>
              <li><a href="#" className="text-clubRed hover:underline">Classements généraux</a></li>
            </ul>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default CompetitionsEquipes;