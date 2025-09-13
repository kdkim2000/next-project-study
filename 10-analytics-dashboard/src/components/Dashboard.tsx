// src/components/Dashboard.tsx - 메인 대시보드 (Grid v2 + 고유 key 적용)
'use client';

import React from 'react';
import { Box, Container, Typography, Grid } from '@mui/material';
import MetricCard from './MetricCard';
import SimpleChart from './SimpleChart';
import { metricsData, chartData, pieData } from '@/data/sampleData';

export default function Dashboard() {
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* 헤더 */}
      <Box mb={4}>
        <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
          Analytics Dashboard Pro
        </Typography>
        <Typography variant="h6" color="text.secondary">
          실시간 비즈니스 인사이트 대시보드
        </Typography>
      </Box>

      {/* 메트릭 카드들 */}
      <Grid container spacing={3} mb={4}>
        {metricsData.map((metric) => (
          // ✅ Grid v2: item/xs/sm/md 대신 size 사용
          // ✅ 고유 key: index 대신 metric.title(중복 없다고 가정)
          <Grid key={metric.title} size={{ xs: 12, sm: 6, md: 3 }}>
            <MetricCard data={metric} />
          </Grid>
        ))}
      </Grid>

      {/* 차트들 */}
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
