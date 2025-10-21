import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ExternalLink } from 'lucide-react';

// Données de classement simulées pour un club complet, inspirées de PingPocket
// Ces données sont fictives et ne sont pas extraites en temps réel.
const playersRankings = [
  { rank: 1, name: "Dupont Jean", license: "1234567", club: "St Loub Ping", category: "Senior", officialPoints: 1850, monthlyPoints: 1852.34, rankChange: "+5", gender: "M" },
  { rank: 2, name: "Martin Pierre", license: "9876543", club: "St Loub Ping", category: "Junior", officialPoints: 1600, monthlyPoints: 1605.20, rankChange: "+10", gender: "M" },
  { rank: 3, name: "Leclerc Antoine", license: "2345678", club: "St Loub Ping", category: "Senior", officialPoints: 1520, monthlyPoints: 1518.90, rankChange: "+7", gender: "M" },
  { rank: 4, name: "Curie Marie", license: "7654321", club: "St Loub Ping", category: "Senior", officialPoints: 1400, monthlyPoints: 1401.50, rankChange: "-2", gender: "F" },
  { rank: 5, name: "Roux Philippe", license: "1000001", club: "St Loub Ping", category: "Vétéran", officialPoints: 1350, monthlyPoints: 1347.88, rankChange: "+1", gender: "M" },
  { rank: 6, name: "Wesley Smith", license: "1000008", club: "St Loub Ping", category: "Senior", officialPoints: 1300, monthlyPoints: 1300.90, rankChange: "NC", gender: "M" },
  { rank: 7, name: "Monteignies Jérémie", license: "1000006", club: "St Loub Ping", category: "Junior", officialPoints: 1200, monthlyPoints: 1201.00, rankChange: "-2", gender: "M" },
  { rank: 8, name: "Mounde Yves", license: "1000002", club: "St Loub Ping", category: "Vétéran", officialPoints: 1150, monthlyPoints: 1149.80, rankChange: "NC", gender: "M" },
  { rank: 9, name: "Michel Blanc", license: "1000010", club: "St Loub Ping", category: "Vétéran", officialPoints: 1100, monthlyPoints: 1100.50, rankChange: "+3", gender: "M" },
  { rank: 10, name: "Lefevre Léa", license: "9876123", club: "St Loub Ping", category: "Minime", officialPoints: 1100, monthlyPoints: 1102.15, rankChange: "NC", gender: "F" },
  { rank: 11, name: "Goux Olivier", license: "1000005", club: "St Loub Ping", category: "Senior", officialPoints: 1050, monthlyPoints: 1053.20, rankChange: "-3", gender: "M" },
  { rank: 12, name: "Dubois Sophie", license: "1122334", club: "St Loub Ping", category: "Senior", officialPoints: 1010, monthlyPoints: 1008.76, rankChange: "+6", gender: "F" },
  { rank: 13, name: "Gigaud Patrice", license: "1000003", club: "St Loub Ping", category: "Vétéran", officialPoints: 980, monthlyPoints: 982.10, rankChange: "NC", gender: "M" },
  { rank: 14, name: "Girard Hugo", license: "3456789", club: "St Loub Ping", category: "Benjamin", officialPoints: 950, monthlyPoints: 955.60, rankChange: "+4", gender: "M" },
  { rank: 15, name: "Vincent Dubois", license: "1000009", club: "St Loub Ping", category: "Junior", officialPoints: 900, monthlyPoints: 901.10, rankChange: "-1", gender: "M" },
  { rank: 16, name: "Petit Lucas", license: "4455667", club: "St Loub Ping", category: "Minime", officialPoints: 890, monthlyPoints: 893.05, rankChange: "+3", gender: "M" },
  { rank: 17, name: "Thuault Sandra", license: "1000004", club: "St Loub Ping", category: "Senior", officialPoints: 800, monthlyPoints: 799.50, rankChange: "NC", gender: "F" },
  { rank: 18, name: "Bernard Chloé", license: "7788990", club: "St Loub Ping", category: "Cadette", officialPoints: 750, monthlyPoints: 748.50, rankChange: "-1", gender: "F" },
  { rank: 19, name: "Durand Dominique", license: "1000007", club: "St Loub Ping", category: "Vétéran", officialPoints: 700, monthlyPoints: 702.40, rankChange: "+1", gender: "M" },
  { rank: 20, name: "Yann Dupont", license: "1000011", club: "St Loub Ping", category: "Cadet", officialPoints: 650, monthlyPoints: 651.20, rankChange: "NC", gender: "M" },
  { rank: 21, name: "Antoine Giraud", license: "1000012", club: "St Loub Ping", category: "Minime", officialPoints: 550, monthlyPoints: 550.80, rankChange: "+1", gender: "M" },
];

const ClassementJoueurs = () => {
  const ffttClubNumber = "10330022";
  // Lien vers la page générale des classements départementaux de la FFTT
  const ffttRankingLink = "https://www.fftt.com/site/competition/classement/classement-departemental";

  return (
    <div className="container mx-auto px-4 py-8 bg-clubLight text-clubLight-foreground">
      <h1 className="text-4xl font-bold text-center mb-12 text-clubDark">Classement des Joueurs du Club</h1>

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
        <h2 className="text-3xl font-bold text-center mb-8 text-clubDark">Classement détaillé de nos joueurs</h2>
        <Card className="bg-clubLight shadow-lg rounded-xl">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-clubDark text-clubDark-foreground hover:bg-clubDark">
                    <TableHead className="text-clubDark-foreground text-center">Rang</TableHead>
                    <TableHead className="text-clubDark-foreground">Nom</TableHead>
                    <TableHead className="text-clubDark-foreground text-center">Licence</TableHead>
                    <TableHead className="text-clubDark-foreground text-center">Club</TableHead>
                    <TableHead className="text-clubDark-foreground text-center">Catégorie</TableHead>
                    <TableHead className="text-clubDark-foreground text-center">Points Officiels</TableHead>
                    <TableHead className="text-clubDark-foreground text-center">Points Mensuels</TableHead>
                    <TableHead className="text-clubDark-foreground text-center">Évolution</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {playersRankings.map((player, index) => (
                    <TableRow key={index} className="even:bg-clubSection/20 odd:bg-clubLight hover:bg-clubSection/40 transition-colors duration-200 border-b border-border">
                      <TableCell className="font-medium text-clubDark text-center">{player.rank}</TableCell>
                      <TableCell className="font-medium text-clubDark">{player.name}</TableCell>
                      <TableCell className="text-center text-clubLight-foreground">{player.license}</TableCell>
                      <TableCell className="text-center text-clubLight-foreground">{player.club}</TableCell>
                      <TableCell className="text-center text-clubLight-foreground">{player.category}</TableCell>
                      <TableCell className="text-center text-clubLight-foreground">{player.officialPoints}</TableCell>
                      <TableCell className="text-center text-clubLight-foreground">{player.monthlyPoints}</TableCell>
                      <TableCell className={`text-center font-semibold ${player.rankChange.startsWith('+') ? 'text-green-600' : player.rankChange.startsWith('-') ? 'text-red-600' : 'text-muted-foreground'}`}>
                        {player.rankChange}
                      </TableCell>
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