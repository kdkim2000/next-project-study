// src/lib/theme.ts - Material-UI 테마 설정
'use client';

import { createTheme } from '@mui/material/styles';

// 커스텀 테마 생성
export const theme = createTheme({
  // 색상 팔레트
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',    // 메인 파란색
      light: '#42a5f5',   // 밝은 파란색
      dark: '#1565c0',    // 어두운 파란색
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#dc004e',    // 보조 빨간색
      light: '#f06292',
      dark: '#c51162',
      contrastText: '#ffffff',
    },
    background: {
      default: '#ffffff',
      paper: '#f5f5f5',
    },
    text: {
      primary: '#000000DE', // 주요 텍스트
      secondary: '#00000099', // 보조 텍스트
    },
  },
  
  // 폰트 설정
  typography: {
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    h6: { fontWeight: 500 },
  },
  
  // 모서리 둥글기
  shape: {
    borderRadius: 8,
  },
  
  // 컴포넌트별 스타일 오버라이드
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // 버튼 텍스트 대소문자 변환 없음
          fontWeight: 500,
          borderRadius: '8px',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none', // 그라데이션 배경 제거
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px rgba(0,0,0,0.12)', // 부드러운 그림자
        },
      },
    },
  },
});