// src/data/projects.ts
// 프로젝트 데이터

export interface Project {
  id: number
  title: string
  description: string
  longDescription?: string // 상세 설명
  technologies: string[]
  features: string[] // 주요 기능들
  challenges?: string[] // 개발 중 어려웠던 점들
  github?: string
  demo?: string
  image?: string
  status: '완료' | '진행중' | '계획중'
  category: 'web' | 'mobile' | 'desktop'
  featured: boolean // 홈페이지에 표시할지 여부
}

// 프로젝트 데이터
export const projects: Project[] = [
  {
    id: 1,
    title: 'E-Commerce 웹사이트',
    description: 'Next.js로 구축한 현대적인 온라인 쇼핑몰입니다.',
    longDescription: 'React와 Next.js를 활용해 구축한 풀스택 전자상거래 플랫폼입니다. 사용자 친화적인 UI/UX와 안전한 결제 시스템을 구현했습니다.',
    technologies: ['Next.js', 'TypeScript', 'Stripe', 'MongoDB', 'Tailwind CSS'],
    features: [
      '상품 카탈로그 및 검색 기능',
      '장바구니 및 결제 시스템',
      '사용자 인증 및 프로필 관리',
      '관리자 대시보드',
      '반응형 디자인',
    ],
    challenges: [
      'Stripe 결제 시스템 통합',
      '복잡한 상태 관리',
      '이미지 최적화',
    ],
    github: 'https://github.com/johndoe/ecommerce',
    demo: 'https://ecommerce-demo.vercel.app',
    status: '완료',
    category: 'web',
    featured: true,
  },
  {
    id: 2,
    title: '할 일 관리 앱',
    description: '드래그 앤 드롭이 가능한 칸반 보드 스타일의 업무 관리 애플리케이션입니다.',
    longDescription: '팀 협업을 위한 직관적인 할 일 관리 도구입니다. 칸반 보드 방식으로 업무 진행상황을 시각화하고, 실시간 동기화를 지원합니다.',
    technologies: ['React', 'Material-UI', 'Node.js', 'Socket.io', 'PostgreSQL'],
    features: [
      '드래그 앤 드롭 칸반 보드',
      '실시간 협업',
      '업무 할당 및 진행상황 추적',
      '댓글 및 파일 첨부',
      '알림 시스템',
    ],
    challenges: [
      '실시간 동기화 구현',
      '복잡한 드래그 앤 드롭 로직',
      '성능 최적화',
    ],
    github: 'https://github.com/johndoe/task-manager',
    demo: 'https://taskmanager-demo.vercel.app',
    status: '완료',
    category: 'web',
    featured: true,
  },
  {
    id: 3,
    title: '날씨 앱',
    description: '현재 위치의 날씨와 7일 예보를 보여주는 반응형 웹 애플리케이션입니다.',
    longDescription: '깔끔한 디자인과 직관적인 인터페이스로 날씨 정보를 제공하는 PWA입니다. 위치 기반 서비스와 즐겨찾기 기능을 지원합니다.',
    technologies: ['React', 'Weather API', 'Chart.js', 'PWA'],
    features: [
      '현재 날씨 및 7일 예보',
      '위치 기반 날씨 정보',
      '즐겨찾기 도시 관리',
      '날씨 차트 시각화',
      'PWA 지원',
    ],
    github: 'https://github.com/johndoe/weather-app',
    demo: 'https://weather-demo.vercel.app',
    status: '완료',
    category: 'web',
    featured: false,
  },
  {
    id: 4,
    title: '포트폴리오 웹사이트',
    description: '현재 보고 계신 포트폴리오 웹사이트입니다.',
    longDescription: 'Next.js와 Material-UI를 활용해 제작한 개인 포트폴리오 사이트입니다. 반응형 디자인과 다크모드를 지원합니다.',
    technologies: ['Next.js', 'Material-UI', 'TypeScript', 'Framer Motion'],
    features: [
      '반응형 디자인',
      '다크/라이트 테마',
      '부드러운 애니메이션',
      'SEO 최적화',
      '연락처 폼',
    ],
    github: 'https://github.com/johndoe/portfolio',
    demo: 'https://johndoe-portfolio.vercel.app',
    status: '완료',
    category: 'web',
    featured: true,
  },
  {
    id: 5,
    title: '실시간 채팅 앱',
    description: 'Socket.io를 활용한 실시간 채팅 애플리케이션입니다.',
    longDescription: '개인 및 그룹 채팅을 지원하는 실시간 메신저 앱입니다. 파일 전송과 이모티콘 기능을 포함합니다.',
    technologies: ['React', 'Socket.io', 'Express', 'MongoDB'],
    features: [
      '실시간 개인/그룹 채팅',
      '파일 및 이미지 전송',
      '온라인 상태 표시',
      '메시지 검색',
      '푸시 알림',
    ],
    github: 'https://github.com/johndoe/chat-app',
    status: '진행중',
    category: 'web',
    featured: false,
  },
]

// 카테고리별 프로젝트 가져오기
export const getProjectsByCategory = (category: string) => {
  return projects.filter(project => project.category === category)
}

// 추천 프로젝트 가져오기 (홈페이지용)
export const getFeaturedProjects = () => {
  return projects.filter(project => project.featured)
}

// 프로젝트 상태별 가져오기
export const getProjectsByStatus = (status: string) => {
  return projects.filter(project => project.status === status)
}