// src/types/env.d.ts - 환경 변수 타입 정의

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // 데이터베이스 관련
      DATABASE_URL: string;
      
      // Next.js 앱 설정
      NEXT_PUBLIC_APP_URL: string;
      NEXT_PUBLIC_API_URL: string;
      
      // 노드 환경
      NODE_ENV: 'development' | 'production' | 'test';
      
      // 커스텀 환경 변수 (필요시 추가)
      CUSTOM_KEY?: string;
    }
  }
}

// 이 파일을 모듈로 만들어 다른 곳에서 import 가능하게 함
export {};