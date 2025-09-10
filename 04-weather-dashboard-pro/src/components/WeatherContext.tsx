// src/contexts/WeatherContext.tsx
// Context API를 활용한 전역 상태 관리 학습

'use client';

import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { getCurrentWeather, getWeatherForecast, WeatherAPIError } from '@/utils/api';
import { cacheWeatherData, getCachedWeatherData, setLastLocation, getLastLocation } from '@/utils/storage';
import type { WeatherData, WeatherForecast } from '@/types/weather';

// Context에서 관리할 상태 타입
interface WeatherState {
  weatherData: WeatherData | null;
  forecastData: WeatherForecast | null;
  currentLocation: string;
  loading: boolean;
  error: string | null;
  lastUpdateTime: Date | null;
  settings: {
    temperatureUnit: 'celsius' | 'fahrenheit';
    autoUpdate: boolean;
    updateInterval: number; // 분 단위
  };
}

// 액션 타입 정의
type WeatherAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_WEATHER_DATA'; payload: { weather: WeatherData; forecast: WeatherForecast; location: string } }
  | { type: 'SET_CURRENT_LOCATION'; payload: string }
  | { type: 'SET_LAST_UPDATE_TIME'; payload: Date }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<WeatherState['settings']> }
  | { type: 'CLEAR_DATA' };

// Context에서 제공할 값들의 타입
interface WeatherContextValue {
  // 상태
  state: WeatherState;
  
  // 액션 함수들
  fetchWeather: (location: string, useCache?: boolean) => Promise<void>;
  refreshWeather: () => Promise<void>;
  setCurrentLocation: (location: string) => void;
  updateSettings: (settings: Partial<WeatherState['settings']>) => void;
  clearError: () => void;
  clearData: () => void;
}

// 초기 상태
const initialState: WeatherState = {
  weatherData: null,
  forecastData: null,
  currentLocation: '',
  loading: false,
  error: null,
  lastUpdateTime: null,
  settings: {
    temperatureUnit: 'celsius',
    autoUpdate: true,
    updateInterval: 10 // 10분
  }
};

// 리듀서 함수
function weatherReducer(state: WeatherState, action: WeatherAction): WeatherState {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
        error: action.payload ? null : state.error
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false
      };

    case 'SET_WEATHER_DATA':
      return {
        ...state,
        weatherData: action.payload.weather,
        forecastData: action.payload.forecast,
        currentLocation: action.payload.location,
        loading: false,
        error: null
      };

    case 'SET_CURRENT_LOCATION':
      return {
        ...state,
        currentLocation: action.payload
      };

    case 'SET_LAST_UPDATE_TIME':
      return {
        ...state,
        lastUpdateTime: action.payload
      };

    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: {
          ...state.settings,
          ...action.payload
        }
      };

    case 'CLEAR_DATA':
      return {
        ...state,
        weatherData: null,
        forecastData: null,
        currentLocation: '',
        error: null,
        lastUpdateTime: null
      };

    default:
      return state;
  }
}

// Context 생성 (초기값은 null)
const WeatherContext = createContext<WeatherContextValue | null>(null);

/**
 * WeatherProvider 컴포넌트
 * 
 * 학습 목표:
 * - Context API 활용법
 * - useReducer와 Context 조합
 * - 전역 상태 관리 패턴
 * - Provider 패턴 구현
 */
interface WeatherProviderProps {
  children: React.ReactNode;
}

export function WeatherProvider({ children }: WeatherProviderProps) {
  const [state, dispatch] = useReducer(weatherReducer, initialState);

  // 날씨 데이터 페칭 함수
  const fetchWeather = useCallback(async (location: string, useCache: boolean = true) => {
    if (!location.trim() || state.loading) return;

    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      // 캐시 확인
      if (useCache) {
        const cachedData = getCachedWeatherData(location);
        if (cachedData) {
          // 캐시된 데이터만으로는 예보 데이터가 없으므로 API 호출도 함께 수행
          const forecastResponse = await getWeatherForecast(location, 3);
          
          dispatch({
            type: 'SET_WEATHER_DATA',
            payload: {
              weather: cachedData,
              forecast: forecastResponse,
              location
            }
          });
          dispatch({ type: 'SET_LAST_UPDATE_TIME', payload: new Date() });
          return;
        }
      }

      // API에서 데이터 가져오기
      const [weatherResponse, forecastResponse] = await Promise.all([
        getCurrentWeather(location),
        getWeatherForecast(location, 3)
      ]);

      // 상태 업데이트
      dispatch({
        type: 'SET_WEATHER_DATA',
        payload: {
          weather: weatherResponse,
          forecast: forecastResponse,
          location
        }
      });
      dispatch({ type: 'SET_LAST_UPDATE_TIME', payload: new Date() });

      // 캐시 및 로컬 스토리지 저장
      cacheWeatherData(location, weatherResponse);
      setLastLocation(location);

    } catch (err) {
      console.error('Weather fetch error:', err);
      
      const errorMessage = err instanceof WeatherAPIError 
        ? err.message 
        : '날씨 정보를 가져오는 중 오류가 발생했습니다.';
        
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
    }
  }, [state.loading]);

  // 현재 위치 날씨 새로고침
  const refreshWeather = useCallback(async () => {
    if (state.currentLocation) {
      await fetchWeather(state.currentLocation, false);
    }
  }, [state.currentLocation, fetchWeather]);

  // 현재 위치 설정
  const setCurrentLocation = useCallback((location: string) => {
    dispatch({ type: 'SET_CURRENT_LOCATION', payload: location });
  }, []);

  // 설정 업데이트
  const updateSettings = useCallback((newSettings: Partial<WeatherState['settings']>) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: newSettings });
  }, []);

  // 에러 클리어
  const clearError = useCallback(() => {
    dispatch({ type: 'SET_ERROR', payload: null });
  }, []);

  // 데이터 클리어
  const clearData = useCallback(() => {
    dispatch({ type: 'CLEAR_DATA' });
  }, []);

  // 자동 업데이트 설정
  useEffect(() => {
    if (!state.settings.autoUpdate || !state.currentLocation) return;

    const interval = setInterval(() => {
      refreshWeather();
    }, state.settings.updateInterval * 60 * 1000);

    return () => clearInterval(interval);
  }, [state.settings.autoUpdate, state.settings.updateInterval, state.currentLocation, refreshWeather]);

  // 초기 로드 (마지막 위치)
  useEffect(() => {
    const lastLocation = getLastLocation();
    if (lastLocation && !state.weatherData) {
      fetchWeather(lastLocation, true);
    }
  }, [fetchWeather, state.weatherData]);

  // Context 값
  const contextValue: WeatherContextValue = {
    state,
    fetchWeather,
    refreshWeather,
    setCurrentLocation,
    updateSettings,
    clearError,
    clearData
  };

  return (
    <WeatherContext.Provider value={contextValue}>
      {children}
    </WeatherContext.Provider>
  );
}

/**
 * useWeather Hook - Context 사용을 위한 커스텀 훅
 * 
 * 학습 목표:
 * - 커스텀 훅으로 Context 사용 추상화
 * - 타입 안전성 보장
 * - 에러 핸들링 (Context 외부 사용 감지)
 */
export function useWeather(): WeatherContextValue {
  const context = useContext(WeatherContext);
  
  if (!context) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  
  return context;
}

// 개발 모드에서만 사용할 디버깅 훅
export function useWeatherDebug() {
  const context = useWeather();
  
  // 개발 모드에서만 콘솔에 상태 로깅
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('WeatherContext State:', context.state);
    }
  }, [context.state]);
  
  return context;
}