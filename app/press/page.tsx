import { ScrollReveal } from '@/components/ScrollReveal';
import { PressCard } from '@/components/PressCard';
import { fetchPress } from '@/lib/api';

export const revalidate = 300; // refresh at most every 5 minutes

export default async function PressPage() {
  let items: Awaited<ReturnType<typeof fetchPress>> = [];
  let error: string | null = null;
  try {
    items = await fetchPress(30);
  } catch (e) {
    error = (e as Error).message;
  }

  return (
    <>
      <ScrollReveal />
      <section className="py-24 bg-slate-50">
        <div className="wrap">
          <div className="fu text-center mb-12">
            <p className="text-primary text-sm font-bold tracking-[.12em] uppercase">Press Center</p>
            <h1 className="mt-3 text-3xl md:text-5xl font-bold text-navy">홍보센터</h1>
          </div>

          {error ? (
            <div className="text-center text-slate-500 py-20">
              <p>불러오기 실패: {error}</p>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center text-slate-500 py-20">등록된 기사가 없습니다.</div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {items.map((p) => (
                <div key={p.id} className="fu">
                  <PressCard p={p} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
