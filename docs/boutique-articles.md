# Collection textile 2026–2027

Page : `/boutique/articles`. Catalogue de présentation uniquement, sans commande ni paiement.
La route n'est liée ni au menu, ni au pied de page, ni au sitemap. Elle dispose de métadonnées et d'un en-tête `noindex, nofollow` pendant la réflexion du club.

## Sources

- Devis DEV-20260929-02904 fourni en capture WhatsApp du 29 septembre 2026.
- Catalogue Majestee 2026–2027 fourni en PDF : 86 pages.
- Les originaux WebP sont conservés dans `public/images/boutique/articles/`, extraits des pages PDF indiquées dans `src/data/shopArticles.ts`.
- Les visuels personnalisés sont dans `public/images/boutique/articles/club/`. Ils sont réalisés avec l'outil intégré ImageGen, en mode édition avec références : produit original et `survetement-saint-loub-ping-loup-blanc-v2.png` fourni par le club. Ce sont des simulations non contractuelles, pas des photographies des produits effectivement livrés.

## Tarifs

Les prix HT remisés par unité sont stockés en centimes dans `src/data/shopArticles.ts`.
Prix TTC = prix HT × 1,20, arrondi au centime. Aucun arrondi commercial, aucune marge supplémentaire.

| Référence devis | Article | HT unitaire | TTC unitaire |
| --- | --- | ---: | ---: |
| 78 | Veste Dynamic | 17,55 € | 21,06 € |
| 84-1 | Pantalon Dynamic | 17,55 € | 21,06 € |
| 96 | Veste Fusion semi-sublimée | 37,05 € | 44,46 € |
| 108 | Pantalon Fusion | 26,32 € | 31,58 € |
| 1A | Medusa | 13,65 € | 16,38 € |
| 4A | Lop | 13,65 € | 16,38 € |
| 140 | Vendemia | 54,60 € | 65,52 € |
| 79 | Dynamic Cap | 19,50 € | 23,40 € |
| 118 | Energia | 35,10 € | 42,12 € |
| 130 | Eleme Subli | 62,40 € | 74,88 € |
| 119 | Espera | 39,00 € | 46,80 € |

Le montant de 26,32 € affiché dans la colonne de prix unitaire du devis fait foi pour le pantalon Fusion (le total de ligne présente une différence d'arrondi).
Les frais de maquette et de transport offerts ne sont pas des produits du catalogue.

## À confirmer

Le devis mentionne « Pantalon Dynamic », absent sous ce nom dans le catalogue.
Le catalogue présente un pantalon uni « Passion », page PDF 54. Le club a demandé le 1er octobre 2026 d'utiliser ce visuel sur la fiche Dynamic. Il est présenté provisoirement avec un avertissement explicite : la correspondance entre les deux modèles reste à confirmer auprès du fournisseur. Les tailles restent indiquées « À confirmer ». Prix, matière et minimum restent ceux du devis Dynamic.

Visuel enregistré : `public/images/boutique/articles/club/dynamic-pantalon.webp`. Édition avec l'outil intégré ImageGen : extraire uniquement le pantalon Passion noir à gauche de la page 54, conserver coupe, poches, logo fabricant et bandes blanches ; ajouter le petit loup blanc de la référence club sur la cuisse opposée, avec volume textile réaliste, fond blanc et ombre douce. Une seule vue de face, sans tenue complète ni bande latérale colorée.

Les coloris et marquages définitifs du club restent à valider auprès du fournisseur. Les minimums fournisseur sont ceux du devis : 10 pièces pour les survêtements, 20 pour Vendemia, 60 pour Energia et Espera. Les autres articles n'ont pas de minimum explicite.

## Direction des packshots personnalisés

Une édition indépendante par visuel : Dynamic veste, Dynamic pantalon (base Passion provisoire), Dynamic Cap, Fusion veste face/dos, Fusion pantalon face/dos, Medusa, Lop, Vendemia, Energia, Eleme et Espera.

Prompt commun : transformer le produit original en packshot photographique à volume réaliste de type mannequin invisible, sur fond blanc pur, avec lumière de studio, texture textile et ombre douce. Conserver la coupe, les couleurs, motifs, fermetures, bandes et logo fabricant. Reproduire le petit loup blanc de la référence sur la poitrine côté cœur ; pour short et pantalon, sur la cuisse opposée au logo fabricant. Remplacer les mentions génériques de logo. Ne pas ajouter de personne, décor, cadre ou texte externe. Pour les vues dos, conserver le design ; remplacer TEAMNAME sur Fusion par SAINT LOUB’PING. Conserver face et dos pour Vendemia. Aucun visuel attribué au pantalon Dynamic non confirmé.

La présentation des fiches utilise des fonds blancs, des ombres discrètes et un léger mouvement au survol, désactivé en préférence de mouvement réduit. Tarifs, commande, menus et base de données inchangés.

Contrôle et corrections : une seule vue de face pour Fusion veste, Medusa, Lop, Energia, Eleme et Espera. Le produit du catalogue est la seule référence de coupe et de couleurs ; le survêtement fourni ne sert que pour le loup blanc. Exclure toute tenue complète, tout pantalon ajouté, toute vue supplémentaire. Energia reste navy sans zip ; Espera reste entièrement noir avec zip ; Eleme reste une softshell orange/noire seule. Les PNG générés sont exportés en WebP (bord maximal 1 200 px), sans autre retouche graphique par script.
