"use client";

import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import QuantitySelector from './QuantitySelector';

export default function ProductInfo({ 
  product, 
  variants, 
  selectedVariantId, 
  setSelectedVariantId, 
  packageItems, 
  reviewsCount, 
  avgRating 
}) {
  const { lang, t } = useLanguage();
  const { addToCart } = useCart();
  const { addToast } = useToast();
  
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  const activeVariant = variants?.find(v => v.id === selectedVariantId);
  
  const currentPrice = activeVariant ? activeVariant.price : (product.sale_price || product.base_price);
  const originalPrice = activeVariant ? null : product.base_price;
  const hasSale = !activeVariant && product.sale_price && product.sale_price < product.base_price;
  
  const stockQuantity = activeVariant ? activeVariant.stock_quantity : product.stock_quantity;
  
  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      variantId: activeVariant?.id || null,
      name_en: activeVariant ? `${product.name_en} (${activeVariant.label_en || activeVariant.sku || activeVariant.label})` : product.name_en,
      name_ar: activeVariant ? `${product.name_ar} (${activeVariant.label_ar || activeVariant.sku || activeVariant.label})` : product.name_ar,
      image_url: activeVariant?.image_url || product.image_url,
      price: currentPrice,
      quantity: quantity
    });
    addToast(lang === 'ar' ? 'تمت الإضافة إلى السلة!' : 'Added to cart!');
  };

  const scrollToReviews = () => {
    document.getElementById('reviews')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="product-info animate-fade-in-right">
      <h1 className="product-title">{product[`name_${lang}`]}</h1>
      
      <div className="product-meta">
        <div className="stars">
          {'★'.repeat(Math.round(avgRating || 0))}{'☆'.repeat(5 - Math.round(avgRating || 0))}
        </div>
        <div className="review-link" onClick={scrollToReviews}>
          {reviewsCount} {lang === 'ar' ? 'تقييمات' : 'Reviews'}
        </div>
      </div>

      <div className="product-price-large" style={{ direction: 'ltr', unicodeBidi: 'isolate', display: 'inline-flex', gap: '8px', alignItems: 'baseline' }}>
        {hasSale && <span className="price-original">{originalPrice} JOD</span>}
        <span className="price-current">{currentPrice} JOD</span>
      </div>

      <div className={`stock-status ${stockQuantity > 10 ? 'stock-in' : stockQuantity > 0 ? 'stock-low' : 'stock-out'}`}>
        {stockQuantity > 10 
          ? (lang === 'ar' ? 'متوفر' : 'In Stock')
          : stockQuantity > 0
            ? (lang === 'ar' ? `تبقى ${stockQuantity} فقط` : `Low Stock: Only ${stockQuantity} left`)
            : (lang === 'ar' ? 'نفذت الكمية' : 'Out of Stock')
        }
      </div>

      {variants && variants.length > 0 && (
        <div className="variant-selector">
          <span className="variant-label">{lang === 'ar' ? 'الحجم / السعة' : 'Size / Variant'}</span>
          <div className="variant-pills">
            {variants.map(variant => (
              <button
                key={variant.id}
                className={`variant-pill ${selectedVariantId === variant.id ? 'active' : ''}`}
                onClick={() => {
                  setSelectedVariantId(variant.id);
                  setQuantity(1);
                }}
              >
                {variant.variant_label || variant.sku}
              </button>
            ))}
          </div>
        </div>
      )}

      {product.type === 'package' && packageItems && packageItems.length > 0 && (
        <div style={{ marginBottom: 'var(--space-6)', background: 'var(--color-bg-secondary)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)' }}>
          <h4 style={{ marginBottom: 'var(--space-2)' }}>{lang === 'ar' ? 'محتويات الباقة:' : 'Package Includes:'}</h4>
          <ul style={{ listStylePosition: 'inside', color: 'var(--color-text-secondary)' }}>
            {packageItems.map(item => (
              <li key={item.id}>
                {item.quantity}x {item.products?.[`name_${lang}`]}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="product-actions">
        <QuantitySelector 
          quantity={quantity} 
          setQuantity={setQuantity} 
          max={stockQuantity} 
        />
        <button 
          className="btn-primary" 
          style={{ flex: 1 }}
          onClick={handleAddToCart}
          disabled={stockQuantity === 0}
        >
          {stockQuantity === 0 
            ? (lang === 'ar' ? 'نفذت الكمية' : 'Out of Stock')
            : (lang === 'ar' ? 'أضف إلى السلة' : 'Add to Cart')
          }
        </button>
      </div>

      <div className="accordion">
        {['description', 'ingredients', 'benefits', 'usage'].map(key => {
          const content = product[`${key}_${lang}`];
          if (!content) return null;
          
          const isOpen = activeTab === key;
          const titles = {
            description: lang === 'ar' ? 'الوصف' : 'Description',
            ingredients: lang === 'ar' ? 'التفاصيل' : 'Details',
            benefits: lang === 'ar' ? 'الفوائد' : 'Benefits',
            usage: lang === 'ar' ? 'طريقة الاستخدام' : 'How to Use',
          };

          return (
            <div key={key} className="accordion-item">
              <button 
                className="accordion-btn" 
                onClick={() => setActiveTab(isOpen ? null : key)}
              >
                {titles[key]}
                <span>{isOpen ? '−' : '+'}</span>
              </button>
              {isOpen && (
                <div className="accordion-content animate-fade-in" dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br/>') }} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
