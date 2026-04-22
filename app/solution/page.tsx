import { ScrollReveal } from '@/components/ScrollReveal';
import { SolutionCard } from '@/components/SolutionCard';
import { SOLUTIONS } from '@/data/solutions';

export default function SolutionPage() {
  return (
    <>
      <ScrollReveal />
      <section className="py-24 bg-slate-50">
        <div className="wrap">
          <div className="fu text-center mb-12">
            <p className="text-primary text-sm font-bold tracking-[.12em] uppercase">Solutions</p>
            <h1 className="mt-3 text-3xl md:text-5xl font-bold text-navy">
              기업을 위한 종합 보안 솔루션
            </h1>
            <p className="mt-5 text-slate-600 max-w-2xl mx-auto">
              {SOLUTIONS.length}개의 전문 솔루션으로 기업의 보안 리스크를 원스톱 관리합니다.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {SOLUTIONS.map((s) => (
              <div key={s.id} className="fu">
                <SolutionCard s={s} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
