import { useMemo, useState } from 'react';
import { ArrowDownWideNarrow, ArrowRight, Search, Shirt } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { articlePrice, articleSizes, compareArticlePrices, formatArticlePrice, shopArticles, type ShopArticle } from '@/data/shopArticles';
import './BoutiqueArticles.css';

const categories = ['Tous les articles', 'Tenues officielles', 'Entraînement', 'Survêtements', 'Lifestyle', 'Vestes', 'Accessoires'];
const normalize = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
const featuredArticle = shopArticles.find(article => article.id === 'survetement-officiel')!;

function ProductImage({ article, index = 0, hero = false }: { article: ShopArticle; index?: number; hero?: boolean }) {
  if (!article.images.length) return <div className="articles-image-pending"><Shirt aria-hidden="true" /><span>Visuel à confirmer</span></div>;
  return <img src={article.images[index]} alt={`${article.name} ${article.model}${index ? ' — dos' : ''}${article.originalImage ? '' : ' — simulation de personnalisation Saint Loub’Ping'}`} loading={hero ? 'eager' : 'lazy'} decoding="async" />;
}

export default function BoutiqueArticles() {
  const [category, setCategory] = useState(categories[0]);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('selection');
  const [selected, setSelected] = useState<ShopArticle | null>(null);
  const [imageIndex, setImageIndex] = useState(0);
  const articles = useMemo(() => {
    const filtered = shopArticles.filter(article =>
      (category === categories[0] || (category === 'Tenues officielles' ? article.official : article.category === category)) &&
      normalize(`${article.name} ${article.model} ${article.code} ${article.category}`).includes(normalize(search.trim())));
    if (sort === 'price-asc') filtered.sort((a, b) => compareArticlePrices(a, b));
    if (sort === 'price-desc') filtered.sort((a, b) => compareArticlePrices(a, b, true));
    if (sort === 'name') filtered.sort((a, b) => a.model.localeCompare(b.model, 'fr'));
    return filtered;
  }, [category, search, sort]);
  const openArticle = (article: ShopArticle) => { setImageIndex(0); setSelected(article); };
  const reset = () => { setCategory(categories[0]); setSearch(''); setSort('selection'); };

  return <div className="articles-shop">
    <section className="articles-hero" aria-labelledby="articles-title">
      <div className="articles-hero-copy">
        <p className="articles-eyebrow">Saint Loub’Ping · Collection 2026–2027</p>
        <h1 id="articles-title">La tenue officielle.<br /><span>Nos couleurs, notre club.</span></h1>
        <p className="articles-intro">Le survêtement Saint Loub’Ping : veste et pantalon assortis, en noir, gris et orange. L’option A, choisie pour représenter le club.</p>
        <button type="button" className="articles-hero-link" onClick={() => openArticle(featuredArticle)}>Découvrir le survêtement <ArrowRight size={18} aria-hidden="true" /></button>
      </div>
      <div className="articles-hero-product">
        <ProductImage article={featuredArticle} hero />
        <div className="articles-hero-caption"><span>Veste + pantalon</span><strong>{formatArticlePrice(articlePrice(featuredArticle))} <small>TTC</small></strong></div>
      </div>
    </section>

    <div className="articles-content" id="selection-articles">
      <div className="articles-heading"><div><p className="articles-eyebrow">La sélection du club</p><h2>À chacun sa tenue.</h2></div><p>Prix TTC · Survêtement officiel : ensemble complet</p></div>
      <div className="articles-controls">
        <div className="articles-categories" aria-label="Catégories d’articles">{categories.map(item => <button key={item} type="button" aria-pressed={category === item} onClick={() => setCategory(item)}>{item}</button>)}</div>
        <div className="articles-search-sort">
          <label className="articles-search"><Search size={18} aria-hidden="true" /><span className="sr-only">Rechercher un article</span><input type="search" placeholder="Nom, modèle ou référence…" value={search} onChange={event => setSearch(event.target.value)} /></label>
          <label className="articles-sort"><ArrowDownWideNarrow size={18} aria-hidden="true" /><span className="sr-only">Trier les articles</span><select value={sort} onChange={event => setSort(event.target.value)}><option value="selection">Sélection du club</option><option value="price-asc">Prix croissants</option><option value="price-desc">Prix décroissants</option><option value="name">Modèles A–Z</option></select></label>
        </div>
      </div>
      <p className="articles-count" role="status" aria-live="polite">{articles.length} article{articles.length > 1 ? 's' : ''}{category !== categories[0] ? ` · ${category}` : ''}</p>
      {articles.length === 0 ? <div className="articles-empty"><h3>Aucun article trouvé</h3><p>Essayez un autre nom ou revenez à la sélection complète.</p><button onClick={reset} type="button">Afficher tous les articles</button></div> :
        <div className="articles-grid">{articles.map(article => <article key={article.id} className="articles-card">
          <button className="articles-product-image" type="button" onClick={() => openArticle(article)} aria-label={`Voir la fiche ${article.name} ${article.model}`}><span className={`articles-category-tag${article.official ? ' articles-official-tag' : ''}`}>{article.official ? 'Officiel club' : article.category}</span><ProductImage article={article} /><span className="articles-image-action">Voir la fiche <ArrowRight size={16} aria-hidden="true" /></span></button>
          <div className="articles-card-copy"><p className="articles-model">{article.model}</p><div className="articles-name-price"><h3><button type="button" onClick={() => openArticle(article)}>{article.name}</button></h3><p className="articles-price">{formatArticlePrice(articlePrice(article))}{!article.pricePending && <small>{article.id === 'survetement-officiel' ? 'TTC / ensemble' : 'TTC / pièce'}</small>}</p></div><p className="articles-card-description">{article.description}</p><div className="articles-card-footer"><span>Réf. {article.code}</span><button type="button" onClick={() => openArticle(article)}>Détails <ArrowRight size={15} aria-hidden="true" /></button></div></div>
        </article>)}</div>}

      <aside className="articles-info"><div><p className="articles-eyebrow">Avant de commander</p><h2>Une sélection pour les commandes du club.</h2></div><div><p>Cette page présente les articles. Les commandes et le paiement ne sont pas encore ouverts.</p><p>Certains tarifs sont liés à une commande groupée : le minimum fournisseur est précisé dans chaque fiche. Il s’applique à la commande globale du club.</p><p>Visuels de présentation personnalisés avec le loup blanc du club, à partir du catalogue Majestee 2026–2027. Ces simulations sont non contractuelles : coloris, emplacement et taille du marquage restent à valider avec le fournisseur.</p></div></aside>
    </div>

    <Dialog open={selected !== null} onOpenChange={open => { if (!open) setSelected(null); }}>
      <DialogContent className="articles-dialog">
        {selected && <div className="articles-detail-grid">
          <div className="articles-detail-visual"><ProductImage article={selected} index={imageIndex} />{selected.images.length > 1 && <div className="articles-gallery" aria-label="Vues du produit">{selected.images.map((src, index) => <button type="button" key={src} aria-pressed={imageIndex === index} onClick={() => setImageIndex(index)}>{index === 0 ? 'Face' : 'Dos'}</button>)}</div>}</div>
          <div className="articles-detail-copy"><p className="articles-eyebrow">{selected.category} · Réf. {selected.code}</p><p className="articles-detail-model">{selected.model}</p><DialogTitle className="articles-detail-title">{selected.name}</DialogTitle><DialogDescription className="articles-detail-description">{selected.description}</DialogDescription><p className="articles-detail-price">{formatArticlePrice(articlePrice(selected))}{!selected.pricePending && <span>{selected.id === 'survetement-officiel' ? 'TTC / ensemble' : 'TTC / pièce'}</span>}</p>
            <ul className="articles-features">{selected.features.map(feature => <li key={feature}>{feature}</li>)}</ul>
            <dl className="articles-specs"><div><dt>Coloris</dt><dd>{selected.colors}</dd></div>{selected.shoeSizes ? <div><dt>Pointures</dt><dd>{selected.shoeSizes}</dd></div> : <><div><dt>Tailles enfants</dt><dd>{selected.sizes?.children ?? (selected.images.length && !selected.sizesPending ? articleSizes.children : 'À confirmer auprès du club')}</dd></div><div><dt>Tailles adultes</dt><dd>{selected.sizes?.adults ?? (selected.images.length && !selected.sizesPending ? articleSizes.adults : 'À confirmer auprès du club')}</dd></div></>}</dl>
            {selected.images.length > 0 && !selected.originalImage && <><p className="articles-small-note">Simulation de personnalisation · visuel non contractuel.</p>{!selected.sizesPending && !selected.shoeSizes && <p className="articles-small-note">Modèle homme et femme au catalogue. Autres tailles sur demande, à confirmer.</p>}</>}
            {selected.minimum && <p className="articles-order-note">Tarif sous réserve d’une commande groupée d’au moins <strong>{selected.minimum} pièces</strong> de cet article.</p>}
            {selected.imageNote && <p className="articles-order-note">{selected.imageNote}</p>}
            <p className="articles-source">{selected.official ? (selected.id === 'survetement-officiel' ? 'Tenue officielle : option A fournie par le club. Prix de l’ensemble communiqué par le club.' : 'Visuel et prix repris de la boutique du club.') : <>{selected.cataloguePage ? `Source : catalogue Majestee 2026–2027, page PDF ${selected.cataloguePage}. ` : ''}{selected.pricePending ? 'Tarif à confirmer auprès du club.' : 'Tarif de vente TTC du club, TVA à 20 % incluse. Base fournisseur : devis du 29 septembre 2026.'}</>}</p>
          </div>
        </div>}
      </DialogContent>
    </Dialog>
  </div>;
}
