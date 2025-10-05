import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import HeroSection from "@/components/HeroSection";

const LeClub = () => {
  return (
    <div className="bg-clubLight text-clubLight-foreground">
      <HeroSection
        title="Le Club"
        description="Découvrez l'histoire, les valeurs, les infrastructures et l'équipe qui font la richesse de notre club de tennis de table."
        imageUrl="https://picsum.photos/1200/800?random=100" // Placeholder image for Le Club hero
        imageAlt="Vue d'ensemble du club de tennis de table"
      />

      <div className="container mx-auto px-4 py-8">
        <section className="mb-12">
          <Card className="bg-clubLight shadow-lg rounded-xl">
            <CardHeader>
              <CardTitle className="text-2xl text-clubDark">Notre Histoire et Nos Valeurs</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-clubLight-foreground">
                Fondé en 1985, le St Loub Ping est bien plus qu'un simple club de tennis de table. C'est un lieu de rencontre, de partage et de dépassement de soi. Depuis nos débuts, nous nous engageons à promouvoir ce sport passionnant auprès de tous les publics, des plus jeunes aux vétérans, des débutants aux compétiteurs de haut niveau.
              </p>
              <p className="mb-4 text-clubLight-foreground">
                Nos valeurs fondamentales sont le respect, l'esprit sportif, la persévérance et la convivialité. Nous croyons fermement que le sport est un formidable vecteur de lien social et de développement personnel. Chaque membre est encouragé à donner le meilleur de lui-même tout en s'épanouissant dans une ambiance chaleureuse et solidaire.
              </p>
              <p className="text-clubLight-foreground">
                Rejoignez la grande famille du St Loub Ping et venez partager notre passion pour la petite balle !
              </p>
            </CardContent>
          </Card>
        </section>

        <section className="mb-12">
          <Card className="bg-clubLight shadow-lg rounded-xl">
            <CardHeader>
              <CardTitle className="text-2xl text-clubDark">Nos Infrastructures</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-clubLight-foreground">
                Notre club dispose d'installations modernes et adaptées pour la pratique du tennis de table dans les meilleures conditions :
              </p>
              <ul className="list-disc list-inside space-y-2 mb-6 text-clubLight-foreground">
                <li>Une salle principale spacieuse avec 8 tables de compétition homologuées.</li>
                <li>Un espace d'entraînement dédié équipé de robots lance-balles et de tables d'échauffement.</li>
                <li>Des vestiaires modernes et des douches individuelles pour le confort de tous.</li>
                <li>Un Club House convivial pour les moments de détente, les réunions et les événements du club.</li>
                <li>Un parking facile d'accès et sécurisé.</li>
              </ul>
              <img src="https://picsum.photos/800/400?random=101" alt="Infrastructure du club" className="mt-6 rounded-lg shadow-md w-full object-cover" />
            </CardContent>
          </Card>
        </section>

        <section className="mb-12">
          <Card className="bg-clubLight shadow-lg rounded-xl">
            <CardHeader>
              <CardTitle className="text-2xl text-clubDark">Horaires et Tarifs</CardTitle>
            </CardHeader>
            <CardContent>
              <h3 className="text-xl font-semibold mb-2 text-clubDark">Horaires d'entraînement (Saison 2024-2025) :</h3>
              <ul className="list-disc list-inside mb-6 text-clubLight-foreground">
                <li>Lundi : 18h00 - 20h00 (Adultes Loisir)</li>
                <li>Mardi : 17h30 - 19h00 (Jeunes - Encadré) / 19h00 - 21h00 (Adultes Compétition)</li>
                <li>Mercredi : 14h00 - 16h00 (École de Tennis de Table - 6-12 ans)</li>
                <li>Jeudi : 18h30 - 20h30 (Adultes Tous Niveaux - Encadré)</li>
                <li>Vendredi : 19h00 - 22h00 (Jeu Libre - Ouvert à tous les adhérents)</li>
              </ul>
              <Separator className="my-6 bg-clubPrimary" />
              <h3 className="text-xl font-semibold mb-2 text-clubDark">Tarifs des adhésions (Saison 2024-2025) :</h3>
              <ul className="list-disc list-inside text-clubLight-foreground">
                <li>Licence Loisir : 100€ / an (Accès jeu libre et entraînements loisir)</li>
                <li>Licence Compétition : 150€ / an (Accès complet, championnats et tournois)</li>
                <li>Licence Jeune (-18 ans) : 80€ / an (Accès entraînements jeunes et jeu libre)</li>
                <li>Option Coaching Personnalisé : +50€ / trimestre (Sur demande et disponibilité)</li>
                <li>Carte 10 séances (non-adhérents) : 40€</li>
              </ul>
            </CardContent>
          </Card>
        </section>

        <section className="mb-12">
          <Card className="bg-clubLight shadow-lg rounded-xl">
            <CardHeader>
              <CardTitle className="text-2xl text-clubDark">L'Équipe Dirigeante</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-6 text-clubLight-foreground text-center">
                Notre club est géré par une équipe de bénévoles passionnés, dévoués au développement du tennis de table et au bien-être de nos membres.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-clubSection rounded-lg shadow-sm">
                  <img src="https://picsum.photos/150/150?random=102" alt="Président" className="rounded-full mx-auto mb-3 w-28 h-28 object-cover border-2 border-clubPrimary" />
                  <h4 className="font-semibold text-lg text-clubDark">Jean Dupont</h4>
                  <p className="text-sm text-muted-foreground">Président</p>
                  <p className="text-xs text-clubLight-foreground mt-2">Visionnaire et pilier du club, il assure la direction générale.</p>
                </div>
                <div className="text-center p-4 bg-clubSection rounded-lg shadow-sm">
                  <img src="https://picsum.photos/150/150?random=103" alt="Secrétaire" className="rounded-full mx-auto mb-3 w-28 h-28 object-cover border-2 border-clubPrimary" />
                  <h4 className="font-semibold text-lg text-clubDark">Marie Curie</h4>
                  <p className="text-sm text-muted-foreground">Secrétaire Générale</p>
                  <p className="text-xs text-clubLight-foreground mt-2">Gère l'administration et la communication interne.</p>
                </div>
                <div className="text-center p-4 bg-clubSection rounded-lg shadow-sm">
                  <img src="https://picsum.photos/150/150?random=104" alt="Trésorier" className="rounded-full mx-auto mb-3 w-28 h-28 object-cover border-2 border-clubPrimary" />
                  <h4 className="font-semibold text-lg text-clubDark">Pierre Martin</h4>
                  <p className="text-sm text-muted-foreground">Trésorier</p>
                  <p className="text-xs text-clubLight-foreground mt-2">Responsable des finances et de la gestion budgétaire.</p>
                </div>
                <div className="text-center p-4 bg-clubSection rounded-lg shadow-sm">
                  <img src="https://picsum.photos/150/150?random=105" alt="Responsable Sportif" className="rounded-full mx-auto mb-3 w-28 h-28 object-cover border-2 border-clubPrimary" />
                  <h4 className="font-semibold text-lg text-clubDark">Sophie Dubois</h4>
                  <p className="text-sm text-muted-foreground">Responsable Sportive</p>
                  <p className="text-xs text-clubLight-foreground mt-2">Organise les entraînements et les compétitions.</p>
                </div>
                <div className="text-center p-4 bg-clubSection rounded-lg shadow-sm">
                  <img src="https://picsum.photos/150/150?random=106" alt="Responsable Jeunes" className="rounded-full mx-auto mb-3 w-28 h-28 object-cover border-2 border-clubPrimary" />
                  <h4 className="font-semibold text-lg text-clubDark">Lucas Bernard</h4>
                  <p className="text-sm text-muted-foreground">Responsable Jeunes</p>
                  <p className="text-xs text-clubLight-foreground mt-2">Dédié à l'encadrement et au développement des jeunes talents.</p>
                </div>
                <div className="text-center p-4 bg-clubSection rounded-lg shadow-sm">
                  <img src="https://picsum.photos/150/150?random=107" alt="Bénévole" className="rounded-full mx-auto mb-3 w-28 h-28 object-cover border-2 border-clubPrimary" />
                  <h4 className="font-semibold text-lg text-clubDark">Chloé Petit</h4>
                  <p className="text-sm text-muted-foreground">Membre Actif</p>
                  <p className="text-xs text-clubLight-foreground mt-2">Soutient l'équipe dans diverses tâches et événements.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section>
          <Card className="bg-clubLight shadow-lg rounded-xl">
            <CardHeader>
              <CardTitle className="text-2xl text-clubDark">Labels FFTT</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-clubLight-foreground">
                Le St Loub Ping est fier d'être reconnu par la Fédération Française de Tennis de Table (FFTT) à travers plusieurs labels. Ces distinctions attestent de la qualité de notre encadrement, de nos infrastructures et de notre engagement dans le développement du tennis de table sous toutes ses formes.
              </p>
              <ul className="list-disc list-inside space-y-2 mb-6 text-clubLight-foreground">
                <li>**Label Club Formateur** : Reconnaît notre excellence dans la formation des jeunes joueurs.</li>
                <li>**Label Club Féminin** : Souligne notre engagement pour la promotion et le développement du tennis de table féminin.</li>
                <li>**Label Club Handisport** : Met en avant notre accessibilité et notre soutien à la pratique du handisport.</li>
              </ul>
              <p className="text-clubLight-foreground mb-6">
                Ces labels sont le reflet de notre travail quotidien pour offrir un environnement propice à l'épanouissement sportif et personnel de tous nos adhérents.
              </p>
              <img src="https://picsum.photos/300/100?random=108" alt="Logos Labels FFTT" className="mt-6 mx-auto" />
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default LeClub;