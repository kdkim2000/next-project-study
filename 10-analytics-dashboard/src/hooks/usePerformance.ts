// src/hooks/usePerformance.ts - INP 메트릭 이름 업데이트
'use client';

import { useState, useEffect } from 'react';
import { WebVitalMetric, performanceStore } from '@/lib/web-vitals';

export interface PerformanceData {
  metrics: Record<string, WebVitalMetric>;
  summary: {
    total: number;
    good: number;
    needsImprovement: number;
    poor: number;
    score: number;
  };
  isLoading: boolean;
}

export function usePerformance(): PerformanceData {
  const [metrics, setMetrics] = useState<Record<string, WebVitalMetric>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 초기 메트릭 로드
    const initialMetrics = performanceStore.getLatestMetrics();
    setMetrics(initialMetrics);
    setIsLoading(Object.keys(initialMetrics).length === 0);

    // 실시간 업데이트 구독
    const unsubscribe = performanceStore.subscribe((newMetric) => {
      setMetrics(prev => ({
        ...prev,
        [newMetric.name]: newMetric
      }));
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  // 성능 점수 계산 (0-100)
  const calculateScore = (metricsData: Record<string, WebVitalMetric>): number => {
    const values = Object.values(metricsData);
    if (values.length === 0) return 0;

    const scores = values.map(metric => {
      switch (metric.rating) {
        case 'good': return 100;
        case 'needs-improvement': return 70;
        case 'poor': return 30;
        default: return 0;
      }
    });

    return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
  };

  const summary = {
    total: Object.keys(metrics).length,
    good: Object.values(metrics).filter(m => m.rating === 'good').length,
    needsImprovement: Object.values(metrics).filter(m => m.rating === 'needs-improvement').length,
    poor: Object.values(metrics).filter(m => m.rating === 'poor').length,
    score: calculateScore(metrics)
  };

  return {
    metrics,
    summary,
    isLoading
  };
}