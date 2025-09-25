// src/components/Header.tsx
// 🧭 헤더 네비게이션 컴포넌트 - Next.js Link 사용

'use client';

import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// 🏷️ 네비게이션 메뉴 타입 정의
type NavigationItem = {
  label: string;
  href: string;
};

// 📋 네비게이션 메뉴 데이터
const navigationItems: NavigationItem[] = [
  { label: '홈', href: '/' },
  { label: '서비스', href: '/services' },
  { label: '회사소개', href: '/about' },
  { label: '연락처', href: '/contact' },
];

// 🧩 헤더 컴포넌트
export default function Header() {
  const pathname = usePathname(); // 현재 경로 확인

  return (
    <AppBar position="sticky" elevation={1}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* 왼쪽: 로고/회사명 */}
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ fontWeight: 'bold' }}
        >
          <Link 
            href="/" 
            style={{ 
              textDecoration: 'none', 
              color: 'inherit' 
            }}
          >
            Modern Business
          </Link>
        </Typography>
        
        {/* 오른쪽: 네비게이션 메뉴 */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
          {navigationItems.map((item) => (
            <Button
              key={item.label}
              component={Link}
              href={item.href}
              color="inherit"
              sx={{ 
                textTransform: 'none',
                backgroundColor: pathname === item.href ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                }
              }}
            >
              {item.label}
            </Button>
          ))}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

/* 
📚 학습 노트:
1. 'use client' 추가: usePathname 훅 사용을 위해 필요
2. Next.js Link 컴포넌트 사용: 클라이언트 사이드 라우팅
3. usePathname으로 현재 페이지 감지 및 활성 메뉴 표시
4. component={Link} prop으로 MUI Button과 Next.js Link 결합
5. 실제 라우트 경로 사용: '/', '/services', '/about', '/contact'
6. 로고도 클릭 가능한 홈 링크로 변경
*/