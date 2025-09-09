// src/components/Header.tsx - 사이트 상단 헤더 컴포넌트

'use client';

import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Box,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  Article as ArticleIcon,
  Category as CategoryIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

/**
 * 네비게이션 메뉴 아이템 타입
 */
interface NavItem {
  label: string;      // 메뉴 텍스트
  href: string;       // 링크 URL
  icon: React.ReactNode; // 아이콘
}

/**
 * 헤더 컴포넌트
 * 사이트 상단에 로고, 네비게이션 메뉴, 모바일 햄버거 메뉴를 제공
 */
const Header: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md')); // 모바일 화면 감지
  const router = useRouter();
  const pathname = usePathname(); // 현재 경로 가져오기

  // 모바일 메뉴 상태 관리
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState<null | HTMLElement>(null);
  const isMobileMenuOpen = Boolean(mobileMenuAnchor);

  // 네비게이션 메뉴 아이템들
  const navItems: NavItem[] = [
    {
      label: '홈',
      href: '/',
      icon: <HomeIcon />,
    },
    {
      label: '포스트',
      href: '/posts',
      icon: <ArticleIcon />,
    },
    {
      label: '카테고리',
      href: '/categories',
      icon: <CategoryIcon />,
    },
    {
      label: '검색',
      href: '/search',
      icon: <SearchIcon />,
    },
  ];

  /**
   * 모바일 메뉴 열기/닫기 핸들러
   */
  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchor(null);
  };

  /**
   * 메뉴 클릭 시 페이지 이동 및 모바일 메뉴 닫기
   */
  const handleNavigation = (href: string) => {
    router.push(href);
    handleMobileMenuClose();
  };

  /**
   * 현재 경로가 활성 상태인지 확인하는 함수
   */
  const isActiveRoute = (href: string): boolean => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <AppBar 
      position="sticky" 
      elevation={2}
      sx={{
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Toolbar sx={{ maxWidth: 1200, width: '100%', margin: '0 auto', px: 2 }}>
        {/* 로고 영역 */}
        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
          <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <Typography
              variant="h5"
              component="h1"
              sx={{
                fontWeight: 700,
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                cursor: 'pointer',
                '&:hover': {
                  opacity: 0.8,
                },
              }}
            >
              Developer&apos;s Blog
            </Typography>
          </Link>
        </Box>

        {/* 데스크톱 네비게이션 메뉴 */}
        {!isMobile && (
          <Box sx={{ display: 'flex', gap: 1 }}>
            {navItems.map((item) => (
              <Button
                key={item.href}
                startIcon={item.icon}
                onClick={() => handleNavigation(item.href)}
                sx={{
                  color: isActiveRoute(item.href) 
                    ? theme.palette.primary.main 
                    : theme.palette.text.primary,
                  fontWeight: isActiveRoute(item.href) ? 600 : 400,
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover,
                  },
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>
        )}

        {/* 모바일 햄버거 메뉴 버튼 */}
        {isMobile && (
          <IconButton
            edge="end"
            color="inherit"
            aria-label="메뉴 열기"
            onClick={handleMobileMenuOpen}
          >
            <MenuIcon />
          </IconButton>
        )}

        {/* 모바일 드롭다운 메뉴 */}
        <Menu
          anchorEl={mobileMenuAnchor}
          open={isMobileMenuOpen}
          onClose={handleMobileMenuClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          sx={{
            '& .MuiPaper-root': {
              minWidth: 200,
              mt: 1,
            },
          }}
        >
          {navItems.map((item) => (
            <MenuItem
              key={item.href}
              onClick={() => handleNavigation(item.href)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                color: isActiveRoute(item.href) 
                  ? theme.palette.primary.main 
                  : theme.palette.text.primary,
                fontWeight: isActiveRoute(item.href) ? 600 : 400,
              }}
            >
              {item.icon}
              {item.label}
            </MenuItem>
          ))}
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;