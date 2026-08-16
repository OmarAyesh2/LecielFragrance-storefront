"use client";

import { useLanguage } from '@/context/LanguageContext';
import ProductCard from './ProductCard';

export default function ProductGrid({ products }) {
  const { t } = useLanguage();

  if (!products || products.length === 0) {
    return (
      <div className="animate-fade-in" style={{ textAlign: 'center', padding: 'var(--space-16) 0' }}>
        <h3 style={{ fontSize: 'var(--text-xl)', marginBottom: 'var(--space-4)' }}>
          {t('shop.no_products_found') || 'No creations found in this selection.'}
        </h3>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          {t('shop.try_different_filters') || 'Please explore our other olfactory families.'}
        </p>
      </div>
    );
  }

  return (
    <div className="product-grid animate-fade-in">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
