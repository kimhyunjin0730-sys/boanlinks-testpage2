import type { HeroSlide } from '@/types';

export const HERO_SLIDES: HeroSlide[] = [
  {
    bg: 'dark',
    title: '기업의 보안,<br><span class="text-gradient-cyan">Boanlinks</span>가 함께합니다',
    sub: '최저의 비용으로 최고의 서비스를 약속드립니다.',
    cta1: { label: '무료 보안 점검 받기', href: '/contact' },
    cta2: { label: '솔루션 보기', href: '/solution' },
    badge: 'AI 보안링스 · Boanlinks',
  },
  {
    bg: 'gradient1',
    title:
      '디지털 자산의 근본을 지키는<br><span style="background:linear-gradient(135deg,#fde68a,#f59e0b);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">양자데이터금고 D-GO</span>',
    sub: '복제 방지·무결성 보장·원본 인증까지.<br>중요 자산을 법적 원본과 동일한 효력으로 지킵니다.',
    cta1: { label: '데이터 보호 솔루션 보기', href: '/solution' },
    cta2: { label: '도입 문의', href: '/contact' },
    badge: 'Digital Data Safe Vault · 안전한 원본 보관',
  },
  {
    bg: 'gradient2',
    title:
      '<span class="text-gradient-emerald">24년</span> 보안 전문 업력,<br>귀사의 보안 파트너',
    sub: '보험·법률·기술 전문가가 통합 대응하는 사이버리스크 관리 플랫폼.',
    cta1: { label: '사업 소개 보기', href: '/about' },
    cta2: { label: '파트너 네트워크', href: '/about' },
    badge: 'Boanlinks',
  },
];
