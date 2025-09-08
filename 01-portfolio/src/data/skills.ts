// src/data/skills.ts
// 기술 스택 데이터

export interface Skill {
  name: string
  level: '초급' | '중급' | '고급' | '전문가'
  experience: string // 사용 경험
  color: 'primary' | 'success' | 'warning' | 'info'
}

// 메인 기술 스택 (홈페이지에 표시)
export const mainSkills: Skill[] = [
  {
    name: 'React',
    level: '고급',
    experience: '3년',
    color: 'success',
  },
  {
    name: 'Next.js',
    level: '고급',
    experience: '2년',
    color: 'success',
  },
  {
    name: 'TypeScript',
    level: '중급',
    experience: '2년',
    color: 'primary',
  },
  {
    name: 'JavaScript',
    level: '고급',
    experience: '4년',
    color: 'success',
  },
  {
    name: 'Material-UI',
    level: '중급',
    experience: '1.5년',
    color: 'primary',
  },
  {
    name: 'Tailwind CSS',
    level: '중급',
    experience: '1년',
    color: 'primary',
  },
]

// 전체 기술 스택 (About 페이지용)
export const allSkills = {
  frontend: [
    { name: 'React', level: '고급', experience: '3년' },
    { name: 'Next.js', level: '고급', experience: '2년' },
    { name: 'Vue.js', level: '중급', experience: '1년' },
    { name: 'TypeScript', level: '중급', experience: '2년' },
    { name: 'JavaScript', level: '고급', experience: '4년' },
    { name: 'HTML/CSS', level: '고급', experience: '4년' },
  ],
  styling: [
    { name: 'Material-UI', level: '중급', experience: '1.5년' },
    { name: 'Tailwind CSS', level: '중급', experience: '1년' },
    { name: 'Styled Components', level: '중급', experience: '1년' },
    { name: 'SCSS/Sass', level: '중급', experience: '2년' },
  ],
  backend: [
    { name: 'Node.js', level: '중급', experience: '1.5년' },
    { name: 'Express.js', level: '중급', experience: '1년' },
    { name: 'MongoDB', level: '초급', experience: '6개월' },
    { name: 'PostgreSQL', level: '초급', experience: '6개월' },
  ],
  tools: [
    { name: 'Git', level: '고급', experience: '4년' },
    { name: 'VS Code', level: '고급', experience: '4년' },
    { name: 'Figma', level: '중급', experience: '1년' },
    { name: 'Docker', level: '초급', experience: '6개월' },
  ],
}

// 현재 학습 중인 기술
export const learningSkills = [
  'Vue.js',
  'Python',
  'Machine Learning',
  'AWS',
  'Three.js',
]