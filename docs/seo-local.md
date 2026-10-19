# Référencement local — Saint-Loub’Ping

## Mise en place sur le site

- Une page utile, `/tennis-de-table-rives-de-la-laurence`, pour les six communes : Saint-Loubès, Saint-Sulpice-et-Cameyrac, Sainte-Eulalie, Montussan, Yvrac et Beychac-et-Caillau.
- Adresse réelle unique à Saint-Loubès, itinéraires depuis les six communes, horaires, adhésions et essai gratuit. Aucun établissement fictif dans les communes voisines, aucun temps de trajet inventé.
- Liens depuis l’accueil et le pied de page ; titres et descriptions locales ; schéma SportsClub/SportsActivityLocation et zone accueillie ; HTML pré-rendu et sitemap.
- Données communes au navigateur et au pré-rendu dans `src/data/localSeo.mjs`. Aucun faux avis, aucune note agrégée ni horaires inventés dans le schéma.
- Vérification après compilation : `node scripts/test-local-seo.mjs`.

## À effectuer après la mise en ligne, avec le compte du club

1. Google Business Profile : vérifier ou revendiquer la fiche existante, sans créer de doublon. Employer le vrai nom du club, la même adresse, le même téléphone et le site `https://www.saintloubping.fr/`. Vérifier les catégories disponibles, les horaires effectifs et les photos réelles de la salle. Ne pas ajouter les communes au nom du club pour y accumuler des mots-clés.
2. Google Search Console : soumettre `https://www.saintloubping.fr/sitemap.xml`, inspecter la nouvelle page et demander son indexation si nécessaire. Contrôler ensuite les impressions/clics et les requêtes locales. L’exploration et le classement ne sont ni immédiats ni garantis.
3. Annuaires locaux : demander aux mairies, à l’intercommunalité et aux annuaires sportifs qui présentent déjà le club de vérifier l’adresse et leur lien vers le domaine actuel. Ne pas prétendre à un partenariat sans accord.
4. Recueillir des avis authentiques et facultatifs des adhérents, sans contrepartie, et y répondre. Maintenir les photos et informations pratiques à jour.
5. Un ancien domaine, `saintloub-ping.fr`, apparaît encore dans les recherches. Si le club le contrôle, vérifier sa situation et envisager les redirections appropriées vers le domaine actuel après analyse ; aucune modification n’a été faite sur cet autre domaine.

## Sources

- Communes : https://www.rivesdelalaurence.fr/la-communaute-de-communes-les-rives-de-la-laurence/
- Google, classement local : https://support.google.com/business/answer/7091?hl=fr
- Google, données structurées locales : https://developers.google.com/search/docs/appearance/structured-data/local-business?hl=fr

Les résultats locaux dépendent notamment de la pertinence, de la distance et de la notoriété. Mentionner une commune sur le site ne supprime pas le critère de distance et ne garantit pas une première position.
