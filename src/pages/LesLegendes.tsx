import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const LesLegendes = () => {
  return (
    <div className="container mx-auto px-4 py-8 bg-clubLight text-clubLight-foreground">
      <h1 className="text-4xl font-bold text-center mb-12 text-clubDark">Les Légendes du Tennis de Table</h1>

      <section className="mb-12">
        <Card className="bg-clubLight shadow-lg rounded-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-clubDark">Hommage aux Icônes du Ping</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-clubLight-foreground">
              Cette page est dédiée aux joueurs et joueuses qui ont marqué l'histoire du tennis de table par leurs performances exceptionnelles, leur style de jeu unique et leur impact sur le sport.
            </p>
            <p className="text-clubLight-foreground">
              Découvrez les parcours inspirants de ces légendes qui ont façonné le monde du ping-pong.
            </p>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-4 bg-clubSection rounded-lg flex flex-col items-center justify-center text-muted-foreground text-center">
                <img src="https://picsum.photos/150/150?random=legend1" alt="Légende 1" className="rounded-full mb-4 w-28 h-28 object-cover" />
                <h3 className="text-xl font-semibold text-clubDark">Légende 1</h3>
                <p className="text-sm">Description courte de la légende et de ses exploits.</p>
              </div>
              <div className="p-4 bg-clubSection rounded-lg flex flex-col items-center justify-center text-muted-foreground text-center">
                <img src="https://picsum.photos/150/150?random=legend2" alt="Légende 2" className="rounded-full mb-4 w-28 h-28 object-cover" />
                <h3 className="text-xl font-semibold text-clubDark">Légende 2</h3>
                <p className="text-sm">Description courte de la légende et de ses exploits.</p>
              </div>
              <div className="p-4 bg-clubSection rounded-lg flex flex-col items-center justify-center text-muted-foreground text-center">
                <img src="https://picsum.photos/150/150?random=legend3" alt="Légende 3" className="rounded-full mb-4 w-28 h-28 object-cover" />
                <h3 className="text-xl font-semibold text-clubDark">Légende 3</h3>
                <p className="text-sm">Description courte de la légende et de ses exploits.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default LesLegendes;