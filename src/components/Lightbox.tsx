"use client";

import React from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LightboxModalProps {
  imageUrl: string;
  onClose: () => void;
}

const LightboxModal: React.FC<LightboxModalProps> = ({ imageUrl, onClose }) => {
  const isYouTubeVideo = imageUrl.includes("youtube.com/embed/");

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-black/90 border-none flex items-center justify-center overflow-hidden">
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-4 z-50 text-white hover:bg-white/20 rounded-full"
          onClick={onClose}
        >
          <X className="h-6 w-6" />
        </Button>
        
        <div className="w-full h-full flex items-center justify-center p-4" onClick={onClose}>
          {isYouTubeVideo ? (
            <div 
              className="relative w-full max-w-[1280px] aspect-video"
              onClick={(e) => e.stopPropagation()}
            >
              <iframe
                src={imageUrl}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute top-0 left-0 w-full h-full rounded-lg shadow-2xl"
              ></iframe>
            </div>
          ) : (
            <img
              src={imageUrl}
              alt="Image agrandie"
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LightboxModal;