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
import ProgressionMensuelle from "./pages/ProgressionMensuelle";
import ProgressionAnnuelle from "./pages/ProgressionAnnuelle";
import ProgressionParCategorieAge from "./pages/ProgressionParCategorieAge";
import CriteriumGironde from "./pages/CriteriumGironde"; // Import the new page
import WTTVideos from "./pages/WTTVideos";
import LesLegendes from "./pages/LesLegendes";
import Tutos from "./pages/Tutos";
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
                <Route path="/competitions-equipes/criterium-gironde" element={<CriteriumGironde />} /> {/* New route */}
                <Route path="/classement-joueurs" element={<ClassementJoueurs />} />
                <Route path="/classement-joueurs/progression-mensuelle" element={<ProgressionMensuelle />} />
                <Route path="/classement-joueurs/progression-annuelle" element={<ProgressionAnnuelle />} />
                <Route path="/classement-joueurs/par-categorie-age" element={<ProgressionParCategorieAge />} />
                <Route path="/adhesions" element={<Adhesions />} />
                <Route path="/boutique" element={<Boutique />} />
                <Route path="/partenaires" element={<Partenaires />} />
                {/* Tournament routes temporarily hidden */}
                {/* <Route path="/tournoi-inscription" element={<TournamentRegistration />} /> */}
                {/* <Route path="/tournoi-inscriptions-liste" element={<TournamentRegistrationsList />} /> */}
                <Route path="/videos/wtt" element={<WTTVideos />} />
                <Route path="/videos/tutos" element={<Tutos />} />
                <Route path="/videos/les-legendes" element={<LesLegendes />} />
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