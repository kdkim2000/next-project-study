// src/lib/prisma.ts - Prisma 클라이언트 싱글톤 설정

import { PrismaClient } from '@prisma/client';

// 전역 타입 선언 (TypeScript용)
declare global {
  var prisma: PrismaClient | undefined;
}

// Prisma 클라이언트 싱글톤 패턴
// 개발 환경에서 hot reload로 인한 다중 연결을 방지
const prisma = globalThis.prisma || new PrismaClient();

// 개발 환경에서만 전역에 저장
if (process.env.NODE_ENV === 'development') {
  globalThis.prisma = prisma;
}

export default prisma;