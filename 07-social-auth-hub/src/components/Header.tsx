// src/components/Header.tsx - 네비게이션 헤더 컴포넌트
"use client";

import { useSession, signOut } from "next-auth/react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Avatar,
  Box,
  Menu,
  MenuItem,
  IconButton,
  Chip,
  CircularProgress
} from '@mui/material';
import { useState } from 'react';
import Link from 'next/link';
import { 
  Login, 
  Person, 
  AdminPanelSettings,
  ExitToApp,
  Home
} from '@mui/icons-material';

/**
 * 헤더 네비게이션 컴포넌트
 * - 로그인 상태에 따른 동적 메뉴
 * - 사용자 프로필 드롭다운
 * - 관리자 권한 체크
 */
export function Header() {
  const { data: session, status } = useSession();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // 사용자 메뉴 열기/닫기
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // 로그아웃 처리
  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
    handleMenuClose();
  };

  return (
    <AppBar position="static">
      <Toolbar>
        {/* 로고/타이틀 */}
        <Typography 
          variant="h6" 
          component={Link} 
          href="/"
          sx={{ 
            flexGrow: 1, 
            textDecoration: 'none', 
            color: 'inherit',
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          🔐 Social Auth Hub
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* 홈 버튼 */}
          <Button
            component={Link}
            href="/"
            color="inherit"
            startIcon={<Home />}
          >
            홈
          </Button>

          {/* 로딩 상태 */}
          {status === "loading" && (
            <CircularProgress size={20} color="inherit" />
          )}

          {/* 로그인된 사용자 메뉴 */}
          {session ? (
            <>
              {/* 관리자 전용 메뉴 */}
              {session.user?.role === 'ADMIN' && (
                <Button
                  component={Link}
                  href="/admin"
                  color="inherit"
                  startIcon={<AdminPanelSettings />}
                >
                  관리자
                </Button>
              )}

              {/* 사용자 아바타 */}
              <IconButton onClick={handleMenuOpen} color="inherit">
                <Avatar
                  src={session.user?.image || undefined}
                  sx={{ width: 32, height: 32 }}
                >
                  <Person />
                </Avatar>
              </IconButton>

              {/* 사용자 드롭다운 메뉴 */}
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              >
                {/* 사용자 정보 표시 */}
                <Box sx={{ px: 2, py: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    {session.user?.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {session.user?.email}
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    <Chip
                      icon={session.user?.role === 'ADMIN' ? <AdminPanelSettings /> : <Person />}
                      label={session.user?.role === 'ADMIN' ? '관리자' : '사용자'}
                      color={session.user?.role === 'ADMIN' ? 'secondary' : 'primary'}
                      size="small"
                    />
                  </Box>
                </Box>
                
                {/* 프로필 메뉴 */}
                <MenuItem 
                  component={Link} 
                  href="/profile" 
                  onClick={handleMenuClose}
                >
                  <Person sx={{ mr: 1 }} />
                  프로필
                </MenuItem>
                
                {/* 로그아웃 메뉴 */}
                <MenuItem onClick={handleSignOut}>
                  <ExitToApp sx={{ mr: 1 }} />
                  로그아웃
                </MenuItem>
              </Menu>
            </>
          ) : (
            // 로그인 버튼 (비로그인 상태)
            <Button
              component={Link}
              href="/auth/signin"
              color="inherit"
              variant="outlined"
              startIcon={<Login />}
            >
              로그인
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}