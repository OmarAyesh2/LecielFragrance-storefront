"use client";

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';

export default function SearchBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef(null);
  const { lang, t } = useLanguage();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    const handleEscape = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('id, name_en, name_ar, slug, image_url, base_price')
        .or(`name_en.ilike.%${query}%,name_ar.ilike.%${query}%`)
        .eq('is_active', true)
        .limit(5);
        
      if (!error && data) {
        setResults(data);
      }
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="search-container" ref={containerRef}>
      {!isOpen ? (
        <button className="icon-btn" onClick={() => setIsOpen(true)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </button>
      ) : (
        <input 
          type="text" 
          className="search-input"
          placeholder={t('nav.search_placeholder')}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />
      )}
      
      {isOpen && query && (
        <div className="search-results">
          {loading && <div className="p-3 text-center">{t('nav.loading') || '...'}</div>}
          {!loading && results.length === 0 && (
            <div className="p-3 text-center">{t('shop.no_products')}</div>
          )}
          {results.map(product => (
            <Link 
              key={product.id} 
              href={`/product/${product.slug}`}
              className="search-result-item"
              onClick={() => setIsOpen(false)}
            >
              {product.image_url && (
                <img src={product.image_url} alt={product[`name_${lang}`]} className="search-result-img" />
              )}
              <div>
                <div style={{ fontWeight: 500 }}>{product[`name_${lang}`]}</div>
                <div style={{ color: 'var(--color-accent)' }}>{product.base_price} JOD</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
