// src/components/OptimizedWeatherCard.tsx
// React.memo와 성능 최적화 기법을 학습하기 위한 컴포넌트

'use client';

import React, { memo, useMemo } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Avatar
} from '@mui/material';
import {
  Thermostat,
  Water,
  Air,
  WbSunny
} from '@mui/icons-material';
import type { ForecastData } from '@/types/weather';

interface OptimizedWeatherCardProps {
  forecast: ForecastData;
  isToday?: boolean;
  temperatureUnit: 'celsius' | 'fahrenheit';
  onCardClick?: (date: string) => void;
}

/**
 * 성능 최적화된 날씨 카드 컴포넌트
 * 
 * 학습 목표:
 * - React.memo를 활용한 리렌더링 최적화
 * - useMemo를 활용한 계산 최적화
 * - props 비교 함수 작성
 * - 불필요한 리렌더링 방지
 */
function OptimizedWeatherCard({ 
  forecast, 
  isToday = false, 
  temperatureUnit,
  onCardClick 
}: OptimizedWeatherCardProps) {
  
  // useMemo를 활용한 계산 최적화
  const weatherStats = useMemo(() => {
    const { day } = forecast;
    
    // 온도 변환 계산 (복잡한 계산이라고 가정)
    const maxTemp = temperatureUnit === 'celsius' 
      ? day.maxtemp_c 
      : Math.round(day.maxtemp_c * 9/5 + 32);
    
    const minTemp = temperatureUnit === 'celsius' 
      ? day.mintemp_c 
      : Math.round(day.mintemp_c * 9/5 + 32);

    // 날씨 상태 분석
    const weatherCondition = day.condition.text.toLowerCase();
    let weatherEmoji = '☀️';
    if (weatherCondition.includes('rain')) weatherEmoji = '🌧️';
    else if (weatherCondition.includes('cloud')) weatherEmoji = '☁️';
    else if (weatherCondition.includes('snow')) weatherEmoji = '❄️';
    else if (weatherCondition.includes('thunder')) weatherEmoji = '⛈️';

    // 날씨 등급 계산
    const getWeatherGrade = () => {
      let score = 100;
      
      if (maxTemp > 35 || maxTemp < 0) score -= 30;
      if (day.avghumidity > 80) score -= 20;
      if (day.maxwind_kph > 40) score -= 20;
      if (day.uv > 8) score -= 10;
      
      if (score >= 90) return { grade: 'A', color: 'success' as const };
      if (score >= 70) return { grade: 'B', color: 'info' as const };
      if (score >= 50) return { grade: 'C', color: 'warning' as const };
      return { grade: 'D', color: 'error' as const };
    };

    return {
      maxTemp,
      minTemp,
      weatherEmoji,
      grade: getWeatherGrade(),
      tempUnit: temperatureUnit === 'celsius' ? '°C' : '°F'
    };
  }, [forecast.day, temperatureUnit]); // 의존성 배열에 필요한 값들만 포함

  // 날짜 포맷팅 (useMemo로 최적화)
  const formattedDate = useMemo(() => {
    const date = new Date(forecast.date);
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    
    return {
      dateStr: date.toLocaleDateString('ko-KR', {
        month: 'short',
        day: 'numeric'
      }),
      dayOfWeek: days[date.getDay()]
    };
  }, [forecast.date]);

  // 클릭 핸들러 (useCallback 대신 여기서는 간단하게)
  const handleCardClick = () => {
    if (onCardClick) {
      onCardClick(forecast.date);
    }
  };

  // 조건부 렌더링을 위한 계산
  const cardStyles = useMemo(() => ({
    transform: isToday ? 'scale(1.02)' : 'scale(1)',
    border: isToday ? 2 : 1,
    borderColor: isToday ? 'primary.main' : 'divider',
    cursor: onCardClick ? 'pointer' : 'default',
    transition: 'all 0.2s ease-in-out',
    '&:hover': onCardClick ? {
      transform: 'translateY(-4px)',
      boxShadow: 4
    } : {}
  }), [isToday, onCardClick]);

  return (
    <Card
      variant={isToday ? 'elevation' : 'outlined'}
      elevation={isToday ? 4 : 0}
      sx={cardStyles}
      onClick={handleCardClick}
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
      
      <CardContent sx={{ textAlign: 'center', pb: 2, position: 'relative' }}>
        {/* 날짜 정보 */}
        <Typography variant="subtitle1" gutterBottom>
          {formattedDate.dateStr} ({formattedDate.dayOfWeek})
        </Typography>

        {/* 날씨 아이콘과 이모지 */}
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 1 }}>
          <Avatar
            src={`https:${forecast.day.condition.icon}`}
            alt={forecast.day.condition.text}
            sx={{ width: 50, height: 50, mr: 1, bgcolor: 'transparent' }}
          />
          <Typography variant="h4">
            {weatherStats.weatherEmoji}
          </Typography>
        </Box>

        {/* 날씨 설명 */}
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: '2em' }}>
          {forecast.day.condition.text}
        </Typography>

        {/* 온도 */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="h5" component="div">
            <span style={{ color: '#ff4444' }}>
              {weatherStats.maxTemp}{weatherStats.tempUnit}
            </span>
            {' / '}
            <span style={{ color: '#4444ff' }}>
              {weatherStats.minTemp}{weatherStats.tempUnit}
            </span>
          </Typography>
        </Box>

        {/* 날씨 등급 */}
        <Box sx={{ mb: 2 }}>
          <Chip
            label={`날씨 등급: ${weatherStats.grade.grade}`}
            color={weatherStats.grade.color}
            size="small"
          />
        </Box>

        {/* 상세 정보 아이콘들 */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-around', 
          alignItems: 'center',
          mt: 2
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Water fontSize="small" color="primary" />
            <Typography variant="caption">
              {forecast.day.avghumidity}%
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Air fontSize="small" color="primary" />
            <Typography variant="caption">
              {forecast.day.maxwind_kph}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <WbSunny fontSize="small" color="primary" />
            <Typography variant="caption">
              UV{forecast.day.uv}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

/**
 * React.memo를 활용한 메모이제이션
 * 
 * 사용자 정의 비교 함수로 언제 리렌더링할지 결정
 * props가 실제로 변경되었을 때만 리렌더링
 */
export default memo(OptimizedWeatherCard, (prevProps, nextProps) => {
  // 얕은 비교로는 감지하기 어려운 객체 변경 사항 체크
  const prevForecast = prevProps.forecast;
  const nextForecast = nextProps.forecast;
  
  // 날짜가 다르면 리렌더링
  if (prevForecast.date !== nextForecast.date) return false;
  
  // 온도가 다르면 리렌더링
  if (prevForecast.day.maxtemp_c !== nextForecast.day.maxtemp_c ||
      prevForecast.day.mintemp_c !== nextForecast.day.mintemp_c) return false;
  
  // 날씨 상태가 다르면 리렌더링
  if (prevForecast.day.condition.text !== nextForecast.day.condition.text) return false;
  
  // 기타 props 비교
  if (prevProps.isToday !== nextProps.isToday) return false;
  if (prevProps.temperatureUnit !== nextProps.temperatureUnit) return false;
  if (prevProps.onCardClick !== nextProps.onCardClick) return false;
  
  // 모든 조건이 같으면 리렌더링하지 않음 (true 반환)
  return true;
});

// 디스플레이 이름 설정 (디버깅 시 유용)
OptimizedWeatherCard.displayName = 'OptimizedWeatherCard';