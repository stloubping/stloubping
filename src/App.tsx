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
// ToastProvider n'est plus importé ici car il est géré à l'intérieur de Toaster

const queryClient = new QueryClient();

const App = () => (
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
    {/* Toaster et Sonner sont des composants globaux, placés en dehors de tous les fournisseurs stricts */}
    <Toaster />
    <Sonner />
  </QueryClientProvider>
);

export default App;