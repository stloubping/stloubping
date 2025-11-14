import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Link } from 'react-router-dom';
import { useLightbox } from '@/context/LightboxContext'; // Import useLightbox

const Adhesions = () => {
  const { openLightbox } = useLightbox(); // Use the lightbox hook

  return (
    <div className="container mx-auto px-4 py-8 bg-clubLight text-clubLight-foreground">
      <h1 className="text-4xl font-bold text-center mb-12 text-clubDark">Adhésions</h1>

      <section className="mb-12">
        <Card className="bg-clubLight shadow-lg rounded-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-clubDark">Devenez Membre de Notre Club !</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-clubLight-foreground">
              Que vous soyez un joueur occasionnel ou un compétiteur aguerri, notre club vous ouvre ses portes.
              Rejoignez une communauté passionnée et bénéficiez d'un encadrement de qualité et d'infrastructures adaptées.
            </p>
            <p className="text-clubLight-foreground">
              L'adhésion à notre club inclut la licence FFTT, l'accès aux entraînements encadrés,
              et la participation aux événements du club.
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="mb-12">
        <Card className="bg-clubLight shadow-lg rounded-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-clubDark">Planning des Entraînements Saison 2025-2026</CardTitle>
          </CardHeader>
          <CardContent>
            <img
              src="/images/schedule/training-schedule-2025-2026.jpg"
              alt="Planning des entraînements Saison 2025-2026"
              className="w-full h-auto object-contain rounded-lg shadow-md cursor-zoom-in"
              onClick={() => openLightbox("/images/schedule/training-schedule-2025-2026.jpg")} // Open lightbox on image click
            />
            <p className="mt-4 text-sm text-muted-foreground text-center">
              Ces horaires sont susceptibles d'ajustements à l'issue des premiers entraînements.
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="mb-12">
        <Card className="bg-clubLight shadow-lg rounded-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-clubDark">Types de Licences</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-clubSection p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-2 text-clubDark">Licence Loisir</h3>
                <p className="mb-4 text-clubLight-foreground">
                  Idéale pour ceux qui souhaitent pratiquer le tennis de table pour le plaisir,
                  sans l'engagement des compétitions officielles. Accès aux entraînements libres
                  et aux sessions encadrées dédiées au loisir.
                </p>
                <ul className="list-disc list-inside mb-4 text-clubLight-foreground">
                  <li>Accès aux créneaux de jeu libre</li>
                  <li>Participation aux entraînements loisir</li>
                  <li>Assurance FFTT incluse</li>
                </ul>
                <p className="text-2xl font-bold text-clubPrimary">130€ / an</p>
              </div>
              <div className="bg-clubSection p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-2 text-clubDark">Licence Compétition</h3>
                <p className="mb-4 text-clubLight-foreground">
                  Pour les joueurs désireux de s'investir dans la compétition.
                  Permet de participer aux championnats par équipes et aux tournois
                  organisés par la FFTT.
                </p>
                <ul className="list-disc list-inside mb-4 text-clubLight-foreground">
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
        <Card className="bg-clubLight shadow-lg p-8 rounded-xl">
          <CardTitle className="text-2xl text-clubDark mb-4">Processus d'Inscription en Ligne</CardTitle>
          <CardContent>
            <p className="mb-6 text-clubLight-foreground">
              Prêt à nous rejoindre ? L'inscription est simple et rapide !
              Cliquez sur le bouton ci-dessous pour accéder à notre formulaire d'adhésion en ligne.
            </p>
            <Button asChild className="bg-clubPrimary hover:bg-clubPrimary/90 text-clubPrimary-foreground px-8 py-4 text-lg rounded-md shadow-lg">
              <Link to="/contact">
                S'inscrire en Ligne
              </Link>
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