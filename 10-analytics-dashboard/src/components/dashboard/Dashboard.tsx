// src/components/dashboard/Dashboard.tsx - 고급 차트 링크 추가
'use client';

import React from 'react';
import { Box, Container, Typography, Button, Paper } from '@mui/material';
import Grid from '@mui/material/Grid';
import { Launch as LaunchIcon } from '@mui/icons-material';
import Link from 'next/link';
import MetricCard from '../MetricCard';
import SimpleChart from '../SimpleChart';
import PerformanceMonitor from '../PerformanceMonitor';
import ExportButtons from '../ExportButtons';
import { metricsData, chartData, pieData } from '@/data/sampleData';

export default function Dashboard() {
  const advancedCharts = [
    { id: 'advanced-line', name: '고급 라인 차트', description: '다중 데이터셋 시간 추이' },
    { id: 'heatmap', name: '히트맵', description: '시간대별 활동 패턴' },
    { id: 'treemap', name: '트리맵', description: '브라우저 사용 분포' },
    { id: 'radar', name: '레이더 차트', description: '웹사이트 성능 지표' },
    { id: 'realtime', name: '실시간 차트', description: '실시간 모니터링' },
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 4 }} id="dashboard-container">
      {/* 헤더 + 내보내기 버튼 */}
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={4}>
        <Box>
          <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
            Analytics Dashboard Pro
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Phase 2: Parallel Routes + 고급 시각화 적용
          </Typography>
        </Box>
        <ExportButtons />
      </Box>

      {/* 메트릭 카드들 */}
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

      {/* 기본 차트들 */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
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

      {/* 고급 차트 섹션 */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Box mb={3}>
          <Typography variant="h5" gutterBottom>
            고급 데이터 시각화
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Parallel Routes와 Intercepting Routes로 구현된 모달 차트들을 체험해보세요
          </Typography>
        </Box>

        <Grid container spacing={2}>
          {advancedCharts.map((chart) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={chart.id}>
              <Paper 
                sx={{ 
                  p: 2, 
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: 3,
                  }
                }}
              >
                <Typography variant="h6" gutterBottom>
                  {chart.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {chart.description}
                </Typography>
                <Button
                  component={Link}
                  href={`/chart/${chart.id}`}
                  variant="outlined"
                  startIcon={<LaunchIcon />}
                  size="small"
                >
                  모달로 열기
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Box textAlign="center" mt={3}>
          <Button
            component={Link}
            href="/analytics"
            variant="contained"
            size="large"
          >
            고급 분석 페이지로 이동
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}