// src/components/sections/About.tsx
// 자기소개 섹션 컴포넌트 - unused 변수 제거

'use client'

import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  useTheme,
  alpha,
} from '@mui/material'
import {
  Code,
  Palette,
  Speed,
  GroupWork,
} from '@mui/icons-material'
import { motion } from 'framer-motion'

// 특징/강점 데이터
const features = [
  {
    icon: <Code />,
    title: '깔끔한 코드',
    description: '유지보수가 쉽고 확장 가능한 코드를 작성합니다. 코드 리뷰와 리팩토링을 통해 품질을 지속적으로 개선합니다.',
  },
  {
    icon: <Palette />,
    title: 'UI/UX 중심',
    description: '사용자 경험을 최우선으로 생각하며, 직관적이고 아름다운 인터페이스를 설계합니다.',
  },
  {
    icon: <Speed />,
    title: '성능 최적화',
    description: '웹사이트 성능과 로딩 속도 최적화에 깊은 관심을 가지고 있으며, 최신 기술을 적극 활용합니다.',
  },
  {
    icon: <GroupWork />,
    title: '팀워크',
    description: '효과적인 커뮤니케이션과 협업을 통해 팀의 목표를 달성하는 것을 중요하게 생각합니다.',
  },
]

// 애니메이션 variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
}

export default function About() {
  const theme = useTheme()

  return (
    <Box
      component="section"
      sx={{
        py: { xs: 8, md: 12 },
        bgcolor: 'background.default',
      }}
    >
      <Container maxWidth="lg">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {/* 섹션 헤더 */}
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <motion.div variants={itemVariants}>
              <Typography
                variant="h2"
                sx={{
                  mb: 3,
                  fontWeight: 'bold',
                  color: 'text.primary',
                }}
              >
                About Me
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: 'text.secondary',
                  maxWidth: '600px',
                  mx: 'auto',
                  lineHeight: 1.8,
                }}
              >
                열정적인 프론트엔드 개발자로서, 사용자 중심의 웹 애플리케이션을 
                만드는 것을 좋아합니다. 새로운 기술을 학습하고 적용하는 것에 
                즐거움을 느끼며, 항상 더 나은 코드를 작성하기 위해 노력합니다.
              </Typography>
            </motion.div>
          </Box>

          {/* 특징 카드들 */}
          <Grid container spacing={4}>
            {features.map((feature) => (
              <Grid item xs={12} sm={6} md={3} key={feature.title}>
                <motion.div
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 10 }}
                >
                  <Card
                    sx={{
                      height: '100%',
                      textAlign: 'center',
                      p: 3,
                      borderRadius: 3,
                      border: '1px solid',
                      borderColor: 'divider',
                      bgcolor: 'background.paper',
                      transition: 'all 0.3s ease-in-out',
                      '&:hover': {
                        borderColor: 'primary.main',
                        boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.12)}`,
                      },
                    }}
                  >
                    <CardContent sx={{ p: 0 }}>
                      {/* 아이콘 */}
                      <Avatar
                        sx={{
                          width: 64,
                          height: 64,
                          mx: 'auto',
                          mb: 3,
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                          color: 'primary.main',
                        }}
                      >
                        {feature.icon}
                      </Avatar>

                      {/* 제목 */}
                      <Typography
                        variant="h6"
                        sx={{
                          mb: 2,
                          fontWeight: 'bold',
                          color: 'text.primary',
                        }}
                      >
                        {feature.title}
                      </Typography>

                      {/* 설명 */}
                      <Typography
                        variant="body2"
                        sx={{
                          color: 'text.secondary',
                          lineHeight: 1.7,
                        }}
                      >
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>

          {/* 추가 소개 텍스트 */}
          <motion.div variants={itemVariants}>
            <Box
              sx={{
                mt: 8,
                p: 4,
                borderRadius: 3,
                bgcolor: alpha(theme.palette.primary.main, 0.05),
                border: '1px solid',
                borderColor: alpha(theme.palette.primary.main, 0.1),
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  mb: 3,
                  fontWeight: 'bold',
                  color: 'text.primary',
                  textAlign: 'center',
                }}
              >
                개발 철학
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: 'text.secondary',
                  lineHeight: 1.8,
                  textAlign: 'center',
                  maxWidth: '800px',
                  mx: 'auto',
                }}
              >
                "좋은 코드는 기능적일 뿐만 아니라 읽기 쉽고 유지보수가 용이해야 한다"는 
                믿음으로 개발합니다. 사용자의 니즈를 깊이 이해하고, 기술적 완성도와 
                사용성을 모두 만족시키는 제품을 만들기 위해 끊임없이 학습하고 성장하고 있습니다.
              </Typography>
            </Box>
          </motion.div>
        </motion.div>
      </Container>
    </Box>
  )
}