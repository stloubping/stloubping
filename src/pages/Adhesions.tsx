import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Link } from 'react-router-dom';
import { useLightbox } from '@/context/LightboxContext'; // Import useLightbox
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from 'lucide-react';

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
              L'adhésion à notre club inclus la licence FFTT, l'accès aux entraînements encadrés,
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
                  Idéale pour ceux qui souhaitent pratiquer le tennis de table pour le plaisir, avec la possibilité de faire quelques petites compétitions dédiées aux joueurs loisirs. Accès aux entraînements libres
                  et aux sessions encadrées dédiées au loisir.
                </p>
                <ul className="list-disc list-inside mb-4 text-clubLight-foreground">
                  <li>Accès aux créneaux de jeu libre</li>
                  <li>Participation aux entraînements dirigés loisirs</li>
                  <li>Assurance FFTT incluse</li>
                  <br/>
                  <p className="mb-4 text-clubLight-foreground">Accès aux compétitions jeunes :</p>
                  <li>Tournois du Conseil Départemental</li>
                  <li>Championnat par équipe jeunes</li>
                  <br/>
                  <p className="mb-4 text-clubLight-foreground">Accès aux compétitions adultes :</p>
                  <li>Rencontres interclubs de Gironde</li>
                  <li>Criterium de Gironde</li>
                </ul>
              </div>
              <div className="bg-clubSection p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-2 text-clubDark">Licence Compétition</h3>
                <p className="mb-4 text-clubLight-foreground">
                  Pour les joueurs désireux de s'investir dans la compétition.
                  Permet de participer aux championnats par équipes et aux tournois
                  organisés par la FFTT.
                </p>
                <ul className="list-disc list-inside mb-4 text-clubLight-foreground">
                  <li>Accès aux créneaux de jeu libre</li>
                  <li>Accès aux entraînements dirigés compétition</li>
                  <li>Assurance FFTT incluse</li>
                  <li>Classement FFTT</li>
                  <br/>
                  <p className="mb-4 text-clubLight-foreground">Accès aux compétitions jeunes :</p>
                  <li>Tournois du Conseil Départemental</li>
                  <li>Championnat par équipe jeunes</li>
                  <li>Championnat par équipe sénior</li>
                  <li>Criterium Fédéral</li>
                  <li>Titres jeunes</li>
                  <li>Finales par classement</li>
                  <li>Top détection</li>
                  <br/>
                  <p className="mb-4 text-clubLight-foreground">Accès aux compétitions adultes :</p>
                  <li>Championnat par équipe sénior</li>
                  <li>Criterium de Gironde</li>
                  <li>Criterium Fédéral</li>
                  <li>Finales par classement</li>
                  <li>Tournois officiels organisés par les clubs</li>
                  
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="text-center">
        <Card className="bg-clubLight shadow-lg p-8 rounded-xl">
          <CardTitle className="text-2xl text-clubDark mb-4">Documents d'Inscription</CardTitle>
          <CardContent>
            <p className="mb-6 text-clubLight-foreground">
              Pour vous inscrire, veuillez télécharger et remplir les documents nécessaires ci-dessous.
              Une fois complétés, vous pourrez les remettre à un membre du bureau ou à un entraîneur.
            </p>
            <p className="text-2xl font-bold text-clubPrimary">Tarif Jeunes: 130€ / an</p>
            <p className="text-2xl font-bold text-clubPrimary">Tarif Adultes: 150€ / an</p>
            <br/>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="bg-clubPrimary hover:bg-clubPrimary/90 text-clubPrimary-foreground px-8 py-4 text-lg rounded-md shadow-lg">
                  Télécharger les documents <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-72 bg-clubLight text-clubLight-foreground border-clubPrimary">
                <DropdownMenuItem asChild>
                  <a href="/documents/adhesions/25-2-licence.pdf" target="_blank" rel="noopener noreferrer" className="block px-4 py-2 text-sm text-clubLight-foreground hover:bg-clubSection hover:text-clubPrimary">
                    Formulaire de licence FFTT
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href="/documents/adhesions/25-9-certificat.pdf" target="_blank" rel="noopener noreferrer" className="block px-4 py-2 text-sm text-clubLight-foreground hover:bg-clubSection hover:text-clubPrimary">
                    Certificat médical
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href="/documents/adhesions/25-10-1-autoquestionnaire-medical-majeur.pdf" target="_blank" rel="noopener noreferrer" className="block px-4 py-2 text-sm text-clubLight-foreground hover:bg-clubSection hover:text-clubPrimary">
                    Autoquestionnaire médical (Majeur)
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href="/documents/adhesions/25-10-2-autoquestionnaire-medical-mineur.pdf" target="_blank" rel="noopener noreferrer" className="block px-4 py-2 text-sm text-clubLight-foreground hover:bg-clubSection hover:text-clubPrimary">
                    Autoquestionnaire médical (Mineur)
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href="/documents/adhesions/Droit à l_image adulte.pdf" target="_blank" rel="noopener noreferrer" className="block px-4 py-2 text-sm text-clubLight-foreground hover:bg-clubSection hover:text-clubPrimary">
                    Droit à l'image (Adulte)
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href="/documents/adhesions/Droit à l_image enfant.pdf" target="_blank" rel="noopener noreferrer" className="block px-4 py-2 text-sm text-clubLight-foreground hover:bg-clubSection hover:text-clubPrimary">
                    Droit à l'image (Enfant)
                  </a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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