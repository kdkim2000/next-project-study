// src/lib/prisma.ts - Prisma 데이터베이스 클라이언트
import { PrismaClient } from '@prisma/client';

// 글로벌 타입 정의 (개발 환경에서 Hot Reload 시 중복 생성 방지)
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Prisma 클라이언트 인스턴스
// 프로덕션: 새 인스턴스 생성
// 개발: 글로벌 변수 재사용 (Hot Reload 대응)
export const prisma = globalForPrisma.prisma ?? new PrismaClient();

// 개발 환경에서만 글로벌 변수에 저장
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}