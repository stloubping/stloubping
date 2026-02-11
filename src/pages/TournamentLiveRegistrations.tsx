"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Users } from 'lucide-react';

const tableauxOptions = [
  { id: "all", label: "Tous les tableaux" },
  { id: "t1", label: "Tableau 1 : 500-799" },
  { id: "t2", label: "Tableau 2 : 500-1399" },
  { id: "t3", label: "Tableau 3 : 500-999" },
  { id: "t4", label: "Tableau 4 : 500-1599" },
  { id: "t5", label: "Tableau 5 : 500-1199" },
  { id: "t6", label: "Tableau 6 : 500-Non Num FR" },
  { id: "d1", label: "Tableau 7 : Doubles <2800 Pts" },
];

interface Registration {
  id: string;
  first_name: string;
  last_name: string;
  club: string;
  points: string;
  selected_tableaux: string[];
  doubles_partner: string | null;
}

const TournamentLiveRegistrations = () => {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchRegistrations = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('tournament_registrations')
        .select('id, first_name, last_name, club, points, selected_tableaux, doubles_partner')
        .order('last_name', { ascending: true });

      if (error) {
        console.error("Error fetching registrations:", error);
      } else {
        setRegistrations(data || []);
      }
      setLoading(false);
    };

    fetchRegistrations();
  }, []);

  const filteredRegistrations = filter === "all"
    ? registrations
    : registrations.filter(reg => reg.selected_tableaux.includes(filter));

  return (
    <div className="container mx-auto px-4 py-8 bg-clubLight text-clubLight-foreground">
      <Card className="max-w-5xl mx-auto bg-clubLight shadow-lg rounded-xl p-6">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Users className="h-10 w-10 text-clubPrimary mr-3" />
            <CardTitle className="text-3xl font-bold text-clubDark">Les Inscrits LIVE</CardTitle>
          </div>
          <CardDescription className="text-clubLight-foreground text-lg">
            Consultez la liste des joueurs inscrits en temps réel.
          </CardDescription>
          
          <div className="mt-8 max-w-xs mx-auto">
            <label className="block text-sm font-medium text-clubDark mb-2">Filtrer par tableau :</label>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="bg-input border-clubPrimary text-clubDark">
                <SelectValue placeholder="Sélectionnez un tableau" />
              </SelectTrigger>
              <SelectContent className="bg-clubLight border-clubPrimary">
                {tableauxOptions.map(opt => (
                  <SelectItem key={opt.id} value={opt.id} className="text-clubDark hover:bg-clubSection">
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-clubPrimary" />
              <span className="ml-3 text-clubDark font-medium">Chargement des inscrits...</span>
            </div>
          ) : filteredRegistrations.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground italic">
              Aucun inscrit trouvé pour ce tableau.
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-clubDark hover:bg-clubDark">
                    <TableHead className="text-clubDark-foreground w-[60px] text-center">N°</TableHead>
                    <TableHead className="text-clubDark-foreground">Joueur</TableHead>
                    <TableHead className="text-clubDark-foreground text-center">Points</TableHead>
                    <TableHead className="text-clubDark-foreground">Club</TableHead>
                    {filter === "d1" && <TableHead className="text-clubDark-foreground">Partenaire</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRegistrations.map((reg, index) => (
                    <TableRow key={reg.id} className="even:bg-clubSection/20 hover:bg-clubSection/40 transition-colors">
                      <TableCell className="text-center font-bold text-clubPrimary">{index + 1}</TableCell>
                      <TableCell className="font-semibold text-clubDark uppercase">
                        {reg.last_name} <span className="capitalize font-normal">{reg.first_name}</span>
                      </TableCell>
                      <TableCell className="text-center font-medium text-clubDark">{reg.points || '-'}</TableCell>
                      <TableCell className="text-clubLight-foreground">{reg.club}</TableCell>
                      {filter === "d1" && <TableCell className="text-clubLight-foreground italic">{reg.doubles_partner || 'À définir'}</TableCell>}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
          
          <div className="mt-6 text-center text-sm text-muted-foreground">
            Total : {filteredRegistrations.length} inscrit(s) {filter !== "all" ? `dans ce tableau` : `au total`}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TournamentLiveRegistrations;