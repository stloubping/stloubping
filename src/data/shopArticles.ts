export type ShopArticle = {
  id: string;
  code: string;
  name: string;
  model: string;
  category: 'Entraînement' | 'Survêtements' | 'Lifestyle' | 'Vestes';
  priceHtCents: number;
  images: string[];
  description: string;
  features: string[];
  colors: string;
  minimum?: number;
  cataloguePage?: number;
  imageNote?: string;
};

const image = (name: string) => `/images/boutique/articles/${name}.webp`;
export const articlePrice = (article: ShopArticle) => Math.round(article.priceHtCents * 1.2) / 100;
export const formatArticlePrice = (price: number) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(price);
export const articleSizes = {
  children: '4, 6, 8, 10, 12 et 14 ans',
  adults: 'XS, S, M, L, XL, 2XL et 3XL',
};

export const shopArticles: ShopArticle[] = [
  {
    id: 'dynamic-veste', code: '78', name: 'Veste zippée', model: 'Dynamic', category: 'Survêtements', priceHtCents: 1755,
    images: [image('dynamic-veste')], description: 'Une veste de survêtement zippée pour les entraînements et les déplacements du club.',
    features: ['100 % polyester double interlock', 'Fermeture zippée', 'Logo club inclus'],
    colors: 'Noir et rouge', minimum: 10, cataloguePage: 57,
  },
  {
    id: 'dynamic-pantalon', code: '84-1', name: 'Pantalon de survêtement', model: 'Dynamic', category: 'Survêtements', priceHtCents: 1755,
    images: [], description: 'Le pantalon proposé avec la veste Dynamic dans le devis du club.',
    features: ['100 % polyester double interlock', 'Logo club inclus'], colors: 'Noir et rouge', minimum: 10,
    imageNote: 'La correspondance avec le pantalon du catalogue reste à confirmer auprès du fournisseur. Visuel et tailles à confirmer.',
  },
  {
    id: 'fusion-veste', code: '96', name: 'Veste zippée semi-sublimée', model: 'Fusion', category: 'Survêtements', priceHtCents: 3705,
    images: [image('fusion-veste'), image('fusion-veste-dos')], description: 'Une veste zippée avec une bande sublimée, dans la gamme Fusion.',
    features: ['100 % polyester double interlock', 'Bande sublimée', 'Fermeture zippée'],
    colors: 'Noir et rouge', minimum: 10, cataloguePage: 47,
  },
  {
    id: 'fusion-pantalon', code: '108', name: 'Pantalon semi-sublimé', model: 'Fusion', category: 'Survêtements', priceHtCents: 2632,
    images: [image('fusion-pantalon'), image('fusion-pantalon-dos')], description: 'Le pantalon Fusion à bande sublimée pour compléter le survêtement.',
    features: ['Polyester double interlock', 'Bande sublimée', 'Poches zippées'],
    colors: 'Noir et rouge', minimum: 10, cataloguePage: 53,
  },
  {
    id: 'medusa', code: '1A', name: 'Maillot d’entraînement', model: 'Medusa', category: 'Entraînement', priceHtCents: 1365,
    images: [image('medusa')], description: 'Un maillot multisport uni en micromèche, pour les séances à la salle.',
    features: ['100 % polyester micromèche', 'Coupe classique', 'Col rond ou col V selon configuration', 'Logo club inclus'],
    colors: 'Noir, blanc, rouge, jaune, vert, ciel, navy et royal au catalogue', cataloguePage: 4,
  },
  {
    id: 'lop', code: '4A', name: 'Short multisport', model: 'Lop', category: 'Entraînement', priceHtCents: 1365,
    images: [image('lop')], description: 'Un short uni en polyester interlock pour composer votre tenue d’entraînement.',
    features: ['100 % polyester interlock', 'Modèle uni', 'Logo club inclus'],
    colors: 'Noir, blanc, rouge, jaune, vert, ciel, navy et royal au catalogue', cataloguePage: 9,
  },
  {
    id: 'vendemia', code: '140', name: 'Veste baseball', model: 'Vendemia', category: 'Lifestyle', priceHtCents: 5460,
    images: [image('vendemia')], description: 'Une veste universitaire varsity en coton, pour porter les couleurs du club en dehors de la salle.',
    features: ['100 % coton', 'Style baseball / universitaire', 'Logo cœur inclus'],
    colors: 'Noir, gris et navy au catalogue', minimum: 20, cataloguePage: 24,
  },
  {
    id: 'dynamic-cap', code: '79', name: 'Veste zippée à capuche', model: 'Dynamic Cap', category: 'Survêtements', priceHtCents: 1950,
    images: [image('dynamic-cap')], description: 'La veste Dynamic avec capuche et fermeture zippée.',
    features: ['100 % polyester double interlock', 'Capuche', 'Fermeture zippée', 'Logo club inclus'],
    colors: 'Plusieurs coloris au catalogue, configuration du club à confirmer', minimum: 10, cataloguePage: 59,
  },
  {
    id: 'energia', code: '118', name: 'Sweat à capuche', model: 'Energia', category: 'Lifestyle', priceHtCents: 3510,
    images: [image('energia')], description: 'Un sweat à capuche en coton fleece, pour les moments avant et après l’entraînement.',
    features: ['Coton fleece selon le devis', 'Capuche', 'Logo cœur inclus'],
    colors: 'Noir, gris et navy au catalogue', minimum: 60, cataloguePage: 67,
  },
  {
    id: 'eleme', code: '130', name: 'Veste softshell sublimée', model: 'Eleme Subli', category: 'Vestes', priceHtCents: 6240,
    images: [image('eleme')], description: 'Une veste softshell entièrement sublimée, avec un design personnalisable.',
    features: ['Matière softshell', 'Sublimation intégrale', 'Coloris, motifs et logos personnalisables', 'Poches zippées', 'Capuche en option au catalogue, non incluse dans le prix affiché'],
    colors: 'Design personnalisé à définir', cataloguePage: 72,
  },
  {
    id: 'espera', code: '119', name: 'Sweat zippé à capuche', model: 'Espera', category: 'Lifestyle', priceHtCents: 3900,
    images: [image('espera')], description: 'Un sweat en coton fleece avec capuche et ouverture zippée.',
    features: ['Coton fleece selon le devis', 'Capuche et fermeture zippée', 'Logo cœur inclus'],
    colors: 'Noir, gris et navy au catalogue', minimum: 60, cataloguePage: 67,
  },
];
