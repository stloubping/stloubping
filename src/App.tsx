import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Accueil from "./pages/Accueil";
import LeClub from "./pages/LeClub";
import CompetitionsEquipes from "./pages/CompetitionsEquipes";
import Adhesions from "./pages/Adhesions";
import Boutique from "./pages/Boutique";
import Partenaires from "./pages/Partenaires";
import Contact from "./pages/Contact";
import TournamentRegistration from "./pages/TournamentRegistration";
import TournamentRegistrationsList from "./pages/TournamentRegistrationsList";
import ClassementJoueurs from "./pages/ClassementJoueurs";
import NotFound from "./pages/NotFound";
import { LightboxProvider } from "./context/LightboxContext";
import React from "react";

const queryClient = new QueryClient();

const App = () => (
  // Enveloppe tout le contenu de l'application dans un seul div racine.
  // Cela garantit que le composant App retourne toujours un seul élément DOM,
  // ce qui peut résoudre les problèmes avec React.Children.only.
  <div className="app-root">
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <LightboxProvider>
            <Layout>
              <Routes>
                <Route path="/" element={<Accueil />} />
                <Route path="/le-club" element={<LeClub />} />
                <Route path="/competitions-equipes" element={<CompetitionsEquipes />} />
                <Route path="/adhesions" element={<Adhesions />} />
                <Route path="/boutique" element={<Boutique />} />
                <Route path="/partenaires" element={<Partenaires />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/tournoi-inscription" element={<TournamentRegistration />} />
                <Route path="/tournoi-inscriptions-liste" element={<TournamentRegistrationsList />} />
                <Route path="/classement-joueurs" element={<ClassementJoueurs />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          </LightboxProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
    {/* Toaster et Sonner sont des composants globaux, placés comme frères de l'arbre principal de l'application,
        mais toujours à l'intérieur du div racine unique. */}
    <Toaster />
    <Sonner />
  </div>
);

export default App;