import Link from 'next/link';

export const metadata = {
  title: 'Terms of Service | Leciel Fragrance',
  description: 'Terms of Service and User Agreement for Leciel Fragrance.',
};

export default function TermsPage() {
  return (
    <div className="container" style={{ padding: 'var(--space-16) clamp(1rem, 5vw, 2rem)', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: 'var(--space-8)', fontFamily: 'var(--font-display)', textAlign: 'center' }}>Terms of Service</h1>
      
      <div className="prose" style={{ lineHeight: '1.8', color: 'var(--color-text-secondary)' }}>
        <p style={{ marginBottom: 'var(--space-4)' }}>
          Welcome to Leciel Fragrance. By accessing or using our website, you agree to be bound by these Terms of Service.
        </p>
        
        <h2 style={{ color: 'var(--color-text-primary)', marginTop: 'var(--space-8)', marginBottom: 'var(--space-4)', fontSize: 'var(--text-xl)' }}>1. Use of Website</h2>
        <p style={{ marginBottom: 'var(--space-4)' }}>
          You must be at least 18 years of age to use this website. By using this website and by agreeing to these terms and conditions you warrant and represent that you are at least 18 years of age.
        </p>

        <h2 style={{ color: 'var(--color-text-primary)', marginTop: 'var(--space-8)', marginBottom: 'var(--space-4)', fontSize: 'var(--text-xl)' }}>2. Products and Pricing</h2>
        <p style={{ marginBottom: 'var(--space-4)' }}>
          All prices are subject to change without notice. We reserve the right to modify or discontinue any product at any time. We shall not be liable to you or to any third-party for any modification, price change, suspension or discontinuance of the Service.
        </p>

        <div style={{ marginTop: 'var(--space-12)', textAlign: 'center' }}>
          <Link href="/" className="btn-primary">
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
