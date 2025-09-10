// src/hooks/useWeatherData.ts
// 커스텀 훅 - 날씨 데이터 관리 로직을 재사용 가능한 형태로 분리

import { useState, useCallback } from 'react';
import { getCurrentWeather, getWeatherForecast, WeatherAPIError } from '@/utils/api';
import { cacheWeatherData, getCachedWeatherData, setLastLocation } from '@/utils/storage';
import type { WeatherData, WeatherForecast } from '@/types/weather';

// 커스텀 훅의 반환 타입 정의
export interface UseWeatherDataReturn {
  // 상태
  weatherData: WeatherData | null;
  forecastData: WeatherForecast | null;
  loading: boolean;
  error: string | null;
  lastUpdateTime: Date | null;
  
  // 액션 함수들
  fetchWeather: (location: string, useCache?: boolean) => Promise<void>;
  clearError: () => void;
  clearData: () => void;
}

/**
 * 날씨 데이터 관리 커스텀 훅
 * 
 * 학습 목표:
 * - 비즈니스 로직을 컴포넌트에서 분리
 * - 재사용 가능한 상태 관리 로직
 * - 타입 안전성 보장
 * - 관심사의 분리 (Separation of Concerns)
 */
export const useWeatherData = (): UseWeatherDataReturn => {
  // 상태 정의
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [forecastData, setForecastData] = useState<WeatherForecast | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdateTime, setLastUpdateTime] = useState<Date | null>(null);

  // 날씨 데이터 페칭 함수
  const fetchWeather = useCallback(async (location: string, useCache: boolean = true) => {
    if (!location.trim() || loading) return;

    setLoading(true);
    setError(null);

    try {
      // 캐시 확인
      if (useCache) {
        const cachedData = getCachedWeatherData(location);
        if (cachedData) {
          setWeatherData(cachedData);
          setLastUpdateTime(new Date());
          setLoading(false);
          return;
        }
      }

      // API 호출
      const [currentWeatherResponse, forecastResponse] = await Promise.all([
        getCurrentWeather(location),
        getWeatherForecast(location, 3)
      ]);

      // 상태 업데이트
      setWeatherData(currentWeatherResponse);
      setForecastData(forecastResponse);
      setLastUpdateTime(new Date());

      // 캐시 및 저장
      cacheWeatherData(location, currentWeatherResponse);
      setLastLocation(location);

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
  }, [loading]);

  // 에러 클리어
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // 데이터 클리어
  const clearData = useCallback(() => {
    setWeatherData(null);
    setForecastData(null);
    setError(null);
    setLastUpdateTime(null);
  }, []);

  return {
    // 상태
    weatherData,
    forecastData,
    loading,
    error,
    lastUpdateTime,
    
    // 액션 함수들
    fetchWeather,
    clearError,
    clearData
  };
};