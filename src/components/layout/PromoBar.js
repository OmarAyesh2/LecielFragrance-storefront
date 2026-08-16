"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/context/LanguageContext';

export default function PromoBar() {
  const [promo, setPromo] = useState(null);
  const [isVisible, setIsVisible] = useState(true);
  const { lang } = useLanguage();

  useEffect(() => {
    async function fetchSettings() {
      const { data, error } = await supabase
        .from('site_settings')
        .select(`promo_bar_text_en, promo_bar_text_ar, promo_bar_visible`)
        .eq('id', 1)
        .single();
        
      if (data && data.promo_bar_visible) {
        setPromo(data);
      } else {
        setIsVisible(false);
      }
    }
    fetchSettings();
  }, []);

  if (!isVisible || !promo) return null;

  return (
    <div className="promo-bar">
      <span>{promo[`promo_bar_text_${lang}`]}</span>
      <button className="promo-close" onClick={() => setIsVisible(false)}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
  );
}
