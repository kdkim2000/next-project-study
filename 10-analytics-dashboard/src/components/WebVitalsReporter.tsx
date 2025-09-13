// src/components/WebVitalsReporter.tsx - Web Vitals 리포터 컴포넌트
'use client';

import { useEffect } from 'react';
import { startWebVitalsCollection } from '@/lib/web-vitals';

export default function WebVitalsReporter() {
  useEffect(() => {
    // Web Vitals 수집 시작
    startWebVitalsCollection();
  }, []);

  // 이 컴포넌트는 UI를 렌더링하지 않음
  return null;
}