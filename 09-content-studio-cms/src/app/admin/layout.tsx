// src/app/admin/layout.tsx
// 관리자 영역 레이아웃 - 사이드바 네비게이션과 헤더가 포함된 관리자 전용 레이아웃

'use client';

import React, { useState } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Divider,
  Chip,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Article as ArticleIcon,
  Image as ImageIcon,
  Settings as SettingsIcon,
  Backup as BackupIcon,
  Preview as PreviewIcon,
  Notifications as NotificationsIcon,
  AccountCircle as AccountCircleIcon,
  Logout as LogoutIcon,
  Language as LanguageIcon,
  Home as HomeIcon
} from '@mui/icons-material';
import { useRouter, usePathname } from 'next/navigation';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

/**
 * 관리자 테마 설정
 * Material-UI의 기본 테마를 커스터마이징
 */
const adminTheme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    // 커스텀 컴포넌트 스타일
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#1e293b',
          color: '#ffffff',
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          color: '#94a3b8',
          minWidth: 40,
        },
      },
    },
    MuiListItemText: {
      styleOverrides: {
        primary: {
          color: '#ffffff',
          fontSize: '0.875rem',
        },
      },
    },
  },
});

/**
 * 사이드바 메뉴 아이템 정의
 */
const menuItems = [
  {
    text: '대시보드',
    icon: <DashboardIcon />,
    path: '/admin',
    badge: null,
  },
  {
    text: '콘텐츠 관리',
    icon: <ArticleIcon />,
    path: '/admin/contents',
    badge: null,
  },
  {
    text: '미디어 관리',
    icon: <ImageIcon />,
    path: '/admin/media',
    badge: null,
  },
  {
    text: '사이트 미리보기',
    icon: <PreviewIcon />,
    path: '/preview',
    badge: null,
  },
  {
    text: '백업 관리',
    icon: <BackupIcon />,
    path: '/admin/backup',
    badge: null,
  },
  {
    text: '설정',
    icon: <SettingsIcon />,
    path: '/admin/settings',
    badge: null,
  },
];

/**
 * 사이드바 컴포넌트
 */
interface SidebarProps {
  open: boolean;
  onClose: () => void;
  permanent?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ open, onClose, permanent = false }) => {
  const router = useRouter();
  const pathname = usePathname();

  const handleMenuClick = (path: string) => {
    router.push(path);
    if (!permanent) {
      onClose();
    }
  };

  const drawerContent = (
    <Box>
      {/* 로고 및 제목 */}
      <Box sx={{ p: 3, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
          Content Studio
        </Typography>
        <Typography variant="body2" sx={{ color: '#94a3b8', mt: 0.5 }}>
          CMS 관리자
        </Typography>
      </Box>

      {/* 메인 메뉴 */}
      <List sx={{ pt: 2 }}>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.path}
            onClick={() => handleMenuClick(item.path)}
            sx={{
              mx: 1,
              borderRadius: 1,
              mb: 0.5,
              backgroundColor: pathname === item.path ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
              ...(pathname === item.path && {
                borderLeft: '3px solid #3b82f6',
              }),
            }}
          >
            <ListItemIcon>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
            {item.badge && (
              <Chip 
                label={item.badge} 
                size="small" 
                color="primary"
                sx={{ ml: 1 }} 
              />
            )}
          </ListItem>
        ))}
      </List>

      <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.1)' }} />

      {/* 하단 메뉴 */}
      <List>
        <ListItem
          button
          onClick={() => handleMenuClick('/')}
          sx={{
            mx: 1,
            borderRadius: 1,
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            },
          }}
        >
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary="사이트 홈" />
        </ListItem>
      </List>
    </Box>
  );

  if (permanent) {
    return (
      <Drawer
        variant="permanent"
        sx={{
          width: 240,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
          },
        }}
      >
        {drawerContent}
      </Drawer>
    );
  }

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: 240,
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

/**
 * 관리자 레이아웃 컴포넌트
 */
const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const theme = useTheme();
  const router = useRouter();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // 사이드바 및 메뉴 상태
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationEl, setNotificationEl] = useState<null | HTMLElement>(null);

  /**
   * 사이드바 토글
   */
  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  /**
   * 사용자 메뉴 열기/닫기
   */
  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  /**
   * 알림 메뉴 열기/닫기
   */
  const handleNotificationOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationEl(null);
  };

  /**
   * 로그아웃 처리
   */
  const handleLogout = () => {
    handleUserMenuClose();
    // 실제 로그아웃 로직 구현
    router.push('/');
  };

  return (
    <ThemeProvider theme={adminTheme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        {/* 상단 앱바 */}
        <AppBar
          position="fixed"
          sx={{
            zIndex: theme.zIndex.drawer + 1,
            backgroundColor: 'white',
            color: 'text.primary',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          }}
        >
          <Toolbar>
            {/* 메뉴 버튼 */}
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={handleSidebarToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>

            {/* 제목 */}
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: '#1976d2' }}>
              Content Studio CMS
            </Typography>

            {/* 우측 아이콘들 */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {/* 언어 선택 */}
              <IconButton color="inherit" size="small">
                <LanguageIcon />
              </IconButton>

              {/* 알림 */}
              <IconButton
                color="inherit"
                onClick={handleNotificationOpen}
                size="small"
              >
                <Badge badgeContent={3} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>

              {/* 사용자 메뉴 */}
              <IconButton
                size="small"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleUserMenuOpen}
                color="inherit"
              >
                <AccountCircleIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>

        {/* 사용자 메뉴 */}
        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={Boolean(anchorEl)}
          onClose={handleUserMenuClose}
        >
          <MenuItem onClick={handleUserMenuClose}>
            <ListItemIcon>
              <AccountCircleIcon fontSize="small" />
            </ListItemIcon>
            프로필 설정
          </MenuItem>
          <MenuItem onClick={handleUserMenuClose}>
            <ListItemIcon>
              <SettingsIcon fontSize="small" />
            </ListItemIcon>
            계정 설정
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            로그아웃
          </MenuItem>
        </Menu>

        {/* 알림 메뉴 */}
        <Menu
          anchorEl={notificationEl}
          open={Boolean(notificationEl)}
          onClose={handleNotificationClose}
          PaperProps={{
            sx: { width: 320, maxHeight: 400 }
          }}
        >
          <Box sx={{ p: 2, borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
            <Typography variant="h6">
              알림
            </Typography>
          </Box>
          
          <MenuItem onClick={handleNotificationClose}>
            <ListItemText
              primary="새로운 댓글이 등록되었습니다"
              secondary="5분 전"
            />
          </MenuItem>
          
          <MenuItem onClick={handleNotificationClose}>
            <ListItemText
              primary="콘텐츠가 발행 승인을 기다리고 있습니다"
              secondary="1시간 전"
            />
          </MenuItem>
          
          <MenuItem onClick={handleNotificationClose}>
            <ListItemText
              primary="백업이 완료되었습니다"
              secondary="2시간 전"
            />
          </MenuItem>
          
          <Divider />
          <MenuItem onClick={handleNotificationClose} sx={{ justifyContent: 'center' }}>
            <Typography variant="body2" color="primary">
              모든 알림 보기
            </Typography>
          </MenuItem>
        </Menu>

        {/* 사이드바 */}
        <Sidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          permanent={!isMobile}
        />

        {/* 메인 콘텐츠 영역 */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            bgcolor: 'background.default',
            minHeight: '100vh',
            pt: '64px', // AppBar 높이만큼 여백
            ...((!isMobile && sidebarOpen) && {
              ml: 0, // permanent drawer는 자동으로 margin 적용됨
            }),
          }}
        >
          {children}
        </Box>

        {/* 모바일에서 사이드바가 열렸을 때 오버레이 */}
        {isMobile && sidebarOpen && (
          <Box
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0,0,0,0.5)',
              zIndex: theme.zIndex.drawer - 1,
            }}
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </Box>
    </ThemeProvider>
  );
};

export default AdminLayout;