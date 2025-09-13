// src/data/sampleData.ts - 심플한 샘플 데이터
export interface MetricData {
  title: string;
  value: number;
  change: number;
  icon: string;
  color: string;
}

export interface ChartDataPoint {
  name: string;
  value: number;
}

// 메트릭 카드용 데이터
export const metricsData: MetricData[] = [
  {
    title: '총 매출',
    value: 2547893,
    change: 12.5,
    icon: 'AttachMoney',
    color: '#2196f3'
  },
  {
    title: '사용자 수',
    value: 15432,
    change: 8.2,
    icon: 'People',
    color: '#4caf50'
  },
  {
    title: '주문 수',
    value: 8945,
    change: -3.1,
    icon: 'ShoppingCart',
    color: '#ff9800'
  },
  {
    title: '전환율',
    value: 3.42,
    change: 5.7,
    icon: 'TrendingUp',
    color: '#9c27b0'
  }
];

// 차트용 데이터
export const chartData: ChartDataPoint[] = [
  { name: '1월', value: 400 },
  { name: '2월', value: 300 },
  { name: '3월', value: 600 },
  { name: '4월', value: 800 },
  { name: '5월', value: 700 },
  { name: '6월', value: 900 },
  { name: '7월', value: 1100 },
  { name: '8월', value: 1000 },
  { name: '9월', value: 1200 },
  { name: '10월', value: 1400 },
  { name: '11월', value: 1300 },
  { name: '12월', value: 1600 }
];

export const pieData: ChartDataPoint[] = [
  { name: '모바일', value: 45 },
  { name: '데스크톱', value: 35 },
  { name: '태블릿', value: 20 }
];