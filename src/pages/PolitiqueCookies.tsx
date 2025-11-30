import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Link } from 'react-router-dom';

const PolitiqueCookies = () => {
  return (
    <div className="container mx-auto px-4 py-8 bg-clubLight text-clubLight-foreground">
      <h1 className="text-4xl font-bold text-center mb-12 text-clubDark">Politique de Cookies</h1>

      <Card className="bg-clubLight shadow-lg rounded-xl p-6 mb-8">
        <CardHeader>
          <CardTitle className="text-2xl text-clubPrimary mb-4">1. Qu'est-ce qu'un cookie ?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-clubLight-foreground">
          <p>
            Un cookie est un petit fichier texte déposé sur votre terminal (ordinateur, tablette, smartphone)
            lors de la consultation d'un site web. Il contient des informations sur votre navigation et permet
            au site de se "souvenir" de vous, de vos préférences ou de vos actions.
          </p>
        </CardContent>
      </Card>

      <Card className="bg-clubLight shadow-lg rounded-xl p-6 mb-8">
        <CardHeader>
          <CardTitle className="text-2xl text-clubPrimary mb-4">2. Types de cookies utilisés</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-clubLight-foreground">
          <p>Nous utilisons les types de cookies suivants sur notre site :</p>
          <ul className="list-disc list-inside space-y-2 pl-4">
            <li>
              <span className="font-semibold text-clubDark">Cookies strictement nécessaires :</span>
              Ces cookies sont indispensables au bon fonctionnement du site. Ils permettent, par exemple,
              de gérer votre session, de mémoriser vos préférences de consentement aux cookies.
              Ils ne nécessitent pas votre consentement.
            </li>
            <li>
              <span className="font-semibold text-clubDark">Cookies de performance et d'analyse :</span>
              Ces cookies nous aident à comprendre comment les visiteurs interagissent avec notre site
              en collectant des informations de manière anonyme. Ils nous permettent d'améliorer le contenu
              et l'ergonomie du site. Par exemple, nous pourrions utiliser des outils comme Google Analytics
              (si activé) pour suivre les pages les plus visitées.
              Ces cookies ne sont déposés qu'avec votre consentement.
            </li>
            <li>
              <span className="font-semibold text-clubDark">Cookies de fonctionnalité :</span>
              Ces cookies permettent d'améliorer les fonctionnalités et la personnalisation du site,
              comme la mémorisation de vos préférences (langue, région).
              Ces cookies ne sont déposés qu'avec votre consentement.
            </li>
            <li>
              <span className="font-semibold text-clubDark">Cookies tiers :</span>
              Notre site peut intégrer des services tiers qui utilisent leurs propres cookies.
              C'est le cas, par exemple, des vidéos YouTube intégrées. Lorsque vous lisez une vidéo YouTube,
              YouTube peut déposer des cookies sur votre terminal. Nous n'avons aucun contrôle sur ces cookies.
              Veuillez consulter la politique de confidentialité de ces tiers pour plus d'informations.
              Ces cookies ne sont déposés qu'avec votre consentement.
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card className="bg-clubLight shadow-lg rounded-xl p-6 mb-8">
        <CardHeader>
          <CardTitle className="text-2xl text-clubPrimary mb-4">3. Gestion de vos préférences de cookies</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-clubLight-foreground">
          <p>
            Lors de votre première visite sur notre site, une bannière de consentement aux cookies vous est présentée.
            Vous pouvez à tout moment modifier vos préférences en cliquant sur le lien "Gérer les cookies"
            disponible en bas de chaque page du site.
          </p>
          <p>Vous pouvez également configurer votre navigateur pour :</p>
          <ul className="list-disc list-inside space-y-2 pl-4">
            <li>Accepter tous les cookies.</li>
            <li>Rejeter tous les cookies.</li>
            <li>Être informé lorsqu'un cookie est déposé et décider au cas par cas.</li>
          </ul>
          <p className="mt-4">
            La désactivation de certains cookies peut entraîner une altération du fonctionnement du site.
            Pour plus d'informations sur la gestion des cookies dans votre navigateur, vous pouvez consulter les liens suivants :
          </p>
          <ul className="list-disc list-inside space-y-2 pl-4">
            <li><a href="https://support.google.com/chrome/answer/95647?hl=fr" target="_blank" rel="noopener noreferrer" className="text-clubPrimary hover:underline">Google Chrome</a></li>
            <li><a href="https://support.mozilla.org/fr/kb/activer-desactiver-cookies-preferences" target="_blank" rel="noopener noreferrer" className="text-clubPrimary hover:underline">Mozilla Firefox</a></li>
            <li><a href="https://support.apple.com/fr-fr/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-clubPrimary hover:underline">Apple Safari</a></li>
            <li><a href="https://support.microsoft.com/fr-fr/windows/supprimer-et-g%C3%A9rer-les-cookies-168dab11-0753-043d-7c16-ede5947fc64d" target="_blank" rel="noopener noreferrer" className="text-clubPrimary hover:underline">Microsoft Edge</a></li>
          </ul>
        </CardContent>
      </Card>

      <Card className="bg-clubLight shadow-lg rounded-xl p-6">
        <CardHeader>
          <CardTitle className="text-2xl text-clubPrimary mb-4">4. Consentement</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-clubLight-foreground">
          <p>
            En continuant votre navigation sur notre site, vous consentez à l'utilisation des cookies
            conformément à cette politique, sauf si vous avez configuré votre navigateur pour les refuser.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PolitiqueCookies;