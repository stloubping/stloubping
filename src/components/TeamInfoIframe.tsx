import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TeamInfoIframeProps {
  type: 'calendar' | 'ranking';
  title: string;
  description: string;
}

const TeamInfoIframe: React.FC<TeamInfoIframeProps> = ({ type, title, description }) => {
  const clubNumber = "10330022";
  let iframeSrc = "";
  let iframeName = "";

  if (type === 'calendar') {
    iframeSrc = `https://www.pingpocket.fr/app/fftt/clubs/${clubNumber}/equipes/calendriers?themeId=redBrick`;
    iframeName = "pingpocket-team-calendar";
  } else if (type === 'ranking') {
    iframeSrc = `https://www.pingpocket.fr/app/fftt/clubs/${clubNumber}/equipes/classements?themeId=redBrick`;
    iframeName = "pingpocket-team-ranking";
  }

  return (
    <Card className="bg-clubLight shadow-lg rounded-xl border border-border">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl text-clubDark text-center">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <p className="text-center text-sm text-muted-foreground mb-4 p-4">
          {description} Si le contenu ne s'affiche pas correctement, veuillez consulter le site de Pingpocket directement.
        </p>
        <div className="w-full max-w-xl mx-auto border border-border rounded-lg overflow-hidden">
          <small className="block text-right text-xs text-muted-foreground p-2">
            powered by <a target="_blank" href="https://www.pingpocket.fr" className="underline hover:text-clubPrimary text-clubPrimary">www.pingpocket.fr</a>
          </small>
          <iframe
            frameBorder="1"
            name={iframeName}
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

export default TeamInfoIframe;