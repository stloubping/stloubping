import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { clubStructuredData, directionsFrom, localFaqs, localMetadata, localPagePath, localTowns } from '../src/data/localSeo.mjs';

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');
const html = await read(`dist${localPagePath}/index.html`);
const home = await read('dist/index.html');
const sitemap = await read('dist/sitemap.xml');
const schemaMatch = /<script id="club-structured-data" type="application\/ld\+json">([\s\S]*?)<\/script>/;
assert.deepEqual(JSON.parse(html.match(schemaMatch)[1]), clubStructuredData);
assert.deepEqual(JSON.parse(home.match(schemaMatch)[1]).areaServed.map((town) => town.name), localTowns);
assert.equal(localTowns.length, 6);
for (const town of localTowns) {
  assert.ok(html.includes(town), `Commune manquante : ${town}`);
  assert.ok(home.includes(town), `Commune absente de l’accueil : ${town}`);
  const itinerary = new URL(directionsFrom(town));
  assert.equal(itinerary.searchParams.get('origin'), `${town}, Gironde, France`);
  assert.match(itinerary.searchParams.get('destination'), /33450 Saint-Loubès/);
}
for (const faq of localFaqs) assert.ok(html.includes(faq.question));
for (const path of ['/essai-gratuit', '/horaires', '/adhesions', '/contact']) assert.ok(html.includes(`href="${path}"`));
assert.equal((html.match(/<h1>/g) ?? []).length, 1);
assert.ok(html.includes(`<link rel="canonical" href="https://www.saintloubping.fr${localPagePath}" />`));
assert.ok(html.includes('<meta name="robots" content="index,follow,max-image-preview:large"'));
assert.ok(sitemap.includes(`https://www.saintloubping.fr${localPagePath}`));
for (const [path, metadata] of Object.entries(localMetadata)) {
  const page = await read(path === '/' ? 'dist/index.html' : `dist${path}/index.html`);
  assert.ok(page.includes(metadata.title), `Titre incohérent pour ${path}`);
  assert.ok(page.includes(metadata.description), `Description incohérente pour ${path}`);
}
assert.ok((await read('src/components/Footer.tsx')).includes(localPagePath));
assert.ok((await read('src/App.tsx')).includes(`path="${localPagePath}"`));
console.log('OK : six communes, itinéraires, métadonnées partagées, canonicals, JSON-LD, FAQ, sitemap et maillage interne.');
