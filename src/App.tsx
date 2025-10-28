import { CustomToaster } from "@/components/CustomToaster";
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
import WTTVideos from "./pages/WTTVideos";
import LesLegendes from "./pages/LesLegendes"; // Import the new LesLegendes component
import NotFound from "./pages/NotFound";
import { LightboxProvider } from "./context/LightboxContext";
import React from "react";

const queryClient = new QueryClient();

const App = () => (
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
                <Route path="/classement-joueurs" element={<ClassementJoueurs />} />
                <Route path="/adhesions" element={<Adhesions />} />
                <Route path="/boutique" element={<Boutique />} />
                <Route path="/partenaires" element={<Partenaires />} />
                <Route path="/tournoi-inscription" element={<TournamentRegistration />} />
                <Route path="/tournoi-inscriptions-liste" element={<TournamentRegistrationsList />} />
                <Route path="/videos/wtt" element={<WTTVideos />} />
                <Route path="/videos/les-legendes" element={<LesLegendes />} /> {/* New route for Les Légendes */}
                <Route path="/contact" element={<Contact />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          </LightboxProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
    {/* CustomToaster et Sonner restent désactivés pour le moment */}
    {/* <CustomToaster /> */}
    {/* <Sonner /> */}
  </div>
);

export default App;