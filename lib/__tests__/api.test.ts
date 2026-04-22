import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib/supabase', () => {
  const single = vi.fn();
  const eq = vi.fn(() => ({ single }));
  const order = vi.fn(() => ({ limit: vi.fn().mockResolvedValue({ data: [], error: null }) }));
  const select = vi.fn(() => ({ order, eq }));
  return {
    supabase: {
      from: vi.fn(() => ({ select })),
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
  const input = {
    company: 'Acme', dept: 'IT', scale: 'medium', biz: 'tech',
    name: '홍길동', pos: 'CTO', phone: '010-1234-5678',
    email: 'a@b.com', msg: '문의',
  };

  beforeEach(() => {
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'https://test.supabase.co');
  });

  it('posts legacy-shaped payload to the swift-service edge function', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      status: 200,
      json: async () => ({ success: true }),
    });
    vi.stubGlobal('fetch', fetchMock);

    await submitContact(input);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('https://test.supabase.co/functions/v1/swift-service');
    expect(init.method).toBe('POST');
    const body = JSON.parse(init.body as string);
    expect(body).toEqual({
      company: 'Acme',
      biz: 'tech',
      namepos: '홍길동 / CTO',
      phone: '010-1234-5678',
      email: 'a@b.com',
      msg: '문의',
    });
  });

  it('throws when server returns success: false', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      status: 400,
      json: async () => ({ success: false, error: 'bad' }),
    });
    vi.stubGlobal('fetch', fetchMock);

    await expect(submitContact(input)).rejects.toThrow('bad');
  });
});
