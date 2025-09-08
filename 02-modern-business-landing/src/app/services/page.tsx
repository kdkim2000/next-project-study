// src/app/services/page.tsx
/**
 * Services 페이지 컴포넌트
 */
import { Metadata } from 'next'
import { 
  Container, 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardActions,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'

export const metadata: Metadata = {
  title: '서비스 - Modern Business',
  description: '웹 개발, 모바일 앱, 디지털 마케팅 등 다양한 IT 솔루션 서비스를 제공합니다.',
}

const serviceDetails = [
  {
    title: '웹 개발',
    description: '현대적이고 반응형인 웹사이트와 웹 애플리케이션을 개발합니다.',
    features: [
      '반응형 웹 디자인',
      'Progressive Web App (PWA)',
      'E-commerce 솔루션',
      'CMS 시스템 구축',
      'API 개발 및 연동',
      'SEO 최적화',
    ],
    technologies: ['React', 'Next.js', 'Node.js', 'TypeScript'],
    price: '500만원부터',
  },
  {
    title: '모바일 앱 개발',
    description: 'iOS와 Android를 위한 네이티브 및 크로스플랫폼 앱을 개발합니다.',
    features: [
      'iOS/Android 네이티브 앱',
      'React Native 크로스플랫폼',
      'UI/UX 디자인',
      '앱스토어 배포 지원',
      '유지보수 및 업데이트',
      '푸시 알림 구현',
    ],
    technologies: ['React Native', 'Swift', 'Kotlin', 'Flutter'],
    price: '800만원부터',
  },
  {
    title: '디지털 마케팅',
    description: '데이터 기반의 효과적인 디지털 마케팅 전략을 수립하고 실행합니다.',
    features: [
      'SEO 최적화',
      '구글 애즈 운영',
      '소셜미디어 마케팅',
      '콘텐츠 마케팅',
      '이메일 마케팅',
      '성과 분석 및 리포팅',
    ],
    technologies: ['Google Analytics', 'Google Ads', 'Facebook Ads'],
    price: '월 200만원부터',
  },
  {
    title: 'IT 컨설팅',
    description: '비즈니스 목표에 맞는 최적의 IT 솔루션을 제안하고 구현합니다.',
    features: [
      '디지털 전환 전략 수립',
      '시스템 아키텍처 설계',
      '기술 스택 선정',
      '프로젝트 관리',
      '품질 관리',
      '교육 및 기술 지원',
    ],
    technologies: ['AWS', 'Azure', 'Docker', 'Kubernetes'],
    price: '프로젝트별 협의',
  },
]

export default function ServicesPage() {
  return (
    <Box component="main">
      <Header />
      
      {/* 페이지 헤더 */}
      <Box sx={{ py: 8, backgroundColor: 'primary.main', color: 'white' }}>
        <Container maxWidth="lg">
          <Typography variant="h2" component="h1" textAlign="center" gutterBottom>
            우리의 서비스
          </Typography>
          <Typography variant="h6" textAlign="center" sx={{ opacity: 0.9 }}>
            전문적이고 혁신적인 IT 솔루션으로 고객의 성공을 함께 만들어갑니다
          </Typography>
        </Container>
      </Box>

      {/* 서비스 상세 섹션 */}
      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {serviceDetails.map((service, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Card 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 8,
                    }
                  }}
                >
                  <CardContent sx={{ flexGrow: 1, p: 4 }}>
                    <Typography variant="h4" component="h3" gutterBottom color="primary">
                      {service.title}
                    </Typography>
                    
                    <Typography variant="body1" paragraph sx={{ mb: 3 }}>
                      {service.description}
                    </Typography>

                    {/* 주요 기능 */}
                    <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                      주요 기능
                    </Typography>
                    <List dense>
                      {service.features.map((feature, featureIndex) => (
                        <ListItem key={featureIndex} sx={{ py: 0.5, px: 0 }}>
                          <ListItemIcon sx={{ minWidth: 32 }}>
                            <CheckCircleIcon color="primary" sx={{ fontSize: 20 }} />
                          </ListItemIcon>
                          <ListItemText 
                            primary={feature}
                            primaryTypographyProps={{ variant: 'body2' }}
                          />
                        </ListItem>
                      ))}
                    </List>

                    {/* 사용 기술 */}
                    <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                      사용 기술
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                      {service.technologies.map((tech, techIndex) => (
                        <Box
                          key={techIndex}
                          sx={{
                            px: 2,
                            py: 0.5,
                            backgroundColor: 'primary.light',
                            color: 'white',
                            borderRadius: 2,
                            fontSize: '0.875rem',
                          }}
                        >
                          {tech}
                        </Box>
                      ))}
                    </Box>

                    {/* 가격 정보 */}
                    <Typography variant="h6" color="secondary" sx={{ mt: 2 }}>
                      {service.price}
                    </Typography>
                  </CardContent>

                  <CardActions sx={{ p: 3, pt: 0 }}>
                    <Button 
                      variant="contained" 
                      fullWidth 
                      size="large"
                      sx={{ py: 1.5 }}
                    >
                      상담 문의
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA 섹션 */}
      <Box sx={{ py: 8, backgroundColor: 'grey.100' }}>
        <Container maxWidth="md">
          <Box textAlign="center">
            <Typography variant="h4" component="h2" gutterBottom>
              프로젝트를 시작할 준비가 되셨나요?
            </Typography>
            <Typography variant="body1" paragraph sx={{ mb: 4 }}>
              전문 컨설턴트와 상담을 통해 최적의 솔루션을 찾아보세요.
              무료 상담 및 견적을 제공해드립니다.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button 
                variant="contained" 
                size="large"
                sx={{ px: 4, py: 2 }}
              >
                무료 상담 신청
              </Button>
              <Button 
                variant="outlined" 
                size="large"
                sx={{ px: 4, py: 2 }}
              >
                포트폴리오 보기
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      <Footer />
    </Box>
  )
}