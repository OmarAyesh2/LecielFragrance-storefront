"use client";

import { useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';

export default function CartDrawer() {
  const { isCartOpen, closeCart, cartItems, cartSubtotal, updateQuantity, removeFromCart } = useCart();
  const { lang, t } = useLanguage();

  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  return (
    <>
      <div className="cart-drawer-overlay animate-fade-in" onClick={closeCart}></div>
      <div className="cart-drawer glass-card animate-slide-in-right">
        
        <div className="cart-header">
          <h2 className="cart-title">{t('cart.title')}</h2>
          <button className="icon-btn" onClick={closeCart}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="cart-items">
          {cartItems.length === 0 ? (
            <div style={{ textAlign: 'center', marginTop: 'var(--space-8)' }}>
              <p style={{ marginBottom: 'var(--space-4)', color: 'var(--color-text-secondary)' }}>
                {t('cart.empty')}
              </p>
              <Link href="/shop" onClick={closeCart} className="btn-outline">
                {t('checkout.continue_shopping')}
              </Link>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={`${item.productId}-${item.variantId || 'base'}`} className="cart-item animate-fade-in">
                {item.image_url && (
                  <img src={item.image_url} alt={item[`name_${lang}`]} className="cart-item-img" />
                )}
                <div className="cart-item-details">
                  <div className="cart-item-name">{item[`name_${lang}`]}</div>
                  <div className="cart-item-price">{item.price} JOD</div>
                  
                  <div className="cart-item-actions">
                    <div className="qty-controls">
                      <button className="qty-btn" onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)}>-</button>
                      <span style={{ minWidth: '20px', textAlign: 'center', fontSize: 'var(--text-sm)' }}>{item.quantity}</span>
                      <button className="qty-btn" onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)}>+</button>
                    </div>
                    <button className="icon-btn" style={{ color: 'var(--color-error)' }} onClick={() => removeFromCart(item.productId, item.variantId)}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="cart-footer">
            <div className="cart-subtotal">
              <span>{t('cart.subtotal')}</span>
              <span>{cartSubtotal} JOD</span>
            </div>
            <Link href="/checkout" onClick={closeCart} className="btn-primary">
              {t('cart.checkout')}
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
