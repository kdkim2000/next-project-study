// src/components/ThemeRegistry.tsx - Material-UI 테마 프로바이더
"use client";

import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from '@/lib/theme';

interface ThemeRegistryProps {
  children: React.ReactNode;
}

/**
 * Material-UI 테마 프로바이더 컴포넌트
 * - ThemeProvider: Material-UI 테마 적용
 * - CssBaseline: 브라우저 기본 스타일 정규화
 */
export function ThemeRegistry({ children }: ThemeRegistryProps) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* CSS 리셋 및 정규화 */}
      {children}
    </ThemeProvider>
  );
}