import { CustomToaster } from "@/components/CustomToaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Accueil from "./pages/Accueil";
import NotFound from "./pages/NotFound";
import { LightboxProvider } from "./context/LightboxContext";
import CookieConsentBanner from "./components/CookieConsentBanner";
import React from "react";
import RouteMetadata from "./components/RouteMetadata";

const queryClient = new QueryClient();

const LeClub = React.lazy(() => import("./pages/LeClub"));
const CompetitionsEquipes = React.lazy(() => import("./pages/CompetitionsEquipes"));
const EssaiGratuit = React.lazy(() => import("./pages/EssaiGratuit"));
const Adhesions = React.lazy(() => import("./pages/Adhesions"));
const Boutique = React.lazy(() => import("./pages/Boutique"));
const Materiels = React.lazy(() => import("./pages/Materiels"));
const Partenaires = React.lazy(() => import("./pages/Partenaires"));
const Contact = React.lazy(() => import("./pages/Contact"));
const TournamentRegistration = React.lazy(() => import("./pages/TournamentRegistration"));
const TournamentRegistrationsList = React.lazy(() => import("./pages/TournamentRegistrationsList"));
const TournamentLiveRegistrations = React.lazy(() => import("./pages/TournamentLiveRegistrations"));
const TournamentResults2026 = React.lazy(() => import("./pages/TournamentResults2026"));
const TournamentPhotos2026 = React.lazy(() => import("./pages/TournamentPhotos2026"));
const ClassementJoueurs = React.lazy(() => import("./pages/ClassementJoueurs"));
const FicheJoueur = React.lazy(() => import("./pages/FicheJoueur"));
const ProgressionMensuelle = React.lazy(() => import("./pages/ProgressionMensuelle"));
const ProgressionAnnuelle = React.lazy(() => import("./pages/ProgressionAnnuelle"));
const ProgressionParCategorieAge = React.lazy(() => import("./pages/ProgressionParCategorieAge"));
const CriteriumGironde = React.lazy(() => import("./pages/CriteriumGironde"));
const WTTVideos = React.lazy(() => import("./pages/WTTVideos"));
const LesLegendes = React.lazy(() => import("./pages/LesLegendes"));
const Tutos = React.lazy(() => import("./pages/Tutos"));
const Reportages = React.lazy(() => import("./pages/Reportages"));
const Actualites = React.lazy(() => import("./pages/Actualites"));
const MentionsLegales = React.lazy(() => import("./pages/MentionsLegales"));
const PolitiqueConfidentialite = React.lazy(() => import("./pages/PolitiqueConfidentialite"));
const PolitiqueCookies = React.lazy(() => import("./pages/PolitiqueCookies"));
const DemandeDonnees = React.lazy(() => import("./pages/DemandeDonnees"));
const Administration = React.lazy(() => import("./pages/Administration"));

const StatistiquesJoueurs = React.lazy(
  () => import("./pages/StatistiquesJoueurs"),
);

const App = () => (
  <div className="app-root">
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <RouteMetadata />
          <LightboxProvider>
            <Layout>
              <React.Suspense fallback={<div className="flex min-h-[60vh] items-center justify-center text-muted-foreground">Chargementâ€¦</div>}>
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
                          Chargement des statistiquesâ€¦
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
                <Route path="/administration/bordereau-maillots" element={<Administration />} />
                <Route path="/administration/nouvelle-commande-materiel" element={<Administration />} />
                <Route path="/administration/recap-commandes-materiel" element={<Administration />} />
                <Route path="/administration/wacksport" element={<Administration />} />
                <Route path="/administration/presences-salle" element={<Administration />} />
                <Route path="*" element={<NotFound />} />
                </Routes>
              </React.Suspense>
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