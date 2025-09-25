// src/components/HeroSection.tsx
// 🦸 히어로 섹션 - Props 패턴과 Next.js Link 활용

import { Box, Container, Typography, Button } from '@mui/material';
import Link from 'next/link';

// 🏷️ Props 타입 정의 - TypeScript의 핵심 개념
interface HeroSectionProps {
  companyInfo: {
    name: string;
    tagline: string;
    description: string;
  };
}

// 🌟 히어로 섹션 컴포넌트
export default function HeroSection({ companyInfo }: HeroSectionProps) {
  return (
    <Box
      sx={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        py: 12,
        textAlign: 'center',
      }}
    >
      <Container maxWidth="md">
        {/* 메인 타이틀 */}
        <Typography
          variant="h1"
          component="h1"
          gutterBottom
          sx={{
            fontSize: { xs: '2.5rem', md: '3.5rem' },
            mb: 3,
          }}
        >
          {companyInfo.tagline}
        </Typography>
        
        {/* 서브 타이틀 */}
        <Typography
          variant="h5"
          component="p"
          sx={{
            mb: 4,
            opacity: 0.9,
            maxWidth: '600px',
            mx: 'auto',
          }}
        >
          {companyInfo.description}
        </Typography>
        
        {/* 액션 버튼들 - Next.js Link로 실제 페이지 이동 */}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            component={Link}
            href="/services"
            variant="contained"
            size="large"
            sx={{
              bgcolor: 'white',
              color: 'primary.main',
              px: 4,
              py: 1.5,
              '&:hover': {
                bgcolor: 'grey.100',
              },
            }}
          >
            서비스 보기
          </Button>
          
          <Button
            component={Link}
            href="/contact"
            variant="outlined"
            size="large"
            sx={{
              borderColor: 'white',
              color: 'white',
              px: 4,
              py: 1.5,
              '&:hover': {
                borderColor: 'white',
                bgcolor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            연락하기
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

/* 
📚 학습 노트:
1. Next.js Link 컴포넌트를 import하여 클라이언트 사이드 라우팅 구현
2. component={Link} prop으로 MUI Button과 Next.js Link 결합
3. href="/services", href="/contact"로 실제 페이지 라우팅
4. 버튼 클릭 시 전체 페이지 새로고침 없이 라우팅 됨
5. 구조 분해 할당으로 props를 받아옵니다
6. sx prop으로 반응형 스타일을 적용합니다
*/