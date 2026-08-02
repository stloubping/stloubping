import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

const dist = join(process.cwd(), "dist");
const siteUrl = "https://www.saintloubping.fr";
const imageUrl = `${siteUrl}/images/logo/telecharge.jpg`;
const pages = [
  { path: "/", title: "Saint-Loub'Ping — Club de tennis de table à Saint-Loubès (33)", description: "Saint-Loub'Ping, le club de tennis de table à Saint-Loubès en Gironde. Entraînements, compétition, loisir, jeunes, actualités et inscriptions.", heading: "Saint-Loub'Ping, club de tennis de table à Saint-Loubès", text: "Pratiquez le tennis de table à tout âge, en loisir ou en compétition, dans un club convivial en Gironde." },
  { path: "/actualites", title: "Actualités du club — Saint-Loub'Ping", description: "Les dernières actualités, événements, stages et résultats du club de tennis de table Saint-Loub'Ping à Saint-Loubès.", heading: "Actualités du club", text: "Retrouvez les nouvelles du club, les événements, les stages, les résultats et les rendez-vous de Saint-Loub'Ping." },
  { path: "/le-club", title: "Le club — Saint-Loub'Ping à Saint-Loubès", description: "Découvrez l'histoire, les valeurs, les installations et l'équipe du club de tennis de table Saint-Loub'Ping.", heading: "Le club Saint-Loub'Ping", text: "Un club de tennis de table ouvert aux jeunes, aux adultes, aux débutants et aux compétiteurs à Saint-Loubès." },
  { path: "/adhesions", title: "Adhésions et tarifs — Saint-Loub'Ping", description: "Inscrivez-vous au club Saint-Loub'Ping : tarifs, horaires, planning des entraînements et documents d'adhésion à Saint-Loubès.", heading: "Adhésions, tarifs et entraînements", text: "Découvrez les formules d'adhésion, le planning des entraînements et les documents nécessaires pour rejoindre le club." },
  { path: "/essai-gratuit", title: "Séance d'essai gratuite — Saint-Loub'Ping", description: "Réservez une séance d'essai gratuite de tennis de table pour enfant, adolescent ou adulte à Saint-Loubès.", heading: "Réserver une séance d'essai gratuite", text: "Venez découvrir le tennis de table et l'ambiance de Saint-Loub'Ping lors d'une séance adaptée à votre âge et votre niveau." },
  { path: "/competitions-equipes", title: "Équipes et compétitions — Saint-Loub'Ping", description: "Retrouvez les équipes, compétitions et résultats du club de tennis de table Saint-Loub'Ping.", heading: "Équipes et compétitions", text: "Suivez les équipes du club, les compétitions et les résultats de Saint-Loub'Ping." },
  { path: "/competitions-equipes/calendrier", title: "Calendrier des compétitions — Saint-Loub'Ping", description: "Toutes les dates des compétitions de tennis de table de la saison 2026-2027 du Saint-Loub'Ping.", heading: "Calendrier des compétitions 2026-2027", text: "Recherchez et filtrez les compétitions de la saison, puis ajoutez les dates à votre agenda." },
  { path: "/classement-joueurs", title: "Classement des joueurs — Saint-Loub'Ping", description: "Consultez le classement, les points FFTT et la progression des joueurs du club Saint-Loub'Ping à Saint-Loubès.", heading: "Classement des joueurs", text: "Consultez l'effectif du club, les points FFTT, les classements et les progressions des joueurs." },
  { path: "/boutique", title: "Boutique du club — Saint-Loub'Ping", description: "Découvrez la boutique Saint-Loub'Ping et précommandez les maillots et matériels de tennis de table du club.", heading: "Boutique Saint-Loub'Ping", text: "Précommandez les maillots et le matériel de tennis de table aux couleurs du club." },
  { path: "/partenaires", title: "Partenaires — Saint-Loub'Ping", description: "Découvrez les partenaires qui soutiennent le club de tennis de table Saint-Loub'Ping à Saint-Loubès.", heading: "Les partenaires du club", text: "Merci aux entreprises et partenaires qui accompagnent le développement de Saint-Loub'Ping." },
  { path: "/contact", title: "Contact — Saint-Loub'Ping", description: "Contactez le club de tennis de table Saint-Loub'Ping à Saint-Loubès pour toute question sur les entraînements et les adhésions.", heading: "Contacter Saint-Loub'Ping", text: "Une question sur les entraînements, les adhésions ou les compétitions ? Contactez le club de tennis de table à Saint-Loubès." },
];

const escapeHtml = (value) => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
const replaceTag = (html, pattern, replacement) => html.replace(pattern, replacement);
const metadata = (html, page) => {
  const canonical = `${siteUrl}${page.path === "/" ? "/" : page.path}`;
  let output = html.replace(/<html lang="[^"]*">/, '<html lang="fr">');
  output = replaceTag(output, /<title>.*?<\/title>/, `<title>${escapeHtml(page.title)}</title>`);
  output = replaceTag(output, /<meta name="description" content="[^"]*"\s*\/>/, `<meta name="description" content="${escapeHtml(page.description)}" />`);
  output = replaceTag(output, /<link rel="canonical" href="[^"]*"\s*\/>/, `<link rel="canonical" href="${canonical}" />`);
  output = replaceTag(output, /<meta property="og:title" content="[^"]*"\s*\/>/, `<meta property="og:title" content="${escapeHtml(page.title)}" />`);
  output = replaceTag(output, /<meta property="og:description" content="[^"]*"\s*\/>/, `<meta property="og:description" content="${escapeHtml(page.description)}" />`);
  output = replaceTag(output, /<meta property="og:url" content="[^"]*"\s*\/>/, `<meta property="og:url" content="${canonical}" />`);
  output = replaceTag(output, /<meta property="og:image" content="[^"]*"\s*\/>/, `<meta property="og:image" content="${imageUrl}" />`);
  output = replaceTag(output, /<meta name="twitter:title" content="[^"]*"\s*\/>/, `<meta name="twitter:title" content="${escapeHtml(page.title)}" />`);
  output = replaceTag(output, /<meta name="twitter:description" content="[^"]*"\s*\/>/, `<meta name="twitter:description" content="${escapeHtml(page.description)}" />`);
  output = replaceTag(output, /<meta name="twitter:image" content="[^"]*"\s*\/>/, `<meta name="twitter:image" content="${imageUrl}" />`);
  return output;
};
const publicContent = {
  "/": `<section><h2>Actualites recentes</h2><ul><li><a href="/actualites">Stages et entrainements du club</a></li><li><a href="/actualites">Resultats et vie des equipes</a></li><li><a href="/adhesions">Horaires et inscriptions 2026-2027</a></li></ul></section>`,
  "/actualites": `<section><h2>Les dernieres nouvelles</h2><p>Stages, resultats, evenements et informations pratiques du club.</p><ul><li>Stages jeunes et adultes</li><li>Calendrier des competitions</li><li>Vie du club et partenaires</li></ul></section>`,
  "/adhesions": `<section><h2>Horaires et tarifs</h2><p>Decouvrez les creneaux jeunes, adultes loisir et competition, puis envoyez votre demande d adhesion.</p></section>`,
  "/classement-joueurs": `<section><h2>Effectif et progression FFTT</h2><p>Le classement, les points et la progression mensuelle des joueurs sont mis a jour depuis les donnees officielles.</p></section>`,
};
const shell = (html, page) => {
  const content = `<main data-prerendered="true"><h1>${escapeHtml(page.heading)}</h1><p>${escapeHtml(page.text)}</p>${publicContent[page.path] ?? ""}<p>Saint-Loub'Ping — tennis de table à Saint-Loubès, Gironde (33).</p></main>`;
  return metadata(html, page).replace('<div id="root"></div>', `<div id="root">${content}</div>`);
};

const template = await readFile(join(dist, "index.html"), "utf8");
for (const page of pages) {
  const target = page.path === "/" ? join(dist, "index.html") : join(dist, page.path.slice(1), "index.html");
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, shell(template, page), "utf8");
}
console.log(`Pré-rendu SEO de ${pages.length} pages publiques.`);
