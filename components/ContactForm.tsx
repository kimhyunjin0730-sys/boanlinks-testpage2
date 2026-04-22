'use client';
import { useContactForm, validateContact } from '@/hooks/useContactForm';
import { submitContact } from '@/lib/api';
import { useToast } from '@/components/ToastProvider';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

const SCALES = ['소규모', '중소규모', '중견기업', '대기업'];
const BIZ = ['제조', 'IT/SW', '금융', '공공', '의료', '교육', '기타'];

function field(label: string, required = false) {
  return (
    <label className="block text-sm font-semibold text-navy mb-1.5">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
  );
}

export function ContactForm() {
  const { values, errors, setErrors, submitting, setSubmitting, update, reset } = useContactForm();
  const toast = useToast();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const v = validateContact(values);
    setErrors(v);
    if (Object.keys(v).length > 0) {
      toast.show('error', '필수 항목을 확인해주세요.');
      return;
    }
    setSubmitting(true);
    try {
      await submitContact(values);
      toast.show('success', '문의가 접수되었습니다.', '담당자가 곧 연락드립니다.');
      reset();
    } catch (e) {
      toast.show('error', '전송 실패', (e as Error).message);
    } finally {
      setSubmitting(false);
    }
  }

  const inputCls = (err?: string) =>
    cn(
      'w-full rounded-lg border bg-white px-4 py-3 text-sm outline-none transition-colors',
      err ? 'border-red-400 focus:border-red-500 animate-shake' : 'border-border focus:border-primary',
    );

  return (
    <form onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-2">
      <div>
        {field('회사명', true)}
        <input className={inputCls(errors.company)} value={values.company} onChange={(e) => update('company', e.target.value)} />
        {errors.company && <p className="mt-1 text-xs text-red-500">{errors.company}</p>}
      </div>
      <div>
        {field('부서')}
        <input className={inputCls(errors.dept)} value={values.dept} onChange={(e) => update('dept', e.target.value)} />
      </div>
      <div>
        {field('기업 규모')}
        <select className={inputCls(errors.scale)} value={values.scale} onChange={(e) => update('scale', e.target.value)}>
          <option value="">선택</option>
          {SCALES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <div>
        {field('업종')}
        <select className={inputCls(errors.biz)} value={values.biz} onChange={(e) => update('biz', e.target.value)}>
          <option value="">선택</option>
          {BIZ.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <div>
        {field('이름', true)}
        <input className={inputCls(errors.name)} value={values.name} onChange={(e) => update('name', e.target.value)} />
        {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
      </div>
      <div>
        {field('직책')}
        <input className={inputCls(errors.pos)} value={values.pos} onChange={(e) => update('pos', e.target.value)} />
      </div>
      <div>
        {field('연락처', true)}
        <input className={inputCls(errors.phone)} value={values.phone} onChange={(e) => update('phone', e.target.value)} placeholder="010-0000-0000" />
        {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
      </div>
      <div>
        {field('이메일', true)}
        <input type="email" className={inputCls(errors.email)} value={values.email} onChange={(e) => update('email', e.target.value)} />
        {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
      </div>
      <div className="md:col-span-2">
        {field('문의 내용', true)}
        <textarea rows={6} className={inputCls(errors.msg)} value={values.msg} onChange={(e) => update('msg', e.target.value)} />
        {errors.msg && <p className="mt-1 text-xs text-red-500">{errors.msg}</p>}
      </div>
      <div className="md:col-span-2 flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={reset} disabled={submitting}>초기화</Button>
        <Button type="submit" disabled={submitting}>{submitting ? '전송 중...' : '문의 접수'}</Button>
      </div>
    </form>
  );
}
