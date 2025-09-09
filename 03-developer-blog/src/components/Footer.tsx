// src/components/Footer.tsx - 사이트 하단 푸터 컴포넌트

'use client';

import React from 'react';
import {
  Box,
  Container,
  Typography,
  Link as MuiLink,
  Grid,
  IconButton,
  Divider,
  useTheme,
} from '@mui/material';
import {
  GitHub as GitHubIcon,
  LinkedIn as LinkedInIcon,
  Twitter as TwitterIcon,
  Email as EmailIcon,
  RssFeed as RssIcon,
} from '@mui/icons-material';
import Link from 'next/link';

/**
 * 소셜 미디어 링크 정보 타입
 */
interface SocialLink {
  name: string;
  url: string;
  icon: React.ReactNode;
  color: string;
}

/**
 * 푸터 링크 섹션 타입
 */
interface FooterSection {
  title: string;
  links: {
    label: string;
    href: string;
  }[];
}

/**
 * 푸터 컴포넌트
 * 사이트 하단에 저작권 정보, 소셜 링크, 사이트맵 등을 제공
 */
const Footer: React.FC = () => {
  const theme = useTheme();
  const currentYear = new Date().getFullYear();

  // 소셜 미디어 링크들 (실제 사용 시 URL 수정 필요)
  const socialLinks: SocialLink[] = [
    {
      name: 'GitHub',
      url: 'https://github.com/yourusername',
      icon: <GitHubIcon />,
      color: '#333333',
    },
    {
      name: 'LinkedIn',
      url: 'https://linkedin.com/in/yourusername',
      icon: <LinkedInIcon />,
      color: '#0077B5',
    },
    {
      name: 'Twitter',
      url: 'https://twitter.com/yourusername',
      icon: <TwitterIcon />,
      color: '#1DA1F2',
    },
    {
      name: 'Email',
      url: 'mailto:your.email@example.com',
      icon: <EmailIcon />,
      color: '#EA4335',
    },
    {
      name: 'RSS',
      url: '/rss.xml',
      icon: <RssIcon />,
      color: '#FF6600',
    },
  ];

  // 푸터 링크 섹션들
  const footerSections: FooterSection[] = [
    {
      title: '블로그',
      links: [
        { label: '최신 포스트', href: '/posts' },
        { label: '인기 포스트', href: '/posts?featured=true' },
        { label: '카테고리', href: '/categories' },
        { label: '태그', href: '/tags' },
      ],
    },
    {
      title: '정보',
      links: [
        { label: '블로그 소개', href: '/about' },
        { label: '연락처', href: '/contact' },
        { label: '개인정보처리방침', href: '/privacy' },
        { label: '이용약관', href: '/terms' },
      ],
    },
    {
      title: '기술',
      links: [
        { label: 'React', href: '/categories/react' },
        { label: 'Next.js', href: '/categories/nextjs' },
        { label: 'TypeScript', href: '/categories/typescript' },
        { label: 'JavaScript', href: '/categories/javascript' },
      ],
    },
  ];

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: theme.palette.background.paper,
        borderTop: `1px solid ${theme.palette.divider}`,
        mt: 'auto',
        py: 6,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* 블로그 정보 섹션 */}
          <Grid item xs={12} md={4}>
            <Typography
              variant="h6"
              component="h3"
              gutterBottom
              sx={{
                fontWeight: 700,
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Developer&apos;s Blog
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 3, lineHeight: 1.8 }}
            >
              개발자를 위한 최신 기술 트렌드와 실무 경험을 공유하는 기술 블로그입니다. 
              React, Next.js, TypeScript 등 프론트엔드 개발에 대한 
              유용한 정보를 제공합니다.
            </Typography>

            {/* 소셜 미디어 링크들 */}
            <Box sx={{ display: 'flex', gap: 1 }}>
              {socialLinks.map((social) => (
                <IconButton
                  key={social.name}
                  component="a"
                  href={social.url}
                  target={social.name !== 'Email' && social.name !== 'RSS' ? '_blank' : undefined}
                  rel={social.name !== 'Email' && social.name !== 'RSS' ? 'noopener noreferrer' : undefined}
                  aria-label={`${social.name} 페이지로 이동`}
                  sx={{
                    color: theme.palette.text.secondary,
                    '&:hover': {
                      color: social.color,
                      bgcolor: theme.palette.action.hover,
                    },
                    transition: 'all 0.2s ease-in-out',
                  }}
                >
                  {social.icon}
                </IconButton>
              ))}
            </Box>
          </Grid>

          {/* 링크 섹션들 */}
          {footerSections.map((section) => (
            <Grid item xs={12} sm={6} md={2.67} key={section.title}>
              <Typography
                variant="h6"
                component="h3"
                gutterBottom
                sx={{ fontSize: '1.1rem', fontWeight: 600 }}
              >
                {section.title}
              </Typography>
              <Box component="nav">
                {section.links.map((link) => (
                  <MuiLink
                    key={link.href}
                    component={Link}
                    href={link.href}
                    color="text.secondary"
                    sx={{
                      display: 'block',
                      py: 0.5,
                      textDecoration: 'none',
                      fontSize: '0.875rem',
                      '&:hover': {
                        color: theme.palette.primary.main,
                        textDecoration: 'underline',
                      },
                      transition: 'color 0.2s ease-in-out',
                    }}
                  >
                    {link.label}
                  </MuiLink>
                ))}
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* 구분선 */}
        <Divider sx={{ my: 4 }} />

        {/* 저작권 정보 */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'center', sm: 'flex-start' },
            gap: 2,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © {currentYear} Developer&apos;s Blog. All rights reserved.
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <MuiLink
              component={Link}
              href="/sitemap.xml"
              color="text.secondary"
              sx={{
                textDecoration: 'none',
                fontSize: '0.875rem',
                '&:hover': {
                  color: theme.palette.primary.main,
                  textDecoration: 'underline',
                },
              }}
            >
              사이트맵
            </MuiLink>
            <MuiLink
              component={Link}
              href="/rss.xml"
              color="text.secondary"
              sx={{
                textDecoration: 'none',
                fontSize: '0.875rem',
                '&:hover': {
                  color: theme.palette.primary.main,
                  textDecoration: 'underline',
                },
              }}
            >
              RSS 피드
            </MuiLink>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;