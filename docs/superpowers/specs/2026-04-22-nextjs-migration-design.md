# Next.js Migration Design — boanlinks.com

- **Date:** 2026-04-22
- **Status:** Approved (brainstorming phase)
- **Target:** Full migration from Vanilla SPA → Next.js (App Router) + TypeScript + Tailwind + Vercel

## 1. Context

현재 `boanlinks.com` 사이트는 단일 `index.html` (2,481줄) + `app.js` (935줄) + `styles.css` (285줄) 구조의 vanilla SPA 이다. 해시 라우팅(`#/about`)과 템플릿 리터럴 기반 렌더링으로 5개 페이지(Home, About, Solution, Press, Contact)를 서빙한다. Supabase(press 조회 + contacts 저장 + Edge Function → Resend 이메일), GitHub Actions 크롤러(매일 09:00 KST), 챗봇(하드코딩 Q&A)을 포함한다. GitHub Pages 로 배포 중이며 커스텀 도메인은 `boanlinks.com`.

`index.html` 의 모든 스타일이 인라인 `style` 속성으로 작성되어 있어 유지보수성이 빠르게 악화되고 있다. 또한 TypeScript, HMR, 컴포넌트 재사용 등 모던 프런트엔드 도구의 이점을 전혀 받지 못하고 있다.

## 2. Goals / Non-Goals

### Goals
- 현재 사이트와 **1:1 시각/기능 파리티**를 유지하면서 React 컴포넌트 기반 구조로 전환
- TypeScript 전면 도입
- Tailwind CSS 로 인라인 스타일 전량 치환
- App Router 기반 파일 라우팅 및 클린 URL (`/about`, `/solution/:id`)
- Vercel 호스팅 전환 — Preview 배포 등 모던 DX 확보
- 기존 Supabase 연동, 크롤러, 챗봇 기능 보존

### Non-Goals
- 새 기능 추가 (i18n, 다크모드, 관리자 페이지, 블로그 등)
- 디자인 리뉴얼
- Supabase 스키마 변경
- GitHub Actions 크롤러 재작성

## 3. Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript 5 |
| UI | React 18 |
| Styling | Tailwind CSS 3 (+ `clsx`, `tailwind-merge`) |
| Data | `@supabase/supabase-js` |
| Forms/Validation | 내장 훅 + 기존 검증 로직 재사용 (zod/react-hook-form 불채용) |
| State | React 내장 (`useState`, `useContext`) |
| Testing | Vitest + React Testing Library |
| Hosting | Vercel (Production + Preview) |
| Domain | `boanlinks.com` (DNS: Vercel A/CNAME 레코드) |

## 4. Project Structure (Flat + App Router)

```
boanlinks-testpage2/
├── legacy/                          # 기존 파일 이동 (참고용, 빌드 제외)
│   ├── index.html
│   ├── app.js
│   ├── styles.css
│   └── (기존 로고 PNG)
├── public/
│   ├── logo-color.png
│   ├── logo-white.png
│   └── favicon.ico
├── app/
│   ├── layout.tsx                   # 루트 레이아웃 (Header/Footer/Chatbot/Toast 래핑)
│   ├── page.tsx                     # Home
│   ├── about/page.tsx
│   ├── solution/
│   │   ├── page.tsx                 # 솔루션 목록/탭
│   │   └── [id]/page.tsx            # 상세
│   ├── press/
│   │   ├── page.tsx                 # 목록 (서버 컴포넌트에서 Supabase fetch)
│   │   └── [id]/page.tsx            # 상세 (generateStaticParams)
│   ├── contact/page.tsx             # 폼 ('use client')
│   ├── not-found.tsx
│   └── globals.css                  # Tailwind directives + 전역 토큰/키프레임
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── MobileMenu.tsx           # 'use client'
│   ├── Chatbot.tsx                  # 'use client'
│   ├── ToastProvider.tsx            # 'use client'
│   ├── HeroSlider.tsx               # 'use client'
│   ├── SolutionCard.tsx
│   ├── PressCard.tsx
│   └── ui/
│       ├── Button.tsx
│       └── Badge.tsx
├── hooks/
│   ├── usePress.ts                  # 클라이언트 측 재조회용 (필요 시)
│   ├── useContactForm.ts
│   └── useScrollReveal.ts           # .fu fade-up 애니메이션
├── lib/
│   ├── supabase.ts                  # 클라이언트 싱글톤
│   ├── api.ts                       # fetchPress, submitContact
│   └── utils.ts                     # cn() 등
├── data/
│   ├── solutions.ts                 # 6개 솔루션 정적 데이터
│   ├── heroSlides.ts
│   ├── milestones.ts                # 연혁
│   └── chatbotReplies.ts            # Q&A 매칭 규칙
├── types/
│   └── index.ts                     # Press, Contact, Solution, HeroSlide 등
├── scripts/crawl.js                 # 기존 그대로 (변경 없음)
├── .github/workflows/crawl.yml      # 기존 그대로 (변경 없음)
├── next.config.mjs
├── tailwind.config.ts
├── postcss.config.mjs
├── tsconfig.json
├── .env.example
├── package.json
└── README.md                        # 업데이트
```

## 5. Routing

- App Router 파일 기반 라우팅으로 해시 라우팅(`#/about`)과 커스텀 `go()` 함수를 대체
- 경로: `/`, `/about`, `/solution`, `/solution/:id`, `/press`, `/press/:id`, `/contact`, 404 는 `not-found.tsx`
- 기존 해시 URL(`#/about`) 공유 링크 호환:
  - 루트 `layout.tsx` 상단에 작은 클라이언트 컴포넌트 (`<HashRedirect />`) 추가
  - `useEffect` 로 `window.location.hash` 탐지 → `router.replace('/about')` 로 변환

## 6. Server vs Client Components

| Component | Type | 이유 |
|---|---|---|
| 모든 `page.tsx` (기본값) | Server | SEO/초기 로드 유리 |
| `app/press/page.tsx` | Server | Supabase fetch 를 서버에서 수행 |
| `app/press/[id]/page.tsx` | Server + `generateStaticParams` | 빌드 시 정적 생성 |
| `Header` | Server (모바일 토글만 client 하위 컴포넌트로 분리) | — |
| `Footer` | Server | — |
| `MobileMenu` | Client | 토글 상태 |
| `HeroSlider` | Client | 타이머, 상태 |
| `Chatbot` | Client | 대화 상태, 입력 |
| `ToastProvider` | Client | Context |
| `Contact` 폼 | Client | 입력/검증/제출 |

> **원칙:** 기본은 서버 컴포넌트. 상태·이벤트 핸들러·브라우저 API 가 필요한 말단 컴포넌트에만 `'use client'` 를 붙인다.

## 7. Data Layer

### Supabase 클라이언트 (`lib/supabase.ts`)

```ts
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_KEY!
);
```

### API 함수 (`lib/api.ts`)

- `fetchPress(): Promise<Press[]>` — `press` 테이블 select, `created_at` desc, 서버 컴포넌트에서도 호출 가능
- `fetchPressById(id: string): Promise<Press | null>`
- `submitContact(input: ContactInput): Promise<void>` — `contacts` insert + Edge Function 호출 (Resend 이메일)

### 환경 변수

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_KEY` (publishable, 공개 가능)
- `.env.example` 커밋, 실제 값은 Vercel 프로젝트의 Environment Variables (Production + Preview) 에 설정

### 타입 (`types/index.ts`)

```ts
export type Press = {
  id: number;
  cat: string;
  title: string;
  date: string;
  source: string;
  summary: string;
  img: string;
  content: string;
  origin_url: string;
  created_at: string;
};

export type ContactInput = {
  company: string;
  dept: string;
  scale: string;
  biz: string;
  name: string;
  pos: string;
  phone: string;
  email: string;
  msg: string;
};

export type Solution = {
  id: string;
  title: string;
  eng: string;
  sub: string;
  color: string;
  icon: string | null;
  img1: string;
  img2: string;
  overview: string;
  features: string[];
};

export type HeroSlide = {
  bg: string;
  title: string;
  sub: string;
  cta1: { label: string; href: string };
  cta2: { label: string; href: string };
  badge: string;
};

export type Milestone = {
  year: string;
  color: string;
  items: string[];
};
```

## 8. Styling

### Tailwind 설정 (`tailwind.config.ts`)

- **Colors:** primary `#3b82f6`, 다크 배경 `#0f172a`, `#1e293b`, accents `#67e8f9`, `#93c5fd`, `#34d399`, `#a7f3d0` 등 기존 팔레트 테마화
- **Font:** Pretendard CDN 링크는 `app/layout.tsx` 의 `<head>` 에서 로드, `fontFamily.sans` 에 등록
- **Custom Animations:** 기존 `index.html` 의 keyframes 이식 — `fadeUp` (`.fu`), `floatY`, `pGlow`, `pulse-green`, `scaleIn`, `scrollBounce`, `chatIn`, `bounce`, `ddIn`, `spin`. `@layer utilities` 에 등록하거나 `tailwind.config.ts` 의 `theme.extend.keyframes` / `animation` 에 이식

### 변환 원칙

- 인라인 `style="padding:5rem 0"` → `py-20`
- 표현 난이도 높은 케이스(그라데이션 텍스트 등)는 `app/globals.css` 의 `@layer utilities` 에 이름 부여
- 기존 인라인 값을 **있는 그대로** 변환 — 디자인 변경 없음
- `@media (max-width: 768px)` → `md:` breakpoint
- `.wrap`, `.g2`, `.fu` 등 기존 커스텀 클래스는 `@layer components` 로 이식

## 9. Error Handling

- API 에러 → Toast 노출 ("불러오기 실패, 잠시 후 다시 시도")
- 폼 검증 에러 → 필드 하단 인라인 메시지 + shake 애니메이션 (기존 UX 유지)
- 라우팅 실패 → `app/not-found.tsx`
- Press fetch 실패 → 빈 상태 + 재시도 버튼

## 10. Testing Strategy (최소)

- Vitest + React Testing Library
- 커버리지:
  - `lib/api.ts` : `submitContact` 모킹 테스트 (성공/실패)
  - `hooks/useContactForm` : 검증 로직 (빈 필드/이메일 포맷/전화번호)
  - `data/chatbotReplies` + 매칭 함수 : Q&A 매칭 정확도
- E2E / 비주얼 회귀는 YAGNI — Phase 2 체크포인트에서 사람이 스크린샷 눈대조

## 11. Build & Deployment

### Next.js 설정 (`next.config.mjs`)

```js
export default {
  reactStrictMode: true,
  // images 최적화는 기본값 (Vercel은 지원)
};
```

### Vercel 연결

1. GitHub repo `boanlinks-testpage2` 를 Vercel 프로젝트로 연결
2. Framework Preset: Next.js (자동 감지)
3. Environment Variables 등록 (Production + Preview)
4. `main` 브랜치 push → 자동 Production 배포
5. 모든 PR → Preview Deployment URL 자동 생성 (머지 전 검수용)

### 도메인 전환

1. Vercel 대시보드에서 `boanlinks.com` 추가
2. DNS 레코드 변경:
   - A 레코드 → `76.76.21.21` (Vercel)
   - 또는 CNAME → `cname.vercel-dns.com`
3. HTTPS/SSL 자동 발급
4. 기존 GitHub Pages `CNAME` 파일은 `legacy/` 로 함께 이동

### 기존 크롤러

- `.github/workflows/crawl.yml` 와 `scripts/crawl.js` **변경 없음**. Supabase 에 직접 write 하므로 프런트/호스팅과 독립.

## 12. Migration Phases

### Phase 0 — 준비 (별도 브랜치)
- `nextjs-migration` 브랜치 생성
- 기존 파일을 `legacy/` 로 이동
- `create-next-app` 으로 스캐폴딩 + TS + Tailwind 설정
- `.env.example`, 타입/유틸 기본 골격
- **체크포인트:** `npm run dev` 로 빈 앱 기동 확인

### Phase 1 — 레이아웃 + 라우트 골격
- `app/layout.tsx`, `app/page.tsx` 외 5개 빈 페이지
- `Header`, `Footer`, `MobileMenu`, `HashRedirect`
- `ToastProvider` 가 layout 에 삽입
- **체크포인트:** 5개 라우트 이동 가능, 헤더/푸터 고정, 모바일 메뉴 토글 작동

### Phase 2 — 정적 페이지 이식 (디자인 파리티)
- `Home` (HeroSlider, Intro, Solutions preview, Partner, Press preview, CTA)
- `About` (overview, stats, 연혁, 파트너, 인증)
- `Solution` + `Solution [id]` (6개 솔루션)
- Tailwind 유틸리티로 인라인 스타일 전량 치환
- **체크포인트:** 기존 사이트와 시각적으로 동일 (스크린샷 비교)

### Phase 3 — 동적 기능
- `lib/supabase.ts` + `lib/api.ts`
- `Press` 페이지 (서버 컴포넌트 fetch), `Press [id]`
- `Contact` 페이지 (폼 + 검증 + Edge Function 호출 + Toast)
- `Chatbot` (하드코딩 Q&A 매칭)
- **체크포인트:** 로컬에서 실제 DB 에 테스트 제출 → 이메일 수신 확인

### Phase 4 — Vercel 연결 + Preview 검수
- Vercel 프로젝트 생성 + env vars
- `nextjs-migration` 브랜치에 대한 Preview URL 확보
- 모바일/데스크톱/크롬/사파리 크로스 브라우저 확인
- **체크포인트:** Preview URL 에서 기능 파리티 확인 완료

### Phase 5 — DNS 전환 + 마무리
- main 브랜치에 머지
- Vercel 에 `boanlinks.com` 도메인 연결
- DNS 레코드 전환 (TTL 을 미리 낮춰둘 것)
- 기존 GitHub Pages 비활성 (Repository Settings → Pages → None)
- README 업데이트 (새 구조/개발/배포 가이드)
- **체크포인트:** `boanlinks.com` 에서 새 빌드 정상 서빙 + 해시 URL 호환 확인

## 13. Rollback Plan

- 작업은 `nextjs-migration` 브랜치에서만 진행, main 은 머지 전까지 건드리지 않음
- DNS 전환은 TTL 단축(5분) 후 진행 → 문제 시 기존 GitHub Pages IP 로 즉시 원복
- `legacy/` 폴더는 영구 보존하여 언제든 원복 참조 가능
- Vercel 배포는 언제든 이전 deployment 로 Instant Rollback 가능

## 14. Open Questions / Assumptions

- **가정:** 현재 Supabase publishable key 는 RLS 로 read-only 보호되고 있다. 그렇지 않다면 마이그레이션과 별개로 RLS 정책 점검 필요.
- **가정:** `boanlinks.com` DNS 는 사용자가 관리할 수 있다 (현재 GitHub Pages A 레코드를 Vercel 로 변경 가능).
- **개방:** Vercel 유료 플랜 필요 여부 — 무료 Hobby 플랜으로 시작하되, 팀 공유/상용 이용 약관 검토 후 필요 시 Pro 전환.

## 15. Success Criteria

- [ ] `boanlinks.com` 에서 새 Next.js 빌드가 서빙됨
- [ ] 5개 페이지 모두 기존 디자인과 시각적으로 동일
- [ ] Press 목록/상세가 Supabase 에서 정상 로드
- [ ] Contact 폼 제출 시 이메일 수신 + DB 저장 확인
- [ ] 챗봇이 기존과 동일하게 응답
- [ ] 기존 해시 URL (`#/about`) 이 새 URL 로 리다이렉트
- [ ] Lighthouse Performance ≥ 90, Accessibility ≥ 95
- [ ] GitHub Actions 크롤러가 정상 동작 유지
