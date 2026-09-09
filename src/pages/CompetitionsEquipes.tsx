"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CalendarDays, Loader2, MapPin, Trophy, Users } from 'lucide-react';
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
  matches?: TeamMatch[];
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

const CompetitionsEquipes = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await fetch('/api/fftt/criterium?competition=championnat');
        if (!response.ok) throw new Error(`Erreur FFTT ${response.status}`);
        const data = await response.json();
        if (!data?.teams) return;
        setTeams(data.teams);
      } catch (err) {
        console.error("Erreur Championnat:", err);
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
        <h1 className="text-3xl md:text-4xl font-bold text-clubDark mb-4">Championnat par Équipes</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Retrouvez tous les classements officiels de nos équipes.
        </p>
      </div>

      {teams.length === 0 ? (
        <div className="text-center py-20 bg-clubSection/30 rounded-xl border-2 border-dashed border-gray-300">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Aucune donnée de classement disponible.</p>
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
                  <Badge variant="outline" className="w-fit border-clubPrimary text-clubPrimary bg-clubPrimary/10">
                    Phase {team.phase}
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
                <div className="border-t border-border p-4 md:p-6">
                  <div className="mb-4 flex items-center gap-2">
                    <CalendarDays className="h-5 w-5 text-clubPrimary" aria-hidden="true" />
                    <h3 className="text-lg font-bold text-clubDark">Calendrier et résultats</h3>
                  </div>
                  {team.matches && team.matches.length > 0 ? (
                    <div className="space-y-2">
                      {team.matches.map((match) => (
                        <div
                          key={match.id}
                          className="grid gap-3 rounded-lg border bg-white p-3 sm:grid-cols-[80px_110px_1fr_auto] sm:items-center"
                        >
                          <div className="font-bold text-clubPrimary">
                            {match.round ? `J${match.round}` : "Journée"}
                          </div>
                          <div>
                            <div className="font-medium text-clubDark">{match.date}</div>
                            {match.time && <div className="text-xs text-muted-foreground">{match.time}</div>}
                          </div>
                          <div>
                            <div className="font-semibold text-clubDark">{match.opponent}</div>
                            <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                              <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                              {match.home ? "À domicile" : "À l’extérieur"}
                            </div>
                          </div>
                          {match.played ? (
                            <Badge className="w-fit bg-clubPrimary text-white">
                              {match.scoreFor} – {match.scoreAgainst}
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="w-fit">À venir</Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="rounded-lg bg-clubSection/40 p-4 text-sm text-muted-foreground">
                      Le calendrier n’est pas encore disponible auprès de la FFTT.
                    </p>
                  )}
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
