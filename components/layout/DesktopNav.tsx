import Link from 'next/link';
import { cn } from '@/lib/utils';

const NAV = [
  { href: '/', label: '홈' },
  { href: '/about', label: '회사소개' },
  { href: '/solution', label: '솔루션' },
  { href: '/press', label: '홍보센터' },
  { href: '/contact', label: '문의하기' },
];

export function DesktopNav({ currentPath }: { currentPath: string }) {
  return (
    <nav className="hidden md:flex items-center gap-1">
      {NAV.map((item) => {
        const active = currentPath === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'px-4 py-2 text-sm font-semibold rounded-md transition-colors',
              active ? 'text-primary' : 'text-navy hover:text-primary',
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
