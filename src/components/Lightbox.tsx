"use client";

import React from 'react';
import { Dialog } from "@/components/ui/dialog";
import LightboxContent from './LightboxContent'; // Import the new LightboxContent component

interface LightboxModalProps {
  imageUrl: string;
  onClose: () => void;
}

const LightboxModal: React.FC<LightboxModalProps> = ({ imageUrl, onClose }) => {
  const isYouTubeVideo = imageUrl.includes("youtube.com/embed/");

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <LightboxContent onClose={onClose}>
        {isYouTubeVideo ? (
          <div className="relative w-[90vw] h-[50.625vw] max-w-[1280px] max-h-[720px]"> {/* 16:9 aspect ratio */}
            <iframe
              src={imageUrl}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute top-0 left-0 w-full h-full rounded-lg"
              onClick={(e) => e.stopPropagation()} // Empêche la fermeture si on clique sur l'iframe
            ></iframe>
          </div>
        ) : (
          <img
            src={imageUrl}
            alt="Image agrandie"
            className="max-w-[90vw] max-h-[90vh] object-contain"
            onClick={(e) => e.stopPropagation()} // Empêche la fermeture si on clique sur l'image elle-même
          />
        )}
      </LightboxContent>
    </Dialog>
  );
};

export default LightboxModal;