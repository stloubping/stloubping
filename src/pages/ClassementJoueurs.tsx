import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ExternalLink } from 'lucide-react';

// Données de classement enrichies (simulées)
const playersRankings = [
  { name: "Jean Dupont", license: "1234567", officialPoints: 1850, monthlyPoints: 1852.34, category: "Régional" },
  { name: "Marie Curie", license: "7654321", officialPoints: 1520, monthlyPoints: 1518.90, category: "Départemental" },
  { name: "Pierre Martin", license: "9876543", officialPoints: 1280, monthlyPoints: 1285.12, category: "Départemental" },
  { name: "Sophie Dubois", license: "1122334", officialPoints: 1010, monthlyPoints: 1008.76, category: "Départemental" },
  { name: "Lucas Petit", license: "4455667", officialPoints: 890, monthlyPoints: 893.05, category: "Loisir" },
  { name: "Chloé Bernard", license: "7788990", officialPoints: 750, monthlyPoints: 748.50, category: "Loisir" },
  { name: "Antoine Leclerc", license: "2345678", officialPoints: 1600, monthlyPoints: 1605.20, category: "Régional" },
  { name: "Emma Moreau", license: "8765432", officialPoints: 1350, monthlyPoints: 1347.88, category: "Départemental" },
  { name: "Hugo Girard", license: "3456789", officialPoints: 950, monthlyPoints: 955.60, category: "Loisir" },
  { name: "Léa Lefevre", license: "9876123", officialPoints: 1100, monthlyPoints: 1102.15, category: "Départemental" },
];

const ClassementJoueurs = () => {
  const ffttClubNumber = "10330022";
  // Mise à jour du lien vers la page générale des classements départementaux de la FFTT
  const ffttRankingLink = "https://www.fftt.com/site/competition/classement/classement-departemental";

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
              Vous pouvez consulter les classements généraux directement sur leur site.
            </p>
            <Button asChild className="bg-clubPrimary hover:bg-clubPrimary/90 text-clubPrimary-foreground px-8 py-4 text-lg rounded-md shadow-lg">
              <a href={ffttRankingLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
                Voir les classements FFTT <ExternalLink className="ml-2 h-5 w-5" />
              </a>
            </Button>
            <p className="mt-4 text-sm text-muted-foreground">
              (Numéro de club FFTT : {ffttClubNumber}. Le lien ci-dessus mène à la page générale des classements départementaux, car un lien direct vers le classement spécifique de notre club n'est pas disponible sur le site de la FFTT.)
            </p>
          </CardContent>
        </Card>
      </section>

      <section>
        <h2 className="text-3xl font-bold text-center mb-8 text-clubDark">Classement de nos joueurs</h2>
        <Card className="bg-clubLight shadow-lg rounded-xl">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-clubDark text-clubDark-foreground hover:bg-clubDark">
                    <TableHead className="text-clubDark-foreground">Nom</TableHead>
                    <TableHead className="text-clubDark-foreground text-center">Licence</TableHead>
                    <TableHead className="text-clubDark-foreground text-center">Points Officiels</TableHead>
                    <TableHead className="text-clubDark-foreground text-center">Points Mensuels</TableHead>
                    <TableHead className="text-clubDark-foreground text-center">Catégorie</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {playersRankings.map((player, index) => (
                    <TableRow key={index} className="even:bg-clubSection/20 odd:bg-clubLight hover:bg-clubSection/40 transition-colors duration-200 border-b border-border">
                      <TableCell className="font-medium text-clubDark">{player.name}</TableCell>
                      <TableCell className="text-center text-clubLight-foreground">{player.license}</TableCell>
                      <TableCell className="text-center text-clubLight-foreground">{player.officialPoints}</TableCell>
                      <TableCell className="text-center text-clubLight-foreground">{player.monthlyPoints}</TableCell>
                      <TableCell className="text-center text-clubLight-foreground">{player.category}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default ClassementJoueurs;