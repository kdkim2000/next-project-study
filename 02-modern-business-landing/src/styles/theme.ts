// src/styles/theme.ts
'use client'
import { createTheme } from '@mui/material/styles'

/**
 * Material-UI 커스텀 테마 설정
 * 브랜드 컬러와 타이포그래피 정의
 */
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // 메인 블루 컬러
      light: '#42a5f5',
      dark: '#1565c0',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#dc004e', // 강조 컬러
      light: '#ff5983',
      dark: '#9a0036',
      contrastText: '#ffffff',
    },
    background: {
      default: '#fafafa',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: [
      'Inter',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      'sans-serif',
    ].join(','),
    h1: {
      fontSize: '3.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '2.5rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    body1: {
      fontSize: '1.1rem',
      lineHeight: 1.6,
    },
  },
  components: {
    // 버튼 컴포넌트 커스터마이징
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none', // 대문자 변환 비활성화
          fontSize: '1rem',
          padding: '12px 24px',
        },
      },
    },
    // 카드 컴포넌트 커스터마이징
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          borderRadius: 16,
        },
      },
    },
  },
})

export default theme