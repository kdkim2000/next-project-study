// src/lib/config.ts
/**
 * 환경변수 중앙 관리 파일
 * 모든 환경변수를 한 곳에서 관리하고 타입 안정성 보장
 */

// 클라이언트 사이드에서 접근 가능한 환경변수들
export const publicConfig = {
  GA_ID: process.env.NEXT_PUBLIC_GA_ID,
  API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  NODE_ENV: process.env.NODE_ENV || 'development',
} as const

// 서버 사이드에서만 접근 가능한 환경변수들
export const privateConfig = {
  MAIL_SERVICE_API_KEY: process.env.MAIL_SERVICE_API_KEY,
  MAIL_SERVICE_FROM_EMAIL: process.env.MAIL_SERVICE_FROM_EMAIL,
  MAIL_SERVICE_TO_EMAIL: process.env.MAIL_SERVICE_TO_EMAIL,
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET,
} as const

// 개발 환경 체크 함수
export const isDevelopment = publicConfig.NODE_ENV === 'development'
export const isProduction = publicConfig.NODE_ENV === 'production'

// 환경변수 검증 함수
export function validateEnvironmentVariables() {
  const requiredPublicVars = ['NEXT_PUBLIC_API_URL', 'NEXT_PUBLIC_SITE_URL']
  const requiredPrivateVars = ['MAIL_SERVICE_FROM_EMAIL']

  for (const varName of requiredPublicVars) {
    if (!process.env[varName]) {
      throw new Error(`Missing required environment variable: ${varName}`)
    }
  }

  // 서버 사이드에서만 실행
  if (typeof window === 'undefined') {
    for (const varName of requiredPrivateVars) {
      if (!process.env[varName]) {
        console.warn(`Missing optional environment variable: ${varName}`)
      }
    }
  }
}