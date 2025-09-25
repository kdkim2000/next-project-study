// src/app/layout.tsx
// 🏗️ RootLayout - Next.js 15 + MUI v7 + React 19 최신 조합 (호환성 수정)

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/providers/ThemeProvider';

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
  description: 'Next.js 15와 MUI v7을 활용한 현대적인 기업 랜딩 페이지. React Hook Form, Framer Motion, TypeScript로 구축된 고품질 웹 애플리케이션입니다.',
  keywords: [
    'Modern Business',
    'Next.js 15',
    'React 19',
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
  
  // Open Graph 메타데이터
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: 'Modern Business',
    title: 'Modern Business - 혁신적인 비즈니스 솔루션',
    description: 'Next.js 15와 MUI v7을 활용한 현대적인 기업 랜딩 페이지',
  },
  
  // Twitter Card 메타데이터
  twitter: {
    card: 'summary_large_image',
    title: 'Modern Business - 혁신적인 비즈니스 솔루션',
    description: 'Next.js 15와 MUI v7을 활용한 현대적인 기업 랜딩 페이지',
  },
  
  // 로봇 크롤링 설정
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
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
        
        {/* 파비콘 */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        
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
      </head>
      
      <body className={inter.className}>
        {/* 별도 클라이언트 컴포넌트로 분리한 ThemeProvider */}
        <ThemeProvider>
          {/* 메인 애플리케이션 */}
          <div id="__next" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            {children}
          </div>
          
          {/* 포털을 위한 컨테이너 */}
          <div id="modal-root" />
        </ThemeProvider>
      </body>
    </html>
  );
}

/* 
📚 학습 노트: Next.js 15 + MUI v7 + React 19 호환성 해결

1. 🔧 주요 변경사항:
   - AppRouterCacheProvider를 별도 클라이언트 컴포넌트로 분리
   - 서버 컴포넌트에서 클라이언트 전용 코드 제거
   - 모듈 로딩 순서 최적화

2. ⚠️ 해결된 문제:
   - webpack 모듈 로딩 오류 해결
   - React Server Components와 Client Components 경계 명확화
   - MUI Provider 초기화 타이밍 이슈 해결

3. 🎯 다음 단계:
   - ThemeProvider 컴포넌트 생성 필요
   - 클라이언트/서버 경계 최적화
   - 성능 모니터링 추가
*/