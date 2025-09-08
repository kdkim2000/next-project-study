// src/app/projects/page.tsx
// 분리된 데이터를 활용한 프로젝트 페이지

'use client'

import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  IconButton,
  Tabs,
  Tab,
  alpha,
  useTheme,
} from '@mui/material'
import { GitHub, Launch, Web, Code, Dashboard, Phone, Article, Chat } from '@mui/icons-material'
import { useState } from 'react'

// 분리된 데이터 import
import { 
  projects, 
  getProjectsByCategory, 
  getFeaturedProjects, 
  getProjectsByStatus 
} from '@/data/projects'

// 프로젝트 아이콘 매핑 함수
const getProjectIcon = (category: string, title: string) => {
  const iconProps = { fontSize: '3rem' as const, color: 'primary.main' as const }
  
  // 카테고리별 아이콘
  if (category === 'web') {
    if (title.toLowerCase().includes('ecommerce') || title.toLowerCase().includes('쇼핑')) {
      return <Web sx={iconProps} />
    }
    if (title.toLowerCase().includes('task') || title.toLowerCase().includes('할 일')) {
      return <Dashboard sx={iconProps} />
    }
    if (title.toLowerCase().includes('chat') || title.toLowerCase().includes('채팅')) {
      return <Chat sx={iconProps} />
    }
    if (title.toLowerCase().includes('blog') || title.toLowerCase().includes('블로그')) {
      return <Article sx={iconProps} />
    }
    return <Web sx={iconProps} />
  }
  
  if (category === 'mobile') {
    return <Phone sx={iconProps} />
  }
  
  if (category === 'desktop') {
    return <Code sx={iconProps} />
  }
  
  // 기본 아이콘
  return <Web sx={iconProps} />
}

// 상태별 색상 매핑
const getStatusColor = (status: string) => {
  switch (status) {
    case '완료':
      return 'success'
    case '진행중':
      return 'warning'
    case '계획중':
      return 'info'
    default:
      return 'default'
  }
}

export default function ProjectsPage() {
  const theme = useTheme()
  const [selectedTab, setSelectedTab] = useState(0)
  
  // 탭 옵션들
  const tabOptions = [
    { label: '전체', value: 'all' },
    { label: '추천', value: 'featured' },
    { label: '웹', value: 'web' },
    { label: '모바일', value: 'mobile' },
    { label: '완료', value: '완료' },
    { label: '진행중', value: '진행중' },
  ]

  // 선택된 탭에 따른 프로젝트 필터링
  const getFilteredProjects = () => {
    const selectedValue = tabOptions[selectedTab].value
    
    switch (selectedValue) {
      case 'all':
        return projects
      case 'featured':
        return getFeaturedProjects()
      case 'web':
      case 'mobile':
      case 'desktop':
        return getProjectsByCategory(selectedValue)
      case '완료':
      case '진행중':
      case '계획중':
        return getProjectsByStatus(selectedValue)
      default:
        return projects
    }
  }

  const filteredProjects = getFilteredProjects()

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue)
  }

  return (
    <Box>
      {/* 페이지 헤더 */}
      <Box
        sx={{
          pt: 12,
          pb: 6,
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            align="center"
            gutterBottom
            sx={{ fontWeight: 'bold', mb: 3 }}
          >
            프로젝트 포트폴리오
          </Typography>
          <Typography
            variant="h6"
            align="center"
            color="text.secondary"
            sx={{ maxWidth: '600px', mx: 'auto', lineHeight: 1.8 }}
          >
            다양한 기술을 활용하여 개발한 프로젝트들입니다. 
            웹 애플리케이션부터 모바일 앱까지 폭넓은 경험을 쌓고 있습니다.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 8 }}>
        {/* 프로젝트 필터 탭 */}
        <Box sx={{ mb: 6, display: 'flex', justifyContent: 'center' }}>
          <Tabs
            value={selectedTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              bgcolor: 'background.paper',
              borderRadius: 3,
              p: 1,
              boxShadow: 1,
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 500,
                minWidth: 'auto',
                px: 3,
                py: 1.5,
                borderRadius: 2,
                '&.Mui-selected': {
                  color: 'primary.main',
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                },
              },
              '& .MuiTabs-indicator': {
                display: 'none',
              },
            }}
          >
            {tabOptions.map((option, index) => (
              <Tab key={option.value} label={option.label} />
            ))}
          </Tabs>
        </Box>

        {/* 프로젝트 통계 */}
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Grid container spacing={3} justifyContent="center">
            <Grid item xs={6} sm={3}>
              <Typography variant="h4" fontWeight="bold" color="primary.main">
                {projects.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                전체 프로젝트
              </Typography>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Typography variant="h4" fontWeight="bold" color="success.main">
                {getProjectsByStatus('완료').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                완료된 프로젝트
              </Typography>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Typography variant="h4" fontWeight="bold" color="warning.main">
                {getProjectsByStatus('진행중').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                진행중인 프로젝트
              </Typography>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Typography variant="h4" fontWeight="bold" color="secondary.main">
                {getFeaturedProjects().length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                추천 프로젝트
              </Typography>
            </Grid>
          </Grid>
        </Box>

        {/* 프로젝트 그리드 */}
        <Grid container spacing={4}>
          {filteredProjects.map((project) => (
            <Grid item xs={12} md={6} key={project.id}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  border: '1px solid',
                  borderColor: 'divider',
                  '&:hover': {
                    borderColor: 'primary.main',
                    boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.12)}`,
                    transform: 'translateY(-4px)',
                  },
                  transition: 'all 0.3s ease-in-out',
                }}
              >
                {/* 프로젝트 아이콘 영역 */}
                <Box 
                  sx={{ 
                    p: 4, 
                    textAlign: 'center',
                    bgcolor: alpha(theme.palette.primary.main, 0.02),
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  {getProjectIcon(project.category, project.title)}
                </Box>

                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  {/* 프로젝트 제목과 상태 */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h6" fontWeight="bold" sx={{ flexGrow: 1 }}>
                      {project.title}
                    </Typography>
                    <Chip
                      label={project.status}
                      size="small"
                      color={getStatusColor(project.status) as any}
                      sx={{ ml: 1 }}
                    />
                  </Box>

                  {/* 프로젝트 설명 */}
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 3, lineHeight: 1.6 }}
                  >
                    {project.description}
                  </Typography>

                  {/* 상세 설명이 있는 경우 */}
                  {project.longDescription && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 3, lineHeight: 1.6, fontStyle: 'italic' }}
                    >
                      {project.longDescription}
                    </Typography>
                  )}

                  {/* 주요 기능들 */}
                  {project.features && project.features.length > 0 && (
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
                        주요 기능
                      </Typography>
                      <Box component="ul" sx={{ pl: 2, m: 0 }}>
                        {project.features.slice(0, 3).map((feature, index) => (
                          <Typography 
                            key={index}
                            component="li" 
                            variant="body2" 
                            color="text.secondary"
                            sx={{ mb: 0.5, fontSize: '0.875rem' }}
                          >
                            {feature}
                          </Typography>
                        ))}
                      </Box>
                    </Box>
                  )}

                  {/* 기술 스택 */}
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
                      기술 스택
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {project.technologies.map((tech) => (
                        <Chip
                          key={tech}
                          label={tech}
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: '0.75rem' }}
                        />
                      ))}
                    </Box>
                  </Box>

                  {/* 개발 중 도전 과제 */}
                  {project.challenges && project.challenges.length > 0 && (
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
                        주요 도전 과제
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {project.challenges.slice(0, 2).map((challenge, index) => (
                          <Chip
                            key={index}
                            label={challenge}
                            size="small"
                            color="warning"
                            variant="outlined"
                            sx={{ fontSize: '0.7rem' }}
                          />
                        ))}
                      </Box>
                    </Box>
                  )}

                  {/* 프로젝트 링크들 */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {project.github && (
                        <IconButton
                          size="small"
                          onClick={() => window.open(project.github, '_blank')}
                          sx={{
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            '&:hover': {
                              bgcolor: alpha(theme.palette.primary.main, 0.2),
                            },
                          }}
                        >
                          <GitHub fontSize="small" />
                        </IconButton>
                      )}
                      {project.demo && (
                        <IconButton
                          size="small"
                          onClick={() => window.open(project.demo, '_blank')}
                          sx={{
                            bgcolor: alpha(theme.palette.success.main, 0.1),
                            '&:hover': {
                              bgcolor: alpha(theme.palette.success.main, 0.2),
                            },
                          }}
                        >
                          <Launch fontSize="small" />
                        </IconButton>
                      )}
                    </Box>
                    
                    {/* 추천 프로젝트 표시 */}
                    {project.featured && (
                      <Chip
                        label="추천"
                        size="small"
                        color="secondary"
                        variant="filled"
                      />
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* 프로젝트가 없을 때 */}
        {filteredProjects.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              해당 조건에 맞는 프로젝트가 없습니다.
            </Typography>
            <Button
              variant="outlined"
              onClick={() => setSelectedTab(0)}
              sx={{ mt: 2 }}
            >
              전체 프로젝트 보기
            </Button>
          </Box>
        )}

        {/* 더 많은 프로젝트 섹션 */}
        <Box sx={{ textAlign: 'center', mt: 8 }}>
          <Typography variant="h6" gutterBottom>
            더 많은 프로젝트를 확인하세요
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            GitHub에서 더 많은 프로젝트와 소스코드를 확인할 수 있습니다.
          </Typography>
          <Button
            variant="outlined"
            href="https://github.com/johndoe"
            target="_blank"
            startIcon={<GitHub />}
            size="large"
          >
            GitHub에서 보기
          </Button>
        </Box>
      </Container>
    </Box>
  )
}