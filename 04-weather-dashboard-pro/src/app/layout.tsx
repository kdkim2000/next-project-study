// src/app/layout.tsx
// 앱의 루트 레이아웃 - 전체 페이지의 공통 구조를 정의

import type { Metadata } from 'next';
import ThemeProvider from '@/components/ThemeProvider';

// PWA를 위한 메타데이터 설정
export const metadata: Metadata = {
  title: 'Weather Dashboard Pro - 실시간 날씨 정보',
  description: '실시간 날씨 정보와 7일 예보를 제공하는 날씨 대시보드',
  keywords: ['날씨', '일기예보', '대시보드', '실시간', 'weather', 'forecast'],
  authors: [{ name: 'Weather Dashboard Pro Team' }],
  
  // PWA 관련 설정
  manifest: '/manifest.json',
  themeColor: '#1976d2',
  
  // 뷰포트 설정
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  
  // Open Graph 설정 (소셜 미디어 공유 시)
  openGraph: {
    title: 'Weather Dashboard Pro',
    description: '실시간 날씨 정보와 7일 예보를 제공하는 날씨 대시보드',
    type: 'website',
    locale: 'ko_KR',
  },
  
  // 트위터 카드 설정
  twitter: {
    card: 'summary_large_image',
    title: 'Weather Dashboard Pro',
    description: '실시간 날씨 정보와 7일 예보를 제공하는 날씨 대시보드',
  },
  
  // 모바일 앱처럼 보이게 하는 설정
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Weather Dashboard Pro',
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ko">
      <head>
        {/* PWA를 위한 추가 메타 태그 */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Weather Dashboard Pro" />
        <meta name="mobile-web-app-capable" content="yes" />
        
        {/* 아이콘 설정 */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        
        {/* 폰트 최적화 */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body>
        {/* Material-UI 테마 프로바이더로 감싸기 */}
        <ThemeProvider>
          {children}
        </ThemeProvider>
        
        {/* PWA 서비스 워커 등록 스크립트 (개선된 버전) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  // 간단한 서비스 워커 사용 (Chrome 확장 프로그램 충돌 방지)
                  navigator.serviceWorker.register('/sw-simple.js')
                    .then(function(registration) {
                      console.log('SW registered successfully: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}