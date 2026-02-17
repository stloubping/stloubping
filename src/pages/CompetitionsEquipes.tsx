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
  ranking?: TeamRanking[];
}

const CompetitionsEquipes = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('get-club-results');
        if (error) throw error;
        setTeams(data.teams || []);
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
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-clubDark mb-4">Championnat par Équipes</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Retrouvez les classements et résultats en direct de nos équipes engagées en championnat départemental et régional.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-12">
        {teams.map((team, idx) => (
          <Card key={idx} className="bg-clubLight shadow-xl border-clubPrimary/10 overflow-hidden">
            <CardHeader className="bg-clubDark text-white p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-2xl font-bold flex items-center gap-2">
                    <Trophy className="h-6 w-6 text-clubPrimary" />
                    {team.libequipe}
                  </CardTitle>
                  <CardDescription className="text-gray-300 mt-1">
                    {team.libdivision} — {team.libepr}
                  </CardDescription>
                </div>
                <Badge variant="outline" className="w-fit border-clubPrimary text-clubPrimary bg-clubPrimary/10">
                  Saison 2025-2026
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-clubSection/50 hover:bg-clubSection/50">
                      <TableHead className="w-[60px] text-center font-bold">Pos</TableHead>
                      <TableHead className="font-bold">Équipe</TableHead>
                      <TableHead className="text-center font-bold">Joués</TableHead>
                      <TableHead className="text-center font-bold">Vic</TableHead>
                      <TableHead className="text-center font-bold">Nuls</TableHead>
                      <TableHead className="text-center font-bold">Déf</TableHead>
                      <TableHead className="text-center font-bold text-clubPrimary">Points</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {team.ranking?.map((row, rIdx) => {
                      const isStLoub = row.equipe.toLowerCase().includes("loub");
                      return (
                        <TableRow 
                          key={rIdx} 
                          className={isStLoub ? "bg-clubPrimary/5 font-semibold" : ""}
                        >
                          <TableCell className="text-center font-bold">{row.clt}</TableCell>
                          <TableCell className={isStLoub ? "text-clubPrimary" : ""}>
                            {row.equipe}
                          </TableCell>
                          <TableCell className="text-center">{row.joue}</TableCell>
                          <TableCell className="text-center">{row.vic}</TableCell>
                          <TableCell className="text-center">{row.nul}</TableCell>
                          <TableCell className="text-center">{row.def}</TableCell>
                          <TableCell className="text-center font-bold text-clubPrimary">{row.pts}</TableCell>
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

      {teams.length === 0 && (
        <div className="text-center py-20 bg-clubSection rounded-xl border-2 border-dashed border-gray-300">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Aucune équipe trouvée pour le moment.</p>
        </div>
      )}
    </div>
  );
};

export default CompetitionsEquipes;