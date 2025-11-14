"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useLightbox } from '@/context/LightboxContext';

const CompetitionCalendar = () => {
  const { openLightbox } = useLightbox();

  // Note: The original implementation used a Dialog for the image, but since we have a global Lightbox, 
  // we will use the Lightbox for consistency and simplicity.

  const calendarImagePath = "/images/schedule/match-calendar-2025-2026.jpg";

  return (
    <section className="mb-12">
      <Card className="bg-clubLight shadow-lg rounded-xl">
        <CardHeader>
          <CardTitle className="text-2xl text-clubDark text-center">Calendrier des Compétitions 2025-2026</CardTitle>
        </CardHeader>
        <CardContent>
          <img
            src={calendarImagePath}
            alt="Calendrier des Compétitions 2025-2026"
            className="w-full h-auto object-contain rounded-lg shadow-md max-h-96 mx-auto cursor-zoom-in hover:opacity-80 transition-opacity duration-200"
            onClick={() => openLightbox(calendarImagePath)}
          />
          <p className="mt-4 text-sm text-muted-foreground text-center">
            Retrouvez toutes les dates importantes des championnats et tournois de la saison. Cliquez sur l'image pour l'agrandir.
          </p>
        </CardContent>
      </Card>
    </section>
  );
};

export default CompetitionCalendar;