// src/contexts/ThemeContext.tsx
// 개선된 전역 테마 관리 시스템

'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { ThemeProvider as MUIThemeProvider } from '@mui/material/styles'
import { lightTheme, darkTheme } from '@/theme/theme'

type ThemeMode = 'light' | 'dark'

interface ThemeContextType {
  mode: ThemeMode
  toggleTheme: () => void
  isLoading: boolean
}

// Context 생성 - 기본값 제공
const ThemeContext = createContext<ThemeContextType>({
  mode: 'light',
  toggleTheme: () => {},
  isLoading: true,
})

// Hook: 테마 사용 - 더 안전한 버전
export const useAppTheme = () => {
  const context = useContext(ThemeContext)
  return context
}

// Provider 컴포넌트 - 개선된 버전
interface AppThemeProviderProps {
  children: ReactNode
}

export function AppThemeProvider({ children }: AppThemeProviderProps) {
  const [mode, setMode] = useState<ThemeMode>('light')
  const [isLoading, setIsLoading] = useState(true)

  // 클라이언트에서만 실행 (SSR 안전)
  useEffect(() => {
    try {
      // 저장된 테마 또는 시스템 테마 적용
      const savedTheme = localStorage.getItem('portfolio-theme') as ThemeMode | null
      
      // 시스템 테마 감지
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      
      // 테마 결정 우선순위: 저장된 테마 > 시스템 테마 > 기본값
      const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light')
      
      setMode(initialTheme)
      setIsLoading(false)

      // 시스템 테마 변경 감지 (저장된 테마가 없을 때만)
      if (!savedTheme) {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
        const handleChange = (e: MediaQueryListEvent) => {
          setMode(e.matches ? 'dark' : 'light')
        }
        
        mediaQuery.addEventListener('change', handleChange)
        return () => mediaQuery.removeEventListener('change', handleChange)
      }
    } catch (error) {
      console.warn('테마 초기화 중 오류:', error)
      setIsLoading(false)
    }
  }, [])

  // 테마 토글 함수 - 에러 핸들링 추가
  const toggleTheme = () => {
    try {
      const newMode = mode === 'light' ? 'dark' : 'light'
      setMode(newMode)
      localStorage.setItem('portfolio-theme', newMode)
      
      // 접근성을 위한 알림 (선택사항)
      const message = `${newMode === 'dark' ? '다크' : '라이트'} 테마로 변경되었습니다`
      // 스크린 리더를 위한 라이브 리전 업데이트
      const announcement = document.createElement('div')
      announcement.setAttribute('aria-live', 'polite')
      announcement.setAttribute('aria-atomic', 'true')
      announcement.className = 'sr-only'
      announcement.textContent = message
      document.body.appendChild(announcement)
      
      setTimeout(() => {
        document.body.removeChild(announcement)
      }, 1000)
    } catch (error) {
      console.error('테마 변경 중 오류:', error)
    }
  }

  // 현재 테마 선택
  const currentTheme = mode === 'dark' ? darkTheme : lightTheme

  const value = {
    mode,
    toggleTheme,
    isLoading,
  }

  return (
    <ThemeContext.Provider value={value}>
      <MUIThemeProvider theme={currentTheme}>
        {children}
      </MUIThemeProvider>
    </ThemeContext.Provider>
  )
}

// HOC: 테마가 필요한 컴포넌트를 위한 래퍼
export function withTheme<T extends object>(Component: React.ComponentType<T>) {
  return function ThemedComponent(props: T) {
    return (
      <AppThemeProvider>
        <Component {...props} />
      </AppThemeProvider>
    )
  }
}