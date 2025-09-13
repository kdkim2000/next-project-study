// src/lib/browser.ts
/**
 * 브라우저 호환성 및 기능 지원 체크
 * 오래된 브라우저에서 에러가 나지 않도록 미리 확인
 */

/**
 * Socket.io 지원 여부 확인
 */
export const isSocketIOSupported = (): boolean => {
  try {
    // WebSocket 지원 확인
    return typeof WebSocket !== 'undefined' || typeof window !== 'undefined';
  } catch {
    return false;
  }
};

/**
 * 파일 업로드 지원 여부 확인
 */
export const isFileUploadSupported = (): boolean => {
  try {
    return typeof FileReader !== 'undefined' && typeof FormData !== 'undefined';
  } catch {
    return false;
  }
};

/**
 * 클립보드 API 지원 여부 확인
 */
export const isClipboardSupported = (): boolean => {
  try {
    return typeof navigator !== 'undefined' && 'clipboard' in navigator;
  } catch {
    return false;
  }
};

/**
 * 로컬 스토리지 지원 여부 확인
 */
export const isLocalStorageSupported = (): boolean => {
  try {
    const test = 'test';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
};

/**
 * 브라우저 이름 감지
 */
export const getBrowserName = (): string => {
  if (typeof navigator === 'undefined') return 'Unknown';
  
  const userAgent = navigator.userAgent;
  
  if (userAgent.includes('Chrome')) return 'Chrome';
  if (userAgent.includes('Firefox')) return 'Firefox';
  if (userAgent.includes('Safari')) return 'Safari';
  if (userAgent.includes('Edge')) return 'Edge';
  if (userAgent.includes('Opera')) return 'Opera';
  
  return 'Unknown';
};

/**
 * 모바일 디바이스 여부 확인
 */
export const isMobile = (): boolean => {
  if (typeof navigator === 'undefined') return false;
  
  return /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

/**
 * 터치 지원 여부 확인
 */
export const isTouchSupported = (): boolean => {
  try {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  } catch {
    return false;
  }
};

/**
 * 브라우저 호환성 종합 체크
 */
export const checkBrowserCompatibility = (): {
  isSupported: boolean;
  warnings: string[];
  info: {
    browser: string;
    isMobile: boolean;
    hasTouch: boolean;
  };
} => {
  const warnings: string[] = [];
  let isSupported = true;

  // 필수 기능 체크
  if (!isSocketIOSupported()) {
    warnings.push('실시간 채팅 기능이 지원되지 않습니다.');
    isSupported = false;
  }

  if (!isFileUploadSupported()) {
    warnings.push('파일 업로드 기능이 지원되지 않습니다.');
  }

  if (!isLocalStorageSupported()) {
    warnings.push('설정 저장 기능이 지원되지 않습니다.');
  }

  if (!isClipboardSupported()) {
    warnings.push('클립보드 복사 기능이 지원되지 않습니다.');
  }

  return {
    isSupported,
    warnings,
    info: {
      browser: getBrowserName(),
      isMobile: isMobile(),
      hasTouch: isTouchSupported(),
    }
  };
};

/**
 * 브라우저 업데이트 권장 메시지
 */
export const getBrowserUpdateMessage = (): string | null => {
  const compatibility = checkBrowserCompatibility();
  
  if (!compatibility.isSupported) {
    return `
현재 브라우저에서는 일부 기능이 제한될 수 있습니다.
최신 버전의 Chrome, Firefox, Safari, Edge 브라우저 사용을 권장합니다.

감지된 문제:
${compatibility.warnings.map(w => `• ${w}`).join('\n')}
    `.trim();
  }
  
  return null;
};