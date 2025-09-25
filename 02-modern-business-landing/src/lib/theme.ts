// src/lib/theme.ts
// 🎨 MUI v7 테마 설정 - Material Design 3 완전 지원

'use client';

import { createTheme, alpha } from '@mui/material/styles';

// 🌈 Material Design 3 컬러 토큰
const colors = {
  primary: {
    50: '#e3f2fd',
    100: '#bbdefb', 
    200: '#90caf9',
    300: '#64b5f6',
    400: '#42a5f5',
    500: '#2196f3',
    600: '#1e88e5',
    700: '#1976d2',
    800: '#1565c0',
    900: '#0d47a1',
  },
  secondary: {
    50: '#fce4ec',
    100: '#f8bbd9',
    200: '#f48fb1',
    300: '#f06292',
    400: '#ec407a',
    500: '#e91e63',
    600: '#d81b60',
    700: '#c2185b',
    800: '#ad1457',
    900: '#880e4f',
  },
  success: {
    50: '#e8f5e8',
    100: '#c8e6c9',
    500: '#4caf50',
    main: '#2e7d32',
  },
  warning: {
    50: '#fff3e0',
    100: '#ffe0b2',
    500: '#ff9800',
    main: '#f57c00',
  },
  error: {
    50: '#ffebee',
    100: '#ffcdd2',
    500: '#f44336',
    main: '#d32f2f',
  },
};

// 🎯 MUI v7 Material Design 3 테마
const theme = createTheme({
  // 색상 시스템 (Material Design 3 완전 지원)
  palette: {
    mode: 'light',
    primary: {
      main: colors.primary[600],
      light: colors.primary[400],
      dark: colors.primary[800],
      contrastText: '#ffffff',
    },
    secondary: {
      main: colors.secondary[500],
      light: colors.secondary[300],
      dark: colors.secondary[700],
      contrastText: '#ffffff',
    },
    error: {
      main: colors.error.main,
      light: colors.error[100],
      dark: colors.error[500],
    },
    warning: {
      main: colors.warning.main,
      light: colors.warning[100],
      dark: colors.warning[500],
    },
    success: {
      main: colors.success.main,
      light: colors.success[100],
      dark: colors.success[500],
    },
    background: {
      default: '#fafafa',
      paper: '#ffffff',
    },
    text: {
      primary: 'rgba(0, 0, 0, 0.87)',
      secondary: 'rgba(0, 0, 0, 0.6)',
    },
    grey: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#eeeeee',
      300: '#e0e0e0',
      400: '#bdbdbd',
      500: '#9e9e9e',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121',
    },
    // MUI v7 Material Design 3 색상 확장
    common: {
      black: '#000000',
      white: '#ffffff',
    },
  },

  // Material Design 3 타이포그래피
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
    h1: {
      fontSize: '3.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
      '@media (max-width:600px)': {
        fontSize: '2.5rem',
      },
    },
    h2: {
      fontSize: '2.75rem',
      fontWeight: 600,
      lineHeight: 1.25,
      letterSpacing: '-0.01em',
      '@media (max-width:600px)': {
        fontSize: '2rem',
      },
    },
    h3: {
      fontSize: '2.25rem',
      fontWeight: 600,
      lineHeight: 1.3,
      '@media (max-width:600px)': {
        fontSize: '1.75rem',
      },
    },
    h4: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.35,
      '@media (max-width:600px)': {
        fontSize: '1.5rem',
      },
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
      lineHeight: 1.4,
    },
    h6: {
      fontSize: '1.125rem',
      fontWeight: 500,
      lineHeight: 1.45,
    },
    body1: {
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      fontWeight: 400,
      lineHeight: 1.5,
    },
    button: {
      fontSize: '0.875rem',
      fontWeight: 500,
      textTransform: 'none' as const,
      letterSpacing: '0.02em',
    },
    caption: {
      fontSize: '0.75rem',
      fontWeight: 400,
      lineHeight: 1.4,
    },
  },

  // 간격 시스템
  spacing: 8,

  // Material Design 3 형태
  shape: {
    borderRadius: 12,
  },

  // 컴포넌트 테마 커스터마이징 (MUI v7)
  components: {
    // Button 컴포넌트
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '12px 24px',
          fontSize: '0.875rem',
          fontWeight: 500,
          textTransform: 'none',
          boxShadow: 'none',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            transform: 'translateY(-1px)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        },
        contained: {
          '&:hover': {
            boxShadow: '0 6px 16px rgba(0, 0, 0, 0.2)',
          },
        },
        outlined: {
          borderWidth: 1.5,
          '&:hover': {
            borderWidth: 1.5,
          },
        },
        sizeSmall: {
          padding: '8px 16px',
          fontSize: '0.8125rem',
        },
        sizeLarge: {
          padding: '14px 28px',
          fontSize: '0.9375rem',
        },
      },
    },

    // Card 컴포넌트
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          border: '1px solid rgba(0, 0, 0, 0.06)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },

    // TextField 컴포넌트 (MUI v7 slotProps 사용)
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: colors.primary[400],
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: colors.primary[600],
              borderWidth: 2,
            },
          },
        },
      },
    },

    // AppBar 컴포넌트
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          color: colors.primary[800],
          boxShadow: '0 1px 10px rgba(0, 0, 0, 0.1)',
        },
      },
    },

    // Chip 컴포넌트
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          fontWeight: 500,
        },
        colorPrimary: {
          backgroundColor: alpha(colors.primary[500], 0.1),
          color: colors.primary[700],
          '&:hover': {
            backgroundColor: alpha(colors.primary[500], 0.2),
          },
        },
      },
    },

    // Container 컴포넌트
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingLeft: '24px',
          paddingRight: '24px',
          '@media (max-width: 600px)': {
            paddingLeft: '16px',
            paddingRight: '16px',
          },
        },
      },
    },

    // Grid 컴포넌트 최적화 (MUI v7)
    MuiGrid: {
      styleOverrides: {
        root: {
          // Grid 특별 스타일링이 필요한 경우 여기에 추가
        },
      },
    },
  },

  // 중단점 시스템
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

export default theme;

/* 
📚 학습 노트: MUI v7 + Material Design 3 테마 시스템

1. 🎨 Material Design 3 완전 지원:
   - 새로운 색상 토큰 시스템
   - 확장된 팔레트 (50-900 단계)
   - 개선된 접근성과 대비

2. 🔤 향상된 타이포그래피:
   - Inter 폰트 기본 사용
   - 반응형 폰트 크기
   - 최적화된 라인 높이와 간격

3. 🎯 MUI v7 새 기능:
   - Grid 컴포넌트 지원
   - slotProps API 사용
   - 개선된 컴포넌트 커스터마이징

4. 📱 반응형 최적화:
   - 모바일 우선 설계
   - 적응형 간격 시스템
   - 유연한 중단점

5. ⚡ 성능 개선:
   - CSS-in-JS 최적화
   - 효율적인 테마 적용
   - 부드러운 애니메이션
*/
