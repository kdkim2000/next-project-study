// src/data/experience.ts
// 경력 및 교육 데이터

export interface Experience {
  id: string
  title: string
  company: string
  period: string
  description: string[]
  type: 'work' | 'education'
  location?: string
  technologies?: string[]
}

// 경력 및 교육 데이터
export const experiences: Experience[] = [
  {
    id: '1',
    title: 'Senior Frontend Developer',
    company: 'Tech Innovate Co.',
    period: '2022.03 - 현재',
    location: '서울',
    description: [
      'React와 Next.js를 활용한 대규모 웹 애플리케이션 개발 및 유지보수',
      '팀 내 기술 표준화 및 코드 리뷰 프로세스 개선으로 개발 효율성 30% 향상',
      'TypeScript 도입을 통한 코드 안정성 향상 및 런타임 에러 90% 감소',
      '주니어 개발자 3명 멘토링 및 기술 교육 담당',
    ],
    technologies: ['React', 'Next.js', 'TypeScript', 'Material-UI'],
    type: 'work',
  },
  {
    id: '2',
    title: 'Frontend Developer',
    company: 'Digital Solutions Inc.',
    period: '2020.06 - 2022.02',
    location: '서울',
    description: [
      'Vue.js 기반 SPA 애플리케이션 개발 및 성능 최적화',
      'REST API 연동 및 상태 관리 라이브러리(Vuex) 활용',
      '반응형 웹 디자인 구현으로 모바일 사용자 만족도 25% 향상',
      '크로스 브라우저 호환성 확보 및 웹 접근성 개선',
    ],
    technologies: ['Vue.js', 'Vuex', 'JavaScript', 'SCSS'],
    type: 'work',
  },
  {
    id: '3',
    title: '기계공학과 학사',
    company: '부산대학교',
    period: '1993.03 - 2000.06',
    location: '부산',
    description: [
      '전공 평점: 4.2/4.5 (magna cum laude)',
      '졸업작품: 실시간 협업 코드 에디터 개발',
      '프로그래밍 동아리 회장 역임 (2018-2019)',
      '알고리즘 대회 은상 수상 (2019)',
    ],
    type: 'education',
  },
  {
    id: '4',
    title: 'Junior Web Developer (인턴)',
    company: 'StartUp Studio',
    period: '2019.07 - 2019.08',
    location: '서울',
    description: [
      'HTML, CSS, JavaScript를 활용한 웹페이지 제작',
      'WordPress 커스터마이징 및 플러그인 개발',
      '반응형 웹사이트 구축 및 SEO 최적화',
      '고객 요구사항 분석 및 프로젝트 기획 참여',
    ],
    technologies: ['HTML', 'CSS', 'JavaScript', 'WordPress'],
    type: 'work',
  },
]

// 업무 경력만 가져오기
export const getWorkExperience = () => {
  return experiences.filter(exp => exp.type === 'work')
}

// 교육 경력만 가져오기
export const getEducationExperience = () => {
  return experiences.filter(exp => exp.type === 'education')
}

// 총 경력 계산
export const getTotalExperience = () => {
  const workExp = getWorkExperience()
  // 간단한 계산 (실제로는 더 정교하게 계산 필요)
  return `${workExp.length}년+`
}