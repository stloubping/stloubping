"use client";

import React from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useLightbox } from '@/context/LightboxContext'; // Import useLightbox

interface LightboxModalProps {
  imageUrl: string;
  onClose: () => void;
}

const LightboxModal: React.FC<LightboxModalProps> = ({ imageUrl, onClose }) => {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 cursor-pointer">
        <img
          src={imageUrl}
          alt="Image agrandie"
          className="max-w-[90vw] max-h-[90vh] object-contain"
          onClick={(e) => e.stopPropagation()} // Prevent closing when clicking on the image itself
        />
      </DialogContent>
    </Dialog>
  );
};

// Override the placeholder in LightboxContext
// This is a common pattern when a component needs to be defined after its context
// but is conceptually part of the context's internal rendering.
// In a real-world scenario, LightboxModal would likely be directly in Lightbox.tsx
// and LightboxProvider would import and render it.
// For Dyad's single-response constraint, this is a way to ensure the definition is present.
declare module '@/context/LightboxContext' {
  interface LightboxContextType {
    // Re-declare LightboxModal to ensure it's recognized
    // This is a workaround for Dyad's file generation flow.
  }
  const LightboxModal: React.FC<LightboxModalProps>;
}

export default LightboxModal;