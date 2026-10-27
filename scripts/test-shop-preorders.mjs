import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

const dataSource = fs.readFileSync(new URL('../src/data/shopArticles.ts', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(dataSource, { compilerOptions: { module: ts.ModuleKind.CommonJS } });
const sandbox = { exports: {} };
vm.runInNewContext(outputText, sandbox);
const { boutiqueOrderIds, shopArticles, articlePrice, formatArticlePrice } = sandbox.exports;
assert.equal(boutiqueOrderIds.length, 3);
for (const [id, expected] of [['maillot-officiel', 35], ['maillot-noir-loup-50', 10], ['survetement-noir-rouge', 80]]) {
  assert.ok(boutiqueOrderIds.includes(id));
  const article = shopArticles.find(item => item.id === id);
  const price = articlePrice(article);
  assert.equal(price, expected);
  for (const quantity of [1, 2, 10]) {
    assert.equal(price * quantity, expected * quantity);
    const summary = `Tarif indicatif : ${formatArticlePrice(price)} TTC × ${quantity} = ${formatArticlePrice(price * quantity)} TTC.`;
    assert.ok(summary.length + 401 <= 500, 'Le récapitulatif et une remarque de 400 caractères tiennent dans la colonne notes');
  }
}
const page = fs.readFileSync(new URL('../src/pages/Boutique.tsx', import.meta.url), 'utf8');
assert.ok(!page.includes('/boutique/materiels'), 'Pas de redirection Matériels');
assert.ok(page.includes('onClick={() => selectProduct(article.id)}'));
assert.ok(page.includes("selectProduct('maillot-officiel')"));
assert.ok(page.includes('productId={productId} onProductChange={setProductId}'));
const form = fs.readFileSync(new URL('../src/components/ShopPreorders.tsx', import.meta.url), 'utf8');
assert.ok(form.includes('Bon de commande boutique'));
assert.ok(form.includes('value={productId}'));
assert.ok(form.includes('product.name'));
assert.ok(form.includes('notes: [priceSummary, values.notes]'));
assert.ok(form.includes('fieldset disabled={isSubmitting}'));
assert.ok(form.includes('finally'));
console.log('OK : choix des 3 articles, tarifs et quantités, récapitulatif enregistré, aucune redirection Matériels.');
