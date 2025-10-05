import { MadeWithDyad } from "@/components/made-with-dyad";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const playerImages = [
  "https://images.unsplash.com/photo-1551730456-f0232777be82?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1551730456-f0232777be82?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1551730456-f0232777be82?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
];

const newsItems = [
  {
    id: 1,
    title: "Victoire éclatante de notre équipe A !",
    date: "15 Septembre 2024",
    description: "L'équipe première a dominé ses adversaires lors du dernier championnat régional.",
  },
  {
    id: 2,
    title: "Nouveaux horaires d'entraînement pour les jeunes",
    date: "10 Septembre 2024",
    description: "Découvrez les nouvelles sessions dédiées aux jeunes talents du club.",
  },
  {
    id: 3,
    title: "Tournoi interne de rentrée : les résultats !",
    date: "05 Septembre 2024",
    description: "Félicitations à tous les participants de notre tournoi amical de début de saison.",
  },
];

const eventsItems = [
  {
    id: 1,
    title: "Championnat Départemental",
    date: "22 Octobre 2024",
    location: "Salle Omnisports, Ville",
  },
  {
    id: 2,
    title: "Soirée du Club",
    date: "15 Novembre 2024",
    location: "Club House",
  },
  {
    id: 3,
    title: "Stage de Perfectionnement",
    date: "Vacances de Février 2025",
    location: "Gymnase du Club",
  },
];

const Accueil = () => {
  return (
    <div className="container mx-auto px-4 py-8 bg-clubBackground text-clubBackground-foreground">
      <section className="mb-12">
        <Carousel className="w-full max-w-4xl mx-auto">
          <CarouselContent>
            {playerImages.map((src, index) => (
              <CarouselItem key={index}>
                <div className="p-1">
                  <Card className="border-none shadow-lg">
                    <CardContent className="flex aspect-video items-center justify-center p-0">
                      <img src={src} alt={`Joueur de tennis de table ${index + 1}`} className="w-full h-full object-cover rounded-lg" />
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-bold text-center mb-8 text-clubPrimary">Actualités Récentes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {newsItems.map((news) => (
            <Card key={news.id} className="bg-card shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-clubPrimary">{news.title}</CardTitle>
                <p className="text-sm text-muted-foreground">{news.date}</p>
              </CardHeader>
              <CardContent>
                <p className="text-clubBackground-foreground">{news.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-bold text-center mb-8 text-clubPrimary">Prochains Événements</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {eventsItems.map((event) => (
            <Card key={event.id} className="bg-card shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-clubPrimary">{event.title}</CardTitle>
                <p className="text-sm text-muted-foreground">{event.date}</p>
              </CardHeader>
              <CardContent>
                <p className="text-clubBackground-foreground">{event.location}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Accueil;