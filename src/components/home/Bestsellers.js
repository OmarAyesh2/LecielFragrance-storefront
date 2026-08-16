"use client";

import ProductCard from '../shop/ProductCard';
import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';

export default function Bestsellers({ products }) {
  const { t } = useLanguage();

  if (!products || products.length === 0) return null;

  return (
    <section className="category-section">
      <div className="container">
        <h2 className="section-title">{t('home.bestsellers_title')}</h2>
        
        <div className="product-grid">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        
        <div style={{ textAlign: 'center', marginTop: 'var(--space-8)' }}>
          <Link href="/shop" className="btn-outline" style={{ display: 'inline-block', width: 'auto', padding: 'var(--space-3) var(--space-8)' }}>
            {t('home.view_all')}
          </Link>
        </div>
      </div>
    </section>
  );
}
