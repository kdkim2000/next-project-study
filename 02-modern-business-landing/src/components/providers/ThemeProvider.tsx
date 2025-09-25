// src/components/providers/ThemeProvider.tsx
// 🎨 클라이언트 전용 Theme Provider - Next.js 15 + MUI v7 호환성 해결

'use client';

import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ReactNode } from 'react';
import theme from '@/lib/theme';

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <AppRouterCacheProvider options={{ enableCssLayer: true }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline enableColorScheme />
        {children}
      </MuiThemeProvider>
    </AppRouterCacheProvider>
  );
}

/* 
📚 학습 노트: 클라이언트 컴포넌트 분리의 이유

1. 🔧 호환성 해결:
   - 'use client' 지시어로 클라이언트 전용 코드 명시
   - 서버 컴포넌트와 클라이언트 컴포넌트 경계 명확화
   - webpack 모듈 로딩 오류 방지

2. ⚡ 성능 최적화:
   - enableCssLayer 옵션으로 CSS 레이어링 활성화
   - 필요한 컴포넌트만 클라이언트에서 하이드레이션
   - 서버 사이드 렌더링 최적화

3. 🎯 향후 확장성:
   - 다크모드 토글 기능 추가 준비
   - 테마 커스터마이제이션 지원
   - 다국어 지원 Provider 추가 가능
*/