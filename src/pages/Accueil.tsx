"use client";
import React from 'react';
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import NewsCard from "@/components/NewsCard";
import { useLightbox } from '@/context/LightboxContext';
import HeroSection from "@/components/HeroSection";
import VideoCard from "@/components/VideoCard";
import { allVideos } from '@/data/videos';
import CompetitionCalendar from '@/components/CompetitionCalendar';

const allNewsItems = [
  // 1. Tournoi Régional (Première position)
  {
    id: 102,
    title: "Tournoi Régional Saint-Loub'Ping 2026",
    date: "11 Avril 2026",
    location: "Gymnase de Saint-Loubès",
    description: "Préparez vos raquettes ! Notre tournoi régional annuel revient avec de nouvelles catégories et de nombreux lots à gagner. Inscriptions ouvertes dès maintenant sur notre site. Ne manquez pas ce rendez-vous incontournable du tennis de table girondin !",
    link: "/tournoi-inscription",
    image: "/images/actualites/tournoi-regional-2026-affiche.png",
  },
  // 2. Les Inscrits LIVE (Nouveau)
  {
    id: 601,
    title: "Suivez les Inscriptions en Temps Réel !",
    date: "Actualisé en direct",
    location: "En ligne",
    description: "Découvrez qui participe au prochain tournoi ! Notre nouvelle page 'Les Inscrits LIVE' vous permet de consulter la liste des joueurs inscrits, triée par points, pour chaque tableau. Restez informé de la concurrence et suivez l'évolution des tableaux en un clic.",
    link: "/tournoi/inscrits-live",
    image: "/images/actualites/618356170_854903077381621_829078142067363181_n.jpg",
  },
  // 3. Soirée Paella
  {
    id: 501,
    title: "Soirée Paella mémorable après le Critérium !",
    date: "Novembre 2025",
    location: "Salle du club",
    description: "Ce qui a le plus marqué la soirée de critérium, c'est le repas partagé avec nos adversaires ! Patrice et Sandra nous ont préparé une paella d'anthologie. Un moment ultra convivial qui fait le succès de cette compétition et de ses après-matchs !",
    link: "#",
    image: "/images/actualites/616230059_854903077381615_8680231693854484940_n.jpg",
  },
  // 4. Maillot du Club
  {
    id: 4,
    title: "Le Maillot Officiel est Arrivé !",
    date: "Disponible maintenant",
    location: "Boutique du Club",
    description: "Représentez fièrement le St Loub Ping ! Le nouveau maillot officiel est disponible à la commande. Découvrez les tailles et les modalités d'achat sur notre page Boutique.",
    link: "/boutique",
    image: "/images/boutique/maillot-club-officiel.png",
  },
  // 5. Stage de Noël
  {
    id: 101,
    title: "Stage de Noël pour les Jeunes",
    date: "22, 23 et 24 Décembre",
    location: "Salle du club",
    description: "Un stage intensif pour les jeunes compétiteurs souhaitant améliorer leur technique et leur stratégie avant les fêtes. Encadrement par nos meilleurs entraîneurs.",
    link: "/adhesions",
    image: "/images/actualites/stage-de-noel.jpg",
  },
  // 6. Tournoi de Noël
  {
    id: 201,
    title: "Tournoi de Noël des Jeunes",
    date: "20 Décembre 2025",
    location: "Salle du club",
    description: "Le Saint Loub’ping a organisé son traditionnel tournoi de Noël. Comme chaque année, cette compétition amicale a réuni nos jeunes licenciés pour un moment de sport et de partage.",
    link: "#",
    image: "/images/actualites/bordeauxrivedroite-5abc395193ac4b90ab4842d2eea90891-104939-ph0.avif",
  },
  // 7. Reprise Phase 2
  {
    id: 202,
    title: "Reprise phase 2 du championnat",
    date: "28 février 2026",
    location: "Salle du club",
    description: "C'est reparti pour la seconde phase du championnat ! Venez nombreux encourager nos équipes pour cette reprise tant attendue à domicile dès 15h00.",
    link: "/competitions-equipes",
    image: "/images/events/IMG-20251003-WA0001.jpg",
  },
];

const Accueil = () => {
  const { openLightbox } = useLightbox();
  
  const latestVideos = [...allVideos]
    .sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime())
    .slice(0, 2);

  return (
    <div className="bg-clubLight text-clubLight-foreground">
      <HeroSection 
        title="Bienvenue au St Loub Ping" 
        description="Votre club de tennis de table à Saint-Loubès. Passion, convivialité et compétition pour tous les ages et tous les niveaux." 
        imageUrl="/images/hero/club-training.jpg" 
        imageAlt="Joueurs de tennis de table en plein entraînement" 
      />
      <div className="container mx-auto px-4 py-8">
        {/* Actualités Section (Regroupée) */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8 text-clubDark">Dernières Actualités</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allNewsItems.map((news) => (
              <NewsCard key={news.id} news={news} />
            ))}
          </div>
        </section>

        {/* Suivez-nous Section avec flux Facebook */}
        <section className="text-center mb-12">
          <Card className="bg-clubLight shadow-lg p-8 rounded-xl">
            <CardTitle className="text-2xl font-bold text-clubDark mb-4">Suivez-nous sur Facebook !</CardTitle>
            <CardContent>
              <p className="mb-6 text-clubLight-foreground">
                Restez connecté avec le club et ne manquez aucune actualité, événement ou résultat directement depuis notre page Facebook.
              </p>
              <div className="mt-8 flex justify-center w-full max-w-[320px] mx-auto">
                <iframe 
                  src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fp%2FSaint-LoubPing-100085857905183%2F&tabs=timeline&width=500&height=600&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId" 
                  width="100%" 
                  height="600" 
                  style={{ border: 'none', overflow: 'hidden' }} 
                  scrolling="no" 
                  frameBorder="0" 
                  allowFullScreen={true} 
                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                  title="Page Facebook Saint-LoubPing"
                ></iframe>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Calendrier des Compétitions */}
        <CompetitionCalendar />

        {/* Dernières Vidéos Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8 text-clubDark">Dernières Vidéos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {latestVideos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        </section>

        {/* Rejoignez-nous Section */}
        <section className="text-center">
          <Card className="bg-clubLight shadow-lg p-8 rounded-xl">
            <CardTitle className="text-2xl text-clubDark mb-4">Prêt à nous rejoindre ?</CardTitle>
            <CardContent>
              <p className="mb-6 text-clubLight-foreground">
                Que vous soyez débutant ou expert, jeune ou moins jeune, le St Loub Ping vous attend ! Découvrez nos différentes formules d'adhésion et trouvez celle qui vous convient.
              </p>
              <Button asChild className="bg-clubPrimary hover:bg-clubPrimary/90 text-clubPrimary-foreground px-8 py-4 text-lg rounded-md shadow-lg">
                <Link to="/adhesions">Découvrir nos Adhésions</Link>
              </Button>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default Accueil;