import React, { useState } from 'react';
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, ChevronRight } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface NavItem {
  name: string;
  path?: string;
  type?: "link" | "dropdown" | "label";
  children?: NavItem[];
}

const navItems: NavItem[] = [
  { name: "Accueil", path: "/", type: "link" },
  { name: "Le Club", path: "/le-club", type: "link" },
  {
    name: "Équipes",
    type: "dropdown",
    children: [
      { name: "Championnat par Équipe", path: "/competitions-equipes", type: "link" },
      { name: "Critérium de Gironde", path: "/competitions-equipes/criterium-gironde", type: "link" },
    ],
  },
  {
    name: "Les Joueurs",
    type: "dropdown",
    children: [
      { name: "Classement des Joueurs", path: "/classement-joueurs", type: "link" },
      { name: "Progression Mensuelle", path: "/classement-joueurs/progression-mensuelle", type: "link" },
      { name: "Progression Annuelle", path: "/classement-joueurs/progression-annuelle", type: "link" },
      { name: "Par Catégorie d'Âge", path: "/classement-joueurs/par-categorie-age", type: "link" },
    ],
  },
  { name: "Adhésions", path: "/adhesions", type: "link" },
  { name: "Boutique", path: "/boutique", type: "link" },
  { name: "Partenaires", path: "/partenaires", type: "link" },
  {
    name: "Tournoi",
    type: "dropdown",
    children: [
      {
        name: "Édition 2026",
        type: "dropdown",
        children: [
          { name: "Inscription au Tournoi", path: "/tournoi-inscription", type: "link" },
          { name: "Les Inscrits LIVE", path: "/tournoi/inscrits-live", type: "link" },
          { name: "Liste des Inscriptions", path: "/tournoi-inscriptions-liste", type: "link" },
          { name: "Résultats", path: "/tournoi/2026/resultats", type: "link" },
          { name: "Photos", path: "/tournoi/2026/photos", type: "link" },
        ],
      },
    ],
  },
  {
    name: "Vidéos",
    type: "dropdown",
    children: [
      { name: "WTT", path: "/videos/wtt", type: "link" },
      { name: "Tutos", path: "/videos/tutos", type: "link" },
      { name: "Les Légendes", path: "/videos/les-legendes", type: "link" },
    ],
  },
  { name: "Contact", path: "/contact", type: "link" },
];

const Navbar = () => {
  const isMobile = useIsMobile();
  const location = useLocation();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toggleDropdown = (name: string) => {
    if (openDropdown === name) {
      setOpenDropdown(null);
    } else {
      setOpenDropdown(name);
    }
  };

  const closeAllDropdowns = () => {
    setOpenDropdown(null);
  };

  const NavLinks = ({
    closeSheet,
    isMobileView = false,
  }: {
    closeSheet?: () => void;
    isMobileView?: boolean;
  }) => {
    return (
      <nav        className={cn(
          "flex",
          isMobileView ? "flex-col space-x-0 space-y-4 p-0" : "items-center space-x-4 lg:space-x-6",
          "w-full"
        )}
      >
        {navItems.map((item) => {
          // ==== SIMPLE DROPDOWN HANDLING ====
          if (item.type === "dropdown") {
            // Sub‑menu toggle
            const isSubOpen = openDropdown === item.name;

            return (
              <div key={item.name} className="relative">
                {/* Trigger button – always clickable */}
                <Button
                  variant="ghost"
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-clubPrimary",
                    isSubOpen ? "text-clubPrimary" : "text-clubDark-foreground"
                  )}
                  onClick={() => toggleDropdown(item.name)}
                >
                  {item.name}
                </Button>

                {/* Sub‑menu – always rendered, hidden via CSS when collapsed */}
                <DropdownMenu
                  asChild
                  open={isSubOpen}
                  onOpenChange={toggleDropdown}
                  className="bg-clubLight text-clubLight-foreground border-border min-w-[200px]"
                >
                  {item.children?.map((child) => {
                    if (child.type === "dropdown") {
                      // Second level dropdown                      const childIsOpen = openDropdown === child.name;
                      return (
                        <DropdownMenu                          key={child.name}
                          asChild                          open={childIsOpen}
                          onOpenChange={() => {
                            toggleDropdown(item.name);
                            toggleDropdown(child.name);
                          }}
                          className="bg-clubLight text-clubLight-foreground border-border"
                        >
                          {child.children?.map((subChild) => (
                            <DropdownMenuItem
                              key={subChild.name}
                              asChild
                              onClick={() => {
                                closeAllDropdowns();
                                navigate(subChild.path || "#");
                              }}
                              className="block px-4 py-2 text-sm text-clubLight-foreground hover:bg-clubSection hover:text-clubPrimary transition-colors"
                            >
                              {subChild.name}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenu>
                      ))}
                    } else {
                      // Simple link child
                      return (
                        <DropdownMenuItem
                          key={child.name}
                          asChild
                          onClick={() => {
                            closeAllDropdowns();
                            navigate(child.path || "#");
                          }}
                          className="block px-4 py-2 text-sm text-clubLight-foreground hover:bg-clubSection hover:text-clubPrimary transition-colors"
                        >
                          {child.name}
                        </DropdownMenuItem>
                      );
                    }
                  })}
                </DropdownMenu>
              </div>
            );
          } else {
            // Regular link items
            return (
              <Link
                key={item.name}
                to={item.path || "#"}
                onClick={closeAllDropdowns}
                className={cn(
                  isMobileView ? "text-base" : "text-sm",
                  "font-medium transition-colors hover:text-clubPrimary",
                  location.pathname === item.path ? "text-clubPrimary" : "text-clubDark-foreground"
                )}
              >
                {item.name}
              </Link>
            );
          }
        })}
      </nav>
    );
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-clubDark text-clubDark-foreground shadow-sm">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2 text-lg font-semibold md:text-base text-clubPrimary">
          <img src="/images/logo/telecharge.jpg" alt="St Loub Ping Logo" className="h-8 w-8 mr-2" />
          <span>St Loub Ping</span>
        </Link>

        {/* Mobile – use accordion for the whole menu */}
        {isMobile ? (
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-clubDark-foreground z-50">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-clubDark text-clubDark-foreground border-clubPrimary w-full sm:w-3/4 md:max-w-xs p-6">
              <NavLinks closeSheet={() => setIsSheetOpen(false)} isMobileView={true} />
            </SheetContent>
          </Sheet>
        ) : (
          <NavLinks />
        )}
      </div>
    </header>
  );
};

export default Navbar;