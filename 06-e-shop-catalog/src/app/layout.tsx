// src/app/layout.tsx - 앱의 루트 레이아웃

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import ThemeProvider from '@/components/ThemeProvider';
import Header from '@/components/Header';
import { CartProvider } from '@/contexts/CartContext';

// Google Font 설정
const inter = Inter({ subsets: ['latin'] });

// 메타데이터 설정
export const metadata: Metadata = {
  title: 'E-Shop Catalog - 전자상거래 제품 카탈로그',
  description: 'React와 Next.js로 구축된 현대적인 전자상거래 제품 카탈로그',
  keywords: ['전자상거래', '쇼핑', '제품', '카탈로그', 'React', 'Next.js'],
  authors: [{ name: 'E-Shop Team' }],
  viewport: 'width=device-width, initial-scale=1',
};

/**
 * 앱의 루트 레이아웃 컴포넌트
 * 모든 페이지에서 공통으로 사용되는 레이아웃과 프로바이더들을 설정
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        {/* Material-UI 테마 프로바이더 */}
        <ThemeProvider>
          {/* 장바구니 상태 관리 프로바이더 */}
          <CartProvider>
            {/* 앱 헤더 */}
            <Header />
            
            {/* 메인 컨텐츠 */}
            <main>
              {children}
            </main>
            
            {/* 푸터 (선택사항) */}
            <footer style={{ 
              marginTop: '4rem', 
              padding: '2rem', 
              backgroundColor: '#f5f5f5',
              textAlign: 'center',
              color: '#666'
            }}>
              <p>&copy; 2025 E-Shop Catalog. React & Next.js 학습용 프로젝트입니다.</p>
            </footer>
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}