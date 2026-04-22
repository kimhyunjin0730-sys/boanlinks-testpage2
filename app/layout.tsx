import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI 보안링스 - Boanlinks',
  description: '기업의 보안 파트너, AI 보안링스',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
