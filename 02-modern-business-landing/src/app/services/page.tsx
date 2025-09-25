// src/app/services/page.tsx
// 💼 서비스 페이지 - 상세 서비스 소개

import { Container, Typography, Box, Grid, Card, CardContent, Button, Chip } from '@mui/material';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// 🏷️ 서비스 데이터 타입
interface ServiceDetail {
  id: number;
  title: string;
  description: string;
  icon: string;
  features: string[];
  price: string;
  popular?: boolean;
}

// 📋 상세 서비스 데이터
const services: ServiceDetail[] = [
  {
    id: 1,
    title: '웹 개발',
    description: '최신 기술을 활용한 반응형 웹사이트와 웹 애플리케이션 개발',
    icon: '💻',
    features: [
      'Next.js / React 개발',
      '반응형 디자인',
      'SEO 최적화',
      '성능 최적화',
      '유지보수 지원'
    ],
    price: '300만원부터',
    popular: true,
  },
  {
    id: 2,
    title: '모바일 앱',
    description: 'iOS/Android 네이티브 및 크로스플랫폼 모바일 애플리케이션',
    icon: '📱',
    features: [
      'React Native 개발',
      '네이티브 앱 개발',
      '앱스토어 배포',
      '푸시 알림',
      '오프라인 지원'
    ],
    price: '500만원부터',
  },
  {
    id: 3,
    title: '디지털 마케팅',
    description: 'SEO, 소셜미디어, 콘텐츠 마케팅을 통한 온라인 브랜딩',
    icon: '📈',
    features: [
      'SEO 최적화',
      '구글 애즈 관리',
      '소셜미디어 마케팅',
      '콘텐츠 제작',
      '분석 리포트'
    ],
    price: '100만원부터',
  },
  {
    id: 4,
    title: 'UI/UX 디자인',
    description: '사용자 중심의 직관적이고 아름다운 인터페이스 디자인',
    icon: '🎨',
    features: [
      '사용자 리서치',
      '와이어프레임 설계',
      '프로토타입 제작',
      '디자인 시스템',
      '사용성 테스트'
    ],
    price: '200만원부터',
  },
  {
    id: 5,
    title: '클라우드 인프라',
    description: '안정적이고 확장 가능한 클라우드 인프라 구축 및 관리',
    icon: '☁️',
    features: [
      'AWS/Azure 구축',
      '자동 스케일링',
      '모니터링 시스템',
      '백업 및 복구',
      '보안 강화'
    ],
    price: '150만원부터',
  },
  {
    id: 6,
    title: '컨설팅',
    description: '비즈니스 목표에 맞는 IT 전략 수립 및 기술 컨설팅',
    icon: '💡',
    features: [
      '기술 전략 수립',
      '시스템 분석',
      '개선 방안 제시',
      '프로젝트 관리',
      '교육 및 트레이닝'
    ],
    price: '협의',
  },
];

export default function ServicesPage() {
  return (
    <>
      <Header />
      
      <main>
        {/* 서비스 메인 섹션 */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            py: 8,
            textAlign: 'center',
          }}
        >
          <Container maxWidth="md">
            <Typography
              variant="h2"
              component="h1"
              gutterBottom
              sx={{ mb: 3 }}
            >
              우리의 서비스
            </Typography>
            
            <Typography
              variant="h5"
              component="p"
              sx={{ opacity: 0.9 }}
            >
              비즈니스 성장을 위한 완벽한 IT 솔루션을 제공합니다
            </Typography>
          </Container>
        </Box>

        {/* 서비스 카드 섹션 */}
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Grid container spacing={4}>
            {services.map((service) => (
              <Grid size={{ xs: 12, md: 6, lg: 4 }} key={service.id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
                    },
                  }}
                >
                  {service.popular && (
                    <Chip
                      label="인기"
                      color="error"
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        zIndex: 1,
                      }}
                    />
                  )}
                  
                  <CardContent sx={{ flexGrow: 1, p: 4 }}>
                    {/* 서비스 아이콘 */}
                    <Box sx={{ textAlign: 'center', mb: 3 }}>
                      <Typography variant="h2" component="div">
                        {service.icon}
                      </Typography>
                    </Box>
                    
                    {/* 서비스 제목 */}
                    <Typography 
                      variant="h5" 
                      component="h3" 
                      gutterBottom
                      textAlign="center"
                    >
                      {service.title}
                    </Typography>
                    
                    {/* 서비스 설명 */}
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      textAlign="center"
                      sx={{ mb: 3 }}
                    >
                      {service.description}
                    </Typography>
                    
                    {/* 주요 기능 */}
                    <Typography variant="h6" gutterBottom>
                      주요 기능:
                    </Typography>
                    <Box component="ul" sx={{ pl: 2, mb: 3 }}>
                      {service.features.map((feature, index) => (
                        <Typography 
                          key={index}
                          component="li"
                          variant="body2"
                          sx={{ mb: 0.5 }}
                        >
                          {feature}
                        </Typography>
                      ))}
                    </Box>
                    
                    {/* 가격 */}
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        mt: 'auto'
                      }}
                    >
                      <Typography 
                        variant="h6" 
                        color="primary"
                        fontWeight="bold"
                      >
                        {service.price}
                      </Typography>
                      
                      <Button 
                        variant="contained" 
                        size="small"
                        sx={{ minWidth: '80px' }}
                      >
                        문의하기
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>

        {/* CTA 섹션 */}
        <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 6 }}>
          <Container maxWidth="md" sx={{ textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom>
              프로젝트를 시작해볼까요?
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
              무료 상담을 통해 최적의 솔루션을 제안해드립니다
            </Typography>
            <Button
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
              무료 상담 신청
            </Button>
          </Container>
        </Box>
      </main>
      
      <Footer companyName="Modern Business" />
    </>
  );
}

/* 
📚 학습 노트:
1. Next.js App Router: /services/page.tsx 경로
2. 상세한 서비스 데이터 구조와 타입 정의
3. Grid 레이아웃으로 카드들을 반응형 배치
4. 인기 서비스에 Chip 컴포넌트로 배지 표시
5. hover 효과로 상호작용성 증대
6. CTA(Call To Action) 섹션으로 사용자 행동 유도
*/