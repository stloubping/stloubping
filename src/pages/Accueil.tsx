import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Users, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';

const newsItems = [
  {
    id: 1,
    image: "/images/news/photo_2025-10-12_22-03-19 (5).jpg", // Nouvelle image
    date: "12 Octobre 2025",
    title: "Tournoi Jeunes : Un Succès Retentissant !",
    description: "Nos jeunes talents ont brillé lors du dernier tournoi. Découvrez les résultats et les photos de l'événement.",
    link: "/actualites/tournoi-jeunes"
  },
  {
    id: 2,
    image: "https://picsum.photos/800/400?random=2",
    date: "05 Septembre 2025",
    title: "Inscriptions Saison 2025-2026 Ouvertes",
    description: "Ne manquez pas l'occasion de rejoindre notre club ! Toutes les informations pour vous inscrire à la nouvelle saison.",
    link: "/actualites/inscriptions-saison"
  },
  {
    id: 3,
    image: "https://picsum.photos/800/400?random=3",
    date: "20 Août 2025",
    title: "Préparation Physique : Reprise des Entraînements",
    description: "Nos équipes seniors ont repris le chemin de l'entraînement avec une préparation intense pour la saison à venir.",
    link: "/actualites/reprise-entrainements"
  },
];

const events = [
  {
    id: 1,
    icon: <Calendar className="h-6 w-6 text-clubPrimary" />,
    title: "Prochain Match à Domicile",
    description: "Équipe A vs TT Villeurbanne - 20 Octobre 2025 à 20h00",
    link: "/competitions-equipes"
  },
  {
    id: 2,
    icon: <Users className="h-6 w-6 text-clubPrimary" />,
    title: "Séance Découverte Gratuite",
    description: "Venez essayer le tennis de table ! Tous les mercredis de 17h à 18h.",
    link: "/contact"
  },
  {
    id: 3,
    icon: <Trophy className="h-6 w-6 text-clubPrimary" />,
    title: "Tournoi Interne du Club",
    description: "Inscrivez-vous pour notre tournoi amical annuel le 15 Novembre 2025.",
    link: "/evenements"
  },
];

const Accueil = () => {
  return (
    <div className="container mx-auto px-4 py-8 bg-clubLight text-clubLight-foreground">
      {/* Hero Section */}
      <section className="relative bg-clubDark text-clubDark-foreground rounded-xl shadow-lg mb-12 overflow-hidden">
        <img
          src="https://picsum.photos/1200/600?random=1"
          alt="Joueurs de tennis de table en action"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="relative z-10 p-8 md:p-16 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight">
            Bienvenue au Club de Tennis de Table !
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Passion, entraînement et compétition : rejoignez notre communauté et vivez le tennis de table.
          </p>
          <div className="flex justify-center space-x-4">
            <Link to="/inscriptions">
              <Button className="bg-clubPrimary hover:bg-clubPrimary/90 text-white px-8 py-3 text-lg rounded-full shadow-md">
                Nous Rejoindre
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" className="border-2 border-clubPrimary text-clubPrimary bg-transparent hover:bg-clubPrimary hover:text-white px-8 py-3 text-lg rounded-full shadow-md">
                Contact
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Actualités Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-center text-clubDark mb-8">Dernières Actualités</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsItems.map((news) => (
            <Card key={news.id} className="bg-clubLight shadow-lg rounded-xl overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <img src={news.image} alt={news.title} className="w-full h-48 object-cover" />
              <CardHeader className="pb-2">
                <p className="text-sm text-muted-foreground">{news.date}</p>
                <CardTitle className="text-xl font-semibold text-clubDark">{news.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-clubLight-foreground mb-4">{news.description}</p>
                <Link to={news.link}>
                  <Button variant="link" className="text-clubPrimary p-0 h-auto">Lire la suite</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Événements à Venir Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-center text-clubDark mb-8">Événements à Venir</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {events.map((event) => (
            <Card key={event.id} className="bg-clubLight shadow-lg rounded-xl p-6 text-center hover:shadow-xl transition-shadow duration-300">
              <div className="flex justify-center mb-4">{event.icon}</div>
              <CardTitle className="text-xl font-semibold text-clubDark mb-2">{event.title}</CardTitle>
              <CardContent className="p-0">
                <p className="text-clubLight-foreground mb-4">{event.description}</p>
                <Link to={event.link}>
                  <Button variant="outline" className="border-clubPrimary text-clubPrimary hover:bg-clubPrimary hover:text-white">
                    En savoir plus
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* À Propos du Club Section */}
      <section className="text-center bg-clubDark text-clubDark-foreground p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold mb-4">Notre Club</h2>
        <p className="text-lg max-w-3xl mx-auto mb-6">
          Fondé en 1985, notre club de tennis de table est un lieu de rencontre pour les passionnés de tous âges et de tous niveaux.
          Nous promouvons l'esprit sportif, le dépassement de soi et la convivialité.
        </p>
        <Link to="/a-propos">
          <Button className="bg-clubPrimary hover:bg-clubPrimary/90 text-white px-6 py-3 text-lg rounded-full shadow-md">
            Découvrir le Club
          </Button>
        </Link>
      </section>
    </div>
  );
};

export default Accueil;