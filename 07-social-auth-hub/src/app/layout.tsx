// src/app/layout.tsx - 루트 레이아웃 (모든 페이지의 기본 구조)
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from '@/components/Providers';
import { ThemeRegistry } from '@/components/ThemeRegistry';

// Google Fonts - Inter 폰트 설정
const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap', // 폰트 로딩 최적화
});

// 메타데이터 설정 (SEO)
export const metadata: Metadata = {
  title: "Social Auth Hub",
  description: "Next.js 15 + NextAuth.js v5 소셜 인증 시스템 학습 프로젝트",
  keywords: ["Next.js", "NextAuth.js", "소셜 로그인", "인증", "React"],
  authors: [{ name: "Social Auth Hub" }],
};

/**
 * 루트 레이아웃 컴포넌트
 * - 모든 페이지에서 공통으로 사용되는 구조
 * - HTML 문서의 기본 틀 제공
 * - 전역 프로바이더들 설정
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        {/* 뷰포트 메타태그 */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={inter.className}>
        {/* Material-UI 테마 프로바이더 */}
        <ThemeRegistry>
          {/* NextAuth.js 세션 프로바이더 */}
          <Providers>
            {children}
          </Providers>
        </ThemeRegistry>
      </body>
    </html>
  );
}