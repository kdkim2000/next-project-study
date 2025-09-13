// src/lib/web-vitals.ts - 최신 web-vitals API로 수정
import { onCLS, onINP, onFCP, onLCP, onTTFB } from 'web-vitals';

export interface WebVitalMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
  timestamp: number;
}

// 성능 임계값 정의 (동일)
const thresholds = {
  CLS: { good: 0.1, poor: 0.25 },
  INP: { good: 200, poor: 500 }, // FID → INP로 변경
  FCP: { good: 1800, poor: 3000 },
  LCP: { good: 2500, poor: 4000 },
  TTFB: { good: 800, poor: 1800 }
};

// 성능 등급 계산 (동일)
function getRating(name: string, value: number): 'good' | 'needs-improvement' | 'poor' {
  const threshold = thresholds[name as keyof typeof thresholds];
  if (!threshold) return 'good';
  
  if (value <= threshold.good) return 'good';
  if (value <= threshold.poor) return 'needs-improvement';
  return 'poor';
}

// 성능 메트릭 저장소 (동일)
class PerformanceStore {
  private metrics: WebVitalMetric[] = [];
  private listeners: ((metric: WebVitalMetric) => void)[] = [];

  addMetric(metric: WebVitalMetric) {
    this.metrics.push(metric);
    this.listeners.forEach(listener => listener(metric));
    
    // 콘솔에 성능 정보 출력 (개발환경에서만)
    if (process.env.NODE_ENV === 'development') {
      console.log(`🚀 Web Vital: ${metric.name}`, {
        value: `${metric.value}ms`,
        rating: metric.rating,
        delta: metric.delta
      });
    }
  }

  getMetrics(): WebVitalMetric[] {
    return [...this.metrics];
  }

  getLatestMetrics(): Record<string, WebVitalMetric> {
    const latest: Record<string, WebVitalMetric> = {};
    this.metrics.forEach(metric => {
      latest[metric.name] = metric;
    });
    return latest;
  }

  subscribe(listener: (metric: WebVitalMetric) => void): () => void {
    this.listeners.push(listener);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }
}

// 글로벌 성능 저장소
export const performanceStore = new PerformanceStore();

// Web Vitals 수집 시작 - 새로운 API 사용
export function startWebVitalsCollection() {
  const handleMetric = (metric: any) => {
    const webVitalMetric: WebVitalMetric = {
      name: metric.name,
      value: Math.round(metric.value),
      rating: getRating(metric.name, metric.value),
      delta: Math.round(metric.delta),
      id: metric.id,
      timestamp: Date.now()
    };
    
    performanceStore.addMetric(webVitalMetric);
  };

  // ✅ 새로운 함수 이름들 사용
  onCLS(handleMetric);   // getCLS → onCLS
  onINP(handleMetric);   // getFID → onINP (FID가 INP로 변경됨)
  onFCP(handleMetric);   // getFCP → onFCP
  onLCP(handleMetric);   // getLCP → onLCP
  onTTFB(handleMetric);  // getTTFB → onTTFB
}

// 성능 리포트 생성 (동일)
export function generatePerformanceReport() {
  const metrics = performanceStore.getLatestMetrics();
  const report = {
    timestamp: new Date().toISOString(),
    url: typeof window !== 'undefined' ? window.location.href : '',
    metrics: metrics,
    summary: {
      total: Object.keys(metrics).length,
      good: Object.values(metrics).filter(m => m.rating === 'good').length,
      needsImprovement: Object.values(metrics).filter(m => m.rating === 'needs-improvement').length,
      poor: Object.values(metrics).filter(m => m.rating === 'poor').length
    }
  };
  
  return report;
}