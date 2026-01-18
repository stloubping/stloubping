"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { supabase } from '@/integrations/supabase/client';
import { showError, showSuccess } from '@/utils/toast';
import { Loader2, Download } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const PASSWORD = "stloubping33"; // Le mot de passe pour l'exportation

interface Registration {
  id: string;
  created_at: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  licence_number: string;
  club: string;
  selected_tableaux: string[];
  doubles_partner: string | null;
  consent: boolean;
}

const TournamentRegistrationsList = () => {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRegistrations = async () => {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('tournament_registrations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching registrations:", error);
        showError("Erreur lors du chargement des inscriptions : " + error.message);
        setError(error.message);
      } else {
        setRegistrations(data || []);
      }
      setLoading(false);
    };

    fetchRegistrations();
  }, []);

  const formatTableaux = (tableaux: string[]) => {
    if (!tableaux || tableaux.length === 0) return "Aucun";
    return tableaux.map(t => {
      switch (t) {
        case 't1': return '500-799 (8h30)';
        case 't2': return '500-1399 (9h30)';
        case 't3': return '500-999 (10h30)';
        case 't4': return '500-1599 (11h30)';
        case 't5': return '500-1199 (13h30)';
        case 't6': return '500-Non Num FR (14h30)';
        case 'd1': return 'Doubles <2800 Pts (16h00)';
        default: return t;
      }
    }).join(', ');
  };

  const exportToCsv = () => {
    if (registrations.length === 0) {
      showError("Aucune donnée à exporter.");
      return;
    }

    const headers = [
      "Date d'inscription", "Prénom", "Nom", "Email", "Téléphone",
      "Numéro de licence", "Club", "Tableaux sélectionnés", "Partenaire de double", "Consentement"
    ];

    const csvRows = [
      headers.join(';'),
      ...registrations.map(reg => {
        const formattedDate = new Date(reg.created_at).toLocaleDateString('fr-FR');
        const formattedTableaux = formatTableaux(reg.selected_tableaux);
        const doublesPartner = reg.doubles_partner || '';
        const consent = reg.consent ? 'Oui' : 'Non';

        return [
          formattedDate,
          reg.first_name,
          reg.last_name,
          reg.email,
          reg.phone,
          reg.licence_number,
          reg.club,
          `"${formattedTableaux}"`,
          `"${doublesPartner}"`,
          consent
        ].join(';');
      })
    ];

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'inscriptions_tournoi.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showSuccess("Les inscriptions ont été exportées en CSV.");
  };

  const handlePasswordSubmit = () => {
    if (passwordInput === PASSWORD) {
      exportToCsv();
      setIsPasswordDialogOpen(false);
      setPasswordInput("");
      setPasswordError(null);
    } else {
      setPasswordError("Mot de passe incorrect.");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-clubPrimary" />
        <p className="ml-2 text-clubDark">Chargement des inscriptions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center text-destructive">
        <p>Une erreur est survenue : {error}</p>
        <p>Veuillez vérifier les politiques RLS de votre table 'tournament_registrations' pour les opérations SELECT.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-clubLight text-clubLight-foreground">
      <Card className="max-w-5xl mx-auto bg-clubLight shadow-lg rounded-xl p-6">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-clubDark mb-2">Liste des Inscriptions au Tournoi</CardTitle>
          <CardDescription className="text-clubLight-foreground">
            Retrouvez ici toutes les inscriptions soumises pour le tournoi.
          </CardDescription>
          <div className="mt-4">
            <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-clubPrimary hover:bg-clubPrimary/90 text-clubPrimary-foreground">
                  <Download className="mr-2 h-4 w-4" /> Exporter en CSV
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] bg-clubLight text-clubLight-foreground border-clubPrimary">
                <DialogHeader>
                  <DialogTitle className="text-clubDark">Accès sécurisé</DialogTitle>
                  <DialogDescription className="text-clubLight-foreground/80">
                    Veuillez entrer le mot de passe pour exporter les données.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="password" className="text-right text-clubDark">
                      Mot de passe
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      value={passwordInput}
                      onChange={(e) => {
                        setPasswordInput(e.target.value);
                        setPasswordError(null); // Clear error on input change
                      }}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handlePasswordSubmit();
                        }
                      }}
                      className="col-span-3 bg-input text-clubLight-foreground border-clubPrimary"
                    />
                  </div>
                  {passwordError && (
                    <p className="text-destructive text-sm text-center">{passwordError}</p>
                  )}
                </div>
                <DialogFooter>
                  <Button type="button" onClick={handlePasswordSubmit} className="bg-clubPrimary hover:bg-clubPrimary/90 text-clubPrimary-foreground">
                    Valider
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {registrations.length === 0 ? (
            <p className="text-center text-muted-foreground">Aucune inscription trouvée pour le moment.</p>
          ) : (
            <div className="overflow-x-auto rounded-lg border">
              <Table className="min-w-full divide-y divide-border">
                <TableHeader>
                  <TableRow className="bg-clubDark text-clubDark-foreground hover:bg-clubDark">
                    <TableHead className="text-clubDark-foreground">Date</TableHead>
                    <TableHead className="text-clubDark-foreground">Nom Complet</TableHead>
                    <TableHead className="text-clubDark-foreground">Club</TableHead>
                    <TableHead className="text-clubDark-foreground">Licence</TableHead>
                    <TableHead className="text-clubDark-foreground">Tableaux</TableHead>
                    <TableHead className="text-clubDark-foreground">Partenaire Double</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {registrations.map((reg) => (
                    <TableRow key={reg.id} className="even:bg-clubSection/20 odd:bg-clubLight hover:bg-clubSection/40 transition-colors duration-200 border-b border-border">
                      <TableCell className="text-sm text-clubDark">{new Date(reg.created_at).toLocaleDateString()}</TableCell>
                      <TableCell className="font-medium text-clubDark">{reg.first_name} {reg.last_name}</TableCell>
                      <TableCell className="text-sm text-clubLight-foreground">{reg.club}</TableCell>
                      <TableCell className="text-sm text-clubLight-foreground">{reg.licence_number}</TableCell>
                      <TableCell className="text-sm text-clubLight-foreground">{formatTableaux(reg.selected_tableaux)}</TableCell>
                      <TableCell className="text-sm text-clubLight-foreground">{reg.doubles_partner || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TournamentRegistrationsList;