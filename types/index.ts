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
