// app/layout.tsx
import { ReactNode } from "react";
import { AppBar, Toolbar, Typography, Container, CssBaseline, Button } from "@mui/material";
import Link from "next/link";

export const metadata = {
  title: "Modern Business Landing",
  description: "기업 랜딩 페이지 예제 (Next.js + MUI)",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <CssBaseline />
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              ModernBiz
            </Typography>
            <Button color="inherit" component={Link} href="/">Home</Button>
            <Button color="inherit" component={Link} href="/about">About</Button>
            <Button color="inherit" component={Link} href="/contact">Contact</Button>
          </Toolbar>
        </AppBar>
        <Container sx={{ mt: 4 }}>{children}</Container>
      </body>
    </html>
  );
}
