import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy | Leciel Fragrance',
  description: 'Privacy Policy and data collection practices for Leciel Fragrance.',
};

export default function PrivacyPage() {
  return (
    <div className="container" style={{ padding: 'var(--space-16) clamp(1rem, 5vw, 2rem)', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: 'var(--space-8)', fontFamily: 'var(--font-display)', textAlign: 'center' }}>Privacy Policy</h1>
      
      <div className="prose" style={{ lineHeight: '1.8', color: 'var(--color-text-secondary)' }}>
        <p style={{ marginBottom: 'var(--space-4)' }}>
          At Leciel Fragrance, your privacy is extremely important to us. This Privacy Policy outlines the types of personal information that is received and collected and how it is used.
        </p>
        
        <h2 style={{ color: 'var(--color-text-primary)', marginTop: 'var(--space-8)', marginBottom: 'var(--space-4)', fontSize: 'var(--text-xl)' }}>Information Collection</h2>
        <p style={{ marginBottom: 'var(--space-4)' }}>
          We collect information from you when you register on our site, place an order, subscribe to our newsletter or fill out a form. 
          When ordering or registering on our site, as appropriate, you may be asked to enter your: name, e-mail address, mailing address or phone number.
        </p>

        <h2 style={{ color: 'var(--color-text-primary)', marginTop: 'var(--space-8)', marginBottom: 'var(--space-4)', fontSize: 'var(--text-xl)' }}>Data Protection</h2>
        <p style={{ marginBottom: 'var(--space-4)' }}>
          We implement a variety of security measures to maintain the safety of your personal information when you place an order or enter, submit, or access your personal information.
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
