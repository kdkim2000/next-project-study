// src/components/ThemeProvider.tsx - Material-UI 테마 설정 및 제공

'use client'; // 클라이언트 컴포넌트로 설정 (브라우저에서 실행)

import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

// 커스텀 테마 생성
const theme = createTheme({
  // 색상 팔레트 정의
  palette: {
    mode: 'light', // 라이트 모드 설정
    primary: {
      main: '#1976d2', // 메인 파란색
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#dc004e', // 보조 빨간색
      light: '#ff5983',
      dark: '#9a0036',
    },
    background: {
      default: '#f5f5f5', // 기본 배경색
      paper: '#ffffff',    // 카드, 다이얼로그 배경색
    },
    // 커스텀 색상 추가 (할 일 상태별)
    success: {
      main: '#4caf50', // 완료 상태 (초록)
    },
    warning: {
      main: '#ff9800', // 진행중/중간 우선순위 (주황)
    },
    error: {
      main: '#f44336', // 높은 우선순위 (빨강)
    },
    info: {
      main: '#2196f3', // 할 일 상태 (파랑)
    },
  },
  
  // 타이포그래피 설정
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    
    // 제목 스타일
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
      marginBottom: '1rem',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
      marginBottom: '0.875rem',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 500,
      marginBottom: '0.75rem',
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
      marginBottom: '0.625rem',
    },
    
    // 본문 텍스트 스타일
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.43,
    },
  },
  
  // 컴포넌트별 스타일 커스터마이징
  components: {
    // Card 컴포넌트 스타일
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)', // 부드러운 그림자
          borderRadius: '12px', // 둥근 모서리
          transition: 'box-shadow 0.3s ease-in-out', // 부드러운 전환 효과
          '&:hover': {
            boxShadow: '0 4px 16px rgba(0,0,0,0.15)', // 호버 시 그림자 강화
          },
        },
      },
    },
    
    // Button 컴포넌트 스타일
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px', // 둥근 버튼
          textTransform: 'none', // 대문자 변환 비활성화
          fontWeight: 500,
          padding: '8px 16px',
        },
        contained: {
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          '&:hover': {
            boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
          },
        },
      },
    },
    
    // Chip 컴포넌트 스타일 (우선순위, 상태 표시용)
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          fontWeight: 500,
          fontSize: '0.75rem',
        },
      },
    },
    
    // TextField 컴포넌트 스타일
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
          },
        },
      },
    },
    
    // Paper 컴포넌트 스타일 (다이얼로그, 메뉴 등)
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
        },
        elevation1: {
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        },
        elevation4: {
          boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
        },
      },
    },
  },
  
  // 반응형 브레이크포인트 설정
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
});

// ThemeProvider 컴포넌트 - 앱 전체에 테마를 적용
interface CustomThemeProviderProps {
  children: React.ReactNode;
}

export default function CustomThemeProvider({ children }: CustomThemeProviderProps) {
  return (
    <ThemeProvider theme={theme}>
      {/* CssBaseline: Material-UI의 기본 CSS 초기화 */}
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}