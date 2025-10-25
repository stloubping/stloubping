import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"; // Import SheetHeader, SheetTitle, SheetDescription
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
              <Button variant="ghost" size="icon" className="text-clubDark-foreground z-50"> {/* Added z-50 */}
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-clubDark text-clubDark-foreground border-clubPrimary w-full sm:w-3/4 md:max-w-xs p-6"> {/* Added p-6 for padding */}
              <SheetHeader className="mb-6"> {/* Added SheetHeader and mb-6 */}
                <SheetTitle className="text-clubPrimary text-2xl font-bold">Navigation</SheetTitle>
                <SheetDescription className="text-clubDark-foreground/80">
                  Explorez les sections du club.
                </SheetDescription>
              </SheetHeader>
              <NavLinks className="flex flex-col space-x-0 space-y-4 p-0" /> {/* Removed p-4, added space-y-4 */}
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