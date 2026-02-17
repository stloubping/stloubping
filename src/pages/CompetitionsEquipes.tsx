import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Trophy, Users, Calendar } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

interface RankingRow {
  poule: string;
  clast: string;
  equipe: string;
  joue: string;
  pts: string;
  vic: string;
  nul: string;
  def: string;
}

interface TeamData {
  name: string;
  division: string;
  ranking: RankingRow[];
}

const CompetitionsEquipes = () => {
  const [teams, setTeams] = useState<TeamData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const { data, error: funcError } = await supabase.functions.invoke('get-team-data');
        if (funcError) throw funcError;
        setTeams(data || []);
      } catch (err: any) {
        console.error("Erreur lors de la récupération des équipes:", err);
        setError("Impossible de charger les classements pour le moment.");
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-clubPrimary mb-4" />
        <p className="text-clubDark font-medium">Récupération des classements officiels FFTT...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-clubLight text-clubLight-foreground">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-clubDark mb-4">Championnat par Équipes</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Retrouvez les résultats et classements officiels de nos 6 équipes engagées en championnat pour la saison 2025-2026.
        </p>
      </div>

      {error ? (
        <Card className="bg-red-50 border-red-200 p-8 text-center">
          <p className="text-red-600 font-medium">{error}</p>
          <p className="text-sm text-red-500 mt-2">Veuillez réessayer plus tard ou consulter le site de la FFTT.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-12">
          {teams.map((team, index) => (
            <Card key={index} className="bg-clubLight shadow-xl border-t-4 border-t-clubPrimary overflow-hidden">
              <CardHeader className="bg-clubSection/30 pb-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-clubPrimary p-2 rounded-lg">
                      <Trophy className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl text-clubDark">{team.name}</CardTitle>
                      <CardDescription className="text-clubPrimary font-semibold">
                        {team.division}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant="outline" className="w-fit border-clubPrimary text-clubPrimary">
                    Phase 2 - 2025/2026
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-0 md:p-6">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-clubDark hover:bg-clubDark">
                        <TableHead className="text-clubDark-foreground w-[60px] text-center">Pos</TableHead>
                        <TableHead className="text-clubDark-foreground">Équipe</TableHead>
                        <TableHead className="text-clubDark-foreground text-center">Joués</TableHead>
                        <TableHead className="text-clubDark-foreground text-center">Vic</TableHead>
                        <TableHead className="text-clubDark-foreground text-center">Nul</TableHead>
                        <TableHead className="text-clubDark-foreground text-center">Déf</TableHead>
                        <TableHead className="text-clubDark-foreground text-center font-bold">Points</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {team.ranking.map((row, rIndex) => {
                        const isOurClub = row.equipe.toLowerCase().includes("loub");
                        return (
                          <TableRow 
                            key={rIndex} 
                            className={isOurClub ? "bg-clubPrimary/10 hover:bg-clubPrimary/20 font-bold" : "hover:bg-clubSection/40"}
                          >
                            <TableCell className="text-center font-bold text-clubDark">{row.clast}</TableCell>
                            <TableCell className="text-clubDark">
                              {row.equipe}
                              {isOurClub && <span className="ml-2 text-[10px] bg-clubPrimary text-white px-1 rounded">NOTRE CLUB</span>}
                            </TableCell>
                            <TableCell className="text-center">{row.joue}</TableCell>
                            <TableCell className="text-center text-green-600">{row.vic}</TableCell>
                            <TableCell className="text-center text-orange-500">{row.nul}</TableCell>
                            <TableCell className="text-center text-red-500">{row.def}</TableCell>
                            <TableCell className="text-center font-black text-clubPrimary">{row.pts}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="bg-clubDark text-white p-6">
          <div className="flex items-center gap-4 mb-4">
            <Calendar className="h-8 w-8 text-clubPrimary" />
            <h3 className="text-xl font-bold">Calendrier & Résultats</h3>
          </div>
          <p className="text-sm opacity-80 mb-6">
            Pour consulter le détail des rencontres, les feuilles de match et les performances individuelles, vous pouvez également utiliser l'application officielle Girondine.
          </p>
          <Button asChild variant="outline" className="w-full border-clubPrimary text-clubPrimary hover:bg-clubPrimary hover:text-white">
            <a href="/competitions-equipes/criterium-gironde">Voir le Critérium de Gironde</a>
          </Button>
        </Card>
        
        <Card className="bg-clubSection p-6 border-l-4 border-l-clubPrimary">
          <div className="flex items-center gap-4 mb-4">
            <Users className="h-8 w-8 text-clubPrimary" />
            <h3 className="text-xl font-bold text-clubDark">Esprit d'Équipe</h3>
          </div>
          <p className="text-sm text-clubDark/80">
            Le St Loub Ping, c'est avant tout une aventure collective. Nos 6 équipes portent haut les couleurs de Saint-Loubès chaque week-end sur les tables de toute la région.
          </p>
        </Card>
      </div>
    </div>
  );
};

export default CompetitionsEquipes;