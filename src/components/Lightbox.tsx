"use client";

import React from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
// useLightbox n'est pas utilisé directement ici, il est utilisé par le LightboxProvider
// import { useLightbox } from '@/context/LightboxContext'; 

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

export default LightboxModal;