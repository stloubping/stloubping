import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Calendar, Users, Trophy, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import HeroSection from '@/components/HeroSection';

const newsItems = [
  {
    id: 1,
    image: "https://picsum.photos/300/200?random=1", 
    date: "15 Octobre 2024",
    title: "Ouverture des inscriptions pour la nouvelle saison !",
    description: "Ne manquez pas l'occasion de rejoindre notre club pour une saison riche en émotions et en compétitions. Tous les niveaux sont les bienvenus !",
    link: "/inscriptions",
  },
  {
    id: 2,
    image: "https://picsum.photos/300/200?random=2",
    date: "01 Octobre 2024",
    title: "Succès de notre tournoi annuel 2025",
    description: "Un grand merci à tous les participants et bénévoles qui ont fait de notre tournoi annuel un événement mémorable. Félicitations aux vainqueurs !",
    link: "/evenements",
  },
  {
    id: 3,
    image: "https://picsum.photos/300/200?random=3",
    date: "20 Septembre 2024",
    title: "Nos jeunes talents brillent en compétition régionale",
    description: "Fiers de nos jeunes joueurs qui ont montré de belles performances lors des championnats régionaux. L'avenir du club est assuré !",
    link: "/competitions-equipes",
  },
];

const partners = [
  { name: "Ville de Saint-Loubès", logo: "https://picsum.photos/100/50?random=10" },
  { name: "Conseil Départemental", logo: "https://picsum.photos/100/50?random=11" },
  { name: "FFTT", logo: "https://picsum.photos/100/50?random=12" },
];

const Accueil = () => {
  return (
    <div className="container mx-auto px-4 py-8 bg-clubLight text-clubLight-foreground">
      {/* Hero Section */}
      <HeroSection
        imageUrl="/images/hero/FB_IMG_1759672880255_hero.jpg"
        imageAlt="Joueurs de tennis de table en action"
        title="Bienvenue au Club de Tennis de Table de Saint-Loubès"
        description="Passion, entraînement et convivialité : rejoignez notre communauté pour progresser et partager l'amour du tennis de table."
      />

      {/* Actualités Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-center text-clubDark mb-8">Dernières Actualités</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsItems.map((news) => (
            <Card key={news.id} className="bg-clubLight shadow-lg rounded-xl overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <img src={news.image} alt={news.title} className="w-full h-48 object-cover" onError={(e) => {
                e.currentTarget.src = 'https://via.placeholder.com/300x200?text=Image+Non+Trouvée'; // Fallback image
              }} />
              <CardHeader className="pb-2">
                <p className="text-sm text-muted-foreground">{news.date}</p>
                <CardTitle className="text-xl font-semibold text-clubDark">{news.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-clubLight-foreground mb-4">{news.description}</p>
                <Button asChild variant="link" className="text-clubPrimary hover:text-clubPrimary/80 p-0 h-auto">
                  <Link to={news.link}>Lire la suite</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Separator className="my-12 bg-clubDark" />

      {/* Pourquoi nous rejoindre Section */}
      <section className="mb-12 text-center">
        <h2 className="text-3xl font-bold text-clubDark mb-8">Pourquoi nous rejoindre ?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="bg-clubLight shadow-lg rounded-xl p-6 flex flex-col items-center text-clubLight-foreground">
            <Calendar className="h-12 w-12 text-clubPrimary mb-4" />
            <CardTitle className="text-xl font-semibold text-clubDark mb-2">Entraînements Adaptés</CardTitle>
            <CardContent className="text-sm">
              Des séances pour tous les âges et tous les niveaux, encadrées par des coachs expérimentés.
            </CardContent>
          </Card>
          <Card className="bg-clubLight shadow-lg rounded-xl p-6 flex flex-col items-center text-clubLight-foreground">
            <Users className="h-12 w-12 text-clubPrimary mb-4" />
            <CardTitle className="text-xl font-semibold text-clubDark mb-2">Esprit d'Équipe</CardTitle>
            <CardContent className="text-sm">
              Rejoignez une communauté dynamique et conviviale, où le partage et l'entraide sont au cœur de notre club.
            </CardContent>
          </Card>
          <Card className="bg-clubLight shadow-lg rounded-xl p-6 flex flex-col items-center text-clubLight-foreground">
            <Trophy className="h-12 w-12 text-clubPrimary mb-4" />
            <CardTitle className="text-xl font-semibold text-clubDark mb-2">Compétitions</CardTitle>
            <CardContent className="text-sm">
              Participez aux championnats locaux et régionaux, et mesurez-vous aux meilleurs joueurs.
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator className="my-12 bg-clubDark" />

      {/* Partenaires Section */}
      <section className="mb-12 text-center">
        <h2 className="text-3xl font-bold text-clubDark mb-8">Nos Partenaires</h2>
        <div className="flex flex-wrap justify-center items-center gap-8">
          {partners.map((partner, index) => (
            <div key={index} className="flex flex-col items-center">
              <img src={partner.logo} alt={partner.name} className="h-16 object-contain mb-2" />
              <p className="text-sm text-clubLight-foreground">{partner.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Appel à l'action Contact */}
      <section className="bg-clubPrimary text-white rounded-xl shadow-lg p-8 text-center">
        <h2 className="text-3xl font-bold mb-4">Une question ? Envie de nous rejoindre ?</h2>
        <p className="text-lg mb-6">N'hésitez pas à nous contacter, nous serons ravis de vous répondre !</p>
        <Button asChild className="bg-white text-clubPrimary hover:bg-gray-100 text-lg px-8 py-6 rounded-full shadow-md">
          <Link to="/contact" className="flex items-center justify-center gap-2">
            <Mail className="h-5 w-5" /> Contactez-nous
          </Link>
        </Button>
      </section>
    </div>
  );
};

export default Accueil;