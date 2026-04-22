import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <section className="wrap py-32 text-center">
      <p className="text-primary text-sm font-bold tracking-wider uppercase">404</p>
      <h1 className="text-3xl md:text-5xl font-bold mt-3">페이지를 찾을 수 없습니다</h1>
      <p className="mt-4 text-slate-500">요청하신 페이지가 이동되었거나 존재하지 않습니다.</p>
      <Link href="/" className="inline-block mt-8"><Button>홈으로 돌아가기</Button></Link>
    </section>
  );
}
