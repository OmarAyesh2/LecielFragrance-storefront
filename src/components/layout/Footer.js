"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/context/LanguageContext';

export default function Footer() {
  const [settings, setSettings] = useState(null);
  const { lang, t } = useLanguage();

  useEffect(() => {
    async function fetchSettings() {
      const { data } = await supabase.from('site_settings').select('*').eq('id', 1).single();
      if (data) setSettings(data);
    }
    fetchSettings();
  }, []);

  return (
    <footer className="footer">
      <div className="container footer-grid" style={{ paddingBottom: '5rem' }}>
        {/* Column 1: Brand */}
        <div>
          <h3 className="footer-heading">{settings ? settings[`store_name_${lang}`] : 'Leciel Fragrance'}</h3>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            {settings ? settings[`about_text_${lang}`] : 'Luxury organic fragrances for the modern world.'}
          </p>
        </div>

        {/* Column 2: Quick Links */}
        <div>
          <h4 className="footer-heading" style={{ fontSize: 'var(--text-lg)' }}>Quick Links</h4>
          <ul className="footer-links">
            <li><Link href="/">{t('nav.home')}</Link></li>
            <li><Link href="/shop">{t('nav.shop')}</Link></li>
            <li><Link href="/about">{t('nav.about')}</Link></li>
            <li><Link href="/contact">{t('nav.contact')}</Link></li>
          </ul>
        </div>

        {/* Column 3: Policies */}
        <div>
          <h4 className="footer-heading" style={{ fontSize: 'var(--text-lg)' }}>Policies</h4>
          <ul className="footer-links">
            <li><Link href="/privacy">{t('footer.privacy')}</Link></li>
            <li><Link href="/terms">{t('footer.terms')}</Link></li>
            <li><Link href="/shipping">{t('footer.shipping_policy')}</Link></li>
          </ul>
        </div>

        {/* Column 4: Social */}
        <div>
          <h4 className="footer-heading" style={{ fontSize: 'var(--text-lg)' }}>Follow Us</h4>
          <div className="social-links">
            {settings?.instagram_url && (
              <a href={settings.instagram_url} target="_blank" rel="noreferrer" aria-label="Instagram">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
            )}
            {settings?.facebook_url && (
              <a href={settings.facebook_url} target="_blank" rel="noreferrer" aria-label="Facebook">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3.8l.2-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
            )}
            {/* Add more icons if needed based on settings */}
          </div>
        </div>
      </div>

      <div className="container footer-bottom" style={{ paddingTop: '2rem' }}>
        <p>&copy; {new Date().getFullYear()} {settings ? settings[`store_name_${lang}`] : 'Leciel Fragrance'}. {t('footer.rights')}.</p>
        <p style={{ marginTop: '0.5rem', fontSize: '0.9em' }}>
          Developed by <a href="https://eagleon.digital" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline', color: 'var(--color-text-primary)', fontWeight: '500' }}>EagleOn</a>
        </p>
      </div>
    </footer>
  );
}
