// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Next.js 15에서는 experimental.appDir이 기본값이므로 제거
  
  // 이미지 최적화 설정
  images: {
    domains: [],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
  },

  // 개발 서버 설정
  devIndicators: {
    buildActivity: false, // 빌드 표시기 비활성화 (콘솔 정리)
  },

  // TypeScript 설정
  typescript: {
    ignoreBuildErrors: false,
  },

  // ESLint 설정
  eslint: {
    ignoreDuringBuilds: false,
  },

  // 웹팩 설정 (Socket.io 호환성)
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },

  // 개발 환경 설정
  env: {
    SOCKET_SERVER_URL: process.env.SOCKET_SERVER_URL || 'http://localhost:3001',
  },
};

module.exports = nextConfig;