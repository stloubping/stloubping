import { articlePrice, boutiqueOrderIds, shopArticles } from '@/data/shopArticles';

export type ShopOrderItem = {
  product_id: string;
  product_name: string;
  size: string;
  quantity: number;
  unit_price_cents: number;
};
export const shopOrderProducts = boutiqueOrderIds.map(id => shopArticles.find(article => article.id === id)!);
export const shopOrderSizes = ['2 ans', '4 ans', '6 ans', '8 ans', '10 ans', '12 ans', '14 ans', 'XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL', '6XL', '7XL', '8XL', '9XL', '10XL'];
export const shopOrderTotal = (items: ShopOrderItem[]) => items.reduce((total, item) => total + item.unit_price_cents * item.quantity, 0) / 100;
export function createShopOrderItem(productId: string, size: string, quantity: number): ShopOrderItem {
  const product = shopOrderProducts.find(item => item.id === productId);
  if (!product || !shopOrderSizes.includes(size) || !Number.isInteger(quantity) || quantity < 1 || quantity > 10) throw new Error('Article, taille ou quantité invalide.');
  return { product_id: productId, product_name: product.id === 'maillot-officiel' ? 'Maillot Officiel du Club' : product.name, size, quantity, unit_price_cents: Math.round(articlePrice(product)! * 100) };
}
