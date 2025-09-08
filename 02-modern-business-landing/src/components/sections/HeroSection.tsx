// src/components/sections/HeroSection.tsx
'use client'
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Grid, 
  useTheme,
  alpha 
} from '@mui/material'
import { motion } from 'framer-motion'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'

/**
 * 메인 히어로 섹션 컴포넌트 (Client Component)
 * 애니메이션과 인터랙션이 포함된 메인 화면
 */
const HeroSection = () => {
  const theme = useTheme()

  // 애니메이션 설정
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: "easeOut" }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* 배경 장식 요소 */}
      <Box
        sx={{
          position: 'absolute',
          top: '10%',
          right: '10%',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: `linear-gradient(45deg, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(theme.palette.secondary.main, 0.1)})`,
          zIndex: 0,
        }}
      />
      
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            {/* 메인 헤딩 */}
            <motion.div {...fadeInUp}>
              <Typography
                variant="h1"
                component="h1"
                gutterBottom
                sx={{
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 3,
                }}
              >
                혁신적인
                <br />
                비즈니스 솔루션
              </Typography>
            </motion.div>

            {/* 서브 텍스트 */}
            <motion.div 
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Typography
                variant="h5"
                color="text.secondary"
                paragraph
                sx={{ mb: 4, lineHeight: 1.6 }}
              >
                현대적이고 효율적인 솔루션으로 귀하의 비즈니스를 한 단계 더 발전시켜보세요. 
                전문적인 팀과 함께 성공적인 디지털 전환을 경험하실 수 있습니다.
              </Typography>
            </motion.div>

            {/* CTA 버튼들 */}
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    px: 4,
                    py: 2,
                    fontSize: '1.1rem',
                    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                    '&:hover': {
                      background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                      transform: 'translateY(-2px)',
                      boxShadow: theme.shadows[8],
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  시작하기
                </Button>
                
                <Button
                  variant="outlined"
                  size="large"
                  sx={{
                    px: 4,
                    py: 2,
                    fontSize: '1.1rem',
                    borderWidth: 2,
                    '&:hover': {
                      borderWidth: 2,
                      transform: 'translateY(-2px)',
                      boxShadow: theme.shadows[4],
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  더 알아보기
                </Button>
              </Box>
            </motion.div>
          </Grid>

          {/* 우측 이미지/일러스트레이션 영역 */}
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              <Box
                sx={{
                  width: '100%',
                  height: '400px',
                  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.2)}, ${alpha(theme.palette.secondary.main, 0.2)})`,
                  borderRadius: 4,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: -10,
                    left: -10,
                    right: -10,
                    bottom: -10,
                    background: `linear-gradient(45deg, ${alpha(theme.palette.primary.main, 0.1)}, transparent, ${alpha(theme.palette.secondary.main, 0.1)})`,
                    borderRadius: 4,
                    zIndex: -1,
                  }
                }}
              >
                <Typography
                  variant="h3"
                  color="primary"
                  sx={{ fontWeight: 'bold', textAlign: 'center' }}
                >
                  Your Logo
                  <br />
                  Here
                </Typography>
              </Box>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

export default HeroSection