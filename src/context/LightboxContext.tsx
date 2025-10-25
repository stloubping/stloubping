"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import LightboxModal from '@/components/Lightbox'; // Importation du vrai composant LightboxModal

interface LightboxContextType {
  openLightbox: (imageUrl: string) => void;
  closeLightbox: () => void;
}

const LightboxContext = createContext<LightboxContextType | undefined>(undefined);

export const LightboxProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState<string | null>(null);

  const openLightbox = (imageUrl: string) => {
    setCurrentImage(imageUrl);
    setIsOpen(true);
  };

  const closeLightbox = () => {
    setIsOpen(false);
    setCurrentImage(null);
  };

  return (
    <LightboxContext.Provider value={{ openLightbox, closeLightbox }}>
      {children}
      {isOpen && currentImage && (
        <LightboxModal imageUrl={currentImage} onClose={closeLightbox} />
      )}
    </LightboxContext.Provider>
  );
};

export const useLightbox = () => {
  const context = useContext(LightboxContext);
  if (context === undefined) {
    throw new Error('useLightbox must be used within a LightboxProvider');
  }
  return context;
};