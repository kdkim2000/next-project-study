// src/app/layout.tsx
// 수정된 루트 레이아웃 - 테마 오류 해결

import { Inter } from 'next/font/google'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter'
import { CssBaseline } from '@mui/material'
import { AppThemeProvider } from '@/contexts/ThemeContext'
import ClientLayout from '@/components/layout/ClientLayout'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'John Doe - Frontend Developer',
  description: '프론트엔드 개발자 John Doe의 포트폴리오',
  keywords: ['프론트엔드', '개발자', 'React', 'Next.js', 'TypeScript', '포트폴리오'],
  authors: [{ name: 'John Doe' }],
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        {/* 추가 메타 태그들 */}
        <meta name="theme-color" content="#2563eb" />
        <meta name="color-scheme" content="light dark" />
      </head>
      <body className={inter.className}>
        <AppRouterCacheProvider>
          <AppThemeProvider>
            <CssBaseline />
            <ClientLayout>
              {children}
            </ClientLayout>
          </AppThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  )
}