import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, Users, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';

const newsData = [
  {
    id: "tournoi-familles-2025",
    title: "🏓 Tournoi des Familles 2025 : une soirée pleine d’énergie et de sourires !",
    date: "2025-06-07",
    image: "/images/actualites/tournoi-familles-2025.jpg",
    content: `Vendredi dernier, notre club a accueilli le traditionnel Tournoi des Familles, un moment toujours très attendu où chaque licencié peut faire découvrir le tennis de table à un proche — parent, enfant, ami… le temps d’une soirée placée sous le signe du partage et de la convivialité.
    🎉 43 équipes se sont affrontées dans une ambiance bon enfant, avec 108 matchs disputés et 324 manches jouées ! Autant dire que les balles ont volé dans tous les sens… et les rires aussi !
    🍽️ Pendant que certains s’acharnaient à la table, d’autres profitaient du buffet façon auberge espagnole, riche en saveurs et en échanges. Un vrai régal pour les papilles et pour les liens humains.
    🥇 Le podium 2025 :
    - Famille Serelle
    - Famille Legoix
    - Famille Reynaud
    Bravo à tous les participants pour leur bonne humeur et leur esprit sportif ! Et un grand merci à celles et ceux qui ont contribué à l’organisation de cette belle soirée 💙
    Merci à Margaux pour les photos ci jointes.`,
  },
  {
    id: "tournoi-regional-2026",
    title: "Tournoi Régional Saint-Loub'Ping 2026 : Les inscriptions sont ouvertes !",
    date: "2026-01-15",
    image: "/images/actualites/Gemini_Generated_Image_mlgzatmlgzatmlgz.png",
    content: `Préparez vos raquettes ! Le club de Saint-Loub'Ping est fier d'annoncer l'ouverture des inscriptions pour son Tournoi Régional 2026. Que vous soyez un joueur confirmé ou un jeune talent, venez défier les meilleurs dans une ambiance conviviale et compétitive. De nombreux tableaux sont proposés pour tous les classements. Ne manquez pas cette occasion de montrer votre talent et de partager votre passion !`,
  },
  {
    id: "nouvelle-saison-2025-2026",
    title: "C'est la rentrée ! Nouvelle saison 2025-2026",
    date: "2025-09-01",
    image: "/images/actualites/ping-pong-rentree.jpg",
    content: `La nouvelle saison de tennis de table 2025-2026 est officiellement lancée ! Nous sommes ravis d'accueillir nos anciens membres et d'ouvrir nos portes aux nouveaux passionnés. Que vous souhaitiez pratiquer en loisir ou en compétition, nos entraîneurs sont prêts à vous accompagner. Venez nous rencontrer lors de nos journées portes ouvertes et découvrez nos différentes formules d'adhésion.`,
  },
  {
    id: "resultats-interclubs-2025",
    title: "Interclubs 2025 : Une saison mémorable pour Saint-Loub'Ping !",
    date: "2025-05-20",
    image: "/images/actualites/interclubs-2025.jpg",
    content: `L'équipe de Saint-Loub'Ping a brillé lors des interclubs 2025, réalisant des performances exceptionnelles et montrant un esprit d'équipe exemplaire. Après des mois d'entraînements intenses et de matchs acharnés, nos joueurs ont su se dépasser pour atteindre des objectifs ambitieux. Un grand bravo à tous les participants et aux supporters qui ont fait de cette saison un succès inoubliable !`,
  },
];

const Accueil = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <section className="text-center mb-12">
        <h1 className="text-5xl font-extrabold text-clubPrimary mb-4 animate-fade-in-down">Bienvenue à Saint-Loub'Ping !</h1>
        <p className="text-xl text-clubLight-foreground max-w-2xl mx-auto mb-8 animate-fade-in-up">
          Votre club de tennis de table à Saint-Loubès. Passion, convivialité et performance au rendez-vous.
        </p>
        <div className="flex justify-center space-x-4 animate-fade-in-up">
          <Link to="/inscription-tournoi">
            <Button className="bg-clubPrimary hover:bg-clubPrimary/90 text-clubDark-foreground px-8 py-3 text-lg shadow-md">
              Inscrivez-vous au prochain tournoi
            </Button>
          </Link>
          <Link to="/contact">
            <Button variant="outline" className="border-clubPrimary text-clubPrimary hover:bg-clubPrimary/10 px-8 py-3 text-lg shadow-md">
              Nous contacter
            </Button>
          </Link>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-4xl font-bold text-clubPrimary text-center mb-8 animate-fade-in-down">Nos Dernières Actualités</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsData.map((news) => (
            <Card key={news.id} className="bg-clubLight shadow-lg rounded-xl overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <img src={news.image} alt={news.title} className="w-full h-48 object-cover" />
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-clubPrimary">{news.title}</CardTitle>
                <CardDescription className="flex items-center text-clubGray mt-2">
                  <CalendarDays className="mr-2 h-5 w-5 text-clubAccent" /> {news.date}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-clubLight-foreground mb-4 line-clamp-3">{news.content}</p>
                <Link to={`/actualites/${news.id}`}>
                  <Button variant="link" className="text-clubAccent hover:text-clubPrimary p-0 h-auto">
                    Lire la suite
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="text-center mb-12 bg-clubSection p-8 rounded-xl shadow-md">
        <h2 className="text-4xl font-bold text-clubDark mb-4">Rejoignez-nous !</h2>
        <p className="text-lg text-clubDark-foreground max-w-2xl mx-auto mb-6">
          Que vous soyez débutant ou expert, jeune ou moins jeune, venez partager votre passion du tennis de table dans une ambiance conviviale et dynamique.
        </p>
        <Link to="/contact">
          <Button className="bg-clubPrimary hover:bg-clubPrimary/90 text-clubDark-foreground px-8 py-3 text-lg shadow-md">
            Découvrir le club
          </Button>
        </Link>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center mb-12">
        <Card className="bg-clubLight p-6 rounded-xl shadow-md">
          <Users className="h-12 w-12 text-clubPrimary mx-auto mb-4" />
          <CardTitle className="text-xl font-semibold text-clubPrimary mb-2">Esprit d'équipe</CardTitle>
          <CardDescription className="text-clubLight-foreground">
            Développez vos compétences et votre esprit d'équipe dans un environnement stimulant.
          </CardDescription>
        </Card>
        <Card className="bg-clubLight p-6 rounded-xl shadow-md">
          <Trophy className="h-12 w-12 text-clubPrimary mx-auto mb-4" />
          <CardTitle className="text-xl font-semibold text-clubPrimary mb-2">Compétition</CardTitle>
          <CardDescription className="text-clubLight-foreground">
            Participez à des tournois locaux et régionaux pour tester vos limites.
          </CardDescription>
        </Card>
        <Card className="bg-clubLight p-6 rounded-xl shadow-md">
          <CalendarDays className="h-12 w-12 text-clubPrimary mx-auto mb-4" />
          <CardTitle className="text-xl font-semibold text-clubPrimary mb-2">Événements</CardTitle>
          <CardDescription className="text-clubLight-foreground">
            Profitez de nos événements réguliers et de nos soirées conviviales.
          </CardDescription>
        </Card>
      </section>
    </div>
  );
};

export default Accueil;