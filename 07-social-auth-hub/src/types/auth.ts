// src/types/auth.ts - NextAuth.js 타입 확장
import { DefaultSession } from "next-auth"

// NextAuth.js 기본 타입 확장
declare module "next-auth" {
  interface Session {
    user: {
      id: string      // 사용자 ID 추가
      role: string    // 역할 정보 추가
    } & DefaultSession["user"] // 기본 필드들 (name, email, image) 유지
  }

  interface User {
    role: string  // User 객체에 role 필드 추가
  }
}

// 앱에서 사용할 사용자 타입
export interface AppUser {
  id: string
  name?: string | null
  email: string
  image?: string | null
  role: string
  createdAt: Date
  updatedAt: Date
}