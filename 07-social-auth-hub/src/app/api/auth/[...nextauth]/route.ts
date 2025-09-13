// src/app/api/auth/[...nextauth]/route.ts - NextAuth.js API 라우트
import { handlers } from "@/lib/auth"

// NextAuth.js handlers를 Next.js App Router에 연결
// GET: 로그인 페이지, 콜백 처리 등
// POST: 로그인, 로그아웃 처리 등
export const { GET, POST } = handlers