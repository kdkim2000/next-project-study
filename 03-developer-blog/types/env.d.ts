// types/env.d.ts
declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: 'development' | 'production' | 'test';
    readonly NEXT_PUBLIC_BASE_URL: string;
    readonly GITHUB_REPOSITORY: string;
    readonly GITHUB_REPOSITORY_OWNER: string;
    readonly VERCEL_URL?: string;
  }
}

// Next.js 환경변수 타입 확장
declare module 'next/config' {
  interface PublicRuntimeConfig {
    baseUrl: string;
    basePath: string;
  }
}