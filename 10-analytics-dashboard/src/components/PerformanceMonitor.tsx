// src/components/PerformanceMonitor.tsx - MUI Grid v2 문법으로 수정
'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  Chip,
  LinearProgress,
  Tooltip,
} from '@mui/material';
import Grid from '@mui/material/Grid'; // Grid v2 import
import {
  Speed as SpeedIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';
import { usePerformance } from '@/hooks/usePerformance';

export default function PerformanceMonitor() {
  const { metrics, summary, isLoading } = usePerformance();

  const getScoreColor = (score: number): 'success' | 'warning' | 'error' => {
    if (score >= 90) return 'success';
    if (score >= 70) return 'warning';
    return 'error';
  };

  const getRatingColor = (rating: string): 'success' | 'warning' | 'error' => {
    switch (rating) {
      case 'good': return 'success';
      case 'needs-improvement': return 'warning';
      case 'poor': return 'error';
      default: return 'success';
    }
  };

  const formatValue = (name: string, value: number): string => {
    if (name === 'CLS') {
      return value.toFixed(3);
    }
    return `${value}ms`;
  };

  const getMetricDescription = (name: string): string => {
    const descriptions: Record<string, string> = {
      CLS: '시각적 안정성 - 페이지 요소가 예기치 않게 이동하는 정도',
      INP: '상호작용 응답성 - 사용자 입력에 대한 반응 시간', // FID → INP로 변경
      FCP: '첫 콘텐츠 표시 - 첫 번째 텍스트나 이미지가 표시되는 시간',
      LCP: '최대 콘텐츠 표시 - 가장 큰 콘텐츠가 표시되는 시간',
      TTFB: '첫 바이트 시간 - 서버 응답 시간'
    };
    return descriptions[name] || '성능 메트릭';
  };
  if (isLoading && Object.keys(metrics).length === 0) {
    return (
      <Card>
        <CardHeader 
          title={
            <Box display="flex" alignItems="center" gap={1}>
              <SpeedIcon />
              <Typography variant="h6">성능 모니터링</Typography>
            </Box>
          }
        />
        <CardContent>
          <Box display="flex" alignItems="center" justifyContent="center" py={4}>
            <Typography color="text.secondary">
              성능 데이터 수집 중...
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader 
        title={
          <Box display="flex" alignItems="center" gap={1}>
            <SpeedIcon />
            <Typography variant="h6">성능 모니터링</Typography>
            <Chip 
              label={`점수: ${summary.score}`} 
              color={getScoreColor(summary.score)}
              size="small"
            />
          </Box>
        }
        subheader={`${summary.total}개 메트릭 중 좋음: ${summary.good}, 개선필요: ${summary.needsImprovement}, 나쁨: ${summary.poor}`}
      />
      <CardContent>
        {/* 전체 성능 점수 */}
        <Box mb={3}>
          <Box display="flex" alignItems="center" justifyContent="between" mb={1}>
            <Typography variant="body2" color="text.secondary">
              전체 성능 점수
            </Typography>
            <Typography variant="h4" color={`${getScoreColor(summary.score)}.main`}>
              {summary.score}
            </Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={summary.score} 
            color={getScoreColor(summary.score)}
            sx={{ height: 8, borderRadius: 4 }}
          />
        </Box>

        {/* 개별 메트릭들 - Grid v2 문법 */}
        <Grid container spacing={2}>
          {Object.entries(metrics).map(([name, metric]) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={name}>
              <Tooltip title={getMetricDescription(name)}>
                <Card variant="outlined" sx={{ height: '100%' }}>
                  <CardContent>
                    <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                      <Typography variant="body2" fontWeight="bold">
                        {name}
                      </Typography>
                      <Chip 
                        label={metric.rating.replace('-', ' ')} 
                        color={getRatingColor(metric.rating)}
                        size="small"
                      />
                    </Box>
                    <Typography variant="h6" color="text.primary">
                      {formatValue(name, metric.value)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      델타: {formatValue(name, metric.delta)}
                    </Typography>
                  </CardContent>
                </Card>
              </Tooltip>
            </Grid>
          ))}
        </Grid>

        {Object.keys(metrics).length === 0 && (
          <Box textAlign="center" py={4}>
            <AssessmentIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
            <Typography variant="body1" color="text.secondary">
              아직 성능 데이터가 수집되지 않았습니다.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              페이지와 상호작용하면 메트릭이 수집됩니다.
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}