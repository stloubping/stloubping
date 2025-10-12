import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';

interface HeroSectionProps {
  imageUrl: string;
  imageAlt: string;
  title: string;
  description: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({ imageUrl, imageAlt, title, description }) => {
  return (
    <section className="relative bg-clubDark text-clubDark-foreground rounded-xl shadow-lg mb-12 overflow-hidden">
      <img
        src={imageUrl}
        alt={imageAlt}
        className="absolute inset-0 w-full h-full object-cover opacity-40"
      />
      <div className="relative z-10 flex flex-col items-center justify-center text-center py-20 px-6">
        <h1 className="text-5xl font-extrabold mb-4 leading-tight">{title}</h1>
        <p className="text-xl mb-8 max-w-2xl">{description}</p>
        <div className="space-x-4">
          <Button asChild className="bg-clubPrimary hover:bg-clubPrimary/90 text-white text-lg px-8 py-6 rounded-full shadow-md">
            <Link to="/inscriptions">Nous Rejoindre</Link>
          </Button>
          <Button asChild variant="outline" className="bg-transparent border-2 border-clubPrimary text-clubPrimary hover:bg-clubPrimary hover:text-white text-lg px-8 py-6 rounded-full shadow-md">
            <Link to="/contact">Contact</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;