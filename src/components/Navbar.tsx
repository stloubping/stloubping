import React, { useState, useEffect } from 'react'; // Import useState and useEffect
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const navItems = [
  { name: "Accueil", path: "/" },
  { name: "Le Club", path: "/le-club" },
  { name: "Compétitions & Équipes", path: "/competitions-equipes" },
  { name: "Classement des Joueurs", path: "/classement-joueurs" },
  { name: "Adhésions", path: "/adhesions" },
  { name: "Boutique", path: "/boutique" },
  { name: "Partenaires", path: "/partenaires" },
  { name: "Tournoi", path: "/tournoi-inscription" },
  { name: "Liste Inscriptions Tournoi", path: "/tournoi-inscriptions-liste" },
  { name: "Contact", path: "/contact" },
];

const Navbar = () => {
  const isMobile = useIsMobile();
  const location = useLocation();

  // TEMPORARY DEBUGGING AID: Display current window width
  // const [currentWidth, setCurrentWidth] = useState(0);
  // useEffect(() => {
  //   const handleResize = () => setCurrentWidth(window.innerWidth);
  //   window.addEventListener('resize', handleResize);
  //   setCurrentWidth(window.innerWidth); // Set initial width
  //   return () => window.removeEventListener('resize', handleResize);
  // }, []);
  // END TEMPORARY DEBUGGING AID

  console.log("Navbar - isMobile:", isMobile, "Window width:", window.innerWidth);

  const NavLinks = ({ className }: { className?: string }) => (
    <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)}>
      {navItems.map((item) => (
        <Link
          key={item.name}
          to={item.path}
          className={cn(
            "text-sm font-medium transition-colors hover:text-clubPrimary",
            location.pathname === item.path ? "text-clubPrimary" : "text-clubDark-foreground"
          )}
        >
          {item.name}
        </Link>
      ))}
    </nav>
  );

  return (
    <header className="sticky top-0 z-50 w-full bg-clubDark text-clubDark-foreground shadow-sm">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2 text-lg font-semibold md:text-base text-clubPrimary">
          <img src="/images/logo/telecharge.jpg" alt="St Loub Ping Logo" className="h-8 w-8 mr-2" />
          <span>St Loub Ping</span>
        </Link>
        {isMobile ? (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-clubDark-foreground z-50">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-clubDark text-clubDark-foreground border-clubPrimary w-full sm:w-3/4 md:max-w-xs p-6">
              <SheetHeader className="mb-6">
                <SheetTitle className="text-clubPrimary text-2xl font-bold">Navigation</SheetTitle>
                <SheetDescription className="text-clubDark-foreground/80">
                  Explorez les sections du club.
                </SheetDescription>
              </SheetHeader>
              <NavLinks className="flex flex-col space-x-0 space-y-4 p-0" />
            </SheetContent>
          </Sheet>
        ) : (
          <NavLinks />
        )}
      </div>
      {/* TEMPORARY DEBUGGING AID */}
      {/* <div className="fixed bottom-0 left-0 bg-yellow-400 text-black p-1 text-xs z-[9999]">
        Mobile: {isMobile ? 'true' : 'false'}, Largeur: {currentWidth}px
      </div> */}
      {/* END TEMPORARY DEBUGGING AID */}
    </header>
  );
};

export default Navbar;