// app/page.tsx
// 홈페이지 - 관리자 페이지로 이동하는 간단한 페이지

import { Box, Container, Typography, Button, Card, CardContent } from '@mui/material';
import { Dashboard, Article } from '@mui/icons-material';
import Link from 'next/link';

export default function HomePage() {
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Box textAlign="center" mb={6}>
        <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
          📝 간단한 CMS
        </Typography>
        <Typography variant="h6" color="text.secondary">
          초보자를 위한 콘텐츠 관리 시스템
        </Typography>
      </Box>

      <Box display="flex" justifyContent="center" gap={3}>
        <Card sx={{ maxWidth: 300 }}>
          <CardContent sx={{ textAlign: 'center' }}>
            <Dashboard sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              관리자 페이지
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
              글 작성, 편집, 관리를 할 수 있습니다
            </Typography>
            <Link href="/admin" passHref>
              <Button variant="contained" fullWidth>
                관리자 페이지로 가기
              </Button>
            </Link>
          </CardContent>
        </Card>
      </Box>

      <Box mt={6} textAlign="center">
        <Typography variant="body2" color="text.secondary">
          Next.js 15 + React 19 + Material-UI로 만든 간단한 CMS
        </Typography>
      </Box>
    </Container>
  );
}