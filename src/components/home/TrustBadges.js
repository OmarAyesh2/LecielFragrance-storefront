"use client";

import { useLanguage } from '@/context/LanguageContext';

export default function TrustBadges() {
  const { t } = useLanguage();

  return (
    <section className="trust-badges">
      <div className="container trust-badges-grid">
        
        <div className="trust-badge animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="trust-badge-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              <polyline points="9 12 11 14 15 10"></polyline>
            </svg>
          </div>
          <h3 className="trust-badge-title">{t('home.trust_organic')}</h3>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
            Sustainably sourced ingredients.
          </p>
        </div>

        <div className="trust-badge animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="trust-badge-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
          </div>
          <h3 className="trust-badge-title">{t('home.trust_premium')}</h3>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
            Crafted by master perfumers.
          </p>
        </div>

        <div className="trust-badge animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <div className="trust-badge-icon">
             <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="1" y="3" width="15" height="13"></rect>
              <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
              <circle cx="5.5" cy="18.5" r="2.5"></circle>
              <circle cx="18.5" cy="18.5" r="2.5"></circle>
            </svg>
          </div>
          <h3 className="trust-badge-title">{t('home.trust_delivery')}</h3>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
            Express shipping across the country.
          </p>
        </div>

      </div>
    </section>
  );
}
