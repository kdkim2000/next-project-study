// lib/api.ts
import { ContactFormData } from './validation';

// 환경 변수에서 API URL 가져오기
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
const CONTACT_ENDPOINT = process.env.NEXT_PUBLIC_CONTACT_ENDPOINT || '/contact';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message: string;
  error?: string;
}

// Contact Form 제출 함수
export async function submitContactForm(formData: ContactFormData): Promise<ApiResponse> {
  try {
    // 실제 환경에서는 여기서 실제 API 호출
    // 지금은 교육 목적으로 시뮬레이션
    
    console.log('📤 Contact Form Submission:', {
      url: `${API_BASE_URL}${CONTACT_ENDPOINT}`,
      data: formData,
      timestamp: new Date().toISOString(),
    });

    // 개발 환경에서 API 호출 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 1500)); // 1.5초 지연

    // 성공률 80%로 시뮬레이션 (교육 목적)
    const isSuccess = Math.random() > 0.2;

    if (isSuccess) {
      return {
        success: true,
        message: process.env.NEXT_PUBLIC_SUCCESS_MESSAGE || '문의사항이 성공적으로 전송되었습니다.',
        data: {
          id: `contact_${Date.now()}`,
          submittedAt: new Date().toISOString(),
        }
      };
    } else {
      throw new Error('서버 오류가 발생했습니다.');
    }

    /* 
    // 실제 API 호출 예시 (프로덕션 환경)
    const response = await fetch(`${API_BASE_URL}${CONTACT_ENDPOINT}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
    */

  } catch (error) {
    console.error('❌ Contact Form Error:', error);
    
    return {
      success: false,
      message: process.env.NEXT_PUBLIC_ERROR_MESSAGE || '전송 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
      error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
    };
  }
}

// 환경 변수 정보 조회 함수 (개발용)
export function getEnvironmentInfo() {
  return {
    apiUrl: API_BASE_URL,
    contactEndpoint: CONTACT_ENDPOINT,
    environment: process.env.NEXT_PUBLIC_APP_ENV || 'development',
    version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
  };
}