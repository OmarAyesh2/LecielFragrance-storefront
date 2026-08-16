import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import ProductClient from '@/components/product/ProductClient';

export const revalidate = 60;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const { data: product } = await supabase
    .from('products')
    .select('name_en, name_ar, description_en')
    .eq('slug', slug)
    .single();

  if (!product) return { title: 'Product Not Found' };

  return {
    title: `${product.name_en} | Leciel Fragrance`,
    description: product.description_en?.substring(0, 160) + '...',
  };
}

export default async function ProductPage({ params }) {
  const { slug } = await params;

  // 1. Fetch main product
  const { data: product, error: productError } = await supabase
    .from('products')
    .select(`
      *,
      categories (name_en, name_ar, slug)
    `)
    .eq('slug', slug)
    .single();

  if (!product || productError) {
    notFound();
  }

  // 2. Fetch variants (if type is variant)
  let variants = [];
  if (product.type === 'variant') {
    const { data } = await supabase
      .from('product_variants')
      .select('*')
      .eq('product_id', product.id)
      .order('id', { ascending: true });
    variants = data || [];
  }

  // 3. Fetch package items (if type is package)
  let packageItems = [];
  if (product.type === 'package') {
    const { data } = await supabase
      .from('package_items')
      .select(`
        id, quantity, product_id,
        products (name_en, name_ar)
      `)
      .eq('package_id', product.id);
    packageItems = data || [];
  }

  // 4. Fetch reviews
  const { data: reviews } = await supabase
    .from('reviews')
    .select(`
      *,
      profiles:user_id (full_name)
    `)
    .eq('product_id', product.id)
    .order('created_at', { ascending: false });

  // Map reviewer name if missing (the task asked to use reviewer_name from reviews, but we also join profiles just in case)
  const formattedReviews = (reviews || []).map(r => ({
    ...r,
    reviewer_name: r.reviewer_name || r.profiles?.full_name || 'Anonymous'
  }));

  return (
    <main>
      <ProductClient 
        product={product}
        variants={variants}
        packageItems={packageItems}
        reviews={formattedReviews}
      />
    </main>
  );
}
