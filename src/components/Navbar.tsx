import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const navItems = [
  { name: "Accueil", path: "/" },
  { name: "Le Club", path: "/le-club" },
  { name: "Compétitions & Équipes", path: "/competitions-equipes" },
  { name: "Adhésions", path: "/adhesions" },
  { name: "Boutique", path: "/boutique" },
  { name: "Partenaires", path: "/partenaires" },
  { name: "Contact", path: "/contact" },
];

const Navbar = () => {
  const isMobile = useIsMobile();

  const NavLinks = ({ className }: { className?: string }) => (
    <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)}>
      {navItems.map((item) => (
        <Link
          key={item.name}
          to={item.path}
          className="text-sm font-medium transition-colors hover:text-clubPrimary text-clubBackground-foreground"
        >
          {item.name}
        </Link>
      ))}
    </nav>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-clubBackground text-clubBackground-foreground shadow-sm">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2 text-lg font-semibold md:text-base text-clubPrimary">
          <span>Club de Tennis de Table</span>
        </Link>
        {isMobile ? (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-clubPrimary">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-clubBackground text-clubBackground-foreground">
              <NavLinks className="flex flex-col space-x-0 space-y-4 p-4" />
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