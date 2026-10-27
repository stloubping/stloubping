import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

const dataSource = fs.readFileSync(new URL('../src/data/shopArticles.ts', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(dataSource, { compilerOptions: { module: ts.ModuleKind.CommonJS } });
const sandbox = { exports: {} };
vm.runInNewContext(outputText, sandbox);
const { boutiqueOrderIds, shopArticles, articlePrice, formatArticlePrice } = sandbox.exports;
const cartSource = fs.readFileSync(new URL('../src/lib/shopCart.ts', import.meta.url), 'utf8');
const cartSandbox = { exports: {}, require: () => sandbox.exports };
vm.runInNewContext(ts.transpileModule(cartSource, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText, cartSandbox);
const { createShopOrderItem, shopOrderTotal } = cartSandbox.exports;
const basket = [createShopOrderItem('maillot-officiel', 'M', 1), createShopOrderItem('maillot-noir-loup-50', 'S', 1), createShopOrderItem('survetement-noir-rouge', 'L', 1)];
assert.equal(shopOrderTotal(basket), 125);
assert.equal(shopOrderTotal([createShopOrderItem('maillot-officiel', 'XS', 2), createShopOrderItem('maillot-noir-loup-50', '4 ans', 3), createShopOrderItem('survetement-noir-rouge', 'XL', 1)]), 180);
assert.equal(shopOrderTotal(boutiqueOrderIds.map(id => createShopOrderItem(id, 'M', 10))), 1250);
assert.equal(shopOrderTotal([]), 0);
for (const args of [['bad-id', 'M', 1], ['maillot-officiel', '', 1], ['maillot-officiel', 'M', 0], ['maillot-officiel', 'M', 11], ['maillot-officiel', 'M', 1.5]]) assert.throws(() => createShopOrderItem(...args));
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
assert.ok(page.includes('productIds={productIds} onProductsChange={setProductIds}'));
assert.ok(page.includes('current.includes(id) ? current : [...current, id]'), 'Le bouton ajoute un article sans vider le panier');
const form = fs.readFileSync(new URL('../src/components/ShopPreorders.tsx', import.meta.url), 'utf8');
assert.ok(form.includes('Bon de commande boutique'));
assert.ok(form.includes('checked={selected}'));
assert.ok(form.includes('name={`items.${index}.size`}'));
assert.ok(form.includes('name={`items.${index}.quantity`}'));
assert.ok(form.includes('items,') && form.includes('from("shop_preorders").insert({'), 'Une seule insertion pour tout le panier');
assert.ok(form.includes('notes: [priceSummary, values.notes]'));
assert.ok(form.includes('fieldset disabled={isSubmitting}'));
assert.ok(form.includes('finally'));
console.log('OK : un seul bon pour 1 à 3 articles, tailles et quantités indépendantes, total 125 €, limites et ajout sans vider le panier.');
