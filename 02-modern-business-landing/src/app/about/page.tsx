// src/app/about/page.tsx
// 🏢 회사소개 페이지 - Next.js 라우팅 학습

import { Container, Typography, Box, Grid, Card, CardContent, Avatar } from '@mui/material';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// 👥 팀 멤버 데이터
const teamMembers = [
  {
    id: 1,
    name: '김철수',
    position: 'CEO',
    description: '10년 이상의 IT 경험을 바탕으로 회사를 이끌고 있습니다.',
    avatar: '👨‍💼',
  },
  {
    id: 2,
    name: '박영희',
    position: 'CTO',
    description: '최신 기술 트렌드를 반영한 솔루션을 개발합니다.',
    avatar: '👩‍💻',
  },
  {
    id: 3,
    name: '이민수',
    position: '디자인 팀장',
    description: '사용자 경험을 최우선으로 생각하는 디자인을 합니다.',
    avatar: '🎨',
  },
];

export default function AboutPage() {
  return (
    <>
      <Header />
      
      <main>
        {/* 회사 소개 메인 섹션 */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            py: 8,
            textAlign: 'center',
          }}
        >
          <Container maxWidth="md">
            <Typography
              variant="h2"
              component="h1"
              gutterBottom
              sx={{ color: 'primary.main', mb: 3 }}
            >
              회사소개
            </Typography>
            
            <Typography
              variant="h5"
              component="p"
              sx={{ color: 'text.secondary', mb: 4 }}
            >
              혁신적인 기술로 더 나은 미래를 만들어갑니다
            </Typography>
          </Container>
        </Box>

        {/* 회사 비전 섹션 */}
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Grid container spacing={6}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="h4" gutterBottom color="primary">
                우리의 비전
              </Typography>
              <Typography variant="body1" paragraph>
                Modern Business는 최신 웹 기술을 활용하여 고객의 비즈니스 성장을 돕는 
                전문 IT 솔루션 회사입니다. Next.js, React, TypeScript 등 현대적인 
                기술 스택을 바탕으로 안정적이고 확장 가능한 웹 애플리케이션을 제공합니다.
              </Typography>
              <Typography variant="body1">
                우리는 단순한 기능 구현을 넘어서, 사용자 경험과 비즈니스 가치를 
                극대화하는 솔루션을 만들어갑니다.
              </Typography>
            </Grid>
            
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="h4" gutterBottom color="primary">
                핵심 가치
              </Typography>
              <Box sx={{ pl: 2 }}>
                <Typography variant="h6" gutterBottom>
                  🚀 혁신 (Innovation)
                </Typography>
                <Typography variant="body2" paragraph>
                  최신 기술 트렌드를 빠르게 적용하여 경쟁력 있는 솔루션을 제공합니다.
                </Typography>
                
                <Typography variant="h6" gutterBottom>
                  🤝 신뢰 (Trust)
                </Typography>
                <Typography variant="body2" paragraph>
                  투명한 소통과 약속된 일정 준수로 고객의 신뢰를 얻습니다.
                </Typography>
                
                <Typography variant="h6" gutterBottom>
                  📈 성장 (Growth)
                </Typography>
                <Typography variant="body2">
                  고객과 함께 성장하는 파트너십을 지향합니다.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>

        {/* 팀 소개 섹션 */}
        <Box sx={{ bgcolor: 'background.default', py: 8 }}>
          <Container maxWidth="lg">
            <Typography
              variant="h4"
              component="h2"
              textAlign="center"
              gutterBottom
              sx={{ mb: 6 }}
            >
              우리 팀
            </Typography>
            
            <Grid container spacing={4}>
              {teamMembers.map((member) => (
                <Grid size={{ xs: 12, md: 4 }} key={member.id}>
                  <Card
                    sx={{
                      height: '100%',
                      textAlign: 'center',
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                      },
                    }}
                  >
                    <CardContent sx={{ p: 4 }}>
                      <Typography variant="h3" sx={{ mb: 2 }}>
                        {member.avatar}
                      </Typography>
                      
                      <Typography variant="h5" gutterBottom>
                        {member.name}
                      </Typography>
                      
                      <Typography 
                        variant="subtitle1" 
                        color="primary" 
                        gutterBottom
                      >
                        {member.position}
                      </Typography>
                      
                      <Typography variant="body2" color="text.secondary">
                        {member.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>
      </main>
      
      <Footer companyName="Modern Business" />
    </>
  );
}

/* 
📚 학습 노트:
1. Next.js 13+ App Router: /about/page.tsx 파일 구조
2. 별도 페이지로 분리된 라우팅 구조
3. Header와 Footer 컴포넌트 재사용
4. 반응형 Grid 레이아웃 활용
5. MUI 테마 색상 시스템 활용
6. 호버 효과로 사용자 경험 향상
*/