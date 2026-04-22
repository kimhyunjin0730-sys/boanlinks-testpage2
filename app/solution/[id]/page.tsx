import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ScrollReveal } from '@/components/ScrollReveal';
import { Button } from '@/components/ui/Button';
import { SOLUTIONS } from '@/data/solutions';

export function generateStaticParams() {
  return SOLUTIONS.map((s) => ({ id: s.id }));
}

export default async function SolutionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const s = SOLUTIONS.find((x) => x.id === id);
  if (!s) notFound();

  return (
    <>
      <ScrollReveal />
      <section className="py-24 bg-gradient-to-br from-navy via-slate-850 to-navy text-white">
        <div className="wrap">
          <p className="fu text-xs font-bold tracking-[.12em] uppercase" style={{ color: s.color }}>
            {s.eng}
          </p>
          <h1 className="fu mt-3 text-3xl md:text-5xl font-bold leading-tight max-w-3xl">
            {s.title}
          </h1>
          <p className="fu mt-4 text-white/80 text-base md:text-lg max-w-2xl">{s.sub}</p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="wrap max-w-4xl">
          <div className="fu">
            <h2 className="text-xl md:text-2xl font-bold text-navy mb-4">Overview</h2>
            <p className="text-slate-700 leading-loose">{s.overview}</p>
          </div>

          <div className="fu mt-14">
            <h2 className="text-xl md:text-2xl font-bold text-navy mb-6">핵심 기능</h2>
            <ul className="space-y-3">
              {s.features.map((f, i) => (
                <li key={i} className="flex gap-3 text-slate-700">
                  <span className="mt-1 h-2 w-2 rounded-full flex-shrink-0" style={{ backgroundColor: s.color }} />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="fu mt-14 flex gap-3">
            <Link href="/contact"><Button size="lg">도입 문의 →</Button></Link>
            <Link href="/solution"><Button size="lg" variant="outline">다른 솔루션 보기</Button></Link>
          </div>
        </div>
      </section>
    </>
  );
}
