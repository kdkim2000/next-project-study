// src/components/Layout.tsx - 전체 페이지 레이아웃을 관리하는 컴포넌트

'use client';

import React from 'react';
import { Box, CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { lightTheme } from '@/theme/theme';
import Header from './Header';
import Footer from './Footer';

/**
 * 레이아웃 컴포넌트의 Props 타입
 */
interface LayoutProps {
  children: React.ReactNode; // 페이지 내용
}

/**
 * 🎯 학습 목표: 서버 컴포넌트 vs 클라이언트 컴포넌트
 * 메인 레이아웃 컴포넌트 (서버 컴포넌트)
 * - 정적인 UI는 서버에서 렌더링
 * - 인터랙션이 필요한 부분만 클라이언트 컴포넌트로 분리
 */
const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <ThemeProvider theme={lightTheme}>
      {/* CssBaseline: Material-UI의 CSS 리셋 및 기본 스타일 적용 */}
      <CssBaseline />
      
      {/* 전체 페이지 컨테이너 */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh', // 전체 뷰포트 높이 사용
          bgcolor: 'background.default',
        }}
      >
        {/* 상단 헤더 */}
        <Header />
        
        {/* 메인 콘텐츠 영역 */}
        <Box
          component="main"
          sx={{
            flex: 1, // 남은 공간을 모두 차지
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {children}
        </Box>
        
        {/* 하단 푸터 */}
        <Footer />
      </Box>
    </ThemeProvider>
  );
};

export default Layout;