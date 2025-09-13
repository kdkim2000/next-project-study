import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  compress: true,

  // 이미지 최적화
  images: {
    formats: ['image/webp'],
  }
};

export default nextConfig;
