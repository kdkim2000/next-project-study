// src/data/navigation.ts
// 네비게이션 메뉴 데이터

export interface NavItem {
  name: string
  href: string
  description?: string
  external?: boolean
}

// 메인 네비게이션 메뉴
export const mainNavigation: NavItem[] = [
  {
    name: '홈',
    href: '/',
    description: '메인 페이지',
  },
  {
    name: '소개',
    href: '/about',
    description: '자세한 소개 및 경력',
  },
  {
    name: '프로젝트',
    href: '/projects',
    description: '개발한 프로젝트들',
  },
  {
    name: '연락처',
    href: '/contact',
    description: '연락처 및 문의',
  },
]

// 푸터 네비게이션
export const footerNavigation = {
  main: mainNavigation,
  external: [
    {
      name: 'GitHub',
      href: 'https://github.com/johndoe',
      external: true,
    },
    {
      name: 'LinkedIn',
      href: 'https://linkedin.com/in/johndoe',
      external: true,
    },
    {
      name: 'Twitter',
      href: 'https://twitter.com/johndoe',
      external: true,
    },
  ],
}

// 빠른 링크 (홈페이지용)
export const quickLinks = [
  {
    name: '프로젝트 보기',
    href: '/projects',
    primary: true,
  },
  {
    name: '연락하기',
    href: '/contact',
    primary: false,
  },
  {
    name: 'GitHub',
    href: 'https://github.com/johndoe',
    external: true,
    primary: false,
  },
]