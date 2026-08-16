"use client";

import { useLanguage } from '@/context/LanguageContext';
import { useRouter } from 'next/navigation';

export default function OrderConfirmationModal({ orderId }) {
  const { lang, t } = useLanguage();
  const router = useRouter();

  if (!orderId) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content animate-scale-in" style={{ textAlign: 'center' }}>
        <div style={{ color: 'var(--color-success)', marginBottom: 'var(--space-4)' }}>
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>
        
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-3xl)', marginBottom: 'var(--space-4)' }}>
          {lang === 'ar' ? 'تم تقديم الطلب بنجاح!' : 'Order Placed Successfully!'}
        </h2>
        
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-6)' }}>
          {lang === 'ar' ? 'رقم طلبك هو: ' : 'Your Order Number is: '}
          <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{orderId}</span>
        </p>

        <button 
          className="btn-primary" 
          style={{ width: '100%' }}
          onClick={() => router.push('/')}
        >
          {lang === 'ar' ? 'مواصلة التسوق' : 'Continue Shopping'}
        </button>
      </div>
    </div>
  );
}
