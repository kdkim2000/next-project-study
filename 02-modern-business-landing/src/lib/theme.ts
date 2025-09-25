// src/lib/theme.ts
// 🎨 MUI 테마 설정 - 디자인 시스템의 기초

'use client';

import { createTheme } from '@mui/material/styles';

// 🌈 커스텀 테마 생성
const theme = createTheme({
  // 색상 팔레트 정의
  palette: {
    primary: {
      main: '#1976d2', // 메인 블루
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#dc004e', // 포인트 컬러
      light: '#ff5983',
      dark: '#9a0036',
    },
    background: {
      default: '#fafafa',
      paper: '#ffffff',
    },
  },
  
  // 타이포그래피 설정
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
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
      fontSize: '1rem',
      lineHeight: 1.6,
    },
  },
  
  // 간격 설정 (8px 기준)
  spacing: 8,
  
  // 컴포넌트 기본 속성 설정
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // 버튼 텍스트 대문자 변환 비활성화
          borderRadius: 8,
          padding: '12px 24px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        },
      },
    },
  },
});

export default theme;

/* 
📚 학습 노트:
1. createTheme로 일관된 디자인 시스템을 만들 수 있습니다
2. palette로 색상을 중앙 관리합니다
3. typography로 텍스트 스타일을 정의합니다
4. components로 MUI 컴포넌트의 기본 스타일을 커스터마이징합니다
5. 'use client' 지시어는 클라이언트에서만 실행되도록 합니다
*/