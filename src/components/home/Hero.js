"use client";

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export default function Hero({ settings }) {
  const { lang, t } = useLanguage();

  const headline = settings ? settings[`hero_headline_${lang}`] : 'Discover Your Signature Scent';
  const subtext = settings ? settings[`hero_subtext_${lang}`] : 'Luxury organic fragrances crafted with the finest ingredients.';
  const imageUrl = settings?.hero_image_url || 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=2000';
  const ctaLink = settings?.hero_cta_link || '/shop';

  return (
    <section className="hero-split">
      <div className="hero-split-text animate-fade-in-up">
        <h1 className="hero-title">{headline}</h1>
        <p className="hero-subtext">{subtext}</p>
        <Link href={ctaLink} className="btn-primary" style={{ display: 'inline-block', width: 'auto', padding: 'var(--space-3) var(--space-8)', fontSize: 'var(--text-lg)' }}>
          {t('home.view_all')}
        </Link>
      </div>
      <div className="hero-split-image">
        <img src={imageUrl} alt="Leciel Fragrance" />
      </div>
    </section>
  );
}
