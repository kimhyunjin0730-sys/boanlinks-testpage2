'use client';
import { useState } from 'react';
import type { ContactInput } from '@/types';

export type ContactErrors = Partial<Record<keyof ContactInput, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[\d\-\s()+]{9,}$/;

export function validateContact(v: ContactInput): ContactErrors {
  const errs: ContactErrors = {};
  if (!v.company.trim()) errs.company = '회사명을 입력해주세요.';
  if (!v.name.trim()) errs.name = '이름을 입력해주세요.';
  if (!v.phone.trim() || !PHONE_RE.test(v.phone)) errs.phone = '유효한 연락처를 입력해주세요.';
  if (!v.email.trim() || !EMAIL_RE.test(v.email)) errs.email = '유효한 이메일을 입력해주세요.';
  if (!v.msg.trim()) errs.msg = '문의 내용을 입력해주세요.';
  return errs;
}

const EMPTY: ContactInput = {
  company: '', dept: '', scale: '', biz: '',
  name: '', pos: '', phone: '', email: '', msg: '',
};

export function useContactForm() {
  const [values, setValues] = useState<ContactInput>(EMPTY);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [submitting, setSubmitting] = useState(false);

  function update<K extends keyof ContactInput>(key: K, value: ContactInput[K]) {
    setValues((v) => ({ ...v, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function reset() {
    setValues(EMPTY);
    setErrors({});
  }

  return { values, errors, setErrors, submitting, setSubmitting, update, reset };
}
