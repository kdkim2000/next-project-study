// src/app/layout.tsx
import type { Metadata } from 'next';
import Providers from '@/components/Providers'; // ← 추가
import './globals.css';

export const metadata: Metadata = {
  title: 'Analytics Dashboard Pro',
  description: '심플한 분석 대시보드',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
