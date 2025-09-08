// src/components/layout/ClientLayout.tsx
// 클라이언트 사이드 레이아웃 컴포넌트

'use client'

import { ReactNode } from 'react'
import { Box, Fade } from '@mui/material'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ScrollToTop from '@/components/ui/ScrollToTop'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { useAppTheme } from '@/contexts/ThemeContext'

interface ClientLayoutProps {
  children: ReactNode
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const { isLoading } = useAppTheme()

  // 테마 로딩 중일 때 스피너 표시
  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <Fade in={!isLoading} timeout={300}>
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <Box component="main" sx={{ flexGrow: 1 }}>
          {children}
        </Box>
        <Footer />
        <ScrollToTop />
      </Box>
    </Fade>
  )
}