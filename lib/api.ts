import { supabase } from '@/lib/supabase';
import type { Press, ContactInput } from '@/types';

export async function fetchPress(limit = 50): Promise<Press[]> {
  const { data, error } = await supabase
    .from('press')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []) as Press[];
}

export async function fetchPressById(id: number): Promise<Press | null> {
  const { data, error } = await supabase
    .from('press')
    .select('*')
    .eq('id', id)
    .single();
  if (error) {
    if (error.code === 'PGRST116') return null; // not found
    throw error;
  }
  return data as Press;
}

export async function submitContact(input: ContactInput): Promise<void> {
  const { error: insertErr } = await supabase.from('contacts').insert(input);
  if (insertErr) throw insertErr;

  const { error: fnErr } = await supabase.functions.invoke('send-contact-email', {
    body: input,
  });
  if (fnErr) {
    // DB succeeded; log but do not throw — user gets success, team may not receive email
    console.warn('Edge Function send-contact-email failed:', fnErr);
  }
}
