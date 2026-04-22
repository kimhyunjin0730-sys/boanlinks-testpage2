import Link from 'next/link';
import Image from 'next/image';
import { headers } from 'next/headers';
import { DesktopNav } from './DesktopNav';
import { MobileMenu } from './MobileMenu';
import { Button } from '@/components/ui/Button';

export async function Header() {
  const h = await headers();
  const currentPath = h.get('x-pathname') ?? '/';

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-border">
      <div className="wrap flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo-color.png" alt="Boanlinks" width={140} height={32} priority />
        </Link>
        <DesktopNav currentPath={currentPath} />
        <div className="flex items-center gap-2">
          <Link href="/contact" className="hidden md:inline-flex">
            <Button size="sm">무료 보안 점검</Button>
          </Link>
          <MobileMenu currentPath={currentPath} />
        </div>
      </div>
    </header>
  );
}
