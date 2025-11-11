import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { Loader2, ExternalLink, CalendarDays } from 'lucide-react';
import { useBonzaiNews } from '@/hooks/useBonzaiNews';
import { useLightbox } from '@/context/LightboxContext';

const BonzaiNewsCard = () => {
  const { data: article, isLoading, isError } = useBonzaiNews();
  const { openLightbox } = useLightbox();

  if (isLoading) {
    return (
      <Card className="bg-clubLight shadow-lg rounded-xl p-6 flex items-center justify-center h-48">
        <Loader2 className="h-6 w-6 animate-spin text-clubPrimary" />
        <p className="ml-2 text-clubDark">Chargement de l'article Bonzai...</p>
      </Card>
    );
  }

  if (isError || !article) {
    return (
      <Card className="bg-clubLight shadow-lg rounded-xl p-6 border-destructive border-2">
        <CardTitle className="text-xl text-destructive">Erreur de Chargement</CardTitle>
        <CardContent className="p-0 mt-2 text-clubLight-foreground">
          Impossible de charger le dernier article de Bonzai.pro. Veuillez vérifier la fonction Edge.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-clubLight shadow-lg rounded-xl overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="relative w-full h-48 bg-clubDark/10">
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-full object-cover cursor-zoom-in"
          onClick={() => openLightbox(article.image)}
        />
        <div className="absolute inset-0 bg-clubDark/20"></div>
      </div>
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-clubPrimary">{article.title}</CardTitle>
        <CardDescription className="flex items-center text-clubLight-foreground/80 mt-2">
          <CalendarDays className="mr-2 h-4 w-4" /> {new Date(article.date).toLocaleDateString('fr-FR')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-clubLight-foreground mb-4">{article.description}</p>
        <Button asChild className="w-full bg-clubPrimary hover:bg-clubPrimary/90 text-clubPrimary-foreground">
          <a href={article.link} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
            Lire l'article complet <ExternalLink className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </CardContent>
    </Card>
  );
};

export default BonzaiNewsCard;