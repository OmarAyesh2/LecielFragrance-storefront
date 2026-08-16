import { supabase } from '@/lib/supabase';
import CheckoutClient from '@/components/checkout/CheckoutClient';

export const revalidate = 60;

export default async function CheckoutPage() {
  const { data: settings } = await supabase
    .from('site_settings')
    .select('*')
    .eq('id', 1)
    .single();

  const { data: deliveryFees } = await supabase
    .from('delivery_fees')
    .select('*')
    .order('governorate_en', { ascending: true });

  return (
    <main>
      <CheckoutClient 
        settings={settings} 
        deliveryFees={deliveryFees || []} 
      />
    </main>
  );
}
