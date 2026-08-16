"use client";

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const { signUp } = useAuth();
  const { lang, t } = useLanguage();
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: signUpError } = await signUp(email, password, fullName);

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
    } else {
      alert(lang === 'ar' ? 'تم إنشاء الحساب بنجاح!' : 'Account created successfully!');
      router.push('/');
    }
  };

  return (
    <main className="container" style={{ paddingTop: 'var(--space-16)', paddingBottom: 'var(--space-16)', display: 'flex', justifyContent: 'center' }}>
      <div className="auth-card animate-fade-in-up" style={{ width: '100%', maxWidth: '400px', background: 'var(--color-bg-secondary)', padding: 'var(--space-8)', borderRadius: 'var(--radius-lg)' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-3xl)', textAlign: 'center', marginBottom: 'var(--space-8)' }}>
          {t('nav.register') || 'Register'}
        </h1>

        {error && (
          <div style={{ background: 'var(--color-error)', color: 'white', padding: 'var(--space-3)', borderRadius: 'var(--radius-sm)', marginBottom: 'var(--space-4)', fontSize: 'var(--text-sm)' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">{lang === 'ar' ? 'الاسم الكامل' : 'Full Name'}</label>
            <input 
              type="text" 
              className="form-input" 
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required 
            />
          </div>

          <div className="form-group">
            <label className="form-label">{lang === 'ar' ? 'البريد الإلكتروني' : 'Email'}</label>
            <input 
              type="email" 
              className="form-input" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>

          <div className="form-group">
            <label className="form-label">{lang === 'ar' ? 'كلمة المرور' : 'Password'}</label>
            <input 
              type="password" 
              className="form-input" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
              minLength={6}
            />
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: 'var(--space-4)' }} disabled={loading}>
            {loading ? (lang === 'ar' ? 'جاري إنشاء الحساب...' : 'Creating account...') : (t('nav.register') || 'Register')}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 'var(--space-6)', color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
          {lang === 'ar' ? 'لديك حساب بالفعل؟ ' : 'Already have an account? '}
          <Link href="/auth/signin" style={{ color: 'var(--color-accent)', textDecoration: 'underline' }}>
            {t('nav.signIn') || 'Sign In'}
          </Link>
        </p>
      </div>
    </main>
  );
}
