// src/app/page.tsx - 홈페이지 (메인 랜딩 페이지)
import { auth } from "@/lib/auth";
import { Container, Typography, Box, Button, Paper, Grid } from '@mui/material';
import { Login, Person, AdminPanelSettings, Security, Speed, Code } from '@mui/icons-material';
import { Header } from '@/components/Header';
import Link from 'next/link';

/**
 * 홈페이지 컴포넌트
 * - 프로젝트 소개
 * - 로그인 상태에 따른 동적 콘텐츠
 * - 주요 기능 안내
 */
export default async function HomePage() {
  // 서버에서 현재 세션 정보 조회
  const session = await auth();

  return (
    <>
      <Header />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* 메인 타이틀 섹션 */}
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center', mb: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom>
            🔐 Social Auth Hub
          </Typography>
          
          <Typography variant="h6" color="text.secondary" paragraph>
            Next.js 15 + NextAuth.js v5를 활용한 완성형 소셜 인증 시스템
          </Typography>

          {/* 로그인 상태에 따른 동적 콘텐츠 */}
          {session ? (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h5" gutterBottom color="primary">
                안녕하세요, {session.user?.name}님! 👋
              </Typography>
              
              {/* 액션 버튼들 */}
              <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Button
                  component={Link}
                  href="/profile"
                  variant="contained"
                  startIcon={<Person />}
                  size="large"
                >
                  프로필 관리
                </Button>
                
                {session.user?.role === 'ADMIN' && (
                  <Button
                    component={Link}
                    href="/admin"
                    variant="contained"
                    color="secondary"
                    startIcon={<AdminPanelSettings />}
                    size="large"
                  >
                    관리자 대시보드
                  </Button>
                )}
              </Box>

              {/* 개발자용 세션 정보 */}
              <Box sx={{ mt: 4, p: 3, bgcolor: 'grey.100', borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom>
                  🔍 개발자 정보 (현재 세션)
                </Typography>
                <Typography 
                  variant="body2" 
                  component="pre" 
                  sx={{ 
                    textAlign: 'left', 
                    fontSize: '0.75rem', 
                    overflow: 'auto',
                    whiteSpace: 'pre-wrap'
                  }}
                >
                  {JSON.stringify(session, null, 2)}
                </Typography>
              </Box>
            </Box>
          ) : (
            // 비로그인 상태
            <Box sx={{ mt: 4 }}>
              <Typography variant="h5" gutterBottom>
                로그인하여 시작하세요 🚀
              </Typography>
              
              <Button
                component={Link}
                href="/auth/signin"
                variant="contained"
                startIcon={<Login />}
                size="large"
                sx={{ mt: 2 }}
              >
                로그인 하기
              </Button>
            </Box>
          )}
        </Paper>

        {/* 주요 기능 소개 섹션 */}
        <Typography variant="h4" gutterBottom textAlign="center" sx={{ mb: 4 }}>
          🎯 주요 기능
        </Typography>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, textAlign: 'center', height: '100%' }}>
              <Security sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                보안 인증
              </Typography>
              <Typography variant="body2" color="text.secondary">
                NextAuth.js v5를 활용한 안전한 소셜 로그인 시스템
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, textAlign: 'center', height: '100%' }}>
              <Speed sx={{ fontSize: 48, color: 'secondary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                빠른 개발
              </Typography>
              <Typography variant="body2" color="text.secondary">
                React 19 + Next.js 15의 최신 기술로 빠른 개발 경험
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, textAlign: 'center', height: '100%' }}>
              <Code sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                학습 친화적
              </Typography>
              <Typography variant="body2" color="text.secondary">
                상세한 주석과 설명으로 초보자도 쉽게 따라할 수 있음
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* 학습 포인트 섹션 */}
        <Paper sx={{ p: 4, bgcolor: 'primary.50' }}>
          <Typography variant="h5" gutterBottom textAlign="center">
            📚 학습 포인트
          </Typography>
          <Box sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="body1" component="div">
                  <strong>✨ 최신 기술 스택:</strong><br/>
                  • React 19.1.0 & Next.js 15<br/>
                  • NextAuth.js v5 (Auth.js)<br/>
                  • Material-UI v6<br/>
                  • Prisma ORM<br/>
                  • TypeScript
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body1" component="div">
                  <strong>🔐 인증 시스템:</strong><br/>
                  • 소셜 로그인 (Google, GitHub)<br/>
                  • 세션 기반 인증<br/>
                  • 역할 기반 접근 제어<br/>
                  • 미들웨어 보호<br/>
                  • 프로필 관리
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>
    </>
  );
}