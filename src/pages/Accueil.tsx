import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, Trophy } from "lucide-react";

const Accueil = () => {
  return (
    <div className="min-h-screen bg-clubBackground text-clubDark-foreground">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center text-center bg-cover bg-center" style={{ backgroundImage: "url('/images/hero-bg.jpg')" }}>
        <div className="absolute inset-0 bg-clubDark opacity-70"></div>
        <div className="relative z-10 text-white p-4 md:p-8">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight">
            Bienvenue au <span className="text-clubPrimary">St Loub Ping</span>
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto">
            Votre club de tennis de table à Saint-Loubès. Passion, compétition et convivialité.
          </p>
          <Button asChild className="bg-clubPrimary hover:bg-clubPrimary/90 text-white text-lg px-8 py-6 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105">
            <Link to="/adhesions">Rejoignez-nous !</Link>
          </Button>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 px-4 md:px-8 lg:px-16 bg-clubLighter text-clubDark">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 text-clubDarker">À Propos de Notre Club</h2>
          <p className="text-lg leading-relaxed mb-8">
            Le St Loub Ping est un club dynamique dédié au tennis de table, offrant des opportunités pour tous les âges et tous les niveaux. Que vous soyez débutant ou joueur confirmé, venez partager notre passion dans une ambiance conviviale et stimulante.
          </p>
          <Button asChild variant="outline" className="border-clubPrimary text-clubPrimary hover:bg-clubPrimary hover:text-white transition-colors duration-300">
            <Link to="/le-club">En savoir plus</Link>
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 md:px-8 lg:px-16 bg-clubDark text-clubDark-foreground">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-clubPrimary">Ce que nous offrons</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-clubDarker border-clubPrimary text-clubDark-foreground shadow-lg">
              <CardHeader className="flex flex-col items-center text-center">
                <Calendar className="h-12 w-12 text-clubPrimary mb-4" />
                <CardTitle className="text-xl font-semibold">Entraînements Réguliers</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                Des séances d'entraînement adaptées à tous les niveaux, encadrées par des coachs expérimentés.
              </CardContent>
            </Card>
            <Card className="bg-clubDarker border-clubPrimary text-clubDark-foreground shadow-lg">
              <CardHeader className="flex flex-col items-center text-center">
                <Users className="h-12 w-12 text-clubPrimary mb-4" />
                <CardTitle className="text-xl font-semibold">Communauté Accueillante</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                Rejoignez une famille de passionnés et partagez des moments inoubliables sur et en dehors des tables.
              </CardContent>
            </Card>
            <Card className="bg-clubDarker border-clubPrimary text-clubDark-foreground shadow-lg">
              <CardHeader className="flex flex-col items-center text-center">
                <Trophy className="h-12 w-12 text-clubPrimary mb-4" />
                <CardTitle className="text-xl font-semibold">Compétitions Locales</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                Participez à des tournois et des championnats pour tester vos compétences et progresser.
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 px-4 md:px-8 lg:px-16 text-center bg-clubPrimary text-white">
        <h2 className="text-3xl font-bold mb-6">Prêt à jouer ?</h2>
        <p className="text-lg mb-8 max-w-2xl mx-auto">
          N'attendez plus pour rejoindre le St Loub Ping. Que vous souhaitiez vous entraîner, participer à des compétitions ou simplement vous amuser, nous avons une place pour vous.
        </p>
        <Button asChild variant="secondary" className="bg-white text-clubPrimary hover:bg-gray-100 text-lg px-8 py-6 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105">
          <Link to="/contact">Contactez-nous</Link>
        </Button>
      </section>
    </div>
  );
};

export default Accueil;