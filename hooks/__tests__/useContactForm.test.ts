import { describe, it, expect } from 'vitest';
import { validateContact } from '@/hooks/useContactForm';

describe('validateContact', () => {
  const valid = {
    company: 'Acme', dept: 'IT', scale: 'medium', biz: 'tech',
    name: '홍길동', pos: 'CTO', phone: '010-1234-5678',
    email: 'a@b.com', msg: '문의합니다.',
  };

  it('passes with valid input', () => {
    expect(validateContact(valid)).toEqual({});
  });

  it('flags empty required fields', () => {
    const errs = validateContact({ ...valid, company: '', name: '', msg: '' });
    expect(errs.company).toBeTruthy();
    expect(errs.name).toBeTruthy();
    expect(errs.msg).toBeTruthy();
  });

  it('flags invalid email', () => {
    const errs = validateContact({ ...valid, email: 'not-an-email' });
    expect(errs.email).toBeTruthy();
  });

  it('flags invalid phone', () => {
    const errs = validateContact({ ...valid, phone: '1234' });
    expect(errs.phone).toBeTruthy();
  });
});
