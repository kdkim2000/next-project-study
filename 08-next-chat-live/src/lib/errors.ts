// src/lib/errors.ts
/**
 * 에러 처리 및 사용자 친화적 메시지 변환
 * 개발자용 에러를 사용자가 이해할 수 있는 메시지로 변환
 */

// 에러 타입 정의
export type ErrorType = 
  | 'network'     // 네트워크 오류
  | 'server'      // 서버 오류
  | 'validation'  // 입력값 검증 오류
  | 'upload'      // 파일 업로드 오류
  | 'permission'  // 권한 오류
  | 'browser'     // 브라우저 호환성 오류
  | 'unknown';    // 알 수 없는 오류

// 커스텀 에러 클래스
export class ChatError extends Error {
  type: ErrorType;
  originalError?: Error;
  
  constructor(message: string, type: ErrorType = 'unknown', originalError?: Error) {
    super(message);
    this.name = 'ChatError';
    this.type = type;
    this.originalError = originalError;
  }
}

/**
 * 에러를 사용자 친화적인 메시지로 변환
 */
export const getErrorMessage = (error: any): string => {
  // ChatError인 경우 이미 사용자 친화적인 메시지
  if (error instanceof ChatError) {
    return error.message;
  }
  
  // 일반적인 에러 메시지들을 한국어로 변환
  const message = error?.message || error?.toString() || '';
  
  // 네트워크 관련 오류
  if (message.includes('fetch') || message.includes('network')) {
    return '네트워크 연결을 확인해주세요.';
  }
  
  if (message.includes('timeout')) {
    return '서버 응답이 지연되고 있습니다. 잠시 후 다시 시도해주세요.';
  }
  
  if (message.includes('CORS')) {
    return '서버 설정 오류입니다. 관리자에게 문의해주세요.';
  }
  
  // Socket.io 관련 오류
  if (message.includes('socket') || message.includes('connect')) {
    return '실시간 연결에 문제가 있습니다. 페이지를 새로고침해주세요.';
  }
  
  // 파일 관련 오류
  if (message.includes('file') || message.includes('upload')) {
    return '파일 업로드에 실패했습니다. 파일 크기와 형식을 확인해주세요.';
  }
  
  // 권한 관련 오류
  if (message.includes('permission') || message.includes('denied')) {
    return '접근 권한이 없습니다.';
  }
  
  // 기본 메시지
  return '일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
};

/**
 * 에러 타입 감지
 */
export const getErrorType = (error: any): ErrorType => {
  if (error instanceof ChatError) {
    return error.type;
  }
  
  const message = error?.message || error?.toString() || '';
  
  if (message.includes('fetch') || message.includes('network') || message.includes('timeout')) {
    return 'network';
  }
  
  if (message.includes('socket') || message.includes('connect')) {
    return 'server';
  }
  
  if (message.includes('file') || message.includes('upload')) {
    return 'upload';
  }
  
  if (message.includes('permission') || message.includes('denied')) {
    return 'permission';
  }
  
  if (message.includes('browser') || message.includes('support')) {
    return 'browser';
  }
  
  return 'unknown';
};

/**
 * 에러 로깅
 * 개발 환경에서는 콘솔에, 프로덕션에서는 서버로 전송
 */
export const logError = (error: any, context?: string): void => {
  const errorInfo = {
    message: error?.message || 'Unknown error',
    stack: error?.stack,
    type: getErrorType(error),
    context,
    timestamp: new Date().toISOString(),
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown',
    url: typeof window !== 'undefined' ? window.location.href : 'Unknown',
  };
  
  // 개발 환경에서는 상세 로그
  if (process.env.NODE_ENV === 'development') {
    console.group('🔥 Error Log');
    console.error('Error:', error);
    console.log('Context:', context);
    console.log('Type:', errorInfo.type);
    console.log('Time:', errorInfo.timestamp);
    console.groupEnd();
  } else {
    // 프로덕션에서는 간단한 로그
    console.error('Error:', errorInfo.message);
    
    // 여기서 서버로 에러 로그 전송 가능
    // sendErrorToServer(errorInfo);
  }
};

/**
 * 안전한 함수 실행
 * 함수 실행 중 오류가 발생해도 앱이 멈추지 않도록
 */
export const safeExecute = async <T>(
  fn: () => Promise<T> | T,
  fallback?: T,
  context?: string
): Promise<T | undefined> => {
  try {
    return await fn();
  } catch (error) {
    logError(error, context);
    return fallback;
  }
};

/**
 * 재시도 로직이 있는 안전한 함수 실행
 */
export const safeExecuteWithRetry = async <T>(
  fn: () => Promise<T> | T,
  maxRetries: number = 3,
  delay: number = 1000,
  context?: string
): Promise<T | undefined> => {
  let lastError: any;
  
  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      if (i < maxRetries) {
        console.log(`재시도 ${i + 1}/${maxRetries}...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  logError(lastError, `${context} (${maxRetries}번 재시도 후 실패)`);
  return undefined;
};

/**
 * 에러 경계에서 사용할 에러 분석
 */
export const analyzeError = (error: any): {
  isRecoverable: boolean;
  userMessage: string;
  suggestion: string;
} => {
  const type = getErrorType(error);
  const message = getErrorMessage(error);
  
  switch (type) {
    case 'network':
      return {
        isRecoverable: true,
        userMessage: message,
        suggestion: '인터넷 연결을 확인하고 페이지를 새로고침해주세요.',
      };
      
    case 'server':
      return {
        isRecoverable: true,
        userMessage: message,
        suggestion: '서버가 일시적으로 불안정할 수 있습니다. 잠시 후 다시 시도해주세요.',
      };
      
    case 'upload':
      return {
        isRecoverable: true,
        userMessage: message,
        suggestion: '파일 크기는 5MB 이하, 이미지 형식만 업로드 가능합니다.',
      };
      
    case 'browser':
      return {
        isRecoverable: false,
        userMessage: message,
        suggestion: '최신 버전의 브라우저로 업데이트해주세요.',
      };
      
    default:
      return {
        isRecoverable: true,
        userMessage: message,
        suggestion: '문제가 계속되면 페이지를 새로고침하거나 브라우저를 재시작해주세요.',
      };
  }
};