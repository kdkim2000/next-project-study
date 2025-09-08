// src/components/sections/Projects.tsx
// 최소화된 프로젝트 섹션 - 불필요한 요소 제거

'use client'

import Link from 'next/link'
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
} from '@mui/material'
import {
  GitHub,
  Launch,
  ArrowForward,
  Web,
  Code,
  Phone,
  Dashboard,
  Chat,
  Article,
} from '@mui/icons-material'
import { Project } from '@/types'

// Props 인터페이스
interface ProjectsProps {
  preview?: boolean
}

// 프로젝트 아이콘 매핑
const getProjectIcon = (type: string) => {
  const icons: { [key: string]: React.ReactNode } = {
    'ecommerce': <Web sx={{ fontSize: '3rem', color: 'primary.main' }} />,
    'taskmanager': <Dashboard sx={{ fontSize: '3rem', color: 'primary.main' }} />,
    'weather': <Phone sx={{ fontSize: '3rem', color: 'primary.main' }} />,
    'blog': <Article sx={{ fontSize: '3rem', color: 'primary.main' }} />,
    'portfolio': <Code sx={{ fontSize: '3rem', color: 'primary.main' }} />,
    'chat': <Chat sx={{ fontSize: '3rem', color: 'primary.main' }} />,
  }
  return icons[type] || <Web sx={{ fontSize: '3rem', color: 'primary.main' }} />
}

// 간단한 프로젝트 데이터
const projects: Project[] = [
  {
    id: '1',
    title: 'E-Commerce Platform',
    description: 'Next.js와 TypeScript로 구축한 온라인 쇼핑몰입니다.',
    image: 'ecommerce',
    technologies: ['Next.js', 'TypeScript', 'Tailwind CSS'],
    githubUrl: '#',
    liveUrl: '#',
    featured: true,
  },
  {
    id: '2',
    title: 'Task Management App',
    description: '팀 협업을 위한 칸반 보드 스타일의 업무 관리 앱입니다.',
    image: 'taskmanager',
    technologies: ['React', 'Node.js', 'MongoDB'],
    githubUrl: '#',
    liveUrl: '#',
    featured: true,
  },
  {
    id: '3',
    title: 'Weather Dashboard',
    description: '실시간 날씨 정보를 제공하는 반응형 대시보드입니다.',
    image: 'weather',
    technologies: ['React', 'API', 'Chart.js'],
    githubUrl: '#',
    featured: false,
  },
  {
    id: '4',
    title: 'Blog Platform',
    description: '마크다운 기반의 개인 블로그 플랫폼입니다.',
    image: 'blog',
    technologies: ['Next.js', 'MDX', 'Vercel'],
    githubUrl: '#',
    liveUrl: '#',
    featured: false,
  },
  {
    id: '5',
    title: 'Portfolio Website',
    description: '현재 보고 계신 포트폴리오 웹사이트입니다.',
    image: 'portfolio',
    technologies: ['Next.js', 'Material-UI', 'Framer Motion'],
    githubUrl: '#',
    liveUrl: '#',
    featured: true,
  },
  {
    id: '6',
    title: 'Chat Application',
    description: '실시간 채팅 애플리케이션입니다.',
    image: 'chat',
    technologies: ['React', 'Socket.io', 'Express'],
    githubUrl: '#',
    featured: false,
  },
]

export default function Projects({ preview = false }: ProjectsProps) {
  // 표시할 프로젝트 필터링
  const displayProjects = preview 
    ? projects.filter(p => p.featured).slice(0, 3)
    : projects

  return (
    <Box sx={{ py: { xs: 6, md: 10 } }}>
      <Container maxWidth="lg">
        {/* 헤더 */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            variant="h2"
            sx={{ mb: 2, fontWeight: 'bold', color: 'text.primary' }}
          >
            {preview ? 'Featured Projects' : 'All Projects'}
          </Typography>
          <Typography
            variant="h6"
            sx={{ color: 'text.secondary', maxWidth: '600px', mx: 'auto' }}
          >
            다양한 기술을 활용하여 개발한 프로젝트들입니다.
          </Typography>
        </Box>

        {/* 프로젝트 그리드 */}
        <Grid container spacing={4}>
          {displayProjects.map((project) => (
            <Grid item xs={12} md={preview ? 4 : 6} key={project.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                  '&:hover': {
                    borderColor: 'primary.main',
                    boxShadow: 3,
                    transform: 'translateY(-4px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                {/* 아이콘 영역 */}
                <Box
                  sx={{
                    height: 160,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'grey.50',
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  {getProjectIcon(project.image)}
                </Box>

                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  {/* 제목 */}
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                    {project.title}
                  </Typography>

                  {/* 설명 */}
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 3, lineHeight: 1.6 }}
                  >
                    {project.description}
                  </Typography>

                  {/* 기술 스택 */}
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {project.technologies.slice(0, 3).map((tech) => (
                        <Chip
                          key={tech}
                          label={tech}
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: '0.75rem' }}
                        />
                      ))}
                      {project.technologies.length > 3 && (
                        <Chip
                          label={`+${project.technologies.length - 3}`}
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: '0.75rem' }}
                        />
                      )}
                    </Box>
                  </Box>

                  {/* 버튼들 */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton
                        size="small"
                        onClick={() => window.open(project.githubUrl, '_blank')}
                      >
                        <GitHub fontSize="small" />
                      </IconButton>
                      {project.liveUrl && (
                        <IconButton
                          size="small"
                          onClick={() => window.open(project.liveUrl, '_blank')}
                        >
                          <Launch fontSize="small" />
                        </IconButton>
                      )}
                    </Box>
                    <Button size="small" color="primary">
                      자세히 보기
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* 더보기 버튼 */}
        {preview && (
          <Box sx={{ textAlign: 'center', mt: 6 }}>
            <Button
              component={Link}
              href="/projects"
              variant="contained"
              size="large"
              endIcon={<ArrowForward />}
              sx={{ px: 4, py: 1.5 }}
            >
              모든 프로젝트 보기
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  )
}