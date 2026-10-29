import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { clubAddress, clubStructuredData, directionsFrom, localFaqs, localHeading, localIntro, localMetadata, localPagePath, localTownGuides, localTrainingProfiles } from "../src/data/localSeo.mjs";

const dist = join(process.cwd(), "dist");
const siteUrl = "https://www.saintloubping.fr";
const imageUrl = `${siteUrl}/images/logo/telecharge.jpg`;
const pages = [
  { path: "/", ...localMetadata["/"], heading: "Saint-Loub’Ping, club de tennis de table à Saint-Loubès", text: localIntro },
  { path: "/actualites", title: "Actualités du club — Saint-Loub'Ping", description: "Les dernières actualités, événements, stages et résultats du club de tennis de table Saint-Loub'Ping à Saint-Loubès.", heading: "Actualités du club", text: "Retrouvez les nouvelles du club, les événements, les stages, les résultats et les rendez-vous de Saint-Loub'Ping." },
  { path: "/le-club", title: "Le club — Saint-Loub'Ping à Saint-Loubès", description: "Découvrez l'histoire, les valeurs, les installations et l'équipe du club de tennis de table Saint-Loub'Ping.", heading: "Le club Saint-Loub'Ping", text: "Un club de tennis de table ouvert aux jeunes, aux adultes, aux débutants et aux compétiteurs à Saint-Loubès." },
  { path: "/adhesions", title: "Adhésions et tarifs — Saint-Loub'Ping", description: "Inscrivez-vous au club Saint-Loub'Ping : tarifs, horaires, planning des entraînements et documents d'adhésion à Saint-Loubès.", heading: "Adhésions, tarifs et entraînements", text: "Découvrez les formules d'adhésion, le planning des entraînements et les documents nécessaires pour rejoindre le club." },
  { path: "/essai-gratuit", title: "Séance d'essai gratuite — Saint-Loub'Ping", description: "Réservez une séance d'essai gratuite de tennis de table pour enfant, adolescent ou adulte à Saint-Loubès.", heading: "Réserver une séance d'essai gratuite", text: "Venez découvrir le tennis de table et l'ambiance de Saint-Loub'Ping lors d'une séance adaptée à votre âge et votre niveau." },
  { path: "/competitions-equipes", title: "Équipes et compétitions — Saint-Loub'Ping", description: "Retrouvez les équipes, compétitions et résultats du club de tennis de table Saint-Loub'Ping.", heading: "Équipes et compétitions", text: "Suivez les équipes du club, les compétitions et les résultats de Saint-Loub'Ping." },
  { path: "/competitions-equipes/calendrier", title: "Calendrier des compétitions — Saint-Loub'Ping", description: "Toutes les dates des compétitions de tennis de table de la saison 2026-2027 du Saint-Loub'Ping.", heading: "Calendrier des compétitions 2026-2027", text: "Recherchez et filtrez les compétitions de la saison, puis ajoutez les dates à votre agenda." },
  { path: "/stage-aout", title: "Stage ao\u00fbt - Saint-Loub'Ping", description: "Inscrivez-vous au stage d'ao\u00fbt de Saint-Loub'Ping et selectionnez vos journees de presence.", heading: "Stage ao\u00fbt", text: "Inscription des joueurs du lundi au vendredi." },
  { path: "/classement-joueurs", title: "Classement des joueurs — Saint-Loub'Ping", description: "Consultez le classement, les points FFTT et la progression des joueurs du club Saint-Loub'Ping à Saint-Loubès.", heading: "Classement des joueurs", text: "Consultez l'effectif du club, les points FFTT, les classements et les progressions des joueurs." },
  { path: "/boutique", title: "Boutique du club — Saint-Loub'Ping", description: "Découvrez la boutique Saint-Loub'Ping et précommandez les maillots et matériels de tennis de table du club.", heading: "Boutique Saint-Loub'Ping", text: "Précommandez les maillots et le matériel de tennis de table aux couleurs du club." },
  { path: "/partenaires", title: "Partenaires — Saint-Loub'Ping", description: "Découvrez les partenaires qui soutiennent le club de tennis de table Saint-Loub'Ping à Saint-Loubès.", heading: "Les partenaires du club", text: "Merci aux entreprises et partenaires qui accompagnent le développement de Saint-Loub'Ping." },
  { path: "/contact", title: "Contact — Saint-Loub'Ping", description: "Contactez le club de tennis de table Saint-Loub'Ping à Saint-Loubès pour toute question sur les entraînements et les adhésions.", heading: "Contacter Saint-Loub'Ping", text: "Une question sur les entraînements, les adhésions ou les compétitions ? Contactez le club de tennis de table à Saint-Loubès." },
  { path: localPagePath, ...localMetadata[localPagePath], heading: localHeading, text: localIntro },
  { path: "/horaires", ...localMetadata["/horaires"], heading: "Horaires des entraînements à Saint-Loubès", text: "Consultez le planning des entraînements pour les enfants, les adolescents et les adultes, en loisir et en compétition." },
].map((page) => ({ ...page, ...localMetadata[page.path] }));

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
  output = replaceTag(output, /<script id="club-structured-data" type="application\/ld\+json">[\s\S]*?<\/script>/, `<script id="club-structured-data" type="application/ld+json">${JSON.stringify(clubStructuredData).replaceAll('<', '\\u003c')}</script>`);
  return output;
};
const publicContent = {
  "/": `<section><h2>Actualités récentes</h2><ul><li><a href="/actualites">Stages et entraînements du club</a></li><li><a href="/actualites">Résultats et vie des équipes</a></li><li><a href="/adhesions">Horaires et inscriptions 2026-2027</a></li></ul><h2>Un club de tennis de table près de chez vous</h2><p>${escapeHtml(localIntro)}</p><p><a href="${localPagePath}">Le club, l’accès et le ping dans les Rives de la Laurence</a></p><a href="/essai-gratuit">Réserver une séance d’essai</a></section>`,
  [localPagePath]: `<section><h2>Votre itinéraire jusqu’à la salle</h2><p>Une seule salle à Saint-Loubès : les groupes accueillent les habitants de toutes les communes voisines.</p><address>${escapeHtml(clubAddress)} — <a href="tel:+33688466859">06 88 46 68 59</a></address><ul>${localTownGuides.map(guide => `<li><a href="#${guide.id}">${escapeHtml(guide.town)}</a></li>`).join('')}</ul></section><section><h2>Depuis votre commune, jusqu’à la table</h2>${localTownGuides.map(guide => `<article id="${guide.id}"><h3>${escapeHtml(guide.heading)}</h3><p>${escapeHtml(guide.text)}</p><p>${escapeHtml(guide.tip)}</p><a href="${escapeHtml(directionsFrom(guide.town))}">Itinéraire depuis ${escapeHtml(guide.town)}</a> · <a href="#creneaux-par-profil">Choisir mon créneau</a></article>`).join('')}</section><section id="creneaux-par-profil"><h2>Trouvez votre créneau</h2><p>Planning habituel de la saison 2026–2027, commun à tous les habitants. Le club confirme le groupe adapté à votre âge et à votre niveau. Vérifiez les séances pendant les vacances scolaires, les jours fériés et les événements.</p>${localTrainingProfiles.map(profile => `<article><h3>${escapeHtml(profile.title)}</h3><p>${escapeHtml(profile.description)}</p><ul>${profile.slots.map(slot => `<li>${escapeHtml(slot.day)} · ${escapeHtml(slot.label)} : ${escapeHtml(slot.time)}</li>`).join('')}</ul></article>`).join('')}<a href="/horaires">Consulter le planning hebdomadaire complet</a></section><section><h2>Envie d’essayer le ping-pong ?</h2><p>Enfant, adolescent ou adulte : indiquez votre âge, votre niveau et vos disponibilités pour être orienté vers une séance à Saint-Loubès.</p><p><a href="/essai-gratuit">Demander mon essai gratuit</a> · <a href="/adhesions">Tarifs et documents d’adhésion</a> · <a href="/competitions-equipes">Nos équipes</a> · <a href="/contact">Contacter le club</a></p><h2>Avant votre première séance</h2>${localFaqs.map(({ question, answer }) => `<h3>${escapeHtml(question)}</h3><p>${escapeHtml(answer)}</p>`).join('')}</section>`,
  "/contact": `<section><h2>Adresse de la salle de tennis de table</h2><address>${escapeHtml(clubAddress)}</address><p><a href="tel:+33688466859">06 88 46 68 59</a> · <a href="mailto:saintloubping@laposte.net">saintloubping@laposte.net</a></p><p><a href="${localPagePath}">Préparer votre venue depuis les Rives de la Laurence</a></p></section>`,
  "/actualites": `<section><h2>Les dernieres nouvelles</h2><p>Stages, resultats, evenements et informations pratiques du club.</p><ul><li>Stages jeunes et adultes</li><li>Calendrier des competitions</li><li>Vie du club et partenaires</li></ul></section>`,
  "/adhesions": `<section><h2>Horaires et tarifs</h2><p>Decouvrez les creneaux jeunes, adultes loisir et competition, puis envoyez votre demande d adhesion.</p></section>`,
  "/classement-joueurs": `<section><h2>Effectif et progression FFTT</h2><p>Le classement, les points et la progression mensuelle des joueurs sont mis a jour depuis les donnees officielles.</p></section>`,
};
const shell = (html, page) => {
  const intro = page.path === "/" ? "Pratiquez le tennis de table à Saint-Loubès, à tout âge, en loisir ou en compétition, dans un club ouvert aux habitants des Rives de la Laurence." : page.text;
  const content = `<main data-prerendered="true"><h1>${escapeHtml(page.heading)}</h1><p>${escapeHtml(intro)}</p>${publicContent[page.path] ?? ""}<p>Saint-Loub'Ping — tennis de table à Saint-Loubès, Gironde (33).</p></main>`;
  return metadata(html, page).replace('<div id="root"></div>', `<div id="root">${content}</div>`);
};

const template = await readFile(join(dist, "index.html"), "utf8");
for (const page of pages) {
  const target = page.path === "/" ? join(dist, "index.html") : join(dist, page.path.slice(1), "index.html");
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, shell(template, page), "utf8");
}
console.log(`Pré-rendu SEO de ${pages.length} pages publiques.`);
