// src/components/common/Footer.tsx
'use client'
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  Divider,
} from '@mui/material'
import FacebookIcon from '@mui/icons-material/Facebook'
import TwitterIcon from '@mui/icons-material/Twitter'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import InstagramIcon from '@mui/icons-material/Instagram'

/**
 * 푸터 컴포넌트
 */
const Footer = () => {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    company: [
      { label: '회사소개', href: '/about' },
      { label: '서비스', href: '/services' },
      { label: '포트폴리오', href: '/portfolio' },
      { label: '채용정보', href: '/careers' },
    ],
    support: [
      { label: '고객지원', href: '/support' },
      { label: 'FAQ', href: '/faq' },
      { label: '문의하기', href: '/contact' },
      { label: '온라인 상담', href: '/consultation' },
    ],
    legal: [
      { label: '개인정보처리방침', href: '/privacy' },
      { label: '이용약관', href: '/terms' },
      { label: '쿠키정책', href: '/cookies' },
      { label: '사이트맵', href: '/sitemap' },
    ],
  }

  const socialLinks = [
    { icon: <FacebookIcon />, href: '#', label: 'Facebook' },
    { icon: <TwitterIcon />, href: '#', label: 'Twitter' },
    { icon: <LinkedInIcon />, href: '#', label: 'LinkedIn' },
    { icon: <InstagramIcon />, href: '#', label: 'Instagram' },
  ]

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: 'grey.900',
        color: 'white',
        pt: 6,
        pb: 3,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* 회사 정보 */}
          <Grid item xs={12} md={4}>
            <Typography
              variant="h5"
              component="div"
              gutterBottom
              sx={{ fontWeight: 'bold', mb: 3 }}
            >
              Modern Business
            </Typography>
            <Typography
              variant="body2"
              color="grey.400"
              paragraph
              sx={{ mb: 3 }}
            >
              혁신적인 기술과 창의적인 아이디어로 고객의 성공을 함께 만들어가는
              디지털 솔루션 파트너입니다.
            </Typography>
            
            {/* 소셜 미디어 링크 */}
            <Box>
              {socialLinks.map((social, index) => (
                <IconButton
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  sx={{
                    color: 'grey.400',
                    mr: 1,
                    '&:hover': {
                      color: 'primary.main',
                      backgroundColor: 'rgba(25, 118, 210, 0.1)',
                    },
                  }}
                >
                  {social.icon}
                </IconButton>
              ))}
            </Box>
          </Grid>

          {/* 링크 섹션들 */}
          <Grid item xs={12} md={8}>
            <Grid container spacing={4}>
              <Grid item xs={12} sm={4}>
                <Typography
                  variant="h6"
                  component="h3"
                  gutterBottom
                  sx={{ mb: 2 }}
                >
                  회사
                </Typography>
                {footerLinks.company.map((link, index) => (
                  <Link
                    key={index}
                    href={link.href}
                    color="grey.400"
                    underline="hover"
                    display="block"
                    sx={{
                      mb: 1,
                      '&:hover': { color: 'primary.main' },
                      transition: 'color 0.3s ease',
                    }}
                  >
                    {link.label}
                  </Link>
                ))}
              </Grid>

              <Grid item xs={12} sm={4}>
                <Typography
                  variant="h6"
                  component="h3"
                  gutterBottom
                  sx={{ mb: 2 }}
                >
                  지원
                </Typography>
                {footerLinks.support.map((link, index) => (
                  <Link
                    key={index}
                    href={link.href}
                    color="grey.400"
                    underline="hover"
                    display="block"
                    sx={{
                      mb: 1,
                      '&:hover': { color: 'primary.main' },
                      transition: 'color 0.3s ease',
                    }}
                  >
                    {link.label}
                  </Link>
                ))}
              </Grid>

              <Grid item xs={12} sm={4}>
                <Typography
                  variant="h6"
                  component="h3"
                  gutterBottom
                  sx={{ mb: 2 }}
                >
                  법적고지
                </Typography>
                {footerLinks.legal.map((link, index) => (
                  <Link
                    key={index}
                    href={link.href}
                    color="grey.400"
                    underline="hover"
                    display="block"
                    sx={{
                      mb: 1,
                      '&:hover': { color: 'primary.main' },
                      transition: 'color 0.3s ease',
                    }}
                  >
                    {link.label}
                  </Link>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        {/* 구분선 */}
        <Divider sx={{ my: 4, backgroundColor: 'grey.800' }} />

        {/* 저작권 정보 */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Typography variant="body2" color="grey.500">
            © {currentYear} Modern Business. All rights reserved.
          </Typography>
          
          <Typography variant="body2" color="grey.500">
            사업자등록번호: 123-45-67890 | 대표: 홍길동
          </Typography>
        </Box>
      </Container>
    </Box>
  )
}

export default Footer