// src/app/layout.tsx
// Next.js 앱의 루트 레이아웃 - 모든 페이지에 적용되는 기본 레이아웃

import type { Metadata } from 'next';
import './globals.css';

// 메타데이터 설정
export const metadata: Metadata = {
  title: {
    template: '%s | Content Studio CMS',
    default: 'Content Studio CMS',
  },
  description: 'Content Studio - 현대적이고 사용하기 쉬운 콘텐츠 관리 시스템',
  keywords: ['CMS', 'Content Management', 'Next.js', 'React', 'TypeScript'],
  authors: [{ name: 'Content Studio Team' }],
  creator: 'Content Studio',
  publisher: 'Content Studio',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: 'https://content-studio.example.com',
    siteName: 'Content Studio CMS',
    title: 'Content Studio CMS',
    description: '현대적이고 사용하기 쉬운 콘텐츠 관리 시스템',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Content Studio CMS',
    description: '현대적이고 사용하기 쉬운 콘텐츠 관리 시스템',
    creator: '@contentstudio',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

/**
 * 루트 레이아웃 컴포넌트
 * 모든 페이지에 공통으로 적용되는 HTML 구조를 정의
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        {/* 추가 메타 태그 */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#1976d2" />
        
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Google Fonts (Material-UI와 잘 맞는 폰트) */}
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&family=Noto+Sans+KR:wght@300;400;500;700&display=swap"
          rel="stylesheet"
        />
        
        {/* Material Icons */}
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
          rel="stylesheet"
        />
      </head>
      <body>
        {/* Skip to main content link for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50 focus:p-4 focus:bg-blue-600 focus:text-white"
        >
          메인 콘텐츠로 건너뛰기
        </a>

        {/* Main content wrapper */}
        <div id="main-content">
          {children}
        </div>

        {/* 개발 환경에서만 표시되는 개발자 도구 표시 */}
        {process.env.NODE_ENV === 'development' && (
          <div
            style={{
              position: 'fixed',
              bottom: 10,
              right: 10,
              padding: '4px 8px',
              backgroundColor: '#ff9800',
              color: 'white',
              fontSize: '12px',
              borderRadius: '4px',
              zIndex: 9999,
              fontFamily: 'monospace',
            }}
          >
            DEV MODE
          </div>
        )}

        {/* 노스크립트 사용자를 위한 메시지 */}
        <noscript>
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              padding: '16px',
              backgroundColor: '#f44336',
              color: 'white',
              textAlign: 'center',
              zIndex: 9999,
            }}
          >
            이 웹사이트는 JavaScript가 필요합니다. JavaScript를 활성화해 주세요.
          </div>
        </noscript>
      </body>
    </html>
  );
}