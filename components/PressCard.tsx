import Link from 'next/link';
import Image from 'next/image';
import type { Press } from '@/types';

export function PressCard({ p }: { p: Press }) {
  return (
    <Link
      href={`/press/${p.id}`}
      className="group block overflow-hidden rounded-2xl border border-border bg-white transition-all hover:-translate-y-1 hover:shadow-xl"
    >
      {p.img && (
        <div className="relative aspect-[16/9] bg-slate-100">
          <Image
            src={p.img}
            alt={p.title}
            fill
            sizes="(min-width:768px) 33vw, 100vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}
      <div className="p-5">
        <p className="text-xs font-bold text-primary tracking-wider uppercase">{p.cat || 'NEWS'}</p>
        <h3 className="mt-2 text-base font-bold text-navy line-clamp-2">{p.title}</h3>
        <p className="mt-2 text-sm text-slate-500 line-clamp-2">{p.summary}</p>
        <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
          <span>{p.source}</span>
          <span>·</span>
          <span>{p.date}</span>
        </div>
      </div>
    </Link>
  );
}
