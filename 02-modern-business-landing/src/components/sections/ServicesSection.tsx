// src/components/sections/ServicesSection.tsx
'use client'
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
} from '@mui/material'
import { motion } from 'framer-motion'
import BusinessIcon from '@mui/icons-material/Business'
import CodeIcon from '@mui/icons-material/Code'
import AnalyticsIcon from '@mui/icons-material/Analytics'
import SupportAgentIcon from '@mui/icons-material/SupportAgent'

/**
 * 서비스 소개 섹션 컴포넌트
 * 카드 형태로 각 서비스를 소개
 */
const ServicesSection = () => {
  // 서비스 데이터 배열
  const services = [
    {
      icon: <BusinessIcon sx={{ fontSize: 48 }} />,
      title: '비즈니스 컨설팅',
      description: '전문적인 비즈니스 전략 수립과 실행을 위한 맞춤형 컨설팅 서비스를 제공합니다.',
      features: ['전략 수립', '프로세스 개선', '성과 분석'],
    },
    {
      icon: <CodeIcon sx={{ fontSize: 48 }} />,
      title: '웹 개발',
      description: '최신 기술을 활용한 반응형 웹사이트와 웹 애플리케이션 개발 서비스입니다.',
      features: ['반응형 디자인', '최신 기술 스택', 'SEO 최적화'],
    },
    {
      icon: <AnalyticsIcon sx={{ fontSize: 48 }} />,
      title: '데이터 분석',
      description: '빅데이터 분석과 인사이트 도출을 통해 데이터 기반의 의사결정을 지원합니다.',
      features: ['빅데이터 분석', '리포팅 자동화', '예측 모델링'],
    },
    {
      icon: <SupportAgentIcon sx={{ fontSize: 48 }} />,
      title: '24/7 지원',
      description: '연중무휴 기술 지원과 고객 서비스를 통해 안정적인 서비스 운영을 보장합니다.',
      features: ['24시간 모니터링', '즉시 대응', '정기 점검'],
    },
  ]

  return (
    <Box sx={{ py: 8, backgroundColor: 'background.default' }}>
      <Container maxWidth="lg">
        {/* 섹션 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Typography
            variant="h2"
            component="h2"
            textAlign="center"
            gutterBottom
            sx={{ mb: 2 }}
          >
            우리의 서비스
          </Typography>
          <Typography
            variant="h6"
            textAlign="center"
            color="text.secondary"
            sx={{ mb: 6, maxWidth: 600, mx: 'auto' }}
          >
            전문적이고 혁신적인 솔루션으로 고객의 성공을 함께 만들어갑니다
          </Typography>
        </motion.div>

        {/* 서비스 카드 그리드 */}
        <Grid container spacing={4}>
          {services.map((service, index) => (
            <Grid item xs={12} md={6} lg={3} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
              >
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: (theme) => theme.shadows[12],
                    },
                  }}
                >
                  <CardContent sx={{ flexGrow: 1, textAlign: 'center', pt: 4 }}>
                    {/* 서비스 아이콘 */}
                    <Box
                      sx={{
                        color: 'primary.main',
                        mb: 2,
                        display: 'flex',
                        justifyContent: 'center',
                      }}
                    >
                      {service.icon}
                    </Box>

                    {/* 서비스 제목 */}
                    <Typography variant="h5" component="h3" gutterBottom>
                      {service.title}
                    </Typography>

                    {/* 서비스 설명 */}
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      paragraph
                      sx={{ mb: 3 }}
                    >
                      {service.description}
                    </Typography>

                    {/* 서비스 특징 */}
                    <Box sx={{ textAlign: 'left' }}>
                      {service.features.map((feature, featureIndex) => (
                        <Typography
                          key={featureIndex}
                          variant="body2"
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            mb: 1,
                            '&:before': {
                              content: '"✓"',
                              color: 'primary.main',
                              fontWeight: 'bold',
                              mr: 1,
                            },
                          }}
                        >
                          {feature}
                        </Typography>
                      ))}
                    </Box>
                  </CardContent>

                  {/* 카드 액션 */}
                  <CardActions sx={{ justifyContent: 'center', pb: 3 }}>
                    <Button
                      variant="outlined"
                      color="primary"
                      sx={{
                        borderRadius: 2,
                        px: 3,
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: (theme) => theme.shadows[4],
                        },
                      }}
                    >
                      자세히 보기
                    </Button>
                  </CardActions>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  )
}

export default ServicesSection