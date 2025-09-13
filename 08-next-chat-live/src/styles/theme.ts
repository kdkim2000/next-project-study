// src/styles/theme.ts
/**
 * Material-UI 커스텀 테마 설정
 * 애플리케이션 전체의 디자인 시스템을 정의합니다
 * 
 * 포함 기능:
 * - 색상 팔레트 (라이트/다크 모드)
 * - 타이포그래피 시스템
 * - 컴포넌트 스타일 오버라이드
 * - 반응형 브레이크포인트
 * - 커스텀 그림자 시스템
 * - 애니메이션 설정
 */
import { createTheme, ThemeOptions } from '@mui/material/styles';
import { koKR } from '@mui/material/locale';

// 커스텀 테마 타입 확장
declare module '@mui/material/styles' {
  interface Theme {
    customShadows: {
      card: string;
      dropdown: string;
      navigation: string;
      tooltip: string;
    };
    customColors: {
      online: string;
      offline: string;
      typing: string;
      encrypted: string;
      background: {
        chat: string;
        message: {
          own: string;
          other: string;
        };
      };
    };
  }
  
  interface ThemeOptions {
    customShadows?: {
      card?: string;
      dropdown?: string;
      navigation?: string;
      tooltip?: string;
    };
    customColors?: {
      online?: string;
      offline?: string;
      typing?: string;
      encrypted?: string;
      background?: {
        chat?: string;
        message?: {
          own?: string;
          other?: string;
        };
      };
    };
  }
}

// 기본 색상 팔레트
const baseColors = {
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
    200: '#a5d6a7',
    300: '#81c784',
    400: '#66bb6a',
    500: '#4caf50',
    600: '#43a047',
    700: '#388e3c',
    800: '#2e7d32',
    900: '#1b5e20',
  },
  warning: {
    50: '#fff8e1',
    100: '#ffecb3',
    200: '#ffe082',
    300: '#ffd54f',
    400: '#ffca28',
    500: '#ffc107',
    600: '#ffb300',
    700: '#ffa000',
    800: '#ff8f00',
    900: '#ff6f00',
  },
  error: {
    50: '#ffebee',
    100: '#ffcdd2',
    200: '#ef9a9a',
    300: '#e57373',
    400: '#ef5350',
    500: '#f44336',
    600: '#e53935',
    700: '#d32f2f',
    800: '#c62828',
    900: '#b71c1c',
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
};

// 라이트 테마 설정
const lightThemeOptions: ThemeOptions = {
  palette: {
    mode: 'light',
    primary: {
      main: baseColors.primary[500],
      light: baseColors.primary[300],
      dark: baseColors.primary[700],
      contrastText: '#ffffff',
    },
    secondary: {
      main: baseColors.secondary[500],
      light: baseColors.secondary[300],
      dark: baseColors.secondary[700],
      contrastText: '#ffffff',
    },
    success: {
      main: baseColors.success[500],
      light: baseColors.success[300],
      dark: baseColors.success[700],
      contrastText: '#ffffff',
    },
    warning: {
      main: baseColors.warning[500],
      light: baseColors.warning[300],
      dark: baseColors.warning[700],
      contrastText: '#000000',
    },
    error: {
      main: baseColors.error[500],
      light: baseColors.error[300],
      dark: baseColors.error[700],
      contrastText: '#ffffff',
    },
    info: {
      main: '#2196f3',
      light: '#64b5f6',
      dark: '#1976d2',
      contrastText: '#ffffff',
    },
    background: {
      default: '#fafafa',
      paper: '#ffffff',
    },
    text: {
      primary: 'rgba(0, 0, 0, 0.87)',
      secondary: 'rgba(0, 0, 0, 0.6)',
      disabled: 'rgba(0, 0, 0, 0.38)',
    },
    divider: 'rgba(0, 0, 0, 0.12)',
    action: {
      active: 'rgba(0, 0, 0, 0.54)',
      hover: 'rgba(0, 0, 0, 0.04)',
      selected: 'rgba(0, 0, 0, 0.08)',
      disabled: 'rgba(0, 0, 0, 0.26)',
      disabledBackground: 'rgba(0, 0, 0, 0.12)',
    },
  },

  // 타이포그래피 시스템
  typography: {
    fontFamily: [
      '"Noto Sans KR"',
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
    
    // 제목 계층
    h1: {
      fontSize: '2.75rem', // 44px
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontSize: '2.25rem', // 36px
      fontWeight: 700,
      lineHeight: 1.3,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontSize: '1.875rem', // 30px
      fontWeight: 600,
      lineHeight: 1.3,
      letterSpacing: '-0.01em',
    },
    h4: {
      fontSize: '1.5rem', // 24px
      fontWeight: 600,
      lineHeight: 1.4,
      letterSpacing: '0em',
    },
    h5: {
      fontSize: '1.25rem', // 20px
      fontWeight: 600,
      lineHeight: 1.4,
      letterSpacing: '0em',
    },
    h6: {
      fontSize: '1.125rem', // 18px
      fontWeight: 600,
      lineHeight: 1.4,
      letterSpacing: '0em',
    },

    // 본문 텍스트
    subtitle1: {
      fontSize: '1rem', // 16px
      fontWeight: 500,
      lineHeight: 1.5,
      letterSpacing: '0.00938em',
    },
    subtitle2: {
      fontSize: '0.875rem', // 14px
      fontWeight: 500,
      lineHeight: 1.57,
      letterSpacing: '0.00714em',
    },
    body1: {
      fontSize: '1rem', // 16px
      fontWeight: 400,
      lineHeight: 1.6,
      letterSpacing: '0.00938em',
    },
    body2: {
      fontSize: '0.875rem', // 14px
      fontWeight: 400,
      lineHeight: 1.57,
      letterSpacing: '0.00714em',
    },

    // 기능적 텍스트
    button: {
      fontSize: '0.875rem', // 14px
      fontWeight: 500,
      lineHeight: 1.75,
      letterSpacing: '0.02857em',
      textTransform: 'none', // 대문자 변환 제거
    },
    caption: {
      fontSize: '0.75rem', // 12px
      fontWeight: 400,
      lineHeight: 1.66,
      letterSpacing: '0.03333em',
    },
    overline: {
      fontSize: '0.625rem', // 10px
      fontWeight: 600,
      lineHeight: 2.66,
      letterSpacing: '0.08333em',
      textTransform: 'uppercase',
    },
  },

  // 브레이크포인트 설정 (반응형)
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },

  // 스페이싱 시스템 (8px 기본 단위)
  spacing: 8,

  // 모양 설정
  shape: {
    borderRadius: 8,
  },

  // 애니메이션 및 전환 효과
  transitions: {
    duration: {
      shortest: 150,
      shorter: 200,
      short: 250,
      standard: 300,
      complex: 375,
      enteringScreen: 225,
      leavingScreen: 195,
    },
    easing: {
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
    },
  },

  // 커스텀 그림자 시스템
  customShadows: {
    card: '0 2px 12px rgba(0,0,0,0.08)',
    dropdown: '0 4px 20px rgba(0,0,0,0.15)',
    navigation: '0 2px 8px rgba(0,0,0,0.12)',
    tooltip: '0 2px 8px rgba(0,0,0,0.24)',
  },

  // 채팅 앱 전용 커스텀 색상
  customColors: {
    online: '#4caf50',
    offline: '#9e9e9e',
    typing: '#2196f3',
    encrypted: '#ff9800',
    background: {
      chat: '#f5f5f5',
      message: {
        own: '#2196f3',
        other: '#ffffff',
      },
    },
  },

  // 컴포넌트별 스타일 오버라이드
  components: {
    // 전역 CSS 기본값
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          fontSize: '16px',
          scrollBehavior: 'smooth',
        },
        body: {
          fontSize: '1rem',
          lineHeight: 1.6,
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(0, 0, 0, 0.2) transparent',
          // Webkit 스크롤바 스타일링
          '&::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
            borderRadius: '4px',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
            },
          },
        },
        // 포커스 스타일 개선
        '*:focus-visible': {
          outline: '2px solid #2196f3',
          outlineOffset: '2px',
        },
        // 선택 텍스트 스타일
        '::selection': {
          backgroundColor: 'rgba(33, 150, 243, 0.2)',
          color: 'inherit',
        },
      },
    },

    // AppBar 컴포넌트
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
          backgroundImage: 'none',
        },
      },
    },

    // Paper 컴포넌트
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        elevation1: {
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        },
        elevation2: {
          boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
        },
        elevation3: {
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        },
        elevation8: {
          boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
        },
      },
    },

    // Button 컴포넌트
    MuiButton: {
      defaultProps: {
        disableElevation: false,
      },
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 20px',
          fontSize: '0.9rem',
          fontWeight: 500,
          textTransform: 'none',
          minHeight: 40,
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-1px)',
          },
        },
        contained: {
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          '&:hover': {
            boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
          },
          '&:active': {
            transform: 'translateY(0px)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          },
        },
        outlined: {
          borderWidth: 2,
          '&:hover': {
            borderWidth: 2,
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
          },
        },
        text: {
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
          },
        },
        startIcon: {
          marginRight: 8,
          marginLeft: 0,
        },
        endIcon: {
          marginLeft: 8,
          marginRight: 0,
        },
      },
    },

    // TextField 컴포넌트
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        fullWidth: true,
      },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(33, 150, 243, 0.5)',
              borderWidth: 2,
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderWidth: 2,
            },
          },
          '& .MuiInputLabel-outlined': {
            transform: 'translate(14px, 16px) scale(1)',
            '&.MuiInputLabel-shrink': {
              transform: 'translate(14px, -9px) scale(0.75)',
            },
          },
        },
      },
    },

    // Card 컴포넌트
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },

    // Chip 컴포넌트
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontSize: '0.8rem',
          fontWeight: 500,
        },
        colorPrimary: {
          backgroundColor: baseColors.primary[500],
          color: '#ffffff',
          '&:hover': {
            backgroundColor: baseColors.primary[600],
          },
        },
      },
    },

    // List 관련 컴포넌트
    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          marginBottom: 4,
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            backgroundColor: 'rgba(33, 150, 243, 0.04)',
            transform: 'translateX(4px)',
          },
        },
      },
    },

    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            backgroundColor: 'rgba(33, 150, 243, 0.04)',
            transform: 'translateX(4px)',
          },
        },
      },
    },

    // Avatar 컴포넌트
    MuiAvatar: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          fontSize: '1rem',
          background: 'linear-gradient(45deg, #2196f3 30%, #21cbf3 90%)',
        },
        colorDefault: {
          backgroundColor: baseColors.grey[400],
          color: '#ffffff',
        },
      },
    },

    // Tooltip 컴포넌트
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          fontSize: '0.75rem',
          fontWeight: 500,
          borderRadius: 6,
          padding: '8px 12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.24)',
        },
        arrow: {
          color: 'rgba(0, 0, 0, 0.9)',
        },
      },
    },

    // Dialog 컴포넌트
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
          boxShadow: '0 16px 64px rgba(0,0,0,0.24)',
        },
      },
    },

    // Snackbar 컴포넌트
    MuiSnackbar: {
      styleOverrides: {
        root: {
          '& .MuiSnackbarContent-root': {
            borderRadius: 8,
            boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
          },
        },
      },
    },

    // Alert 컴포넌트
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontSize: '0.9rem',
          fontWeight: 500,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        },
        filledSuccess: {
          backgroundColor: baseColors.success[500],
        },
        filledError: {
          backgroundColor: baseColors.error[500],
        },
        filledWarning: {
          backgroundColor: baseColors.warning[500],
          color: '#000000',
        },
        filledInfo: {
          backgroundColor: baseColors.primary[500],
        },
      },
    },

    // CircularProgress 컴포넌트
    MuiCircularProgress: {
      styleOverrides: {
        root: {
          animationDuration: '1.5s',
        },
        colorPrimary: {
          color: baseColors.primary[500],
        },
      },
    },

    // LinearProgress 컴포넌트
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          overflow: 'hidden',
        },
        bar: {
          borderRadius: 4,
        },
      },
    },

    // IconButton 컴포넌트
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            backgroundColor: 'rgba(33, 150, 243, 0.04)',
            transform: 'scale(1.1)',
          },
        },
      },
    },
  },
};

// 테마 생성 및 내보내기
const theme = createTheme(lightThemeOptions, koKR);

export default theme;

// 다크 테마 옵션 (향후 확장용)
export const darkThemeOptions: ThemeOptions = {
  ...lightThemeOptions,
  palette: {
    mode: 'dark',
    primary: {
      main: baseColors.primary[400],
      light: baseColors.primary[300],
      dark: baseColors.primary[600],
      contrastText: '#000000',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    text: {
      primary: 'rgba(255, 255, 255, 0.87)',
      secondary: 'rgba(255, 255, 255, 0.6)',
      disabled: 'rgba(255, 255, 255, 0.38)',
    },
    divider: 'rgba(255, 255, 255, 0.12)',
  },
  customColors: {
    online: '#4caf50',
    offline: '#9e9e9e',
    typing: '#64b5f6',
    encrypted: '#ffb74d',
    background: {
      chat: '#1e1e1e',
      message: {
        own: '#1976d2',
        other: '#2d2d2d',
      },
    },
  },
};

// 다크 테마 생성
export const darkTheme = createTheme(darkThemeOptions, koKR);

// 테마 유틸리티 함수들
export const getDesignTokens = (mode: 'light' | 'dark') => ({
  palette: {
    mode,
    ...(mode === 'light' ? lightThemeOptions.palette : darkThemeOptions.palette),
  },
});

// 반응형 헬퍼 함수
export const responsiveSpacing = {
  xs: (value: number) => `${value * 0.5}rem`,
  sm: (value: number) => `${value * 0.75}rem`,
  md: (value: number) => `${value}rem`,
  lg: (value: number) => `${value * 1.25}rem`,
  xl: (value: number) => `${value * 1.5}rem`,
};

// 애니메이션 헬퍼
export const animations = {
  fadeIn: {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
  slideUp: {
    from: { transform: 'translateY(20px)', opacity: 0 },
    to: { transform: 'translateY(0)', opacity: 1 },
  },
  scaleIn: {
    from: { transform: 'scale(0.8)', opacity: 0 },
    to: { transform: 'scale(1)', opacity: 1 },
  },
};