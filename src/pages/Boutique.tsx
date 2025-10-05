import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const jerseys = [
  {
    id: 1,
    name: "Maillot Officiel du Club - Bleu",
    description: "Le maillot officiel de notre club, idéal pour les matchs et les entraînements. Couleur bleu vif avec logo du club.",
    price: "35€",
    image: "https://picsum.photos/300/300?random=10",
  },
  {
    id: 2,
    name: "Maillot d'Entraînement - Gris",
    description: "Un maillot confortable et respirant pour vos sessions d'entraînement. Couleur grise élégante avec un petit logo.",
    price: "25€",
    image: "https://picsum.photos/300/300?random=11",
  },
  {
    id: 3,
    name: "Maillot Rétro - Blanc & Bleu",
    description: "Édition limitée inspirée des maillots historiques du club. Design vintage blanc avec des bandes bleues.",
    price: "40€",
    image: "https://picsum.photos/300/300?random=12",
  },
];

const Boutique = () => {
  return (
    <div className="container mx-auto px-4 py-8 bg-clubBackground text-clubBackground-foreground">
      <h1 className="text-4xl font-bold text-center mb-12 text-clubPrimary">Boutique du Club</h1>

      <section className="mb-12 text-center">
        <Card className="bg-card shadow-lg p-8">
          <CardTitle className="text-2xl text-clubPrimary mb-4">Découvrez nos produits dérivés !</CardTitle>
          <CardContent>
            <p className="mb-6 text-clubBackground-foreground">
              Soutenez votre club en portant fièrement nos couleurs !
              Retrouvez une sélection de maillots, textiles et accessoires à l'effigie de notre club.
            </p>
            <Button asChild className="bg-clubPrimary hover:bg-clubPrimary/90 text-clubPrimary-foreground px-8 py-4 text-lg">
              <a href="https://example.com/boutique" target="_blank" rel="noopener noreferrer">
                Accéder à la Boutique en Ligne
              </a>
            </Button>
            <p className="mt-4 text-sm text-muted-foreground">
              (Vous serez redirigé vers notre plateforme de vente partenaire)
            </p>
          </CardContent>
        </Card>
      </section>

      <section>
        <h2 className="text-3xl font-bold text-center mb-8 text-clubPrimary">Nos Maillots</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {jerseys.map((jersey) => (
            <Card key={jersey.id} className="bg-card shadow-md hover:shadow-lg transition-shadow duration-300 text-center">
              <CardContent className="p-6">
                <img src={jersey.image} alt={jersey.name} className="w-full h-48 object-cover rounded-md mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-clubPrimary">{jersey.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{jersey.description}</p>
                <p className="text-2xl font-bold text-clubPrimary mb-4">{jersey.price}</p>
                <Button className="bg-clubPrimary hover:bg-clubPrimary/90 text-clubPrimary-foreground">
                  Voir le produit
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Boutique;