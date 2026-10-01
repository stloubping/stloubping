import { useMemo, useState } from 'react';
import { ArrowDownWideNarrow, ArrowRight, Search, Shirt } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { articlePrice, articleSizes, formatArticlePrice, shopArticles, type ShopArticle } from '@/data/shopArticles';
import './BoutiqueArticles.css';

const categories = ['Tous les articles', 'Entraînement', 'Survêtements', 'Lifestyle', 'Vestes'];
const normalize = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
const featuredArticle = shopArticles.find(article => article.id === 'dynamic-cap')!;

function ProductImage({ article, index = 0, hero = false }: { article: ShopArticle; index?: number; hero?: boolean }) {
  if (!article.images.length) return <div className="articles-image-pending"><Shirt aria-hidden="true" /><span>Visuel à confirmer</span></div>;
  return <img src={article.images[index]} alt={`${article.name} ${article.model}${index ? ' — dos' : ' — visuel du catalogue'}`} loading={hero ? 'eager' : 'lazy'} decoding="async" />;
}

export default function BoutiqueArticles() {
  const [category, setCategory] = useState(categories[0]);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('selection');
  const [selected, setSelected] = useState<ShopArticle | null>(null);
  const [imageIndex, setImageIndex] = useState(0);
  const articles = useMemo(() => {
    const filtered = shopArticles.filter(article =>
      (category === categories[0] || article.category === category) &&
      normalize(`${article.name} ${article.model} ${article.code} ${article.category}`).includes(normalize(search.trim())));
    if (sort === 'price-asc') filtered.sort((a, b) => articlePrice(a) - articlePrice(b));
    if (sort === 'price-desc') filtered.sort((a, b) => articlePrice(b) - articlePrice(a));
    if (sort === 'name') filtered.sort((a, b) => a.model.localeCompare(b.model, 'fr'));
    return filtered;
  }, [category, search, sort]);
  const openArticle = (article: ShopArticle) => { setImageIndex(0); setSelected(article); };
  const reset = () => { setCategory(categories[0]); setSearch(''); setSort('selection'); };

  return <div className="articles-shop">
    <section className="articles-hero" aria-labelledby="articles-title">
      <div className="articles-hero-copy">
        <p className="articles-eyebrow">Saint Loub’Ping · Collection 2026–2027</p>
        <h1 id="articles-title">Le club se porte<br /><span>aussi hors de la salle.</span></h1>
        <p className="articles-intro">Entraînement, déplacements ou quotidien : découvrez la sélection textile du club.</p>
        <a className="articles-hero-link" href="#selection-articles">Découvrir les {shopArticles.length} articles <ArrowRight size={18} aria-hidden="true" /></a>
      </div>
      <div className="articles-hero-product">
        <ProductImage article={featuredArticle} hero />
        <div className="articles-hero-caption"><span>{featuredArticle.model}</span><strong>{formatArticlePrice(articlePrice(featuredArticle))} <small>TTC</small></strong></div>
      </div>
    </section>

    <div className="articles-content" id="selection-articles">
      <div className="articles-heading"><div><p className="articles-eyebrow">La sélection du club</p><h2>À chacun sa tenue.</h2></div><p>Prix unitaires TTC · TVA 20 % incluse</p></div>
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
          <button className="articles-product-image" type="button" onClick={() => openArticle(article)} aria-label={`Voir la fiche ${article.name} ${article.model}`}><span className="articles-category-tag">{article.category}</span><ProductImage article={article} /><span className="articles-image-action">Voir la fiche <ArrowRight size={16} aria-hidden="true" /></span></button>
          <div className="articles-card-copy"><p className="articles-model">{article.model}</p><div className="articles-name-price"><h3><button type="button" onClick={() => openArticle(article)}>{article.name}</button></h3><p className="articles-price">{formatArticlePrice(articlePrice(article))}<small>TTC / pièce</small></p></div><p className="articles-card-description">{article.description}</p><div className="articles-card-footer"><span>Réf. {article.code}</span><button type="button" onClick={() => openArticle(article)}>Détails <ArrowRight size={15} aria-hidden="true" /></button></div></div>
        </article>)}</div>}

      <aside className="articles-info"><div><p className="articles-eyebrow">Avant de commander</p><h2>Une sélection pour les commandes du club.</h2></div><div><p>Cette page présente les articles. Les commandes et le paiement ne sont pas encore ouverts.</p><p>Certains tarifs sont liés à une commande groupée : le minimum fournisseur est précisé dans chaque fiche. Il s’applique à la commande globale du club.</p><p>Les photos proviennent du catalogue Majestee 2026–2027. Les coloris et marquages illustrés sont ceux du catalogue ; la personnalisation finale Saint Loub’Ping reste à définir.</p></div></aside>
    </div>

    <Dialog open={selected !== null} onOpenChange={open => { if (!open) setSelected(null); }}>
      <DialogContent className="articles-dialog">
        {selected && <div className="articles-detail-grid">
          <div className="articles-detail-visual"><ProductImage article={selected} index={imageIndex} />{selected.images.length > 1 && <div className="articles-gallery" aria-label="Vues du produit">{selected.images.map((src, index) => <button type="button" key={src} aria-pressed={imageIndex === index} onClick={() => setImageIndex(index)}>{index === 0 ? 'Face' : 'Dos'}</button>)}</div>}</div>
          <div className="articles-detail-copy"><p className="articles-eyebrow">{selected.category} · Réf. {selected.code}</p><p className="articles-detail-model">{selected.model}</p><DialogTitle className="articles-detail-title">{selected.name}</DialogTitle><DialogDescription className="articles-detail-description">{selected.description}</DialogDescription><p className="articles-detail-price">{formatArticlePrice(articlePrice(selected))}<span>TTC / pièce</span></p>
            <ul className="articles-features">{selected.features.map(feature => <li key={feature}>{feature}</li>)}</ul>
            <dl className="articles-specs"><div><dt>Coloris</dt><dd>{selected.colors}</dd></div><div><dt>Tailles enfants</dt><dd>{selected.images.length ? articleSizes.children : 'À confirmer auprès du fournisseur'}</dd></div><div><dt>Tailles adultes</dt><dd>{selected.images.length ? articleSizes.adults : 'À confirmer auprès du fournisseur'}</dd></div></dl>
            {selected.images.length > 0 && <p className="articles-small-note">Modèle homme et femme au catalogue. Autres tailles sur demande, à confirmer.</p>}
            {selected.minimum && <p className="articles-order-note">Tarif sous réserve d’une commande groupée d’au moins <strong>{selected.minimum} pièces</strong> de cet article.</p>}
            {selected.imageNote && <p className="articles-order-note">{selected.imageNote}</p>}
            <p className="articles-source">{selected.cataloguePage ? `Source : catalogue Majestee 2026–2027, page PDF ${selected.cataloguePage}. ` : ''}Prix TTC calculé sur le prix unitaire remisé HT du devis du 29 septembre 2026, avec TVA à 20 %.</p>
          </div>
        </div>}
      </DialogContent>
    </Dialog>
  </div>;
}
