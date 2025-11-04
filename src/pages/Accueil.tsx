import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { CalendarDays, Clock, MapPin, ChevronRight } from 'lucide-react';
import { Separator } from "@/components/ui/separator";
import { useLightbox } from '@/context/LightboxContext';

const newsItems = [
  {
    id: 1,
    image: "/images/actualites/561606494_777489285122995_5427379147122871235_n.jpg",
    alt: "Actualité 1",
    title: "Championnat par équipes : J3",
    description: "L'équipe 4 fait match nul 7-7 contre C STE HELENE 4. Un bon point de pris à l'extérieur !",
    link: "/actualites/championnat-equipes-j3",
  },
  {
    id: 2,
    image: "/images/actualites/559716404_777489288456328_4293602483346407225_n.jpg",
    alt: "Actualité 2",
    title: "Championnat par équipes : J3",
    description: "L'équipe 2 s'incline 11-3 contre US CENON 5. Le maintien sera difficile à aller chercher.",
    link: "/actualites/championnat-equipes-j3",
  },
  {
    id: 3,
    image: "/images/actualites/559465112_777489365122987_5984336681092815830_n.jpg",
    alt: "Actualité 3",
    title: "Championnat par équipes : J3",
    description: "L'équipe 5 s'incline 11-3 contre LE HAILLAN TT 7. La poule est relevée !",
    link: "/actualites/championnat-equipes-j3",
  },
  {
    id: 4,
    image: "/images/actualites/559457962_777489378456319_6114307706364752867_n.jpg",
    alt: "Actualité 4",
    title: "Championnat par équipes : J3",
    description: "L'équipe 6 s'impose 12-2 contre TT FARGUIAIS 4. Une belle victoire pour nos jeunes !",
    link: "/actualites/championnat-equipes-j3",
  },
  {
    id: 5,
    image: "/images/actualites/561695574_777489311789659_3783358259365139184_n.jpg",
    alt: "Actualité 5",
    title: "Championnat par équipes : J3",
    description: "L'équipe 1 s'impose 9-5 contre CA BEGLAIS 4. La R2 est à nous !",
    link: "/actualites/championnat-equipes-j3",
  },
];

const events = [
  {
    id: 1,
    title: "Tournoi Interne",
    date: "11 Avril", // Date mise à jour
    time: "19h00",
    location: "Salle Spécifique",
    description: "Tournoi amical ouvert à tous les membres du club. Venez nombreux !",
  },
  {
    id: 2,
    title: "Assemblée Générale",
    date: "22 Mars",
    time: "18h30",
    location: "Maison des Associations",
    description: "Réunion annuelle pour discuter des projets du club et élire le nouveau bureau.",
  },
  {
    id: 3,
    title: "Stage de Perfectionnement",
    date: "10-12 Avril",
    time: "Journée complète",
    location: "Salle Spécifique",
    description: "Stage intensif pour améliorer votre technique avec des entraîneurs qualifiés.",
  },
];

const partners = [
  { id: 1, name: "Partner 1", logo: "https://via.placeholder.com/150x80?text=Partner+1", link: "#" },
  { id: 2, name: "Partner 2", logo: "https://via.placeholder.com/150x80?text=Partner+2", link: "#" },
  { id: 3, name: "Partner 3", logo: "https://via.placeholder.com/150x80?text=Partner+3", link: "#" },
  { id: 4, name: "Partner 4", logo: "https://via.placeholder.com/150x80?text=Partner+4", link: "#" },
];

const Accueil = () => {
  const { openLightbox } = useLightbox();

  return (
    <div className="container mx-auto px-4 py-8 bg-clubLight text-clubLight-foreground">
      {/* Hero Section */}
      <section className="relative bg-clubDark text-clubDark-foreground rounded-xl shadow-lg overflow-hidden mb-12">
        <img
          src="/images/hero-banner.jpg"
          alt="Joueurs de tennis de table en action"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="relative z-10 p-8 md:p-16 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight">
            Bienvenue au St Loub Ping
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Votre club de tennis de table à Saint-Loubès. Passion, compétition et convivialité !
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild className="bg-clubPrimary hover:bg-clubPrimary/90 text-clubPrimary-foreground px-8 py-3 text-lg rounded-full shadow-lg transition-transform transform hover:scale-105">
              <Link to="/inscription">Rejoignez-nous</Link>
            </Button>
            <Button asChild variant="outline" className="border-2 border-clubPrimary text-clubPrimary bg-transparent hover:bg-clubPrimary/10 px-8 py-3 text-lg rounded-full shadow-lg transition-transform transform hover:scale-105">
              <Link to="/contact">Contact</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Actualités Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-center mb-8 text-clubDark">Dernières Actualités</h2>
        <Carousel
          opts={{
            align: "start",
          }}
          className="w-full max-w-5xl mx-auto"
        >
          <CarouselContent>
            {newsItems.map((item) => (
              <CarouselItem key={item.id} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-1">
                  <Card className="bg-clubLight shadow-md rounded-lg overflow-hidden h-full flex flex-col">
                    <img src={item.image} alt={item.alt} className="w-full h-48 object-cover" />
                    <CardHeader className="flex-grow">
                      <CardTitle className="text-xl font-semibold text-clubPrimary">{item.title}</CardTitle>
                      <CardDescription className="text-clubLight-foreground/80 mt-2">{item.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <Button asChild variant="link" className="text-clubPrimary hover:text-clubPrimary/80 p-0 h-auto">
                        <Link to={item.link} className="flex items-center">
                          Lire la suite <ChevronRight className="ml-1 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
        <div className="text-center mt-8">
          <Button asChild className="bg-clubPrimary hover:bg-clubPrimary/90 text-clubPrimary-foreground px-6 py-3 text-base rounded-md shadow-lg">
            <Link to="/actualites">Voir toutes les actualités</Link>
          </Button>
        </div>
      </section>

      <Separator className="my-12 bg-clubDark/20" />

      {/* Prochains Événements Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-center mb-8 text-clubDark">Prochains Événements</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <Card key={event.id} className="bg-clubLight shadow-md rounded-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-clubPrimary">{event.title}</CardTitle>
                <CardDescription className="flex items-center text-clubLight-foreground/80 mt-2">
                  <CalendarDays className="mr-2 h-4 w-4" /> {event.date} - {event.time}
                </CardDescription>
                <CardDescription className="flex items-center text-clubLight-foreground/80">
                  <MapPin className="mr-2 h-4 w-4" /> {event.location}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-clubLight-foreground">{event.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="text-center mt-8">
          <Button asChild className="bg-clubPrimary hover:bg-clubPrimary/90 text-clubPrimary-foreground px-6 py-3 text-base rounded-md shadow-lg">
            <Link to="/evenements">Voir tous les événements</Link>
          </Button>
        </div>
      </section>

      <Separator className="my-12 bg-clubDark/20" />

      {/* Galerie Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-center mb-8 text-clubDark">Notre Galerie</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="relative group cursor-pointer" onClick={() => openLightbox(`/images/gallery/gallery-${i}.jpg`)}>
              <img
                src={`/images/gallery/gallery-${i}.jpg`}
                alt={`Galerie image ${i}`}
                className="w-full h-32 md:h-48 object-cover rounded-lg shadow-md transition-transform transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                <span className="text-white text-lg font-semibold">Voir</span>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Button asChild className="bg-clubPrimary hover:bg-clubPrimary/90 text-clubPrimary-foreground px-6 py-3 text-base rounded-md shadow-lg">
            <Link to="/galerie">Voir toute la galerie</Link>
          </Button>
        </div>
      </section>

      <Separator className="my-12 bg-clubDark/20" />

      {/* Partenaires Section */}
      <section>
        <h2 className="text-3xl font-bold text-center mb-8 text-clubDark">Nos Partenaires</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-center">
          {partners.map((partner) => (
            <a key={partner.id} href={partner.link} target="_blank" rel="noopener noreferrer" className="flex justify-center items-center p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <img src={partner.logo} alt={partner.name} className="max-h-20 object-contain" />
            </a>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Accueil;