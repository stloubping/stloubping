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
import TournamentLiveRegistrations from "./pages/TournamentLiveRegistrations"; // Import new page
import ClassementJoueurs from "./pages/ClassementJoueurs";
import ProgressionMensuelle from "./pages/ProgressionMensuelle";
import ProgressionAnnuelle from "./pages/ProgressionAnnuelle";
import ProgressionParCategorieAge from "./pages/ProgressionParCategorieAge";
import CriteriumGironde from "./pages/CriteriumGironde";
import WTTVideos from "./pages/WTTVideos";
import LesLegendes from "./pages/LesLegendes";
import Tutos from "./pages/Tutos";
import NotFound from "./pages/NotFound";
import MentionsLegales from "./pages/MentionsLegales";
import PolitiqueConfidentialite from "./pages/PolitiqueConfidentialite";
import PolitiqueCookies from "./pages/PolitiqueCookies";
import DemandeDonnees from "./pages/DemandeDonnees";
import { LightboxProvider } from "./context/LightboxContext";
import CookieConsentBanner from "./components/CookieConsentBanner";
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
                <Route path="/competitions-equipes/criterium-gironde" element={<CriteriumGironde />} />
                <Route path="/classement-joueurs" element={<ClassementJoueurs />} />
                <Route path="/classement-joueurs/progression-mensuelle" element={<ProgressionMensuelle />} />
                <Route path="/classement-joueurs/progression-annuelle" element={<ProgressionAnnuelle />} />
                <Route path="/classement-joueurs/par-categorie-age" element={<ProgressionParCategorieAge />} />
                <Route path="/adhesions" element={<Adhesions />} />
                <Route path="/boutique" element={<Boutique />} />
                <Route path="/partenaires" element={<Partenaires />} />
                <Route path="/tournoi-inscription" element={<TournamentRegistration />} />
                <Route path="/tournoi/inscrits-live" element={<TournamentLiveRegistrations />} /> {/* New route */}
                <Route path="/tournoi-inscriptions-liste" element={<TournamentRegistrationsList />} />
                <Route path="/videos/wtt" element={<WTTVideos />} />
                <Route path="/videos/tutos" element={<Tutos />} />
                <Route path="/videos/les-legendes" element={<LesLegendes />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/mentions-legales" element={<MentionsLegales />} />
                <Route path="/politique-confidentialite" element={<PolitiqueConfidentialite />} />
                <Route path="/politique-cookies" element={<PolitiqueCookies />} />
                <Route path="/demande-donnees" element={<DemandeDonnees />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
            <CookieConsentBanner />
          </LightboxProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
    <Sonner />
  </div>
);

export default App;