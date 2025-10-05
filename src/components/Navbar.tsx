import { Link, useLocation } from "react-router-dom";
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
  const location = useLocation();

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
          <img src="https://scontent-cdg4-2.xx.fbcdn.net/v/t39.30808-6/354242202_217666231105306_1523329741096941961_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=vxBlxBVDqUYQ7kNvwFolNDp&_nc_oc=AdmEYTEnuK9wM1eJaeCwg0sm_jAKDjOEFaDM0RpPGZmYiZnhqrtZyu0cC0E-5Kmdb9AkvKBojC3XALXa9fm2Yo8U&_nc_zt=23&_nc_ht=scontent-cdg4-2.xx&_nc_gid=LmC60VNdyhR5083u3mLHDQ&oh=00_AfcJ5cIUBRQCiiq-MpR89cxwU6nNCOse8QUnbk1UuURwEA&oe=68E847D8" alt="St Loub Ping Logo" className="h-8 w-8 mr-2" />
          <span>St Loub Ping</span>
        </Link>
        {isMobile ? (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-clubDark-foreground">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-clubDark text-clubDark-foreground border-clubPrimary">
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