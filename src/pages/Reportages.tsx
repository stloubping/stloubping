import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import VideoCard from "@/components/VideoCard";
import { allVideos } from "@/data/videos";

const Reportages = () => {
  const reportageVideos = allVideos
    .filter((video) => video.category === "reportages")
    .sort(
      (a, b) =>
        new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime(),
    );

  return (
    <div className="container mx-auto bg-clubLight px-4 py-8 text-clubLight-foreground">
      <h1 className="mb-12 text-center text-4xl font-bold text-clubDark">
        Reportages
      </h1>

      <section className="mb-12">
        <Card className="rounded-xl bg-clubLight shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-clubDark">
              Le tennis de table autrement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-clubLight-foreground">
              Retrouvez une sélection de reportages, portraits et sujets autour
              du tennis de table.
            </p>
            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
              {reportageVideos.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default Reportages;
