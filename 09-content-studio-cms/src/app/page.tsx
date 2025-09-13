// src/app/page.tsx
// 홈페이지 - Content Studio CMS의 메인 랜딩 페이지

'use client';

import React from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Article as ArticleIcon,
  Speed as SpeedIcon,
  Security as SecurityIcon,
  Language as LanguageIcon,
  Backup as BackupIcon,
  Check as CheckIcon,
  ArrowForward as ArrowForwardIcon,
  Edit as EditIcon,
  Image as ImageIcon
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// 홈페이지용 테마 설정
const homeTheme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#fafafa',
    },
  },
  typography: {
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
  },
});

/**
 * 기능 카드 컴포넌트
 */
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  status: 'implemented' | 'planned';
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, status }) => (
  <Card sx={{ height: '100%', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-2px)' } }}>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Box sx={{ mr: 2, color: 'primary.main' }}>
          {icon}
        </Box>
        <Box>
          <Typography variant="h6" gutterBottom>
            {title}
          </Typography>
          <Chip
            label={status === 'implemented' ? '구현완료' : '계획중'}
            color={status === 'implemented' ? 'success' : 'warning'}
            size="small"
            variant="outlined"
          />
        </Box>
      </Box>
      <Typography variant="body2" color="text.secondary">
        {description}
      </Typography>
    </CardContent>
  </Card>
);

/**
 * 홈페이지 컴포넌트
 */
const HomePage = () => {
  const router = useRouter();

  // 주요 기능 목록
  const features = [
    {
      icon: <EditIcon fontSize="large" />,
      title: 'WYSIWYG 에디터',
      description: 'React Quill 기반의 직관적인 리치 텍스트 에디터로 콘텐츠를 쉽게 작성하고 편집할 수 있습니다.',
      status: 'implemented' as const,
    },
    {
      icon: <ImageIcon fontSize="large" />,
      title: '미디어 관리',
      description: '이미지와 파일을 드래그앤드롭으로 업로드하고 체계적으로 관리할 수 있는 미디어 라이브러리를 제공합니다.',
      status: 'implemented' as const,
    },
    {
      icon: <DashboardIcon fontSize="large" />,
      title: '관리자 대시보드',
      description: '콘텐츠 현황을 한눈에 파악할 수 있는 직관적인 관리자 대시보드를 제공합니다.',
      status: 'implemented' as const,
    },
    {
      icon: <LanguageIcon fontSize="large" />,
      title: '다국어 지원',
      description: '한국어, 영어, 일본어를 지원하는 다국어 콘텐츠 관리 기능을 제공합니다.',
      status: 'implemented' as const,
    },
    {
      icon: <BackupIcon fontSize="large" />,
      title: '백업 & 복원',
      description: '데이터 안전을 위한 자동 백업 및 복원 기능을 통해 콘텐츠를 안전하게 보호합니다.',
      status: 'planned' as const,
    },
    {
      icon: <SecurityIcon fontSize="large" />,
      title: '버전 관리',
      description: '콘텐츠의 변경 이력을 추적하고 이전 버전으로 롤백할 수 있는 버전 관리 시스템을 제공합니다.',
      status: 'implemented' as const,
    },
  ];

  // 기술 스택
  const techStack = [
    'Next.js 15 (App Router)',
    'React 19',
    'TypeScript',
    'Material-UI v5',
    'Zustand (상태 관리)',
    'React Hook Form',
    'SQLite + better-sqlite3',
    'React Quill (WYSIWYG)',
  ];

  return (
    <ThemeProvider theme={homeTheme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        {/* 헤더 */}
        <Paper 
          sx={{ 
            bgcolor: 'primary.main',
            color: 'white',
            borderRadius: 0,
            py: 6
          }}
        >
          <Container maxWidth="lg">
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h2" gutterBottom>
                Content Studio
              </Typography>
              <Typography variant="h5" gutterBottom sx={{ opacity: 0.9 }}>
                현대적이고 사용하기 쉬운 콘텐츠 관리 시스템
              </Typography>
              <Typography variant="body1" sx={{ mb: 4, opacity: 0.8 }}>
                Next.js와 React로 구축된 풀스택 CMS로 직관적인 관리자 인터페이스와 
                강력한 콘텐츠 편집 기능을 제공합니다.
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => router.push('/admin')}
                  sx={{ 
                    bgcolor: 'white',
                    color: 'primary.main',
                    '&:hover': { bgcolor: 'grey.100' }
                  }}
                  endIcon={<ArrowForwardIcon />}
                >
                  관리자 시작하기
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => router.push('/preview')}
                  sx={{ 
                    borderColor: 'white',
                    color: 'white',
                    '&:hover': { 
                      borderColor: 'grey.200',
                      bgcolor: 'rgba(255,255,255,0.1)'
                    }
                  }}
                >
                  사이트 미리보기
                </Button>
              </Box>
            </Box>
          </Container>
        </Paper>

        <Container maxWidth="lg" sx={{ py: 8 }}>
          {/* 주요 기능 섹션 */}
          <Box sx={{ mb: 8 }}>
            <Typography variant="h3" textAlign="center" gutterBottom>
              주요 기능
            </Typography>
            <Typography variant="body1" textAlign="center" color="text.secondary" sx={{ mb: 4 }}>
              Content Studio CMS가 제공하는 강력한 기능들을 살펴보세요
            </Typography>

            <Grid container spacing={3}>
              {features.map((feature, index) => (
                <Grid item xs={12} md={6} lg={4} key={index}>
                  <FeatureCard {...feature} />
                </Grid>
              ))}
            </Grid>
          </Box>

          <Divider sx={{ my: 8 }} />

          {/* 기술 스택 및 특징 */}
          <Grid container spacing={6}>
            <Grid item xs={12} md={6}>
              <Typography variant="h4" gutterBottom>
                현대적인 기술 스택
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                최신 웹 기술을 활용하여 안정적이고 확장 가능한 CMS를 구축했습니다.
              </Typography>
              
              <List>
                {techStack.map((tech, index) => (
                  <ListItem key={index} disablePadding>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <CheckIcon color="primary" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText 
                      primary={tech}
                      primaryTypographyProps={{ fontSize: '0.9rem' }}
                    />
                  </ListItem>
                ))}
              </List>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h4" gutterBottom>
                학습 목표
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                이 프로젝트를 통해 배울 수 있는 핵심 개념들입니다.
              </Typography>

              <List>
                {[
                  '풀스택 애플리케이션 구축',
                  'Next.js App Router 활용',
                  'TypeScript 실무 적용',
                  'Material-UI 컴포넌트 활용',
                  'RESTful API 설계 및 구현',
                  '파일 업로드 및 관리',
                  'WYSIWYG 에디터 통합',
                  '상태 관리 (Zustand)',
                  'SQLite 데이터베이스 활용',
                  '반응형 웹 디자인'
                ].map((item, index) => (
                  <ListItem key={index} disablePadding>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <CheckIcon color="success" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText 
                      primary={item}
                      primaryTypographyProps={{ fontSize: '0.9rem' }}
                    />
                  </ListItem>
                ))}
              </List>
            </Grid>
          </Grid>

          <Divider sx={{ my: 8 }} />

          {/* 빠른 시작 가이드 */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom>
              빠른 시작
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              Content Studio CMS를 사용해보세요
            </Typography>

            <Grid container spacing={4} justifyContent="center">
              <Grid item xs={12} sm={6} md={4}>
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="h6" gutterBottom>
                    1. 관리자 접속
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    관리자 대시보드에 접속하여 시스템 현황을 확인하세요
                  </Typography>
                  <Button
                    variant="outlined"
                    onClick={() => router.push('/admin')}
                    startIcon={<DashboardIcon />}
                  >
                    대시보드 보기
                  </Button>
                </Paper>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="h6" gutterBottom>
                    2. 콘텐츠 작성
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    직관적인 에디터로 첫 콘텐츠를 작성해보세요
                  </Typography>
                  <Button
                    variant="outlined"
                    onClick={() => router.push('/admin/contents/new')}
                    startIcon={<EditIcon />}
                  >
                    콘텐츠 작성
                  </Button>
                </Paper>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="h6" gutterBottom>
                    3. 미리보기
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    작성한 콘텐츠를 실제 사이트에서 미리보기하세요
                  </Typography>
                  <Button
                    variant="outlined"
                    onClick={() => router.push('/preview')}
                    startIcon={<ArticleIcon />}
                  >
                    사이트 보기
                  </Button>
                </Paper>
              </Grid>
            </Grid>
          </Box>

          {/* 개발자 정보 */}
          <Box sx={{ mt: 8, p: 4, bgcolor: 'grey.50', borderRadius: 2 }}>
            <Typography variant="h5" gutterBottom>
              개발자를 위한 정보
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              이 프로젝트는 React와 Next.js를 학습하기 위한 교육용 CMS입니다.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>기본 관리자 계정:</strong> ID: admin, PW: admin123<br/>
              <strong>개발 모드:</strong> 개발자 도구와 상세한 로그가 활성화되어 있습니다<br/>
              <strong>데이터베이스:</strong> SQLite를 사용하여 별도 설정 없이 바로 시작할 수 있습니다
            </Typography>
          </Box>
        </Container>

        {/* 푸터 */}
        <Paper sx={{ mt: 8, py: 4, bgcolor: 'grey.100', borderRadius: 0 }}>
          <Container maxWidth="lg">
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Content Studio CMS © 2025. Next.js와 React를 활용한 교육용 CMS 프로젝트
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Made with ❤️ for learning React & Next.js
              </Typography>
            </Box>
          </Container>
        </Paper>
      </Box>
    </ThemeProvider>
  );
};

export default HomePage;