"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import SearchBar from '@/components/ui/SearchBar';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';
import { supabase } from '@/lib/supabase';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [storeName, setStoreName] = useState({ en: 'Leciel Fragrance', ar: 'ليسيل للعطور' });
  const [logoUrl, setLogoUrl] = useState(null);
  
  const { lang, t } = useLanguage();
  const { cartCount, openCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    async function fetchName() {
      const { data } = await supabase.from('site_settings').select('store_name_en, store_name_ar, logo_url').eq('id', 1).single();
      if (data) {
        setStoreName({ en: data.store_name_en, ar: data.store_name_ar });
        setLogoUrl(data.logo_url);
      }
    }
    fetchName();

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 20);
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsHidden(true); // scrolling down
      } else {
        setIsHidden(false); // scrolling up
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <nav className={`navbar ${isHidden ? 'hidden' : ''}`} style={isScrolled ? {} : { background: 'transparent' }}>
      <div className={`container navbar-content ${isScrolled ? 'glass-card' : ''}`} style={{ marginTop: isScrolled ? 'var(--space-2)' : '0', transition: 'all 0.3s ease' }}>
        
        {/* Left: Links (Desktop) & Hamburger (Mobile) */}
        <div className="nav-left">
          {/* Mobile Menu Button */}
          <button className="icon-btn mobile-menu-btn" aria-label="Menu" onClick={() => setIsMobileMenuOpen(true)}>
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
          
          <div className="nav-links">
            <Link href="/">{t('nav.home')}</Link>
            <Link href="/shop">{t('nav.shop')}</Link>
            <Link href="/about">{t('nav.about')}</Link>
            <Link href="/contact">{t('nav.contact')}</Link>
          </div>
        </div>

        {/* Center: Logo */}
        <div className="nav-center">
          <Link href="/" className="logo" style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 600 }}>
            {logoUrl ? <img src={logoUrl} alt={storeName[lang]} style={{ height: '36px', maxWidth: '140px', objectFit: 'contain' }} /> : (storeName[lang] || 'Leciel Fragrance')}
          </Link>
        </div>

        {/* Right: Actions */}
        <div className="nav-right">
          <div className="nav-actions">
            <SearchBar />
            <div className="desktop-only"><LanguageSwitcher /></div>
            
            <Link href={user ? "/profile" : "/auth/signin"} className="icon-btn desktop-only" aria-label={t('nav.profile')}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </Link>

            <button className="icon-btn cart-btn" onClick={openCart} aria-label={t('nav.cart')}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`mobile-menu-overlay ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-header">
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 600 }}>
            {logoUrl ? <img src={logoUrl} alt={storeName[lang]} style={{ height: '36px', maxWidth: '140px', objectFit: 'contain' }} /> : (storeName[lang] || 'Leciel Fragrance')}
          </span>
          <button className="icon-btn" onClick={() => setIsMobileMenuOpen(false)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div className="mobile-nav-links">
          <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>{t('nav.home')}</Link>
          <Link href="/shop" onClick={() => setIsMobileMenuOpen(false)}>{t('nav.shop')}</Link>
          <Link href="/about" onClick={() => setIsMobileMenuOpen(false)}>{t('nav.about')}</Link>
          <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)}>{t('nav.contact')}</Link>
        </div>
      </div>
    </nav>
  );
}
