import Link from 'next/link';
import type { Solution } from '@/types';

export function SolutionCard({ s }: { s: Solution }) {
  return (
    <Link
      href={`/solution/${s.id}`}
      className="group block rounded-2xl border border-border bg-white p-7 transition-all hover:-translate-y-1 hover:shadow-xl"
    >
      <div
        className="inline-flex h-12 w-12 items-center justify-center rounded-xl text-white font-bold text-lg mb-4"
        style={{ backgroundColor: s.color }}
      >
        {s.eng.slice(0, 1)}
      </div>
      <p className="text-xs font-bold tracking-wider uppercase" style={{ color: s.color }}>{s.eng}</p>
      <h3 className="mt-2 text-lg font-bold text-navy">{s.title}</h3>
      <p className="mt-2 text-sm text-slate-500 leading-relaxed">{s.sub}</p>
      <p className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-primary group-hover:translate-x-1 transition-transform">
        자세히 보기 →
      </p>
    </Link>
  );
}
