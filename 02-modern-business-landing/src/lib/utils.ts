// src/lib/utils.ts
/**
 * 공통 유틸리티 함수들
 */

// 클래스명 조합 유틸리티
export const cn = (...classes: (string | undefined | null | boolean)[]) => {
  return classes.filter(Boolean).join(' ')
}

// 이메일 유효성 검사
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// 전화번호 포맷팅
export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '')
  
  if (cleaned.length === 11 && cleaned.startsWith('010')) {
    return cleaned.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3')
  } else if (cleaned.length === 10) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')
  }
  
  return phone
}

// 날짜 포맷팅
export const formatDate = (date: Date, format: 'full' | 'short' = 'full'): string => {
  const options: Intl.DateTimeFormatOptions = format === 'full' 
    ? { year: 'numeric', month: 'long', day: 'numeric' }
    : { year: '2-digit', month: 'short', day: 'numeric' }
  
  return new Intl.DateTimeFormat('ko-KR', options).format(date)
}

// 텍스트 자르기
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

// 스크롤 위치 가져오기
export const getScrollPosition = () => {
  if (typeof window === 'undefined') return 0
  return window.pageYOffset || document.documentElement.scrollTop
}

// 부드러운 스크롤
export const smoothScrollTo = (elementId: string) => {
  if (typeof window === 'undefined') return
  
  const element = document.getElementById(elementId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

// 디바운스 함수
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// 쓰로틀 함수
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

// 로컬 스토리지 유틸리티
export const storage = {
  get: (key: string) => {
    if (typeof window === 'undefined') return null
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch {
      return null
    }
  },
  
  set: (key: string, value: any) => {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      console.error('Failed to save to localStorage')
    }
  },
  
  remove: (key: string) => {
    if (typeof window === 'undefined') return
    localStorage.removeItem(key)
  },
  
  clear: () => {
    if (typeof window === 'undefined') return
    localStorage.clear()
  }
}