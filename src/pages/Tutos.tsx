import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import VideoCard from '@/components/VideoCard'; // Import VideoCard
import { allVideos } from '@/data/videos'; // Import allVideos

const Tutos = () => {
  const tutosVideos = allVideos.filter(video => video.category === 'tutos');

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
              {tutosVideos.map(video => (
                <VideoCard key={video.id} video={video} />
              ))}
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