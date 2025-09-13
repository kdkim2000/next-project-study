// src/lib/auth.ts - NextAuth.js 인증 설정
import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import GitHub from "next-auth/providers/github"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"

export const { handlers, signIn, signOut, auth } = NextAuth({
  // Prisma 어댑터 사용 (데이터베이스 연동)
  adapter: PrismaAdapter(prisma),
  
  // OAuth 제공자 설정
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      // 🔗 Google OAuth 설정 가이드:
      // 1. https://console.cloud.google.com/ 접속
      // 2. 새 프로젝트 생성 또는 기존 프로젝트 선택
      // 3. APIs & Services > Credentials 이동
      // 4. Create Credentials > OAuth 2.0 Client ID
      // 5. Authorized redirect URIs에 추가:
      //    http://localhost:3000/api/auth/callback/google
    }),
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      // 🔗 GitHub OAuth 설정 가이드:
      // 1. https://github.com/settings/developers 접속
      // 2. New OAuth App 클릭
      // 3. Application name: Social Auth Hub
      // 4. Homepage URL: http://localhost:3000
      // 5. Authorization callback URL: 
      //    http://localhost:3000/api/auth/callback/github
    }),
  ],
  
  // 세션 전략 (데이터베이스 기반)
  session: {
    strategy: "database", // JWT 대신 데이터베이스 세션 사용
    maxAge: 30 * 24 * 60 * 60, // 30일 (초 단위)
  },
  
  // 커스텀 페이지 설정
  pages: {
    signIn: "/auth/signin", // 커스텀 로그인 페이지
    error: "/auth/error",   // 에러 페이지
  },
  
  // 콜백 함수들
  callbacks: {
    // 세션 콜백: 클라이언트에서 사용할 세션 데이터 구성
    async session({ session, user }) {
      if (session?.user) {
        session.user.id = user.id;
        
        // 데이터베이스에서 최신 사용자 정보 조회 (role 포함)
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id }
        });
        
        session.user.role = dbUser?.role || "USER";
      }
      return session;
    },
    
    // JWT 콜백: JWT 토큰에 추가 정보 포함 (database 전략에서는 사용 안됨)
    async jwt({ user, token }) {
      if (user) {
        token.role = (user as any).role || "USER";
      }
      return token;
    },
  },
  
  // 디버그 모드 (개발 환경에서만)
  debug: process.env.NODE_ENV === "development",
});