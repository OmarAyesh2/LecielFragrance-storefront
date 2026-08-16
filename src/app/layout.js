import { Inter, Playfair_Display, JetBrains_Mono } from 'next/font/google';
import '../styles/globals.css';
import { LanguageProvider } from '../context/LanguageContext';
import { AuthProvider } from '../context/AuthContext';
import { ToastProvider } from '../context/ToastContext';
import { CartProvider } from '../context/CartContext';
import PromoBar from '../components/layout/PromoBar';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import CartDrawer from '../components/layout/CartDrawer';
import { supabase } from '@/lib/supabase';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });
const jetbrains = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains' });

export async function generateMetadata() {
  const { data } = await supabase.from('site_settings').select('store_name_en').eq('id', 1).single();
  return {
    title: data?.store_name_en || 'Leciel Fragrance',
    description: 'Luxury Fragrance Storefront',
  };
}

export default async function RootLayout({ children }) {
  const { data } = await supabase.from('site_settings').select('favicon_url').eq('id', 1).single();
  const faviconUrl = data?.favicon_url;

  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        {faviconUrl && <link rel="icon" href={faviconUrl} />}
      </head>
      <body className={`${inter.variable} ${playfair.variable} ${jetbrains.variable}`}>
        <LanguageProvider>
          <AuthProvider>
            <ToastProvider>
              <CartProvider>
                <PromoBar />
                <Navbar />
                {children}
                <Footer />
                <CartDrawer />
              </CartProvider>
            </ToastProvider>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
