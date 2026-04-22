import { ScrollReveal } from '@/components/ScrollReveal';
import { MILESTONES } from '@/data/milestones';

const STATS = [
  { value: '24년', label: '보안 전문 업력' },
  { value: '280+', label: '고객사' },
  { value: '220억', label: '연평균 매출' },
  { value: 'CMMC', label: 'PRO 등록 완료' },
];

const CERTS = [
  '신용평가 BBB-',
  '기술평가 A+',
  'INNO-BIZ',
  'MAIN-BIZ',
  'GS인증 1등급',
  '벤처기업 인증',
];

export default function AboutPage() {
  return (
    <>
      <ScrollReveal />

      {/* Overview */}
      <section className="py-24 bg-gradient-to-br from-navy via-slate-850 to-navy text-white">
        <div className="wrap">
          <p className="fu text-primary-300 text-xs font-bold tracking-[.12em] uppercase">BOANLINKS</p>
          <h1 className="fu mt-3 text-3xl md:text-5xl font-bold leading-tight max-w-3xl">
            안전하고 스마트한 세상을 만드는<br />보안리스크관리 전문기업
          </h1>
          <p className="fu mt-6 text-white/80 leading-relaxed max-w-xl">
            24여년간 축적한 기술과 노하우를 기반으로 고객 환경에 최적화된 맞춤형 정보 보안 솔루션 및 서비스를 제공합니다.
          </p>
          <p className="fu mt-3 text-white/80 leading-relaxed max-w-xl">
            Boanlinks는 기업 보안 전문 플랫폼으로, 보안솔루션 구축·운영 전문기업에서 보안리스크관리 전문기업으로 VALUE UP합니다.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-white">
        <div className="wrap grid gap-6 grid-cols-2 md:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="fu rounded-2xl border border-border p-7 text-center">
              <p className="text-3xl md:text-4xl font-bold text-primary">{s.value}</p>
              <p className="mt-2 text-sm text-slate-500">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* History */}
      <section className="py-20 bg-slate-50">
        <div className="wrap">
          <div className="fu text-center mb-12">
            <p className="text-primary text-sm font-bold tracking-[.12em] uppercase">History</p>
            <h2 className="mt-3 text-2xl md:text-3xl font-bold text-navy">주요 연혁</h2>
          </div>
          <div className="space-y-8 max-w-3xl mx-auto">
            {MILESTONES.map((m) => (
              <div key={m.year} className="fu grid grid-cols-[auto_1fr] gap-6">
                <p className="text-2xl font-bold" style={{ color: m.color }}>{m.year}</p>
                <ul className="space-y-2 pt-1 text-slate-700">
                  {m.items.map((i, k) => (
                    <li key={k} className="before:content-['•'] before:mr-2 before:text-primary">{i}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-20 bg-white">
        <div className="wrap">
          <div className="fu text-center mb-12">
            <p className="text-primary text-sm font-bold tracking-[.12em] uppercase">Certifications</p>
            <h2 className="mt-3 text-2xl md:text-3xl font-bold text-navy">인증 및 수상</h2>
          </div>
          <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-6 max-w-4xl mx-auto">
            {CERTS.map((c) => (
              <div key={c} className="fu rounded-lg bg-slate-50 border border-border p-4 text-center text-sm font-semibold text-navy">
                {c}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
