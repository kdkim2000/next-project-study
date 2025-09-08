// src/components/sections/AboutSection.tsx
'use client'
import {
  Box,
  Container,
  Typography,
  Grid,
  Avatar,
  useTheme,
  alpha,
} from '@mui/material'
import { motion } from 'framer-motion'
import GroupsIcon from '@mui/icons-material/Groups'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'

/**
 * 회사 소개 섹션 컴포넌트
 */
const AboutSection = () => {
  const theme = useTheme()

  const stats = [
    { icon: <GroupsIcon />, value: '500+', label: '만족한 고객' },
    { icon: <EmojiEventsIcon />, value: '50+', label: '완료 프로젝트' },
    { icon: <TrendingUpIcon />, value: '95%', label: '고객 만족도' },
  ]

  return (
    <Box sx={{ py: 8, backgroundColor: 'white' }}>
      <Container maxWidth="lg">
        <Grid container spacing={6} alignItems="center">
          {/* 텍스트 섹션 */}
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Typography
                variant="h2"
                component="h2"
                gutterBottom
                sx={{ mb: 3 }}
              >
                혁신을 통한 성장
              </Typography>
              
              <Typography
                variant="body1"
                color="text.secondary"
                paragraph
                sx={{ mb: 4, fontSize: '1.1rem' }}
              >
                2015년 설립된 Modern Business는 끊임없는 혁신과 고객 중심의 
                서비스로 업계를 선도하고 있습니다. 우리는 단순한 서비스 제공을 
                넘어서 고객의 진정한 파트너로서 함께 성장해나가고 있습니다.
              </Typography>

              <Typography
                variant="body1"
                color="text.secondary"
                paragraph
                sx={{ mb: 4, fontSize: '1.1rem' }}
              >
                전 세계 500여 개 기업과의 성공적인 파트너십을 통해 축적된 경험과 
                노하우를 바탕으로, 귀하의 비즈니스가 디지털 시대에 앞서갈 수 
                있도록 최고의 솔루션을 제공합니다.
              </Typography>

              {/* 통계 정보 */}
              <Grid container spacing={3}>
                {stats.map((stat, index) => (
                  <Grid item xs={4} key={index}>
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <Box sx={{ textAlign: 'center' }}>
                        <Avatar
                          sx={{
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            color: 'primary.main',
                            width: 56,
                            height: 56,
                            mb: 1,
                            mx: 'auto',
                          }}
                        >
                          {stat.icon}
                        </Avatar>
                        <Typography
                          variant="h4"
                          component="div"
                          color="primary"
                          fontWeight="bold"
                        >
                          {stat.value}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {stat.label}
                        </Typography>
                      </Box>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </motion.div>
          </Grid>

          {/* 이미지/비주얼 섹션 */}
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Box
                sx={{
                  position: 'relative',
                  height: '400px',
                  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(theme.palette.secondary.main, 0.1)})`,
                  borderRadius: 4,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 20,
                    left: 20,
                    right: -20,
                    bottom: -20,
                    background: alpha(theme.palette.primary.main, 0.05),
                    borderRadius: 4,
                    zIndex: -1,
                  }
                }}
              >
                <Typography
                  variant="h4"
                  color="primary"
                  sx={{ 
                    fontWeight: 'bold', 
                    textAlign: 'center',
                    opacity: 0.7 
                  }}
                >
                  About Image
                  <br />
                  Placeholder
                </Typography>
              </Box>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

export default AboutSection