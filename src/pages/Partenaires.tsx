import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLightbox } from '@/context/LightboxContext';
import { Handshake } from 'lucide-react';

const sponsors = [
  { 
    name: "Ville de Saint-Loubès", 
    logo: "/images/partenaires/ville-saint-loubes.jpg", 
    subtext: "33450",
    link: "https://www.saint-loubes.fr"
  },
  { 
    name: "Wacksport", 
    logo: "/images/partenaires/wacksport.jpg", 
    subtext: "Les pros du ping",
    link: "https://www.wsport.com"
  },
  { 
    name: "CDTT33", 
    logo: "/images/partenaires/cdtt33.jpg", 
    subtext: "Comité départemental",
    link: "https://www.cd33tt.fr"
  },
  { 
    name: "Ligue Nouvelle-Aquitaine", 
    logo: "/images/partenaires/ligue-nouvelle-aquitaine.jpg", 
    subtext: "Tennis de Table",
    link: "https://lnatt.fr"
  },
  { 
    name: "Crédit Mutuel", 
    logo: "/images/partenaires/credit-mutuel.jpg", 
    subtext: "du Sud Ouest",
    link: "https://www.cmso.com" // Confirmation du lien
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
            <a 
              key={index} 
              href={sponsor.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="block w-full max-w-[220px] min-h-[220px] transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02]"
            >
              <Card 
                className="bg-clubLight shadow-lg rounded-xl border border-border h-full flex flex-col items-center justify-between p-4 
                           hover:shadow-xl hover:border-clubPrimary"
              >
                <CardContent className="p-0 flex flex-col items-center justify-center flex-grow">
                  <div className="w-full h-20 flex items-center justify-center bg-clubSection/50 rounded-md mb-4 p-2">
                    <img
                      src={sponsor.logo}
                      alt={sponsor.name}
                      className="max-w-full max-h-full object-contain cursor-pointer"
                      onClick={(e) => {
                        e.preventDefault(); // Prevent link navigation when clicking image for lightbox
                        openLightbox(sponsor.logo);
                      }}
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-clubDark text-center mt-2">{sponsor.name}</h3>
                  {sponsor.subtext && (
                    <p className="text-sm text-muted-foreground text-center">{sponsor.subtext}</p>
                  )}
                </CardContent>
              </Card>
            </a>
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