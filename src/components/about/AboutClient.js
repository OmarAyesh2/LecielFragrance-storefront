"use client";

import { useLanguage } from '@/context/LanguageContext';

export default function AboutClient({ settings }) {
  const { lang, t } = useLanguage();

  if (!settings) return null;

  return (
    <main style={{ paddingBottom: 'var(--space-20)' }}>
      {/* Hero Section */}
      <section className="about-hero animate-fade-in-up">
        <div className="container" style={{ textAlign: 'center' }}>
          <p className="tracking-label" style={{ color: 'var(--color-accent)', marginBottom: 'var(--space-2)' }}>
            {lang === 'ar' ? 'عن ليسيل' : 'OUR HERITAGE'}
          </p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.25rem, 5vw, 3.5rem)', marginBottom: 'var(--space-4)', letterSpacing: '-0.02em' }}>
            {t('nav.about') || 'About Us'}
          </h1>
          <p style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)', color: 'var(--color-text-secondary)', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
            {lang === 'ar' ? 'اكتشف جوهر وفلسفة ليسيل للعطور.' : 'Discover the essence and craftsmanship behind Leciel Fragrance.'}
          </p>
        </div>
      </section>

      <div className="container" style={{ maxWidth: '840px', marginTop: 'var(--space-12)', display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
        {/* Story Card */}
        <section className="about-card glass-card animate-fade-in-up">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
            <span style={{ color: 'var(--color-accent)', fontSize: '1.5rem' }}>✧</span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', color: 'var(--color-text-primary)' }}>
              {lang === 'ar' ? 'قصتنا' : 'Our Story'}
            </h2>
          </div>
          <div 
            style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-base)', lineHeight: 1.8 }}
            dangerouslySetInnerHTML={{ __html: settings[`about_text_${lang}`]?.replace(/\n/g, '<br/>') || '' }} 
          />
        </section>

        {/* Mission Card */}
        <section className="about-card glass-card animate-fade-in-up">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
            <span style={{ color: 'var(--color-accent)', fontSize: '1.5rem' }}>◈</span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', color: 'var(--color-text-primary)' }}>
              {lang === 'ar' ? 'مهمتنا' : 'Our Mission'}
            </h2>
          </div>
          <div 
            style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-base)', lineHeight: 1.8 }}
            dangerouslySetInnerHTML={{ __html: settings[`mission_text_${lang}`]?.replace(/\n/g, '<br/>') || '' }} 
          />
        </section>

        {/* Compliance & Ethics */}
        {(settings.compliance_text_en || settings.compliance_text_ar) && (
          <section className="about-card glass-card animate-fade-in-up">
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
              <span style={{ color: 'var(--color-accent)', fontSize: '1.5rem' }}>❖</span>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', color: 'var(--color-text-primary)' }}>
                {lang === 'ar' ? 'الامتثال والأخلاق' : 'Compliance & Ethics'}
              </h2>
            </div>
            <div 
              style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-base)', lineHeight: 1.8 }}
              dangerouslySetInnerHTML={{ __html: settings[`compliance_text_${lang}`]?.replace(/\n/g, '<br/>') || '' }} 
            />
          </section>
        )}
      </div>
    </main>
  );
}
