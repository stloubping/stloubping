import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ExternalLink } from 'lucide-react';

const playersRankings = [
  { name: "Jean Dupont", points: 1850, ranking: "Régional" },
  { name: "Marie Curie", points: 1520, ranking: "Départemental" },
  { name: "Pierre Martin", points: 1280, ranking: "Départemental" },
  { name: "Sophie Dubois", points: 1010, ranking: "Départemental" },
  { name: "Lucas Petit", points: 890, ranking: "Loisir" },
  { name: "Chloé Bernard", points: 750, ranking: "Loisir" },
];

const ClassementJoueurs = () => {
  const ffttClubNumber = "10330022";
  const ffttRankingLink = `https://www.fftt.com/sportif/classement?club=${ffttClubNumber}`;

  return (
    <div className="container mx-auto px-4 py-8 bg-clubLight text-clubLight-foreground">
      <h1 className="text-4xl font-bold text-center mb-12 text-clubDark">Classement des Joueurs</h1>

      <section className="mb-12">
        <Card className="bg-clubLight shadow-lg rounded-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-clubDark">Découvrez les Classements de Nos Joueurs</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-clubLight-foreground">
              Suivez les performances de nos adhérents et découvrez leur classement officiel.
              Que ce soit pour la compétition ou le loisir, chaque point compte !
            </p>
            <p className="mb-6 text-clubLight-foreground">
              Les classements sont mis à jour régulièrement par la Fédération Française de Tennis de Table (FFTT).
              Vous pouvez consulter le classement détaillé de notre club directement sur leur site.
            </p>
            <Button asChild className="bg-clubPrimary hover:bg-clubPrimary/90 text-clubPrimary-foreground px-8 py-4 text-lg rounded-md shadow-lg">
              <a href={ffttRankingLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
                Voir le classement FFTT <ExternalLink className="ml-2 h-5 w-5" />
              </a>
            </Button>
            <p className="mt-4 text-sm text-muted-foreground">
              (Numéro de club FFTT : {ffttClubNumber})
            </p>
          </CardContent>
        </Card>
      </section>

      <section>
        <h2 className="text-3xl font-bold text-center mb-8 text-clubDark">Quelques-uns de nos joueurs</h2>
        <Card className="bg-clubLight shadow-lg rounded-xl">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-clubDark text-clubDark-foreground hover:bg-clubDark">
                  <TableHead className="text-clubDark-foreground">Nom</TableHead>
                  <TableHead className="text-clubDark-foreground text-center">Points</TableHead>
                  <TableHead className="text-clubDark-foreground text-center">Catégorie</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {playersRankings.map((player, index) => (
                  <TableRow key={index} className="even:bg-clubSection/20 odd:bg-clubLight hover:bg-clubSection/40 transition-colors duration-200 border-b border-border">
                    <TableCell className="font-medium text-clubDark">{player.name}</TableCell>
                    <TableCell className="text-center text-clubLight-foreground">{player.points}</TableCell>
                    <TableCell className="text-center text-clubLight-foreground">{player.ranking}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default ClassementJoueurs;