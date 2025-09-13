// src/app/profile/page.tsx - 사용자 프로필 관리 페이지
import { auth, signOut } from "@/lib/auth";
import { redirect } from "next/navigation";
import { 
  Container, 
  Paper, 
  Typography, 
  Box, 
  Avatar,
  Button,
  Chip,
  Divider,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import { 
  ExitToApp,
  Person,
  AdminPanelSettings,
  Email,
  CalendarToday,
  AccountCircle
} from '@mui/icons-material';
import { Header } from '@/components/Header';

/**
 * 사용자 프로필 페이지
 * - 개인 정보 표시
 * - 계정 관리 기능
 * - 로그아웃 기능
 * - 관리자/일반 사용자 구분 표시
 */
export default async function ProfilePage() {
  // 서버에서 현재 세션 확인
  const session = await auth();

  // 로그인하지 않은 사용자는 로그인 페이지로 리디렉션
  if (!session) {
    redirect('/auth/signin');
  }

  const { user } = session;

  return (
    <>
      <Header />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          {/* 프로필 헤더 */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            <Avatar
              src={user?.image || undefined}
              sx={{ width: 100, height: 100, mr: 3 }}
            >
              <Person sx={{ fontSize: 50 }} />
            </Avatar>
            
            <Box sx={{ flex: 1 }}>
              <Typography variant="h4" component="h1" gutterBottom>
                프로필 관리
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 2 }}>
                <Chip
                  icon={user?.role === 'ADMIN' ? <AdminPanelSettings /> : <Person />}
                  label={user?.role === 'ADMIN' ? '시스템 관리자' : '일반 사용자'}
                  color={user?.role === 'ADMIN' ? 'secondary' : 'primary'}
                  size="medium"
                />
              </Box>
              <Typography variant="body1" color="text.secondary">
                계정 정보를 확인하고 관리하세요
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ mb: 4 }} />

          {/* 개인 정보 섹션 */}
          <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
            📋 기본 정보
          </Typography>
          
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <AccountCircle sx={{ mr: 2, color: 'primary.main' }} />
                    <Typography variant="h6">이름</Typography>
                  </Box>
                  <Typography variant="body1" sx={{ pl: 4 }}>
                    {user?.name || '이름 정보 없음'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Email sx={{ mr: 2, color: 'primary.main' }} />
                    <Typography variant="h6">이메일</Typography>
                  </Box>
                  <Typography variant="body1" sx={{ pl: 4, wordBreak: 'break-word' }}>
                    {user?.email}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card variant="outlined">
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <CalendarToday sx={{ mr: 2, color: 'primary.main' }} />
                    <Typography variant="h6">사용자 ID</Typography>
                  </Box>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      pl: 4, 
                      fontFamily: 'monospace',
                      backgroundColor: 'grey.100',
                      p: 1,
                      borderRadius: 1,
                      wordBreak: 'break-all'
                    }}
                  >
                    {user?.id}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Divider sx={{ mb: 4 }} />

          {/* 계정 관리 섹션 */}
          <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
            ⚙️ 계정 관리
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 4 }}>
            {/* 로그아웃 버튼 */}
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <Button
                type="submit"
                variant="contained"
                color="error"
                startIcon={<ExitToApp />}
                size="large"
              >
                로그아웃
              </Button>
            </form>

            {/* 추가 관리 기능들 (향후 확장 가능) */}
            <Button
              variant="outlined"
              disabled
              sx={{ opacity: 0.5 }}
            >
              계정 설정 (준비중)
            </Button>
          </Box>

          {/* 개발자용 세션 정보 (디버깅) */}
          <Paper sx={{ p: 3, bgcolor: 'grey.50', borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              🔍 개발자 정보 (세션 데이터)
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              현재 세션에 저장된 사용자 정보입니다. 프로덕션에서는 표시되지 않습니다.
            </Typography>
            <Typography 
              variant="body2" 
              component="pre" 
              sx={{ 
                fontSize: '0.75rem', 
                overflow: 'auto',
                backgroundColor: '#f5f5f5',
                p: 2,
                borderRadius: 1,
                border: '1px solid #ddd',
                whiteSpace: 'pre-wrap'
              }}
            >
              {JSON.stringify(session, null, 2)}
            </Typography>
          </Paper>
        </Paper>
      </Container>
    </>
  );
}