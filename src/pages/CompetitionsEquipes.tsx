"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Trophy, Users } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

interface TeamRanking {
  clt: string;
  equipe: string;
  joue: string;
  pts: string;
  vic: string;
  nul: string;
  def: string;
}

interface Team {
  libequipe: string;
  libdivision: string;
  libepr: string;
  phase: string;
  ranking?: TeamRanking[];
}

const CompetitionsEquipes = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('get-club-results');
        
        if (error) {
          console.error("Erreur Supabase:", error);
          throw error;
        }

        console.log('=== DEBUG API ===');
        console.log('Nombre équipes reçues:', data?.teams?.length);
        console.log('Équipes:', data?.teams?.map((t: any) => 
          `${t.libequipe} (Phase ${t.phase}) - ${t.ranking?.length || 0} lignes de classement`
        ));

        if (!data?.teams || data.teams.length === 0) {
          setTeams([]);
          return;
        }

        const getTeamNumber = (lib: string) => {
          const matches = lib.match(/\d+/g);
          return matches ? parseInt(matches[matches.length - 1]) : 999;
        };

        // On filtre pour ne garder que la Phase 2 (ou unknown qui est souvent la phase en cours)
        const sortedTeams = data.teams
          .filter((t: Team) => t.phase === "2" || t.phase === "unknown")
          .sort((a: Team, b: Team) => getTeamNumber(a.libequipe) - getTeamNumber(b.libequipe));
        
        setTeams(sortedTeams);
      } catch (err) {
        console.error("Erreur lors de la récupération des résultats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-clubPrimary mb-4" />
        <p className="text-clubDark font-medium">Récupération des résultats officiels FFTT...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-clubLight text-clubLight-foreground">
      <div className="text-center mb-8 md:mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-clubDark mb-4">Championnat par Équipes</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base">
          Retrouvez tous les classements officiels de nos équipes pour la saison 2025-2026.
        </p>
      </div>

      {teams.length === 0 ? (
        <div className="text-center py-20 bg-clubSection/30 rounded-xl border-2 border-dashed border-gray-300">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Aucune donnée de classement disponible pour le moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8">
          {teams.map((team, idx) => (
            <Card key={idx} className="bg-clubLight shadow-lg border-clubPrimary/10 overflow-hidden">
              <CardHeader className="bg-clubDark text-white p-4 md:p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl md:text-2xl font-bold flex items-center gap-2">
                      <Trophy className="h-5 w-5 md:h-6 md:w-6 text-clubPrimary" />
                      {team.libequipe}
                    </CardTitle>
                    <CardDescription className="text-gray-300 mt-1 text-xs md:text-sm">
                      {team.libdivision} — {team.libepr}
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="w-fit border-clubPrimary text-clubPrimary bg-clubPrimary/10">
                    Phase {team.phase === "unknown" ? "2" : team.phase}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-clubSection/50 hover:bg-clubSection/50">
                        <TableHead className="w-[50px] md:w-[60px] text-center font-bold text-[10px] md:text-sm">Pos</TableHead>
                        <TableHead className="font-bold text-[10px] md:text-sm">Équipe</TableHead>
                        <TableHead className="text-center font-bold text-[10px] md:text-sm">J</TableHead>
                        <TableHead className="text-center font-bold text-[10px] md:text-sm">V</TableHead>
                        <TableHead className="text-center font-bold text-[10px] md:text-sm">N</TableHead>
                        <TableHead className="text-center font-bold text-[10px] md:text-sm">D</TableHead>
                        <TableHead className="text-center font-bold text-clubPrimary text-[10px] md:text-sm">Pts</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {team.ranking && team.ranking.length > 0 ? (
                        team.ranking.map((row, rIdx) => {
                          const isStLoub = row.equipe.toLowerCase().includes("loub");
                          return (
                            <TableRow 
                              key={rIdx} 
                              className={isStLoub ? "bg-clubPrimary/5 font-semibold" : ""}
                            >
                              <TableCell className="text-center font-bold text-[10px] md:text-sm">{row.clt}</TableCell>
                              <TableCell className={isStLoub ? "text-clubPrimary text-[10px] md:text-sm" : "text-[10px] md:text-sm"}>
                                {row.equipe}
                              </TableCell>
                              <TableCell className="text-center text-[10px] md:text-sm">{row.joue}</TableCell>
                              <TableCell className="text-center text-[10px] md:text-sm">{row.vic}</TableCell>
                              <TableCell className="text-center text-[10px] md:text-sm">{row.nul}</TableCell>
                              <TableCell className="text-center text-[10px] md:text-sm">{row.def}</TableCell>
                              <TableCell className="text-center font-bold text-clubPrimary text-[10px] md:text-sm">{row.pts}</TableCell>
                            </TableRow>
                          );
                        })
                      ) : (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-4 text-muted-foreground italic">
                            Classement non disponible pour cette équipe.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CompetitionsEquipes;