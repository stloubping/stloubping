"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Trophy, Users } from 'lucide-react';

interface TeamRanking {
  clt: string;
  equipe: string;
  joue: string;
  pts: string;
  vic: string;
  nul: string;
  def: string;
  pointsFor: string;
  pointsAgainst: string;
  goalAverage: string;
}

interface TeamMatch {
  id: string;
  round: string;
  date: string;
  time: string;
  home: boolean;
  opponent: string;
  scoreFor: string;
  scoreAgainst: string;
  played: boolean;
}

interface Team {
  libequipe: string;
  libdivision: string;
  libepr: string;
  phase: string;
  ranking?: TeamRanking[];
  matches?: TeamMatch[];
}

const pouleResultsByTeam: Record<string, Array<{ home: string; away: string; homeScore: number; awayScore: number }>> = {
  "1": [
    { home: "ST LOUB PING 1", away: "GRADIGNAN TT 1", homeScore: 37, awayScore: 13 },
    { home: "TT FARGUAIS 1", away: "AL EYSINES 1", homeScore: 31, awayScore: 19 },
    { home: "PP NORD GIR. 2", away: "VILLENAVE TT 1", homeScore: 25, awayScore: 25 },
  ],
  "2": [
    { home: "ST LOUB PING 2", away: "SAG CESTAS 1", homeScore: 8, awayScore: 42 },
    { home: "BX COQS ROUGES 2", away: "PP NORD GIR. 1", homeScore: 39, awayScore: 11 },
    { home: "EP SLP 1", away: "TT CASTELNAU 1", homeScore: 27, awayScore: 23 },
  ],
  "3": [
    { home: "ST LOUB PING 3", away: "UA CADILLACAISE 1", homeScore: 13, awayScore: 37 },
    { home: "J LANGON 1", away: "CAM BORDEAUX 1", homeScore: 39, awayScore: 11 },
    { home: "AS LIBOURNE 2", away: "AS AMBARES 1", homeScore: 29, awayScore: 21 },
  ],
  "4": [
    { home: "ST LOUB PING 4", away: "US CENON 2", homeScore: 27, awayScore: 23 },
    { home: "AS AMBARES 2", away: "TT SAUVETERROIS 1", homeScore: 31, awayScore: 19 },
    { home: "CA BEGLAIS 2", away: "ASTT MACAU 1", homeScore: 25, awayScore: 25 },
  ],
};

const CriteriumGironde = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await fetch('/api/fftt/criterium');
        if (!response.ok) throw new Error(`Erreur FFTT ${response.status}`);
        const data = await response.json();

        if (!data?.teams) return;

        // Filtrage pour ne garder que le Critérium de Gironde
        const criteriumTeams = data.teams.filter((t: Team) => 
          t.libepr.toLowerCase().includes("critérium") || 
          t.libepr.toLowerCase().includes("criterium")
        );

        // Tri par numéro d'équipe (1 à 4), sans confondre avec le numéro de phase.
        const sortedTeams = criteriumTeams.sort((a: Team, b: Team) => {
          const numA = parseInt(a.libequipe.match(/(?:PING|LOUB)\s+(\d+)/i)?.[1] || "999");
          const numB = parseInt(b.libequipe.match(/(?:PING|LOUB)\s+(\d+)/i)?.[1] || "999");
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
          Suivez les performances de nos 4 équipes engagées dans le Critérium de Gironde.
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
                        <TableHead className="text-center font-bold">Points gagnés</TableHead>
                        <TableHead className="text-center font-bold">Points perdus</TableHead>
                        <TableHead className="text-center font-bold">Goal average</TableHead>
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
                              <TableCell className="text-center">{row.pointsFor}</TableCell>
                              <TableCell className="text-center">{row.pointsAgainst}</TableCell>
                              <TableCell className={`text-center font-semibold ${Number(row.goalAverage) >= 0 ? "text-emerald-700" : "text-red-700"}`}>{Number(row.goalAverage) > 0 ? `+${row.goalAverage}` : row.goalAverage}</TableCell>
                              <TableCell className="text-center font-bold text-clubPrimary">{row.pts}</TableCell>
                            </TableRow>
                          );
                        })
                      ) : (
                        <TableRow>
                          <TableCell colSpan={10} className="text-center py-4 text-muted-foreground italic">
                            Classement non disponible.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
                {pouleResultsByTeam[String(idx + 1)] && (
                  <div className="border-t border-clubPrimary/10 bg-clubSection/20 p-4 md:p-5">
                    <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-clubDark">
                      Résultats de la poule · J1 · 11/09/2026
                    </h3>
                    <div className="grid gap-2 md:grid-cols-2">
                      {pouleResultsByTeam[String(idx + 1)].map((result) => (
                        <div key={`${result.home}-${result.away}`} className="flex items-center justify-between rounded-lg border bg-white px-3 py-2 text-sm">
                          <span className="font-medium text-clubDark">{result.home}</span>
                          <span className="mx-2 font-bold text-clubPrimary">{result.homeScore} – {result.awayScore}</span>
                          <span className="text-right font-medium text-clubDark">{result.away}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CriteriumGironde;
