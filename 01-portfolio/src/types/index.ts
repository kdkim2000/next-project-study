// src/types/index.ts
// 프로젝트 전체에서 사용할 TypeScript 타입 정의 - 수정된 버전

// 프로젝트 정보 타입
export interface Project {
  id: string
  title: string
  description: string
  image: string
  technologies: string[]
  githubUrl?: string
  liveUrl?: string
  featured: boolean
}

// 스킬 정보 타입
export interface Skill {
  name: string
  level: number // 1-5 레벨
  category: 'frontend' | 'backend' | 'tools' | 'design'
  icon?: string
}

// 경험/교육 정보 타입
export interface Experience {
  id: string
  title: string
  company: string
  period: string
  description: string[]
  type: 'work' | 'education'
}

// 연락처 정보 타입
export interface ContactInfo {
  email: string
  phone?: string
  location: string
  socialLinks: {
    github?: string
    linkedin?: string
    twitter?: string
    instagram?: string
  }
}

// 네비게이션 메뉴 타입
export interface NavItem {
  name: string
  href: string
  icon?: React.ComponentType
}

// 폼 데이터 타입
export interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
}

// 테마 관련 타입
export type ThemeMode = 'light' | 'dark' | 'system'

// API 응답 타입 - any 대신 제네릭 기본값 사용
export interface ApiResponse<T = Record<string, unknown>> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

// 추가 유틸리티 타입들
export interface SocialLink {
  name: string
  url: string
  icon: React.ReactNode
}

export interface SkillCategory {
  id: string
  label: string
  skills: Skill[]
}

export interface ProjectFilter {
  category?: string
  technology?: string
  featured?: boolean
}

// 컴포넌트 Props 타입들
export interface SectionProps {
  className?: string
  children?: React.ReactNode
}

export interface PageProps {
  params?: Record<string, string>
  searchParams?: Record<string, string>
}