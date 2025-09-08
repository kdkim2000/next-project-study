// src/lib/analytics.ts
/**
 * Google Analytics 유틸리티 함수들
 */

// Google Analytics 이벤트 타입
export interface GAEvent {
  action: string
  category: string
  label?: string
  value?: number
}

// Google Analytics 초기화
export const initGA = () => {
  if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_GA_ID) {
    // Google Analytics 스크립트 로드
    const script = document.createElement('script')
    script.src = `https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`
    script.async = true
    document.head.appendChild(script)

    // gtag 함수 초기화
    window.dataLayer = window.dataLayer || []
    function gtag(...args: any[]) {
      window.dataLayer.push(arguments)
    }
    window.gtag = gtag

    gtag('js', new Date())
    gtag('config', process.env.NEXT_PUBLIC_GA_ID, {
      page_title: document.title,
      page_location: window.location.href,
    })
  }
}

// 페이지뷰 트래킹
export const trackPageView = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', process.env.NEXT_PUBLIC_GA_ID, {
      page_path: url,
    })
  }
}

// 이벤트 트래킹
export const trackEvent = ({ action, category, label, value }: GAEvent) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}

// 일반적인 이벤트들
export const trackButtonClick = (buttonName: string) => {
  trackEvent({
    action: 'click',
    category: 'Button',
    label: buttonName,
  })
}

export const trackFormSubmit = (formName: string) => {
  trackEvent({
    action: 'submit',
    category: 'Form',
    label: formName,
  })
}

export const trackDownload = (fileName: string) => {
  trackEvent({
    action: 'download',
    category: 'File',
    label: fileName,
  })
}