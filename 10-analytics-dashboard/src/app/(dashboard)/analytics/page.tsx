// src/app/(dashboard)/analytics/page.tsx - 분석 페이지
import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import Grid from '@mui/material/Grid';
import StreamingData from '@/components/streaming/StreamingData';
import SuspenseWrapper from '@/components/streaming/SuspenseWrapper';
import AdvancedLineChart from '@/components/advanced-charts/AdvancedLineChart';
import HeatmapChart from '@/components/advanced-charts/HeatmapChart';
import { generateAdvancedChartData } from '@/lib/advanced-data';

export const metadata = {
  title: '분석 | Analytics Dashboard Pro',
  description: '고급 데이터 분석 및 시각화',
};

export default function AnalyticsPage() {
  const chartTypes = ['advanced-line', 'heatmap', 'treemap', 'radar'];

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box mb={4}>
        <Typography variant="h3" component="h1" gutterBottom>
          고급 분석
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Streaming SSR과 복잡한 데이터 시각화를 체험해보세요
        </Typography>
      </Box>

      {/* Streaming SSR 데모 */}
      <Box mb={6}>
        <StreamingData chartTypes={chartTypes} />
      </Box>

      {/* 고급 차트들 */}
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <SuspenseWrapper title="고급 라인 차트 로딩 중...">
            <Box sx={{ height: 400, border: 1, borderColor: 'divider', borderRadius: 1 }}>
              <AdvancedLineChart data={generateAdvancedChartData('advanced-line')} />
            </Box>
          </SuspenseWrapper>
        </Grid>
        
        <Grid size={{ xs: 12, lg: 4 }}>
          <SuspenseWrapper title="히트맵 로딩 중...">
            <Box sx={{ height: 400, border: 1, borderColor: 'divider', borderRadius: 1 }}>
              <HeatmapChart data={generateAdvancedChartData('heatmap')} />
            </Box>
          </SuspenseWrapper>
        </Grid>
      </Grid>
    </Container>
  );
}