// src/app/layout.tsx - 루트 레이아웃 (수정된 버전)
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ThemeProvider from '@/components/ThemeProvider';
import WebVitalsReporter from '@/components/WebVitalsReporter';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Analytics Dashboard Pro',
  description: '심플한 분석 대시보드',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <ThemeProvider>
          <WebVitalsReporter />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}