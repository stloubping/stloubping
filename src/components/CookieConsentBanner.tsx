"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';

const COOKIE_CONSENT_KEY = "st_loub_ping_cookie_consent";

const CookieConsentBanner = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "accepted");
    setIsVisible(false);
    // Ici, vous pourriez initialiser des scripts de suivi (ex: Google Analytics)
    // si l'utilisateur a donné son consentement.
    console.log("Cookies acceptés.");
  };

  const handleDecline = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "declined");
    setIsVisible(false);
    // Ici, vous vous assureriez que les scripts de suivi ne sont PAS initialisés.
    console.log("Cookies refusés.");
  };

  if (!isVisible) {
    return null;
  }

  return (
    <Card className="fixed bottom-0 left-0 right-0 z-[100] bg-clubDark text-clubDark-foreground p-4 shadow-lg rounded-t-lg md:flex md:items-center md:justify-between">
      <div className="flex-grow text-center md:text-left mb-4 md:mb-0">
        <p className="text-sm">
          Nous utilisons des cookies pour améliorer votre expérience sur notre site. En continuant, vous acceptez notre
          <Link to="/politique-cookies" className="text-clubPrimary hover:underline ml-1">politique de cookies</Link>.
        </p>
      </div>
      <div className="flex justify-center md:justify-end space-x-2">
        <Button onClick={handleAccept} className="bg-clubPrimary hover:bg-clubPrimary/90 text-clubPrimary-foreground">
          Accepter
        </Button>
        <Button onClick={handleDecline} variant="outline" className="border-clubPrimary text-clubPrimary hover:bg-clubPrimary/10">
          Refuser
        </Button>
        <Button onClick={() => setIsVisible(false)} variant="ghost" size="icon" className="text-clubDark-foreground hover:bg-clubDark-foreground/10">
          <X className="h-5 w-5" />
          <span className="sr-only">Fermer</span>
        </Button>
      </div>
    </Card>
  );
};

export default CookieConsentBanner;