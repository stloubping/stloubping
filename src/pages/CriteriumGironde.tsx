"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Trophy, Users, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TeamRanking {
  clt: string;
  equipe: string;
  joue: string;
  pts: string;
  vic: string;
  nul: string;
  def: string;
  pf: string;
}

interface Rencontre {
  libelle: string;
  equa: string;
  equb: string;
  scorea: string;
  scoreb: string;
  dateprevue: string;
  datereelle: string;
}

interface Team {
  libequipe: string;
  libdivision: string;
  libepr: string;
  phase: string;
  ranking: TeamRanking[];
  rencontres: Rencontre[];
}

const CriteriumGironde = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedTeams, setExpandedTeams] = useState<Set<number>>(new Set());

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const { data, error: apiError } = await supabase.functions.invoke('get-criterium-gironde');
        if (apiError) throw apiError;
        if (!data?.teams || data.teams.length === 0) {
          setError("Aucune équipe de critérium trouvée.");
          return;
        }
        setTeams(data.teams);
        setExpandedTeams(new Set(data.teams.map((_: any, i: number) => i)));
      } catch (err: any) {
        console.error("Erreur:", err);
        setError(err.message || "Erreur lors de la récupération");
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, []);

  const toggleTeam = (idx: number) => {
    setExpandedTeams(prev => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const isStLoub = (name: string) => {
    const n = name.toLowerCase();
    return n.includes('loub') || n.includes('st lou') || n.includes('saint lou');
  };

  const getMatchStatus = (match: Rencontre) => {
    const hasScore = match.scorea !== '' && match.scoreb !== '';
    if (!hasScore) return 'pending';
    const isClubA = isStLoub(match.equa);
    const isClubB = isStLoub(match.equb);
    const sA = parseInt(match.scorea) || 0;
    const sB = parseInt(match.scoreb) || 0;
    if (isClubA) return sA > sB ? 'victory' : sA < sB ? 'defeat' : 'draw';
    if (isClubB) return sB > sA ? 'victory' : sB < sA ? 'defeat' : 'draw';
    return 'neutral';
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-clubPrimary mb-4" />
        <p className="text-clubDark font-medium">Récupération du Critérium Gironde...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <Trophy className="h-12 w-12 text-orange-400 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-clubDark mb-2">Critérium Gironde</h2>
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-clubLight text-clubLight-foreground">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-clubDark mb-4">Critérium de Gironde</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">Classements et résultats de nos équipes engagées dans le Critérium départemental.</p>
      </div>

      <div className="space-y-8">
        {teams.map((team, idx) => (
          <Card key={idx} className="bg-clubLight shadow-lg border-clubPrimary/10 overflow-hidden">
            <CardHeader className="bg-clubDark text-white p-4 md:p-6 cursor-pointer" onClick={() => toggleTeam(idx)}>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl md:text-2xl font-bold flex items-center gap-2">
                    <Trophy className="h-5 w-5 md:h-6 md:w-6 text-clubPrimary" />
                    {team.libequipe}
                  </CardTitle>
                  <CardDescription className="text-gray-300 mt-1 text-xs md:text-sm">{team.libdivision} — {team.libepr}</CardDescription>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="border-clubPrimary text-clubPrimary bg-clubPrimary/10">Phase {team.phase}</Badge>
                  {expandedTeams.has(idx) ? <ChevronUp className="h-5 w-5 text-gray-300" /> : <ChevronDown className="h-5 w-5 text-gray-300" />}
                </div>
              </div>
            </CardHeader>

            {expandedTeams.has(idx) && (
              <CardContent className="p-0">
                <Tabs defaultValue="classement" className="w-full">
                  <TabsList className="w-full rounded-none bg-clubSection/30 border-b">
                    <TabsTrigger value="classement" className="flex-1">📊 Classement</TabsTrigger>
                    <TabsTrigger value="rencontres" className="flex-1">📋 Rencontres</TabsTrigger>
                  </TabsList>

                  <TabsContent value="classement" className="mt-0">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-clubSection/50">
                            <TableHead className="w-[50px] text-center font-bold">Pos</TableHead>
                            <TableHead className="font-bold">Équipe</TableHead>
                            <TableHead className="text-center font-bold">J</TableHead>
                            <TableHead className="text-center font-bold">V</TableHead>
                            <TableHead className="text-center font-bold">N</TableHead>
                            <TableHead className="text-center font-bold">D</TableHead>
                            <TableHead className="text-center font-bold text-clubPrimary">Pts</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {team.ranking.map((row, rIdx) => {
                            const isClub = isStLoub(row.equipe);
                            return (
                              <TableRow key={rIdx} className={isClub ? "bg-clubPrimary/5 font-semibold" : ""}>
                                <TableCell className="text-center font-bold">{row.clt}</TableCell>
                                <TableCell className={isClub ? "text-clubPrimary" : ""}>{row.equipe}</TableCell>
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
                  </TabsContent>

                  <TabsContent value="rencontres" className="mt-0 p-4">
                    <div className="space-y-3">
                      {team.rencontres.map((match, mIdx) => {
                        const hasScore = match.scorea !== '' && match.scoreb !== '';
                        const status = getMatchStatus(match);
                        const isClubA = isStLoub(match.equa);
                        const isClubB = isStLoub(match.equb);

                        return (
                          <div key={mIdx} className={`border rounded-lg p-3 ${isClubA || isClubB ? 'border-clubPrimary/30 bg-clubPrimary/5' : 'border-gray-200'}`}>
                            <div className="text-[10px] text-gray-400 mb-1 flex items-center gap-1">
                              <Calendar className="h-3 w-3" /> {match.libelle} {match.dateprevue && `— ${match.dateprevue}`}
                            </div>
                            <div className="flex items-center justify-between gap-2">
                              <div className={`flex-1 text-right text-xs md:text-sm ${isClubA ? 'font-bold text-clubPrimary' : ''}`}>{match.equa}</div>
                              <div className={`px-3 py-1 rounded-lg text-center min-w-[60px] text-sm font-bold ${
                                !hasScore ? 'bg-gray-100 text-gray-400 text-xs' :
                                status === 'victory' ? 'bg-green-600 text-white' :
                                status === 'defeat' ? 'bg-red-600 text-white' :
                                status === 'draw' ? 'bg-yellow-500 text-white' : 'bg-clubDark text-white'
                              }`}>
                                {hasScore ? `${match.scorea} - ${match.scoreb}` : 'À venir'}
                              </div>
                              <div className={`flex-1 text-left text-xs md:text-sm ${isClubB ? 'font-bold text-clubPrimary' : ''}`}>{match.equb}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CriteriumGironde;