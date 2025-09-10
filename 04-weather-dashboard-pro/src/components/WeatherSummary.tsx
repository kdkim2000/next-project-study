// src/components/WeatherSummary.tsx
// 날씨 데이터 요약 및 통계 컴포넌트

'use client';

import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  LinearProgress,
  Chip
} from '@mui/material';
import {
  ThermostatAuto,
  Water,
  Air,
  WbSunny,
  Insights
} from '@mui/icons-material';
import type { ForecastData } from '@/types/weather';

interface WeatherSummaryProps {
  forecastData: ForecastData[];
}

function WeatherSummary({ forecastData }: WeatherSummaryProps) {
  // 통계 계산
  const calculateStats = () => {
    const temps = forecastData.map(day => day.day.maxtemp_c);
    const humidity = forecastData.map(day => day.day.avghumidity);
    const winds = forecastData.map(day => day.day.maxwind_kph);
    const uvs = forecastData.map(day => day.day.uv);

    return {
      maxTemp: Math.max(...temps),
      minTemp: Math.min(...forecastData.map(day => day.day.mintemp_c)),
      avgTemp: Math.round(temps.reduce((a, b) => a + b, 0) / temps.length),
      avgHumidity: Math.round(humidity.reduce((a, b) => a + b, 0) / humidity.length),
      maxWind: Math.max(...winds),
      avgWind: Math.round(winds.reduce((a, b) => a + b, 0) / winds.length),
      maxUV: Math.max(...uvs),
      avgUV: Math.round((uvs.reduce((a, b) => a + b, 0) / uvs.length) * 10) / 10
    };
  };

  // 날씨 전망 분석
  const analyzeOutlook = () => {
    const stats = calculateStats();
    let outlook = [];
    let severity = 'info';

    if (stats.maxTemp > 30) {
      outlook.push('🌡️ 고온');
      severity = 'warning';
    }
    if (stats.minTemp < 5) {
      outlook.push('🥶 저온');
      severity = 'error';
    }
    if (stats.avgHumidity > 70) {
      outlook.push('💧 높은 습도');
    }
    if (stats.maxWind > 30) {
      outlook.push('💨 강풍');
      severity = 'warning';
    }
    if (stats.maxUV > 7) {
      outlook.push('☀️ 강한 자외선');
      severity = 'warning';
    }

    if (outlook.length === 0) {
      outlook.push('🌤️ 좋은 날씨');
      severity = 'success';
    }

    return { outlook, severity };
  };

  const stats = calculateStats();
  const analysis = analyzeOutlook();

  return (
    <Card elevation={3} sx={{ mb: 3 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <Insights color="primary" />
          <Typography variant="h6">
            3일간 날씨 요약
          </Typography>
        </Box>

        {/* 주요 통계 */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={6} sm={3}>
            <Box sx={{ textAlign: 'center' }}>
              <ThermostatAuto color="primary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" color="primary">
                {stats.avgTemp}°C
              </Typography>
              <Typography variant="body2" color="text.secondary">
                평균 온도
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {stats.minTemp}°C ~ {stats.maxTemp}°C
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={6} sm={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Water color="primary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" color="primary">
                {stats.avgHumidity}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                평균 습도
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={stats.avgHumidity} 
                sx={{ mt: 1, height: 6, borderRadius: 3 }}
              />
            </Box>
          </Grid>

          <Grid item xs={6} sm={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Air color="primary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" color="primary">
                {stats.avgWind}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                평균 바람 (km/h)
              </Typography>
              <Typography variant="caption" color="text.secondary">
                최대 {stats.maxWind} km/h
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={6} sm={3}>
            <Box sx={{ textAlign: 'center' }}>
              <WbSunny color="primary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" color="primary">
                {stats.avgUV}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                평균 UV 지수
              </Typography>
              <Typography variant="caption" color="text.secondary">
                최대 UV {stats.maxUV}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* 날씨 전망 */}
        <Box>
          <Typography variant="subtitle1" gutterBottom>
            날씨 전망
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {analysis.outlook.map((item, index) => (
              <Chip
                key={index}
                label={item}
                color={analysis.severity as any}
                variant="outlined"
                size="small"
              />
            ))}
          </Box>
        </Box>

        {/* 권장사항 */}
        <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
          <Typography variant="subtitle2" gutterBottom>
            💡 추천 사항
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {stats.maxTemp > 30 && '더운 날씨가 예상되니 충분한 수분 섭취와 자외선 차단에 주의하세요. '}
            {stats.minTemp < 5 && '추운 날씨가 예상되니 따뜻한 옷차림을 준비하세요. '}
            {stats.avgHumidity > 70 && '습도가 높으니 쾌적한 실내 환경 유지에 신경쓰세요. '}
            {stats.maxWind > 30 && '바람이 강하니 외출 시 주의하세요. '}
            {stats.maxUV > 7 && '자외선이 강하니 선크림과 모자를 착용하세요. '}
            {analysis.outlook.includes('🌤️ 좋은 날씨') && '날씨가 좋으니 야외 활동하기 좋은 시기입니다!'}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

export default WeatherSummary;