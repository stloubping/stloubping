import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Link } from 'react-router-dom';

const MentionsLegales = () => {
  return (
    <div className="container mx-auto px-4 py-8 bg-clubLight text-clubLight-foreground">
      <h1 className="text-4xl font-bold text-center mb-12 text-clubDark">Mentions Légales</h1>

      <Card className="bg-clubLight shadow-lg rounded-xl p-6 mb-8">
        <CardHeader>
          <CardTitle className="text-2xl text-clubPrimary mb-4">1. Informations Générales</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-clubLight-foreground">
          <div>
            <h3 className="font-semibold text-clubDark">Nom de l'Association :</h3>
            <p>St Loub Ping</p>
          </div>
          <div>
            <h3 className="font-semibold text-clubDark">Statut Juridique :</h3>
            <p>Association loi 1901</p>
          </div>
          <div>
            <h3 className="font-semibold text-clubDark">Siège Social :</h3>
            <p>Imp. Max Linder, 33450 Saint-Loubès, France</p>
          </div>
          <div>
            <h3 className="font-semibold text-clubDark">Contact :</h3>
            <p>Email : saintloubping@laposte.net</p>
            <p>Téléphone : 07 62 27 56 96</p>
          </div>
          <div>
            <h3 className="font-semibold text-clubDark">Date de Création :</h3>
            <p>1977</p>
          </div>
          <div>
            <h3 className="font-semibold text-clubDark">Directeur de la Publication :</h3>
            <p>Philippe Roux (Président)</p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-clubLight shadow-lg rounded-xl p-6 mb-8">
        <CardHeader>
          <CardTitle className="text-2xl text-clubPrimary mb-4">2. Hébergement du Site</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-clubLight-foreground">
          <div>
            <h3 className="font-semibold text-clubDark">Nom de l'Hébergeur :</h3>
            <p>Vercel Inc.</p>
          </div>
          <div>
            <h3 className="font-semibold text-clubDark">Adresse de l'Hébergeur :</h3>
            <p>340 S Lemon Ave #4133, Walnut, CA 91789, USA</p>
          </div>
          <div>
            <h3 className="font-semibold text-clubDark">Site Web :</h3>
            <p><a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-clubPrimary hover:underline">www.vercel.com</a></p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-clubLight shadow-lg rounded-xl p-6 mb-8">
        <CardHeader>
          <CardTitle className="text-2xl text-clubPrimary mb-4">3. Propriété Intellectuelle</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-clubLight-foreground">
          <p>
            L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur et la propriété intellectuelle.
            Tous les droits de reproduction sont réservés, y compris pour les documents iconographiques et photographiques.
          </p>
        </CardContent>
      </Card>

      <Card className="bg-clubLight shadow-lg rounded-xl p-6 mb-8">
        <CardHeader>
          <CardTitle className="text-2xl text-clubPrimary mb-4">4. Limitation de Responsabilité</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-clubLight-foreground">
          <p>
            Le St Loub Ping s'efforce d'assurer au mieux de ses possibilités l'exactitude et la mise à jour des informations diffusées sur ce site,
            dont il se réserve le droit de corriger, à tout moment et sans préavis, le contenu.
            Toutefois, le St Loub Ping ne peut garantir l'exactitude, la précision ou l'exhaustivité des informations mises à la disposition sur ce site.
          </p>
        </CardContent>
      </Card>

      <Card className="bg-clubLight shadow-lg rounded-xl p-6">
        <CardHeader>
          <CardTitle className="text-2xl text-clubPrimary mb-4">5. Liens Hypertextes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-clubLight-foreground">
          <p>
            Le site peut inclure des liens vers d'autres sites web ou d'autres sources Internet.
            Le St Loub Ping ne peut être tenu pour responsable de la mise à disposition de ces sites et sources externes,
            et ne peut supporter aucune responsabilité quant au contenu, publicités, produits, services ou tout autre matériel disponible sur ou à partir de ces sites ou sources externes.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default MentionsLegales;