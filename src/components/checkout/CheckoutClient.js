"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import OrderConfirmationModal from './OrderConfirmationModal';

export default function CheckoutClient({ settings, deliveryFees }) {
  const { cartItems, cartSubtotal, clearCart } = useCart();
  const { lang, t } = useLanguage();
  const { user } = useAuth();
  const router = useRouter();

  const [isClient, setIsClient] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Form State
  const [fulfillment, setFulfillment] = useState('delivery'); // delivery, pickup
  const [payment, setPayment] = useState('cod'); // cod, cliq
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  
  const [governorateId, setGovernorateId] = useState('');
  const [addressLine, setAddressLine] = useState('');

  // Hydration & initial checks
  useEffect(() => {
    setIsClient(true);
    if (cartItems.length === 0 && !placedOrderId) {
      router.push('/shop');
    }
  }, [cartItems, router, placedOrderId]);

  // Pre-fill user data
  useEffect(() => {
    if (user) {
      setEmail(user.email || '');
      const fetchProfile = async () => {
        const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        if (data) {
          const names = (data.full_name || '').split(' ');
          setFirstName(names[0] || '');
          setLastName(names.slice(1).join(' ') || '');
          setPhone(data.phone || '');
        }
      };
      fetchProfile();
    }
  }, [user]);

  // Derived Values
  const selectedGovernorate = deliveryFees.find(f => f.id.toString() === governorateId);
  const deliveryFee = fulfillment === 'delivery' && selectedGovernorate ? selectedGovernorate.fee : 0;
  const grandTotal = cartSubtotal + deliveryFee;

  if (!isClient || (cartItems.length === 0 && !placedOrderId)) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // 1. Insert Order
      const newOrder = {
        customer_id: user?.id || null,
        status: 'pending',
        subtotal: cartSubtotal,
        delivery_fee: deliveryFee,
        total: grandTotal,
        fulfillment_type: fulfillment,
        payment_method: payment,
        governorate: fulfillment === 'delivery' ? selectedGovernorate?.[`governorate_${lang}`] || 'Unknown' : null,
        address_line: fulfillment === 'delivery' ? addressLine : null,
        guest_first_name: firstName,
        guest_last_name: lastName,
        guest_email: email,
        guest_phone: phone,
      };

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert(newOrder)
        .select()
        .single();

      if (orderError) throw orderError;

      // 2. Insert Order Items
      const orderItems = cartItems.map(item => ({
        order_id: order.id,
        product_id: item.productId,
        variant_id: item.variantId || null,
        quantity: item.quantity,
        unit_price: item.price,
        line_total: item.price * item.quantity,
        product_name_en: item.name_en,
        product_name_ar: item.name_ar
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // 3. Success
      setPlacedOrderId(order.order_number);
      await clearCart();
    } catch (err) {
      console.error('Checkout error:', err);
      setError(lang === 'ar' ? 'حدث خطأ أثناء معالجة طلبك.' : 'An error occurred while processing your order.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ paddingTop: 'var(--space-12)', paddingBottom: 'var(--space-20)' }}>
      <div style={{ marginBottom: 'var(--space-10)' }}>
        <p className="tracking-label" style={{ color: 'var(--color-accent)', marginBottom: 'var(--space-2)' }}>
          {lang === 'ar' ? 'إتمام الشراء الآمن' : 'SECURE CHECKOUT'}
        </p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.25rem, 5vw, 3.25rem)', letterSpacing: '-0.02em', marginBottom: 'var(--space-2)' }}>
          {lang === 'ar' ? 'إتمام الطلب' : 'Checkout'}
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-base)' }}>
          {lang === 'ar' ? 'يرجى مراجعة بيانات التوصيل والدفع لإتمام طلبك.' : 'Please enter your shipping address and payment preference to complete your order.'}
        </p>
      </div>

      {error && (
        <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid var(--color-error)', color: '#f87171', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-8)' }}>
          {error}
        </div>
      )}

      <div className="checkout-layout">
        
        {/* Left Column: Form */}
        <div className="checkout-form-col">
          <form id="checkout-form" onSubmit={handleSubmit}>
            
            {/* Fulfillment Selector */}
            <div className="checkout-section glass-card" style={{ borderRadius: 'var(--radius-xl)' }}>
              <h2 className="checkout-section-title">{lang === 'ar' ? 'طريقة الاستلام' : 'Fulfillment Method'}</h2>
              <div className="radio-group" style={{ display: 'flex', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
                <label className="radio-label">
                  <input 
                    type="radio" 
                    name="fulfillment" 
                    value="delivery" 
                    checked={fulfillment === 'delivery'}
                    onChange={() => setFulfillment('delivery')}
                  />
                  <span style={{display: 'flex', alignItems: 'center', gap: '8px'}}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg> {lang === 'ar' ? 'توصيل للمنزل' : 'Home Delivery'}</span>
                </label>
                
                {settings?.pickup_enabled && (
                  <label className="radio-label">
                    <input 
                      type="radio" 
                      name="fulfillment" 
                      value="pickup" 
                      checked={fulfillment === 'pickup'}
                      onChange={() => {
                        setFulfillment('pickup');
                        setGovernorateId('');
                      }}
                    />
                    <span style={{display: 'flex', alignItems: 'center', gap: '8px'}}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg> {lang === 'ar' ? 'استلام من المتجر' : 'Store Pickup'}</span>
                  </label>
                )}
              </div>

              {fulfillment === 'pickup' && (
                <div style={{ padding: 'var(--space-4)', background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-sm)' }}>
                  <p style={{ fontWeight: 600, marginBottom: 'var(--space-2)' }}>{lang === 'ar' ? 'عنوان الاستلام:' : 'Pickup Address:'}</p>
                  <p style={{ color: 'var(--color-text-secondary)' }}>{settings?.[`pickup_address_${lang}`]}</p>
                </div>
              )}
            </div>

            {/* Personal Info */}
            <div className="checkout-section glass-card" style={{ borderRadius: 'var(--radius-xl)' }}>
              <h2 className="checkout-section-title">{lang === 'ar' ? 'المعلومات الشخصية' : 'Personal Info'}</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
                <div className="form-group">
                  <label className="form-label">{lang === 'ar' ? 'الاسم الأول' : 'First Name'}</label>
                  <input type="text" className="form-input" required value={firstName} onChange={e => setFirstName(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">{lang === 'ar' ? 'الاسم الأخير' : 'Last Name'}</label>
                  <input type="text" className="form-input" required value={lastName} onChange={e => setLastName(e.target.value)} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                <div className="form-group">
                  <label className="form-label">{lang === 'ar' ? 'البريد الإلكتروني' : 'Email'}</label>
                  <input type="email" className="form-input" required value={email} onChange={e => setEmail(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">{lang === 'ar' ? 'رقم الهاتف' : 'Phone'}</label>
                  <input type="tel" className="form-input" required value={phone} onChange={e => setPhone(e.target.value)} />
                </div>
              </div>
            </div>

            {/* Delivery Address (Conditional) */}
            {fulfillment === 'delivery' && (
              <div className="checkout-section glass-card" style={{ borderRadius: 'var(--radius-xl)' }}>
                <h2 className="checkout-section-title">{lang === 'ar' ? 'عنوان التوصيل' : 'Delivery Address'}</h2>
                <div className="form-group">
                  <label className="form-label">{lang === 'ar' ? 'المحافظة' : 'Governorate'}</label>
                  <select 
                    className="form-input" 
                    required 
                    value={governorateId} 
                    onChange={e => setGovernorateId(e.target.value)}
                  >
                    <option value="" disabled>{lang === 'ar' ? 'اختر المحافظة...' : 'Select Governorate...'}</option>
                    {deliveryFees.map(gov => (
                      <option key={gov.id} value={gov.id}>{gov[`governorate_${lang}`]} - {gov.fee} JOD</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">{lang === 'ar' ? 'العنوان التفصيلي' : 'Address Line'}</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    required 
                    placeholder={lang === 'ar' ? 'اسم الشارع، البناية، رقم الشقة...' : 'Street name, Building, Apt...'}
                    value={addressLine} 
                    onChange={e => setAddressLine(e.target.value)} 
                  />
                </div>
              </div>
            )}

            {/* Payment Method */}
            <div className="checkout-section glass-card" style={{ borderRadius: 'var(--radius-xl)' }}>
              <h2 className="checkout-section-title">{lang === 'ar' ? 'طريقة الدفع' : 'Payment Method'}</h2>
              <div className="radio-group" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                <label className="radio-label">
                  <input 
                    type="radio" 
                    name="payment" 
                    value="cod" 
                    checked={payment === 'cod'}
                    onChange={() => setPayment('cod')}
                  />
                  <span style={{display: 'flex', alignItems: 'center', gap: '8px'}}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"></rect><circle cx="12" cy="12" r="2"></circle><path d="M6 12h.01M18 12h.01"></path></svg> {lang === 'ar' ? 'الدفع عند الاستلام' : 'Cash on Delivery'}</span>
                </label>
                
                {settings?.cliq_enabled && (
                  <>
                    <label className="radio-label">
                      <input 
                        type="radio" 
                        name="payment" 
                        value="cliq" 
                        checked={payment === 'cliq'}
                        onChange={() => setPayment('cliq')}
                      />
                      <span style={{display: 'flex', alignItems: 'center', gap: '8px'}}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg> CliQ</span>
                    </label>
                    {payment === 'cliq' && <div style={{marginTop: 'var(--space-2)', fontSize: '0.875rem', color: 'var(--color-text-secondary)'}}>Transfer to Alias: {settings?.cliq_alias}</div>}
                  </>
                )}
              </div>
            </div>

          </form>
        </div>

        {/* Right Column: Order Summary */}
        <div className="checkout-summary-col">
          <div className="summary-card glass-card" style={{ borderRadius: 'var(--radius-xl)' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', marginBottom: 'var(--space-6)', borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--space-4)' }}>
              {lang === 'ar' ? 'ملخص الطلب' : 'Order Summary'}
            </h2>
            
            <div className="summary-items" style={{ marginBottom: 'var(--space-6)' }}>
              {cartItems.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
                  <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', overflow: 'hidden', background: '#fff', flexShrink: 0 }}>
                      <img src={item.image_url} alt="Product" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 500, fontSize: 'var(--text-sm)' }}>{item[`name_${lang}`]}</div>
                      <div style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-xs)' }}>
                        {item.quantity} × {item.price} JOD
                      </div>
                    </div>
                  </div>
                  <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>
                    {item.price * item.quantity} JOD
                  </div>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)', fontSize: 'var(--text-sm)' }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>{lang === 'ar' ? 'المجموع الفرعي' : 'Subtotal'}</span>
                <span>{cartSubtotal} JOD</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)', fontSize: 'var(--text-sm)' }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>{lang === 'ar' ? 'رسوم التوصيل' : 'Delivery Fee'}</span>
                <span>{fulfillment === 'pickup' ? (lang === 'ar' ? 'مجاني' : 'Free') : `${deliveryFee} JOD`}</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-xl)', fontWeight: 600, marginBottom: 'var(--space-6)', borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-4)' }}>
              <span>{lang === 'ar' ? 'المجموع الكلي' : 'Grand Total'}</span>
              <span style={{ color: 'var(--color-accent)' }}>{grandTotal} JOD</span>
            </div>

            <button 
              type="submit" 
              form="checkout-form"
              className="btn-primary" 
              style={{ width: '100%' }}
              disabled={isSubmitting}
            >
              {isSubmitting 
                ? (lang === 'ar' ? 'جاري التنفيذ...' : 'Processing...') 
                : (lang === 'ar' ? 'تأكيد الطلب' : 'Place Order')}
            </button>
          </div>
        </div>

      </div>

      {placedOrderId && <OrderConfirmationModal orderId={placedOrderId} />}
    </div>
  );
}
