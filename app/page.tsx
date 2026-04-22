import Link from 'next/link';
import { HeroSlider } from '@/components/HeroSlider';
import { SolutionCard } from '@/components/SolutionCard';
import { Button } from '@/components/ui/Button';
import { ScrollReveal } from '@/components/ScrollReveal';
import { SOLUTIONS } from '@/data/solutions';

export default function Home() {
  return (
    <>
      <ScrollReveal />
      <HeroSlider />

      {/* Intro */}
      <section className="py-20 bg-slate-50">
        <div className="wrap">
          <div className="fu text-center max-w-3xl mx-auto">
            <p className="text-primary text-sm font-bold tracking-[.12em] uppercase">Why Boanlinks</p>
            <h2 className="mt-3 text-2xl md:text-4xl font-bold text-navy">
              24년 보안 전문 업력, 귀사의 보안 파트너
            </h2>
            <p className="mt-5 text-slate-600 leading-relaxed">
              보험·법률·기술 전문가가 통합 대응하는 사이버리스크 관리 플랫폼.
            </p>
          </div>
        </div>
      </section>

      {/* Solutions preview */}
      <section className="py-20 bg-white">
        <div className="wrap">
          <div className="fu text-center mb-12">
            <p className="text-primary text-sm font-bold tracking-[.12em] uppercase">Solutions</p>
            <h2 className="mt-3 text-2xl md:text-3xl font-bold text-navy">
              기업을 위한 종합 보안 솔루션
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {SOLUTIONS.map((s) => (
              <div key={s.id} className="fu">
                <SolutionCard s={s} />
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/solution"><Button variant="outline">모든 솔루션 보기 →</Button></Link>
          </div>
        </div>
      </section>

      {/* Partner network */}
      <section className="py-20 bg-gradient-to-br from-navy via-slate-850 to-navy text-white relative overflow-hidden">
        <div className="wrap relative z-10 grid gap-10 lg:grid-cols-2 items-center">
          <div className="fu">
            <p className="text-white/60 text-sm font-bold tracking-[.12em] uppercase">Partner Network</p>
            <h2 className="mt-3 text-2xl md:text-3xl font-bold">주요 파트너 · 네트워크</h2>
            <p className="mt-5 text-white/75 leading-relaxed">
              보안전문가 리포트를 바탕으로 사이버리스크보험, 법률서비스를 제공하고 컴플라이언스 개선 이슈 해결을 위한 보안 조치를 진행합니다.
            </p>
            <ul className="mt-6 space-y-3 text-sm">
              <li>
                <span className="text-primary-300 font-bold">[현대해상]</span>{' '}
                <span className="text-white/80">사이버사고 발생시 부담하는 비용을 최소화하는 맞춤형 사이버보험</span>
              </li>
              <li>
                <span className="text-primary-300 font-bold">[법무법인 로데이터]</span>{' '}
                <span className="text-white/80">보안사고 법률자문 및 법적대응</span>
              </li>
              <li>
                <span className="text-primary-300 font-bold">[진앤현시큐리티]</span>{' '}
                <span className="text-white/80">보안인프라 구축·운영·사고대응·감사지원·보안자문</span>
              </li>
            </ul>
            <div className="mt-8 flex gap-3">
              <Link href="/contact"><Button size="lg">CONTACT US →</Button></Link>
              <Link href="/about"><Button size="lg" variant="ghost">사업 소개 보기</Button></Link>
            </div>
          </div>
          <div className="fu grid grid-cols-2 gap-4">
            {[
              ['8K', '보안전문가'],
              ['100%', '솔루션'],
              ['100%', '사고대응'],
              ['24Y', '보안 업력'],
            ].map(([n, l]) => (
              <div key={l} className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur p-7 text-center">
                <p className="text-3xl font-bold">{n}</p>
                <p className="mt-1 text-sm text-white/65">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary text-white">
        <div className="wrap text-center">
          <h2 className="fu text-2xl md:text-4xl font-bold">무료 보안 점검을 받아보세요</h2>
          <p className="fu mt-4 text-white/85">전문가가 30분 내 분석 결과를 회신드립니다.</p>
          <div className="fu mt-8 flex justify-center gap-3">
            <Link href="/contact"><Button size="lg" variant="outline" className="bg-white text-primary hover:bg-slate-100">문의하기</Button></Link>
          </div>
        </div>
      </section>
    </>
  );
}
