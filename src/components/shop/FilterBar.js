"use client";

import { useLanguage } from '@/context/LanguageContext';

export default function FilterBar({ categories, activeCategory, setActiveCategory }) {
  const { lang, t } = useLanguage();

  return (
    <div className="filter-bar">
      <button 
        className={`filter-chip ${activeCategory === 'all' ? 'active' : ''}`}
        onClick={() => setActiveCategory('all')}
      >
        {t('shop.all_products') || 'The Complete Collection'}
      </button>
      
      {categories.map((cat) => (
        <button 
          key={cat.id}
          className={`filter-chip ${activeCategory === cat.slug ? 'active' : ''}`}
          onClick={() => setActiveCategory(cat.slug)}
        >
          {cat[`name_${lang}`]}
        </button>
      ))}
    </div>
  );
}
