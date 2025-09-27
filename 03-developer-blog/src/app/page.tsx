// src/app/page.tsx
"use client";

import { Typography, Button } from "@mui/material";
import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <Typography variant="h3" gutterBottom>
        Welcome to Developer&apos;s Blog
      </Typography>
      <Typography paragraph>
        이 블로그는 Next.js와 MUI를 기반으로 한 학습용 프로젝트입니다.
        단계적으로 기능을 확장해 나갈 예정입니다.
      </Typography>
      <Link href="/blog" passHref>
        <Button variant="contained">블로그 보러가기</Button>
      </Link>
    </>
  );
}
