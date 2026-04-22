'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const ALLOWED = new Set(['/', '/about', '/solution', '/press', '/contact']);

export function HashRedirect() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const h = window.location.hash; // e.g. "#/about"
    if (!h.startsWith('#/')) return;

    const path = h.slice(1); // "/about"
    const clean = path.startsWith('/solution/') || path.startsWith('/press/') ? path : null;
    const target = ALLOWED.has(path) ? path : clean;
    if (!target) return;

    // Clear hash and navigate
    history.replaceState(null, '', target);
    router.replace(target);
  }, [router]);

  return null;
}
