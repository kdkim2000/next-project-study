// src/components/Header.tsx
// 🧭 헤더 네비게이션 - MUI v7 + Framer Motion 통합

'use client';

import { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useTheme,
  useMediaQuery,
  Badge,
  Avatar,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
} from '@mui/icons-material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeInLeft, buttonVariants } from '@/lib/animations';

// 🏷️ 네비게이션 아이템 타입
interface NavigationItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  badge?: string;
  external?: boolean;
}

// 📋 네비게이션 메뉴 데이터
const navigationItems: NavigationItem[] = [
  { label: '홈', href: '/' },
  { label: '서비스', href: '/services', badge: 'New' },
  { label: '회사소개', href: '/about' },
  { label: '연락처', href: '/contact', icon: <PhoneIcon fontSize="small" /> },
];

// 📞 연락처 정보 (환경변수에서 가져오기)
const contactInfo = {
  phone: process.env.NEXT_PUBLIC_COMPANY_PHONE || '02-1234-5678',
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'info@modernbusiness.com',
};

// 🎭 애니메이션 변형
const headerVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.4,
      ease: 'easeOut'
    }
  },
};

const mobileMenuVariants = {
  hidden: { opacity: 0, x: '100%' },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.3,
      ease: 'easeInOut'
    }
  },
  exit: { 
    opacity: 0, 
    x: '100%',
    transition: {
      duration: 0.2,
      ease: 'easeIn'
    }
  },
};

// 🧩 헤더 컴포넌트
export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // 📱 모바일 메뉴 토글
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  // 🎯 활성 링크 확인
  const isActiveLink = (href: string) => {
    return pathname === href;
  };

  return (
    <>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={headerVariants}
      >
        <AppBar 
          position="sticky" 
          elevation={0}
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
            color: 'text.primary',
          }}
        >
          <Toolbar 
            sx={{ 
              justifyContent: 'space-between',
              minHeight: { xs: 64, md: 72 },
              px: { xs: 2, sm: 3, md: 4 },
            }}
          >
            {/* 왼쪽: 로고/회사명 */}
            <motion.div
              variants={fadeInLeft}
              initial="hidden"
              animate="visible"
            >
              <Typography 
                variant="h5"
                component="div" 
                sx={{ 
                  fontWeight: 700,
                  color: 'primary.main',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <Link 
                  href="/" 
                  style={{ 
                    textDecoration: 'none', 
                    color: 'inherit',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  {/* 로고 아이콘 (실제로는 이미지나 SVG 사용) */}
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      bgcolor: 'primary.main',
                      fontSize: '1rem',
                    }}
                  >
                    M
                  </Avatar>
                  {!isMobile && 'Modern Business'}
                  {isMobile && 'MB'}
                </Link>
              </Typography>
            </motion.div>
            
            {/* 가운데: 데스크톱 네비게이션 메뉴 */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
              {navigationItems.map((item, index) => (
                <motion.div
                  key={item.label}
                  variants={buttonVariants}
                  initial="idle"
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Button
                    component={item.external ? 'a' : Link}
                    href={item.href}
                    target={item.external ? '_blank' : undefined}
                    rel={item.external ? 'noopener noreferrer' : undefined}
                    startIcon={item.icon}
                    sx={{
                      color: isActiveLink(item.href) ? 'primary.main' : 'text.primary',
                      backgroundColor: isActiveLink(item.href) 
                        ? 'rgba(25, 118, 210, 0.08)' 
                        : 'transparent',
                      fontWeight: isActiveLink(item.href) ? 600 : 500,
                      borderRadius: 2,
                      px: 2.5,
                      py: 1,
                      textTransform: 'none',
                      minWidth: 'auto',
                      '&:hover': {
                        backgroundColor: 'rgba(25, 118, 210, 0.04)',
                        transform: 'translateY(-1px)',
                      },
                      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                  >
                    {item.badge ? (
                      <Badge
                        badgeContent={item.badge}
                        color="error"
                        sx={{
                          '& .MuiBadge-badge': {
                            fontSize: '0.6rem',
                            height: 16,
                            minWidth: 16,
                            padding: '0 4px',
                          },
                        }}
                      >
                        {item.label}
                      </Badge>
                    ) : (
                      item.label
                    )}
                  </Button>
                </motion.div>
              ))}
            </Box>

            {/* 오른쪽: 연락처 정보 & 모바일 메뉴 버튼 */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {/* 데스크톱 연락처 정보 */}
              {!isMobile && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: 2 }}>
                  <IconButton
                    size="small"
                    component="a"
                    href={`tel:${contactInfo.phone}`}
                    sx={{ color: 'primary.main' }}
                  >
                    <PhoneIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    component="a"
                    href={`mailto:${contactInfo.email}`}
                    sx={{ color: 'primary.main' }}
                  >
                    <EmailIcon fontSize="small" />
                  </IconButton>
                </Box>
              )}

              {/* CTA 버튼 (데스크톱) */}
              {!isMobile && (
                <motion.div
                  variants={buttonVariants}
                  initial="idle"
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Button
                    component={Link}
                    href="/contact"
                    variant="contained"
                    size="small"
                    sx={{
                      borderRadius: 2,
                      px: 2,
                      textTransform: 'none',
                      fontWeight: 600,
                      boxShadow: 'none',
                      '&:hover': {
                        boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                      },
                    }}
                  >
                    문의하기
                  </Button>
                </motion.div>
              )}

              {/* 모바일 메뉴 버튼 */}
              {isMobile && (
                <IconButton
                  color="primary"
                  aria-label="메뉴 열기"
                  onClick={toggleMobileMenu}
                  sx={{ ml: 1 }}
                >
                  <MenuIcon />
                </IconButton>
              )}
            </Box>
          </Toolbar>
        </AppBar>
      </motion.div>

      {/* 모바일 사이드 메뉴 */}
      <AnimatePresence>
        {isMobile && (
          <Drawer
            anchor="right"
            open={mobileMenuOpen}
            onClose={closeMobileMenu}
            PaperProps={{
              sx: {
                width: 280,
                backgroundColor: 'background.paper',
              },
            }}
          >
            <motion.div
              variants={mobileMenuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {/* 메뉴 헤더 */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  p: 2,
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Typography variant="h6" color="primary.main" fontWeight={700}>
                  Modern Business
                </Typography>
                <IconButton onClick={closeMobileMenu} size="small">
                  <CloseIcon />
                </IconButton>
              </Box>

              {/* 네비게이션 메뉴 */}
              <List sx={{ flex: 1 }}>
                {navigationItems.map((item) => (
                  <ListItem key={item.label} disablePadding>
                    <ListItemButton
                      component={item.external ? 'a' : Link}
                      href={item.href}
                      target={item.external ? '_blank' : undefined}
                      rel={item.external ? 'noopener noreferrer' : undefined}
                      selected={isActiveLink(item.href)}
                      onClick={closeMobileMenu}
                      sx={{
                        borderRadius: 1,
                        mx: 1,
                        mb: 0.5,
                        '&.Mui-selected': {
                          backgroundColor: 'rgba(25, 118, 210, 0.08)',
                          '&:hover': {
                            backgroundColor: 'rgba(25, 118, 210, 0.12)',
                          },
                        },
                      }}
                    >
                      {item.icon && (
                        <Box sx={{ mr: 2, color: 'primary.main' }}>
                          {item.icon}
                        </Box>
                      )}
                      <ListItemText 
                        primary={item.label}
                        primaryTypographyProps={{
                          fontWeight: isActiveLink(item.href) ? 600 : 400,
                          color: isActiveLink(item.href) ? 'primary.main' : 'text.primary',
                        }}
                      />
                      {item.badge && (
                        <Badge badgeContent={item.badge} color="error" />
                      )}
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>

              {/* 모바일 연락처 정보 */}
              <Box
                sx={{
                  p: 2,
                  borderTop: '1px solid',
                  borderColor: 'divider',
                  backgroundColor: 'grey.50',
                }}
              >
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  연락처
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Button
                    component="a"
                    href={`tel:${contactInfo.phone}`}
                    startIcon={<PhoneIcon />}
                    size="small"
                    sx={{ justifyContent: 'flex-start', textTransform: 'none' }}
                  >
                    {contactInfo.phone}
                  </Button>
                  <Button
                    component="a"
                    href={`mailto:${contactInfo.email}`}
                    startIcon={<EmailIcon />}
                    size="small"
                    sx={{ justifyContent: 'flex-start', textTransform: 'none' }}
                  >
                    {contactInfo.email}
                  </Button>
                </Box>

                {/* 모바일 CTA 버튼 */}
                <Button
                  component={Link}
                  href="/contact"
                  variant="contained"
                  fullWidth
                  onClick={closeMobileMenu}
                  sx={{ mt: 2, textTransform: 'none', fontWeight: 600 }}
                >
                  무료 상담 받기
                </Button>
              </Box>
            </motion.div>
          </Drawer>
        )}
      </AnimatePresence>
    </>
  );
}

/* 
📚 학습 노트: MUI v7 + Framer Motion 헤더 컴포넌트

1. 🎭 Framer Motion 통합:
   - 부드러운 페이지 로드 애니메이션
   - 호버 및 탭 상호작용 효과
   - 모바일 메뉴 슬라이드 애니메이션

2. 📱 반응형 디자인:
   - 데스크톱/모바일 다른 레이아웃
   - useMediaQuery로 중단점 감지
   - 적응형 네비게이션 메뉴

3. 🎨 MUI v7 새 기능:
   - 개선된 AppBar 스타일링
   - 새로운 색상 시스템 활용
   - Badge 컴포넌트로 알림 표시

4. 🔧 성능 최적화:
   - 조건부 렌더링 (isMobile)
   - AnimatePresence로 메뉴 최적화
   - 최소한의 리렌더링

5. 🌐 접근성:
   - 적절한 ARIA 레이블
   - 키보드 네비게이션 지원
   - 스크린 리더 고려

6. 📞 비즈니스 요구사항:
   - 환경변수 연락처 정보
   - CTA 버튼 강조
   - 브랜드 아이덴티티 반영
*/
