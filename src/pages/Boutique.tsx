import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { useLightbox } from '@/context/LightboxContext'; // Import useLightbox
import { Shirt, Ruler, DollarSign } from 'lucide-react';

const Boutique = () => {
  const { openLightbox } = useLightbox(); // Use the lightbox hook

  const jerseyDetails = {
    name: "Maillot Officiel du Club",
    image: "/images/boutique/maillot-club-officiel.png",
    price: "35€",
    description: "Le maillot officiel de notre club, arborant fièrement le logo du club et un design dynamique. Idéal pour représenter le St Loub Ping en compétition ou à l'entraînement.",
    features: [
      "100% polyester technique",
      "Ne déteint pas en machine",
      "Ne nécessite pas de repassage",
      "Disponible du 2 ans au 10XL",
    ]
  };

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
        <h2 className="text-3xl font-bold text-center mb-8 text-clubDark">Le Maillot du Club</h2>
        <Card className="max-w-4xl mx-auto bg-clubLight shadow-lg rounded-xl overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Image Section */}
            <div className="p-4 flex items-center justify-center bg-clubSection/50">
              <img
                src={jerseyDetails.image}
                alt={jerseyDetails.name}
                className="w-full h-auto object-contain max-h-96 rounded-md cursor-zoom-in shadow-md"
                onClick={() => openLightbox(jerseyDetails.image)}
              />
            </div>
            
            {/* Details Section */}
            <div className="p-6 space-y-4">
              <h3 className="text-3xl font-bold text-clubPrimary">{jerseyDetails.name}</h3>
              <p className="text-clubLight-foreground">{jerseyDetails.description}</p>

              <div className="space-y-2 pt-2">
                <div className="flex items-center text-clubDark">
                  <DollarSign className="mr-2 h-5 w-5 text-clubPrimary" />
                  <span className="text-2xl font-bold">{jerseyDetails.price}</span>
                </div>
                <div className="flex items-start text-clubLight-foreground">
                  <Ruler className="mr-2 h-5 w-5 text-clubPrimary flex-shrink-0 mt-1" />
                  <p>Tailles disponibles : {jerseyDetails.features[3]}</p>
                </div>
              </div>

              <ul className="list-disc list-inside space-y-1 text-sm text-clubLight-foreground pl-4">
                {jerseyDetails.features.slice(0, 3).map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>

              <Button className="w-full bg-clubPrimary hover:bg-clubPrimary/90 text-clubPrimary-foreground rounded-md shadow-md mt-4">
                Commander (via boutique en ligne)
              </Button>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
};

export default Boutique;