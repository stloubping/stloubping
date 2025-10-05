import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const sponsors = [
  { name: "Sport & Raquettes", logo: "https://picsum.photos/150/80?random=13", description: "Fournisseur officiel d'équipements de tennis de table." },
  { name: "Banque Locale", logo: "https://picsum.photos/150/80?random=14", description: "Partenaire financier principal du club." },
  { name: "Restaurant Le Service", logo: "https://picsum.photos/150/80?random=15", description: "Offre des réductions à nos membres." },
  { name: "Mairie de [Ville]", logo: "https://picsum.photos/150/80?random=16", description: "Soutien institutionnel et mise à disposition des infrastructures." },
];

const Partenaires = () => {
  return (
    <div className="container mx-auto px-4 py-8 bg-clubBackground text-clubBackground-foreground">
      <h1 className="text-4xl font-bold text-center mb-12 text-clubAccent">Nos Partenaires</h1>

      <section className="mb-12">
        <Card className="bg-card shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-clubAccent">Merci à Nos Précieux Partenaires !</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-clubBackground-foreground">
              Le succès et le développement de notre club ne seraient pas possibles sans le soutien indéfectible
              de nos partenaires et mécènes. Leur engagement nous permet de continuer à offrir des infrastructures
              de qualité, un encadrement professionnel et de promouvoir le tennis de table auprès de tous les publics.
            </p>
            <p className="text-clubBackground-foreground">
              Nous tenons à les remercier chaleureusement pour leur confiance et leur contribution essentielle.
            </p>
          </CardContent>
        </Card>
      </section>

      <section>
        <h2 className="text-3xl font-bold text-center mb-8 text-clubAccent">Nos Sponsors</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {sponsors.map((sponsor, index) => (
            <Card key={index} className="bg-clubBackground shadow-md hover:shadow-lg transition-shadow duration-300 text-center">
              <CardContent className="p-6 flex flex-col items-center justify-center h-full">
                <img src={sponsor.logo} alt={sponsor.name} className="mb-4 max-h-20 object-contain" />
                <h3 className="text-xl font-semibold mb-2 text-clubAccent">{sponsor.name}</h3>
                <p className="text-sm text-muted-foreground">{sponsor.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-12 text-center">
        <Card className="bg-card shadow-lg p-8">
          <CardTitle className="text-2xl text-clubAccent mb-4">Devenez Partenaire du Club</CardTitle>
          <CardContent>
            <p className="mb-6 text-clubBackground-foreground">
              Vous souhaitez associer l'image de votre entreprise à un club dynamique et en pleine croissance ?
              Nous proposons différentes formules de partenariat adaptées à vos objectifs.
            </p>
            <p className="text-clubBackground-foreground">
              Contactez-nous pour discuter des opportunités de collaboration et des avantages que vous pourriez en tirer.
            </p>
            <a href="/contact" className="inline-block mt-6 bg-clubPrimary hover:bg-clubPrimary/90 text-clubPrimary-foreground px-8 py-3 rounded-md text-lg font-medium transition-colors">
              Nous Contacter
            </a>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default Partenaires;