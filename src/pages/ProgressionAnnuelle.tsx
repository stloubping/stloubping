import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ProgressionAnnuelle = () => {
  const pingpocketAnnualRankingLink = "https://www.pingpocket.fr/app/fftt/clubs/10330022/licencies?SORT=SEASON_INCREASE&themeId=redBrick";

  return (
    <div className="container mx-auto px-4 py-8 bg-clubLight text-clubLight-foreground">
      <h1 className="text-4xl font-bold text-center mb-12 text-clubDark">Progression Annuelle des Joueurs</h1>

      <section>
        <Card className="bg-clubLight shadow-lg rounded-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-clubDark text-center">Classement par Progression Annuelle</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <p className="text-center text-sm text-muted-foreground mb-4 p-4">
              Découvrez les joueurs ayant la meilleure progression de points sur l'année, directement depuis Pingpocket.
              Si le contenu ne s'affiche pas correctement, veuillez consulter le site de Pingpocket directement.
            </p>
            <div className="w-full max-w-xl mx-auto border border-border rounded-lg overflow-hidden">
              <small className="block text-right text-xs text-muted-foreground p-2">
                powered by <a target="_blank" href="https://www.pingpocket.fr" className="underline hover:text-clubPrimary text-clubPrimary">www.pingpocket.fr</a>
              </small>
              <iframe
                frameBorder="1"
                name="pingpocket-annual-progression"
                width="100%"
                height="800"
                scrolling="auto"
                src={pingpocketAnnualRankingLink}
                title="Progression annuelle des joueurs Pingpocket"
              >
                <p>Votre navigateur ne supporte pas les iframes.</p>
              </iframe>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default ProgressionAnnuelle;