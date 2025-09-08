// src/components/common/AnalyticsProvider.tsx
'use client'
import { useAnalytics } from '@/hooks/useAnalytics'

/**
 * 페이지뷰 자동 추적을 위한 Analytics Provider
 * 모든 페이지 변경을 자동으로 추적
 */
export default function AnalyticsProvider({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  useAnalytics()
  return <>{children}</>
}