import Link from 'next/link';

export const metadata = {
  title: 'Shipping Policy | Leciel Fragrance',
  description: 'Shipping and Delivery Policy for Leciel Fragrance orders.',
};

export default function ShippingPage() {
  return (
    <div className="container" style={{ padding: 'var(--space-16) clamp(1rem, 5vw, 2rem)', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: 'var(--space-8)', fontFamily: 'var(--font-display)', textAlign: 'center' }}>Shipping Policy</h1>
      
      <div className="prose" style={{ lineHeight: '1.8', color: 'var(--color-text-secondary)' }}>
        <p style={{ marginBottom: 'var(--space-4)' }}>
          Thank you for visiting and shopping at Leciel Fragrance. Following are the terms and conditions that constitute our Shipping Policy.
        </p>
        
        <h2 style={{ color: 'var(--color-text-primary)', marginTop: 'var(--space-8)', marginBottom: 'var(--space-4)', fontSize: 'var(--text-xl)' }}>Domestic Shipping Policy</h2>
        <h3 style={{ color: 'var(--color-text-primary)', marginTop: 'var(--space-4)', marginBottom: 'var(--space-2)', fontSize: 'var(--text-lg)' }}>Shipment processing time</h3>
        <p style={{ marginBottom: 'var(--space-4)' }}>
          All orders are processed within 2-3 business days. Orders are not shipped or delivered on weekends or holidays.
          If we are experiencing a high volume of orders, shipments may be delayed by a few days.
        </p>

        <h2 style={{ color: 'var(--color-text-primary)', marginTop: 'var(--space-8)', marginBottom: 'var(--space-4)', fontSize: 'var(--text-xl)' }}>International Shipping Policy</h2>
        <p style={{ marginBottom: 'var(--space-4)' }}>
          We currently do not ship outside of the designated service areas. Please contact our support team for any special requests.
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
