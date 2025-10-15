import React from 'react';
import { MadeWithDyad } from './made-with-dyad';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-clubDark text-clubDark-foreground py-12 mt-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left">
          {/* Club Info */}
          <div className="col-span-full md:col-span-1 mb-8 md:mb-0">
            <Link to="/" className="flex items-center justify-center md:justify-start gap-2 text-xl font-semibold mb-4 text-clubPrimary">
              <img src="/images/logo/telecharge.jpg" alt="St Loub Ping Logo" className="h-8 w-8 mr-2" />
              <span>St Loub Ping</span>
            </Link>
            <p className="text-sm text-clubDark-foreground/80 mb-4">
              Le club de tennis de table pour tous les niveaux, du loisir à la compétition.
            </p>
            <div className="flex justify-center md:justify-start space-x-4">
              <a href="#" className="text-clubDark-foreground hover:text-clubPrimary transition-colors"><Facebook size={20} /></a>
              <a href="#" className="text-clubDark-foreground hover:text-clubPrimary transition-colors"><Instagram size={20} /></a>
              <a href="#" className="text-clubDark-foreground hover:text-clubPrimary transition-colors"><Youtube size={20} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-clubPrimary">Liens rapides</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-sm text-clubDark-foreground/80 hover:text-clubPrimary transition-colors">Accueil</Link></li>
              <li><Link to="/le-club" className="text-sm text-clubDark-foreground/80 hover:text-clubPrimary transition-colors">Le Club</Link></li>
              <li><Link to="/competitions-equipes" className="text-sm text-clubDark-foreground/80 hover:text-clubPrimary transition-colors">Compétitions</Link></li>
              <li><Link to="/adhesions" className="text-sm text-clubDark-foreground/80 hover:text-clubPrimary transition-colors">Adhésions</Link></li>
            </ul>
          </div>

          {/* Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-clubPrimary">Informations</h3>
            <ul className="space-y-2">
              <li><Link to="/boutique" className="text-sm text-clubDark-foreground/80 hover:text-clubPrimary transition-colors">Boutique</Link></li>
              <li><Link to="/partenaires" className="text-sm text-clubDark-foreground/80 hover:text-clubPrimary transition-colors">Partenaires</Link></li>
              <li><Link to="/contact" className="text-sm text-clubDark-foreground/80 hover:text-clubPrimary transition-colors">Contact</Link></li>
              <li><Link to="#" className="text-sm text-clubDark-foreground/80 hover:text-clubPrimary transition-colors">Mentions légales</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-clubPrimary">Contact</h3>
            <ul className="space-y-2 text-sm text-clubDark-foreground/80">
              <li className="flex items-center justify-center md:justify-start"><MapPin size={16} className="mr-2 text-clubPrimary" /> Imp. Max Linder, 33450 Saint-Loubès, France</li>
              <li className="flex items-center justify-center md:justify-start"><Mail size={16} className="mr-2 text-clubPrimary" /> <span className="font-semibold">saintloubping@laposte.net</span></li>
              <li className="flex items-center justify-center md:justify-start"><Phone size={16} className="mr-2 text-clubPrimary" /> <span className="font-semibold">07 62 27 56 96</span></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-clubDark-foreground/20 mt-8 pt-6 text-center">
          <p className="text-sm text-clubDark-foreground/60">&copy; {new Date().getFullYear()} St Loub Ping. Tous droits réservés.</p>
          <MadeWithDyad />
        </div>
      </div>
    </footer>
  );
};

export default Footer;