import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const Adhesions = () => {
  return (
    <div className="container mx-auto px-4 py-8 bg-clubBackground text-clubBackground-foreground">
      <h1 className="text-4xl font-bold text-center mb-12 text-clubPrimary">Adhésions</h1>

      <section className="mb-12">
        <Card className="bg-card shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-clubPrimary">Devenez Membre de Notre Club !</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-clubBackground-foreground">
              Que vous soyez un joueur occasionnel ou un compétiteur aguerri, notre club vous ouvre ses portes.
              Rejoignez une communauté passionnée et bénéficiez d'un encadrement de qualité et d'infrastructures adaptées.
            </p>
            <p className="text-clubBackground-foreground">
              L'adhésion à notre club inclut la licence FFTT, l'accès aux entraînements encadrés,
              et la participation aux événements du club.
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="mb-12">
        <Card className="bg-card shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-clubPrimary">Types de Licences</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-clubAccent p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-2 text-clubPrimary">Licence Loisir</h3>
                <p className="mb-4 text-clubAccent-foreground">
                  Idéale pour ceux qui souhaitent pratiquer le tennis de table pour le plaisir,
                  sans l'engagement des compétitions officielles. Accès aux entraînements libres
                  et aux sessions encadrées dédiées au loisir.
                </p>
                <ul className="list-disc list-inside mb-4 text-clubAccent-foreground">
                  <li>Accès aux créneaux de jeu libre</li>
                  <li>Participation aux entraînements loisir</li>
                  <li>Assurance FFTT incluse</li>
                </ul>
                <p className="text-2xl font-bold text-clubPrimary">100€ / an</p>
              </div>
              <div className="bg-clubAccent p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-2 text-clubPrimary">Licence Compétition</h3>
                <p className="mb-4 text-clubAccent-foreground">
                  Pour les joueurs désireux de s'investir dans la compétition.
                  Permet de participer aux championnats par équipes et aux tournois individuels
                  organisés par la FFTT.
                </p>
                <ul className="list-disc list-inside mb-4 text-clubAccent-foreground">
                  <li>Accès à tous les entraînements (loisir et compétition)</li>
                  <li>Participation aux championnats et tournois officiels</li>
                  <li>Classement FFTT</li>
                </ul>
                <p className="text-2xl font-bold text-clubPrimary">150€ / an</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="text-center">
        <Card className="bg-card shadow-lg p-8">
          <CardTitle className="text-2xl text-clubPrimary mb-4">Processus d'Inscription en Ligne</CardTitle>
          <CardContent>
            <p className="mb-6 text-clubBackground-foreground">
              Prêt à nous rejoindre ? L'inscription est simple et rapide !
              Cliquez sur le bouton ci-dessous pour accéder à notre formulaire d'adhésion en ligne.
            </p>
            <Button className="bg-clubPrimary hover:bg-clubPrimary/90 text-clubPrimary-foreground px-8 py-4 text-lg">
              S'inscrire en Ligne
            </Button>
            <p className="mt-4 text-sm text-muted-foreground">
              Pour toute question, n'hésitez pas à nous contacter via la page Contact.
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default Adhesions;