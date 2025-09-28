import type { NextConfig } from "next";

// Repository 이름을 환경변수로 설정하거나 직접 입력
const isProd = process.env.NODE_ENV === 'production';
const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1] || 'kdkim2000';

const nextConfig: NextConfig = {
  // GitHub Pages 정적 배포를 위한 필수 설정
  output: 'export',
  
  // 정적 파일 경로 설정
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  
  // GitHub Pages 베이스 경로 설정
  basePath: isProd ? `/${repoName}` : '',
  assetPrefix: isProd ? `/${repoName}/` : '',
  
  // 이미지 최적화 비활성화 (정적 호스팅 환경)
  images: {
    unoptimized: true,
  },

  // 리다이렉트 설정 (선택사항)
  async redirects() {
    return [
      {
        source: '/posts/:path*',
        destination: '/blog/:path*',
        permanent: true,
      },
    ];
  },

  // 환경별 설정
  env: {
    NEXT_PUBLIC_BASE_URL: isProd 
      ? `https://${process.env.GITHUB_REPOSITORY_OWNER || 'username'}.github.io/${repoName}`
      : 'http://localhost:3000',
  },

  // webpack 설정 (GitHub Pages 환경 최적화)
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    return config;
  },

  // 성능 최적화
  compress: true,
  poweredByHeader: false,

  // 실험적 기능 (필요시)
  experimental: {
    // 필요한 실험적 기능들을 여기에 추가
    // esmExternals: true,
  },
};

export default nextConfig;