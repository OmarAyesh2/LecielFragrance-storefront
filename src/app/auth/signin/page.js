"use client";

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignInPage() {
  const { signIn } = useAuth();
  const { lang, t } = useLanguage();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: signInError } = await signIn(email, password);

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
    } else {
      router.push('/');
    }
  };

  return (
    <main className="container" style={{ paddingTop: 'var(--space-16)', paddingBottom: 'var(--space-16)', display: 'flex', justifyContent: 'center' }}>
      <div className="auth-card animate-fade-in-up" style={{ width: '100%', maxWidth: '400px', background: 'var(--color-bg-secondary)', padding: 'var(--space-8)', borderRadius: 'var(--radius-lg)' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-3xl)', textAlign: 'center', marginBottom: 'var(--space-8)' }}>
          {t('nav.signIn') || 'Sign In'}
        </h1>

        {error && (
          <div style={{ background: 'var(--color-error)', color: 'white', padding: 'var(--space-3)', borderRadius: 'var(--radius-sm)', marginBottom: 'var(--space-4)', fontSize: 'var(--text-sm)' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
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
            />
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: 'var(--space-4)' }} disabled={loading}>
            {loading ? (lang === 'ar' ? 'جاري تسجيل الدخول...' : 'Signing in...') : (t('nav.signIn') || 'Sign In')}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 'var(--space-6)', color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
          {lang === 'ar' ? 'ليس لديك حساب؟ ' : "Don't have an account? "}
          <Link href="/auth/register" style={{ color: 'var(--color-accent)', textDecoration: 'underline' }}>
            {t('nav.register') || 'Register'}
          </Link>
        </p>
      </div>
    </main>
  );
}
