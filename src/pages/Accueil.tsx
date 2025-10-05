import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import HeroSection from "@/components/HeroSection"; // Import the new HeroSection component
import { Link } from "react-router-dom";

const playerImages = [
  "https://i.imgur.com/P9ddf1f.jpeg",
  "https://i.imgur.com/lXqoHkV.jpeg", // Updated with the new image
  "https://picsum.photos/id/239/200/300", // Example Picsum image
];

const newsItems = [
  {
    id: 1,
    title: "Victoire éclatante de notre équipe A !",
    date: "15 Septembre 2024",
    description: "L'équipe première a dominé ses adversaires lors du dernier championnat régional.",
    image: "https://picsum.photos/400/250?random=1",
  },
  {
    id: 2,
    title: "Nouveaux horaires d'entraînement pour les jeunes",
    date: "10 Septembre 2024",
    description: "Découvrez les nouvelles sessions dédiées aux jeunes talents du club.",
    image: "https://picsum.photos/400/250?random=2",
  },
  {
    id: 3,
    title: "Tournoi interne de rentrée : les résultats !",
    date: "05 Septembre 2024",
    description: "Félicitations à tous les participants de notre tournoi amical de début de saison.",
    image: "https://picsum.photos/400/250?random=3",
  },
];

const eventsItems = [
  {
    id: 1,
    day: "20",
    month: "SEPT",
    title: "Tournoi d'été",
    time: "10:00 - 18:00",
    description: "Grand tournoi ouvert à tous les niveaux avec de nombreux lots à gagner.",
  },
  {
    id: 2,
    day: "05",
    month: "OCT",
    title: "Stage Intensif",
    time: "09:00 - 17:00",
    description: "Stage d'une semaine pour progresser rapidement avec nos coachs professionnels.",
  },
  {
    id: 3,
    day: "15",
    month: "NOV",
    title: "Portes ouvertes",
    time: "10:00 - 16:00",
    description: "Venez découvrir le club, essayer le matériel et rencontrer nos membres.",
  },
];

const Accueil = () => {
  return (
    <div className="bg-clubLight text-clubLight-foreground">
      <HeroSection
        title="Bienvenue au St Loub Ping"
        description="Rejoignez notre communauté passionnée de ping-pong. Compétition, loisir ou découverte, il y a une place pour vous !"
        buttonText="S'inscrire"
        buttonLink="/adhesions"
        imageUrl="https://i.imgur.com/F5aCw3I.jpeg" // Updated image URL
        imageAlt="Joueur de tennis de table en action"
      />

      <section className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12 text-clubDark">Galerie du Club</h2>
        <Carousel className="w-full max-w-5xl mx-auto">
          <CarouselContent className="-ml-4">
            {playerImages.map((src, index) => (
              <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
                <div className="p-1">
                  <Card className="border-none shadow-lg rounded-xl overflow-hidden">
                    <CardContent className="flex aspect-video items-center justify-center p-0">
                      <img src={src} alt={`Joueur de tennis de table ${index + 1}`} className="w-full h-full object-cover" />
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-4" />
          <CarouselNext className="right-4" />
        </Carousel>
      </section>

      <section className="bg-clubSection py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12 text-clubDark">Actualités</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newsItems.map((news) => (
              <Card key={news.id} className="bg-clubLight shadow-lg rounded-xl overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <img src={news.image} alt={news.title} className="w-full h-48 object-cover" />
                <CardHeader className="pb-2">
                  <p className="text-sm text-muted-foreground">{news.date}</p>
                  <CardTitle className="text-xl font-semibold text-clubDark">{news.title}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-clubLight-foreground mb-4">{news.description}</p>
                  <Link to="#" className="text-clubPrimary hover:underline text-sm font-medium">
                    Lire plus
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12 text-clubDark">Prochains Événements</h2>
        <div className="grid grid-cols-1 gap-6 max-w-3xl mx-auto">
          {eventsItems.map((event) => (
            <Card key={event.id} className="bg-clubLight shadow-lg rounded-xl overflow-hidden flex items-center p-4 hover:shadow-xl transition-shadow duration-300">
              <div className="flex-shrink-0 bg-clubPrimary text-clubPrimary-foreground rounded-lg p-3 text-center w-20 h-20 flex flex-col items-center justify-center mr-4">
                <span className="text-2xl font-bold leading-none">{event.day}</span>
                <span className="text-xs uppercase leading-none">{event.month}</span>
              </div>
              <div>
                <CardTitle className="text-xl font-semibold text-clubDark mb-1">{event.title}</CardTitle>
                <p className="text-muted-foreground text-sm mb-2">{event.time}</p>
                <p className="text-clubLight-foreground text-sm">{event.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Accueil;