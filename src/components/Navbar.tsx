"use client";

import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
import { Menu } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

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
  const navigate = useNavigate();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const NavLinks = ({
    closeSheet,
    isMobileView = false,
  }: {
    closeSheet?: () => void;
    isMobileView?: boolean;
  }) => {
    return (
      <nav className={cn(
          "flex",
          isMobileView ? "flex-col space-y-4" : "items-center space-x-4 lg:space-x-6"
        )}
      >
        {navItems.map((item) => {
          if (item.type === "dropdown") {
            return (
              <DropdownMenu key={item.name}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className={cn(
                      "text-sm font-medium transition-colors hover:text-clubPrimary",
                      "text-clubDark-foreground"
                    )}
                  >
                    {item.name}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-clubLight text-clubLight-foreground border-border min-w-[200px]">
                  {item.children?.map((child) => {
                    if (child.type === "dropdown") {
                      return (
                        <DropdownMenuSub key={child.name}>
                          <DropdownMenuSubTrigger className="hover:bg-clubSection hover:text-clubPrimary">
                            {child.name}
                          </DropdownMenuSubTrigger>
                          <DropdownMenuPortal>
                            <DropdownMenuSubContent className="bg-clubLight text-clubLight-foreground border-border">
                              {child.children?.map((subChild) => (
                                <DropdownMenuItem
                                  key={subChild.name}
                                  onClick={() => {
                                    if (closeSheet) closeSheet();
                                    navigate(subChild.path || "#");
                                  }}
                                  className="hover:bg-clubSection hover:text-clubPrimary"
                                >
                                  {subChild.name}
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuSubContent>
                          </DropdownMenuPortal>
                        </DropdownMenuSub>
                      );
                    }
                    return (
                      <DropdownMenuItem
                        key={child.name}
                        onClick={() => {
                          if (closeSheet) closeSheet();
                          navigate(child.path || "#");
                        }}
                        className="hover:bg-clubSection hover:text-clubPrimary"
                      >
                        {child.name}
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            );
          }
          return (
            <Link
              key={item.name}
              to={item.path || "#"}
              onClick={() => {
                if (closeSheet) closeSheet();
              }}
              className={cn(
                isMobileView ? "text-base" : "text-sm",
                "font-medium transition-colors hover:text-clubPrimary",
                location.pathname === item.path ? "text-clubPrimary" : "text-clubDark-foreground"
              )}
            >
              {item.name}
            </Link>
          );
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

        {isMobile ? (
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-clubDark-foreground">
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