// /app/login/page.tsx
import { Container, Card, CardContent, Typography, Stack, Button, TextField } from "@mui/material";
import NavBar from "@/components/NavBar";
import { signInGoogle, signInGitHub, signInEmail } from "@/lib/actions";

export default function LoginPage() {
  return (
    <>
      <NavBar />
      <Container sx={{ mt: 6, maxWidth: 560 }}>
        <Card variant="outlined">
          <CardContent>
            <Typography variant="h5" gutterBottom>로그인</Typography>
            <Stack spacing={2} sx={{ mt: 2 }}>
              <form action={signInGoogle}>
                <Button type="submit" fullWidth variant="contained">Google로 로그인</Button>
              </form>
              <form action={signInGitHub}>
                <Button type="submit" fullWidth variant="outlined">GitHub로 로그인</Button>
              </form>
              <form action={signInEmail}>
                <Stack direction="row" spacing={1}>
                  <TextField name="email" label="이메일(매직링크)" type="email" size="small" fullWidth />
                  <Button type="submit" variant="outlined">받기</Button>
                </Stack>
              </form>
              <Typography variant="caption" color="text.secondary">
                이메일은 Resend Provider로 매직링크를 발송합니다(데모). 실제 메일 수신을 위해 발신 도메인 설정 필요.
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </>
  );
}
