// src/app/layout.tsx (수정된 버전)
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter'
import GoogleAnalytics from '@/components/common/GoogleAnalytics'
import theme from '@/styles/theme'
import './globals.css'

// Google 폰트 설정
const inter = Inter({ subsets: ['latin'] })

// SEO를 위한 메타데이터 설정
export const metadata: Metadata = {
  title: 'Modern Business - 혁신적인 비즈니스 솔루션',
  description: '현대적이고 전문적인 비즈니스 솔루션을 제공하는 기업입니다.',
  keywords: '비즈니스, 솔루션, 현대적, 전문적',
  authors: [{ name: 'Modern Business Team' }],
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: 'Modern Business Landing',
    description: '혁신적인 비즈니스 솔루션',
    type: 'website',
    locale: 'ko_KR',
  },
}

/**
 * 전역 레이아웃 컴포넌트 (Server Component)
 * Google Analytics 연동 포함
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        {/* Google Analytics 연동 */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics GA_MEASUREMENT_ID={process.env.NEXT_PUBLIC_GA_ID} />
        )}
        
        {/* Material-UI 캐시 프로바이더 */}
        <AppRouterCacheProvider>
          {/* Material-UI 테마 프로바이더 */}
          <ThemeProvider theme={theme}>
            {/* CSS 기본값 정규화 */}
            <CssBaseline />
            {/* 실제 페이지 내용 */}
            {children}
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  )
}