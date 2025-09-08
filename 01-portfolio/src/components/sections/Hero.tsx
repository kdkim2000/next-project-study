// src/components/sections/Hero.tsx
// 메인 페이지 히어로 섹션 - unused import 제거

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Avatar,
  Chip,
  useTheme,
  alpha,
} from '@mui/material'
import {
  Download,
  ArrowForward,
  GitHub,
  LinkedIn,
  Email,
} from '@mui/icons-material'
import { motion } from 'framer-motion'

// 애니메이션 variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
}

// 타이핑 효과를 위한 커스텀 훅
function useTypewriter(text: string, speed: number = 100) {
  const [displayText, setDisplayText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex])
        setCurrentIndex(prev => prev + 1)
      }, speed)

      return () => clearTimeout(timeout)
    }
  }, [currentIndex, text, speed])

  return displayText
}

export default function Hero() {
  const theme = useTheme()
  const typedText = useTypewriter('Frontend Developer', 150)

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
      }}
    >
      {/* 배경 패턴 (선택사항) */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          opacity: 0.1,
          backgroundImage: 'radial-gradient(circle at 20% 80%, currentColor 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          zIndex: 0,
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Grid container spacing={6} alignItems="center">
            {/* 텍스트 콘텐츠 */}
            <Grid item xs={12} md={7}>
              <motion.div variants={itemVariants}>
                {/* 인사말 */}
                <Chip
                  label="👋 안녕하세요!"
                  sx={{
                    mb: 3,
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    color: 'primary.main',
                    fontWeight: 500,
                  }}
                />

                {/* 이름 */}
                <Typography
                  variant="h1"
                  sx={{
                    mb: 2,
                    fontWeight: 'bold',
                    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                  }}
                >
                  John Doe
                </Typography>

                {/* 직책 (타이핑 효과) */}
                <Typography
                  variant="h3"
                  sx={{
                    mb: 3,
                    color: 'text.secondary',
                    fontSize: { xs: '1.5rem', md: '2rem' },
                    minHeight: '2.5rem',
                  }}
                >
                  {typedText}
                  <Box
                    component="span"
                    sx={{
                      display: 'inline-block',
                      width: '2px',
                      height: '1.2em',
                      bgcolor: 'primary.main',
                      ml: 1,
                      animation: 'blink 1s infinite',
                      '@keyframes blink': {
                        '0%, 50%': { opacity: 1 },
                        '51%, 100%': { opacity: 0 },
                      },
                    }}
                  />
                </Typography>

                {/* 간단한 소개 */}
                <Typography
                  variant="h6"
                  sx={{
                    mb: 4,
                    color: 'text.secondary',
                    lineHeight: 1.8,
                    fontWeight: 400,
                  }}
                >
                  사용자 경험을 중시하는 프론트엔드 개발자로, 
                  React와 Next.js를 활용하여 현대적이고 반응형인 
                  웹 애플리케이션을 개발합니다.
                </Typography>

                {/* 액션 버튼들 */}
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 4 }}>
                  <Button
                    component={Link}
                    href="/projects"
                    variant="contained"
                    size="large"
                    endIcon={<ArrowForward />}
                    sx={{
                      px: 3,
                      py: 1.5,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontSize: '1.1rem',
                      fontWeight: 600,
                    }}
                  >
                    프로젝트 보기
                  </Button>

                  <Button
                    variant="outlined"
                    size="large"
                    startIcon={<Download />}
                    sx={{
                      px: 3,
                      py: 1.5,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontSize: '1.1rem',
                      fontWeight: 600,
                    }}
                    onClick={() => {
                      // 이력서 다운로드 기능 (추후 구현)
                      console.log('이력서 다운로드')
                    }}
                  >
                    이력서 다운로드
                  </Button>
                </Box>

                {/* 소셜 링크 */}
                <Box sx={{ display: 'flex', gap: 2 }}>
                  {[
                    { icon: <GitHub />, url: 'https://github.com', label: 'GitHub' },
                    { icon: <LinkedIn />, url: 'https://linkedin.com', label: 'LinkedIn' },
                    { icon: <Email />, url: 'mailto:john@example.com', label: 'Email' },
                  ].map((social) => (
                    <Button
                      key={social.label}
                      component="a"
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="text"
                      sx={{
                        minWidth: 'auto',
                        p: 1.5,
                        borderRadius: 2,
                        color: 'text.secondary',
                        '&:hover': {
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                          color: 'primary.main',
                          transform: 'translateY(-2px)',
                        },
                        transition: 'all 0.2s ease-in-out',
                      }}
                      aria-label={social.label}
                    >
                      {social.icon}
                    </Button>
                  ))}
                </Box>
              </motion.div>
            </Grid>

            {/* 프로필 이미지 */}
            <Grid item xs={12} md={5}>
              <motion.div
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 300, damping: 10 }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    position: 'relative',
                  }}
                >
                  {/* 배경 원 */}
                  <Box
                    sx={{
                      width: { xs: 280, md: 350 },
                      height: { xs: 280, md: 350 },
                      borderRadius: '50%',
                      background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.2)}, ${alpha(theme.palette.secondary.main, 0.2)})`,
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
                        borderRadius: '50%',
                        background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                        opacity: 0.1,
                        zIndex: -1,
                      },
                    }}
                  >
                    {/* 프로필 이미지 - 실제 이미지 파일이 없는 경우 Avatar 사용 */}
                    <Avatar
                      sx={{
                        width: { xs: 250, md: 300 },
                        height: { xs: 250, md: 300 },
                        fontSize: '4rem',
                        bgcolor: 'primary.main',
                        color: 'white',
                      }}
                    >
                      JD
                    </Avatar>
                  </Box>
                </Box>
              </motion.div>
            </Grid>
          </Grid>
        </motion.div>
      </Container>
    </Box>
  )
}