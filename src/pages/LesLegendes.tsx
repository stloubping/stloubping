import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import VideoCard from '@/components/VideoCard'; // Import VideoCard
import { allVideos } from '@/data/videos'; // Import allVideos

const LesLegendes = () => {
  const legendsVideos = allVideos.filter(video => video.category === 'legends');

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
              {legendsVideos.map(video => (
                <VideoCard key={video.id} video={video} />
              ))}
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