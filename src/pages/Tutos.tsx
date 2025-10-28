import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Tutos = () => {
  return (
    <div className="container mx-auto px-4 py-8 bg-clubLight text-clubLight-foreground">
      <h1 className="text-4xl font-bold text-center mb-12 text-clubDark">Tutos : Développez Votre Jeu !</h1>

      <section className="mb-12">
        <Card className="bg-clubLight shadow-lg rounded-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-clubDark">Améliorez Vos Techniques et Stratégies</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-clubLight-foreground">
              Que vous soyez débutant ou joueur confirmé, cette section est dédiée à vous aider à progresser.
              Découvrez des tutoriels vidéo sur les techniques de base, les services, les topspins, les défenses,
              ainsi que des conseils tactiques pour dominer vos adversaires.
            </p>
            <p className="text-clubLight-foreground">
              Nos entraîneurs et des experts du tennis de table partagent leurs astuces pour affiner votre jeu.
              Cette page sera régulièrement mise à jour avec de nouveaux contenus !
            </p>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Exemple de vidéos de tutoriels */}
              <div className="aspect-w-16 aspect-h-9 w-full">
                <iframe
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ" // Placeholder video 1 (Rick Astley)
                  title="Tuto: Le Service de Base"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  className="w-full h-full rounded-lg shadow-md"
                ></iframe>
                <p className="mt-2 text-sm text-center text-muted-foreground">Le Service de Base : Maîtrisez les Fondamentaux</p>
              </div>
              <div className="aspect-w-16 aspect-h-9 w-full">
                <iframe
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ" // Placeholder video 2 (Rick Astley)
                  title="Tuto: Le Topspin Coup Droit"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  className="w-full h-full rounded-lg shadow-md"
                ></iframe>
                <p className="mt-2 text-sm text-center text-muted-foreground">Le Topspin Coup Droit : Puissance et Précision</p>
              </div>
              <div className="aspect-w-16 aspect-h-9 bg-clubSection rounded-lg flex items-center justify-center text-muted-foreground">
                <p>Plus de tutoriels à venir !</p>
              </div>
              <div className="aspect-w-16 aspect-h-9 bg-clubSection rounded-lg flex items-center justify-center text-muted-foreground">
                <p>Suggérez vos sujets préférés !</p>
              </div>
            </div>
            <p className="mt-6 text-sm text-muted-foreground text-center">
              Les vidéos ci-dessus sont des exemples. N'hésitez pas à me demander de les remplacer par des tutoriels spécifiques.
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default Tutos;