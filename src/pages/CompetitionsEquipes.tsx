import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from 'lucide-react';
import TeamInfoIframe from '@/components/TeamInfoIframe'; // Import the new component

const CompetitionsEquipes = () => {
  return (
    <div className="container mx-auto px-4 py-8 bg-clubLight text-clubLight-foreground">
      <h1 className="text-4xl font-bold text-center mb-12 text-clubDark">Compétitions & Équipes</h1>

      <section className="mb-12 grid grid-cols-1 gap-8">
        <TeamInfoIframe
          type="calendar"
          title="Calendrier des Compétitions par Équipe"
          description="Retrouvez le calendrier complet de nos équipes en championnat."
        />
        <TeamInfoIframe
          type="ranking"
          title="Classement des Compétitions par Équipe"
          description="Consultez les classements actuels de nos équipes."
        />
      </section>
    </div>
  );
};

export default CompetitionsEquipes;