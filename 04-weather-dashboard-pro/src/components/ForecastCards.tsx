// src/components/ForecastCards.tsx
// 일기예보를 카드 형태로 표시하는 컴포넌트

'use client';

import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Avatar,
  Chip
} from '@mui/material';
import {
  Water,
  Air,
  WbSunny
} from '@mui/icons-material';
import type { ForecastData } from '@/types/weather';

interface ForecastCardsProps {
  forecastData: ForecastData[];
}

function ForecastCards({ forecastData }: ForecastCardsProps) {
  // 요일을 한국어로 변환하는 함수
  const getKoreanDayOfWeek = (date: string) => {
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    const dayOfWeek = new Date(date).getDay();
    return days[dayOfWeek];
  };

  // UV 지수에 따른 색상 결정
  const getUVChipProps = (uv: number) => {
    if (uv <= 2) return { color: 'success' as const, label: '낮음' };
    if (uv <= 5) return { color: 'warning' as const, label: '보통' };
    if (uv <= 7) return { color: 'error' as const, label: '높음' };
    if (uv <= 10) return { color: 'error' as const, label: '매우 높음' };
    return { color: 'error' as const, label: '극도로 높음' };
  };

  return (
    <Card elevation={3}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          3일 일기예보
        </Typography>
        
        <Grid container spacing={2}>
          {forecastData.map((forecast, index) => {
            const iconUrl = `https:${forecast.day.condition.icon}`;
            const uvChipProps = getUVChipProps(forecast.day.uv);
            const isToday = index === 0;
            
            return (
              <Grid item xs={12} sm={6} md={4} lg={3} key={forecast.date}>
                <Card
                  variant={isToday ? 'elevation' : 'outlined'}
                  elevation={isToday ? 4 : 0}
                  sx={{
                    height: '100%',
                    border: isToday ? 2 : 1,
                    borderColor: isToday ? 'primary.main' : 'divider',
                    position: 'relative',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4,
                      transition: 'all 0.3s ease-in-out',
                    }
                  }}
                >
                  {/* 오늘 표시 */}
                  {isToday && (
                    <Chip
                      label="오늘"
                      color="primary"
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        zIndex: 1
                      }}
                    />
                  )}
                  
                  <CardContent sx={{ textAlign: 'center', pb: 2 }}>
                    {/* 날짜 정보 */}
                    <Typography variant="subtitle1" gutterBottom>
                      {new Date(forecast.date).toLocaleDateString('ko-KR', {
                        month: 'short',
                        day: 'numeric'
                      })} ({getKoreanDayOfWeek(forecast.date)})
                    </Typography>

                    {/* 날씨 아이콘 */}
                    <Avatar
                      src={iconUrl}
                      alt={forecast.day.condition.text}
                      sx={{ 
                        width: 60, 
                        height: 60, 
                        mx: 'auto', 
                        mb: 1,
                        bgcolor: 'transparent'
                      }}
                    />

                    {/* 날씨 설명 */}
                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      sx={{ mb: 2, minHeight: '2.5em' }}
                    >
                      {forecast.day.condition.text}
                    </Typography>

                    {/* 온도 */}
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="h6" component="div">
                        <span style={{ color: '#ff4444' }}>
                          {Math.round(forecast.day.maxtemp_c)}°
                        </span>
                        {' / '}
                        <span style={{ color: '#4444ff' }}>
                          {Math.round(forecast.day.mintemp_c)}°
                        </span>
                      </Typography>
                    </Box>

                    {/* 상세 정보 */}
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      gap: 1, 
                      alignItems: 'center' 
                    }}>
                      {/* 습도 */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Water fontSize="small" color="primary" />
                        <Typography variant="caption">
                          습도 {forecast.day.avghumidity}%
                        </Typography>
                      </Box>

                      {/* 바람 */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Air fontSize="small" color="primary" />
                        <Typography variant="caption">
                          바람 {forecast.day.maxwind_kph} km/h
                        </Typography>
                      </Box>

                      {/* UV 지수 */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <WbSunny fontSize="small" color="primary" />
                        <Typography variant="caption" sx={{ mr: 0.5 }}>
                          UV {forecast.day.uv}
                        </Typography>
                        <Chip
                          label={uvChipProps.label}
                          color={uvChipProps.color}
                          size="small"
                          sx={{ 
                            height: 16, 
                            fontSize: '0.6rem',
                            '& .MuiChip-label': { px: 0.5 }
                          }}
                        />
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </CardContent>
    </Card>
  );
}

export default ForecastCards;