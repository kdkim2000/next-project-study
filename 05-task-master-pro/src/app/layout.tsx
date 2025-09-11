// src/app/layout.tsx - 애플리케이션의 루트 레이아웃

import type { Metadata } from 'next';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import CustomThemeProvider from '@/components/ThemeProvider';

// 메타데이터 설정 (SEO 및 브라우저 탭 정보)
export const metadata: Metadata = {
  title: 'Task Master Pro - 할 일 관리 애플리케이션',
  description: 'Next.js와 Material-UI로 만든 현대적인 할 일 관리 애플리케이션',
  keywords: ['할 일', '태스크', '관리', 'TODO', 'Next.js', 'Material-UI'],
  authors: [{ name: 'Task Master Pro Team' }],
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  themeColor: '#1976d2', // 브라우저 테마 색상
};

// 루트 레이아웃 컴포넌트
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        {/* 추가 메타 태그들 */}
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        
        {/* 파비콘 (선택사항) */}
        <link rel="icon" href="/favicon.ico" />
        
        {/* 구글 폰트 (Material-UI와 함께 사용하기 좋음) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />
      </head>
      <body>
        {/* AppRouterCacheProvider: Next.js App Router와 Material-UI 호환성을 위한 컴포넌트 */}
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          {/* CustomThemeProvider: Material-UI 테마 적용 */}
          <CustomThemeProvider>
            {/* 메인 콘텐츠 */}
            {children}
          </CustomThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}