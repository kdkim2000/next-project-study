// src/app/page.tsx
// 데이터가 분리된 깔끔한 홈페이지

'use client'

import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Avatar,
  Card,
  CardContent,
  Chip,
} from '@mui/material'
import { GitHub, LinkedIn, Email, ArrowForward } from '@mui/icons-material'
import Link from 'next/link'

// 데이터 import (관리하기 쉬움!)
import { personalInfo } from '@/data/personal'
import { mainSkills } from '@/data/skills'
import { getFeaturedProjects } from '@/data/projects'

export default function HomePage() {
  // 데이터 가져오기
  const featuredProjects = getFeaturedProjects().slice(0, 3) // 상위 3개만

  return (
    <Box>
      {/* 히어로 섹션 */}
      <Box sx={{ py: 12, textAlign: 'center', bgcolor: 'background.default' }}>
        <Container maxWidth="md">
          <Avatar
            sx={{
              width: 120,
              height: 120,
              mx: 'auto',
              mb: 4,
              fontSize: '3rem',
              bgcolor: 'primary.main',
            }}
          >
            {personalInfo.name.split(' ').map(n => n[0]).join('')}
          </Avatar>
          
          <Typography variant="h2" gutterBottom fontWeight="bold">
            안녕하세요! {personalInfo.koreanName || personalInfo.name}입니다
          </Typography>
          
          <Typography variant="h5" color="text.secondary" sx={{ mb: 4 }}>
            {personalInfo.title}
          </Typography>
          
          <Typography variant="body1" sx={{ mb: 4, fontSize: '1.1rem' }}>
            {personalInfo.shortIntro}
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mb: 4 }}>
            <Button
              component={Link}
              href="/projects"
              variant="contained"
              size="large"
              endIcon={<ArrowForward />}
            >
              프로젝트 보기
            </Button>
            <Button
              component={Link}
              href="/contact"
              variant="outlined"
              size="large"
            >
              연락하기
            </Button>
          </Box>
          
          {/* 소셜 링크 (데이터에서 가져옴) */}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              href={personalInfo.social.github}
              target="_blank"
              startIcon={<GitHub />}
              sx={{ textTransform: 'none' }}
            >
              GitHub
            </Button>
            <Button
              href={personalInfo.social.linkedin}
              target="_blank"
              startIcon={<LinkedIn />}
              sx={{ textTransform: 'none' }}
            >
              LinkedIn
            </Button>
            <Button
              href={personalInfo.social.email}
              startIcon={<Email />}
              sx={{ textTransform: 'none' }}
            >
              Email
            </Button>
          </Box>
        </Container>
      </Box>

      {/* 기술 스택 섹션 (데이터에서 가져옴) */}
      <Box sx={{ py: 8, bgcolor: 'grey.50' }}>
        <Container maxWidth="lg">
          <Typography variant="h3" align="center" gutterBottom fontWeight="bold">
            기술 스택
          </Typography>
          
          <Grid container spacing={4} sx={{ mt: 2 }}>
            {mainSkills.map((skill) => (
              <Grid item xs={12} sm={6} md={4} key={skill.name}>
                <Card>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" gutterBottom>
                      {skill.name}
                    </Typography>
                    <Chip 
                      label={skill.level} 
                      color={skill.color}
                      variant="outlined"
                      sx={{ mb: 1 }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {skill.experience} 경험
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* 간단한 소개 */}
      <Box sx={{ py: 8 }}>
        <Container maxWidth="md">
          <Card sx={{ p: 4 }}>
            <Typography variant="h4" gutterBottom align="center">
              About Me
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.8, textAlign: 'center' }}>
              {personalInfo.longIntro}
            </Typography>
            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Button
                component={Link}
                href="/about"
                variant="contained"
                color="primary"
              >
                더 자세히 보기
              </Button>
            </Box>
          </Card>
        </Container>
      </Box>

      {/* 주요 프로젝트 (데이터에서 가져옴) */}
      <Box sx={{ py: 8, bgcolor: 'grey.50' }}>
        <Container maxWidth="lg">
          <Typography variant="h3" align="center" gutterBottom fontWeight="bold">
            주요 프로젝트
          </Typography>
          
          <Grid container spacing={4} sx={{ mt: 2 }}>
            {featuredProjects.map((project) => (
              <Grid item xs={12} md={4} key={project.id}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom fontWeight="bold">
                      {project.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {project.description}
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      {project.technologies.slice(0, 3).map((tech) => (
                        <Chip 
                          key={tech} 
                          label={tech} 
                          size="small" 
                          sx={{ mr: 1, mb: 1 }} 
                          variant="outlined"
                        />
                      ))}
                    </Box>
                    <Chip 
                      label={project.status} 
                      size="small"
                      color={project.status === '완료' ? 'success' : 'warning'}
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Button
              component={Link}
              href="/projects"
              variant="outlined"
              size="large"
            >
              모든 프로젝트 보기
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  )
}