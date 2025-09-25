// src/components/HeroSection.tsx
// 🦸 히어로 섹션 - Framer Motion 애니메이션과 현대적 디자인

'use client';

import { Box, Container, Typography, Button, Stack, Chip } from '@mui/material';
import { 
  ArrowForward as ArrowForwardIcon, 
  PlayArrow as PlayArrowIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  heroVariants, 
  heroTextVariants, 
  heroButtonVariants,
  fadeInUp 
} from '@/lib/animations';

// 🏷️ Props 타입 정의
interface HeroSectionProps {
  companyInfo: {
    name: string;
    tagline: string;
    description: string;
    established?: number;
    projects?: number;
    clients?: number;
  };
}

// 🌟 히어로 섹션 컴포넌트
export default function HeroSection({ companyInfo }: HeroSectionProps) {
  return (
    <motion.div
      variants={heroVariants}
      initial="hidden"
      animate="visible"
    >
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          position: 'relative',
          minHeight: { xs: '80vh', md: '90vh' },
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.3)',
            zIndex: 1,
          },
        }}
      >
        {/* 배경 패턴 */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.1,
            backgroundImage: `
              radial-gradient(circle at 25px 25px, rgba(255,255,255,0.3) 2px, transparent 0),
              radial-gradient(circle at 75px 75px, rgba(255,255,255,0.2) 2px, transparent 0)
            `,
            backgroundSize: '100px 100px',
            zIndex: 1,
          }}
        />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Box
            sx={{
              textAlign: { xs: 'center', md: 'left' },
              color: 'white',
              maxWidth: { xs: '100%', md: '60%' },
            }}
          >
            {/* 회사 설립년도 뱃지 */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.1 }}
            >
              <Chip
                icon={<TrendingUpIcon />}
                label={`Since ${companyInfo.established || 2020}`}
                variant="outlined"
                sx={{
                  color: 'white',
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                  mb: 3,
                  '& .MuiChip-icon': { color: 'white' },
                }}
              />
            </motion.div>

            {/* 메인 타이틀 */}
            <motion.div
              variants={heroTextVariants}
              initial="hidden"
              animate="visible"
            >
              <Typography
                variant="h1"
                component="h1"
                sx={{
                  fontSize: { xs: '2.5rem', sm: '3rem', md: '4rem' },
                  fontWeight: 800,
                  lineHeight: 1.1,
                  mb: 3,
                  background: 'linear-gradient(45deg, #fff 30%, #f0f0f0 90%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: '0 4px 20px rgba(0,0,0,0.3)',
                }}
              >
                {companyInfo.tagline}
              </Typography>
            </motion.div>
            
            {/* 서브 타이틀 */}
            <motion.div
              variants={heroTextVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.3 }}
            >
              <Typography
                variant="h5"
                component="p"
                sx={{
                  fontSize: { xs: '1.1rem', md: '1.4rem' },
                  fontWeight: 400,
                  lineHeight: 1.5,
                  mb: 4,
                  opacity: 0.95,
                  maxWidth: '600px',
                  mx: { xs: 'auto', md: 0 },
                }}
              >
                {companyInfo.description}
              </Typography>
            </motion.div>

            {/* 통계 정보 */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.4 }}
            >
              <Stack
                direction="row"
                spacing={4}
                justifyContent={{ xs: 'center', md: 'flex-start' }}
                sx={{ mb: 4 }}
              >
                {companyInfo.projects && (
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" fontWeight={700}>
                      {companyInfo.projects}+
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      완료된 프로젝트
                    </Typography>
                  </Box>
                )}
                {companyInfo.clients && (
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" fontWeight={700}>
                      {companyInfo.clients}+
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      만족한 고객
                    </Typography>
                  </Box>
                )}
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" fontWeight={700}>
                    4.9
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    평균 만족도
                  </Typography>
                </Box>
              </Stack>
            </motion.div>
            
            {/* 액션 버튼들 */}
            <motion.div
              variants={heroButtonVariants}
              initial="hidden"
              animate="visible"
            >
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                alignItems="center"
                justifyContent={{ xs: 'center', md: 'flex-start' }}
              >
                <Button
                  component={Link}
                  href="/services"
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    bgcolor: 'white',
                    color: 'primary.main',
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    textTransform: 'none',
                    borderRadius: 3,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                    '&:hover': {
                      bgcolor: 'grey.50',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 12px 40px rgba(0,0,0,0.4)',
                    },
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                >
                  서비스 둘러보기
                </Button>
                
                <Button
                  component={Link}
                  href="/contact"
                  variant="outlined"
                  size="large"
                  startIcon={<PlayArrowIcon />}
                  sx={{
                    borderColor: 'rgba(255, 255, 255, 0.7)',
                    color: 'white',
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 500,
                    textTransform: 'none',
                    borderRadius: 3,
                    borderWidth: 2,
                    '&:hover': {
                      borderColor: 'white',
                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                      transform: 'translateY(-2px)',
                      borderWidth: 2,
                    },
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                >
                  무료 상담받기
                </Button>
              </Stack>
            </motion.div>

            {/* 신뢰도 지표 */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.6 }}
            >
              <Box sx={{ mt: 6 }}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    opacity: 0.8, 
                    mb: 2,
                    textAlign: { xs: 'center', md: 'left' }
                  }}
                >
                  신뢰할 수 있는 파트너들
                </Typography>
                <Stack
                  direction="row"
                  spacing={3}
                  alignItems="center"
                  justifyContent={{ xs: 'center', md: 'flex-start' }}
                  sx={{ opacity: 0.7 }}
                >
                  {/* 실제로는 회사 로고 이미지들이 들어갑니다 */}
                  <Box sx={{ fontSize: '2rem' }}>🏢</Box>
                  <Box sx={{ fontSize: '2rem' }}>🏭</Box>
                  <Box sx={{ fontSize: '2rem' }}>🏪</Box>
                  <Box sx={{ fontSize: '2rem' }}>🏛️</Box>
                  <Typography variant="body2">+50개 기업</Typography>
                </Stack>
              </Box>
            </motion.div>
          </Box>
        </Container>

        {/* 스크롤 다운 인디케이터 */}
        <motion.div
          animate={{
            y: [0, 10, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            position: 'absolute',
            bottom: '2rem',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 2,
            color: 'white',
            opacity: 0.7,
          }}
        >
          <Box
            sx={{
              width: 2,
              height: 32,
              bgcolor: 'white',
              borderRadius: 1,
              mx: 'auto',
              mb: 1,
            }}
          />
          <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>
            SCROLL
          </Typography>
        </motion.div>
      </Box>
    </motion.div>
  );
}

/* 
📚 학습 노트: 향상된 히어로 섹션

1. 🎬 고급 애니메이션:
   - 순차적 요소 등장 (stagger)
   - 부드러운 텍스트 그라데이션
   - 무한 스크롤 인디케이터
   - 호버 시 3D 변환 효과

2. 🎨 현대적 디자인:
   - 그라데이션 배경 + 패턴 오버레이
   - 글래스모피즘 효과
   - 고급 그림자와 블러
   - 반응형 타이포그래피

3. 📊 비즈니스 요소:
   - 회사 신뢰도 지표
   - 실적 통계 표시
   - 명확한 CTA 버튼
   - 브랜드 파트너 표시

4. 📱 반응형 최적화:
   - 모바일/데스크톱 다른 레이아웃
   - 적응형 폰트 크기
   - 터치 친화적 버튼 크기
   - 최적화된 간격

5. ⚡ 성능 고려사항:
   - GPU 가속 애니메이션
   - 최적화된 CSS 속성
   - 불필요한 리플로우 방지
   - 메모리 효율적 구현
*/
