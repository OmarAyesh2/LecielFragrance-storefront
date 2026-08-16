"use client";

import { useLanguage } from '@/context/LanguageContext';

export default function LanguageSwitcher() {
  const { lang, toggleLanguage } = useLanguage();

  return (
    <button className="lang-switcher" onClick={toggleLanguage} suppressHydrationWarning>
      {lang === 'en' ? 'عربي' : 'EN'}
    </button>
  );
}
