// src/app/@modal/(.)chart/[id]/page.tsx - 모달로 차트 인터셉션
'use client';

import React, { Suspense } from 'react';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  IconButton,
  Typography,
} from '@mui/material';
import { Close as CloseIcon, OpenInNew as OpenInNewIcon } from '@mui/icons-material';
import AdvancedLineChart from '@/components/advanced-charts/AdvancedLineChart';
import HeatmapChart from '@/components/advanced-charts/HeatmapChart';
import TreemapChart from '@/components/advanced-charts/TreemapChart';
import RadarChart from '@/components/advanced-charts/RadarChart';
import RealTimeChart from '@/components/advanced-charts/RealTimeChart';
import { generateAdvancedChartData } from '@/lib/advanced-data';

interface ChartModalProps {
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

export default function ChartModal({ params }: ChartModalProps) {
  const router = useRouter();
  const ChartComponent = chartComponents[params.id as keyof typeof chartComponents];
  const chartTitle = chartTitles[params.id as keyof typeof chartTitles] || '차트';

  if (!ChartComponent) {
    return (
      <Dialog open={true} onClose={() => router.back()}>
        <DialogTitle>오류</DialogTitle>
        <DialogContent>
          <Typography>해당 차트를 찾을 수 없습니다.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => router.back()}>닫기</Button>
        </DialogActions>
      </Dialog>
    );
  }

  const chartData = generateAdvancedChartData(params.id);

  return (
    <Dialog 
      open={true} 
      onClose={() => router.back()}
      maxWidth="lg" 
      fullWidth
      PaperProps={{
        sx: { minHeight: '70vh' }
      }}
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5">{chartTitle}</Typography>
          <Box>
            <IconButton
              onClick={() => router.push(`/chart/${params.id}`)}
              title="새 창에서 열기"
            >
              <OpenInNewIcon />
            </IconButton>
            <IconButton
              onClick={() => router.back()}
              title="닫기"
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ height: 500, width: '100%' }}>
          <Suspense fallback={
            <Box display="flex" justifyContent="center" alignItems="center" height="100%">
              <Typography>차트 로딩 중...</Typography>
            </Box>
          }>
            <ChartComponent data={chartData} />
          </Suspense>
        </Box>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={() => router.back()}>닫기</Button>
        <Button 
          variant="contained" 
          onClick={() => router.push(`/chart/${params.id}`)}
        >
          상세 보기
        </Button>
      </DialogActions>
    </Dialog>
  );
}