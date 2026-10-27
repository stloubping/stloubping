import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

const source = fs.readFileSync(new URL('../src/data/shopArticles.ts', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } });
const sandbox = { exports: {} };
vm.runInNewContext(outputText, sandbox);
const { shopArticles, articlePrice } = sandbox.exports;
for (const [id, price] of [['maillot-noir-loup-50', 10], ['survetement-noir-rouge', 80], ['maillot-officiel', 35], ['survetement-officiel', 80]]) {
  const article = shopArticles.find(item => item.id === id);
  assert.ok(article, id);
  assert.equal(articlePrice(article), price, `Prix TTC exact : ${id}`);
  for (const image of article.images) assert.ok(fs.existsSync(new URL(`../public${image}`, import.meta.url)), image);
}
assert.equal(articlePrice(shopArticles.find(item => item.id === 'dynamic-veste')), 25);
assert.equal(new Set(shopArticles.map(item => item.id)).size, shopArticles.length);
assert.equal(shopArticles.find(item => item.id === 'survetement-noir-rouge').priceUnit, 'ensemble');
console.log('OK : nouveaux articles à 10 € et 80 €, images présentes, anciens prix et majoration Majestee conservés.');
