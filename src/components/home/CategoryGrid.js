"use client";

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export default function CategoryGrid({ categories }) {
  const { lang } = useLanguage();

  if (!categories || categories.length === 0) return null;

  return (
    <section className="category-section">
      <div className="container">
        <div className="category-grid">
          {categories.map((cat) => (
            <Link key={cat.id} href={`/shop?category=${cat.slug}`} className="category-card">
              <div className="category-image-wrapper">
                {cat.image_url ? (
                  <img src={cat.image_url} alt={cat[`name_${lang}`]} />
                ) : (
                  <div style={{width: '100%', height: '100%', background: 'var(--color-bg-tertiary)'}} />
                )}
              </div>
              <div className="category-card-title">
                <h3>{cat[`name_${lang}`]}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
