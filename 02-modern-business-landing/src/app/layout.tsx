// src/app/layout.tsx
// 🎯 학습 목표: Next.js의 공통 레이아웃 이해하기
// MUI v6 호환성 버전

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '@/lib/theme';

// 🔤 Google Fonts 설정
const inter = Inter({ subsets: ['latin'] });

// 📝 페이지 메타데이터 설정 (SEO에 중요)
export const metadata: Metadata = {
  title: 'Modern Business - Professional Solutions',
  description: 'Next.js와 MUI를 활용한 현대적인 기업 랜딩 페이지',
  keywords: 'business, landing page, nextjs, mui',
};

// 🏗️ RootLayout: 모든 페이지의 공통 구조
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        {/* MUI 테마 프로바이더 - 전체 앱에 일관된 디자인 적용 */}
        <ThemeProvider theme={theme}>
          {/* CSS 기본값 리셋 - 브라우저 간 일관성 보장 */}
          <CssBaseline />
          {/* 실제 페이지 내용이 여기에 렌더링됩니다 */}
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

/* 
📚 학습 노트:
1. MUI v6에서는 AppRouterCacheProvider가 선택사항입니다
2. 기본 ThemeProvider와 CssBaseline만으로도 충분히 동작합니다
3. 필요한 경우 나중에 캐시 최적화를 추가할 수 있습니다
4. layout.tsx는 Next.js App Router의 핵심 개념입니다
5. children props를 통해 페이지 내용을 받아옵니다
*/