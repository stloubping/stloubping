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
import { Menu, ChevronRight } from "lucide-react";
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
          isMobileView ? "flex-col space-y-4" : "items-center space-x-4 lg:space-x-6"think
The user is asking me to continue my previous response which was cut off.
The previous response was a `<dyad-write>` block for `src/components/Navbar.tsx`.
It stopped at:
```tsx
      <nav className={cn(
          "flex",
          isMobileView ? "flex-col space-y-4" : "items-center space-x-4 lg:space-x-6"
```

I need to complete the file content.

Looking at the previous content:
- Imports were added: `useNavigate`, `Sheet`, `SheetContent`, `SheetTrigger`, `DropdownMenuSub`, etc.
- `navItems` array was defined.
- `Navbar` component started.
- `NavLinks` sub-component started.

I will continue the `NavLinks` component and then the rest of the `Navbar` component.

Wait, the user said "Continue exactly where you left off without any preamble".
However, I am an AI assistant and I must follow the system instructions.
The system instructions say:
- "Only use ONE <dyad-write> block per file that you write!"
- "do NOT be lazy and ALWAYS write the entire file. It needs to be a complete file."

So I cannot just "continue" the text. I must rewrite the entire file in a single `<dyad-write>` block.

But the user specifically asked to "Continue exactly where you left off without any preamble".
If I just output the rest of the code, it won't be valid XML/JSX because it's missing the opening tags.
If I output the whole file, I am following the system instructions.

Actually, the user's prompt "Continue exactly where you left off" usually implies they want the missing part of the text. But in this specific environment, I must provide the full file content in a `<dyad-write>` tag.

Let's look at the previous output. It was:
```tsx
<dyad-write path="src/components/Navbar.tsx" description="Correction des erreurs de syntaxe et des imports manquants dans la Navbar.">
import React, { useState } from 'react';
...
      <nav className={cn(
          "flex",
          isMobileView ? "flex-col space-y-4" : "items-center space-x-4 lg:space-x-6"
```
It was missing the closing `)` for `cn`, the closing `>`, the map function, and the rest of the component.

I will provide the full file content now.

Wait, the system instructions say: "If you do NOT need to change a file, then do not use the <dyad-write> tag."
But here I am fixing a syntax error I introduced.

Let's write the full `src/components/Navbar.tsx`.

I need to make sure the dropdown "Edition 2026" works.
In the previous attempt, I was trying to use `DropdownMenuSub` for nested menus, which is the standard way in shadcn/ui.

Let's implement the full file.

```tsx
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
import { Menu, ChevronRight } from "lucide-react";
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
```

Wait, I need to check if `Sheet` and `SheetContent` are imported correctly. Yes, they are in `@/components/ui/sheet`.

I will now output the full file.<dyad-write path="src/components/Navbar.tsx" description="Correction complète de la Navbar avec gestion des menus imbriqués et imports manquants.">
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