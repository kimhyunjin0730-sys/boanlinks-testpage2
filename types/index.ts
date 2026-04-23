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

export type SolutionStat = {
  value: string;
  label: string;
  caption?: string;
};

export type SolutionPricingTier = {
  name: string;
  price: string;
  highlight?: boolean;
  features: string[];
};

export type SolutionFeatureDetail = {
  step: string;
  title: string;
  description: string;
};

export type SolutionValue = {
  title: string;
  description: string;
};

export type SolutionCustomerSegment = {
  type: string;
  need: string;
  solution: string;
};

export type SolutionThreat = {
  title: string;
  description: string;
};

export type SolutionMarketTrend = {
  source: string;
  metric: string;
  label: string;
  caption: string;
};

/**
 * Optional brochure data used on the solution detail page (e.g. 보안마켓플레이스).
 * Derived from the official 소개자료 PDF/PPTX so the landing page mirrors the brochure.
 */
export type SolutionBrochure = {
  tagline: string;
  summary: string;
  stats: SolutionStat[];
  customerSegments?: SolutionCustomerSegment[];
  threats?: SolutionThreat[];
  values?: SolutionValue[];
  featureDetails?: SolutionFeatureDetail[];
  techHighlights?: SolutionValue[];
  pricingTiers?: SolutionPricingTier[];
  marketTrends?: SolutionMarketTrend[];
  closingMessage?: string;
  /** Public path to the downloadable/viewable intro PDF (relative to /public) */
  pdfUrl?: string;
  /** Slide images rendered as a carousel on the detail page */
  slideImages?: string[];
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
  brochure?: SolutionBrochure;
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
