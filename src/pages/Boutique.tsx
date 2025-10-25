import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { useLightbox } from '@/context/LightboxContext'; // Import useLightbox

const jerseys = [
  {
    id: 1,
    name: "Maillot Officiel du Club - Rouge",
    description: "Le maillot officiel de notre club, idéal pour les matchs et les entraînements. Couleur rouge vif avec logo du club.",
    price: "35€",
    image: "https://picsum.photos/300/300?random=10",
  },
  {
    id: 2,
    name: "Maillot d'Entraînement - Noir",
    description: "Un maillot confortable et respirant pour vos sessions d'entraînement. Couleur noire élégante avec un petit logo.",
    price: "25€",
    image: "https://picsum.photos/300/300?random=11",
  },
  {
    id: 3,
    name: "Maillot Rétro - Blanc & Rouge",
    description: "Édition limitée inspirée des maillots historiques du club. Design vintage blanc avec des bandes rouges.",
    price: "40€",
    image: "https://picsum.photos/300/300?random=12",
  },
];

const Boutique = () => {
  const { openLightbox } = useLightbox(); // Use the lightbox hook

  return (
    <div className="container mx-auto px-4 py-8 bg-clubLight text-clubLight-foreground">
      <h1 className="text-4xl font-bold text-center mb-12 text-clubDark">Boutique du Club</h1>

      <section className="mb-12 text-center">
        <Card className="bg-clubLight shadow-lg p-8 rounded-xl">
          <CardTitle className="text-2xl text-clubDark mb-4">Découvrez nos produits dérivés !</CardTitle>
          <CardContent>
            <p className="mb-6 text-clubLight-foreground">
              Soutenez votre club en portant fièrement nos couleurs !
              Retrouvez une sélection de maillots, textiles et accessoires à l'effigie de notre club.
            </p>
            <Button asChild className="bg-clubPrimary hover:bg-clubPrimary/90 text-clubPrimary-foreground px-8 py-4 text-lg rounded-md shadow-lg">
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
        <h2 className="text-3xl font-bold text-center mb-8 text-clubDark">Nos Maillots</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {jerseys.map((jersey) => (
            <Card key={jersey.id} className="bg-clubLight shadow-md hover:shadow-lg transition-shadow duration-300 text-center rounded-xl">
              <CardContent className="p-6">
                <img
                  src={jersey.image}
                  alt={jersey.name}
                  className="w-full h-48 object-cover rounded-md mb-4 cursor-zoom-in"
                  onClick={() => openLightbox(jersey.image)} // Open lightbox on image click
                />
                <h3 className="text-xl font-semibold mb-2 text-clubDark">{jersey.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{jersey.description}</p>
                <p className="text-2xl font-bold text-clubPrimary mb-4">{jersey.price}</p>
                <Button className="bg-clubPrimary hover:bg-clubPrimary/90 text-clubPrimary-foreground rounded-md shadow-md">
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