"use client";

import React from 'react';
import { Dialog } from "@/components/ui/dialog";
import LightboxContent from './LightboxContent'; // Import the new LightboxContent component

interface LightboxModalProps {
  imageUrl: string;
  onClose: () => void;
}

const LightboxModal: React.FC<LightboxModalProps> = ({ imageUrl, onClose }) => {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <LightboxContent> {/* Use the new LightboxContent component */}
        <img
          src={imageUrl}
          alt="Image agrandie"
          className="max-w-[90vw] max-h-[90vh] object-contain"
          onClick={(e) => e.stopPropagation()} // Empêche la fermeture si on clique sur l'image elle-même
        />
      </LightboxContent>
    </Dialog>
  );
};

export default LightboxModal;