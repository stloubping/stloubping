import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from 'lucide-react';
import TeamInfoIframe from '@/components/TeamInfoIframe'; // Import the new component

const CriteriumGironde = () => {
  return (
    <div className="container mx-auto px-4 py-8 bg-clubLight text-clubLight-foreground">
      <h1 className="text-4xl font-bold text-center mb-12 text-clubDark">Critérium de Gironde</h1>

      <section className="mb-12 grid grid-cols-1 gap-8">
        <TeamInfoIframe
          type="calendar"
          title="Calendrier du Critérium de Gironde"
          description="Retrouvez le calendrier des rencontres de nos équipes participant au Critérium de Gironde."
        />
        <TeamInfoIframe
          type="ranking"
          title="Classement du Critérium de Gironde"
          description="Consultez les classements actuels de nos équipes au Critérium de Gironde."
        />
      </section>
    </div>
  );
};

export default CriteriumGironde;