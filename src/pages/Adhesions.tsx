import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLightbox } from '@/context/LightboxContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, CreditCard, Users, ShieldCheck } from 'lucide-react';

const Adhesions = () => {
  const { openLightbox } = useLightbox();

  return (
    <div className="container mx-auto px-4 py-8 bg-clubLight text-clubLight-foreground">
      <h1 className="text-4xl font-bold text-center mb-12 text-clubDark">Adhésions Saison 2026-2027</h1>

      {/* Intro */}
      <section className="mb-12">
        <Card className="bg-clubLight shadow-lg rounded-xl border border-border">
          <CardHeader>
            <CardTitle className="text-2xl text-clubDark">Devenez Membre de Notre Club !</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-clubLight-foreground">
              Que vous soyez un joueur occasionnel ou un compétiteur aguerri, notre club vous ouvre ses portes.
              Rejoignez une communauté passionnée et bénéficiez d'un encadrement de qualité et d'infrastructures adaptées.
            </p>
            <p className="text-clubLight-foreground">
              L'adhésion à notre club comprend la licence FFTT, l'accès aux entraînements encadrés, 
              l'assurance sportive ainsi que la participation aux événements du club.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Tarifs 2026-2027 */}
      <section className="mb-12">
        <Card className="bg-clubLight shadow-lg rounded-xl border border-border overflow-hidden">
          <CardHeader>
            <CardTitle className="text-2xl text-clubDark">Tarifs des Inscriptions 2026-2027</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <img
                  src="/images/adhesions/tarifs-2026-2027.jpg"
                  alt="Tarifs des inscriptions saison 2026-2027"
                  className="w-full h-auto object-contain rounded-lg shadow-md cursor-zoom-in hover:opacity-90 transition-opacity"
                  onClick={() => openLightbox("/images/adhesions/tarifs-2026-2027.jpg")}
                />
                <p className="text-xs text-muted-foreground text-center mt-2">Cliquez sur l'image pour l'agrandir</p>
              </div>

              <div className="space-y-6">
                <div className="p-4 bg-clubSection rounded-lg border border-clubPrimary/20">
                  <h3 className="text-xl font-bold text-clubDark mb-3 flex items-center gap-2">
                    <ShieldCheck className="text-clubPrimary h-5 w-5" /> Tarifs de base
                  </h3>
                  <div className="space-y-2">
                    <p className="text-2xl font-bold text-clubPrimary">Licence Jeunes : 140 €</p>
                    <p className="text-2xl font-bold text-clubPrimary">Licence Adultes : 160 €</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-3">
                    Inclus : adhésion, licence fédérale (loisir ou compétition) et assurance pour la période du 1er septembre 2026 au 30 juin 2027.
                  </p>
                </div>

                <div className="p-4 bg-clubSection rounded-lg border border-clubPrimary/20">
                  <h3 className="text-xl font-bold text-clubDark mb-3 flex items-center gap-2">
                    <Users className="text-clubPrimary h-5 w-5" /> Tarifs Familles
                  </h3>
                  <ul className="text-sm space-y-1 text-clubLight-foreground">
                    <li>• 2 personnes : <strong>-5 %</strong></li>
                    <li>• 3 personnes : <strong>-10 %</strong></li>
                    <li>• 4 personnes : <strong>-15 %</strong></li>
                    <li>• 5 personnes et + : <strong>-20 %</strong></li>
                  </ul>
                </div>

                <div className="p-4 bg-clubSection rounded-lg border border-clubPrimary/20">
                  <h3 className="text-xl font-bold text-clubDark mb-2 flex items-center gap-2">
                    <CreditCard className="text-clubPrimary h-5 w-5" /> Moyens de Paiement Acceptés
                  </h3>
                  <p className="text-sm font-medium text-clubLight-foreground">
                    CB, Virement, Chèque, Pass Sport, Chèques ANCV.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Horaires 2026-2027 */}
      <section className="mb-12">
        <Card className="bg-clubLight shadow-lg rounded-xl border border-border">
          <CardHeader>
            <CardTitle className="text-2xl text-clubDark">Planning des Entraînements Saison 2026-2027</CardTitle>
          </CardHeader>
          <CardContent>
            <img
              src="/images/adhesions/training-schedule-2026-2027.jpg"
              alt="Planning des entraînements Saison 2026-2027"
              className="w-full h-auto object-contain rounded-lg shadow-md cursor-zoom-in hover:opacity-90 transition-opacity"
              onClick={() => openLightbox("/images/adhesions/training-schedule-2026-2027.jpg")}
            />
            <p className="mt-4 text-sm text-muted-foreground text-center">
              Ces horaires sont susceptibles d'ajustements à l'issue des premiers entraînements.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Types de licences */}
      <section className="mb-12">
        <Card className="bg-clubLight shadow-lg rounded-xl border border-border">
          <CardHeader>
            <CardTitle className="text-2xl text-clubDark">Types de Licences</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-clubSection p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-2 text-clubDark">Licence Loisir</h3>
                <p className="mb-4 text-clubLight-foreground">
                  Idéale pour ceux qui souhaitent pratiquer le tennis de table pour le plaisir, avec la possibilité de faire quelques petites compétitions dédiées aux joueurs loisirs.
                </p>
                <ul className="list-disc list-inside mb-4 text-clubLight-foreground space-y-1">
                  <li>Accès aux créneaux de jeu libre</li>
                  <li>Participation aux entraînements dirigés loisirs</li>
                  <li>Assurance FFTT incluse</li>
                  <li className="font-semibold pt-2">Accès compétitions jeunes & adultes :</li>
                  <li>Tournois du Conseil Départemental</li>
                  <li>Rencontres interclubs & Critérium de Gironde</li>
                </ul>
              </div>
              <div className="bg-clubSection p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-2 text-clubDark">Licence Compétition</h3>
                <p className="mb-4 text-clubLight-foreground">
                  Pour les joueurs désireux de s'investir dans la compétition et de participer aux championnats par équipes et tournois organisés par la FFTT.
                </p>
                <ul className="list-disc list-inside mb-4 text-clubLight-foreground space-y-1">
                  <li>Accès aux créneaux de jeu libre & entraînements compétition</li>
                  <li>Assurance FFTT & Classement officiel FFTT</li>
                  <li className="font-semibold pt-2">Accès aux compétitions officielles :</li>
                  <li>Championnat par équipes jeunes & séniors</li>
                  <li>Critérium Fédéral, Titres jeunes, Tournois régionaux</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Téléchargements */}
      <section className="text-center">
        <Card className="bg-clubLight shadow-lg p-8 rounded-xl border border-border">
          <CardTitle className="text-2xl text-clubDark mb-4">Documents d'Inscription</CardTitle>
          <CardContent>
            <p className="mb-6 text-clubLight-foreground max-w-xl mx-auto">
              Pour vous inscrire, téléchargez et remplissez les documents ci-dessous.
              Remettez-les ensuite à un membre du bureau ou à un entraîneur.
            </p>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="bg-clubPrimary hover:bg-clubPrimary/90 text-clubPrimary-foreground px-8 py-4 text-lg rounded-md shadow-lg">
                  Télécharger les documents <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-72 bg-clubLight text-clubLight-foreground border-clubPrimary">
                <DropdownMenuItem asChild>
                  <a href="/documents/adhesions/26-2-licence.pdf" target="_blank" rel="noopener noreferrer" className="block px-4 py-2 text-sm text-clubLight-foreground hover:bg-clubSection hover:text-clubPrimary">
                    Formulaire de licence FFTT (2026-2027)
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href="/documents/adhesions/26-9-certificat.pdf" target="_blank" rel="noopener noreferrer" className="block px-4 py-2 text-sm text-clubLight-foreground hover:bg-clubSection hover:text-clubPrimary">
                    Certificat médical (2026-2027)
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href="/documents/adhesions/26-10-2-autoquestionnaire-medical-mineur.pdf" target="_blank" rel="noopener noreferrer" className="block px-4 py-2 text-sm text-clubLight-foreground hover:bg-clubSection hover:text-clubPrimary">
                    Autoquestionnaire médical mineur (2026-2027)
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href="/documents/adhesions/droit-a-l-image-et-rgpd.pdf" target="_blank" rel="noopener noreferrer" className="block px-4 py-2 text-sm text-clubLight-foreground hover:bg-clubSection hover:text-clubPrimary">
                    Droit à l'image et RGPD
                  </a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <p className="mt-6 text-sm text-muted-foreground">
              Pour toute question, vous pouvez nous contacter directement depuis la page Contact.
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default Adhesions;