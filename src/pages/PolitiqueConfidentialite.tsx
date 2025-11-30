import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Link } from 'react-router-dom';

const PolitiqueConfidentialite = () => {
  return (
    <div className="container mx-auto px-4 py-8 bg-clubLight text-clubLight-foreground">
      <h1 className="text-4xl font-bold text-center mb-12 text-clubDark">Politique de Confidentialité</h1>

      <Card className="bg-clubLight shadow-lg rounded-xl p-6 mb-8">
        <CardHeader>
          <CardTitle className="text-2xl text-clubPrimary mb-4">1. Introduction</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-clubLight-foreground">
          <p>
            Le St Loub Ping s'engage à protéger la vie privée de ses utilisateurs et à respecter la législation en vigueur,
            notamment le Règlement Général sur la Protection des Données (RGPD) et la loi Informatique et Libertés.
            Cette politique de confidentialité décrit comment nous collectons, utilisons, traitons et protégeons vos données personnelles.
          </p>
        </CardContent>
      </Card>

      <Card className="bg-clubLight shadow-lg rounded-xl p-6 mb-8">
        <CardHeader>
          <CardTitle className="text-2xl text-clubPrimary mb-4">2. Données Collectées</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-clubLight-foreground">
          <p>Nous collectons les types de données personnelles suivants :</p>
          <ul className="list-disc list-inside space-y-2 pl-4">
            <li>
              <span className="font-semibold text-clubDark">Données d'identification :</span> Nom, prénom, adresse e-mail, numéro de téléphone, numéro de licence FFTT, club (lors de l'inscription au tournoi ou via le formulaire de contact).
            </li>
            <li>
              <span className="font-semibold text-clubDark">Données de connexion :</span> Adresse IP, type de navigateur, système d'exploitation, pages visitées, temps passé sur le site (via des cookies et outils d'analyse, si acceptés).
            </li>
            <li>
              <span className="font-semibold text-clubDark">Données de participation :</span> Tableaux sélectionnés, nom du partenaire de double (pour l'inscription au tournoi).
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card className="bg-clubLight shadow-lg rounded-xl p-6 mb-8">
        <CardHeader>
          <CardTitle className="text-2xl text-clubPrimary mb-4">3. Finalités de la Collecte</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-clubLight-foreground">
          <p>Vos données sont collectées pour les finalités suivantes :</p>
          <ul className="list-disc list-inside space-y-2 pl-4">
            <li>Gérer les inscriptions au tournoi et la participation aux événements.</li>
            <li>Répondre à vos demandes via le formulaire de contact.</li>
            <li>Améliorer l'expérience utilisateur et le fonctionnement du site (via les cookies analytiques, si acceptés).</li>
            <li>Assurer la sécurité du site et prévenir la fraude.</li>
            <li>Communiquer des informations relatives au club et à ses activités (avec votre consentement).</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="bg-clubLight shadow-lg rounded-xl p-6 mb-8">
        <CardHeader>
          <CardTitle className="text-2xl text-clubPrimary mb-4">4. Base Légale du Traitement</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-clubLight-foreground">
          <p>Le traitement de vos données personnelles est fondé sur :</p>
          <ul className="list-disc list-inside space-y-2 pl-4">
            <li>
              <span className="font-semibold text-clubDark">L'exécution d'un contrat :</span> Pour la gestion de votre inscription au tournoi.
            </li>
            <li>
              <span className="font-semibold text-clubDark">Votre consentement :</span> Pour l'envoi de communications marketing ou l'utilisation de certains cookies.
            </li>
            <li>
              <span className="font-semibold text-clubDark">L'intérêt légitime :</span> Pour l'amélioration du site, la sécurité et la réponse à vos demandes.
            </li>
            <li>
              <span className="font-semibold text-clubDark">Une obligation légale :</span> Pour le respect des réglementations en vigueur.
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card className="bg-clubLight shadow-lg rounded-xl p-6 mb-8">
        <CardHeader>
          <CardTitle className="text-2xl text-clubPrimary mb-4">5. Destinataires des Données</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-clubLight-foreground">
          <p>Vos données personnelles sont destinées aux membres autorisés du St Loub Ping en charge de la gestion du club et des événements.</p>
          <p>Nous ne vendons ni ne louons vos données personnelles à des tiers. Elles peuvent être partagées avec :</p>
          <ul className="list-disc list-inside space-y-2 pl-4">
            <li>
              <span className="font-semibold text-clubDark">Prestataires techniques :</span> Pour l'hébergement du site (Vercel) et la base de données (Supabase).
            </li>
            <li>
              <span className="font-semibold text-clubDark">Autorités compétentes :</span> En cas d'obligation légale.
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card className="bg-clubLight shadow-lg rounded-xl p-6 mb-8">
        <CardHeader>
          <CardTitle className="text-2xl text-clubPrimary mb-4">6. Durée de Conservation des Données</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-clubLight-foreground">
          <ul className="list-disc list-inside space-y-2 pl-4">
            <li>
              <span className="font-semibold text-clubDark">Données d'inscription au tournoi :</span> Conservées pendant la durée de l'événement et archivées pour une durée légale de 3 ans à des fins de suivi et de preuve.
            </li>
            <li>
              <span className="font-semibold text-clubDark">Données de contact :</span> Conservées le temps nécessaire au traitement de votre demande, puis archivées pendant 1 an.
            </li>
            <li>
              <span className="font-semibold text-clubDark">Cookies :</span> Conformément à notre <Link to="/politique-cookies" className="text-clubPrimary hover:underline">Politique de Cookies</Link>.
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card className="bg-clubLight shadow-lg rounded-xl p-6 mb-8">
        <CardHeader>
          <CardTitle className="text-2xl text-clubPrimary mb-4">7. Vos Droits RGPD</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-clubLight-foreground">
          <p>Conformément au RGPD, vous disposez des droits suivants concernant vos données personnelles :</p>
          <ul className="list-disc list-inside space-y-2 pl-4">
            <li>
              <span className="font-semibold text-clubDark">Droit d'accès :</span> Obtenir la confirmation que vos données sont traitées et en obtenir une copie.
            </li>
            <li>
              <span className="font-semibold text-clubDark">Droit de rectification :</span> Demander la correction de données inexactes ou incomplètes.
            </li>
            <li>
              <span className="font-semibold text-clubDark">Droit à l'effacement ("droit à l'oubli") :</span> Demander la suppression de vos données.
            </li>
            <li>
              <span className="font-semibold text-clubDark">Droit à la limitation du traitement :</span> Demander la suspension du traitement de vos données.
            </li>
            <li>
              <span className="font-semibold text-clubDark">Droit à la portabilité :</span> Recevoir vos données dans un format structuré et couramment utilisé.
            </li>
            <li>
              <span className="font-semibold text-clubDark">Droit d'opposition :</span> Vous opposer au traitement de vos données pour des raisons légitimes.
            </li>
            <li>
              <span className="font-semibold text-clubDark">Droit de retirer votre consentement :</span> À tout moment, sans affecter la licéité du traitement fondé sur le consentement effectué avant ce retrait.
            </li>
          </ul>
          <p className="mt-4">
            Pour exercer ces droits, vous pouvez nous contacter via notre <Link to="/demande-donnees" className="text-clubPrimary hover:underline">formulaire de demande de données</Link> ou par e-mail à : <span className="font-semibold">saintloubping@laposte.net</span>.
          </p>
          <p>
            Vous avez également le droit d'introduire une réclamation auprès de la CNIL (Commission Nationale de l'Informatique et des Libertés) si vous estimez que vos droits ne sont pas respectés.
          </p>
        </CardContent>
      </Card>

      <Card className="bg-clubLight shadow-lg rounded-xl p-6">
        <CardHeader>
          <CardTitle className="text-2xl text-clubPrimary mb-4">8. Sécurité des Données</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-clubLight-foreground">
          <p>
            Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles appropriées pour protéger vos données personnelles contre l'accès non autorisé, la divulgation, l'altération ou la destruction.
            Cela inclut l'utilisation de protocoles sécurisés (HTTPS), la protection des accès à nos bases de données et la sensibilisation de notre personnel.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PolitiqueConfidentialite;