import { ScrollReveal } from '@/components/ScrollReveal';
import { ContactForm } from '@/components/ContactForm';

export default function ContactPage() {
  return (
    <>
      <ScrollReveal />
      <section className="py-24 bg-slate-50">
        <div className="wrap max-w-3xl">
          <div className="fu text-center mb-12">
            <p className="text-primary text-sm font-bold tracking-[.12em] uppercase">Contact</p>
            <h1 className="mt-3 text-3xl md:text-5xl font-bold text-navy">무료 보안 점검 문의</h1>
            <p className="mt-5 text-slate-600">전문가가 30분 내 분석 결과를 회신드립니다.</p>
          </div>
          <div className="fu rounded-2xl border border-border bg-white p-6 md:p-10">
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
