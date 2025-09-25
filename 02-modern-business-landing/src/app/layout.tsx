// src/app/layout.tsx
// 🏗️ RootLayout - MUI v7 호환성과 최적화된 구조

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import theme from '@/lib/theme';

// 🔤 Google Fonts 최적화 설정
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-inter',
});

// 📝 SEO 최적화된 메타데이터
export const metadata: Metadata = {
  title: {
    default: 'Modern Business - 혁신적인 비즈니스 솔루션',
    template: '%s | Modern Business',
  },
  description: 'Next.js와 MUI v7을 활용한 현대적인 기업 랜딩 페이지. React Hook Form, Framer Motion, TypeScript로 구축된 고품질 웹 애플리케이션입니다.',
  keywords: [
    'Modern Business',
    'Next.js',
    'React',
    'TypeScript', 
    'MUI v7',
    'Framer Motion',
    'React Hook Form',
    '웹 개발',
    '비즈니스 솔루션',
    '랜딩 페이지'
  ],
  authors: [{ name: 'Modern Business Team' }],
  creator: 'Modern Business',
  publisher: 'Modern Business',
  applicationName: 'Modern Business Landing',
  referrer: 'origin-when-cross-origin',
  
  // Open Graph 메타데이터
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: 'Modern Business',
    title: 'Modern Business - 혁신적인 비즈니스 솔루션',
    description: 'Next.js와 MUI v7을 활용한 현대적인 기업 랜딩 페이지',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Modern Business - 혁신적인 비즈니스 솔루션',
      },
    ],
  },
  
  // Twitter Card 메타데이터
  twitter: {
    card: 'summary_large_image',
    title: 'Modern Business - 혁신적인 비즈니스 솔루션',
    description: 'Next.js와 MUI v7을 활용한 현대적인 기업 랜딩 페이지',
    images: ['/twitter-image.jpg'],
  },
  
  // 추가 메타데이터
  manifest: '/site.webmanifest',
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL,
  },
  
  // 로봇 크롤링 설정
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  
  // 기타 메타데이터
  category: 'technology',
  classification: 'Business',
  
  // 앱 링크 (모바일 앱이 있는 경우)
  // appLinks: {},
  
  // 검증 메타태그 (필요시)
  // verification: {
  //   google: 'google-verification-code',
  //   yandex: 'yandex-verification-code',
  //   yahoo: 'yahoo-site-verification',
  // },
};

// 🌐 Viewport 설정
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#1976d2' },
    { media: '(prefers-color-scheme: dark)', color: '#1976d2' },
  ],
};

// 🏗️ RootLayout 컴포넌트
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={inter.variable}>
      <head>
        {/* 추가 메타태그 */}
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        
        {/* 파비콘 */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        
        {/* 프리로드 중요 리소스 */}
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        
        {/* 환경별 설정 */}
        {process.env.NODE_ENV === 'production' && (
          <>
            {/* Google Analytics (필요시) */}
            {process.env.NEXT_PUBLIC_GA_ID && (
              <>
                <script
                  async
                  src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
                />
                <script
                  dangerouslySetInnerHTML={{
                    __html: `
                      window.dataLayer = window.dataLayer || [];
                      function gtag(){dataLayer.push(arguments);}
                      gtag('js', new Date());
                      gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
                    `,
                  }}
                />
              </>
            )}
          </>
        )}
      </head>
      
      <body className={inter.className}>
        {/* MUI v7 최적화된 Provider 구조 */}
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            {/* CSS 기본값 리셋 및 MUI 스타일 정규화 */}
            <CssBaseline enableColorScheme />
            
            {/* 메인 애플리케이션 */}
            <div id="__next" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
              {children}
            </div>
            
            {/* 포털을 위한 컨테이너 */}
            <div id="modal-root" />
            <div id="tooltip-root" />
          </ThemeProvider>
        </AppRouterCacheProvider>
        
        {/* 서비스 워커 등록 (PWA 지원시) */}
        {process.env.NODE_ENV === 'production' && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                if ('serviceWorker' in navigator) {
                  navigator.serviceWorker.register('/sw.js')
                    .then((registration) => {
                      console.log('SW registered: ', registration);
                    })
                    .catch((registrationError) => {
                      console.log('SW registration failed: ', registrationError);
                    });
                }
              `,
            }}
          />
        )}
      </body>
    </html>
  );
}

/* 
📚 학습 노트: MUI v7 + Next.js 15 최적화

1. 🎯 MUI v7 새로운 기능:
   - AppRouterCacheProvider로 캐싱 최적화
   - enableColorScheme으로 색상 스키마 지원
   - 향상된 ThemeProvider 성능

2. 🔍 SEO 최적화:
   - 상세한 메타데이터 설정
   - Open Graph와 Twitter Cards
   - 구조화된 데이터 준비

3. ⚡ 성능 최적화:
   - Google Fonts preconnect
   - 중요 리소스 프리로드
   - 서비스 워커 지원

4. 📱 모바일 최적화:
   - viewport 세밀한 설정
   - PWA 준비
   - 터치 최적화

5. 🌐 접근성:
   - 언어 설정 (lang="ko")
   - 색상 스키마 지원
   - 키보드 네비게이션 준비

6. 🔧 개발자 경험:
   - TypeScript 완전 지원
   - 환경별 설정 분리
   - 디버깅 정보 포함
*/
