// src/types/index.ts
/**
 * 전역 타입 정의 파일
 */

// 네비게이션 메뉴 아이템
export interface NavItem {
  label: string
  href: string
  external?: boolean
}

// 서비스 아이템
export interface Service {
  id: string
  title: string
  description: string
  features: string[]
  icon: React.ReactNode
  image?: string
}

// 연락처 폼 데이터
export interface ContactFormData {
  name: string
  email: string
  company: string
  phone: string
  message: string
  consent?: boolean
}

// API 응답 타입
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// 페이지 메타데이터
export interface PageMeta {
  title: string
  description: string
  keywords?: string[]
  image?: string
  url?: string
}

// 팀 멤버
export interface TeamMember {
  id: string
  name: string
  position: string
  bio: string
  image: string
  social?: {
    linkedin?: string
    twitter?: string
    github?: string
  }
}

// 프로젝트/포트폴리오
export interface Project {
  id: string
  title: string
  description: string
  image: string
  tags: string[]
  url?: string
  github?: string
  featured: boolean
  createdAt: Date
}

export default {}