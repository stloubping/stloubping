import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const LesLegendes = () => {
  return (
    <div className="container mx-auto px-4 py-8 bg-clubLight text-clubLight-foreground">
      <h1 className="text-4xl font-bold text-center mb-12 text-clubDark">Les Légendes du Tennis de Table en Vidéo</h1>

      <section className="mb-12">
        <Card className="bg-clubLight shadow-lg rounded-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-clubDark">Revivez les Moments Inoubliables des Icônes du Ping</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-clubLight-foreground">
              Plongez dans l'histoire du tennis de table et découvrez les performances légendaires des joueurs et joueuses qui ont marqué ce sport.
              Cette page rassemble une sélection de leurs meilleures vidéos, des points incroyables aux matchs épiques.
            </p>
            <p className="text-clubLight-foreground">
              Laissez-vous inspirer par la technique, la stratégie et la passion de ces athlètes hors pair !
            </p>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Exemple de vidéos de légendes */}
              <div className="aspect-w-16 aspect-h-9 w-full">
                <iframe
                  src="https://www.youtube.com/embed/X_y_2111111" // Exemple: Ma Long
                  title="Ma Long - The Dragon"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  className="w-full h-full rounded-lg shadow-md"
                ></iframe>
              </div>
              <div className="aspect-w-16 aspect-h-9 w-full">
                <iframe
                  src="https://www.youtube.com/embed/X_y_2222222" // Exemple: Jan-Ove Waldner
                  title="Jan-Ove Waldner - The Mozart of Table Tennis"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  className="w-full h-full rounded-lg shadow-md"
                ></iframe>
              </div>
              <div className="aspect-w-16 aspect-h-9 w-full">
                <iframe
                  src="https://www.youtube.com/embed/X_y_3333333" // Exemple: Ding Ning
                  title="Ding Ning - The Grand Slam Champion"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  className="w-full h-full rounded-lg shadow-md"
                ></iframe>
              </div>
              <div className="aspect-w-16 aspect-h-9 w-full">
                <iframe
                  src="https://www.youtube.com/embed/X_y_4444444" // Exemple: Timo Boll
                  title="Timo Boll - European Legend"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  className="w-full h-full rounded-lg shadow-md"
                ></iframe>
              </div>
            </div>
            <p className="mt-6 text-sm text-muted-foreground text-center">
              Les liens YouTube ci-dessus sont des exemples. Vous pouvez les remplacer par les vidéos spécifiques de légendes que vous souhaitez mettre en avant.
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default LesLegendes;