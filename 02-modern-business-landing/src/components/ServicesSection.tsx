// src/components/ServicesSection.tsx
// 💼 서비스 섹션 - 배열 렌더링과 Grid 레이아웃 학습

import { Container, Typography, Grid, Card, CardContent, Box } from '@mui/material';

// 🏷️ 서비스 데이터 타입 정의
interface Service {
  id: number;
  title: string;
  description: string;
  icon: string;
}

// 🏷️ Props 타입 정의
interface ServicesSectionProps {
  services: Service[];
}

// 🎯 개별 서비스 카드 컴포넌트
function ServiceCard({ service }: { service: Service }) {
  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 3 }}>
        {/* 아이콘 */}
        <Box sx={{ fontSize: '3rem', mb: 2 }}>
          {service.icon}
        </Box>
        
        {/* 제목 */}
        <Typography variant="h5" component="h3" gutterBottom>
          {service.title}
        </Typography>
        
        {/* 설명 */}
        <Typography variant="body1" color="text.secondary">
          {service.description}
        </Typography>
      </CardContent>
    </Card>
  );
}

// 🏢 서비스 섹션 메인 컴포넌트
export default function ServicesSection({ services }: ServicesSectionProps) {
  return (
    <Box component="section" sx={{ py: 8, bgcolor: 'background.default' }}>
      <Container maxWidth="lg">
        {/* 섹션 제목 */}
        <Typography
          variant="h2"
          component="h2"
          textAlign="center"
          gutterBottom
          sx={{ mb: 6 }}
        >
          우리의 서비스
        </Typography>
        
        {/* 서비스 그리드 */}
        <Grid container spacing={4}>
          {services.map((service) => (
            <Grid size={{ xs: 12, md: 4 }} key={service.id}>
              <ServiceCard service={service} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

/* 
📚 학습 노트:
1. 컴포넌트를 더 작은 단위로 분리했습니다 (ServiceCard)
2. Grid 시스템으로 반응형 레이아웃을 구현했습니다
3. map() 함수로 동적 리스트를 렌더링합니다
4. hover 효과로 사용자 경험을 향상시켰습니다
5. Props를 통해 외부에서 데이터를 받아옵니다
6. TypeScript 인터페이스로 데이터 구조를 명확히 했습니다
*/