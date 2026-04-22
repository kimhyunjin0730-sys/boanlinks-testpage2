'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { HERO_SLIDES } from '@/data/heroSlides';
import { cn } from '@/lib/utils';

const BG_CLASS: Record<string, string> = {
  dark: 'bg-gradient-to-br from-navy via-slate-850 to-navy',
  gradient1: 'bg-gradient-to-br from-primary to-cyan-300',
  gradient2: 'bg-gradient-to-br from-emerald-600 to-emerald-400',
  light: 'bg-slate-100',
};

export function HeroSlider() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(id);
  }, []);

  const slide = HERO_SLIDES[index];

  return (
    <section
      className={cn('relative overflow-hidden transition-colors duration-700 min-h-[560px] md:min-h-[640px]', BG_CLASS[slide.bg])}
    >
      <div className="wrap relative z-10 flex flex-col justify-center min-h-[inherit] py-20">
        <Badge className="self-start bg-white/10 border-white/20 text-white/90">{slide.badge}</Badge>
        <h1
          className="mt-5 text-white font-bold leading-[1.15] text-4xl md:text-6xl max-w-3xl"
          dangerouslySetInnerHTML={{ __html: slide.title }}
        />
        <p className="mt-5 text-white/80 text-base md:text-lg max-w-2xl">{slide.sub}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href={slide.cta1.href}><Button size="lg">{slide.cta1.label}</Button></Link>
          <Link href={slide.cta2.href}>
            <Button size="lg" variant="ghost">{slide.cta2.label} →</Button>
          </Link>
        </div>
        <div className="mt-10 flex gap-2">
          {HERO_SLIDES.map((_, i) => (
            <button
              key={i}
              aria-label={`슬라이드 ${i + 1}`}
              onClick={() => setIndex(i)}
              className={cn(
                'h-1.5 rounded-full transition-all',
                i === index ? 'w-10 bg-white' : 'w-5 bg-white/30',
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
