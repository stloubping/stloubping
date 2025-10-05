import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';

interface HeroSectionProps {
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  imageUrl: string;
  imageAlt: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  title,
  description,
  buttonText,
  buttonLink,
  imageUrl,
  imageAlt,
}) => {
  return (
    <section className="relative w-full bg-clubDark text-clubDark-foreground">
      <div className="container mx-auto flex flex-col lg:flex-row items-center justify-between py-12 md:py-24 lg:py-32 gap-8">
        {/* Left Content Area */}
        <div className="flex-1 text-center lg:text-left p-4 lg:p-0">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
            {title}
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-lg mx-auto lg:mx-0">
            {description}
          </p>
          <Link to={buttonLink}>
            <Button className="bg-clubPrimary hover:bg-clubPrimary/90 text-clubPrimary-foreground px-8 py-6 text-lg rounded-md shadow-lg transition-colors duration-300">
              {buttonText}
            </Button>
          </Link>
        </div>

        {/* Right Image Area */}
        <div className="flex-1 flex justify-center lg:justify-end p-4 lg:p-0">
          <div className="w-full max-w-md lg:max-w-lg xl:max-w-xl aspect-square rounded-xl overflow-hidden shadow-2xl">
            <img
              src={imageUrl}
              alt={imageAlt}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;