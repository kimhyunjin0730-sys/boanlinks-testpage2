import Link from 'next/link';
import Image from 'next/image';

const COMPANY_LINKS = [
  { href: '/about', label: '회사소개' },
  { href: '/solution', label: '솔루션' },
  { href: '/press', label: '홍보센터' },
  { href: '/contact', label: '문의하기' },
];

export function Footer() {
  return (
    <footer className="bg-navy text-slate-300">
      <div className="wrap py-14 grid gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <Image src="/logo-white.png" alt="Boanlinks" width={160} height={36} />
          <p className="mt-4 text-sm text-slate-400 max-w-md leading-relaxed">
            사이버리스크관리 전문기업 Boanlinks 플랫폼.
          </p>
          <p className="mt-3 text-xs text-slate-500">
            본사: 경기 하남시 미사대로 540, 현대지식산업센터 한강미사2차 비동 614호<br />
            TEL: 010-3241-0427 · FAX: 0504-185-0427 · E-MAIL: biz@boanlinks.com
          </p>
        </div>

        <div>
          <h4 className="text-white text-sm font-bold mb-4">바로가기</h4>
          <ul className="space-y-2 text-sm">
            {COMPANY_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-white transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-white text-sm font-bold mb-4">파트너</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a
                href="https://jinnhyunsecurity.com/"
                target="_blank"
                rel="noopener"
                className="hover:text-white transition-colors"
              >
                진앤현시큐리티
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="wrap py-5 text-xs text-slate-500">
          © {new Date().getFullYear()} Boanlinks. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
