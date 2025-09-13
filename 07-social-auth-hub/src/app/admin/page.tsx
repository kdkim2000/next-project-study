// src/app/admin/page.tsx - 관리자 전용 대시보드
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { 
  Container, 
  Paper, 
  Typography, 
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
  Grid,
  Card,
  CardContent,
  Alert
} from '@mui/material';
import { 
  AdminPanelSettings,
  Person,
  Group,
  Security,
  TrendingUp
} from '@mui/icons-material';
import { Header } from '@/components/Header';

/**
 * 관리자 전용 대시보드
 * - 사용자 관리 기능
 * - 시스템 통계
 * - 관리자 권한 필수
 */
export default async function AdminPage() {
  // 현재 세션 확인
  const session = await auth();

  // 관리자 권한 체크: 로그인하지 않았거나 ADMIN이 아닌 경우 홈으로 리디렉션
  if (!session || session.user?.role !== 'ADMIN') {
    redirect('/');
  }

  // 데이터베이스에서 모든 사용자 조회
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' }, // 최신 가입자 순으로 정렬
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      createdAt: true,
      // 민감한 정보는 제외
    }
  });

  // 통계 계산
  const totalUsers = users.length;
  const adminUsers = users.filter(u => u.role === 'ADMIN').length;
  const regularUsers = users.filter(u => u.role === 'USER').length;
  const recentUsers = users.filter(u => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return u.createdAt > oneWeekAgo;
  }).length;

  return (
    <>
      <Header />
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          {/* 대시보드 헤더 */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            <AdminPanelSettings sx={{ fontSize: 40, mr: 2, color: 'secondary.main' }} />
            <Box>
              <Typography variant="h4" component="h1" gutterBottom>
                관리자 대시보드
              </Typography>
              <Typography variant="body1" color="text.secondary">
                시스템 사용자 및 권한 관리
              </Typography>
            </Box>
          </Box>

          {/* 관리자 안내 */}
          <Alert severity="info" sx={{ mb: 4 }}>
            <Typography variant="body2">
              <strong>관리자 권한:</strong> 이 페이지는 ADMIN 역할을 가진 사용자만 접근할 수 있습니다. 
              현재 {session.user?.name}님으로 로그인되어 있습니다.
            </Typography>
          </Alert>

          {/* 통계 카드들 */}
          <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
            📊 시스템 통계
          </Typography>
          
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Group sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                  <Typography variant="h4" color="primary">
                    {totalUsers}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    전체 사용자
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <AdminPanelSettings sx={{ fontSize: 40, color: 'secondary.main', mb: 1 }} />
                  <Typography variant="h4" color="secondary">
                    {adminUsers}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    관리자
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Person sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                  <Typography variant="h4" color="success.main">
                    {regularUsers}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    일반 사용자
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <TrendingUp sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
                  <Typography variant="h4" color="info.main">
                    {recentUsers}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    최근 1주일 신규
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* 사용자 목록 테이블 */}
          <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
            👥 사용자 목록
          </Typography>
          
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>프로필</TableCell>
                  <TableCell>사용자 정보</TableCell>
                  <TableCell>이메일</TableCell>
                  <TableCell>권한</TableCell>
                  <TableCell>가입일</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id} hover>
                    <TableCell>
                      <Avatar
                        src={user.image || undefined}
                        sx={{ width: 40, height: 40 }}
                      >
                        <Person />
                      </Avatar>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1" fontWeight="medium">
                        {user.name || '이름 없음'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        ID: {user.id.substring(0, 8)}...
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {user.email}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={user.role === 'ADMIN' ? <AdminPanelSettings /> : <Person />}
                        label={user.role === 'ADMIN' ? '관리자' : '사용자'}
                        color={user.role === 'ADMIN' ? 'secondary' : 'primary'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {new Date(user.createdAt).toLocaleDateString('ko-KR', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* 사용자가 없는 경우 */}
          {users.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <Typography variant="h6" color="text.secondary">
                등록된 사용자가 없습니다
              </Typography>
              <Typography variant="body2" color="text.secondary">
                첫 번째 사용자가 되어보세요!
              </Typography>
            </Box>
          )}

          {/* 관리자 기능 안내 */}
          <Alert severity="warning" sx={{ mt: 4 }}>
            <Typography variant="body2">
              <strong>개발 참고사항:</strong><br/>
              • 사용자 역할 변경 기능은 데이터베이스에서 직접 수정 가능<br/>
              • 첫 번째 관리자는 데이터베이스에서 role을 'ADMIN'으로 직접 변경<br/>
              • 프로덕션 환경에서는 사용자 관리 기능을 추가 구현 권장
            </Typography>
          </Alert>
        </Paper>
      </Container>
    </>
  );
}