// src/lib/api.ts
// 🌐 Fake API 서비스 - 실제 백엔드 대신 Mock 데이터 제공

import axios from 'axios';

// 🏷️ API 응답 타입 정의
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject: string;
  message: string;
}

export interface Service {
  id: number;
  title: string;
  description: string;
  icon: string;
  features: string[];
  price: string;
  popular?: boolean;
}

export interface TeamMember {
  id: number;
  name: string;
  position: string;
  description: string;
  avatar: string;
  email?: string;
  linkedin?: string;
}

export interface CompanyInfo {
  name: string;
  tagline: string;
  description: string;
  established: number;
  employees: number;
  projects: number;
}

// 🎯 환경 변수에서 설정 가져오기
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';
const ENABLE_MOCK_API = process.env.NEXT_PUBLIC_ENABLE_MOCK_API === 'true';
const API_DELAY = parseInt(process.env.NEXT_PUBLIC_API_DELAY || '1000');

// 🔧 Axios 인스턴스 생성
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 📊 Mock 데이터
const MOCK_SERVICES: Service[] = [
  {
    id: 1,
    title: '웹 개발',
    description: '최신 기술을 활용한 반응형 웹사이트와 웹 애플리케이션 개발',
    icon: '💻',
    features: [
      'Next.js / React 개발',
      '반응형 디자인',
      'SEO 최적화',
      '성능 최적화',
      '유지보수 지원'
    ],
    price: '300만원부터',
    popular: true,
  },
  {
    id: 2,
    title: '모바일 앱',
    description: 'iOS/Android 네이티브 및 크로스플랫폼 모바일 애플리케이션',
    icon: '📱',
    features: [
      'React Native 개발',
      '네이티브 앱 개발',
      '앱스토어 배포',
      '푸시 알림',
      '오프라인 지원'
    ],
    price: '500만원부터',
  },
  {
    id: 3,
    title: '디지털 마케팅',
    description: 'SEO, 소셜미디어, 콘텐츠 마케팅을 통한 온라인 브랜딩',
    icon: '📈',
    features: [
      'SEO 최적화',
      '구글 애즈 관리',
      '소셜미디어 마케팅',
      '콘텐츠 제작',
      '분석 리포트'
    ],
    price: '100만원부터',
  },
  {
    id: 4,
    title: 'UI/UX 디자인',
    description: '사용자 중심의 직관적이고 아름다운 인터페이스 디자인',
    icon: '🎨',
    features: [
      '사용자 리서치',
      '와이어프레임 설계',
      '프로토타입 제작',
      '디자인 시스템',
      '사용성 테스트'
    ],
    price: '200만원부터',
  },
  {
    id: 5,
    title: '클라우드 인프라',
    description: '안정적이고 확장 가능한 클라우드 인프라 구축 및 관리',
    icon: '☁️',
    features: [
      'AWS/Azure 구축',
      '자동 스케일링',
      '모니터링 시스템',
      '백업 및 복구',
      '보안 강화'
    ],
    price: '150만원부터',
  },
  {
    id: 6,
    title: '컨설팅',
    description: '비즈니스 목표에 맞는 IT 전략 수립 및 기술 컨설팅',
    icon: '💡',
    features: [
      '기술 전략 수립',
      '시스템 분석',
      '개선 방안 제시',
      '프로젝트 관리',
      '교육 및 트레이닝'
    ],
    price: '협의',
  },
];

const MOCK_TEAM_MEMBERS: TeamMember[] = [
  {
    id: 1,
    name: '김철수',
    position: 'CEO',
    description: '10년 이상의 IT 경험을 바탕으로 회사를 이끌고 있습니다.',
    avatar: '👨‍💼',
    email: 'ceo@modernbusiness.com',
    linkedin: 'https://linkedin.com/in/kimcheolsu',
  },
  {
    id: 2,
    name: '박영희',
    position: 'CTO',
    description: '최신 기술 트렌드를 반영한 솔루션을 개발합니다.',
    avatar: '👩‍💻',
    email: 'cto@modernbusiness.com',
    linkedin: 'https://linkedin.com/in/parkyounghee',
  },
  {
    id: 3,
    name: '이민수',
    position: '디자인 팀장',
    description: '사용자 경험을 최우선으로 생각하는 디자인을 합니다.',
    avatar: '🎨',
    email: 'design@modernbusiness.com',
    linkedin: 'https://linkedin.com/in/leeminsu',
  },
];

const MOCK_COMPANY_INFO: CompanyInfo = {
  name: 'Modern Business',
  tagline: '혁신적인 비즈니스 솔루션',
  description: 'Next.js와 MUI를 활용한 현대적인 웹 개발',
  established: 2020,
  employees: 25,
  projects: 150,
};

// ⏱️ 지연 시간 시뮬레이션 함수
const delay = (ms: number): Promise<void> => 
  new Promise(resolve => setTimeout(resolve, ms));

// 🛠️ API 서비스 함수들

/**
 * 연락처 폼 제출
 */
export async function submitContactForm(data: ContactFormData): Promise<ApiResponse<{ id: string }>> {
  if (ENABLE_MOCK_API) {
    await delay(API_DELAY);
    
    // 간단한 검증 시뮬레이션
    if (!data.email || !data.name || !data.message) {
      return {
        success: false,
        error: '필수 필드가 누락되었습니다.',
      };
    }
    
    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return {
        success: false,
        error: '올바른 이메일 형식을 입력해주세요.',
      };
    }
    
    // 성공 응답 시뮬레이션
    const mockId = `contact_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    console.log('📧 연락처 폼 제출 (Mock):', data);
    
    return {
      success: true,
      data: { id: mockId },
      message: '메시지가 성공적으로 전송되었습니다!',
    };
  }
  
  // 실제 API 호출 (추후 구현)
  try {
    const response = await api.post('/contact', data);
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.error || '서버 오류가 발생했습니다.',
    };
  }
}

/**
 * 서비스 목록 가져오기
 */
export async function getServices(): Promise<ApiResponse<Service[]>> {
  if (ENABLE_MOCK_API) {
    await delay(API_DELAY / 2);
    
    return {
      success: true,
      data: MOCK_SERVICES,
      message: '서비스 목록을 성공적으로 가져왔습니다.',
    };
  }
  
  try {
    const response = await api.get('/services');
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error: '서비스 데이터를 불러올 수 없습니다.',
    };
  }
}

/**
 * 개별 서비스 정보 가져오기
 */
export async function getService(id: number): Promise<ApiResponse<Service>> {
  if (ENABLE_MOCK_API) {
    await delay(API_DELAY / 3);
    
    const service = MOCK_SERVICES.find(s => s.id === id);
    
    if (!service) {
      return {
        success: false,
        error: '서비스를 찾을 수 없습니다.',
      };
    }
    
    return {
      success: true,
      data: service,
    };
  }
  
  try {
    const response = await api.get(`/services/${id}`);
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error: '서비스 정보를 불러올 수 없습니다.',
    };
  }
}

/**
 * 팀 멤버 목록 가져오기
 */
export async function getTeamMembers(): Promise<ApiResponse<TeamMember[]>> {
  if (ENABLE_MOCK_API) {
    await delay(API_DELAY / 2);
    
    return {
      success: true,
      data: MOCK_TEAM_MEMBERS,
    };
  }
  
  try {
    const response = await api.get('/team');
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error: '팀 정보를 불러올 수 없습니다.',
    };
  }
}

/**
 * 회사 정보 가져오기
 */
export async function getCompanyInfo(): Promise<ApiResponse<CompanyInfo>> {
  if (ENABLE_MOCK_API) {
    await delay(API_DELAY / 4);
    
    return {
      success: true,
      data: MOCK_COMPANY_INFO,
    };
  }
  
  try {
    const response = await api.get('/company');
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error: '회사 정보를 불러올 수 없습니다.',
    };
  }
}

/**
 * 견적 요청 제출
 */
export async function submitQuoteRequest(data: {
  serviceId: number;
  contactInfo: Pick<ContactFormData, 'name' | 'email' | 'phone' | 'company'>;
  requirements: string;
  budget?: string;
  timeline?: string;
}): Promise<ApiResponse<{ quoteId: string; estimatedPrice: string }>> {
  if (ENABLE_MOCK_API) {
    await delay(API_DELAY);
    
    const mockQuoteId = `quote_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // 서비스에 따른 예상 가격 시뮬레이션
    const service = MOCK_SERVICES.find(s => s.id === data.serviceId);
    const estimatedPrice = service?.price || '협의';
    
    console.log('💰 견적 요청 제출 (Mock):', data);
    
    return {
      success: true,
      data: {
        quoteId: mockQuoteId,
        estimatedPrice,
      },
      message: '견적 요청이 접수되었습니다. 24시간 내에 연락드리겠습니다.',
    };
  }
  
  try {
    const response = await api.post('/quote', data);
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error: '견적 요청 처리 중 오류가 발생했습니다.',
    };
  }
}

// 🔄 SWR을 위한 fetcher 함수
export const fetcher = async (url: string) => {
  const response = await api.get(url);
  return response.data;
};

export default api;

/* 
📚 학습 노트: Fake API와 실제 API 통합

1. 🎯 환경 변수 활용:
   - NEXT_PUBLIC_ENABLE_MOCK_API로 Mock/실제 API 전환
   - API_DELAY로 네트워크 지연 시뮬레이션
   - 개발/운영 환경별 다른 설정

2. 📡 Mock API 장점:
   - 백엔드 없이 프론트엔드 개발 가능
   - 실제 API와 동일한 인터페이스
   - 에러 상황 시뮬레이션 가능
   - 빠른 프로토타이핑

3. 🔄 실제 API로 전환:
   - ENABLE_MOCK_API를 false로 변경
   - 백엔드 API 엔드포인트 연결
   - 기존 코드 수정 없이 전환 가능

4. 📊 타입 안전성:
   - TypeScript로 API 응답 타입 정의
   - 컴파일 타임 오류 방지
   - 개발자 경험 향상

5. ⚡ 성능 최적화:
   - Axios 인스턴스로 공통 설정
   - 타임아웃 설정으로 사용자 경험 향상
   - SWR과 통합 준비
*/
