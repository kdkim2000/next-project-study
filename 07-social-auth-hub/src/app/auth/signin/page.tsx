// src/app/auth/signin/page.tsx - 소셜 로그인 페이지
import { 
  Container, 
  Paper, 
  Typography, 
  Box, 
  Button,
  Divider,
  Alert
} from '@mui/material';
import { 
  Google, 
  GitHub
} from '@mui/icons-material';
import { signIn } from "@/lib/auth";
import { Header } from '@/components/Header';

/**
 * 소셜 로그인 페이지
 * - Google, GitHub OAuth 로그인
 * - Server Actions를 활용한 로그인 처리
 * - 사용자 친화적 UI
 */
export default function SignInPage() {
  return (
    <>
      <Header />
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          {/* 페이지 타이틀 */}
          <Box textAlign="center" mb={4}>
            <Typography variant="h4" component="h1" gutterBottom>
              🔐 로그인
            </Typography>
            <Typography variant="body1" color="text.secondary">
              소셜 계정으로 간편하게 시작하세요
            </Typography>
          </Box>

          {/* 소셜 로그인 버튼들 */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Google 로그인 */}
            <form
              action={async () => {
                "use server";
                // NextAuth.js signIn 함수 호출 (Server Action)
                await signIn("google", { 
                  redirectTo: "/", // 로그인 성공 시 홈페이지로 이동
                });
              }}
            >
              <Button
                type="submit"
                variant="outlined"
                fullWidth
                size="large"
                startIcon={<Google />}
                sx={{ 
                  py: 1.5,
                  borderColor: '#db4437',
                  color: '#db4437',
                  '&:hover': {
                    borderColor: '#db4437',
                    backgroundColor: 'rgba(219, 68, 55, 0.04)',
                  }
                }}
              >
                Google로 계속하기
              </Button>
            </form>

            {/* GitHub 로그인 */}
            <form
              action={async () => {
                "use server";
                await signIn("github", { 
                  redirectTo: "/",
                });
              }}
            >
              <Button
                type="submit"
                variant="outlined"
                fullWidth
                size="large"
                startIcon={<GitHub />}
                sx={{ 
                  py: 1.5,
                  borderColor: '#333',
                  color: '#333',
                  '&:hover': {
                    borderColor: '#333',
                    backgroundColor: 'rgba(51, 51, 51, 0.04)',
                  }
                }}
              >
                GitHub로 계속하기
              </Button>
            </form>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* 안내 메시지 */}
          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="body2">
              <strong>개발자 안내:</strong> OAuth 앱 설정이 필요합니다.<br/>
              • Google: <a href="https://console.cloud.google.com/" target="_blank" rel="noopener">Google Cloud Console</a><br/>
              • GitHub: <a href="https://github.com/settings/developers" target="_blank" rel="noopener">GitHub Developer Settings</a>
            </Typography>
          </Alert>

          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Typography variant="body2" color="text.secondary">
              로그인하면 서비스 이용약관 및 개인정보처리방침에 동의하게 됩니다.
            </Typography>
          </Box>
        </Paper>
      </Container>
    </>
  );
}