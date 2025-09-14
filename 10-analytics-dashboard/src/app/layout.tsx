// src/app/layout.tsx - Parallel Routes 지원
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ThemeProvider from '@/components/ThemeProvider';
import WebVitalsReporter from '@/components/WebVitalsReporter';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Analytics Dashboard Pro',
  description: '엔터프라이즈급 분석 대시보드',
};

// Parallel Routes: modal, sidebar와 함께 렌더링
export default function RootLayout({
  children,
  modal,    // @modal 슬롯
  sidebar,  // @sidebar 슬롯
}: {
  children: React.ReactNode;
  modal?: React.ReactNode;    // Parallel Route
  sidebar?: React.ReactNode;  // Parallel Route
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <ThemeProvider>
          <WebVitalsReporter />
          <div className="flex min-h-screen">
            {/* Parallel Route: Sidebar */}
            {sidebar}
            
            {/* Main Content */}
            <main className="flex-1">
              {children}
            </main>
            
            {/* Parallel Route: Modal */}
            {modal}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}