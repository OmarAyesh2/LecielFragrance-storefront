"use client";
import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/lib/supabase';

export default function ContactClient({ settings }) {
  const { lang, t } = useLanguage();
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    
    const formData = new FormData(e.target);
    const name = formData.get('name');
    const email = formData.get('email');
    const subject = formData.get('subject');
    const message = formData.get('message');
    
    try {
      const { error } = await supabase
        .from('contact_messages')
        .insert([{ name, email, subject, message }]);
        
      if (error) throw error;
      
      alert(lang === 'ar' ? 'شكراً لك! تم إرسال رسالتك بنجاح.' : 'Thank you! Your message has been sent successfully.');
      e.target.reset();
    } catch (err) {
      console.error('Error sending message:', err);
      alert(lang === 'ar' ? 'حدث خطأ. يرجى المحاولة مرة أخرى.' : 'Something went wrong. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <main className="container" style={{ paddingTop: 'var(--space-12)', paddingBottom: 'var(--space-20)' }}>
      <div style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
        <p className="tracking-label" style={{ color: 'var(--color-accent)', marginBottom: 'var(--space-2)' }}>
          {lang === 'ar' ? 'تواصل معنا' : 'CLIENT CONCIERGE'}
        </p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.25rem, 5vw, 3.5rem)', letterSpacing: '-0.02em', marginBottom: 'var(--space-3)' }}>
          {t('nav.contact') || 'Contact Us'}
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', maxWidth: '540px', margin: '0 auto', fontSize: 'var(--text-base)', lineHeight: 1.6 }}>
          {lang === 'ar' ? 'نحن هنا لمساعدتك في أي استفسار أو لترتيب موعد تجربة العطور.' : 'We are here to assist you with inquiries, bespoke orders, or scent consultation appointments.'}
        </p>
      </div>

      <div className="contact-grid">
        
        {/* Left Column: Contact Info */}
        <div className="contact-info animate-fade-in-up" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', marginBottom: 'var(--space-2)' }}>
            {lang === 'ar' ? 'ابقى على تواصل' : 'Get in Touch'}
          </h2>
          
          <div className="contact-item glass-card" style={{ padding: 'var(--space-5)', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
            <div className="contact-icon" style={{ background: 'rgba(212, 175, 55, 0.1)', color: 'var(--color-accent)', width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-1)' }}>{lang === 'ar' ? 'الهاتف' : 'Phone'}</div>
              <a href={`tel:${settings?.phone}`} style={{ color: 'var(--color-text-primary)', fontWeight: 500 }}>{settings?.phone || '+1 234 567 890'}</a>
            </div>
          </div>

          <div className="contact-item glass-card" style={{ padding: 'var(--space-5)', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
            <div className="contact-icon" style={{ background: 'rgba(212, 175, 55, 0.1)', color: 'var(--color-accent)', width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-1)' }}>{lang === 'ar' ? 'البريد الإلكتروني' : 'Email'}</div>
              <a href={`mailto:${settings?.email}`} style={{ color: 'var(--color-text-primary)', fontWeight: 500 }}>{settings?.email || 'hello@lecielfragrance.com'}</a>
            </div>
          </div>

          <div className="contact-item glass-card" style={{ padding: 'var(--space-5)', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
            <div className="contact-icon" style={{ background: 'rgba(212, 175, 55, 0.1)', color: 'var(--color-accent)', width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-1)' }}>{lang === 'ar' ? 'العنوان' : 'Address'}</div>
              <div style={{ color: 'var(--color-text-primary)', fontWeight: 500, lineHeight: 1.5 }}>{settings ? settings[`address_${lang}`] : 'Amman, Jordan'}</div>
            </div>
          </div>

          <div style={{ marginTop: 'var(--space-4)' }}>
            <h3 style={{ fontSize: 'var(--text-base)', marginBottom: 'var(--space-3)', color: 'var(--color-text-secondary)' }}>
              {lang === 'ar' ? 'تابعنا على وسائل التواصل' : 'Follow Our Journey'}
            </h3>
            <div className="social-links" style={{ display: 'flex', gap: 'var(--space-4)' }}>
              {settings?.instagram_url && (
                <a href={settings.instagram_url} target="_blank" rel="noreferrer" aria-label="Instagram" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '50%', background: 'var(--color-bg-secondary)', border: 'var(--glass-border)', color: 'var(--color-text-primary)', transition: 'all var(--transition-fast)' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>
              )}
              {settings?.facebook_url && (
                <a href={settings.facebook_url} target="_blank" rel="noreferrer" aria-label="Facebook" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '50%', background: 'var(--color-bg-secondary)', border: 'var(--glass-border)', color: 'var(--color-text-primary)', transition: 'all var(--transition-fast)' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3.8l.2-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Contact Form */}
        <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <form onSubmit={handleSubmit} className="glass-card" style={{ padding: 'clamp(var(--space-6), 4vw, var(--space-8))', borderRadius: 'var(--radius-xl)' }}>
            <div className="form-group">
              <label className="form-label">{lang === 'ar' ? 'الاسم' : 'Name'}</label>
              <input type="text" name="name" className="form-input" required />
            </div>
            
            <div className="form-group">
              <label className="form-label">{lang === 'ar' ? 'البريد الإلكتروني' : 'Email'}</label>
              <input type="email" name="email" className="form-input" required />
            </div>

            <div className="form-group">
              <label className="form-label">{lang === 'ar' ? 'الموضوع' : 'Subject'}</label>
              <input type="text" name="subject" className="form-input" required />
            </div>

            <div className="form-group">
              <label className="form-label">{lang === 'ar' ? 'الرسالة' : 'Message'}</label>
              <textarea name="message" className="form-textarea" rows="4" required></textarea>
            </div>

            <button type="submit" className="btn-primary" style={{ marginTop: 'var(--space-6)', width: '100%' }} disabled={sending}>
              {sending ? (lang === 'ar' ? 'جاري الإرسال...' : 'Sending...') : (lang === 'ar' ? 'إرسال الرسالة' : 'Send Message')}
            </button>
          </form>
        </div>

      </div>
    </main>
  );
}
