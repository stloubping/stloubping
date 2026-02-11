"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Users, AlertCircle, TrendingDown } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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
  points?: string;
  selected_tableaux: string[];
  doubles_partner: string | null;
}

const TournamentLiveRegistrations = () => {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchRegistrations = async () => {
      setLoading(true);
      setError(null);
      
      const { data, error: supabaseError } = await supabase
        .from('tournament_registrations')
        .select('*');

      if (supabaseError) {
        console.error("Erreur Supabase:", supabaseError);
        setError(supabaseError.message);
      } else {
        const sortedData = (data || []).sort((a, b) => {
          const pointsA = parseInt(a.points || "0", 10);
          const pointsB = parseInt(b.points || "0", 10);
          
          if (pointsB !== pointsA) {
            return pointsB - pointsA;
          }
          return (a.last_name || "").localeCompare(b.last_name || "");
        });
        
        setRegistrations(sortedData);
      }
      setLoading(false);
    };

    fetchRegistrations();
  }, []);

  const filteredRegistrations = filter === "all"
    ? registrations
    : registrations.filter(reg => reg.selected_tableaux?.includes(filter));

  return (
    <div className="container mx-auto px-2 py-4 md:py-8 bg-clubLight text-clubLight-foreground">
      <Card className="max-w-5xl mx-auto bg-clubLight shadow-lg rounded-xl p-3 md:p-6">
        <CardHeader className="text-center p-2 md:p-6">
          <div className="flex items-center justify-center mb-2 md:mb-4">
            <Users className="h-6 w-6 md:h-10 md:w-10 text-clubPrimary mr-2 md:mr-3" />
            <CardTitle className="text-xl md:text-3xl font-bold text-clubDark">Les Inscrits LIVE</CardTitle>
          </div>
          <CardDescription className="text-clubLight-foreground text-xs md:text-lg flex items-center justify-center gap-1 md:gap-2">
            <TrendingDown className="h-3 w-3 md:h-5 md:w-5 text-clubPrimary" />
            Liste triée par points (décroissant)
          </CardDescription>
          
          <div className="mt-4 md:mt-8 max-w-xs mx-auto">
            <label className="block text-[10px] md:text-sm font-medium text-clubDark mb-1 md:mb-2">Filtrer par tableau :</label>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="h-8 md:h-10 bg-input border-clubPrimary text-clubDark text-xs md:text-sm">
                <SelectValue placeholder="Sélectionnez un tableau" />
              </SelectTrigger>
              <SelectContent className="bg-clubLight border-clubPrimary">
                {tableauxOptions.map(opt => (
                  <SelectItem key={opt.id} value={opt.id} className="text-xs md:text-sm text-clubDark hover:bg-clubSection">
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent className="p-0 md:p-6">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erreur</AlertTitle>
              <AlertDescription className="text-xs">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {loading ? (
            <div className="flex justify-center items-center py-10 md:py-20">
              <Loader2 className="h-6 w-6 md:h-10 md:w-10 animate-spin text-clubPrimary" />
              <span className="ml-2 text-xs md:text-sm text-clubDark font-medium">Mise à jour...</span>
            </div>
          ) : filteredRegistrations.length === 0 ? (
            <div className="text-center py-10 md:py-20 text-muted-foreground italic text-xs md:text-sm">
              Aucun inscrit trouvé.
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-clubDark hover:bg-clubDark">
                    <TableHead className="text-clubDark-foreground w-[40px] md:w-[60px] text-center px-1 md:px-4 text-[10px] md:text-sm">N°</TableHead>
                    <TableHead className="text-clubDark-foreground px-2 md:px-4 text-[10px] md:text-sm">Joueur</TableHead>
                    <TableHead className="text-clubDark-foreground text-center px-1 md:px-4 text-[10px] md:text-sm">Pts</TableHead>
                    <TableHead className="text-clubDark-foreground px-2 md:px-4 text-[10px] md:text-sm">Club</TableHead>
                    {filter === "d1" && <TableHead className="text-clubDark-foreground px-2 md:px-4 text-[10px] md:text-sm">Partenaire</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRegistrations.map((reg, index) => (
                    <TableRow key={reg.id} className="even:bg-clubSection/20 hover:bg-clubSection/40 transition-colors">
                      <TableCell className="text-center font-bold text-clubPrimary px-1 md:px-4 text-[10px] md:text-sm">{index + 1}</TableCell>
                      <TableCell className="font-semibold text-clubDark uppercase px-2 md:px-4 text-[10px] md:text-sm">
                        {reg.last_name} <span className="capitalize font-normal">{reg.first_name}</span>
                      </TableCell>
                      <TableCell className="text-center font-bold text-clubPrimary bg-clubPrimary/5 px-1 md:px-4 text-[10px] md:text-sm">
                        {reg.points || '500'}
                      </TableCell>
                      <TableCell className="text-clubLight-foreground px-2 md:px-4 text-[10px] md:text-sm truncate max-w-[80px] md:max-w-none">
                        {reg.club}
                      </TableCell>
                      {filter === "d1" && <TableCell className="text-clubLight-foreground italic px-2 md:px-4 text-[10px] md:text-sm">{reg.doubles_partner || '-'}</TableCell>}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
          
          {!loading && (
            <div className="mt-4 text-center text-[10px] md:text-sm text-muted-foreground">
              Total : {filteredRegistrations.length} inscrit(s)
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TournamentLiveRegistrations;