// src/lib/validationSchemas.ts
// 📋 React Hook Form + Yup 검증 스키마 정의

import * as yup from 'yup';

// 🏷️ 기본 연락처 폼 스키마
export const contactFormSchema = yup.object({
  name: yup
    .string()
    .required('이름은 필수입니다')
    .min(2, '이름은 최소 2글자 이상이어야 합니다')
    .max(50, '이름은 50글자를 초과할 수 없습니다')
    .matches(/^[가-힣a-zA-Z\s]+$/, '이름에는 한글, 영문, 공백만 사용 가능합니다'),
    
  email: yup
    .string()
    .required('이메일은 필수입니다')
    .email('올바른 이메일 형식을 입력해주세요')
    .max(100, '이메일은 100글자를 초과할 수 없습니다'),
    
  phone: yup
    .string()
    .notRequired()
    .matches(
      /^(01[016789])-?(\d{3,4})-?(\d{4})$/,
      '올바른 휴대폰 번호 형식을 입력해주세요 (예: 010-1234-5678)'
    )
    .nullable(),
    
  company: yup
    .string()
    .notRequired()
    .max(100, '회사명은 100글자를 초과할 수 없습니다')
    .nullable(),
    
  subject: yup
    .string()
    .required('제목은 필수입니다')
    .min(5, '제목은 최소 5글자 이상이어야 합니다')
    .max(100, '제목은 100글자를 초과할 수 없습니다'),
    
  message: yup
    .string()
    .required('메시지는 필수입니다')
    .min(10, '메시지는 최소 10글자 이상 작성해주세요')
    .max(1000, '메시지는 1000글자를 초과할 수 없습니다'),
});

// 🏷️ 견적 요청 폼 스키마
export const quoteFormSchema = yup.object({
  // 기본 연락처 정보
  name: yup
    .string()
    .required('이름은 필수입니다')
    .min(2, '이름은 최소 2글자 이상이어야 합니다'),
    
  email: yup
    .string()
    .required('이메일은 필수입니다')
    .email('올바른 이메일 형식을 입력해주세요'),
    
  phone: yup
    .string()
    .required('연락처는 필수입니다')
    .matches(
      /^(01[016789])-?(\d{3,4})-?(\d{4})$/,
      '올바른 휴대폰 번호를 입력해주세요'
    ),
    
  company: yup
    .string()
    .required('회사명은 필수입니다')
    .min(2, '회사명은 최소 2글자 이상이어야 합니다'),
    
  // 프로젝트 정보
  serviceId: yup
    .number()
    .required('서비스를 선택해주세요')
    .min(1, '올바른 서비스를 선택해주세요'),
    
  requirements: yup
    .string()
    .required('프로젝트 요구사항을 입력해주세요')
    .min(20, '요구사항은 최소 20글자 이상 상세히 작성해주세요')
    .max(2000, '요구사항은 2000글자를 초과할 수 없습니다'),
    
  budget: yup
    .string()
    .notRequired()
    .oneOf(
      ['50만원 미만', '50-100만원', '100-300만원', '300-500만원', '500만원 이상', '협의'],
      '올바른 예산 범위를 선택해주세요'
    )
    .nullable(),
    
  timeline: yup
    .string()
    .notRequired()
    .oneOf(
      ['1개월 이내', '2-3개월', '3-6개월', '6개월 이상', '협의'],
      '올바른 프로젝트 기간을 선택해주세요'
    )
    .nullable(),
    
  // 추가 정보
  hasExistingWebsite: yup
    .boolean()
    .notRequired(),
    
  existingWebsiteUrl: yup
    .string()
    .nullable()
    .when('hasExistingWebsite', {
      is: true,
      then: (schema) => schema
        .required('기존 웹사이트 URL을 입력해주세요')
        .url('올바른 URL 형식을 입력해주세요'),
      otherwise: (schema) => schema.nullable(),
    }),
    
  preferredContactTime: yup
    .string()
    .notRequired()
    .oneOf(
      ['오전 (09:00-12:00)', '오후 (13:00-18:00)', '저녁 (18:00-21:00)', '언제나'],
      '올바른 연락 희망 시간을 선택해주세요'
    )
    .nullable(),
    
  marketingConsent: yup
    .boolean()
    .notRequired()
    .default(false),
});

// 🏷️ 뉴스레터 구독 스키마
export const newsletterSchema = yup.object({
  email: yup
    .string()
    .required('이메일 주소를 입력해주세요')
    .email('올바른 이메일 형식을 입력해주세요'),
    
  interests: yup
    .array()
    .of(yup.string())
    .min(1, '최소 하나의 관심 분야를 선택해주세요')
    .max(5, '최대 5개까지 선택 가능합니다'),
    
  frequency: yup
    .string()
    .required('수신 빈도를 선택해주세요')
    .oneOf(['weekly', 'monthly', 'quarterly'], '올바른 수신 빈도를 선택해주세요'),
});

// 🏷️ 간단한 로그인 폼 스키마 (데모용)
export const loginSchema = yup.object({
  email: yup
    .string()
    .required('이메일을 입력해주세요')
    .email('올바른 이메일 형식을 입력해주세요'),
    
  password: yup
    .string()
    .required('비밀번호를 입력해주세요')
    .min(8, '비밀번호는 최소 8글자 이상이어야 합니다')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      '비밀번호는 대소문자, 숫자, 특수문자를 포함해야 합니다'
    ),
    
  rememberMe: yup
    .boolean()
    .notRequired()
    .default(false),
});

// 🏷️ 검색 폼 스키마
export const searchSchema = yup.object({
  query: yup
    .string()
    .required('검색어를 입력해주세요')
    .min(2, '검색어는 최소 2글자 이상이어야 합니다')
    .max(100, '검색어는 100글자를 초과할 수 없습니다'),
    
  category: yup
    .string()
    .notRequired()
    .oneOf(['all', 'services', 'blog', 'team'], '올바른 카테고리를 선택해주세요')
    .default('all'),
});

// 🛠️ 커스텀 검증 함수들
export const customValidation = {
  // 한국 전화번호 형식 검증
  koreanPhoneNumber: (value?: string) => {
    if (!value) return true;
    const phoneRegex = /^(01[016789]|02|0[3-9][0-9])-?(\d{3,4})-?(\d{4})$/;
    return phoneRegex.test(value);
  },
  
  // 한국 사업자등록번호 검증 (XXX-XX-XXXXX)
  businessNumber: (value?: string) => {
    if (!value) return true;
    const businessRegex = /^\d{3}-\d{2}-\d{5}$/;
    return businessRegex.test(value);
  },
  
  // 파일 크기 검증 (MB 단위)
  fileSize: (maxSizeMB: number) => (value?: FileList) => {
    if (!value || value.length === 0) return true;
    const file = value[0];
    return file.size <= maxSizeMB * 1024 * 1024;
  },
  
  // 파일 확장자 검증
  fileExtension: (allowedExtensions: string[]) => (value?: FileList) => {
    if (!value || value.length === 0) return true;
    const file = value[0];
    const extension = file.name.split('.').pop()?.toLowerCase();
    return extension ? allowedExtensions.includes(extension) : false;
  },
  
  // 강한 비밀번호 검증
  strongPassword: (value?: string) => {
    if (!value) return false;
    const hasLower = /[a-z]/.test(value);
    const hasUpper = /[A-Z]/.test(value);
    const hasNumber = /\d/.test(value);
    const hasSpecial = /[@$!%*?&]/.test(value);
    const minLength = value.length >= 8;
    
    return hasLower && hasUpper && hasNumber && hasSpecial && minLength;
  },
};

// 📊 폼 타입 추론을 위한 유틸리티
export type ContactFormData = yup.InferType<typeof contactFormSchema>;
export type QuoteFormData = yup.InferType<typeof quoteFormSchema>;
export type NewsletterFormData = yup.InferType<typeof newsletterSchema>;
export type LoginFormData = yup.InferType<typeof loginSchema>;
export type SearchFormData = yup.InferType<typeof searchSchema>;

// 🎯 동적 스키마 생성 함수
export const createDynamicSchema = (requiredFields: string[]) => {
  const baseSchema: any = {};
  
  if (requiredFields.includes('name')) {
    baseSchema.name = yup.string().required('이름은 필수입니다');
  }
  
  if (requiredFields.includes('email')) {
    baseSchema.email = yup
      .string()
      .required('이메일은 필수입니다')
      .email('올바른 이메일 형식을 입력해주세요');
  }
  
  if (requiredFields.includes('phone')) {
    baseSchema.phone = yup
      .string()
      .required('전화번호는 필수입니다')
      .matches(/^(01[016789])-?(\d{3,4})-?(\d{4})$/, '올바른 전화번호를 입력해주세요');
  }
  
  return yup.object(baseSchema);
};

export default {
  contactFormSchema,
  quoteFormSchema,
  newsletterSchema,
  loginSchema,
  searchSchema,
  customValidation,
  createDynamicSchema,
};

/* 
📚 학습 노트: React Hook Form + Yup 검증 시스템

1. 🎯 스키마 기반 검증:
   - 재사용 가능한 검증 규칙
   - TypeScript 타입 자동 추론
   - 일관된 에러 메시지

2. 🔍 고급 검증 패턴:
   - 조건부 검증 (when 사용)
   - 커스텀 검증 함수
   - 정규표현식 활용

3. 📱 한국 환경 최적화:
   - 한국 전화번호 형식
   - 한글 이름 검증
   - 사업자등록번호 형식

4. 🎨 사용자 경험:
   - 명확한 오류 메시지
   - 실시간 검증 피드백
   - 접근성 고려

5. 🔧 확장성:
   - 동적 스키마 생성
   - 모듈화된 검증 함수
   - 재사용 가능한 패턴
*/
