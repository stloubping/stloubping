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

const CriteriumGironde = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('get-club-results');
        
        if (error) throw error;

        if (!data?.teams) return;

        // Filtrage pour ne garder que le Critérium de Gironde
        const criteriumTeams = data.teams.filter((t: Team) => 
          t.libepr.toLowerCase().includes("critérium") || 
          t.libepr.toLowerCase().includes("criterium")
        );

        // Tri par numéro d'équipe (1 à 3)
        const sortedTeams = criteriumTeams.sort((a: Team, b: Team) => {
          const numA = parseInt(a.libequipe.match(/\d+/)?.[0] || "999");
          const numB = parseInt(b.libequipe.match(/\d+/)?.[0] || "999");
          return numA - numB;
        });
        
        setTeams(sortedTeams);
      } catch (err) {
        console.error("Erreur Critérium:", err);
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
        <p className="text-clubDark font-medium">Récupération des résultats du Critérium...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-clubLight text-clubLight-foreground">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-clubDark mb-4">Critérium de Gironde</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Suivez les performances de nos 3 équipes engagées dans le Critérium de Gironde.
        </p>
      </div>

      {teams.length === 0 ? (
        <div className="text-center py-20 bg-clubSection/30 rounded-xl border-2 border-dashed border-gray-300">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Aucune donnée disponible pour le Critérium.</p>
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
                    <CardDescription className="text-gray-300 mt-1">
                      {team.libdivision} — {team.libepr}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-clubSection/50 hover:bg-clubSection/50">
                        <TableHead className="w-[60px] text-center font-bold">Pos</TableHead>
                        <TableHead className="font-bold">Équipe</TableHead>
                        <TableHead className="text-center font-bold">J</TableHead>
                        <TableHead className="text-center font-bold">V</TableHead>
                        <TableHead className="text-center font-bold">N</TableHead>
                        <TableHead className="text-center font-bold">D</TableHead>
                        <TableHead className="text-center font-bold text-clubPrimary">Pts</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {team.ranking && team.ranking.length > 0 ? (
                        team.ranking.map((row, rIdx) => {
                          const isStLoub = row.equipe.toLowerCase().includes("loub");
                          return (
                            <TableRow key={rIdx} className={isStLoub ? "bg-clubPrimary/5 font-semibold" : ""}>
                              <TableCell className="text-center font-bold">{row.clt}</TableCell>
                              <TableCell className={isStLoub ? "text-clubPrimary" : ""}>{row.equipe}</TableCell>
                              <TableCell className="text-center">{row.joue}</TableCell>
                              <TableCell className="text-center">{row.vic}</TableCell>
                              <TableCell className="text-center">{row.nul}</TableCell>
                              <TableCell className="text-center">{row.def}</TableCell>
                              <TableCell className="text-center font-bold text-clubPrimary">{row.pts}</TableCell>
                            </TableRow>
                          );
                        })
                      ) : (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-4 text-muted-foreground italic">
                            Classement non disponible.
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

export default CriteriumGironde;