import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import VideoCard from '@/components/VideoCard'; // Import VideoCard
import { allVideos } from '@/data/videos'; // Import allVideos

const WTTVideos = () => {
  // Filtrer les vidéos WTT et les trier par date d'ajout (les plus récentes en premier)
  const wttVideos = allVideos
    .filter(video => video.category === 'wtt')
    .sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime());

  return (
    <div className="container mx-auto px-4 py-8 bg-clubLight text-clubLight-foreground">
      <h1 className="text-4xl font-bold text-center mb-12 text-clubDark">Vidéos WTT</h1>

      <section className="mb-12">
        <Card className="bg-clubLight shadow-lg rounded-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-clubDark">Les Meilleurs Moments du Circuit WTT</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-clubLight-foreground">
              Découvrez ici une sélection des actions les plus spectaculaires, des points incroyables et des matchs mémorables du circuit World Table Tennis (WTT).
              Préparez-vous à être inspiré par l'élite mondiale du tennis de table !
            </p>
            <p className="text-clubLight-foreground">
              Cette section sera régulièrement mise à jour avec de nouvelles vidéos.
            </p>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              {wttVideos.map(video => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default WTTVideos;