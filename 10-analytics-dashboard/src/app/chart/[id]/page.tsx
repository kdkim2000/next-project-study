// src/app/chart/[id]/page.tsx - 실제 차트 페이지
import React, { Suspense } from 'react';
import { Container, Typography, Paper, Box } from '@mui/material';
import AdvancedLineChart from '@/components/advanced-charts/AdvancedLineChart';
import HeatmapChart from '@/components/advanced-charts/HeatmapChart';
import TreemapChart from '@/components/advanced-charts/TreemapChart';
import RadarChart from '@/components/advanced-charts/RadarChart';
import RealTimeChart from '@/components/advanced-charts/RealTimeChart';
import { generateAdvancedChartData } from '@/lib/advanced-data';
import { notFound } from 'next/navigation';

interface ChartPageProps {
  params: {
    id: string;
  };
}

const chartComponents = {
  'advanced-line': AdvancedLineChart,
  'heatmap': HeatmapChart,
  'treemap': TreemapChart,
  'radar': RadarChart,
  'realtime': RealTimeChart,
};

const chartTitles = {
  'advanced-line': '고급 라인 차트',
  'heatmap': '히트맵 차트',
  'treemap': '트리맵 차트',
  'radar': '레이더 차트',
  'realtime': '실시간 차트',
};

const chartDescriptions = {
  'advanced-line': '시간에 따른 다중 데이터 세트의 변화를 보여주는 고급 라인 차트입니다.',
  'heatmap': '데이터의 강도를 색상으로 표현하여 패턴을 쉽게 파악할 수 있는 히트맵입니다.',
  'treemap': '계층적 데이터를 중첩된 사각형으로 표현하는 트리맵 차트입니다.',
  'radar': '여러 변수를 동시에 비교할 수 있는 레이더 차트입니다.',
  'realtime': '실시간으로 업데이트되는 데이터를 시각화하는 차트입니다.',
};

// 동적 메타데이터 생성
export async function generateMetadata({ params }: ChartPageProps) {
  const chartTitle = chartTitles[params.id as keyof typeof chartTitles];
  
  if (!chartTitle) {
    return {
      title: '차트를 찾을 수 없습니다 | Analytics Dashboard',
    };
  }

  return {
    title: `${chartTitle} | Analytics Dashboard`,
    description: chartDescriptions[params.id as keyof typeof chartDescriptions],
  };
}

export default async function ChartPage({ params }: ChartPageProps) {
  const ChartComponent = chartComponents[params.id as keyof typeof chartComponents];
  const chartTitle = chartTitles[params.id as keyof typeof chartTitles];
  const chartDescription = chartDescriptions[params.id as keyof typeof chartDescriptions];

  if (!ChartComponent) {
    notFound();
  }

  // Streaming SSR을 위한 데이터 생성 (시뮬레이션)
  await new Promise(resolve => setTimeout(resolve, 1000)); // 1초 지연
  const chartData = generateAdvancedChartData(params.id);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box mb={4}>
        <Typography variant="h3" component="h1" gutterBottom>
          {chartTitle}
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          {chartDescription}
        </Typography>
      </Box>

      <Paper sx={{ p: 3 }}>
        <Box sx={{ height: 600, width: '100%' }}>
          <Suspense fallback={
            <Box 
              display="flex" 
              justifyContent="center" 
              alignItems="center" 
              height="100%"
            >
              <Typography variant="h6" color="text.secondary">
                차트 데이터를 불러오는 중...
              </Typography>
            </Box>
          }>
            <ChartComponent data={chartData} />
          </Suspense>
        </Box>
      </Paper>
    </Container>
  );
}

// 정적 파라미터 생성 (선택사항)
export async function generateStaticParams() {
  return Object.keys(chartComponents).map(id => ({
    id,
  }));
}