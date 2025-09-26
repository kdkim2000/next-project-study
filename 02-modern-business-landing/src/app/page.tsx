// app/page.tsx
import { Typography, Button, Box } from "@mui/material";
import Link from "next/link";

export default function HomePage() {
  return (
    <Box textAlign="center" mt={8}>
      <Typography variant="h3" gutterBottom>
        환영합니다, Modern Business!
      </Typography>
      <Typography variant="h6" gutterBottom>
        전문적인 서비스를 제공하는 기업을 위한 랜딩 페이지 예제입니다.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        component={Link}
        href="/contact"
        sx={{ mt: 3 }}
      >
        문의하기
      </Button>
    </Box>
  );
}
