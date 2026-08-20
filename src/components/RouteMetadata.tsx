import { useEffect } from "react";
import { useLocation } from "react-router-dom";

type Metadata = {
  title: string;
  description: string;
  image?: string;
  noIndex?: boolean;
};

const siteName = "Saint-Loub'Ping";
const siteUrl = "https://www.saintloubping.fr";
const defaultImage = `${siteUrl}/images/logo/telecharge.jpg`;

const metadataFor = (pathname: string): Metadata => {
  if (pathname === "/") return { title: "Club de tennis de table à Saint-Loubès — Saint-Loub'Ping", description: "Club de tennis de table à Saint-Loubès, près de Sainte-Eulalie, Ambarès-et-Lagrave et Carbon-Blanc. Loisirs, compétition, jeunes et inscriptions." };
  if (pathname === "/actualites") return { title: "Actualités du club — Saint-Loub'Ping", description: "Les dernières actualités, événements, stages et résultats du club de tennis de table Saint-Loub'Ping à Saint-Loubès." };
  if (pathname === "/le-club") return { title: "Le club — Saint-Loub'Ping à Saint-Loubès", description: "Découvrez l'histoire, les valeurs, les installations et l'équipe du club de tennis de table Saint-Loub'Ping." };
  if (pathname === "/adhesions") return { title: "Adhésions et tarifs — Saint-Loub'Ping", description: "Inscrivez-vous au club Saint-Loub'Ping : tarifs, horaires, planning des entraînements et documents d'adhésion à Saint-Loubès." };
  if (pathname === "/essai-gratuit") return { title: "Séance d'essai gratuite — Saint-Loub'Ping", description: "Réservez une séance d'essai gratuite de tennis de table pour enfant, adolescent ou adulte à Saint-Loubès." };
  if (pathname === "/competitions-equipes") return { title: "Équipes et compétitions — Saint-Loub'Ping", description: "Retrouvez les équipes, compétitions et résultats du club de tennis de table Saint-Loub'Ping." };
  if (pathname === "/competitions-equipes/calendrier") return { title: "Calendrier des compétitions — Saint-Loub'Ping", description: "Consultez et filtrez toutes les dates des compétitions de tennis de table de la saison 2026-2027 du Saint-Loub'Ping." };
  if (pathname === "/stage-aout") return { title: "Stage ao\u00fbt - Saint-Loub'Ping", description: "Inscriptions et journees de presence au stage d'ao\u00fbt de Saint-Loub'Ping." };
  if (pathname.startsWith("/classement-joueurs")) return { title: "Classement des joueurs — Saint-Loub'Ping", description: "Consultez le classement, les points FFTT et la progression des joueurs du club Saint-Loub'Ping à Saint-Loubès." };
  if (pathname === "/boutique" || pathname.startsWith("/boutique/")) return { title: "Boutique du club — Saint-Loub'Ping", description: "Découvrez la boutique Saint-Loub'Ping et précommandez les maillots et matériels de tennis de table du club." };
  if (pathname.startsWith("/videos/")) return { title: "Vidéos de tennis de table — Saint-Loub'Ping", description: "Retrouvez les vidéos WTT, tutoriels, reportages et légendes du tennis de table sélectionnés par Saint-Loub'Ping." };
  if (pathname === "/partenaires") return { title: "Partenaires — Saint-Loub'Ping", description: "Découvrez les partenaires qui soutiennent le club de tennis de table Saint-Loub'Ping à Saint-Loubès." };
  if (pathname === "/contact") return { title: "Contact — Saint-Loub'Ping", description: "Contactez le club de tennis de table Saint-Loub'Ping à Saint-Loubès pour toute question sur les entraînements et les adhésions." };
  if (pathname === "/equipe-1") return { title: "Espace Équipe 1 — Saint-Loub'Ping", description: "Espace privé de gestion sportive de l’Équipe 1 de Saint-Loub'Ping.", noIndex: true };
  if (pathname.startsWith("/administration")) return { title: "Gestion du club — Saint-Loub'Ping", description: "Espace privé de gestion du club Saint-Loub'Ping.", noIndex: true };
  return { title: `${siteName} — Club de tennis de table à Saint-Loubès`, description: "Saint-Loub'Ping, club de tennis de table à Saint-Loubès en Gironde." };
};

const setMeta = (selector: string, attributes: Record<string, string>, content: string) => {
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement("meta");
    Object.entries(attributes).forEach(([key, value]) => element!.setAttribute(key, value));
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
};

export default function RouteMetadata() {
  const { pathname } = useLocation();

  useEffect(() => {
    const metadata = metadataFor(pathname);
    const canonicalUrl = `${siteUrl}${pathname === "/" ? "/" : pathname}`;
    document.title = metadata.title;
    setMeta('meta[name="description"]', { name: "description" }, metadata.description);
    setMeta('meta[name="robots"]', { name: "robots" }, metadata.noIndex ? "noindex,nofollow" : "index,follow,max-image-preview:large");
    setMeta('meta[property="og:title"]', { property: "og:title" }, metadata.title);
    setMeta('meta[property="og:description"]', { property: "og:description" }, metadata.description);
    setMeta('meta[property="og:url"]', { property: "og:url" }, canonicalUrl);
    setMeta('meta[property="og:image"]', { property: "og:image" }, metadata.image ?? defaultImage);
    setMeta('meta[name="twitter:title"]', { name: "twitter:title" }, metadata.title);
    setMeta('meta[name="twitter:description"]', { name: "twitter:description" }, metadata.description);
    setMeta('meta[name="twitter:image"]', { name: "twitter:image" }, metadata.image ?? defaultImage);
    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;
  }, [pathname]);

  return null;
}
