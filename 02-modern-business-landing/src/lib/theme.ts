// src/lib/theme.ts
// 🎨 MUI v7 테마 설정 - 최신 기능과 개선된 디자인 시스템

'use client';

import { createTheme, alpha } from '@mui/material/styles';

// 🌈 커스텀 컬러 팔레트
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
    500: '#4caf50',
    main: '#2e7d32',
  },
  warning: {
    50: '#fff3e0',
    500: '#ff9800',
    main: '#f57c00',
  },
  error: {
    50: '#ffebee',
    500: '#f44336',
    main: '#d32f2f',
  },
};

// 🎯 MUI v7 최신 테마 설정
const theme = createTheme({
  // 색상 시스템 (Material Design 3 적용)
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
      light: colors.error[300],
      dark: colors.error[700],
    },
    warning: {
      main: colors.warning.main,
      light: colors.warning[300],
      dark: colors.warning[700],
    },
    success: {
      main: colors.success.main,
      light: colors.success[300],
      dark: colors.success[700],
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
  },

  // 타이포그래피 시스템 (Material Design 3)
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
      color: 'rgba(0, 0, 0, 0.87)',
    },
    body2: {
      fontSize: '0.875rem',
      fontWeight: 400,
      lineHeight: 1.5,
      color: 'rgba(0, 0, 0, 0.7)',
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
      color: 'rgba(0, 0, 0, 0.6)',
    },
  },

  // 간격 시스템
  spacing: 8,

  // 모양과 그림자
  shape: {
    borderRadius: 12,
  },

  shadows: [
    'none',
    '0px 1px 3px rgba(0, 0, 0, 0.12), 0px 1px 2px rgba(0, 0, 0, 0.24)',
    '0px 3px 6px rgba(0, 0, 0, 0.15), 0px 2px 4px rgba(0, 0, 0, 0.12)',
    '0px 10px 20px rgba(0, 0, 0, 0.15), 0px 3px 6px rgba(0, 0, 0, 0.10)',
    '0px 15px 25px rgba(0, 0, 0, 0.15), 0px 5px 10px rgba(0, 0, 0, 0.05)',
    '0px 20px 40px rgba(0, 0, 0, 0.1)',
    // ... 추가 그림자 레벨들
  ] as any,

  // 컴포넌트 커스터마이징
  components: {
    // MUI Button 커스터마이징
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

    // MUI Card 커스터마이징
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

    // MUI TextField 커스터마이징
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

    // MUI AppBar 커스터마이징
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

    // MUI Chip 커스터마이징
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

    // MUI Container 커스터마이징 
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
  },

  // 중단점 (Breakpoints)
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
📚 학습 노트: MUI v7 새로운 기능들

1. 🎨 Material Design 3 색상 시스템:
   - 더 풍부한 색상 팔레트 (50-900 단계)
   - alpha() 함수로 투명도 적용
   - 개선된 접근성과 대비

2. 🔤 향상된 타이포그래피:
   - 반응형 폰트 크기 적용
   - 더 나은 줄 간격과 글자 간격
   - 모바일 최적화된 크기 조정

3. 🎯 컴포넌트 스타일 개선:
   - 부드러운 애니메이션과 전환 효과
   - 현대적인 그림자와 호버 효과
   - 향상된 사용자 경험

4. 📱 반응형 디자인:
   - 모바일 우선 접근 방식
   - 적응형 컨테이너 패딩
   - 유연한 중단점 시스템

5. ⚡ 성능 최적화:
   - cubic-bezier 전환 함수
   - GPU 가속 애니메이션
   - 효율적인 리렌더링
*/