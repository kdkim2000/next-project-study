// next.config.ts - Next.js 15.1.0 호환 TypeScript 설정 파일

import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // 이미지 최적화 설정
  images: {
    // 외부 이미지 도메인 허용
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        port: '',
        pathname: '/**',
      },
    ],
    // 이미지 형식 최적화 (Next.js 15에서 지원)
    formats: ['image/webp', 'image/avif'],
  },

  // TypeScript 설정
  typescript: {
    // 빌드 시 타입 체크 수행 (개발 중에는 IDE에서 확인)
    ignoreBuildErrors: false,
  },

  // ESLint 설정
  eslint: {
    // 빌드 시 ESLint 체크 수행
    ignoreDuringBuilds: false,
  },

  // 리다이렉트 설정
  async redirects(): Promise<
    Array<{
      source: string;
      destination: string;
      permanent: boolean;
    }>
  > {
    return [
      // 필요시 리다이렉트 규칙 추가
      // {
      //   source: '/old-path',
      //   destination: '/new-path',
      //   permanent: true,
      // },
    ];
  },

  // 헤더 설정 (보안 및 CORS)
  async headers(): Promise<
    Array<{
      source: string;
      headers: Array<{
        key: string;
        value: string;
      }>;
    }>
  > {
    return [
      {
        // 모든 API 라우트에 CORS 헤더 추가
        source: '/api/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
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

  // 정적 파일 압축 설정
  compress: true,

  // 페이지 확장자 설정
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],

  // Next.js 15 실험적 기능
  experimental: {
    // Material-UI와 관련 패키지 최적화
    optimizePackageImports: ['@mui/material', '@mui/icons-material'],
    // TypeScript 플러그인 활성화
    typedRoutes: true,
  },

  // 웹팩 설정 (TypeScript 타입 적용)
  webpack: (config, { buildId, dev, isServer, defaultLoaders, nextRuntime }) => {
    // 필요시 웹팩 설정 커스터마이징
    return config;
  },

  // 환경 변수 타입 안전성
  env: {
    // 커스텀 환경 변수가 있다면 여기에 추가
    CUSTOM_KEY: process.env.CUSTOM_KEY || '',
  },
};

export default nextConfig;