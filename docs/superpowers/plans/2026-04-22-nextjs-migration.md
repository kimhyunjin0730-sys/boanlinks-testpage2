# Next.js Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate `boanlinks.com` from vanilla SPA (single `index.html` + `app.js` + `styles.css`) to Next.js 15 (App Router) + TypeScript + Tailwind + Vercel, preserving existing visual design and feature set (Supabase press, contact form, chatbot, crawler).

**Architecture:** Fresh Next.js 15 App Router project. Legacy files move to `legacy/` (preserved for reference). Flat folder structure with `app/`, `components/`, `hooks/`, `lib/`, `data/`, `types/`. Server components by default; `'use client'` only for interactive components. Supabase is accessed server-side in Press pages and client-side in Contact/Chatbot.

**Tech Stack:** Next.js 16, React 19, TypeScript 5, Tailwind CSS 4 (CSS-first `@theme`), `@supabase/supabase-js`, Vitest + React Testing Library. Vercel hosting with `boanlinks.com` custom domain. Existing GitHub Actions crawler (`crawl.yml` + `scripts/crawl.js`) unchanged.

**Environment notes:**
- Dev server uses `next dev --webpack` (not Turbopack) because Turbopack panics on Korean characters in the filesystem path (`진앤현시큐리티`, `바탕 화면`).
- No `tailwind.config.ts` file exists. All theme configuration lives in `app/globals.css` via Tailwind v4's `@theme` directive.
- `next.config.ts` (not `.mjs`) is the config file — create-next-app v16 default.

**Priority:** Visual/feature parity with legacy site. Internal code can be cleaner than the legacy template-literal rendering — the goal is modernization, not literal translation.

**Spec:** [`docs/superpowers/specs/2026-04-22-nextjs-migration-design.md`](../specs/2026-04-22-nextjs-migration-design.md)

**Legacy reference file ranges (read these during implementation):**
- Global CSS + keyframes: `legacy/index.html:11-900` (approx)
- Solutions data: `legacy/index.html:1100-1120`
- Hero slides: `legacy/index.html:1654-1660`
- Home render: search for `function renderHome` in `legacy/app.js`
- About render: `legacy/index.html` (search for `aboutOverview`, line ~1925)
- Routing: `legacy/index.html:1145` (`function go`) and `:1631` (`function render`)
- Supabase + Press: `legacy/index.html:1123-1130`
- Contact form submit: search for `handleContactSubmit` in `legacy/app.js`
- Chatbot Q&A: `legacy/index.html:1530-1540`

---

## Phase 0 — Scaffolding

### Task 1: Create migration branch and move legacy files

**Files:**
- Move: `index.html`, `app.js`, `styles.css`, `logo-color.png`, `logo-white.png`, `logo.png`, `CNAME` → `legacy/`
- Keep in place: `.github/workflows/crawl.yml`, `scripts/crawl.js`, `docs/`, `README.md`, `package.json`

- [ ] **Step 1: Create and switch to migration branch**

```bash
git checkout -b nextjs-migration
```

- [ ] **Step 2: Move legacy files into `legacy/` folder**

```bash
mkdir -p legacy
git mv index.html legacy/index.html
git mv app.js legacy/app.js
git mv styles.css legacy/styles.css
git mv logo-color.png legacy/logo-color.png
git mv logo-white.png legacy/logo-white.png
git mv logo.png legacy/logo.png
git mv CNAME legacy/CNAME
```

- [ ] **Step 3: Delete placeholder `package.json`** (new Next.js scaffold will generate a fresh one)

```bash
rm package.json
```

- [ ] **Step 4: Verify tree state**

```bash
ls -la
```

Expected: root contains `.git/`, `.github/`, `docs/`, `legacy/`, `scripts/`, `README.md`. No `index.html`, `app.js`, `styles.css`, or logos at root.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: move vanilla SPA files to legacy/ ahead of Next.js migration"
```

---

### Task 2: Initialize Next.js project

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.mjs`, `tailwind.config.ts`, `postcss.config.mjs`, `app/layout.tsx`, `app/page.tsx`, `app/globals.css`, `.gitignore`

- [ ] **Step 1: Run create-next-app in current directory**

Run in the repo root:
```bash
npx create-next-app@latest . --ts --tailwind --app --no-src-dir --import-alias "@/*" --no-eslint --use-npm
```

Answer prompts if any: Turbopack = **No**, skip ESLint if asked again (will add separately), overwrite existing files = **Yes** for `.gitignore` only if it does not conflict with `legacy/`.

Expected output: creates `app/`, `public/`, configs at root, empty Next.js app.

- [ ] **Step 2: Verify dev server runs**

```bash
npm run dev
```

Open `http://localhost:3000` — should see the default Next.js landing page. Stop the server with Ctrl+C.

- [ ] **Step 3: Update `.gitignore` to exclude Next.js artifacts and keep `legacy/` tracked**

Replace the full content of `.gitignore` with:

```gitignore
# dependencies
node_modules
.pnp
.pnp.js

# testing
coverage

# next.js
.next
out

# production
build
dist

# misc
.DS_Store
*.pem
.vscode
.idea

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local
.env

# typescript
*.tsbuildinfo
next-env.d.ts

# vercel
.vercel
```

- [ ] **Step 4: Commit baseline**

```bash
git add -A
git commit -m "feat: scaffold Next.js 15 + TypeScript + Tailwind app"
```

---

### Task 3: Configure Tailwind v4 theme with legacy tokens

**Files:**
- Modify: `app/globals.css` (single source of Tailwind config via `@theme`)
- Modify: `app/layout.tsx` (remove Geist font; use Pretendard CDN; update metadata)
- Modify: `app/page.tsx` (minimal placeholder)
- Delete (if present): `tailwind.config.ts` — Tailwind v4 does not use a JS config file

> **Tailwind v4 recap:** colors, fonts, and animations are registered via the `@theme` directive in `globals.css`. Tokens named `--color-*`, `--font-*`, `--animate-*` become utility classes automatically (`bg-primary`, `font-sans`, `animate-fade-up`). Keyframes are plain CSS `@keyframes` blocks. There is no `content: []` array — v4 auto-detects usage.

- [ ] **Step 1: Replace `app/globals.css` with the full v4 theme + keyframes + base/components/utilities layers**

Write `app/globals.css`:

```css
@import "tailwindcss";

@theme {
  /* Colors (primary + palette) */
  --color-primary: #2563eb;
  --color-primary-dark: #1d4ed8;
  --color-primary-400: #3b82f6;
  --color-primary-300: #93c5fd;
  --color-navy: #0f172a;
  --color-slate-850: #1e293b;
  --color-cyan-300: #67e8f9;
  --color-emerald-400: #34d399;
  --color-emerald-200: #a7f3d0;
  --color-border: #e2e8f0;

  /* Font */
  --font-sans: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;

  /* Animations */
  --animate-fade-up: fadeUp 0.7s ease both;
  --animate-float-y: floatY 3s ease-in-out infinite;
  --animate-p-glow: pGlow 2s ease-in-out infinite;
  --animate-pulse-green: pulseGreen 2s ease-in-out infinite;
  --animate-scale-in: scaleIn 0.3s ease both;
  --animate-scroll-bounce: scrollBounce 1.5s ease-in-out infinite;
  --animate-chat-in: chatIn 0.25s ease both;
  --animate-bounce-dot: bounceDot 1.4s ease-in-out infinite;
  --animate-dd-in: ddIn 0.18s ease both;
  --animate-shake: shake 0.4s linear;
  --animate-spin: spin 1s linear infinite;
}

/* Keyframes — referenced by the `--animate-*` tokens above */
@keyframes fadeUp {
  0% { opacity: 0; transform: translateY(22px); }
  100% { opacity: 1; transform: translateY(0); }
}
@keyframes floatY {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-7px); }
}
@keyframes pGlow {
  0%, 100% { box-shadow: 0 0 0 0 rgba(37, 99, 235, 0.3); }
  50% { box-shadow: 0 0 0 10px rgba(37, 99, 235, 0); }
}
@keyframes pulseGreen {
  0%, 100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
  50% { box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
}
@keyframes scaleIn {
  0% { opacity: 0; transform: scale(0.95); }
  100% { opacity: 1; transform: scale(1); }
}
@keyframes scrollBounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(5px); }
}
@keyframes chatIn {
  0% { opacity: 0; transform: translateY(-8px); }
  100% { opacity: 1; transform: translateY(0); }
}
@keyframes bounceDot {
  0%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-6px); }
}
@keyframes ddIn {
  0% { opacity: 0; transform: translateY(-6px); }
  100% { opacity: 1; transform: translateY(0); }
}
@keyframes shake {
  10%, 90% { transform: translateX(-1px); }
  20%, 80% { transform: translateX(2px); }
  30%, 50%, 70% { transform: translateX(-4px); }
  40%, 60% { transform: translateX(4px); }
}
@keyframes spin {
  to { transform: rotate(360deg); }
}

@layer base {
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    scroll-behavior: smooth;
    scrollbar-gutter: stable;
  }

  body {
    font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
    background: #f8fafc;
    color: #0f172a;
    word-break: keep-all;
    overflow-wrap: break-word;
    line-height: 1.7;
  }

  * { font-family: inherit; }
}

@layer components {
  .wrap {
    @apply mx-auto w-full max-w-[1200px] px-5;
  }
  .fu {
    @apply opacity-0 translate-y-[22px] transition-[opacity,transform] duration-700 ease-out;
  }
  .fu.shown {
    @apply opacity-100 translate-y-0;
  }
  .btn {
    @apply inline-flex items-center justify-center gap-2 rounded-[.625rem] border-none px-6 py-3 font-semibold cursor-pointer transition-all duration-200;
  }
  .btn-p {
    @apply bg-primary text-white hover:bg-primary-dark hover:-translate-y-[1px];
  }
  .btn-outline {
    @apply bg-transparent text-navy border border-border hover:bg-slate-50;
  }
}

@layer utilities {
  .text-gradient-cyan {
    background: linear-gradient(135deg, #93c5fd, #67e8f9);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .text-gradient-emerald {
    background: linear-gradient(135deg, #a7f3d0, #34d399);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
}
```

> **Note on the `border` token:** Tailwind v4 uses `--color-border` for the generic `border` utility. We override it with our legacy `#e2e8f0` value, so `border-border` works throughout the plan as written.

- [ ] **Step 2: Delete any `tailwind.config.ts` if present** (v4 does not use it)

```bash
rm -f tailwind.config.ts tailwind.config.js
```

- [ ] **Step 3: Update `app/layout.tsx` to load Pretendard font and set root metadata**

Replace `app/layout.tsx` content with:

```tsx
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI 보안링스 - Boanlinks',
  description: '기업의 보안 파트너, AI 보안링스',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 4: Replace `app/page.tsx` with a minimal placeholder**

```tsx
export default function Home() {
  return (
    <main className="wrap py-20">
      <h1 className="text-3xl font-bold">Boanlinks — Next.js migration in progress</h1>
    </main>
  );
}
```

- [ ] **Step 5: Verify dev server still works with new styling**

```bash
npm run dev
```

Load `http://localhost:3000`. Expected: "Boanlinks — Next.js migration in progress" heading renders in Pretendard, page background light slate. Stop server.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: configure Tailwind theme and global styles from legacy tokens"
```

---

### Task 4: Install testing tools

**Files:**
- Modify: `package.json` (add devDependencies + scripts)
- Create: `vitest.config.ts`
- Create: `vitest.setup.ts`
- Create: `types/test.d.ts` (optional jest-dom type reference)

- [ ] **Step 1: Install Vitest, RTL, and supporting libs**

```bash
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom @vitejs/plugin-react
```

- [ ] **Step 2: Create `vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, './') },
  },
});
```

- [ ] **Step 3: Create `vitest.setup.ts`**

```ts
import '@testing-library/jest-dom/vitest';
```

- [ ] **Step 4: Add test scripts to `package.json`**

Edit `package.json` `"scripts"` block to include:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "test": "vitest run",
    "test:watch": "vitest"
  }
}
```

- [ ] **Step 5: Smoke test — add a trivial passing test**

Create `lib/__tests__/smoke.test.ts`:

```ts
import { describe, it, expect } from 'vitest';

describe('smoke', () => {
  it('runs', () => {
    expect(1 + 1).toBe(2);
  });
});
```

Run:
```bash
npm test
```

Expected: `1 passed`.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add Vitest + React Testing Library setup"
```

---

## Phase 1 — Layout + Routing Skeleton

### Task 5: Add core types

**Files:**
- Create: `types/index.ts`

- [ ] **Step 1: Create `types/index.ts`**

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
  bg: 'dark' | 'gradient1' | 'gradient2' | 'light';
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

export type ChatbotReply = {
  keywords: string[];
  reply: string;
};

export type ToastKind = 'success' | 'error' | 'info';

export type Toast = {
  id: string;
  kind: ToastKind;
  title: string;
  description?: string;
};
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: exits 0.

- [ ] **Step 3: Commit**

```bash
git add types/index.ts
git commit -m "feat(types): add core domain types"
```

---

### Task 6: Add utilities (`cn` helper)

**Files:**
- Create: `lib/utils.ts`
- Modify: `package.json` (add `clsx`, `tailwind-merge`)

- [ ] **Step 1: Install dependencies**

```bash
npm install clsx tailwind-merge
```

- [ ] **Step 2: Create `lib/utils.ts`**

```ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

- [ ] **Step 3: Add test `lib/__tests__/utils.test.ts`**

```ts
import { describe, it, expect } from 'vitest';
import { cn } from '@/lib/utils';

describe('cn', () => {
  it('merges tailwind classes', () => {
    expect(cn('p-2', 'p-4')).toBe('p-4');
  });

  it('ignores falsy values', () => {
    expect(cn('foo', false && 'bar', null, 'baz')).toBe('foo baz');
  });
});
```

Run:
```bash
npm test
```

Expected: all tests pass.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat(lib): add cn helper for tailwind class merging"
```

---

### Task 7: Add Supabase client

**Files:**
- Create: `lib/supabase.ts`
- Create: `.env.example`
- Modify: `package.json` (add `@supabase/supabase-js`)

Legacy reference: `legacy/index.html:1123-1130` for the existing `SUPABASE_URL` and publishable key.

- [ ] **Step 1: Install `@supabase/supabase-js`**

```bash
npm install @supabase/supabase-js
```

- [ ] **Step 2: Create `lib/supabase.ts`**

```ts
import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_KEY;

if (!url || !key) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_KEY');
}

export const supabase = createClient(url, key);
```

- [ ] **Step 3: Create `.env.example`**

```bash
# Supabase publishable credentials (safe for browser)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_KEY=sb_publishable_xxxxxxxxxxxx
```

- [ ] **Step 4: Create local `.env` with real values**

Copy the real values from `legacy/index.html:1124-1125` into a new `.env` file. **Do not commit `.env`** (already in `.gitignore`).

```bash
cp .env.example .env
# Then edit .env and paste real values
```

- [ ] **Step 5: Smoke test the import compiles**

```bash
npx tsc --noEmit
```

Expected: exits 0.

- [ ] **Step 6: Commit**

```bash
git add lib/supabase.ts .env.example package.json package-lock.json
git commit -m "feat(lib): add Supabase client singleton"
```

---

### Task 8: Add ui primitives (Button, Badge)

**Files:**
- Create: `components/ui/Button.tsx`
- Create: `components/ui/Badge.tsx`

- [ ] **Step 1: Create `components/ui/Button.tsx`**

```tsx
import { cn } from '@/lib/utils';
import { forwardRef, type ButtonHTMLAttributes } from 'react';

type Variant = 'primary' | 'outline' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
};

const variantClass: Record<Variant, string> = {
  primary: 'bg-primary text-white hover:bg-primary-dark hover:-translate-y-[1px]',
  outline: 'bg-transparent text-navy border border-border hover:bg-slate-50',
  ghost: 'bg-transparent text-white hover:bg-white/10',
};

const sizeClass: Record<Size, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-sm',
  lg: 'px-7 py-3.5 text-base',
};

export const Button = forwardRef<HTMLButtonElement, Props>(
  ({ className, variant = 'primary', size = 'md', ...rest }, ref) => (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-[.625rem] font-semibold cursor-pointer transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed',
        variantClass[variant],
        sizeClass[size],
        className,
      )}
      {...rest}
    />
  ),
);
Button.displayName = 'Button';
```

- [ ] **Step 2: Create `components/ui/Badge.tsx`**

```tsx
import { cn } from '@/lib/utils';
import type { HTMLAttributes } from 'react';

type Props = HTMLAttributes<HTMLSpanElement> & {
  dot?: boolean;
};

export function Badge({ className, children, dot = true, ...rest }: Props) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-primary-300 uppercase',
        className,
      )}
      {...rest}
    >
      {dot && <span className="inline-block h-[7px] w-[7px] rounded-full bg-primary-400" />}
      {children}
    </span>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add components/ui
git commit -m "feat(ui): add Button and Badge primitives"
```

---

### Task 9: Add Header component

**Files:**
- Create: `components/layout/Header.tsx`
- Create: `components/layout/DesktopNav.tsx`
- Create: `components/layout/MobileMenu.tsx` (client)

Legacy reference: search `legacy/index.html` for `<header` and the `updateHeader` function in `legacy/app.js:122`.

Nav links (from legacy): `/` (홈), `/about` (회사소개), `/solution` (솔루션), `/press` (홍보센터), `/contact` (문의하기).

- [ ] **Step 1: Create `components/layout/DesktopNav.tsx`** (server)

```tsx
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
```

- [ ] **Step 2: Create `components/layout/MobileMenu.tsx`** (client)

```tsx
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
```

- [ ] **Step 3: Create `components/layout/Header.tsx`** (server)

```tsx
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
```

- [ ] **Step 4: Copy legacy logos into `public/`**

```bash
cp legacy/logo-color.png public/logo-color.png
cp legacy/logo-white.png public/logo-white.png
```

- [ ] **Step 5: Add middleware to expose pathname to headers**

Create `middleware.ts` at repo root:

```ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  response.headers.set('x-pathname', request.nextUrl.pathname);
  return response;
}

export const config = {
  matcher: '/((?!_next/static|_next/image|favicon.ico).*)',
};
```

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat(layout): add Header with desktop and mobile nav"
```

---

### Task 10: Add Footer component

**Files:**
- Create: `components/layout/Footer.tsx`

Legacy reference: `legacy/index.html:1860-1920` (search for footer, links, patent mention).

- [ ] **Step 1: Create `components/layout/Footer.tsx`**

```tsx
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
            본사: 서울특별시 OO구 OO로 OO, OO층<br />
            TEL: 02-0000-0000 · FAX: 02-0000-0000 · E-MAIL: contact@boanlinks.com
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
```

> **Note:** Exact company address/phone/email should be copied verbatim from `legacy/index.html` footer during implementation. Read the legacy footer lines and replace the placeholder text above with real values.

- [ ] **Step 2: Commit**

```bash
git add components/layout/Footer.tsx
git commit -m "feat(layout): add Footer"
```

---

### Task 11: Add ToastProvider

**Files:**
- Create: `components/ToastProvider.tsx`

- [ ] **Step 1: Create `components/ToastProvider.tsx`**

```tsx
'use client';
import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import type { Toast, ToastKind } from '@/types';

type Ctx = {
  show: (kind: ToastKind, title: string, description?: string) => void;
};

const ToastCtx = createContext<Ctx | null>(null);

export function useToast() {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error('useToast must be used within <ToastProvider>');
  return ctx;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const show = useCallback((kind: ToastKind, title: string, description?: string) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, kind, title, description }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  }, []);

  return (
    <ToastCtx.Provider value={{ show }}>
      {children}
      <div className="fixed top-5 right-5 z-50 flex flex-col gap-2 max-w-sm">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`animate-scale-in rounded-lg border px-4 py-3 shadow-lg bg-white ${
              t.kind === 'success'
                ? 'border-emerald-300'
                : t.kind === 'error'
                ? 'border-red-300'
                : 'border-border'
            }`}
          >
            <p className="font-semibold text-sm text-navy">{t.title}</p>
            {t.description && <p className="text-xs text-slate-500 mt-1">{t.description}</p>}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/ToastProvider.tsx
git commit -m "feat(ui): add ToastProvider with useToast hook"
```

---

### Task 12: Add HashRedirect client helper

**Files:**
- Create: `components/HashRedirect.tsx`

Purpose: preserve existing `#/about` style shared links by rewriting them to clean paths on first load.

- [ ] **Step 1: Create `components/HashRedirect.tsx`**

```tsx
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
```

- [ ] **Step 2: Commit**

```bash
git add components/HashRedirect.tsx
git commit -m "feat: add HashRedirect for legacy #/path URL compat"
```

---

### Task 13: Wire up root layout

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Step 1: Update `app/layout.tsx` to include Header/Footer/ToastProvider/HashRedirect**

Replace content:

```tsx
import type { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ToastProvider } from '@/components/ToastProvider';
import { HashRedirect } from '@/components/HashRedirect';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI 보안링스 - Boanlinks',
  description: '기업의 보안 파트너, AI 보안링스',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />
      </head>
      <body>
        <ToastProvider>
          <HashRedirect />
          <Header />
          <main>{children}</main>
          <Footer />
        </ToastProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Verify dev server**

```bash
npm run dev
```

Load `http://localhost:3000/`. Expected: Header, placeholder body, Footer render correctly. Nav links are visible.

- [ ] **Step 3: Commit**

```bash
git add app/layout.tsx
git commit -m "feat(layout): wire Header/Footer/ToastProvider into root layout"
```

---

### Task 14: Create empty page stubs + not-found

**Files:**
- Create: `app/about/page.tsx`, `app/solution/page.tsx`, `app/press/page.tsx`, `app/contact/page.tsx`, `app/not-found.tsx`
- Create: `app/solution/[id]/page.tsx`, `app/press/[id]/page.tsx`

- [ ] **Step 1: Create `app/about/page.tsx`**

```tsx
export default function AboutPage() {
  return <section className="wrap py-20"><h1 className="text-3xl font-bold">About (WIP)</h1></section>;
}
```

- [ ] **Step 2: Create `app/solution/page.tsx`**

```tsx
export default function SolutionPage() {
  return <section className="wrap py-20"><h1 className="text-3xl font-bold">Solution (WIP)</h1></section>;
}
```

- [ ] **Step 3: Create `app/solution/[id]/page.tsx`**

```tsx
export default function SolutionDetailPage({ params }: { params: { id: string } }) {
  return <section className="wrap py-20"><h1 className="text-3xl font-bold">Solution: {params.id} (WIP)</h1></section>;
}
```

- [ ] **Step 4: Create `app/press/page.tsx`**

```tsx
export default function PressPage() {
  return <section className="wrap py-20"><h1 className="text-3xl font-bold">Press (WIP)</h1></section>;
}
```

- [ ] **Step 5: Create `app/press/[id]/page.tsx`**

```tsx
export default function PressDetailPage({ params }: { params: { id: string } }) {
  return <section className="wrap py-20"><h1 className="text-3xl font-bold">Press #{params.id} (WIP)</h1></section>;
}
```

- [ ] **Step 6: Create `app/contact/page.tsx`**

```tsx
export default function ContactPage() {
  return <section className="wrap py-20"><h1 className="text-3xl font-bold">Contact (WIP)</h1></section>;
}
```

- [ ] **Step 7: Create `app/not-found.tsx`**

```tsx
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
```

- [ ] **Step 8: Verify all routes load**

```bash
npm run dev
```

Visit `/`, `/about`, `/solution`, `/solution/foo`, `/press`, `/press/123`, `/contact`, and `/nonexistent`. All should render with Header + Footer and the correct placeholder heading (or 404 page).

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat(routing): add empty page stubs for all routes"
```

---

## Phase 2 — Static Pages (Visual Parity)

### Task 15: Port static data files

**Files:**
- Create: `data/solutions.ts`
- Create: `data/heroSlides.ts`
- Create: `data/milestones.ts`

Legacy references: `legacy/index.html:1100-1120` (solutions), `:1654-1660` (hero slides), search for `{year:` in `legacy/index.html:2090-2110` (milestones).

- [ ] **Step 1: Create `data/solutions.ts`**

Read `legacy/index.html:1100-1120` and transcribe 5 solutions into TypeScript. Structure (use real data from legacy):

```ts
import type { Solution } from '@/types';

export const SOLUTIONS: Solution[] = [
  {
    id: 'boanlinks',
    title: '보안마켓플레이스',
    eng: 'Boanlinks',
    sub: '기업 보안 점검 및 보안 제품 매칭 서비스',
    color: '#2563eb',
    icon: null,
    img1: '',
    img2: '',
    overview: '', // read from legacy
    features: [], // read from legacy
  },
  // ... dgo, ese, secuwifi, secumom (5 total)
];
```

Read each solution's `overview` and `features` arrays from legacy and fill them in verbatim. Image references (`img1`, `img2`) may reference `IMG.xxx` globals in legacy — for now set them to empty strings and address images in Task 22.

- [ ] **Step 2: Create `data/heroSlides.ts`**

```ts
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
  // ... 2 more slides from legacy:1656-1657, filling in bg/title/sub/cta1/cta2/badge verbatim
];
```

- [ ] **Step 3: Create `data/milestones.ts`**

Read milestones from legacy (search for `{year:'2023'` and onwards). Transcribe into:

```ts
import type { Milestone } from '@/types';

export const MILESTONES: Milestone[] = [
  { year: '2024', color: '#cbd5e1', items: ['...'] },
  { year: '2023', color: '#94a3b8', items: ['...'] },
  { year: '2000', color: '#64748b', items: ['...'] },
];
```

- [ ] **Step 4: Verify compile**

```bash
npx tsc --noEmit
```

Expected: exits 0.

- [ ] **Step 5: Commit**

```bash
git add data/
git commit -m "feat(data): port solutions, hero slides, milestones from legacy"
```

---

### Task 16: Add `useScrollReveal` hook

**Files:**
- Create: `hooks/useScrollReveal.ts`

Legacy reference: `legacy/app.js:881` (search for `initAnimations` — uses IntersectionObserver to add `.shown` class to `.fu` elements).

- [ ] **Step 1: Create `hooks/useScrollReveal.ts`**

```ts
'use client';
import { useEffect } from 'react';

export function useScrollReveal(selector = '.fu') {
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('shown');
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' },
    );

    document.querySelectorAll(selector).forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [selector]);
}
```

- [ ] **Step 2: Create wrapper client component `components/ScrollReveal.tsx`** to allow usage from server pages

```tsx
'use client';
import { useScrollReveal } from '@/hooks/useScrollReveal';

export function ScrollReveal() {
  useScrollReveal();
  return null;
}
```

- [ ] **Step 3: Commit**

```bash
git add hooks components/ScrollReveal.tsx
git commit -m "feat(hooks): add useScrollReveal + ScrollReveal mounter"
```

---

### Task 17: Add HeroSlider

**Files:**
- Create: `components/HeroSlider.tsx`

Legacy reference: `legacy/index.html:1650-1780` (hero section render).

- [ ] **Step 1: Create `components/HeroSlider.tsx`**

```tsx
'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { HERO_SLIDES } from '@/data/heroSlides';
import { cn } from '@/lib/utils';

const BG_CLASS: Record<string, string> = {
  dark: 'bg-gradient-to-br from-navy via-slate850 to-navy',
  gradient1: 'bg-gradient-to-br from-primary to-cyan300',
  gradient2: 'bg-gradient-to-br from-emerald-600 to-emerald400',
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
```

- [ ] **Step 2: Verify `dangerouslySetInnerHTML` content only contains trusted, author-authored HTML (it comes from `data/heroSlides.ts`, not user input).**

Re-read `data/heroSlides.ts` — the `title` field contains simple inline `<br>` and `<span>` markup from legacy. Acceptable.

- [ ] **Step 3: Commit**

```bash
git add components/HeroSlider.tsx
git commit -m "feat(components): add HeroSlider with auto-advance and indicator dots"
```

---

### Task 18: Add SolutionCard component

**Files:**
- Create: `components/SolutionCard.tsx`

- [ ] **Step 1: Create `components/SolutionCard.tsx`**

```tsx
import Link from 'next/link';
import type { Solution } from '@/types';

export function SolutionCard({ s }: { s: Solution }) {
  return (
    <Link
      href={`/solution/${s.id}`}
      className="group block rounded-2xl border border-border bg-white p-7 transition-all hover:-translate-y-1 hover:shadow-xl"
    >
      <div
        className="inline-flex h-12 w-12 items-center justify-center rounded-xl text-white font-bold text-lg mb-4"
        style={{ backgroundColor: s.color }}
      >
        {s.eng.slice(0, 1)}
      </div>
      <p className="text-xs font-bold tracking-wider uppercase" style={{ color: s.color }}>{s.eng}</p>
      <h3 className="mt-2 text-lg font-bold text-navy">{s.title}</h3>
      <p className="mt-2 text-sm text-slate-500 leading-relaxed">{s.sub}</p>
      <p className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-primary group-hover:translate-x-1 transition-transform">
        자세히 보기 →
      </p>
    </Link>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/SolutionCard.tsx
git commit -m "feat(components): add SolutionCard"
```

---

### Task 19: Implement Home page

**Files:**
- Modify: `app/page.tsx`

Legacy reference: `legacy/app.js:279` (`renderHome`), `:291` (`renderHeroSection`), `:336` (`renderIntroSection`), `:382` (`renderSolutionsSection`), `:451` (`renderCTASection`), `:513` (`renderContactSection`). Also `legacy/index.html:1650-1890` (inline Home sections).

Home page sections (in order):
1. **Hero slider** (HeroSlider component)
2. **Intro / Why Boanlinks** (mission/value proposition)
3. **Solutions preview** (5 SolutionCards in a grid)
4. **Partner network** (dark section with partner list: 현대해상, 법무법인 로데이터, 진앤현시큐리티)
5. **Press preview** (3 latest press items — static for now, Supabase comes in Phase 3; use placeholder)
6. **CTA** (contact us banner)

- [ ] **Step 1: Replace `app/page.tsx`**

```tsx
import Link from 'next/link';
import { HeroSlider } from '@/components/HeroSlider';
import { SolutionCard } from '@/components/SolutionCard';
import { Button } from '@/components/ui/Button';
import { ScrollReveal } from '@/components/ScrollReveal';
import { SOLUTIONS } from '@/data/solutions';

export default function Home() {
  return (
    <>
      <ScrollReveal />
      <HeroSlider />

      {/* Intro */}
      <section className="py-20 bg-slate-50">
        <div className="wrap">
          <div className="fu text-center max-w-3xl mx-auto">
            <p className="text-primary text-sm font-bold tracking-[.12em] uppercase">Why Boanlinks</p>
            <h2 className="mt-3 text-2xl md:text-4xl font-bold text-navy">
              24년 보안 전문 업력, 귀사의 보안 파트너
            </h2>
            <p className="mt-5 text-slate-600 leading-relaxed">
              보험·법률·기술 전문가가 통합 대응하는 사이버리스크 관리 플랫폼.
            </p>
          </div>
        </div>
      </section>

      {/* Solutions preview */}
      <section className="py-20 bg-white">
        <div className="wrap">
          <div className="fu text-center mb-12">
            <p className="text-primary text-sm font-bold tracking-[.12em] uppercase">Solutions</p>
            <h2 className="mt-3 text-2xl md:text-3xl font-bold text-navy">
              기업을 위한 종합 보안 솔루션
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {SOLUTIONS.map((s) => (
              <div key={s.id} className="fu">
                <SolutionCard s={s} />
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/solution"><Button variant="outline">모든 솔루션 보기 →</Button></Link>
          </div>
        </div>
      </section>

      {/* Partner network */}
      <section className="py-20 bg-gradient-to-br from-navy via-slate850 to-navy text-white relative overflow-hidden">
        <div className="wrap relative z-10 grid gap-10 lg:grid-cols-2 items-center">
          <div className="fu">
            <p className="text-white/60 text-sm font-bold tracking-[.12em] uppercase">Partner Network</p>
            <h2 className="mt-3 text-2xl md:text-3xl font-bold">주요 파트너 · 네트워크</h2>
            <p className="mt-5 text-white/75 leading-relaxed">
              보안전문가 리포트를 바탕으로 사이버리스크보험, 법률서비스를 제공하고 컴플라이언스 개선 이슈 해결을 위한 보안 조치를 진행합니다.
            </p>
            <ul className="mt-6 space-y-3 text-sm">
              <li>
                <span className="text-primary-300 font-bold">[현대해상]</span>{' '}
                <span className="text-white/80">사이버사고 발생시 부담하는 비용을 최소화하는 맞춤형 사이버보험</span>
              </li>
              <li>
                <span className="text-primary-300 font-bold">[법무법인 로데이터]</span>{' '}
                <span className="text-white/80">보안사고 법률자문 및 법적대응</span>
              </li>
              <li>
                <span className="text-primary-300 font-bold">[진앤현시큐리티]</span>{' '}
                <span className="text-white/80">보안인프라 구축·운영·사고대응·감사지원·보안자문</span>
              </li>
            </ul>
            <div className="mt-8 flex gap-3">
              <Link href="/contact"><Button size="lg">CONTACT US →</Button></Link>
              <Link href="/about"><Button size="lg" variant="ghost">사업 소개 보기</Button></Link>
            </div>
          </div>
          <div className="fu grid grid-cols-2 gap-4">
            {[
              ['8K', '보안전문가'],
              ['100%', '솔루션'],
              ['100%', '사고대응'],
              ['24Y', '보안 업력'],
            ].map(([n, l]) => (
              <div key={l} className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur p-7 text-center">
                <p className="text-3xl font-bold">{n}</p>
                <p className="mt-1 text-sm text-white/65">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary text-white">
        <div className="wrap text-center">
          <h2 className="fu text-2xl md:text-4xl font-bold">무료 보안 점검을 받아보세요</h2>
          <p className="fu mt-4 text-white/85">전문가가 30분 내 분석 결과를 회신드립니다.</p>
          <div className="fu mt-8 flex justify-center gap-3">
            <Link href="/contact"><Button size="lg" variant="outline" className="bg-white text-primary hover:bg-slate-100">문의하기</Button></Link>
          </div>
        </div>
      </section>
    </>
  );
}
```

> **Note:** "Press preview" section is deferred to Phase 3 (Task 29). For now Home does not include a press preview block.

- [ ] **Step 2: Run dev server and visually compare to legacy**

```bash
npm run dev
```

Open `http://localhost:3000/` and open `legacy/index.html` directly in a second tab (double-click). Compare hero, intro, solutions grid, partner section, CTA. They should look structurally/visually equivalent. Log any mismatches and fix before commit.

- [ ] **Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "feat(home): port homepage to Next.js with visual parity"
```

---

### Task 20: Implement About page

**Files:**
- Modify: `app/about/page.tsx`

Legacy reference: `legacy/index.html:1925-2110` (aboutOverview, stats grid, history timeline, partners grid, certifications).

About sections (in order):
1. Overview text block (eyebrow "BOANLINKS", heading, 2 paragraphs)
2. Stats grid (4 metrics from legacy: 24년 업력, 280+ 고객사, 220억 매출, CMMC PRO 완료)
3. History timeline (milestones — uses `MILESTONES` from `data/milestones.ts`)
4. Partners (similar to Home partner section, but fuller)
5. Certifications (신용평가 BBB-, 기술평가 A+, INNO-BIZ, MAIN-BIZ, GS인증 1등급, 벤처기업)

- [ ] **Step 1: Replace `app/about/page.tsx`**

```tsx
import { ScrollReveal } from '@/components/ScrollReveal';
import { MILESTONES } from '@/data/milestones';

const STATS = [
  { value: '24년', label: '보안 전문 업력' },
  { value: '280+', label: '고객사' },
  { value: '220억', label: '연평균 매출' },
  { value: 'CMMC', label: 'PRO 등록 완료' },
];

const CERTS = [
  '신용평가 BBB-',
  '기술평가 A+',
  'INNO-BIZ',
  'MAIN-BIZ',
  'GS인증 1등급',
  '벤처기업 인증',
];

export default function AboutPage() {
  return (
    <>
      <ScrollReveal />

      {/* Overview */}
      <section className="py-24 bg-gradient-to-br from-navy via-slate850 to-navy text-white">
        <div className="wrap">
          <p className="fu text-primary-300 text-xs font-bold tracking-[.12em] uppercase">BOANLINKS</p>
          <h1 className="fu mt-3 text-3xl md:text-5xl font-bold leading-tight max-w-3xl">
            안전하고 스마트한 세상을 만드는<br />보안리스크관리 전문기업
          </h1>
          <p className="fu mt-6 text-white/80 leading-relaxed max-w-xl">
            24여년간 축적한 기술과 노하우를 기반으로 고객 환경에 최적화된 맞춤형 정보 보안 솔루션 및 서비스를 제공합니다.
          </p>
          <p className="fu mt-3 text-white/80 leading-relaxed max-w-xl">
            Boanlinks는 기업 보안 전문 플랫폼으로, 보안솔루션 구축·운영 전문기업에서 보안리스크관리 전문기업으로 VALUE UP합니다.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-white">
        <div className="wrap grid gap-6 grid-cols-2 md:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="fu rounded-2xl border border-border p-7 text-center">
              <p className="text-3xl md:text-4xl font-bold text-primary">{s.value}</p>
              <p className="mt-2 text-sm text-slate-500">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* History */}
      <section className="py-20 bg-slate-50">
        <div className="wrap">
          <div className="fu text-center mb-12">
            <p className="text-primary text-sm font-bold tracking-[.12em] uppercase">History</p>
            <h2 className="mt-3 text-2xl md:text-3xl font-bold text-navy">주요 연혁</h2>
          </div>
          <div className="space-y-8 max-w-3xl mx-auto">
            {MILESTONES.map((m) => (
              <div key={m.year} className="fu grid grid-cols-[auto_1fr] gap-6">
                <p className="text-2xl font-bold" style={{ color: m.color }}>{m.year}</p>
                <ul className="space-y-2 pt-1 text-slate-700">
                  {m.items.map((i, k) => (
                    <li key={k} className="before:content-['•'] before:mr-2 before:text-primary">{i}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-20 bg-white">
        <div className="wrap">
          <div className="fu text-center mb-12">
            <p className="text-primary text-sm font-bold tracking-[.12em] uppercase">Certifications</p>
            <h2 className="mt-3 text-2xl md:text-3xl font-bold text-navy">인증 및 수상</h2>
          </div>
          <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-6 max-w-4xl mx-auto">
            {CERTS.map((c) => (
              <div key={c} className="fu rounded-lg bg-slate-50 border border-border p-4 text-center text-sm font-semibold text-navy">
                {c}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
```

- [ ] **Step 2: Compare against legacy About sections and adjust copy/visuals as needed.** Visit `/about`, open legacy in another tab.

- [ ] **Step 3: Commit**

```bash
git add app/about/page.tsx
git commit -m "feat(about): port About page with overview/stats/history/certifications"
```

---

### Task 21: Implement Solution list and detail pages

**Files:**
- Modify: `app/solution/page.tsx`
- Modify: `app/solution/[id]/page.tsx`

- [ ] **Step 1: Replace `app/solution/page.tsx`**

```tsx
import { ScrollReveal } from '@/components/ScrollReveal';
import { SolutionCard } from '@/components/SolutionCard';
import { SOLUTIONS } from '@/data/solutions';

export default function SolutionPage() {
  return (
    <>
      <ScrollReveal />
      <section className="py-24 bg-slate-50">
        <div className="wrap">
          <div className="fu text-center mb-12">
            <p className="text-primary text-sm font-bold tracking-[.12em] uppercase">Solutions</p>
            <h1 className="mt-3 text-3xl md:text-5xl font-bold text-navy">
              기업을 위한 종합 보안 솔루션
            </h1>
            <p className="mt-5 text-slate-600 max-w-2xl mx-auto">
              {SOLUTIONS.length}개의 전문 솔루션으로 기업의 보안 리스크를 원스톱 관리합니다.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {SOLUTIONS.map((s) => (
              <div key={s.id} className="fu">
                <SolutionCard s={s} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
```

- [ ] **Step 2: Replace `app/solution/[id]/page.tsx`**

```tsx
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ScrollReveal } from '@/components/ScrollReveal';
import { Button } from '@/components/ui/Button';
import { SOLUTIONS } from '@/data/solutions';

export function generateStaticParams() {
  return SOLUTIONS.map((s) => ({ id: s.id }));
}

export default async function SolutionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const s = SOLUTIONS.find((x) => x.id === id);
  if (!s) notFound();

  return (
    <>
      <ScrollReveal />
      <section className="py-24 bg-gradient-to-br from-navy via-slate850 to-navy text-white">
        <div className="wrap">
          <p className="fu text-xs font-bold tracking-[.12em] uppercase" style={{ color: s.color }}>
            {s.eng}
          </p>
          <h1 className="fu mt-3 text-3xl md:text-5xl font-bold leading-tight max-w-3xl">
            {s.title}
          </h1>
          <p className="fu mt-4 text-white/80 text-base md:text-lg max-w-2xl">{s.sub}</p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="wrap max-w-4xl">
          <div className="fu">
            <h2 className="text-xl md:text-2xl font-bold text-navy mb-4">Overview</h2>
            <p className="text-slate-700 leading-loose">{s.overview}</p>
          </div>

          <div className="fu mt-14">
            <h2 className="text-xl md:text-2xl font-bold text-navy mb-6">핵심 기능</h2>
            <ul className="space-y-3">
              {s.features.map((f, i) => (
                <li key={i} className="flex gap-3 text-slate-700">
                  <span className="mt-1 h-2 w-2 rounded-full flex-shrink-0" style={{ backgroundColor: s.color }} />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="fu mt-14 flex gap-3">
            <Link href="/contact"><Button size="lg">도입 문의 →</Button></Link>
            <Link href="/solution"><Button size="lg" variant="outline">다른 솔루션 보기</Button></Link>
          </div>
        </div>
      </section>
    </>
  );
}
```

- [ ] **Step 3: Visit all solution routes and verify**

```bash
npm run dev
```

Visit `/solution`, then click into each of the 5 solutions. Compare against legacy (search `legacy/index.html` for `overview:` to see the source content).

- [ ] **Step 4: Commit**

```bash
git add app/solution
git commit -m "feat(solution): port list and detail pages with generateStaticParams"
```

---

## Phase 3 — Dynamic Features (Supabase + Chatbot)

### Task 22: Add Press API functions (server-safe)

**Files:**
- Create: `lib/api.ts`
- Create: `lib/__tests__/api.test.ts`

Legacy reference: `legacy/index.html:1126-1130` and contact submit in `legacy/app.js:234`.

- [ ] **Step 1: Write failing test `lib/__tests__/api.test.ts`**

```ts
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib/supabase', () => {
  const single = vi.fn();
  const eq = vi.fn(() => ({ single }));
  const order = vi.fn(() => ({ limit: vi.fn().mockResolvedValue({ data: [], error: null }) }));
  const select = vi.fn(() => ({ order, eq }));
  const insert = vi.fn().mockResolvedValue({ error: null });
  return {
    supabase: {
      from: vi.fn(() => ({ select, insert })),
      functions: { invoke: vi.fn().mockResolvedValue({ error: null }) },
    },
  };
});

import { fetchPress, submitContact } from '@/lib/api';

describe('fetchPress', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns array of press items', async () => {
    const result = await fetchPress();
    expect(Array.isArray(result)).toBe(true);
  });
});

describe('submitContact', () => {
  it('inserts into contacts and calls Edge Function', async () => {
    const input = {
      company: 'Acme', dept: 'IT', scale: 'medium', biz: 'tech',
      name: '홍길동', pos: 'CTO', phone: '010-1234-5678',
      email: 'a@b.com', msg: '문의',
    };
    await submitContact(input);
    // No throw = pass
    expect(true).toBe(true);
  });
});
```

- [ ] **Step 2: Run test — should fail with module not found**

```bash
npm test -- lib/__tests__/api.test.ts
```

Expected: FAIL (api.ts does not exist yet).

- [ ] **Step 3: Implement `lib/api.ts`**

```ts
import { supabase } from '@/lib/supabase';
import type { Press, ContactInput } from '@/types';

export async function fetchPress(limit = 50): Promise<Press[]> {
  const { data, error } = await supabase
    .from('press')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []) as Press[];
}

export async function fetchPressById(id: number): Promise<Press | null> {
  const { data, error } = await supabase
    .from('press')
    .select('*')
    .eq('id', id)
    .single();
  if (error) {
    if (error.code === 'PGRST116') return null; // not found
    throw error;
  }
  return data as Press;
}

export async function submitContact(input: ContactInput): Promise<void> {
  const { error: insertErr } = await supabase.from('contacts').insert(input);
  if (insertErr) throw insertErr;

  const { error: fnErr } = await supabase.functions.invoke('send-contact-email', {
    body: input,
  });
  if (fnErr) {
    // DB succeeded; log but do not throw — user gets success, team may not receive email
    console.warn('Edge Function send-contact-email failed:', fnErr);
  }
}
```

> **Note:** The Edge Function name `send-contact-email` should match what exists in the Supabase project. Verify by checking the Supabase dashboard during execution; rename if the actual function is called something else.

- [ ] **Step 4: Run tests — should pass**

```bash
npm test
```

Expected: all tests pass.

- [ ] **Step 5: Commit**

```bash
git add lib/api.ts lib/__tests__/api.test.ts
git commit -m "feat(lib): add press + contact API with tests"
```

---

### Task 23: Add PressCard component

**Files:**
- Create: `components/PressCard.tsx`

- [ ] **Step 1: Create `components/PressCard.tsx`**

```tsx
import Link from 'next/link';
import Image from 'next/image';
import type { Press } from '@/types';

export function PressCard({ p }: { p: Press }) {
  return (
    <Link
      href={`/press/${p.id}`}
      className="group block overflow-hidden rounded-2xl border border-border bg-white transition-all hover:-translate-y-1 hover:shadow-xl"
    >
      {p.img && (
        <div className="relative aspect-[16/9] bg-slate-100">
          <Image
            src={p.img}
            alt={p.title}
            fill
            sizes="(min-width:768px) 33vw, 100vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}
      <div className="p-5">
        <p className="text-xs font-bold text-primary tracking-wider uppercase">{p.cat || 'NEWS'}</p>
        <h3 className="mt-2 text-base font-bold text-navy line-clamp-2">{p.title}</h3>
        <p className="mt-2 text-sm text-slate-500 line-clamp-2">{p.summary}</p>
        <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
          <span>{p.source}</span>
          <span>·</span>
          <span>{p.date}</span>
        </div>
      </div>
    </Link>
  );
}
```

- [ ] **Step 2: Whitelist remote image hosts in `next.config.mjs`** so `next/image` accepts Supabase or external press image URLs.

Replace `next.config.mjs`:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.supabase.co' },
      { protocol: 'https', hostname: 'jinnhyunsecurity.com' },
      { protocol: 'https', hostname: '**' },
    ],
  },
};
export default nextConfig;
```

> **Note:** The `'**'` wildcard is permissive; tighten to specific known hosts during execution after observing what URLs actually come back from the `press` table.

- [ ] **Step 3: Commit**

```bash
git add components/PressCard.tsx next.config.mjs
git commit -m "feat(components): add PressCard and configure image hosts"
```

---

### Task 24: Implement Press list page

**Files:**
- Modify: `app/press/page.tsx`

- [ ] **Step 1: Replace `app/press/page.tsx`**

```tsx
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
```

- [ ] **Step 2: Run dev server, visit `/press`**

```bash
npm run dev
```

Expected: press items load from Supabase and render. If "등록된 기사가 없습니다" shows, verify `.env` credentials match legacy and the `press` table has rows.

- [ ] **Step 3: Commit**

```bash
git add app/press/page.tsx
git commit -m "feat(press): fetch and render press list from Supabase"
```

---

### Task 25: Implement Press detail page

**Files:**
- Modify: `app/press/[id]/page.tsx`

- [ ] **Step 1: Replace `app/press/[id]/page.tsx`**

```tsx
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ScrollReveal } from '@/components/ScrollReveal';
import { Button } from '@/components/ui/Button';
import { fetchPressById } from '@/lib/api';

export default async function PressDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const n = Number(id);
  if (!Number.isFinite(n)) notFound();

  const p = await fetchPressById(n);
  if (!p) notFound();

  return (
    <>
      <ScrollReveal />
      <article className="py-16 md:py-24 bg-white">
        <div className="wrap max-w-3xl">
          <p className="fu text-xs font-bold text-primary tracking-wider uppercase">{p.cat || 'NEWS'}</p>
          <h1 className="fu mt-3 text-2xl md:text-4xl font-bold text-navy leading-tight">{p.title}</h1>
          <div className="fu mt-4 flex items-center gap-2 text-sm text-slate-400">
            <span>{p.source}</span><span>·</span><span>{p.date}</span>
          </div>
          {p.img && (
            <div className="fu relative aspect-[16/9] bg-slate-100 rounded-2xl overflow-hidden mt-8">
              <Image src={p.img} alt={p.title} fill sizes="(min-width:768px) 720px, 100vw" className="object-cover" />
            </div>
          )}
          <div className="fu mt-8 text-slate-700 leading-loose whitespace-pre-line">{p.content || p.summary}</div>

          <div className="fu mt-12 flex flex-wrap gap-3">
            <Link href="/press"><Button variant="outline">← 목록으로</Button></Link>
            {p.origin_url && (
              <a href={p.origin_url} target="_blank" rel="noopener">
                <Button>원문 보기 ↗</Button>
              </a>
            )}
          </div>
        </div>
      </article>
    </>
  );
}
```

- [ ] **Step 2: Click a press card from `/press` and confirm detail renders.**

- [ ] **Step 3: Commit**

```bash
git add app/press/[id]/page.tsx
git commit -m "feat(press): add press detail page"
```

---

### Task 26: Add useContactForm hook

**Files:**
- Create: `hooks/useContactForm.ts`
- Create: `hooks/__tests__/useContactForm.test.ts`

Legacy reference: `legacy/app.js:211` (`validateContactForm`), `:234` (`handleContactSubmit`).

- [ ] **Step 1: Write failing test `hooks/__tests__/useContactForm.test.ts`**

```ts
import { describe, it, expect } from 'vitest';
import { validateContact } from '@/hooks/useContactForm';

describe('validateContact', () => {
  const valid = {
    company: 'Acme', dept: 'IT', scale: 'medium', biz: 'tech',
    name: '홍길동', pos: 'CTO', phone: '010-1234-5678',
    email: 'a@b.com', msg: '문의합니다.',
  };

  it('passes with valid input', () => {
    expect(validateContact(valid)).toEqual({});
  });

  it('flags empty required fields', () => {
    const errs = validateContact({ ...valid, company: '', name: '', msg: '' });
    expect(errs.company).toBeTruthy();
    expect(errs.name).toBeTruthy();
    expect(errs.msg).toBeTruthy();
  });

  it('flags invalid email', () => {
    const errs = validateContact({ ...valid, email: 'not-an-email' });
    expect(errs.email).toBeTruthy();
  });

  it('flags invalid phone', () => {
    const errs = validateContact({ ...valid, phone: '1234' });
    expect(errs.phone).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run test — should fail**

```bash
npm test -- hooks/__tests__/useContactForm.test.ts
```

Expected: FAIL.

- [ ] **Step 3: Implement `hooks/useContactForm.ts`**

```ts
'use client';
import { useState } from 'react';
import type { ContactInput } from '@/types';

export type ContactErrors = Partial<Record<keyof ContactInput, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[\d\-\s()+]{9,}$/;

export function validateContact(v: ContactInput): ContactErrors {
  const errs: ContactErrors = {};
  if (!v.company.trim()) errs.company = '회사명을 입력해주세요.';
  if (!v.name.trim()) errs.name = '이름을 입력해주세요.';
  if (!v.phone.trim() || !PHONE_RE.test(v.phone)) errs.phone = '유효한 연락처를 입력해주세요.';
  if (!v.email.trim() || !EMAIL_RE.test(v.email)) errs.email = '유효한 이메일을 입력해주세요.';
  if (!v.msg.trim()) errs.msg = '문의 내용을 입력해주세요.';
  return errs;
}

const EMPTY: ContactInput = {
  company: '', dept: '', scale: '', biz: '',
  name: '', pos: '', phone: '', email: '', msg: '',
};

export function useContactForm() {
  const [values, setValues] = useState<ContactInput>(EMPTY);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [submitting, setSubmitting] = useState(false);

  function update<K extends keyof ContactInput>(key: K, value: ContactInput[K]) {
    setValues((v) => ({ ...v, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function reset() {
    setValues(EMPTY);
    setErrors({});
  }

  return { values, errors, setErrors, submitting, setSubmitting, update, reset };
}
```

- [ ] **Step 4: Run tests — should pass**

```bash
npm test
```

Expected: all tests pass.

- [ ] **Step 5: Commit**

```bash
git add hooks/useContactForm.ts hooks/__tests__/useContactForm.test.ts
git commit -m "feat(hooks): add useContactForm with validation + tests"
```

---

### Task 27: Implement Contact page

**Files:**
- Modify: `app/contact/page.tsx`
- Create: `components/ContactForm.tsx`

- [ ] **Step 1: Create `components/ContactForm.tsx`**

```tsx
'use client';
import { useContactForm, validateContact } from '@/hooks/useContactForm';
import { submitContact } from '@/lib/api';
import { useToast } from '@/components/ToastProvider';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

const SCALES = ['소규모', '중소규모', '중견기업', '대기업'];
const BIZ = ['제조', 'IT/SW', '금융', '공공', '의료', '교육', '기타'];

function field(label: string, required = false) {
  return (
    <label className="block text-sm font-semibold text-navy mb-1.5">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
  );
}

export function ContactForm() {
  const { values, errors, setErrors, submitting, setSubmitting, update, reset } = useContactForm();
  const toast = useToast();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const v = validateContact(values);
    setErrors(v);
    if (Object.keys(v).length > 0) {
      toast.show('error', '필수 항목을 확인해주세요.');
      return;
    }
    setSubmitting(true);
    try {
      await submitContact(values);
      toast.show('success', '문의가 접수되었습니다.', '담당자가 곧 연락드립니다.');
      reset();
    } catch (e) {
      toast.show('error', '전송 실패', (e as Error).message);
    } finally {
      setSubmitting(false);
    }
  }

  const inputCls = (err?: string) =>
    cn(
      'w-full rounded-lg border bg-white px-4 py-3 text-sm outline-none transition-colors',
      err ? 'border-red-400 focus:border-red-500 animate-shake' : 'border-border focus:border-primary',
    );

  return (
    <form onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-2">
      <div>
        {field('회사명', true)}
        <input className={inputCls(errors.company)} value={values.company} onChange={(e) => update('company', e.target.value)} />
        {errors.company && <p className="mt-1 text-xs text-red-500">{errors.company}</p>}
      </div>
      <div>
        {field('부서')}
        <input className={inputCls(errors.dept)} value={values.dept} onChange={(e) => update('dept', e.target.value)} />
      </div>
      <div>
        {field('기업 규모')}
        <select className={inputCls(errors.scale)} value={values.scale} onChange={(e) => update('scale', e.target.value)}>
          <option value="">선택</option>
          {SCALES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <div>
        {field('업종')}
        <select className={inputCls(errors.biz)} value={values.biz} onChange={(e) => update('biz', e.target.value)}>
          <option value="">선택</option>
          {BIZ.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <div>
        {field('이름', true)}
        <input className={inputCls(errors.name)} value={values.name} onChange={(e) => update('name', e.target.value)} />
        {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
      </div>
      <div>
        {field('직책')}
        <input className={inputCls(errors.pos)} value={values.pos} onChange={(e) => update('pos', e.target.value)} />
      </div>
      <div>
        {field('연락처', true)}
        <input className={inputCls(errors.phone)} value={values.phone} onChange={(e) => update('phone', e.target.value)} placeholder="010-0000-0000" />
        {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
      </div>
      <div>
        {field('이메일', true)}
        <input type="email" className={inputCls(errors.email)} value={values.email} onChange={(e) => update('email', e.target.value)} />
        {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
      </div>
      <div className="md:col-span-2">
        {field('문의 내용', true)}
        <textarea rows={6} className={inputCls(errors.msg)} value={values.msg} onChange={(e) => update('msg', e.target.value)} />
        {errors.msg && <p className="mt-1 text-xs text-red-500">{errors.msg}</p>}
      </div>
      <div className="md:col-span-2 flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={reset} disabled={submitting}>초기화</Button>
        <Button type="submit" disabled={submitting}>{submitting ? '전송 중...' : '문의 접수'}</Button>
      </div>
    </form>
  );
}
```

- [ ] **Step 2: Replace `app/contact/page.tsx`**

```tsx
import { ScrollReveal } from '@/components/ScrollReveal';
import { ContactForm } from '@/components/ContactForm';

export default function ContactPage() {
  return (
    <>
      <ScrollReveal />
      <section className="py-24 bg-slate-50">
        <div className="wrap max-w-3xl">
          <div className="fu text-center mb-12">
            <p className="text-primary text-sm font-bold tracking-[.12em] uppercase">Contact</p>
            <h1 className="mt-3 text-3xl md:text-5xl font-bold text-navy">무료 보안 점검 문의</h1>
            <p className="mt-5 text-slate-600">전문가가 30분 내 분석 결과를 회신드립니다.</p>
          </div>
          <div className="fu rounded-2xl border border-border bg-white p-6 md:p-10">
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
```

- [ ] **Step 3: Manually test end-to-end**

```bash
npm run dev
```

Visit `/contact`, fill the form with real data, submit. Expected:
1. Toast "문의가 접수되었습니다." appears
2. Supabase `contacts` table contains the new row (check Supabase dashboard)
3. The `send-contact-email` Edge Function receives the payload (check Supabase function logs)

Also test validation: submit an empty form → error toast + field-level errors + shake animation.

- [ ] **Step 4: Commit**

```bash
git add components/ContactForm.tsx app/contact/page.tsx
git commit -m "feat(contact): add contact form with validation and Supabase submit"
```

---

### Task 28: Add chatbot data and matcher

**Files:**
- Create: `data/chatbotReplies.ts`
- Create: `data/__tests__/chatbotReplies.test.ts`

Legacy reference: `legacy/index.html:1530-1555` (search for "AI 보안링스 Boanlinks 소개" and surrounding keyword-matching code).

- [ ] **Step 1: Write failing test `data/__tests__/chatbotReplies.test.ts`**

```ts
import { describe, it, expect } from 'vitest';
import { matchReply, CHATBOT_REPLIES } from '@/data/chatbotReplies';

describe('matchReply', () => {
  it('returns fallback when no keyword matches', () => {
    const result = matchReply('random query about weather');
    expect(result).toBeTruthy();
    expect(result.length).toBeGreaterThan(0);
  });

  it('matches a known keyword', () => {
    const r = matchReply('솔루션 알려주세요');
    expect(r).toBeTruthy();
  });

  it('has at least one reply configured', () => {
    expect(CHATBOT_REPLIES.length).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 2: Run test — should fail**

```bash
npm test -- data/__tests__/chatbotReplies.test.ts
```

Expected: FAIL.

- [ ] **Step 3: Implement `data/chatbotReplies.ts`**

Read the keyword→reply pairs from `legacy/index.html:1530-1555` and transcribe them. Shape:

```ts
import type { ChatbotReply } from '@/types';

export const CHATBOT_REPLIES: ChatbotReply[] = [
  {
    keywords: ['소개', '뭐하는', '보안링스', 'boanlinks', 'about'],
    reply:
      'AI 보안링스 Boanlinks 소개 🏢\n\n(주)진앤현시큐리티가 운영하는 기업 보안 전문 플랫폼입니다.\n\n✅ 24년 보안 전문 업력 (2000년 설립)\n✅ 280+ 고객사 보안 지원\n✅ 연평균 매출 약 220억원\n✅ 미국 CMMC PRO 등록 완료',
  },
  {
    keywords: ['파트너', '제휴', 'partner'],
    reply:
      '🤝 Boanlinks 파트너사\n\n🛡️ 현대해상 — 사이버보험 연계\n⚖️ 법무법인 로데이터 — 사이버사고 법률 대응\n🔐 (주)진앤현시큐리티 — 전문 보안 관리\n\n보안 사고 발생 시 보험·법률·기술을 통합 대응합니다!',
  },
  {
    keywords: ['솔루션', '제품', 'solution'],
    reply:
      '🧩 주요 솔루션\n\n· 보안마켓플레이스 (Boanlinks)\n· 양자데이터금고시스템 (D-GO)\n· 전사적 보안사고 예측평가 (ESE)\n· 보안 WiFi (SECU WI-FI)\n· 보안리스크 관리 (SECUMOM)',
  },
  {
    keywords: ['문의', '연락', 'contact', '상담'],
    reply: '☎️ 문의 / 상담\n\n사이트 우측 상단 "무료 보안 점검" 버튼으로 문의하시면 30분 내 전문가가 회신드립니다.',
  },
];

const FALLBACK =
  '죄송합니다. 질문을 이해하지 못했습니다. 🤖\n"소개", "솔루션", "파트너", "문의" 등의 키워드로 다시 물어봐주세요.';

export function matchReply(query: string): string {
  const q = query.toLowerCase();
  for (const r of CHATBOT_REPLIES) {
    if (r.keywords.some((k) => q.includes(k.toLowerCase()))) return r.reply;
  }
  return FALLBACK;
}
```

> **Note:** Verify the exact keyword list and reply text in `legacy/index.html:1530-1555` during implementation and adjust verbatim so visual/content parity is preserved.

- [ ] **Step 4: Run tests — should pass**

```bash
npm test
```

Expected: all pass.

- [ ] **Step 5: Commit**

```bash
git add data/chatbotReplies.ts data/__tests__/chatbotReplies.test.ts
git commit -m "feat(data): add chatbot replies and keyword matcher with tests"
```

---

### Task 29: Implement Chatbot component

**Files:**
- Create: `components/Chatbot.tsx`
- Modify: `app/layout.tsx` (mount Chatbot globally)

Legacy reference: search `legacy/index.html` for chat bubble / widget styling.

- [ ] **Step 1: Create `components/Chatbot.tsx`**

```tsx
'use client';
import { useState } from 'react';
import { matchReply } from '@/data/chatbotReplies';
import { cn } from '@/lib/utils';

type Msg = { id: string; from: 'user' | 'bot'; text: string };

export function Chatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [msgs, setMsgs] = useState<Msg[]>([
    { id: 'init', from: 'bot', text: '안녕하세요! Boanlinks 챗봇입니다. 무엇을 도와드릴까요?' },
  ]);

  function send() {
    const text = input.trim();
    if (!text) return;
    const userMsg: Msg = { id: Math.random().toString(36).slice(2), from: 'user', text };
    const botMsg: Msg = {
      id: Math.random().toString(36).slice(2) + 'b',
      from: 'bot',
      text: matchReply(text),
    };
    setMsgs((m) => [...m, userMsg, botMsg]);
    setInput('');
  }

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full bg-primary text-white shadow-lg hover:scale-105 transition-transform animate-p-glow"
        aria-label="챗봇 열기"
      >
        {open ? '×' : '💬'}
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-40 w-[90vw] max-w-sm h-[28rem] rounded-2xl bg-white shadow-2xl border border-border flex flex-col animate-chat-in">
          <div className="px-4 py-3 border-b border-border bg-gradient-to-r from-navy to-slate850 rounded-t-2xl text-white">
            <p className="font-bold">Boanlinks 챗봇</p>
            <p className="text-xs text-white/70">궁금한 점을 물어보세요</p>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {msgs.map((m) => (
              <div key={m.id} className={cn('flex', m.from === 'user' ? 'justify-end' : 'justify-start')}>
                <div
                  className={cn(
                    'max-w-[80%] rounded-2xl px-4 py-2 text-sm whitespace-pre-line',
                    m.from === 'user' ? 'bg-primary text-white' : 'bg-slate-100 text-navy',
                  )}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>
          <form
            onSubmit={(e) => { e.preventDefault(); send(); }}
            className="p-3 border-t border-border flex gap-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="메시지를 입력하세요..."
              className="flex-1 rounded-full border border-border bg-slate-50 px-4 py-2 text-sm outline-none focus:border-primary"
            />
            <button
              type="submit"
              className="rounded-full bg-primary text-white px-4 py-2 text-sm font-semibold disabled:opacity-50"
              disabled={!input.trim()}
            >
              전송
            </button>
          </form>
        </div>
      )}
    </>
  );
}
```

- [ ] **Step 2: Mount Chatbot in `app/layout.tsx`**

Edit `app/layout.tsx` to add the Chatbot inside `ToastProvider` just before the closing tag:

```tsx
import { Chatbot } from '@/components/Chatbot';

// ...inside <ToastProvider>, after <Footer />:
<Chatbot />
```

The complete provider block becomes:

```tsx
<ToastProvider>
  <HashRedirect />
  <Header />
  <main>{children}</main>
  <Footer />
  <Chatbot />
</ToastProvider>
```

- [ ] **Step 3: Verify in dev**

```bash
npm run dev
```

Confirm the floating chat button appears bottom-right on all pages. Open it, type "솔루션" — should reply with solution list. Type "날씨" — should show fallback.

- [ ] **Step 4: Commit**

```bash
git add components/Chatbot.tsx app/layout.tsx
git commit -m "feat(chatbot): add Chatbot widget mounted globally"
```

---

### Task 30: Full Phase 3 verification

- [ ] **Step 1: Run all tests**

```bash
npm test
```

Expected: all pass.

- [ ] **Step 2: Run type check**

```bash
npx tsc --noEmit
```

Expected: exits 0.

- [ ] **Step 3: Run production build locally**

```bash
npm run build
```

Expected: build succeeds without errors. Note any warnings and investigate.

- [ ] **Step 4: Serve built output and sanity-check**

```bash
npm start
```

Visit every route (`/`, `/about`, `/solution`, `/solution/boanlinks`, `/press`, click a press item, `/contact`), submit the contact form with test data, open the chatbot, test mobile menu (resize to 375px in devtools).

- [ ] **Step 5: Commit any fixes discovered during verification**

---

## Phase 4 — Vercel Deployment

### Task 31: Create Vercel project and configure environment

> This task requires the user to log into Vercel and perform UI actions. The steps list what to do; no code changes are needed.

- [ ] **Step 1: Push `nextjs-migration` branch to origin**

```bash
git push -u origin nextjs-migration
```

- [ ] **Step 2: In Vercel dashboard → Add New Project → Import `boanlinks-testpage2` from GitHub**

Vercel should detect Next.js automatically. Accept defaults.

- [ ] **Step 3: Set Environment Variables in the Vercel project**

Add to **Production** and **Preview**:
- `NEXT_PUBLIC_SUPABASE_URL` = value from `.env`
- `NEXT_PUBLIC_SUPABASE_KEY` = value from `.env`

- [ ] **Step 4: Set production branch to `main` for now** (but note the initial deployment will come from `nextjs-migration` as a Preview)

- [ ] **Step 5: Trigger a Preview deployment from `nextjs-migration`**

Either push an empty commit or click "Redeploy" in Vercel. Wait for build to succeed.

- [ ] **Step 6: Visit the Preview URL (e.g. `boanlinks-testpage2-xxxx.vercel.app`)** and run the same verification as Phase 3 Task 30 Step 4.

- [ ] **Step 7: Document Preview URL**

Append to `README.md`:

```markdown
## Preview URL

- **Current Preview:** https://boanlinks-testpage2-xxxx.vercel.app (from `nextjs-migration` branch)
```

Commit:

```bash
git add README.md
git commit -m "docs: add Vercel preview URL"
git push
```

---

### Task 32: Cross-browser and responsive QA

- [ ] **Step 1: Open Preview URL in Chrome desktop, Safari desktop, Firefox desktop**

Walk every route. Check:
- Hero slider auto-advances
- Mobile menu toggle works
- Contact form validation + submit
- Press list loads
- Chatbot opens/sends/replies
- Fonts (Pretendard) load

- [ ] **Step 2: Open Preview URL in mobile Safari (iPhone) and Chrome Android**

Repeat. Check viewport, touch targets, no horizontal scroll.

- [ ] **Step 3: Run Lighthouse (Chrome Devtools → Lighthouse) on Home page**

Target: Performance ≥ 90, Accessibility ≥ 95.

If scores are below target, fix the top two reported issues and redeploy. Common fixes:
- Add `alt` to images
- Reduce hero image dimensions
- Add `aria-label` to icon-only buttons

- [ ] **Step 4: Report findings and commit any fixes before proceeding**

---

## Phase 5 — Cutover

### Task 33: Merge to main

- [ ] **Step 1: Ensure `nextjs-migration` is up to date**

```bash
git fetch origin
git rebase origin/main
```

- [ ] **Step 2: Push any rebase changes**

```bash
git push --force-with-lease
```

- [ ] **Step 3: Open PR `nextjs-migration` → `main`** via GitHub UI, with a summary of the migration and links to the spec and plan. Request self-review.

- [ ] **Step 4: Merge the PR** (after review).

---

### Task 34: Lower DNS TTL and prepare for cutover

- [ ] **Step 1: Check current DNS settings for `boanlinks.com`**

Use your domain registrar's DNS panel. Identify current A records (likely GitHub Pages IPs: `185.199.108.153`, `.109.153`, `.110.153`, `.111.153`).

- [ ] **Step 2: Lower TTL on the A and any CNAME records to 300 seconds (5 minutes)**

Save and wait 1–2× the *previous* TTL period (could be hours) so worldwide caches honor the new low TTL before cutover.

---

### Task 35: Vercel domain attachment and DNS cutover

- [ ] **Step 1: In Vercel dashboard → project Settings → Domains → Add `boanlinks.com`**

Also add `www.boanlinks.com` (optional — redirects to apex).

- [ ] **Step 2: Vercel will show required DNS values**

Typical instructions:
- A record for apex `boanlinks.com` → `76.76.21.21`
- CNAME for `www` → `cname.vercel-dns.com`

- [ ] **Step 3: Update DNS at the registrar**

Replace GitHub Pages A records with the Vercel values. Save.

- [ ] **Step 4: Wait for DNS propagation (5–10 minutes with low TTL)**

Check with `dig boanlinks.com +short` (or online tools). Confirm it resolves to `76.76.21.21`.

- [ ] **Step 5: Verify HTTPS loads**

Open `https://boanlinks.com` — should serve from Vercel. Run the Task 32 Step 1 verification again against the live domain.

- [ ] **Step 6: If anything breaks, revert DNS to GitHub Pages IPs** (emergency rollback — TTL is 300s so revert is fast).

---

### Task 36: Disable GitHub Pages and finalize

- [ ] **Step 1: In GitHub repo Settings → Pages → set Source to `None`**

- [ ] **Step 2: Update `README.md` with final architecture**

Rewrite `README.md` to describe:
- Current stack (Next.js 15 App Router + TS + Tailwind + Supabase + Vercel)
- Repo layout (app/, components/, hooks/, lib/, data/, types/, legacy/, scripts/)
- Development commands (`npm run dev`, `npm test`, `npm run build`)
- Deployment (automatic via Vercel on push to `main`)
- Environment variables (list names, point to Vercel dashboard)
- Crawler workflow (untouched, still runs daily 09:00 KST)
- Migration history (link to spec and plan docs)

Commit:

```bash
git add README.md
git commit -m "docs: update README for Next.js architecture post-migration"
git push
```

- [ ] **Step 3: Raise DNS TTL back to a normal value (3600 or 86400)**

- [ ] **Step 4: Final success check**

Verify success criteria from spec section 15:
- [ ] `boanlinks.com` serves Next.js build
- [ ] All 5 pages visually match legacy
- [ ] Press list/detail loads from Supabase
- [ ] Contact form submits → DB row + email received
- [ ] Chatbot responds correctly
- [ ] Hash URL (`#/about`) redirects
- [ ] Lighthouse Perf ≥ 90, A11y ≥ 95
- [ ] GitHub Actions crawler still running (check last run in Actions tab)

- [ ] **Step 5: Celebrate 🎉**
