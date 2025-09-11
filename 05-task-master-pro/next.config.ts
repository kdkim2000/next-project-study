/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Server Actions 활성화 (Next.js 13+에서는 기본적으로 활성화됨)
    serverActions: {
      allowedOrigins: ['localhost:3000'],
    },
  },
  // TypeScript 설정
  typescript: {
    // 프로덕션 빌드 시에도 타입 체크 수행
    ignoreBuildErrors: false,
  },
  // ESLint 설정
  eslint: {
    // 빌드 시 ESLint 실행
    ignoreDuringBuilds: false,
  },
  // 개발 환경 최적화
  swcMinify: true,
  // 이미지 최적화
  images: {
    domains: [],
  },
  // 환경 변수 설정
  env: {
    DATABASE_URL: process.env.DATABASE_URL || "file:./dev.db",
  },
};

module.exports = nextConfig;