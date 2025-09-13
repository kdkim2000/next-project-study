// app/layout.tsx
// 서버 컴포넌트 레이아웃 - 테마는 클라이언트 컴포넌트로 분리

import type { Metadata } from 'next';
import ThemeProvider from '../components/ThemeProvider';
import './globals.css';

export const metadata: Metadata = {
  title: '간단한 CMS',
  description: '초보자를 위한 간단한 콘텐츠 관리 시스템',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        {/* Material-UI 폰트 로드 */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />
      </head>
      <body>
        {/* 테마 프로바이더를 클라이언트 컴포넌트로 분리 */}
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}