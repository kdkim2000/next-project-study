// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 환경 변수 설정
  env: {
    // 빌드 시점에 환경 변수 주입
    CUSTOM_BUILD_TIME: new Date().toISOString(),
  },
  
  // 타입 안전 라우팅 (experimental에서 이동됨)
  typedRoutes: true,
  
  // 서버 외부 패키지 설정 (experimental에서 이동됨)
  serverExternalPackages: [],
  
  // 이미지 최적화 설정
  images: {
    domains: [],
    formats: ['image/webp', 'image/avif'],
    unoptimized: false,
  },
  
  // 개발 환경 인디케이터 설정 (수정됨)
  ...(process.env.NODE_ENV === 'development' && {
    devIndicators: {
      // buildActivity는 deprecated - 제거
      // buildActivityPosition는 position으로 변경
      position: 'bottom-right',
    },
  }),
  
  // 번들 분석 및 최적화 설정
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      // 개발 환경에서 번들 크기 분석 및 최적화
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          ...config.optimization.splitChunks,
          cacheGroups: {
            ...config.optimization.splitChunks.cacheGroups,
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
              priority: 10,
            },
            // Framer Motion 별도 청크로 분리
            framerMotion: {
              test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
              name: 'framer-motion',
              chunks: 'all',
              priority: 20,
            },
            // MUI 별도 청크로 분리
            mui: {
              test: /[\\/]node_modules[\\/]@mui[\\/]/,
              name: 'mui',
              chunks: 'all',
              priority: 20,
            },
            // React Hook Form 별도 청크로 분리
            reactHookForm: {
              test: /[\\/]node_modules[\\/](react-hook-form|@hookform)[\\/]/,
              name: 'react-hook-form',
              chunks: 'all',
              priority: 20,
            },
          },
        },
      };
    }
    return config;
  },
  
  // 보안 헤더 설정
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // XSS 보호
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          // MIME 타입 스니핑 방지
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          // XSS 필터 활성화
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          // Referrer 정책
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
      // API 라우트에 대한 CORS 설정 (개발환경용)
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: process.env.NODE_ENV === 'development' ? '*' : 'https://yourdomain.com',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
        ],
      },
    ];
  },
  
  // 리다이렉트 설정 (필요시)
  async redirects() {
    return [
      // 예시: 구 경로에서 새 경로로 리다이렉트
      // {
      //   source: '/old-contact',
      //   destination: '/contact',
      //   permanent: true,
      // },
    ];
  },
  
  // TypeScript 설정
  typescript: {
    // 빌드 시 타입 에러 무시 (권장하지 않음)
    ignoreBuildErrors: false,
  },
  
  // ESLint 설정
  eslint: {
    // 빌드 시 ESLint 에러 무시 (권장하지 않음)
    ignoreDuringBuilds: false,
    // 특정 디렉토리에서만 ESLint 실행
    dirs: ['app', 'components', 'lib', 'hooks'],
  },
  
  // 컴파일러 최적화
  compiler: {
    // 프로덕션에서 console.log 제거
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error'],
    } : false,
  },
  
  // 출력 설정
  output: 'standalone', // Docker 배포 시 유용
  
  // 정적 최적화 설정
  trailingSlash: false,
  
  // 파워드 바이 헤더 제거 (보안)
  poweredByHeader: false,
};

export default nextConfig;