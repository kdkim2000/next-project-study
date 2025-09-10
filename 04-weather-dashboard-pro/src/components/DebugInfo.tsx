// src/components/DebugInfo.tsx
// 디버깅을 위한 정보 표시 컴포넌트 (개발 중에만 사용)

'use client';

import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

interface DebugInfoProps {
  loading: boolean;
  currentLocation: string;
  hasWeatherData: boolean;
  hasForecastData: boolean;
  error: string | null;
}

function DebugInfo({ loading, currentLocation, hasWeatherData, hasForecastData, error }: DebugInfoProps) {
  // 프로덕션에서는 렌더링하지 않음
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <Card variant="outlined" sx={{ mb: 2, bgcolor: 'grey.100' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom color="primary">
          🐛 디버그 정보
        </Typography>
        <Box sx={{ display: 'grid', gap: 1 }}>
          <Typography variant="body2">
            <strong>로딩 상태:</strong> {loading ? '로딩 중' : '완료'}
          </Typography>
          <Typography variant="body2">
            <strong>현재 위치:</strong> {currentLocation || '없음'}
          </Typography>
          <Typography variant="body2">
            <strong>날씨 데이터:</strong> {hasWeatherData ? '있음' : '없음'}
          </Typography>
          <Typography variant="body2">
            <strong>예보 데이터:</strong> {hasForecastData ? '있음' : '없음'}
          </Typography>
          <Typography variant="body2">
            <strong>에러:</strong> {error || '없음'}
          </Typography>
          <Typography variant="body2">
            <strong>API 키 설정:</strong> {process.env.NEXT_PUBLIC_WEATHER_API_KEY ? '있음' : '없음'}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

export default DebugInfo;