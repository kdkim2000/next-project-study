// src/middleware.ts - Next.js 미들웨어 (페이지 보호)
import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

/**
 * 미들웨어: 모든 요청을 인터셉트하여 인증/권한 체크
 * - 보호된 경로 접근 제어
 * - 관리자 권한 체크
 * - 로그인 상태에 따른 리디렉션
 */
export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isAuthenticated = !!req.auth;

  // 📝 보호된 경로 정의
  const protectedPaths = ['/profile', '/admin'];     // 로그인 필요
  const adminPaths = ['/admin'];                      // 관리자 전용
  const publicPaths = ['/auth/signin', '/', '/api']; // 누구나 접근 가능

  // 🔒 관리자 전용 경로 체크
  if (adminPaths.some(path => pathname.startsWith(path))) {
    if (!isAuthenticated) {
      // 로그인하지 않은 사용자 → 로그인 페이지
      return NextResponse.redirect(new URL('/auth/signin', req.url));
    }
    
    const userRole = req.auth?.user?.role;
    if (userRole !== 'ADMIN') {
      // 일반 사용자가 관리자 페이지 접근 → 홈페이지
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  // 🔐 일반 보호 경로 체크
  if (protectedPaths.some(path => pathname.startsWith(path))) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/auth/signin', req.url));
    }
  }

  // 🏠 로그인한 사용자가 로그인 페이지 접근 시 홈으로 리디렉션
  if (pathname.startsWith('/auth/signin') && isAuthenticated) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
});

// 미들웨어 적용 경로 설정
export const config = {
  // 정적 파일, API 경로, Next.js 내부 파일 제외
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};