"use client";

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';

export default function ProductCard({ product }) {
  const { lang, t } = useLanguage();
  const { addToCart } = useCart();
  const { addToast } = useToast();

  let isSale = product.sale_price && product.sale_price < product.base_price;
  let isOutOfStock = product.stock_quantity === 0;
  let currentPrice = isSale ? product.sale_price : product.base_price;
  let originalPrice = product.base_price;
  let isVariant = product.type === 'variant' && product.product_variants?.length > 0;

  if (isVariant) {
    const variants = product.product_variants;
    // For variants, the product is in stock if ANY variant has stock > 0
    const totalStock = variants.reduce((sum, v) => sum + (v.stock_quantity || 0), 0);
    isOutOfStock = totalStock <= 0;

    // Find the lowest price among variants to show "From X JOD"
    const lowestPrice = Math.min(...variants.map(v => v.sale_price || v.price));
    currentPrice = lowestPrice;
    originalPrice = lowestPrice;
    
    // Check if any variant is on sale
    isSale = variants.some(v => v.sale_price && v.sale_price < v.price);
  }

  const handleAddToCart = (e) => {
    e.preventDefault(); // prevent navigation
    if (isOutOfStock) return;
    
    addToCart({
      productId: product.id,
      name_en: product.name_en,
      name_ar: product.name_ar,
      image_url: product.image_url,
      price: currentPrice,
      quantity: 1
    });

    addToast(lang === 'ar' ? 'تمت الإضافة إلى الحقيبة!' : 'Added to bag!');
  };

  return (
    <div className="product-card">
      <Link href={`/product/${product.slug}`} className="product-image-container">
        {product.image_url ? (
          <img src={product.image_url} alt={product[`name_${lang}`]} />
        ) : (
          <div style={{width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-tertiary)'}}>
            No Image
          </div>
        )}
        
        <div className="product-badges">
          {isSale && <span className="badge-sale">{t('shop.sale')}</span>}
          {isOutOfStock && <span className="badge-stock">{t('shop.out_of_stock')}</span>}
        </div>
      </Link>
      
      <div className="product-details">
        <h3 className="product-name" title={product[`name_${lang}`]}>
          <Link href={`/product/${product.slug}`}>{product[`name_${lang}`]}</Link>
        </h3>
        
        <div className="product-bottom-row">
          <div className="product-price" style={{ direction: 'ltr', unicodeBidi: 'isolate' }}>
            {isSale && <span className="price-original">{originalPrice} JOD</span>}
            <span className="price-current">{isVariant ? `From ` : ''}{currentPrice} JOD</span>
          </div>
          
          <button 
            className="btn-order btn-add-desktop" 
            onClick={handleAddToCart}
            disabled={isOutOfStock}
          >
            {isOutOfStock ? t('product.out_of_stock') : `+ ${t('product.add_to_cart')}`}
          </button>
          <button
            className="btn-add-mobile"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            aria-label={t('product.add_to_cart')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
