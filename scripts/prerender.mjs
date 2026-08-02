import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

const dist = join(process.cwd(), "dist");
const siteUrl = "https://www.saintloubping.fr";
const imageUrl = `${siteUrl}/images/logo/telecharge.jpg`;
const pages = [
  { path: "/", title: "Saint-Loub'Ping Ã¢â‚¬â€ Club de tennis de table Ã  Saint-LoubÃ¨s (33)", description: "Saint-Loub'Ping, le club de tennis de table Ã  Saint-LoubÃ¨s en Gironde. EntraÃ®nements, compÃ©tition, loisir, jeunes, actualitÃ©s et inscriptions.", heading: "Saint-Loub'Ping, club de tennis de table Ã  Saint-LoubÃ¨s", text: "Pratiquez le tennis de table Ã  tout Ã¢ge, en loisir ou en compÃ©tition, dans un club convivial en Gironde." },
  { path: "/actualites", title: "ActualitÃ©s du club Ã¢â‚¬â€ Saint-Loub'Ping", description: "Les derniÃ¨res actualitÃ©s, Ã©vÃ©nements, stages et rÃ©sultats du club de tennis de table Saint-Loub'Ping Ã  Saint-LoubÃ¨s.", heading: "ActualitÃ©s du club", text: "Retrouvez les nouvelles du club, les Ã©vÃ©nements, les stages, les rÃ©sultats et les rendez-vous de Saint-Loub'Ping." },
  { path: "/le-club", title: "Le club Ã¢â‚¬â€ Saint-Loub'Ping Ã  Saint-LoubÃ¨s", description: "DÃ©couvrez l'histoire, les valeurs, les installations et l'Ã©quipe du club de tennis de table Saint-Loub'Ping.", heading: "Le club Saint-Loub'Ping", text: "Un club de tennis de table ouvert aux jeunes, aux adultes, aux dÃ©butants et aux compÃ©titeurs Ã  Saint-LoubÃ¨s." },
  { path: "/adhesions", title: "AdhÃ©sions et tarifs Ã¢â‚¬â€ Saint-Loub'Ping", description: "Inscrivez-vous au club Saint-Loub'Ping : tarifs, horaires, planning des entraÃ®nements et documents d'adhÃ©sion Ã  Saint-LoubÃ¨s.", heading: "AdhÃ©sions, tarifs et entraÃ®nements", text: "DÃ©couvrez les formules d'adhÃ©sion, le planning des entraÃ®nements et les documents nÃ©cessaires pour rejoindre le club." },
  { path: "/essai-gratuit", title: "SÃ©ance d'essai gratuite Ã¢â‚¬â€ Saint-Loub'Ping", description: "RÃ©servez une sÃ©ance d'essai gratuite de tennis de table pour enfant, adolescent ou adulte Ã  Saint-LoubÃ¨s.", heading: "RÃ©server une sÃ©ance d'essai gratuite", text: "Venez dÃ©couvrir le tennis de table et l'ambiance de Saint-Loub'Ping lors d'une sÃ©ance adaptÃ©e Ã  votre Ã¢ge et votre niveau." },
  { path: "/competitions-equipes", title: "Ã‰quipes et compÃ©titions Ã¢â‚¬â€ Saint-Loub'Ping", description: "Retrouvez les Ã©quipes, compÃ©titions et rÃ©sultats du club de tennis de table Saint-Loub'Ping.", heading: "Ã‰quipes et compÃ©titions", text: "Suivez les Ã©quipes du club, les compÃ©titions et les rÃ©sultats de Saint-Loub'Ping." },
  { path: "/competitions-equipes/calendrier", title: "Calendrier des compétitions — Saint-Loub'Ping", description: "Toutes les dates des compétitions de tennis de table de la saison 2026-2027 du Saint-Loub'Ping.", heading: "Calendrier des compétitions 2026-2027", text: "Recherchez et filtrez les compétitions de la saison, puis ajoutez les dates à votre agenda." },
  { path: "/classement-joueurs", title: "Classement des joueurs Ã¢â‚¬â€ Saint-Loub'Ping", description: "Consultez le classement, les points FFTT et la progression des joueurs du club Saint-Loub'Ping Ã  Saint-LoubÃ¨s.", heading: "Classement des joueurs", text: "Consultez l'effectif du club, les points FFTT, les classements et les progressions des joueurs." },
  { path: "/boutique", title: "Boutique du club Ã¢â‚¬â€ Saint-Loub'Ping", description: "DÃ©couvrez la boutique Saint-Loub'Ping et prÃ©commandez les maillots et matÃ©riels de tennis de table du club.", heading: "Boutique Saint-Loub'Ping", text: "PrÃ©commandez les maillots et le matÃ©riel de tennis de table aux couleurs du club." },
  { path: "/partenaires", title: "Partenaires Ã¢â‚¬â€ Saint-Loub'Ping", description: "DÃ©couvrez les partenaires qui soutiennent le club de tennis de table Saint-Loub'Ping Ã  Saint-LoubÃ¨s.", heading: "Les partenaires du club", text: "Merci aux entreprises et partenaires qui accompagnent le dÃ©veloppement de Saint-Loub'Ping." },
  { path: "/contact", title: "Contact Ã¢â‚¬â€ Saint-Loub'Ping", description: "Contactez le club de tennis de table Saint-Loub'Ping Ã  Saint-LoubÃ¨s pour toute question sur les entraÃ®nements et les adhÃ©sions.", heading: "Contacter Saint-Loub'Ping", text: "Une question sur les entraÃ®nements, les adhÃ©sions ou les compÃ©titions ? Contactez le club de tennis de table Ã  Saint-LoubÃ¨s." },
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
  const content = `<main data-prerendered="true"><h1>${escapeHtml(page.heading)}</h1><p>${escapeHtml(page.text)}</p>${publicContent[page.path] ?? ""}<p>Saint-Loub'Ping Ã¢â‚¬â€ tennis de table Ã  Saint-LoubÃ¨s, Gironde (33).</p></main>`;
  return metadata(html, page).replace('<div id="root"></div>', `<div id="root">${content}</div>`);
};

const template = await readFile(join(dist, "index.html"), "utf8");
for (const page of pages) {
  const target = page.path === "/" ? join(dist, "index.html") : join(dist, page.path.slice(1), "index.html");
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, shell(template, page), "utf8");
}
console.log(`PrÃ©-rendu SEO de ${pages.length} pages publiques.`);
