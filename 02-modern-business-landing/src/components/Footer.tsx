// src/components/Footer.tsx
// 🦶 푸터 컴포넌트 - Props와 현재 년도 표시

import { Box, Container, Typography, Grid, Link } from '@mui/material';

// 🏷️ Props 타입 정의
interface FooterProps {
  companyName: string;
}

// 🦶 푸터 컴포넌트
export default function Footer({ companyName }: FooterProps) {
  // 📅 현재 년도 가져오기
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'grey.900',
        color: 'white',
        py: 6,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* 회사 정보 */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              {companyName}
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              혁신적인 기술로 더 나은 미래를 만들어갑니다.
            </Typography>
            <Typography variant="body2" color="grey.400">
              서울특별시 강남구 테헤란로 123
            </Typography>
          </Grid>

          {/* 서비스 링크 */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              서비스
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href="#" color="grey.300" underline="hover">
                웹 개발
              </Link>
              <Link href="#" color="grey.300" underline="hover">
                모바일 앱
              </Link>
              <Link href="#" color="grey.300" underline="hover">
                디지털 마케팅
              </Link>
            </Box>
          </Grid>

          {/* 연락처 */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              연락처
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              이메일: info@modernbusiness.com
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              전화: 02-1234-5678
            </Typography>
            <Typography variant="body2">
              팩스: 02-1234-5679
            </Typography>
          </Grid>
        </Grid>

        {/* 저작권 표시 */}
        <Box
          sx={{
            borderTop: '1px solid',
            borderColor: 'grey.700',
            mt: 4,
            pt: 3,
            textAlign: 'center',
          }}
        >
          <Typography variant="body2" color="grey.400">
            © {currentYear} {companyName}. All rights reserved. | 
            Next.js 학습용 프로젝트
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

/* 
📚 학습 노트:
1. Props로 회사명을 동적으로 받아옵니다
2. JavaScript Date 객체로 현재 년도를 자동 계산합니다
3. Grid 시스템으로 푸터 레이아웃을 구성합니다
4. MUI Link 컴포넌트로 링크를 스타일링합니다
5. 색상 시스템을 활용해 일관된 디자인을 유지합니다
6. 반응형 레이아웃을 적용했습니다
*/