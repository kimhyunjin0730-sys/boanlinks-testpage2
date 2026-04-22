'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

const NAV = [
  { href: '/', label: '홈' },
  { href: '/about', label: '회사소개' },
  { href: '/solution', label: '솔루션' },
  { href: '/press', label: '홍보센터' },
  { href: '/contact', label: '문의하기' },
];

export function MobileMenu({ currentPath }: { currentPath: string }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        className="md:hidden p-2 text-navy"
        aria-label="메뉴 열기"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          {open ? (
            <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
          ) : (
            <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />
          )}
        </svg>
      </button>

      {open && (
        <div className="fixed inset-x-0 top-16 bottom-0 bg-white z-40 md:hidden">
          <nav className="flex flex-col p-5 gap-1">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  'px-4 py-3 text-base font-semibold rounded-md transition-colors',
                  currentPath === item.href ? 'text-primary bg-primary/5' : 'text-navy hover:bg-slate-50',
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
