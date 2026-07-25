import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PingpocketIframeProps {
  title?: string;
  type?: 'joueurs' | 'equipes' | 'calendrier';
}

const PingpocketIframe: React.FC<PingpocketIframeProps> = ({ 
  title = "Joueurs & Classements - Pingpocket",
  type = 'joueurs' 
}) => {
  const clubNumber = "10330022";
  
  let iframeSrc = `https://www.pingpocket.fr/app/fftt/clubs/${clubNumber}/joueurs?themeId=redBrick`;
  if (type === 'equipes') {
    iframeSrc = `https://www.pingpocket.fr/app/fftt/clubs/${clubNumber}/equipes/classements?themeId=redBrick`;
  } else if (type === 'calendrier') {
    iframeSrc = `https://www.pingpocket.fr/app/fftt/clubs/${clubNumber}/equipes/calendriers?themeId=redBrick`;
  }

  return (
    <Card className="bg-clubLight shadow-lg rounded-xl border border-border">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl md:text-2xl text-clubDark text-center">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="w-full max-w-2xl mx-auto border border-border rounded-lg overflow-hidden">
          <small className="block text-right text-xs text-muted-foreground p-2 bg-clubSection/30">
            Propulsé par <a target="_blank" rel="noopener noreferrer" href="https://www.pingpocket.fr" className="underline hover:text-clubPrimary text-clubPrimary">www.pingpocket.fr</a>
          </small>
          <iframe
            frameBorder="0"
            name="pingpocket-frame"
            width="100%"
            height="800"
            scrolling="auto"
            src={iframeSrc}
            title={title}
            className="w-full"
          >
            <p>Votre navigateur ne supporte pas les iframes.</p>
          </iframe>
        </div>
      </CardContent>
    </Card>
  );
};

export default PingpocketIframe;