// src/components/ThemeProvider.tsx
// Material-UI 테마를 설정하는 컴포넌트

'use client';

import React from 'react';
import { ThemeProvider as MUIThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { blue, grey } from '@mui/material/colors';

// 커스텀 테마 생성
const theme = createTheme({
  palette: {
    primary: {
      main: blue[600],
      light: blue[300],
      dark: blue[800],
    },
    secondary: {
      main: grey[600],
      light: grey[300],
      dark: grey[800],
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
      marginBottom: '1rem',
    },
    h6: {
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    // 카드 컴포넌트 스타일 커스터마이징
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          '&:hover': {
            boxShadow: '0 8px 12px rgba(0, 0, 0, 0.15)',
            transform: 'translateY(-2px)',
            transition: 'all 0.3s ease-in-out',
          },
        },
      },
    },
    // 버튼 컴포넌트 스타일 커스터마이징
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          padding: '8px 16px',
        },
      },
    },
  },
});

interface ThemeProviderProps {
  children: React.ReactNode;
}

function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <MUIThemeProvider theme={theme}>
      {/* CssBaseline: Material-UI의 기본 CSS 리셋 */}
      <CssBaseline />
      {children}
    </MUIThemeProvider>
  );
}

export default ThemeProvider;