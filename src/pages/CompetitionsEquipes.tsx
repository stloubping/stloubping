import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from 'lucide-react';

const CompetitionsEquipes = () => {
  const pingpocketTeamsCalendarUrl = "https://www.pingpocket.fr/app/fftt/clubs/10330022/equipes/calendriers?themeId=redBrick";
  const pingpocketTeamsRankingsUrl = "https://www.pingpocket.fr/app/fftt/clubs/10330022/equipes/classements?themeId=redBrick";

  return (
    <div className="container mx-auto px-4 py-8 bg-clubLight text-clubLight-foreground">
      <h1 className="text-4xl font-bold text-center mb-12 text-clubDark">Compétitions & Équipes</h1>

      <section className="mb-12 text-center">
        <Card className="bg-clubLight shadow-lg rounded-xl p-8">
          <CardHeader>
            <CardTitle className="text-2xl text-clubDark mb-4">Suivez nos Équipes !</CardTitle>
            <CardDescription className="text-clubLight-foreground/80">
              En raison de modifications techniques sur le site de Pingpocket, l'intégration directe des calendriers et classements des équipes n'est plus possible.
              Vous pouvez retrouver toutes les informations détaillées de nos équipes (calendriers, résultats, classements) directement sur le site de Pingpocket.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <Button asChild className="bg-clubPrimary hover:bg-clubPrimary/90 text-clubPrimary-foreground px-6 py-3 text-lg rounded-md shadow-lg">
              <a href={pingpocketTeamsCalendarUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-5 w-5" /> Voir les Calendriers sur Pingpocket
              </a>
            </Button>
            <Button asChild variant="outline" className="border-clubPrimary text-clubPrimary hover:bg-clubPrimary/10 px-6 py-3 text-lg rounded-md shadow-lg">
              <a href={pingpocketTeamsRankingsUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-5 w-5" /> Voir les Classements sur Pingpocket
              </a>
            </Button>
            <p className="text-sm text-muted-foreground mt-4">
              (Le site Pingpocket s'ouvrira dans un nouvel onglet)
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default CompetitionsEquipes;