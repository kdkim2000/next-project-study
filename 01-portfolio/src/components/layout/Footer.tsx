// src/components/layout/Footer.tsx
// 하단 푸터 컴포넌트

'use client'

import Link from 'next/link'
import {
  Box,
  Container,
  Typography,
  Grid,
  IconButton,
  Divider,
  useTheme,
  alpha,
} from '@mui/material'
import {
  GitHub,
  LinkedIn,
  Twitter,
  Email,
  Phone,
  LocationOn,
  Favorite,
} from '@mui/icons-material'

export default function Footer() {
  const theme = useTheme()
  const currentYear = new Date().getFullYear()

  // 네비게이션 링크들
  const navLinks = [
    { name: '홈', href: '/' },
    { name: '소개', href: '/about' },
    { name: '프로젝트', href: '/projects' },
    { name: '연락처', href: '/contact' },
  ]

  // 소셜 미디어 링크들
  const socialLinks = [
    {
      name: 'GitHub',
      icon: <GitHub />,
      url: 'https://github.com/johndoe',
      color: '#333',
    },
    {
      name: 'LinkedIn',
      icon: <LinkedIn />,
      url: 'https://linkedin.com/in/johndoe',
      color: '#0077B5',
    },
    {
      name: 'Twitter',
      icon: <Twitter />,
      url: 'https://twitter.com/johndoe',
      color: '#1DA1F2',
    },
    {
      name: 'Email',
      icon: <Email />,
      url: 'mailto:john@example.com',
      color: '#EA4335',
    },
  ]

  // 연락처 정보
  const contactInfo = [
    {
      icon: <Email />,
      text: 'john@example.com',
      link: 'mailto:john@example.com',
    },
    {
      icon: <Phone />,
      text: '+82 10-1234-5678',
      link: 'tel:+821012345678',
    },
    {
      icon: <LocationOn />,
      text: '서울특별시, 대한민국',
    },
  ]

  return (
    <Box
      component="footer"
      sx={{
        mt: 'auto',
        bgcolor: 'background.paper',
        borderTop: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Container maxWidth="lg">
        {/* 메인 푸터 콘텐츠 */}
        <Box sx={{ py: 6 }}>
          <Grid container spacing={4}>
            {/* 브랜드 및 소개 */}
            <Grid item xs={12} md={4}>
              <Typography
                variant="h5"
                sx={{
                  mb: 2,
                  fontWeight: 'bold',
                  color: 'primary.main',
                }}
              >
                John Doe
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  mb: 3,
                  color: 'text.secondary',
                  lineHeight: 1.7,
                }}
              >
                열정적인 프론트엔드 개발자로서 사용자 중심의 웹 애플리케이션을 
                개발하고 있습니다. 새로운 기술을 학습하고 적용하는 것을 좋아합니다.
              </Typography>

              {/* 소셜 미디어 링크 */}
              <Box sx={{ display: 'flex', gap: 1 }}>
                {socialLinks.map((social) => (
                  <IconButton
                    key={social.name}
                    component="a"
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      color: 'text.secondary',
                      '&:hover': {
                        bgcolor: alpha(social.color || theme.palette.primary.main, 0.1),
                        color: social.color || 'primary.main',
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.2s ease-in-out',
                    }}
                    aria-label={`${social.name} 프로필 방문`}
                  >
                    {social.icon}
                  </IconButton>
                ))}
              </Box>
            </Grid>

            {/* 네비게이션 링크 */}
            <Grid item xs={12} sm={6} md={2}>
              <Typography
                variant="h6"
                sx={{
                  mb: 3,
                  fontWeight: 'bold',
                  color: 'text.primary',
                }}
              >
                네비게이션
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    style={{
                      textDecoration: 'none',
                      color: theme.palette.text.secondary,
                      fontSize: '0.875rem',
                      transition: 'color 0.2s ease-in-out',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = theme.palette.primary.main
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = theme.palette.text.secondary
                    }}
                  >
                    {link.name}
                  </Link>
                ))}
              </Box>
            </Grid>

            {/* 기술 스택 */}
            <Grid item xs={12} sm={6} md={3}>
              <Typography
                variant="h6"
                sx={{
                  mb: 3,
                  fontWeight: 'bold',
                  color: 'text.primary',
                }}
              >
                주요 기술
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {['React', 'Next.js', 'TypeScript', 'Material-UI', 'Node.js'].map((tech) => (
                  <Typography
                    key={tech}
                    variant="body2"
                    sx={{
                      color: 'text.secondary',
                      fontSize: '0.875rem',
                      '&:hover': {
                        color: 'primary.main',
                      },
                      transition: 'color 0.2s ease-in-out',
                      cursor: 'default',
                    }}
                  >
                    {tech}
                  </Typography>
                ))}
              </Box>
            </Grid>

            {/* 연락처 정보 */}
            <Grid item xs={12} md={3}>
              <Typography
                variant="h6"
                sx={{
                  mb: 3,
                  fontWeight: 'bold',
                  color: 'text.primary',
                }}
              >
                연락처
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {contactInfo.map((contact, index) => (
                  <Box
                    key={index}
                    sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}
                  >
                    <Box
                      sx={{
                        color: 'primary.main',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      {contact.icon}
                    </Box>
                    {contact.link ? (
                      <Typography
                        component="a"
                        href={contact.link}
                        variant="body2"
                        sx={{
                          color: 'text.secondary',
                          textDecoration: 'none',
                          fontSize: '0.875rem',
                          '&:hover': {
                            color: 'primary.main',
                            textDecoration: 'underline',
                          },
                          transition: 'color 0.2s ease-in-out',
                        }}
                      >
                        {contact.text}
                      </Typography>
                    ) : (
                      <Typography
                        variant="body2"
                        sx={{
                          color: 'text.secondary',
                          fontSize: '0.875rem',
                        }}
                      >
                        {contact.text}
                      </Typography>
                    )}
                  </Box>
                ))}
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* 푸터 하단 */}
        <Divider />
        <Box
          sx={{
            py: 3,
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
            }}
          >
            © {currentYear} John Doe. Made with{' '}
            <Favorite sx={{ fontSize: 16, color: 'error.main' }} /> and Next.js
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              fontSize: '0.75rem',
            }}
          >
            Built with Next.js, TypeScript & Material-UI
          </Typography>
        </Box>
      </Container>
    </Box>
  )
}