// src/lib/db.ts - Prisma 클라이언트 초기화 및 데이터베이스 연결 관리

import { PrismaClient } from '@prisma/client'

// PrismaClient 인스턴스를 전역으로 선언 (개발 환경에서 핫 리로딩 시 중복 생성 방지)
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Prisma 클라이언트 인스턴스 생성
// 개발 환경에서는 전역 객체에 저장하여 핫 리로딩 시에도 재사용
export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  // 로그 설정 (개발 시 쿼리 확인 가능)
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
})

// 개발 환경에서만 전역 객체에 prisma 인스턴스 저장
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// 데이터베이스 연결 테스트 함수 (선택적 사용)
export async function connectDB() {
  try {
    await prisma.$connect()
    console.log('✅ 데이터베이스에 성공적으로 연결되었습니다.')
  } catch (error) {
    console.error('❌ 데이터베이스 연결에 실패했습니다:', error)
    throw error
  }
}

// 데이터베이스 연결 해제 함수
export async function disconnectDB() {
  try {
    await prisma.$disconnect()
    console.log('✅ 데이터베이스 연결이 해제되었습니다.')
  } catch (error) {
    console.error('❌ 데이터베이스 연결 해제에 실패했습니다:', error)
  }
}