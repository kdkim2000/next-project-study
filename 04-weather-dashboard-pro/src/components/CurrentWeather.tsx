// src/components/CurrentWeather.tsx
// 현재 날씨 정보를 표시하는 컴포넌트

'use client';

import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Chip,
  Avatar
} from '@mui/material';
import {
  Thermostat,
  Water,
  Air,
  Visibility,
  Speed,
  WbSunny
} from '@mui/icons-material';
import type { WeatherData } from '@/types/weather';

interface CurrentWeatherProps {
  weatherData: WeatherData;
}

function CurrentWeather({ weatherData }: CurrentWeatherProps) {
  const { location, current } = weatherData;

  // 날씨 아이콘 URL (WeatherAPI.com에서 제공)
  const iconUrl = `https:${current.condition.icon}`;

  // 날씨 상세 정보 배열
  const weatherDetails = [
    {
      label: '체감온도',
      value: `${current.feelslike_c}°C`,
      icon: <Thermostat color="primary" />
    },
    {
      label: '습도',
      value: `${current.humidity}%`,
      icon: <Water color="primary" />
    },
    {
      label: '바람',
      value: `${current.wind_kph} km/h ${current.wind_dir}`,
      icon: <Air color="primary" />
    },
    {
      label: '기압',
      value: `${current.pressure_mb} mb`,
      icon: <Speed color="primary" />
    },
    {
      label: '가시거리',
      value: `${current.vis_km} km`,
      icon: <Visibility color="primary" />
    },
    {
      label: 'UV 지수',
      value: current.uv.toString(),
      icon: <WbSunny color="primary" />
    }
  ];

  // UV 지수에 따른 색상 결정
  const getUVColor = (uv: number) => {
    if (uv <= 2) return 'success';
    if (uv <= 5) return 'warning';
    return 'error';
  };

  return (
    <Card elevation={3} sx={{ mb: 3 }}>
      <CardContent>
        {/* 위치 정보 */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            {location.name}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {location.region}, {location.country}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            마지막 업데이트: {new Date(location.localtime).toLocaleString('ko-KR')}
          </Typography>
        </Box>

        {/* 메인 날씨 정보 */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Avatar
            src={iconUrl}
            alt={current.condition.text}
            sx={{ width: 80, height: 80, mr: 3 }}
          />
          <Box>
            <Typography variant="h2" component="div" sx={{ fontWeight: 'bold' }}>
              {current.temp_c}°C
            </Typography>
            <Typography variant="h6" color="text.secondary">
              {current.condition.text}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {current.temp_f}°F
            </Typography>
          </Box>
        </Box>

        {/* 상세 날씨 정보 그리드 */}
        <Grid container spacing={2}>
          {weatherDetails.map((detail, index) => (
            <Grid item xs={6} sm={4} key={index}>
              <Card variant="outlined" sx={{ p: 2, textAlign: 'center', height: '100%' }}>
                <Box sx={{ mb: 1 }}>
                  {detail.icon}
                </Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {detail.label}
                </Typography>
                <Typography variant="h6" component="div">
                  {detail.value}
                </Typography>
                
                {/* UV 지수에 특별한 색상 표시 */}
                {detail.label === 'UV 지수' && (
                  <Chip
                    label={
                      current.uv <= 2 ? '낮음' :
                      current.uv <= 5 ? '보통' :
                      current.uv <= 7 ? '높음' :
                      current.uv <= 10 ? '매우 높음' : '극도로 높음'
                    }
                    color={getUVColor(current.uv)}
                    size="small"
                    sx={{ mt: 1 }}
                  />
                )}
              </Card>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
}

export default CurrentWeather;