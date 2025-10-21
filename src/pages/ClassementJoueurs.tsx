import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ExternalLink } from 'lucide-react';

// Données de classement des joueurs du club, basées sur les informations fournies.
// Les numéros de licence sont générés et le genre est inféré ou par défaut.
const playersRankings = [
  { rank: 1, name: "CHAUMETTE Vittore Leo", license: "1000001", club: "St Loub Ping", category: "Catégorie 14", officialPoints: 1463, monthlyPoints: 1463, rankChange: "NC", gender: "M" },
  { rank: 2, name: "KERMORVANT Wesley", license: "1000002", club: "St Loub Ping", category: "Catégorie 14", officialPoints: 1458, monthlyPoints: 1458, rankChange: "NC", gender: "M" },
  { rank: 3, name: "SZLOSEK Thomas", license: "1000003", club: "St Loub Ping", category: "Catégorie 12", officialPoints: 1290, monthlyPoints: 1290, rankChange: "NC", gender: "M" },
  { rank: 4, name: "ROCHES Christopher", license: "1000004", club: "St Loub Ping", category: "Catégorie 12", officialPoints: 1288, monthlyPoints: 1288, rankChange: "NC", gender: "M" },
  { rank: 5, name: "STOLARSKI Yann", license: "1000005", club: "St Loub Ping", category: "Catégorie 12", officialPoints: 1216, monthlyPoints: 1216, rankChange: "NC", gender: "M" },
  { rank: 6, name: "QUINONES Raul", license: "1000006", club: "St Loub Ping", category: "Catégorie 12", officialPoints: 1202, monthlyPoints: 1202, rankChange: "NC", gender: "M" },
  { rank: 7, name: "SERELLE Julien", license: "1000007", club: "St Loub Ping", category: "Catégorie 11", officialPoints: 1188, monthlyPoints: 1188, rankChange: "NC", gender: "M" },
  { rank: 8, name: "GOIX Eloïse", license: "1000008", club: "St Loub Ping", category: "Catégorie 11", officialPoints: 1140, monthlyPoints: 1140, rankChange: "NC", gender: "F" },
  { rank: 9, name: "LEGOIX Michaël", license: "1000009", club: "St Loub Ping", category: "Catégorie 10", officialPoints: 1084, monthlyPoints: 1084, rankChange: "NC", gender: "M" },
  { rank: 10, name: "PEYCHAUD Dominique", license: "1000010", club: "St Loub Ping", category: "Catégorie 10", officialPoints: 1053, monthlyPoints: 1053, rankChange: "NC", gender: "M" },
  { rank: 11, name: "HELLEQUET Antoine", license: "1000011", club: "St Loub Ping", category: "Catégorie 9", officialPoints: 986, monthlyPoints: 986, rankChange: "NC", gender: "M" },
  { rank: 12, name: "WAGNER Vincent", license: "1000012", club: "St Loub Ping", category: "Catégorie 9", officialPoints: 952, monthlyPoints: 952, rankChange: "NC", gender: "M" },
  { rank: 13, name: "CITERNE Damien", license: "1000013", club: "St Loub Ping", category: "Catégorie 9", officialPoints: 950, monthlyPoints: 950, rankChange: "NC", gender: "M" },
  { rank: 14, name: "DUPUY Benjamin", license: "1000014", club: "St Loub Ping", category: "Catégorie 9", officialPoints: 916, monthlyPoints: 916, rankChange: "NC", gender: "M" },
  { rank: 15, name: "SERVANT Yanick", license: "1000015", club: "St Loub Ping", category: "Catégorie 8", officialPoints: 882, monthlyPoints: 882, rankChange: "NC", gender: "M" },
  { rank: 16, name: "GOUPIL Serge", license: "1000016", club: "St Loub Ping", category: "Catégorie 8", officialPoints: 824, monthlyPoints: 824, rankChange: "NC", gender: "M" },
  { rank: 17, name: "MOUNEDE Yves", license: "1000017", club: "St Loub Ping", category: "Catégorie 7", officialPoints: 771, monthlyPoints: 771, rankChange: "NC", gender: "M" },
  { rank: 18, name: "GIGAUD Patrice", license: "1000018", club: "St Loub Ping", category: "Catégorie 7", officialPoints: 764, monthlyPoints: 764, rankChange: "NC", gender: "M" },
  { rank: 19, name: "POISSON Anthony", license: "1000019", club: "St Loub Ping", category: "Catégorie 7", officialPoints: 747, monthlyPoints: 747, rankChange: "NC", gender: "M" },
  { rank: 20, name: "GRIGNON Yohan", license: "1000020", club: "St Loub Ping", category: "Catégorie 7", officialPoints: 727, monthlyPoints: 727, rankChange: "NC", gender: "M" },
  { rank: 21, name: "VENDRAMINI Nicolas", license: "1000021", club: "St Loub Ping", category: "Catégorie 7", officialPoints: 711, monthlyPoints: 711, rankChange: "NC", gender: "M" },
  { rank: 22, name: "MUSSET Aurélien", license: "1000022", club: "St Loub Ping", category: "Catégorie 7", officialPoints: 710, monthlyPoints: 710, rankChange: "NC", gender: "M" },
  { rank: 23, name: "LE BONNIEC Éric", license: "1000023", club: "St Loub Ping", category: "Catégorie 7", officialPoints: 702, monthlyPoints: 702, rankChange: "NC", gender: "M" },
  { rank: 24, name: "TOUTAIN Julien", license: "1000024", club: "St Loub Ping", category: "Catégorie 6", officialPoints: 696, monthlyPoints: 696, rankChange: "NC", gender: "M" },
  { rank: 25, name: "MOLINIE Remi", license: "1000025", club: "St Loub Ping", category: "Catégorie 6", officialPoints: 688, monthlyPoints: 688, rankChange: "NC", gender: "M" },
  { rank: 26, name: "RENAUD Bernard", license: "1000026", club: "St Loub Ping", category: "Catégorie 6", officialPoints: 684, monthlyPoints: 684, rankChange: "NC", gender: "M" },
  { rank: 27, name: "DUBILE Margaux", license: "1000027", club: "St Loub Ping", category: "Catégorie 6", officialPoints: 647, monthlyPoints: 647, rankChange: "NC", gender: "F" },
  { rank: 28, name: "ROUX Philippe", license: "1000028", club: "St Loub Ping", category: "Catégorie 6", officialPoints: 642, monthlyPoints: 642, rankChange: "NC", gender: "M" },
  { rank: 29, name: "HAY Charly", license: "1000029", club: "St Loub Ping", category: "Catégorie 5", officialPoints: 686, monthlyPoints: 686, rankChange: "NC", gender: "M" },
  { rank: 30, name: "MARSAUD Nicolas", license: "1000030", club: "St Loub Ping", category: "Catégorie 5", officialPoints: 593, monthlyPoints: 593, rankChange: "NC", gender: "M" },
  { rank: 31, name: "DESSUP Jean-Claude", license: "1000031", club: "St Loub Ping", category: "Catégorie 5", officialPoints: 540, monthlyPoints: 540, rankChange: "NC", gender: "M" },
  { rank: 32, name: "REYNAUD Elliot", license: "1000032", club: "St Loub Ping", category: "Catégorie 5", officialPoints: 539, monthlyPoints: 539, rankChange: "NC", gender: "M" },
  { rank: 33, name: "PENOTET Gerard", license: "1000033", club: "St Loub Ping", category: "Catégorie 5", officialPoints: 530, monthlyPoints: 530, rankChange: "NC", gender: "M" },
  { rank: 34, name: "GOIX Olivier", license: "1000034", club: "St Loub Ping", category: "Catégorie 5", officialPoints: 528, monthlyPoints: 528, rankChange: "NC", gender: "M" },
  { rank: 35, name: "MONTEIGNES Jeremie", license: "1000035", club: "St Loub Ping", category: "Catégorie 5", officialPoints: 524, monthlyPoints: 524, rankChange: "NC", gender: "M" },
  { rank: 36, name: "BANOS Gauthier", license: "1000036", club: "St Loub Ping", category: "Catégorie 5", officialPoints: 513, monthlyPoints: 513, rankChange: "NC", gender: "M" },
  { rank: 37, name: "VILAGNES Thibaud", license: "1000037", club: "St Loub Ping", category: "Catégorie 5", officialPoints: 500, monthlyPoints: 500, rankChange: "NC", gender: "M" },
  { rank: 38, name: "TERRIEN Stéphane", license: "1000038", club: "St Loub Ping", category: "Catégorie 5", officialPoints: 500, monthlyPoints: 500, rankChange: "NC", gender: "M" },
  { rank: 39, name: "SANA Thibault", license: "1000039", club: "St Loub Ping", category: "Catégorie 5", officialPoints: 500, monthlyPoints: 500, rankChange: "NC", gender: "M" },
  { rank: 40, name: "SAN JOSE Hugo", license: "1000040", club: "St Loub Ping", category: "Catégorie 5", officialPoints: 500, monthlyPoints: 500, rankChange: "NC", gender: "M" },
  { rank: 41, name: "ROBERT Titouan", license: "1000041", club: "St Loub Ping", category: "Catégorie 5", officialPoints: 500, monthlyPoints: 500, rankChange: "NC", gender: "M" },
  { rank: 42, name: "POUGET Pao", license: "1000042", club: "St Loub Ping", category: "Catégorie 5", officialPoints: 500, monthlyPoints: 500, rankChange: "NC", gender: "M" },
  { rank: 43, name: "PAUGET Robin", license: "1000043", club: "St Loub Ping", category: "Catégorie 5", officialPoints: 500, monthlyPoints: 500, rankChange: "NC", gender: "M" },
  { rank: 44, name: "MALLET CHAUBENT Enzo", license: "1000044", club: "St Loub Ping", category: "Catégorie 5", officialPoints: 500, monthlyPoints: 500, rankChange: "NC", gender: "M" },
  { rank: 45, name: "DINCLAUD Malan", license: "1000045", club: "St Loub Ping", category: "Catégorie 5", officialPoints: 500, monthlyPoints: 500, rankChange: "NC", gender: "M" },
  { rank: 46, name: "COULOT Tom", license: "1000046", club: "St Loub Ping", category: "Catégorie 5", officialPoints: 500, monthlyPoints: 500, rankChange: "NC", gender: "M" },
  { rank: 47, name: "BEAUMONT Pierre", license: "1000047", club: "St Loub Ping", category: "Catégorie 5", officialPoints: 500, monthlyPoints: 500, rankChange: "NC", gender: "M" },
  { rank: 48, name: "BARROS Ethan", license: "1000048", club: "St Loub Ping", category: "Catégorie 5", officialPoints: 500, monthlyPoints: 500, rankChange: "NC", gender: "M" },
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