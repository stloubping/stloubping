import { CustomToaster } from "@/components/CustomToaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Accueil from "./pages/Accueil";
import LeClub from "./pages/LeClub";
import CompetitionsEquipes from "./pages/CompetitionsEquipes";
import EssaiGratuit from "./pages/EssaiGratuit";
import Adhesions from "./pages/Adhesions";
import Boutique from "./pages/Boutique";
import Materiels from "./pages/Materiels";
import Partenaires from "./pages/Partenaires";
import Contact from "./pages/Contact";
import TournamentRegistration from "./pages/TournamentRegistration";
import TournamentRegistrationsList from "./pages/TournamentRegistrationsList";
import TournamentLiveRegistrations from "./pages/TournamentLiveRegistrations";
import TournamentResults2026 from "./pages/TournamentResults2026";
import TournamentPhotos2026 from "./pages/TournamentPhotos2026";
import ClassementJoueurs from "./pages/ClassementJoueurs";
import FicheJoueur from "./pages/FicheJoueur";
import ProgressionMensuelle from "./pages/ProgressionMensuelle";
import ProgressionAnnuelle from "./pages/ProgressionAnnuelle";
import ProgressionParCategorieAge from "./pages/ProgressionParCategorieAge";
import CriteriumGironde from "./pages/CriteriumGironde";
import WTTVideos from "./pages/WTTVideos";
import LesLegendes from "./pages/LesLegendes";
import Tutos from "./pages/Tutos";
import Reportages from "./pages/Reportages";
import Actualites from "./pages/Actualites";
import NotFound from "./pages/NotFound";
import MentionsLegales from "./pages/MentionsLegales";
import PolitiqueConfidentialite from "./pages/PolitiqueConfidentialite";
import PolitiqueCookies from "./pages/PolitiqueCookies";
import DemandeDonnees from "./pages/DemandeDonnees";
import Administration from "./pages/Administration";
import { LightboxProvider } from "./context/LightboxContext";
import CookieConsentBanner from "./components/CookieConsentBanner";
import React from "react";

const queryClient = new QueryClient();

const StatistiquesJoueurs = React.lazy(
  () => import("./pages/StatistiquesJoueurs"),
);

const App = () => (
  <div className="app-root">
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <LightboxProvider>
            <Layout>
              <Routes>
                <Route path="/" element={<Accueil />} />
                <Route path="/actualites" element={<Actualites />} />
                <Route path="/le-club" element={<LeClub />} />
                <Route path="/competitions-equipes" element={<CompetitionsEquipes />} />
                <Route path="/essai-gratuit" element={<EssaiGratuit />} />
                <Route path="/competitions-equipes/criterium-gironde" element={<CriteriumGironde />} />
                <Route path="/classement-joueurs" element={<ClassementJoueurs />} />
                <Route path="/classement-joueurs/:licence" element={<FicheJoueur />} />
                <Route path="/classement-joueurs/progression-mensuelle" element={<ProgressionMensuelle />} />
                <Route path="/classement-joueurs/progression-annuelle" element={<ProgressionAnnuelle />} />
                <Route
                  path="/classement-joueurs/statistiques"
                  element={
                    <React.Suspense
                      fallback={
                        <div className="flex min-h-[60vh] items-center justify-center text-muted-foreground">
                          Chargement des statistiques…
                        </div>
                      }
                    >
                      <StatistiquesJoueurs />
                    </React.Suspense>
                  }
                />
                <Route path="/classement-joueurs/par-categorie-age" element={<ProgressionParCategorieAge />} />
                <Route path="/adhesions" element={<Adhesions />} />
                <Route path="/boutique" element={<Boutique />} />
                <Route path="/boutique/materiels" element={<Materiels />} />
                <Route path="/partenaires" element={<Partenaires />} />
                <Route path="/tournoi-inscription" element={<TournamentRegistration />} />
                <Route path="/tournoi/inscrits-live" element={<TournamentLiveRegistrations />} />
                <Route path="/tournoi-inscriptions-liste" element={<TournamentRegistrationsList />} />
                <Route path="/tournoi/2026/resultats" element={<TournamentResults2026 />} />
                <Route path="/tournoi/2026/photos" element={<TournamentPhotos2026 />} />
                <Route path="/videos/wtt" element={<WTTVideos />} />
                <Route path="/videos/tutos" element={<Tutos />} />
                <Route path="/videos/les-legendes" element={<LesLegendes />} />
                <Route path="/videos/reportages" element={<Reportages />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/mentions-legales" element={<MentionsLegales />} />
                <Route path="/politique-confidentialite" element={<PolitiqueConfidentialite />} />
                <Route path="/politique-cookies" element={<PolitiqueCookies />} />
                <Route path="/demande-donnees" element={<DemandeDonnees />} />
                <Route path="/administration" element={<Administration />} />
                <Route path="/administration/bordereau-commande" element={<Administration />} />
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