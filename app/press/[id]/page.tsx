import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ScrollReveal } from '@/components/ScrollReveal';
import { Button } from '@/components/ui/Button';
import { fetchPressById } from '@/lib/api';

export default async function PressDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const n = Number(id);
  if (!Number.isFinite(n)) notFound();

  const p = await fetchPressById(n);
  if (!p) notFound();

  return (
    <>
      <ScrollReveal />
      <article className="py-16 md:py-24 bg-white">
        <div className="wrap max-w-3xl">
          <p className="fu text-xs font-bold text-primary tracking-wider uppercase">{p.cat || 'NEWS'}</p>
          <h1 className="fu mt-3 text-2xl md:text-4xl font-bold text-navy leading-tight">{p.title}</h1>
          <div className="fu mt-4 flex items-center gap-2 text-sm text-slate-400">
            <span>{p.source}</span><span>·</span><span>{p.date}</span>
          </div>
          {p.img && (
            <div className="fu relative aspect-[16/9] bg-slate-100 rounded-2xl overflow-hidden mt-8">
              <Image src={p.img} alt={p.title} fill sizes="(min-width:768px) 720px, 100vw" className="object-cover" />
            </div>
          )}
          <div className="fu mt-8 text-slate-700 leading-loose whitespace-pre-line">{p.content || p.summary}</div>

          <div className="fu mt-12 flex flex-wrap gap-3">
            <Link href="/press"><Button variant="outline">← 목록으로</Button></Link>
            {p.origin_url && (
              <a href={p.origin_url} target="_blank" rel="noopener">
                <Button>원문 보기 ↗</Button>
              </a>
            )}
          </div>
        </div>
      </article>
    </>
  );
}
