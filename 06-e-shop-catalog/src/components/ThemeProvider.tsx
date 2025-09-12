// src/components/ThemeProvider.tsx - Material-UI 테마 프로바이더 컴포넌트

'use client';

import React from 'react';
import { ThemeProvider as MUIThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from '@/theme/theme';

interface ThemeProviderProps {
  children: React.ReactNode;
}

/**
 * Material-UI 테마를 앱 전체에 적용하는 프로바이더 컴포넌트
 * CssBaseline을 포함하여 일관된 CSS 기본값을 제공
 */
export default function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <MUIThemeProvider theme={theme}>
      {/* CSS 기본값 정규화 */}
      <CssBaseline />
      {children}
    </MUIThemeProvider>
  );
}