import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout"; // Import the new Layout component
import Accueil from "./pages/Accueil"; // Renamed from Index
import LeClub from "./pages/LeClub";
import CompetitionsEquipes from "./pages/CompetitionsEquipes";
import Adhesions from "./pages/Adhesions";
import Boutique from "./pages/Boutique";
import Partenaires from "./pages/Partenaires";
import Contact from "./pages/Contact";
import TournamentRegistration from "./pages/TournamentRegistration"; // Import the new TournamentRegistration component
import TournamentRegistrationsList from "./pages/TournamentRegistrationsList"; // Import the new TournamentRegistrationsList component
import ClassementJoueurs from "./pages/ClassementJoueurs"; // Import the new ClassementJoueurs component
import NotFound from "./pages/NotFound";
import { LightboxProvider } from "./context/LightboxContext"; // Import LightboxProvider
import React from "react"; // Import React for React.Fragment

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <LightboxProvider>
          <Layout> {/* Wrap all routes with the Layout component */}
            <Toaster /> {/* Moved here */}
            <Sonner /> {/* Moved here */}
            <Routes>
              <Route path="/" element={<Accueil />} />
              <Route path="/le-club" element={<LeClub />} />
              <Route path="/competitions-equipes" element={<CompetitionsEquipes />} />
              <Route path="/adhesions" element={<Adhesions />} />
              <Route path="/boutique" element={<Boutique />} />
              <Route path="/partenaires" element={<Partenaires />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/tournoi-inscription" element={<TournamentRegistration />} /> {/* New route for tournament registration */}
              <Route path="/tournoi-inscriptions-liste" element={<TournamentRegistrationsList />} /> {/* New route for tournament registrations list */}
              <Route path="/classement-joueurs" element={<ClassementJoueurs />} /> {/* New route for player rankings */}
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </LightboxProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;