// src/data/personal.ts
// 개인정보 데이터 (여기서만 수정하면 모든 곳에 반영됨)

export const personalInfo = {
  // 기본 정보
  name: 'KIM KYUNG DUCK',
  koreanName: '김경덕',
  title: '프론트엔드 개발자',
  subtitle: '열정적인 프론트엔드 개발자',
  
  // 소개글
  shortIntro: 'React, Next.js, TypeScript를 활용하여 사용자 친화적인 웹 애플리케이션을 개발합니다.',
  longIntro: '4년간의 웹 개발 경험을 바탕으로 사용자 경험을 중시하는 개발자입니다. 깨끗한 코드와 효율적인 솔루션을 추구하며, 새로운 기술 학습을 즐깁니다. 팀워크를 통한 협업과 지속적인 성장을 중요하게 생각합니다.',
  
  // 연락처 정보
  contact: {
    email: 'john@example.com',
    phone: '+82 10-1234-5678',
    location: '서울특별시, 대한민국',
    responseTime: '24-48시간 내 답변',
  },
  
  // 소셜 미디어
  social: {
    github: 'https://github.com/kdkim2000',
    linkedin: 'https://linkedin.com/in/kdkim2000',
    twitter: 'https://twitter.com/kdkim2000',
    email: 'mailto:john@example.com',
  },
  
  // 개발 철학
  philosophy: '좋은 코드는 기능적일 뿐만 아니라 읽기 쉽고 유지보수가 용이해야 한다는 믿음으로 개발합니다. 사용자의 니즈를 깊이 이해하고, 기술적 완성도와 사용성을 모두 만족시키는 제품을 만들기 위해 끊임없이 학습하고 성장하고 있습니다.',
}

// SEO 관련 정보
export const seoInfo = {
  siteName: 'kyung duck Portfolio',
  siteUrl: 'https://johndoe-portfolio.vercel.app',
  description: '열정적인 프론트엔드 개발자 John Doe의 포트폴리오',
  keywords: ['프론트엔드', '개발자', 'React', 'Next.js', 'TypeScript', '포트폴리오'],
}