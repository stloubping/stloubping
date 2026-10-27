import { useState } from 'react';
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLightbox } from '@/context/LightboxContext'; // Import useLightbox
import { Ruler, DollarSign, Mail, User, FileText, Globe } from 'lucide-react';
import ShopPreorders from '@/components/ShopPreorders';
import { articlePrice, formatArticlePrice, shopArticles } from '@/data/shopArticles';

const newClubArticles = shopArticles.filter(article => article.id === 'maillot-noir-loup-50' || article.id === 'survetement-noir-rouge');

const Boutique = () => {
  const { openLightbox } = useLightbox(); // Use the lightbox hook
  const [productId, setProductId] = useState('maillot-officiel');
  const selectProduct = (id: string) => {
    setProductId(id);
    document.getElementById('precommande')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

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
          </CardContent>
        </Card>
      </section>

      <section className="mb-12" aria-labelledby="nouveautes-club">
        <h2 id="nouveautes-club" className="mb-8 text-center text-3xl font-bold text-clubDark">Les nouveautés du club</h2>
        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
          {newClubArticles.map(article => <Card key={article.id} className="overflow-hidden rounded-xl shadow-lg">
            <button type="button" className="flex w-full items-center justify-center bg-white p-5" onClick={() => openLightbox(article.images[0])} aria-label={`Agrandir ${article.name}`}>
              <img src={article.images[0]} alt={article.name} loading="lazy" decoding="async" className="h-80 w-full object-contain" />
            </button>
            <CardContent className="space-y-3 p-6">
              <h3 className="text-2xl font-bold text-clubDark">{article.name}</h3>
              <p className="text-3xl font-bold text-clubPrimary">{formatArticlePrice(articlePrice(article))}<span className="ml-2 text-sm font-normal text-muted-foreground">TTC / {article.priceUnit ?? 'pièce'}</span></p>
              <p>{article.description}</p>
              <p className="text-sm text-muted-foreground">{article.imageNote}</p>
              <Button type="button" className="w-full bg-clubPrimary text-white" onClick={() => selectProduct(article.id)}>Commander cet article</Button>
            </CardContent>
          </Card>)}
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-bold text-center mb-8 text-clubDark">Le Maillot du Club</h2>
        <Card className="max-w-4xl mx-auto bg-clubLight shadow-lg rounded-xl overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Image Section */}
            <div className="p-4 flex items-center justify-center bg-clubSection/50">
              <img loading="lazy" decoding="async"
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

              {/* Instructions de commande mises à jour */}
              <div className="mt-6 p-4 bg-clubSection rounded-md border border-clubPrimary/30">
                <h4 className="text-lg font-semibold text-clubDark mb-3">Comment commander :</h4>
                <ul className="space-y-2 text-clubLight-foreground">
                  <li>
                    <button type="button" onClick={() => selectProduct('maillot-officiel')} className="flex items-center font-semibold text-clubPrimary hover:underline">
                      <Globe className="mr-2 h-4 w-4" />
                      Commander sur le site
                    </button>
                  </li>
                  <li className="flex items-center">
                    <Mail className="mr-2 h-4 w-4 text-clubPrimary" />
                    Par retour de mail
                  </li>
                  <li className="flex items-center">
                    <User className="mr-2 h-4 w-4 text-clubPrimary" />
                    Auprès des entraîneurs
                  </li>
                  <li className="flex items-center">
                    <FileText className="mr-2 h-4 w-4 text-clubPrimary" />
                    Sur la feuille affichée dans la salle
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </Card>
      </section>

      <ShopPreorders productId={productId} onProductChange={setProductId} />
    </div>
  );
};

export default Boutique;
