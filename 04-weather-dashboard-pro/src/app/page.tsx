// src/app/page.tsx
// 메인 페이지 컴포넌트 - 모든 기능을 통합하는 최상위 컴포넌트

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Fab,
  Snackbar
} from '@mui/material';
import { Refresh } from '@mui/icons-material';

// 컴포넌트들 import
import WeatherSearch from '@/components/WeatherSearch';
import CurrentWeather from '@/components/CurrentWeather';
import ForecastCards from '@/components/ForecastCards';
import WeatherChart from '@/components/WeatherChart';
import WeatherSummary from '@/components/WeatherSummary';
import RealTimeUpdater from '@/components/RealTimeUpdater';
import NotificationSystem from '@/components/NotificationSystem';

// 유틸리티 함수들 import
import { getCurrentWeather, getWeatherForecast, WeatherAPIError } from '@/utils/api';
import { 
  cacheWeatherData, 
  getCachedWeatherData, 
  setLastLocation,
  getLastLocation 
} from '@/utils/storage';

// 타입 import
import type { WeatherData, WeatherForecast } from '@/types/weather';

function WeatherDashboard() {
  // 상태 관리
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [forecastData, setForecastData] = useState<WeatherForecast | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentLocation, setCurrentLocation] = useState<string>('');
  const [lastUpdateTime, setLastUpdateTime] = useState<Date | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [hasInitialLoaded, setHasInitialLoaded] = useState(false);

  // 컴포넌트 마운트 시 마지막 위치 한 번만 로드
  useEffect(() => {
    if (!hasInitialLoaded) {
      const lastLocation = getLastLocation();
      if (lastLocation) {
        setHasInitialLoaded(true);
        handleLocationSelect(lastLocation);
      }
    }
  }, [hasInitialLoaded]);

  // 날씨 데이터를 가져오는 함수
  const fetchWeatherData = async (location: string, useCache: boolean = true) => {
    if (!location.trim() || loading) return;

    setLoading(true);
    setError(null);

    try {
      // 캐시된 데이터 확인
      if (useCache) {
        const cachedData = getCachedWeatherData(location);
        if (cachedData) {
          setWeatherData(cachedData);
          setCurrentLocation(location);
          setLastUpdateTime(new Date());
          setSnackbarMessage('캐시된 데이터를 로드했습니다.');
          setSnackbarOpen(true);
          setLoading(false);
          return;
        }
      }

      // API에서 데이터 가져오기
      const [currentWeatherResponse, forecastResponse] = await Promise.all([
        getCurrentWeather(location),
        getWeatherForecast(location, 3)
      ]);

      // 상태 업데이트
      setWeatherData(currentWeatherResponse);
      setForecastData(forecastResponse);
      setCurrentLocation(location);
      setLastUpdateTime(new Date());

      // 데이터 캐싱 및 저장
      cacheWeatherData(location, currentWeatherResponse);
      setLastLocation(location);

      // 성공 메시지
      setSnackbarMessage('날씨 정보가 업데이트되었습니다.');
      setSnackbarOpen(true);

    } catch (err) {
      console.error('Weather fetch error:', err);
      
      if (err instanceof WeatherAPIError) {
        setError(err.message);
      } else {
        setError('날씨 정보를 가져오는 중 오류가 발생했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  // 위치 선택 핸들러
  const handleLocationSelect = useCallback((location: string) => {
    fetchWeatherData(location, true);
  }, []);

  // 수동 새로고침
  const handleRefresh = useCallback(() => {
    if (currentLocation) {
      fetchWeatherData(currentLocation, false);
    }
  }, [currentLocation]);

  // 실시간 업데이트 핸들러
  const handleRealTimeUpdate = useCallback(() => {
    if (currentLocation) {
      fetchWeatherData(currentLocation, false);
    }
  }, [currentLocation]);

  // 스낵바 닫기
  const handleSnackbarClose = useCallback(() => {
    setSnackbarOpen(false);
  }, []);

  // 자동 새로고침 (15분마다)
  useEffect(() => {
    if (!currentLocation) return;

    const interval = setInterval(() => {
      if (currentLocation) {
        fetchWeatherData(currentLocation, false);
      }
    }, 15 * 60 * 1000);

    return () => clearInterval(interval);
  }, [currentLocation]);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* 헤더 */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Weather Dashboard Pro
        </Typography>
        <Typography variant="h6" color="text.secondary">
          실시간 날씨 정보와 3일 예보를 확인하세요
        </Typography>
        {lastUpdateTime && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            마지막 업데이트: {lastUpdateTime.toLocaleString('ko-KR')}
          </Typography>
        )}
      </Box>

      {/* API 키 설정 안내 */}
      {!process.env.NEXT_PUBLIC_WEATHER_API_KEY && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            API 키가 설정되지 않았습니다
          </Typography>
          <Typography variant="body2">
            1. <strong>WeatherAPI.com</strong>에서 무료 계정을 생성하세요<br/>
            2. API 키를 발급받으세요<br/>
            3. 프로젝트 루트에 <code>.env.local</code> 파일을 생성하고 다음을 추가하세요:<br/>
            <code>NEXT_PUBLIC_WEATHER_API_KEY=your_api_key_here</code><br/>
            4. 개발 서버를 재시작하세요: <code>npm run dev</code>
          </Typography>
        </Alert>
      )}

      {/* 검색 컴포넌트 */}
      <WeatherSearch onLocationSelect={handleLocationSelect} loading={loading} />

      {/* 실시간 업데이트 컨트롤 */}
      {weatherData && (
        <RealTimeUpdater 
          onUpdate={handleRealTimeUpdate}
          lastUpdateTime={lastUpdateTime}
          loading={loading}
        />
      )}

      {/* 알림 시스템 */}
      <NotificationSystem weatherData={weatherData} />

      {/* 에러 표시 */}
      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 3 }} 
          onClose={() => setError(null)}
        >
          <Typography variant="subtitle2" gutterBottom>
            오류가 발생했습니다
          </Typography>
          <Typography variant="body2">
            {error}
          </Typography>
          {error.includes('API 키') && (
            <Typography variant="body2" sx={{ mt: 1, fontWeight: 'bold' }}>
              💡 위의 API 키 설정 안내를 확인해주세요.
            </Typography>
          )}
        </Alert>
      )}

      {/* 로딩 표시 */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress size={50} />
        </Box>
      )}

      {/* 날씨 데이터 표시 */}
      {weatherData && !loading && (
        <>
          {/* 현재 날씨 */}
          <CurrentWeather weatherData={weatherData} />

          {/* 일기예보 및 차트 */}
          {forecastData && (
            <>
              {/* 일기예보 카드 */}
              <ForecastCards forecastData={forecastData.forecast.forecastday} />
              
              {/* 날씨 요약 통계 */}
              <WeatherSummary forecastData={forecastData.forecast.forecastday} />
              
              {/* 날씨 차트 */}
              <WeatherChart forecastData={forecastData.forecast.forecastday} />
            </>
          )}
        </>
      )}

      {/* 플로팅 새로고침 버튼 */}
      {weatherData && (
        <Fab
          color="primary"
          aria-label="refresh"
          onClick={handleRefresh}
          disabled={loading}
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            zIndex: 1000,
          }}
        >
          <Refresh />
        </Fab>
      )}

      {/* 스낵바 알림 */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      />
    </Container>
  );
}

export default WeatherDashboard;