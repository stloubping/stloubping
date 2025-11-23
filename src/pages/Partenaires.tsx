import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLightbox } from '@/context/LightboxContext';
import { Handshake } from 'lucide-react';

const sponsors = [
  { 
    name: "Ville de Saint-Loubès", 
    logo: "https://pplx-res.cloudinary.com/image/upload/v1763900676/search_images/2b2c01cd6fe83a557fddba4c985808ebc211969d.jpg", 
    subtext: "33450" 
  },
  { 
    name: "Wacksport", 
    logo: "https://pplx-res.cloudinary.com/image/upload/v1763900676/search_images/190d44855682564aab8a598c0648f771646a8d7e.jpg", 
    subtext: "" 
  },
  { 
    name: "CDTT33", 
    logo: "https://pplx-res.cloudinary.com/image/upload/v1763900676/search_images/73f9a631e55c8654c7f1e272b0d8b0414d45a05a.jpg", 
    subtext: "Comité départemental" 
  },
  { 
    name: "Ligue Nouvelle-Aquitaine", 
    logo: "https://pplx-res.cloudinary.com/image/upload/v1763900676/search_images/f396d4343a4f6692d956ea2cb2db3cfdbe4af8c8.jpg", 
    subtext: "Tennis de Table" 
  },
  { 
    name: "Crédit Mutuel", 
    logo: "https://pplx-res.cloudinary.com/image/upload/v1763900676/search_images/f85b18370d3507fe45bcebb4d887c0ad138cde20.jpg", 
    subtext: "du Sud Ouest" 
  },
];

const Partenaires = () => {
  const { openLightbox } = useLightbox();

  return (
    <div className="container mx-auto px-4 py-8 bg-clubLight text-clubLight-foreground">
      <h1 className="text-4xl font-bold text-center mb-4 text-clubDark flex items-center justify-center">
        <Handshake className="mr-3 h-8 w-8 text-clubPrimary" /> Merci à nos partenaires
      </h1>

      <section className="mb-12">
        <p className="text-center text-xl text-clubLight-foreground/90 mb-10">
          Un immense merci à tous nos partenaires pour leur soutien essentiel à la vie du club !
        </p>

        <div className="flex flex-wrap justify-center gap-6">
          {sponsors.map((sponsor, index) => (
            <Card 
              key={index} 
              className="bg-clubLight shadow-lg rounded-xl border border-border w-full max-w-[220px] min-h-[220px] flex flex-col items-center justify-between p-4 
                         hover:shadow-xl hover:border-clubPrimary transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02]"
            >
              <CardContent className="p-0 flex flex-col items-center justify-center flex-grow">
                <div className="w-full h-20 flex items-center justify-center bg-clubSection/50 rounded-md mb-4 p-2">
                  <img
                    src={sponsor.logo}
                    alt={sponsor.name}
                    className="max-w-full max-h-full object-contain cursor-zoom-in"
                    onClick={() => openLightbox(sponsor.logo)}
                  />
                </div>
                <h3 className="text-lg font-semibold text-clubDark text-center mt-2">{sponsor.name}</h3>
                {sponsor.subtext && (
                  <p className="text-sm text-muted-foreground text-center">{sponsor.subtext}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-12 text-center">
        <p className="text-2xl font-bold text-clubPrimary tracking-wider uppercase">
          Merci de faire vivre le club !
        </p>
        <p className="text-lg font-semibold text-clubDark mt-2">
          #SaintLoubesTT &nbsp; #AllezSaintLoubès
        </p>
      </section>
    </div>
  );
};

export default Partenaires;