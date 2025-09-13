// src/components/Dashboard.tsx - MUI Grid v2 문법으로 수정
'use client';

import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import Grid from '@mui/material/Grid'; // Grid v2 import
import MetricCard from './MetricCard';
import SimpleChart from './SimpleChart';
import PerformanceMonitor from './PerformanceMonitor';
import ExportButtons from './ExportButtons';
import { metricsData, chartData, pieData } from '@/data/sampleData';

export default function Dashboard() {
  return (
    <Container maxWidth="xl" sx={{ py: 4 }} id="dashboard-container">
      {/* 헤더 + 내보내기 버튼 */}
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={4}>
        <Box>
          <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
            Analytics Dashboard Pro
          </Typography>
          <Typography variant="h6" color="text.secondary">
            실시간 비즈니스 인사이트 대시보드
          </Typography>
        </Box>
        <ExportButtons />
      </Box>

      {/* 메트릭 카드들 - Grid v2 문법 */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {metricsData.map((metric, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
            <MetricCard data={metric} />
          </Grid>
        ))}
      </Grid>

      {/* 성능 모니터 */}
      <Box mb={4}>
        <PerformanceMonitor />
      </Box>

      {/* 차트들 - Grid v2 문법 */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <SimpleChart 
            title="월별 매출 추이" 
            data={chartData} 
            type="line" 
            color="#2196f3"
          />
        </Grid>
        
        <Grid size={{ xs: 12, lg: 4 }}>
          <SimpleChart 
            title="디바이스별 접속 비율" 
            data={pieData} 
            type="pie"
          />
        </Grid>
        
        <Grid size={{ xs: 12 }}>
          <SimpleChart 
            title="월별 주문량" 
            data={chartData} 
            type="bar" 
            color="#4caf50"
          />
        </Grid>
      </Grid>
    </Container>
  );
}