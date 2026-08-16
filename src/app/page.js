import { supabase } from '@/lib/supabase';
import Hero from '@/components/home/Hero';
import TrustBadges from '@/components/home/TrustBadges';
import CategoryGrid from '@/components/home/CategoryGrid';
import Bestsellers from '@/components/home/Bestsellers';

export const revalidate = 60; // Revalidate every 60 seconds

export default async function Home() {
  // Fetch site settings
  const { data: settings } = await supabase
    .from('site_settings')
    .select('*')
    .eq('id', 1)
    .single();

  // Fetch categories
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name_en, name_ar, slug, image_url')
    .order('sort_order', { ascending: true });

  // Fetch bestsellers
  const { data: products } = await supabase
    .from('products')
    .select(`
      id, name_en, name_ar, slug, image_url, base_price, sale_price, stock_quantity, type,
      product_variants (price, sale_price, stock_quantity)
    `)
    .eq('is_bestseller', true)
    .eq('is_active', true)
    .limit(8);

  return (
    <main>
      <Hero settings={settings} />
      <TrustBadges />
      <CategoryGrid categories={categories} />
      <Bestsellers products={products} />
    </main>
  );
}
