import { supabase } from '@/lib/supabase';
import AboutClient from '@/components/about/AboutClient';

export const revalidate = 3600; // 1 hour

export default async function AboutPage() {
  const { data: settings } = await supabase
    .from('site_settings')
    .select('*')
    .eq('id', 1)
    .single();

  if (!settings) return null;

  return <AboutClient settings={settings} />;
}
