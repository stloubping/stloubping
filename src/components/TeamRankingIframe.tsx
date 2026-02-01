import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

interface TeamRankingIframeProps {
  teamNumber: number;
  championshipType: 'masculin' | 'feminin' | 'autre';
  teamName: string;
}

const TeamRankingIframe: React.FC<TeamRankingIframeProps> = ({ teamNumber, championshipType, teamName }) => {
  const clubNumber = "10330022";
  
  // Simplification de l'URL Pingpocket pour tenter de résoudre le problème d'affichage du profil.
  // Nous retirons les paramètres 'phase' et 'themeId' pour voir si une URL plus générique fonctionne.
  const iframeSrc = `https://www.pingpocket.fr/app/fftt/clubs/${clubNumber}/equipes/calendriers`;

  return (
    <Card className="bg-clubLight shadow-lg rounded-xl border border-border">
      <CardContent className="p-0">
        <div className="w-full mx-auto border-b border-border rounded-t-lg overflow-hidden">
          <small className="block text-right text-xs text-muted-foreground p-2">
            powered by <a target="_blank" href="https://www.pingpocket.fr" className="underline hover:text-clubPrimary text-clubPrimary">www.pingpocket.fr</a>
          </small>
          <iframe
            frameBorder="1"
            name={`pingpocket-team-calendar`}
            width="100%"
            height="800"
            scrolling="auto"
            src={iframeSrc}
            title={`Calendrier général des équipes du club`}
            className="w-full"
          >
            <p>Votre navigateur ne supporte pas les iframes.</p>
          </iframe>
        </div>
        <div className="p-4 text-center">
          <a href={iframeSrc} target="_blank" rel="noopener noreferrer" className="text-clubPrimary hover:underline font-medium">
            Voir le calendrier complet sur Pingpocket
          </a>
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamRankingIframe;