// app/admin/layout.tsx
// 관리자 페이지 레이아웃 - 간단한 네비게이션

'use client';

import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Container,
  Button,
  Stack,
} from '@mui/material';
import { Home, Dashboard, Article, Add } from '@mui/icons-material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  return (
    <Box>
      {/* 상단 네비게이션 */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            📝 간단한 CMS - 관리자
          </Typography>
          
          <Stack direction="row" spacing={1}>
            <Link href="/" passHref>
              <Button color="inherit" startIcon={<Home />}>
                홈
              </Button>
            </Link>
            
            <Link href="/admin" passHref>
              <Button 
                color="inherit" 
                startIcon={<Dashboard />}
                variant={pathname === '/admin' ? 'outlined' : 'text'}
              >
                대시보드
              </Button>
            </Link>
            
            <Link href="/admin/content" passHref>
              <Button 
                color="inherit" 
                startIcon={<Article />}
                variant={pathname.startsWith('/admin/content') ? 'outlined' : 'text'}
              >
                글 관리
              </Button>
            </Link>
            
            <Link href="/admin/content/new" passHref>
              <Button color="inherit" startIcon={<Add />}>
                글 쓰기
              </Button>
            </Link>
          </Stack>
        </Toolbar>
      </AppBar>

      {/* 메인 콘텐츠 */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {children}
      </Container>
    </Box>
  );
}