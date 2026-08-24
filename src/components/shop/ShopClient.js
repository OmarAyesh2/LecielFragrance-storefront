"use client";

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import FilterBar from './FilterBar';
import SortDropdown from './SortDropdown';
import ProductGrid from './ProductGrid';

export default function ShopClient({ initialProducts, categories }) {
  const { lang, t } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const initialCategory = searchParams.get('category') || 'all';
  const initialSort = searchParams.get('sort') || 'bestsellers';
  const initialStock = searchParams.get('stock') === 'true' || searchParams.get('in_stock') === 'true';

  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [sortOption, setSortOption] = useState(initialSort);
  const [inStockOnly, setInStockOnly] = useState(initialStock);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const cat = searchParams.get('category') || 'all';
    const sort = searchParams.get('sort') || 'bestsellers';
    const stock = searchParams.get('stock') === 'true' || searchParams.get('in_stock') === 'true';

    setActiveCategory(cat);
    setSortOption(sort);
    setInStockOnly(stock);
  }, [searchParams]);

  const updateUrl = useCallback((newCategory, newSort, newStock) => {
    const params = new URLSearchParams(searchParams.toString());

    if (newCategory && newCategory !== 'all') {
      params.set('category', newCategory);
    } else {
      params.delete('category');
    }

    if (newSort && newSort !== 'bestsellers') {
      params.set('sort', newSort);
    } else {
      params.delete('sort');
    }

    if (newStock) {
      params.set('stock', 'true');
    } else {
      params.delete('stock');
      params.delete('in_stock');
    }

    const queryString = params.toString();
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
    router.replace(newUrl, { scroll: false });
  }, [pathname, router, searchParams]);

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    updateUrl(cat, sortOption, inStockOnly);
  };

  const handleSortChange = (sort) => {
    setSortOption(sort);
    updateUrl(activeCategory, sort, inStockOnly);
  };

  const handleStockChange = (stock) => {
    setInStockOnly(stock);
    updateUrl(activeCategory, sortOption, stock);
  };

  const filteredProducts = useMemo(() => {
    let result = [...initialProducts];

    // Filter by Category
    if (activeCategory !== 'all') {
      result = result.filter(p => p.categories?.slug === activeCategory);
    }

    // Filter by Stock
    if (inStockOnly) {
      result = result.filter(p => p.stock_quantity > 0);
    }

    // Sort
    result.sort((a, b) => {
      switch (sortOption) {
        case 'bestsellers':
          return (b.is_bestseller === true ? 1 : 0) - (a.is_bestseller === true ? 1 : 0);
        case 'newest':
          return new Date(b.created_at) - new Date(a.created_at);
        case 'price_asc':
          return (a.sale_price || a.base_price) - (b.sale_price || b.base_price);
        case 'price_desc':
          return (b.sale_price || b.base_price) - (a.sale_price || a.base_price);
        default:
          return 0;
      }
    });

    return result;
  }, [initialProducts, activeCategory, inStockOnly, sortOption]);

  if (!isClient) return null; // Prevent hydration mismatch on search params

  return (
    <div className="container" style={{ paddingTop: 'var(--space-12)', paddingBottom: 'var(--space-16)' }}>
      <div style={{ textAlign: 'center', marginBottom: 'var(--space-10)' }}>
        <p className="tracking-label" style={{ color: 'var(--color-accent)', marginBottom: 'var(--space-2)' }}>
          {lang === 'ar' ? 'عطور وتشكيلات حصرية' : 'PARISIAN PERFUMERY'}
        </p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.25rem, 5vw, 3.25rem)', letterSpacing: '-0.02em', marginBottom: 'var(--space-3)' }}>
          {t('shop.title')}
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', maxWidth: '540px', margin: '0 auto', fontSize: 'var(--text-base)', lineHeight: 1.6 }}>
          {lang === 'ar' ? 'استكشف تشكيلتنا الفاخرة من العطور العضوية والإكسسوارات المصممة بعناية.' : 'Explore our curated selection of masterfully crafted organic perfumes and luxury accessories.'}
        </p>
      </div>

      <div className="shop-controls">
        <FilterBar 
          categories={categories} 
          activeCategory={activeCategory} 
          setActiveCategory={handleCategoryChange} 
        />
        <SortDropdown 
          sortOption={sortOption} 
          setSortOption={handleSortChange} 
          inStockOnly={inStockOnly}
          setInStockOnly={handleStockChange} 
        />
      </div>

      <ProductGrid products={filteredProducts} />
    </div>
  );
}
