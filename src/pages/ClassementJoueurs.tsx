import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from 'lucide-react';

const ClassementJoueurs = () => {
  const ffttClubNumber = "10330022";
  const ffttRankingLink = "https://www.fftt.com/site/competition/classement/classement-departemental";
  // Nouveau lien pour l'iframe, affichant les licenciés par classement officiel
  const pingpocketClubRankingLink = "https://www.pingpocket.fr/app/fftt/clubs/10330022/licencies?SORT=OFFICIAL_RANK"; 

  return (
    <div className="container mx-auto px-4 py-8 bg-clubLight text-clubLight-foreground">
      <h1 className="text-4xl font-bold text-center mb-12 text-clubDark">Classement des Joueurs du Club</h1>

      <section className="mb-12">
        <Card className="bg-clubLight shadow-lg rounded-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-clubDark">Découvrez les Classements de Nos Joueurs</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-clubLight-foreground">
              Suivez les performances de nos adhérents et découvrez leur classement officiel, mis à jour directement depuis Pingpocket.
              Que ce soit pour la compétition ou le loisir, chaque point compte !
            </p>
            <p className="mb-6 text-clubLight-foreground">
              Vous pouvez également consulter les classements généraux directement sur le site de la Fédération Française de Tennis de Table (FFTT).
            </p>
            <Button asChild className="bg-clubPrimary hover:bg-clubPrimary/90 text-clubPrimary-foreground px-8 py-4 text-lg rounded-md shadow-lg">
              <a href={ffttRankingLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
                Voir les classements FFTT <ExternalLink className="ml-2 h-5 w-5" />
              </a>
            </Button>
            <p className="mt-4 text-sm text-muted-foreground">
              (Numéro de club FFTT : {ffttClubNumber}. Le lien ci-dessus mène à la page générale des classements départementaux.)
            </p>
          </CardContent>
        </Card>
      </section>

      <section>
        <h2 className="text-3xl font-bold text-center mb-8 text-clubDark">Classement détaillé de nos joueurs</h2>
        <Card className="bg-clubLight shadow-lg rounded-xl">
          <CardContent className="p-0">
            <p className="text-center text-sm text-muted-foreground mb-4 p-4">
              Le classement ci-dessous est intégré directement depuis Pingpocket. Si le contenu ne s'affiche pas correctement, veuillez consulter le site de Pingpocket directement.
            </p>
            <div className="w-full max-w-xl mx-auto border border-border rounded-lg overflow-hidden">
              <small className="block text-right text-xs text-muted-foreground p-2">
                powered by <a target="_blank" href="https://www.pingpocket.fr" className="underline hover:text-clubPrimary">www.pingpocket.fr</a>
              </small>
              <iframe
                frameBorder="1"
                name="pingpocket-players"
                width="100%"
                height="4000" // Hauteur ajustable selon le contenu
                scrolling="auto"
                src={pingpocketClubRankingLink}
                title="Classement des joueurs Pingpocket"
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

export default ClassementJoueurs;