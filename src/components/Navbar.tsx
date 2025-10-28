import React, { useState, useEffect } from 'react';
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface NavItem {
  name: string;
  path?: string;
  type?: "link" | "dropdown";
  children?: NavItem[];
}

const navItems: NavItem[] = [
  { name: "Accueil", path: "/", type: "link" },
  { name: "Le Club", path: "/le-club", type: "link" },
  { name: "Équipes", path: "/competitions-equipes", type: "link" },
  { name: "Les Joueurs", path: "/classement-joueurs", type: "link" },
  { name: "Adhésions", path: "/adhesions", type: "link" },
  { name: "Boutique", path: "/boutique", type: "link" },
  { name: "Partenaires", path: "/partenaires", type: "link" },
  {
    name: "Tournoi",
    type: "dropdown",
    children: [
      { name: "Inscription au Tournoi", path: "/tournoi-inscription", type: "link" },
      { name: "Liste des Inscriptions", path: "/tournoi-inscriptions-liste", type: "link" },
    ],
  },
  { name: "Contact", path: "/contact", type: "link" },
];

const Navbar = () => {
  const isMobile = useIsMobile();
  const location = useLocation();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const NavLinks = ({ className, closeSheet, isMobileView = false }: { className?: string; closeSheet?: () => void; isMobileView?: boolean }) => (
    <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)}>
      {navItems.map((item) => {
        if (item.type === "dropdown" && !isMobileView) {
          return (
            <DropdownMenu key={item.name}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-clubPrimary",
                    item.children?.some(child => location.pathname === child.path) ? "text-clubPrimary" : "text-clubDark-foreground"
                  )}
                >
                  {item.name}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-clubLight text-clubLight-foreground border-border">
                {item.children?.map((child) => (
                  <DropdownMenuItem key={child.name} asChild>
                    <Link
                      to={child.path || "#"}
                      onClick={closeSheet}
                      className={cn(
                        "block px-4 py-2 text-sm text-clubLight-foreground hover:bg-clubSection hover:text-clubPrimary", // Changed text-clubDark-foreground to text-clubLight-foreground
                        location.pathname === child.path ? "text-clubPrimary font-semibold" : ""
                      )}
                    >
                      {child.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          );
        } else if (item.type === "dropdown" && isMobileView) {
          // For mobile, flatten dropdown items
          return (
            <React.Fragment key={item.name}>
              {item.children?.map((child) => (
                <Link
                  key={child.name}
                  to={child.path || "#"}
                  onClick={closeSheet}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-clubPrimary",
                    location.pathname === child.path ? "text-clubPrimary" : "text-clubDark-foreground"
                  )}
                >
                  {child.name}
                </Link>
              ))}
            </React.Fragment>
          );
        } else {
          return (
            <Link
              key={item.name}
              to={item.path || "#"}
              onClick={closeSheet}
              className={cn(
                "text-sm font-medium transition-colors hover:text-clubPrimary",
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
              <NavLinks className="flex flex-col space-x-0 space-y-4 p-0" closeSheet={() => setIsSheetOpen(false)} isMobileView={true} />
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