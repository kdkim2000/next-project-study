// src/components/streaming/StreamingData.tsx - Streaming 데이터 컴포넌트
import React, { Suspense } from 'react';
import { Box, Paper, Typography, Skeleton } from '@mui/material';
import { generateAdvancedChartData } from '@/lib/advanced-data';

// 지연을 시뮬레이션하는 async 컴포넌트
async function SlowLoadingData({ chartType, delay = 1000 }: { chartType: string; delay?: number }) {
  // Streaming을 위한 지연 시뮬레이션
  await new Promise(resolve => setTimeout(resolve, delay));
  
  const data = generateAdvancedChartData(chartType);
  const count = Array.isArray(data) ? data.length : 0;
  
  return (
    <Paper sx={{ p: 3, textAlign: 'center' }}>
      <Typography variant="h4" color="primary.main" gutterBottom>
        {count}
      </Typography>
      <Typography variant="body1" color="text.secondary">
        {chartType} 데이터 포인트
      </Typography>
      <Typography variant="caption" color="success.main">
        ✓ 스트리밍 완료
      </Typography>
    </Paper>
  );
}

// 스켈레톤 로딩 컴포넌트
function DataSkeleton() {
  return (
    <Paper sx={{ p: 3, textAlign: 'center' }}>
      <Skeleton variant="text" width={80} height={60} sx={{ mx: 'auto' }} />
      <Skeleton variant="text" width={120} height={24} sx={{ mx: 'auto', mt: 1 }} />
      <Skeleton variant="text" width={100} height={16} sx={{ mx: 'auto', mt: 1 }} />
    </Paper>
  );
}

interface StreamingDataProps {
  chartTypes: string[];
}

export default function StreamingData({ chartTypes }: StreamingDataProps) {
  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Streaming SSR 데모
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        각 데이터 블록이 순차적으로 로딩되는 것을 확인하세요.
      </Typography>
      
      <Box display="grid" gridTemplateColumns="repeat(auto-fit, minmax(200px, 1fr))" gap={2}>
        {chartTypes.map((chartType, index) => (
          <Suspense key={chartType} fallback={<DataSkeleton />}>
            <SlowLoadingData 
              chartType={chartType} 
              delay={1000 + (index * 500)} // 순차적 로딩
            />
          </Suspense>
        ))}
      </Box>
    </Box>
  );
}