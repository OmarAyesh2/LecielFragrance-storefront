"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ProfilePage() {
  const { user, signOut } = useAuth();
  const { lang, t } = useLanguage();
  const router = useRouter();

  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If not logged in, wait a tick and redirect to signin
    if (user === null) {
      router.push('/auth/signin');
      return;
    }

    if (user) {
      const fetchData = async () => {
        setLoading(true);
        // Fetch Profile
        const { data: profileData } = await supabase
          .from('profiles')
          .select('full_name, phone')
          .eq('id', user.id)
          .single();
        
        if (profileData) setProfile(profileData);

        // Fetch Orders (using user_id which is the column we used in checkout)
        // Also handling customer_id just in case there's an alias
        const { data: ordersData } = await supabase
          .from('orders')
          .select('id, created_at, status, total_amount')
          .or(`user_id.eq.${user.id},customer_id.eq.${user.id}`)
          .order('created_at', { ascending: false });

        if (ordersData) setOrders(ordersData);
        setLoading(false);
      };

      fetchData();
    }
  }, [user, router]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  const getLocalizedStatus = (status) => {
    if (!status) return '';
    const map = {
      pending: lang === 'ar' ? 'قيد الانتظار' : 'Pending',
      processing: lang === 'ar' ? 'قيد التجهيز' : 'Processing',
      shipped: lang === 'ar' ? 'تم الشحن' : 'Shipped',
      delivered: lang === 'ar' ? 'تم التوصيل' : 'Delivered',
      cancelled: lang === 'ar' ? 'ملغي' : 'Cancelled',
    };
    return map[status.toLowerCase()] || status;
  };

  if (loading || !user) {
    return (
      <main className="container" style={{ paddingTop: 'var(--space-16)', paddingBottom: 'var(--space-16)', textAlign: 'center' }}>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          {lang === 'ar' ? 'جاري التحميل...' : 'Loading...'}
        </p>
      </main>
    );
  }

  return (
    <main className="container" style={{ paddingTop: 'var(--space-12)', paddingBottom: 'var(--space-20)' }}>
      <div style={{ marginBottom: 'var(--space-10)' }}>
        <p className="tracking-label" style={{ color: 'var(--color-accent)', marginBottom: 'var(--space-2)' }}>
          {lang === 'ar' ? 'لوحة التحكم الشخصية' : 'MEMBER ACCOUNT'}
        </p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.25rem, 5vw, 3.25rem)', letterSpacing: '-0.02em' }}>
          {lang === 'ar' ? 'حسابي' : 'My Account'}
        </h1>
      </div>

      <div className="profile-layout">
        
        {/* Left/Top Column: User Info */}
        <div className="profile-info-card glass-card animate-fade-in-up" style={{ borderRadius: 'var(--radius-xl)', padding: 'var(--space-6)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.25), rgba(212, 175, 55, 0.05))', border: '1px solid var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--text-xl)', color: 'var(--color-accent)', fontWeight: 700 }}>
              {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : (user.email ? user.email.charAt(0).toUpperCase() : 'U')}
            </div>
            <div>
              <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 600 }}>{profile?.full_name || 'Valued Member'}</h2>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>{user.email}</p>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
            <p style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              {profile?.phone || (lang === 'ar' ? 'لم يتم إضافة رقم هاتف' : 'No phone number added')}
            </p>
          </div>

          <button onClick={handleSignOut} className="btn-secondary" style={{ width: '100%', borderColor: 'rgba(239, 68, 68, 0.4)', color: '#f87171' }}>
            {lang === 'ar' ? 'تسجيل الخروج' : 'Sign Out'}
          </button>
        </div>

        {/* Right/Bottom Column: Order History */}
        <div className="profile-orders-section animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', marginBottom: 'var(--space-6)' }}>
            {lang === 'ar' ? 'سجل الطلبات' : 'Order History'}
          </h2>

          {orders.length === 0 ? (
            <div className="glass-card" style={{ padding: 'var(--space-10)', borderRadius: 'var(--radius-xl)', textAlign: 'center' }}>
              <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-6)', fontSize: 'var(--text-base)' }}>
                {lang === 'ar' ? 'لم تقم بإجراء أي طلبات حتى الآن.' : "You haven't placed any orders yet."}
              </p>
              <Link href="/shop" className="btn-primary" style={{ display: 'inline-block', width: 'auto', padding: 'var(--space-3) var(--space-8)' }}>
                {lang === 'ar' ? 'تصفح المتجر' : 'Browse Collection'}
              </Link>
            </div>
          ) : (
            <div className="orders-list">
              {orders.map(order => (
                <div key={order.id} className="order-card">
                  <div className="order-card-header">
                    <div>
                      <span className="order-id">#{order.id.toString().slice(0, 8).toUpperCase()}</span>
                      <span className="order-date">
                        {new Date(order.created_at).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', {
                          year: 'numeric', month: 'long', day: 'numeric'
                        })}
                      </span>
                    </div>
                    <div className={`order-status status-${order.status?.toLowerCase() || 'pending'}`}>
                      {getLocalizedStatus(order.status || 'pending')}
                    </div>
                  </div>
                  <div className="order-card-footer">
                    <span style={{ color: 'var(--color-text-secondary)' }}>
                      {lang === 'ar' ? 'الإجمالي:' : 'Total:'}
                    </span>
                    <span style={{ fontWeight: 600, fontSize: 'var(--text-lg)' }}>
                      {order.total_amount} JOD
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </main>
  );
}
