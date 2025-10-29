import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from 'react-router-dom';
import { useLightbox } from '@/context/LightboxContext'; // Import useLightbox

const sponsors = [
  { name: "Sport & Raquettes", logo: "https://picsum.photos/150/80?random=13", description: "Fournisseur officiel d'équipements de tennis de table." },
  { name: "Banque Locale", logo: "https://picsum.photos/150/80?random=14", description: "Partenaire financier principal du club." },
  { name: "Restaurant Le Service", logo: "https://picsum.photos/150/80?random=15", description: "Offre des réductions à nos membres." },
  { name: "Mairie de [Ville]", logo: "https://picsum.photos/150/80?random=16", description: "Soutien institutionnel et mise à disposition des infrastructures." },
];

const Partenaires = () => {
  const { openLightbox } = useLightbox(); // Use the lightbox hook

  return (
    <div className="container mx-auto px-4 py-8 bg-clubLight text-clubLight-foreground">
      <h1 className="text-4xl font-bold text-center mb-12 text-clubDark">Nos Partenaires</h1>

      <section className="mb-12">
        <Card className="bg-clubLight shadow-lg rounded-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-clubDark">Merci à Nos Précieux Partenaires !</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-clubLight-foreground">
              Le succès et le développement de notre club ne seraient pas possibles sans le soutien indéfectible
              de nos partenaires et mécènes. Leur engagement nous permet de continuer à offrir des infrastructures
              de qualité, un encadrement professionnel et de promouvoir le tennis de table auprès de tous les publics.
            </p>
            <p className="text-clubLight-foreground">
              Nous tenons à les remercier chaleureusement pour leur confiance et leur contribution essentielle.
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-bold text-center mb-8 text-clubDark">Nos Plans de Partenariat</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="bg-clubLight shadow-lg rounded-xl border-2 border-clubPrimary">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-clubPrimary mb-2">Partenaire Bronze</CardTitle>
              <p className="text-clubLight-foreground/80">Soutenez le club et gagnez en visibilité locale.</p>
            </CardHeader>
            <CardContent className="space-y-4 text-clubLight-foreground">
              <ul className="list-disc list-inside space-y-2">
                <li>Logo de votre entreprise sur notre site web (section Partenaires).</li>
                <li>Logo de votre entreprise sur le maillot du club (petite taille).</li>
                <li>Mention de votre soutien lors des événements locaux du club.</li>
                <li>Visibilité sur nos réseaux sociaux (1 publication par an).</li>
                <li>Invitation à nos événements annuels.</li>
              </ul>
              <div className="text-center mt-6">
                <p className="text-2xl font-bold text-clubDark">À partir de <span className="text-clubPrimary">200€</span> / an</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-clubLight shadow-lg rounded-xl border-2 border-clubPrimary">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-clubPrimary mb-2">Partenaire Or</CardTitle>
              <p className="text-clubLight-foreground/80">Un partenariat privilégié pour une visibilité maximale.</p>
            </CardHeader>
            <CardContent className="space-y-4 text-clubLight-foreground">
              <ul className="list-disc list-inside space-y-2">
                <li>Logo de votre entreprise en grand format sur notre site web et affiches du club.</li>
                <li>Logo de votre entreprise sur le maillot du club (taille standard).</li>
                <li>Banderole publicitaire dans notre salle d'entraînement.</li>
                <li>Mention de votre soutien lors de tous les événements du club (y compris tournois régionaux).</li>
                <li>Visibilité accrue sur nos réseaux sociaux (4 publications par an).</li>
                <li>Invitation VIP à tous nos événements.</li>
                <li>Possibilité d'organiser un événement co-brandé avec le club.</li>
              </ul>
              <div className="text-center mt-6">
                <p className="text-2xl font-bold text-clubDark">À partir de <span className="text-clubPrimary">800€</span> / an</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-bold text-center mb-8 text-clubDark">Nos Sponsors</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {sponsors.map((sponsor, index) => (
            <Card key={index} className="bg-clubLight shadow-md hover:shadow-lg transition-shadow duration-300 text-center rounded-xl">
              <CardContent className="p-6 flex flex-col items-center justify-center h-full">
                <img
                  src={sponsor.logo}
                  alt={sponsor.name}
                  className="mb-4 max-h-20 object-contain cursor-zoom-in"
                  onClick={() => openLightbox(sponsor.logo)} // Open lightbox on image click
                />
                <h3 className="text-xl font-semibold mb-2 text-clubDark">{sponsor.name}</h3>
                <p className="text-sm text-muted-foreground">{sponsor.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-12 text-center">
        <Card className="bg-clubLight shadow-lg p-8 rounded-xl">
          <CardTitle className="text-2xl text-clubDark mb-4">Devenez Partenaire du Club</CardTitle>
          <CardContent>
            <p className="mb-6 text-clubLight-foreground">
              Vous souhaitez associer l'image de votre entreprise à un club dynamique et en pleine croissance ?
              Nous proposons différentes formules de partenariat adaptées à vos objectifs.
            </p>
            <p className="text-clubLight-foreground">
              Contactez-nous pour discuter des opportunités de collaboration et des avantages que vous pourriez en tirer.
            </p>
            <Link to="/contact" className="inline-block mt-6 bg-clubPrimary hover:bg-clubPrimary/90 text-clubPrimary-foreground px-8 py-3 rounded-md text-lg font-medium transition-colors shadow-lg">
              Nous Contacter
            </Link>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default Partenaires;