"use client";

import { useLanguage } from '@/context/LanguageContext';

export default function SortDropdown({ sortOption, setSortOption, inStockOnly, setInStockOnly }) {
  const { t } = useLanguage();

  return (
    <div className="sort-container">
      <label className="toggle-container">
        <input 
          type="checkbox" 
          checked={inStockOnly} 
          onChange={(e) => setInStockOnly(e.target.checked)} 
        />
        <div className="toggle-switch"></div>
        <span>{t('shop.in_stock_only') || 'In Stock Only'}</span>
      </label>

      <select 
        className="sort-select" 
        value={sortOption} 
        onChange={(e) => setSortOption(e.target.value)}
      >
        <option value="bestsellers">{t('shop.sort_bestsellers') || 'Signature Collection'}</option>
        <option value="newest">{t('shop.sort_newest') || 'Latest Arrivals'}</option>
        <option value="price_asc">{t('shop.sort_price_low_high') || 'Price: Ascending'}</option>
        <option value="price_desc">{t('shop.sort_price_high_low') || 'Price: Descending'}</option>
      </select>
    </div>
  );
}
