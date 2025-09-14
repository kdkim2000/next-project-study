// src/lib/advanced-data.ts - 고급 차트용 데이터 생성
export interface AdvancedLineData {
  timestamp: string;
  desktop: number;
  mobile: number;
  tablet: number;
  total: number;
}

export interface HeatmapData {
  hour: number;
  day: string;
  value: number;
}

export interface TreemapData {
  name: string;
  value: number;
  children?: TreemapData[];
}

export interface RadarData {
  subject: string;
  current: number;
  target: number;
  fullMark: number;
}

export interface RealTimeData {
  timestamp: number;
  value: number;
  users: number;
  pageViews: number;
}

// 고급 라인 차트 데이터 생성
export function generateAdvancedLineData(): AdvancedLineData[] {
  const data: AdvancedLineData[] = [];
  const now = new Date();
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    const desktop = Math.floor(Math.random() * 5000) + 3000;
    const mobile = Math.floor(Math.random() * 7000) + 4000;
    const tablet = Math.floor(Math.random() * 2000) + 1000;
    
    data.push({
      timestamp: date.toISOString().split('T')[0],
      desktop,
      mobile,
      tablet,
      total: desktop + mobile + tablet
    });
  }
  
  return data;
}

// 히트맵 데이터 생성
export function generateHeatmapData(): HeatmapData[] {
  const data: HeatmapData[] = [];
  const days = ['월', '화', '수', '목', '금', '토', '일'];
  
  days.forEach(day => {
    for (let hour = 0; hour < 24; hour++) {
      data.push({
        hour,
        day,
        value: Math.floor(Math.random() * 100)
      });
    }
  });
  
  return data;
}

// 트리맵 데이터 생성
export function generateTreemapData(): TreemapData[] {
  return [
    {
      name: 'Desktop',
      value: 0,
      children: [
        { name: 'Chrome', value: 4500 },
        { name: 'Firefox', value: 1200 },
        { name: 'Safari', value: 800 },
        { name: 'Edge', value: 600 },
      ]
    },
    {
      name: 'Mobile',
      value: 0,
      children: [
        { name: 'Chrome Mobile', value: 6000 },
        { name: 'Safari Mobile', value: 3500 },
        { name: 'Samsung Internet', value: 800 },
        { name: 'Opera Mobile', value: 300 },
      ]
    },
    {
      name: 'Tablet',
      value: 0,
      children: [
        { name: 'iPad Safari', value: 2000 },
        { name: 'Android Chrome', value: 1200 },
        { name: 'Others', value: 300 },
      ]
    }
  ];
}

// 레이더 차트 데이터 생성
export function generateRadarData(): RadarData[] {
  return [
    { subject: '사용성', current: 85, target: 90, fullMark: 100 },
    { subject: '성능', current: 78, target: 85, fullMark: 100 },
    { subject: '접근성', current: 92, target: 95, fullMark: 100 },
    { subject: 'SEO', current: 88, target: 90, fullMark: 100 },
    { subject: '보안', current: 95, target: 98, fullMark: 100 },
    { subject: '호환성', current: 82, target: 88, fullMark: 100 },
  ];
}

// 실시간 차트 데이터 생성
export function generateRealTimeData(): RealTimeData[] {
  const data: RealTimeData[] = [];
  const now = Date.now();
  
  for (let i = 59; i >= 0; i--) {
    const timestamp = now - (i * 1000); // 1초 간격
    data.push({
      timestamp,
      value: Math.floor(Math.random() * 100) + 50,
      users: Math.floor(Math.random() * 500) + 100,
      pageViews: Math.floor(Math.random() * 1000) + 200,
    });
  }
  
  return data;
}

// 차트 타입에 따른 데이터 생성
export function generateAdvancedChartData(chartType: string): any {
  switch (chartType) {
    case 'advanced-line':
      return generateAdvancedLineData();
    case 'heatmap':
      return generateHeatmapData();
    case 'treemap':
      return generateTreemapData();
    case 'radar':
      return generateRadarData();
    case 'realtime':
      return generateRealTimeData();
    default:
      return [];
  }
}