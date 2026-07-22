"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, ExternalLink } from "lucide-react";

const CompetitionCalendar = () => {
  const pdfPath = "/documents/schedule/Competitions-2026-2027.pdf";
  const calendarImagePath = "/images/schedule/match-calendar-2025-2026.jpg";

  return (
    <section className="mb-12">
      <Card className="bg-clubLight shadow-lg rounded-xl border border-border">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl md:text-3xl text-clubDark flex items-center justify-center gap-2">
            <FileText className="h-7 w-7 text-clubPrimary" />
            Calendrier des Compétitions 2026-2027
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-sm md:text-base text-muted-foreground text-center max-w-2xl mx-auto">
            Retrouvez toutes les dates importantes des championnats et tournois de la saison 2026-2027.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button asChild className="bg-clubPrimary hover:bg-clubPrimary/90 text-white font-semibold">
              <a href={pdfPath} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                Ouvrir le Calendrier 2026-2027 (PDF)
              </a>
            </Button>
            <Button asChild variant="outline" className="border-clubPrimary text-clubPrimary hover:bg-clubPrimary/10">
              <a href={pdfPath} download="Competitions-2026-2027.pdf">
                <Download className="mr-2 h-4 w-4" />
                Télécharger le PDF
              </a>
            </Button>
          </div>

          {/* Affichage de la prévisualisation PDF */}
          <div className="w-full h-[600px] border border-border rounded-lg overflow-hidden shadow-inner hidden md:block">
            <iframe
              src={`${pdfPath}#toolbar=0`}
              title="Calendrier des Compétitions 2026-2027"
              className="w-full h-full border-0"
            />
          </div>

          {/* Fallback image si besoin */}
          <div className="md:hidden text-center text-xs text-muted-foreground pt-2">
            Astuce : Cliquez sur le bouton ci-dessus pour consulter le calendrier complet en PDF.
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default CompetitionCalendar;