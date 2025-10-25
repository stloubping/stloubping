"use client";

import React from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface LightboxModalProps {
  imageUrl: string;
  onClose: () => void;
}

const LightboxModal: React.FC<LightboxModalProps> = ({ imageUrl, onClose }) => {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 cursor-zoom-out w-screen h-screen max-w-none p-0 border-none">
        <img
          src={imageUrl}
          alt="Image agrandie"
          className="max-w-[90vw] max-h-[90vh] object-contain"
          onClick={(e) => e.stopPropagation()} // Empêche la fermeture si on clique sur l'image elle-même
        />
      </DialogContent>
    </Dialog>
  );
};

export default LightboxModal;