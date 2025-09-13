// src/lib/utils.ts
/**
 * 유틸리티 함수 모음
 * 자주 사용되는 헬퍼 함수들을 모아둔 파일
 */

/**
 * 시간을 한국어 형식으로 포맷팅
 * 예: "오후 2:30", "오전 9:15"
 */
export const formatTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return dateObj.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true, // 12시간 형식 (오전/오후)
  });
};

/**
 * 날짜와 시간을 함께 포맷팅
 * 예: "12월 25일 오후 2:30"
 */
export const formatDateTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return dateObj.toLocaleString('ko-KR', {
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

/**
 * 상대적 시간 표시
 * 예: "방금 전", "5분 전", "1시간 전"
 */
export const getRelativeTime = (date: Date | string): string => {
  const now = new Date();
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const diffMs = now.getTime() - dateObj.getTime();
  
  // 밀리초를 다른 단위로 변환
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSeconds < 30) {
    return '방금 전';
  } else if (diffSeconds < 60) {
    return `${diffSeconds}초 전`;
  } else if (diffMinutes < 60) {
    return `${diffMinutes}분 전`;
  } else if (diffHours < 24) {
    return `${diffHours}시간 전`;
  } else if (diffDays < 7) {
    return `${diffDays}일 전`;
  } else {
    // 일주일 이상은 정확한 날짜 표시
    return formatDateTime(dateObj);
  }
};

/**
 * 파일 크기를 읽기 쉬운 형식으로 변환
 * 예: 1024 → "1KB", 1048576 → "1MB"
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * 랜덤 ID 생성
 * 메시지 ID나 사용자 ID 생성 시 사용
 */
export const generateId = (prefix: string = 'id'): string => {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * 랜덤 사용자 이름 생성
 * 테스트용으로 사용 (실제로는 로그인 시스템에서 받아와야 함)
 */
export const generateRandomUserName = (): string => {
  const adjectives = [
    '행복한', '즐거운', '멋진', '귀여운', '똑똑한', 
    '친절한', '활발한', '조용한', '재미있는', '신나는'
  ];
  
  const nouns = [
    '고양이', '강아지', '토끼', '햄스터', '팬더', 
    '코알라', '펭귄', '돌고래', '나비', '별'
  ];
  
  const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
  const randomNumber = Math.floor(Math.random() * 1000);
  
  return `${randomAdjective} ${randomNoun}${randomNumber}`;
};

/**
 * 문자열이 비어있는지 확인 (공백 제거 후)
 */
export const isEmpty = (str: string): boolean => {
  return !str || str.trim().length === 0;
};

/**
 * 이메일 형식인지 간단하게 확인
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * 파일이 이미지인지 확인
 */
export const isImageFile = (file: File): boolean => {
  return file.type.startsWith('image/');
};

/**
 * 허용된 파일 타입인지 확인
 */
export const isAllowedFileType = (file: File, allowedTypes: string[]): boolean => {
  return allowedTypes.some(type => {
    if (type.includes('*')) {
      // 와일드카드 지원 (예: "image/*")
      return file.type.startsWith(type.replace('*', ''));
    } else if (type.startsWith('.')) {
      // 확장자 지원 (예: ".jpg")
      return file.name.toLowerCase().endsWith(type.toLowerCase());
    } else {
      // 정확한 MIME 타입 (예: "image/jpeg")
      return file.type === type;
    }
  });
};

/**
 * 클립보드에 텍스트 복사
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('클립보드 복사 실패:', error);
    return false;
  }
};

/**
 * 로컬 스토리지에 데이터 저장 (에러 처리 포함)
 */
export const saveToStorage = (key: string, data: any): boolean => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('로컬 스토리지 저장 실패:', error);
    return false;
  }
};

/**
 * 로컬 스토리지에서 데이터 불러오기
 */
export const loadFromStorage = (key: string, defaultValue: any = null): any => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('로컬 스토리지 로드 실패:', error);
    return defaultValue;
  }
};

/**
 * 디바운스 함수 (검색이나 API 호출 최적화)
 * 짧은 시간 내에 여러 번 호출되면 마지막 호출만 실행
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * 쓰로틀 함수 (스크롤이나 리사이즈 이벤트 최적화)
 * 지정된 시간 간격으로만 함수 실행
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};