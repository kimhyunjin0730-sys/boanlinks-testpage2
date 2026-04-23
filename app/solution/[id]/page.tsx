import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { SOLUTIONS } from '@/data/solutions';
import { SolutionBrochure } from '@/components/SolutionBrochure';
import { PdfViewer } from '@/components/PdfViewer';

type RouteParams = { id: string };

export function generateStaticParams(): RouteParams[] {
  return SOLUTIONS.map((s) => ({ id: s.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { id } = await params;
  const sol = SOLUTIONS.find((s) => s.id === id);
  if (!sol) return { title: '솔루션 - Boanlinks' };
  return {
    title: `${sol.title} (${sol.eng}) - Boanlinks`,
    description: sol.brochure?.summary ?? sol.overview,
  };
}

export default async function SolutionDetailPage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { id } = await params;
  const solution = SOLUTIONS.find((s) => s.id === id);
  if (!solution) notFound();

  const accent = solution.color;
  const hasBrochure = Boolean(solution.brochure);

  return (
    <main>
      {/* Hero */}
      <section
        aria-labelledby="solution-title"
        className="relative overflow-hidden bg-navy text-white"
      >
        <div
          aria-hidden
          className="absolute inset-0 opacity-40"
          style={{
            background: `radial-gradient(ellipse 70% 60% at 30% 20%, ${accent}66, transparent 60%)`,
          }}
        />
        <div className="relative wrap py-16 md:py-24">
          <nav aria-label="breadcrumb" className="mb-4 text-xs text-slate-400">
            <Link href="/" className="hover:text-white">
              홈
            </Link>
            <span className="mx-2">/</span>
            <Link href="/solution" className="hover:text-white">
              솔루션
            </Link>
            <span className="mx-2">/</span>
            <span className="text-white">{solution.title}</span>
          </nav>

          <p
            className="text-xs font-bold tracking-[0.2em] uppercase"
            style={{ color: accent }}
          >
            {solution.eng}
          </p>
          <h1
            id="solution-title"
            className="mt-3 text-3xl md:text-5xl font-extrabold leading-tight"
          >
            {solution.title}
          </h1>
          <p className="mt-4 text-base md:text-lg text-slate-300">{solution.sub}</p>

          <p className="mt-6 max-w-3xl text-sm md:text-base text-slate-300 leading-relaxed">
            {solution.overview}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-[.625rem] bg-white text-navy px-6 py-3 text-sm font-bold transition-all hover:-translate-y-[1px] hover:bg-slate-100"
              style={{ color: accent }}
            >
              도입 문의하기
            </Link>
          </div>
        </div>
      </section>

      {/* Quick feature list (always shown) */}
      <section className="bg-white py-12 md:py-16 border-b border-border">
        <div className="wrap">
          <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-slate-500">
            핵심 기능
          </h2>
          <ul className="mt-4 grid gap-3 md:grid-cols-2">
            {solution.features.map((f) => (
              <li
                key={f}
                className="flex items-start gap-3 rounded-xl border border-border bg-slate-50 p-4"
              >
                <span
                  className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full text-white text-xs font-bold"
                  style={{ backgroundColor: accent }}
                >
                  ✓
                </span>
                <span className="text-sm text-navy leading-relaxed">{f}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Brochure (only when data is present, e.g. 보안마켓플레이스) */}
      {hasBrochure && (
        <section className="bg-slate-50 py-16 md:py-24">
          <div className="wrap">
            <SolutionBrochure solution={solution} />
          </div>
        </section>
      )}

      {/* CTA footer */}
      <section className="bg-white py-16">
        <div className="wrap text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-navy">
            {solution.title} 도입을 검토 중이신가요?
          </h2>
          <p className="mt-3 text-slate-600">
            전담 컨설턴트가 기업 환경에 맞는 최적 구성을 제안해 드립니다.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-[.625rem] bg-primary text-white px-7 py-3 text-sm font-bold hover:bg-primary-dark hover:-translate-y-[1px] transition-all"
            >
              무료 상담 신청
            </Link>
            {hasBrochure && solution.brochure?.pdfUrl && (
              <PdfViewer
                pdfUrl={solution.brochure.pdfUrl}
                slideImages={solution.brochure.slideImages}
                downloadName={`${solution.eng}-소개서.pdf`}
                triggerLabel="소개서 보기 (PDF)"
              />
            )}
            <Link
              href="/solution"
              className="inline-flex items-center justify-center rounded-[.625rem] bg-transparent text-navy border border-border px-7 py-3 text-sm font-semibold hover:bg-slate-50 transition-all"
            >
              다른 솔루션 보기
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
