import { Suspense } from 'react';
import { supabase } from '@/lib/supabase';
import ShopClient from '@/components/shop/ShopClient';

export const revalidate = 60;

export default async function ShopPage() {
  // Fetch active products
  const { data: products } = await supabase
    .from('products')
    .select(`
      id, name_en, name_ar, slug, image_url, base_price, sale_price, stock_quantity, type,
      is_bestseller, created_at, category_id,
      categories (slug),
      product_variants (price, sale_price, stock_quantity)
    `)
    .eq('is_active', true);

  // Fetch categories
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name_en, name_ar, slug')
    .order('sort_order', { ascending: true });

  return (
    <main>
      <Suspense fallback={<div className="container" style={{ paddingTop: 'var(--space-16)', paddingBottom: 'var(--space-16)', textAlign: 'center', color: 'var(--color-text-secondary)' }}>Loading collection...</div>}>
        <ShopClient initialProducts={products || []} categories={categories || []} />
      </Suspense>
    </main>
  );
}
