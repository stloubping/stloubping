import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TeamRankingIframe from '@/components/TeamRankingIframe';

// Définition des équipes de Critérium de Gironde
const criteriumTeams = [
  { id: "criterium-1", name: "Critérium Équipe 1", number: 1, championship: "autre" as const },
  { id: "criterium-2", name: "Critérium Équipe 2", number: 2, championship: "autre" as const },
  { id: "criterium-3", name: "Critérium Équipe 3", number: 3, championship: "autre" as const },
];

const CriteriumGironde = () => {
  return (
    <div className="container mx-auto px-4 py-8 bg-clubLight text-clubLight-foreground">
      <h1 className="text-4xl font-bold text-center mb-12 text-clubDark">Critérium de Gironde</h1>

      <section className="mb-12">
        <Card className="bg-clubLight shadow-lg rounded-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-clubDark">Suivi des Équipes de Critérium Départemental</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-6 text-clubLight-foreground">
              Retrouvez ci-dessous les classements et résultats détaillés de nos équipes engagées dans le Critérium de Gironde.
            </p>
            
            <Tabs defaultValue={criteriumTeams[0].id} className="w-full">
              <TabsList className="grid w-full grid-cols-3 h-auto bg-clubSection/50">
                {criteriumTeams.map((team) => (
                  <TabsTrigger 
                    key={team.id} 
                    value={team.id} 
                    className="data-[state=active]:bg-clubPrimary data-[state=active]:text-clubPrimary-foreground text-clubDark font-semibold text-xs sm:text-sm p-2"
                  >
                    {team.name}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {criteriumTeams.map((team) => (
                <TabsContent key={team.id} value={team.id} className="mt-6">
                  <TeamRankingIframe 
                    teamNumber={team.number} 
                    championshipType={team.championship} 
                    teamName={team.name} 
                  />
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default CriteriumGironde;