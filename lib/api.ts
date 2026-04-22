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
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL');

  const payload = {
    company: input.company,
    biz: input.biz,
    namepos: input.pos ? `${input.name} / ${input.pos}` : input.name,
    phone: input.phone,
    email: input.email,
    msg: input.msg,
  };

  const res = await fetch(`${url}/functions/v1/swift-service`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!data.success) {
    throw new Error(data.error || `Request failed (${res.status})`);
  }
}
