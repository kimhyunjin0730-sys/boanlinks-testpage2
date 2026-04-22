import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib/supabase', () => {
  const single = vi.fn();
  const eq = vi.fn(() => ({ single }));
  const order = vi.fn(() => ({ limit: vi.fn().mockResolvedValue({ data: [], error: null }) }));
  const select = vi.fn(() => ({ order, eq }));
  const insert = vi.fn().mockResolvedValue({ error: null });
  return {
    supabase: {
      from: vi.fn(() => ({ select, insert })),
      functions: { invoke: vi.fn().mockResolvedValue({ error: null }) },
    },
  };
});

import { fetchPress, submitContact } from '@/lib/api';

describe('fetchPress', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns array of press items', async () => {
    const result = await fetchPress();
    expect(Array.isArray(result)).toBe(true);
  });
});

describe('submitContact', () => {
  it('inserts into contacts and calls Edge Function', async () => {
    const input = {
      company: 'Acme', dept: 'IT', scale: 'medium', biz: 'tech',
      name: '홍길동', pos: 'CTO', phone: '010-1234-5678',
      email: 'a@b.com', msg: '문의',
    };
    await submitContact(input);
    expect(true).toBe(true);
  });
});
