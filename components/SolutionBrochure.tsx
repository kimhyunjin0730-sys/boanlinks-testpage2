import type { Solution } from '@/types';

/**
 * Renders the marketplace-style brochure section for a solution.
 * Pulls structured fields from `solution.brochure` (sourced from the official 소개자료 PDF/PPTX)
 * and lays them out as: hero stats → customer segments → threats → values
 *  → features → tech highlights → pricing → market trends → closing message.
 *
 * Designed to mirror the brochure visually (dark hero, glow accents) while
 * keeping the rest of the page on the lighter site palette.
 */
export function SolutionBrochure({ solution }: { solution: Solution }) {
  const b = solution.brochure;
  if (!b) return null;

  const accent = solution.color;

  return (
    <div className="space-y-20">
      {/* Hero / Stats banner */}
      <section
        aria-labelledby="brochure-overview"
        className="rounded-3xl bg-navy text-white p-8 md:p-12 shadow-xl relative overflow-hidden"
      >
        <div
          aria-hidden
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 60% 60% at 30% 20%, ${accent}55, transparent 60%)`,
          }}
        />
        <div className="relative">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-cyan-300">개요</p>
          <h2
            id="brochure-overview"
            className="mt-3 text-2xl md:text-4xl font-extrabold leading-tight text-gradient-cyan"
          >
            {b.tagline}
          </h2>
          <p className="mt-5 max-w-3xl text-sm md:text-base leading-relaxed text-slate-300">
            {b.summary}
          </p>

          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            {b.stats.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-5"
              >
                <p className="text-2xl md:text-3xl font-extrabold text-cyan-300">{s.value}</p>
                <p className="mt-1 text-sm font-semibold">{s.label}</p>
                {s.caption && (
                  <p className="mt-1 text-xs text-slate-400 leading-relaxed">{s.caption}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Customer segments table */}
      {b.customerSegments && b.customerSegments.length > 0 && (
        <section aria-labelledby="brochure-segments">
          <header className="mb-6">
            <p className="text-xs font-bold tracking-[0.2em] uppercase" style={{ color: accent }}>
              고객 유형
            </p>
            <h3 id="brochure-segments" className="mt-2 text-xl md:text-2xl font-bold text-navy">
              규모와 업종에 맞는 보안 구조
            </h3>
          </header>
          <div className="overflow-hidden rounded-2xl border border-border bg-white">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="p-4 font-semibold w-1/4">고객 유형</th>
                  <th className="p-4 font-semibold w-1/3">필요 사항</th>
                  <th className="p-4 font-semibold">보안링스 제안</th>
                </tr>
              </thead>
              <tbody>
                {b.customerSegments.map((row) => (
                  <tr key={row.type} className="border-t border-border align-top">
                    <td className="p-4 font-bold text-navy">{row.type}</td>
                    <td className="p-4 text-slate-700 leading-relaxed">{row.need}</td>
                    <td className="p-4 text-slate-700 leading-relaxed">{row.solution}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Threats grid */}
      {b.threats && b.threats.length > 0 && (
        <section aria-labelledby="brochure-threats">
          <header className="mb-6">
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-rose-500">위협 현황</p>
            <h3 id="brochure-threats" className="mt-2 text-xl md:text-2xl font-bold text-navy">
              왜 지금 보안이 중요한가
            </h3>
          </header>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {b.threats.map((t) => (
              <article
                key={t.title}
                className="rounded-2xl border border-border bg-white p-6 hover:-translate-y-1 hover:shadow-lg transition-all"
              >
                <h4 className="font-bold text-navy">{t.title}</h4>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">{t.description}</p>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Core values */}
      {b.values && b.values.length > 0 && (
        <section aria-labelledby="brochure-values">
          <header className="mb-6">
            <p className="text-xs font-bold tracking-[0.2em] uppercase" style={{ color: accent }}>
              핵심 가치
            </p>
            <h3 id="brochure-values" className="mt-2 text-xl md:text-2xl font-bold text-navy">
              보안링스가 제공하는 가치
            </h3>
          </header>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {b.values.map((v) => (
              <article
                key={v.title}
                className="rounded-2xl border border-border bg-gradient-to-br from-white to-slate-50 p-6 text-center"
              >
                <div
                  className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl text-white text-lg font-bold"
                  style={{ backgroundColor: accent }}
                >
                  ✓
                </div>
                <h4 className="font-bold text-navy">{v.title}</h4>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">{v.description}</p>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Numbered features */}
      {b.featureDetails && b.featureDetails.length > 0 && (
        <section aria-labelledby="brochure-features">
          <header className="mb-6">
            <p className="text-xs font-bold tracking-[0.2em] uppercase" style={{ color: accent }}>
              기능
            </p>
            <h3 id="brochure-features" className="mt-2 text-xl md:text-2xl font-bold text-navy">
              주요 기능 및 서비스
            </h3>
          </header>
          <div className="space-y-3">
            {b.featureDetails.map((f) => (
              <article
                key={f.step}
                className="flex items-start gap-5 rounded-2xl border border-border bg-white p-5 md:p-6"
              >
                <span
                  className="flex-shrink-0 inline-flex h-12 w-12 items-center justify-center rounded-xl text-white font-extrabold text-lg"
                  style={{ backgroundColor: accent }}
                >
                  {f.step}
                </span>
                <div>
                  <h4 className="font-bold text-navy">{f.title}</h4>
                  <p className="mt-1 text-sm text-slate-600 leading-relaxed">{f.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Tech highlights */}
      {b.techHighlights && b.techHighlights.length > 0 && (
        <section aria-labelledby="brochure-tech">
          <header className="mb-6">
            <p className="text-xs font-bold tracking-[0.2em] uppercase" style={{ color: accent }}>
              기술
            </p>
            <h3 id="brochure-tech" className="mt-2 text-xl md:text-2xl font-bold text-navy">
              기술적 특장점
            </h3>
          </header>
          <div className="grid gap-4 md:grid-cols-2">
            {b.techHighlights.map((t) => (
              <article key={t.title} className="rounded-2xl border border-border bg-white p-6">
                <h4 className="font-bold text-navy">{t.title}</h4>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">{t.description}</p>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Pricing */}
      {b.pricingTiers && b.pricingTiers.length > 0 && (
        <section aria-labelledby="brochure-pricing">
          <header className="mb-6">
            <p className="text-xs font-bold tracking-[0.2em] uppercase" style={{ color: accent }}>
              요금제
            </p>
            <h3 id="brochure-pricing" className="mt-2 text-xl md:text-2xl font-bold text-navy">
              구독 모델
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              기업 규모와 필요에 맞는 유연한 요금제를 선택하세요. 모든 요금제는 진단·보고서·제품 추천을 포함합니다.
            </p>
          </header>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {b.pricingTiers.map((tier) => (
              <article
                key={tier.name}
                className={`relative rounded-2xl border p-6 transition-all ${
                  tier.highlight
                    ? 'border-primary shadow-lg -translate-y-1 bg-white ring-1 ring-primary/30'
                    : 'border-border bg-white'
                }`}
              >
                {tier.highlight && (
                  <span className="absolute -top-3 right-4 rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                    인기
                  </span>
                )}
                <p className="text-sm font-semibold text-slate-500">{tier.name}</p>
                <p className="mt-2 text-2xl font-extrabold text-navy">{tier.price}</p>
                <ul className="mt-4 space-y-2">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-slate-700">
                      <span style={{ color: accent }} className="mt-0.5 font-bold">
                        ✓
                      </span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Market trends */}
      {b.marketTrends && b.marketTrends.length > 0 && (
        <section aria-labelledby="brochure-market">
          <header className="mb-6">
            <p className="text-xs font-bold tracking-[0.2em] uppercase" style={{ color: accent }}>
              시장 동향
            </p>
            <h3 id="brochure-market" className="mt-2 text-xl md:text-2xl font-bold text-navy">
              시장이 증명하는 필요성
            </h3>
          </header>
          <div className="grid gap-4 md:grid-cols-3">
            {b.marketTrends.map((t) => (
              <article
                key={t.source}
                className="rounded-2xl border border-border bg-white p-6 text-center"
              >
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  {t.source}
                </p>
                <p
                  className="mt-3 text-4xl font-extrabold"
                  style={{ color: accent }}
                >
                  {t.metric}
                </p>
                <p className="mt-2 font-bold text-navy">{t.label}</p>
                <p className="mt-1 text-xs text-slate-500 leading-relaxed">{t.caption}</p>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Closing message */}
      {b.closingMessage && (
        <section
          aria-label="핵심 메시지"
          className="rounded-3xl bg-gradient-to-br from-navy to-slate-850 p-8 md:p-12 text-center text-white"
        >
          <p className="mx-auto max-w-3xl text-base md:text-lg leading-relaxed text-slate-200">
            {b.closingMessage}
          </p>
        </section>
      )}
    </div>
  );
}
