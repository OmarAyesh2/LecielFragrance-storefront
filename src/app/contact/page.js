import { supabase } from '@/lib/supabase';
import ContactClient from '@/components/contact/ContactClient';

export const revalidate = 3600; // 1 hour

export default async function ContactPage() {
  const { data: settings } = await supabase
    .from('site_settings')
    .select('*')
    .eq('id', 1)
    .single();

  return <ContactClient settings={settings} />;
}
