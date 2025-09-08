// src/app/about/page.tsx
/**
 * About 페이지 컴포넌트
 */
import { Metadata } from 'next'
import { Container, Box, Typography, Grid, Card, CardContent, Avatar } from '@mui/material'
import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'

export const metadata: Metadata = {
  title: '회사소개 - Modern Business',
  description: '혁신적인 기술과 창의적인 아이디어로 고객의 성공을 함께 만들어가는 Modern Business를 소개합니다.',
}

const teamMembers = [
  {
    name: '김철수',
    position: 'CEO & Founder',
    bio: '15년간의 IT 업계 경험을 바탕으로 회사를 이끌어가고 있습니다.',
    avatar: '/images/team/ceo.jpg',
  },
  {
    name: '이영희',
    position: 'CTO',
    bio: '최신 기술 트렌드를 반영한 혁신적인 솔루션을 개발합니다.',
    avatar: '/images/team/cto.jpg',
  },
  {
    name: '박민수',
    position: 'Lead Designer',
    bio: '사용자 중심의 직관적이고 아름다운 디자인을 추구합니다.',
    avatar: '/images/team/designer.jpg',
  },
  {
    name: '정수민',
    position: 'Project Manager',
    bio: '효율적인 프로젝트 관리로 고객 만족을 실현합니다.',
    avatar: '/images/team/pm.jpg',
  },
]

export default function AboutPage() {
  return (
    <Box component="main">
      <Header />
      
      {/* 페이지 헤더 */}
      <Box sx={{ py: 8, backgroundColor: 'primary.main', color: 'white' }}>
        <Container maxWidth="lg">
          <Typography variant="h2" component="h1" textAlign="center" gutterBottom>
            회사소개
          </Typography>
          <Typography variant="h6" textAlign="center" sx={{ opacity: 0.9 }}>
            혁신을 통한 성장, 함께하는 미래
          </Typography>
        </Container>
      </Box>

      {/* 회사 소개 섹션 */}
      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <Grid container spacing={6}>
            <Grid item xs={12} md={6}>
              <Typography variant="h3" component="h2" gutterBottom>
                우리의 미션
              </Typography>
              <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.7 }}>
                Modern Business는 혁신적인 기술과 창의적인 아이디어로 고객의 
                비즈니스 성공을 함께 만들어가는 디지털 솔루션 파트너입니다.
              </Typography>
              <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.7 }}>
                우리는 단순한 서비스 제공을 넘어서 고객의 진정한 파트너로서, 
                각 고객의 고유한 요구사항을 이해하고 맞춤형 솔루션을 제공합니다.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h3" component="h2" gutterBottom>
                우리의 비전
              </Typography>
              <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.7 }}>
                디지털 혁신을 통해 더 나은 세상을 만들어가는 것이 우리의 비전입니다. 
                기술의 발전이 인간의 삶을 더욱 풍요롭게 만들 수 있다고 믿습니다.
              </Typography>
              <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.7 }}>
                지속 가능한 성장과 사회적 책임을 바탕으로 고객, 직원, 그리고 
                사회 전체에 긍정적인 영향을 미치는 기업이 되겠습니다.
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* 팀 소개 섹션 */}
      <Box sx={{ py: 8, backgroundColor: 'grey.50' }}>
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" textAlign="center" gutterBottom sx={{ mb: 6 }}>
            우리 팀
          </Typography>
          
          <Grid container spacing={4}>
            {teamMembers.map((member, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card 
                  sx={{ 
                    textAlign: 'center', 
                    height: '100%',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: 8,
                    }
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Avatar
                      // src={member.avatar} // 실제 이미지가 있을 때 사용
                      sx={{ 
                        width: 100, 
                        height: 100, 
                        mx: 'auto', 
                        mb: 2,
                        fontSize: '2rem',
                        backgroundColor: 'primary.main'
                      }}
                    >
                      {member.name.charAt(0)}
                    </Avatar>
                    <Typography variant="h6" component="h3" gutterBottom>
                      {member.name}
                    </Typography>
                    <Typography variant="subtitle1" color="primary" gutterBottom>
                      {member.position}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {member.bio}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Footer />
    </Box>
  )
}