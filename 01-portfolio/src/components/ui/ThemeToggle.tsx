// src/components/ui/ThemeToggle.tsx
// 테마 토글 컴포넌트 - 오류 수정된 버전

'use client'

import { IconButton, Tooltip } from '@mui/material'
import { Brightness4, Brightness7 } from '@mui/icons-material'
import { useAppTheme } from '@/contexts/ThemeContext'

export default function ThemeToggle() {
  // Context 사용 시 에러 핸들링 추가
  let mode: 'light' | 'dark' = 'light'
  let toggleTheme = () => {}
  
  try {
    const themeContext = useAppTheme()
    mode = themeContext.mode
    toggleTheme = themeContext.toggleTheme
  } catch {
    // Provider 외부에서 사용될 경우 기본값 사용
    console.warn('ThemeToggle used outside of AppThemeProvider')
  }

  return (
    <Tooltip title={`${mode === 'light' ? '다크' : '라이트'} 모드로 전환`}>
      <IconButton
        onClick={toggleTheme}
        sx={{
          ml: 1,
          color: 'text.primary',
          '&:hover': {
            bgcolor: 'action.hover',
          },
        }}
        aria-label="테마 전환"
      >
        {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
      </IconButton>
    </Tooltip>
  )
}