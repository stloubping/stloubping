import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const LeClub = () => {
  return (
    <div className="container mx-auto px-4 py-8 bg-clubBackground text-clubBackground-foreground">
      <h1 className="text-4xl font-bold text-center mb-12 text-clubAccent">Le Club</h1>

      <section className="mb-12">
        <Card className="bg-card shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-clubAccent">Notre Histoire et Nos Valeurs</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-clubBackground-foreground">
              Fondé en [Année de fondation], notre club de tennis de table est un pilier de la communauté sportive locale.
              Nous nous engageons à promouvoir le tennis de table pour tous, des débutants aux compétiteurs confirmés.
              Nos valeurs fondamentales sont le respect, l'esprit sportif, la persévérance et la convivialité.
            </p>
            <p className="text-clubBackground-foreground">
              Nous croyons que le sport est un formidable vecteur de lien social et de développement personnel.
              Rejoignez-nous pour partager notre passion !
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="mb-12">
        <Card className="bg-card shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-clubAccent">Nos Infrastructures</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2 text-clubBackground-foreground">
              <li>Salle principale avec 8 tables de compétition</li>
              <li>Espace d'entraînement dédié avec robots et tables d'échauffement</li>
              <li>Vestiaires modernes et douches</li>
              <li>Club House convivial pour les moments de détente</li>
              <li>Parking facile d'accès</li>
            </ul>
            <img src="https://picsum.photos/800/400?random=1" alt="Infrastructure du club" className="mt-6 rounded-lg shadow-md w-full object-cover" />
          </CardContent>
        </Card>
      </section>

      <section className="mb-12">
        <Card className="bg-card shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-clubAccent">Horaires et Tarifs</CardTitle>
          </CardHeader>
          <CardContent>
            <h3 className="text-xl font-semibold mb-2 text-clubAccent">Horaires d'entraînement :</h3>
            <ul className="list-disc list-inside mb-4 text-clubBackground-foreground">
              <li>Lundi : 18h00 - 20h00 (Adultes Loisir)</li>
              <li>Mardi : 17h30 - 19h00 (Jeunes) / 19h00 - 21h00 (Compétition)</li>
              <li>Mercredi : 14h00 - 16h00 (École de Tennis de Table)</li>
              <li>Jeudi : 18h30 - 20h30 (Adultes Tous Niveaux)</li>
              <li>Vendredi : 19h00 - 22h00 (Jeu Libre)</li>
            </ul>
            <Separator className="my-4 bg-clubPrimary" />
            <h3 className="text-xl font-semibold mb-2 text-clubAccent">Tarifs des adhésions (saison 2024-2025) :</h3>
            <ul className="list-disc list-inside text-clubBackground-foreground">
              <li>Licence Loisir : 100€ / an</li>
              <li>Licence Compétition : 150€ / an</li>
              <li>Licence Jeune (-18 ans) : 80€ / an</li>
              <li>Option Coaching Personnalisé : +50€ / trimestre</li>
            </ul>
          </CardContent>
        </Card>
      </section>

      <section className="mb-12">
        <Card className="bg-card shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-clubAccent">L'Équipe Dirigeante</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="text-center">
                <img src="https://picsum.photos/150/150?random=2" alt="Président" className="rounded-full mx-auto mb-2 w-24 h-24 object-cover" />
                <h4 className="font-semibold text-clubAccent">Jean Dupont</h4>
                <p className="text-sm text-muted-foreground">Président</p>
              </div>
              <div className="text-center">
                <img src="https://picsum.photos/150/150?random=3" alt="Secrétaire" className="rounded-full mx-auto mb-2 w-24 h-24 object-cover" />
                <h4 className="font-semibold text-clubAccent">Marie Curie</h4>
                <p className="text-sm text-muted-foreground">Secrétaire</p>
              </div>
              <div className="text-center">
                <img src="https://picsum.photos/150/150?random=4" alt="Trésorier" className="rounded-full mx-auto mb-2 w-24 h-24 object-cover" />
                <h4 className="font-semibold text-clubAccent">Pierre Martin</h4>
                <p className="text-sm text-muted-foreground">Trésorier</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section>
        <Card className="bg-card shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-clubAccent">Labels FFTT</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-clubBackground-foreground">
              Notre club est fier d'être labellisé par la Fédération Française de Tennis de Table (FFTT).
              Ces labels attestent de la qualité de notre encadrement, de nos infrastructures et de notre engagement
              dans le développement du tennis de table.
            </p>
            <ul className="list-disc list-inside space-y-2 text-clubBackground-foreground">
              <li>Label Club Formateur</li>
              <li>Label Club Féminin</li>
              <li>Label Club Handisport</li>
            </ul>
            <img src="https://picsum.photos/300/100?random=5" alt="Logo FFTT" className="mt-6 mx-auto" />
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default LeClub;