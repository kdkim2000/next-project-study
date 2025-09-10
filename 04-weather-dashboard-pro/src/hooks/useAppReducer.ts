// src/hooks/useAppReducer.ts
// useReducer Hook을 활용한 복잡한 상태 관리 패턴

import { useReducer, useCallback } from 'react';
import type { WeatherData, WeatherForecast } from '@/types/weather';

// 앱 전체 상태 타입 정의
export interface AppState {
  // 날씨 관련 상태
  weatherData: WeatherData | null;
  forecastData: WeatherForecast | null;
  currentLocation: string;
  
  // UI 상태
  loading: boolean;
  error: string | null;
  snackbar: {
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'warning' | 'info';
  };
  
  // 사용자 설정
  settings: {
    autoUpdate: boolean;
    notifications: boolean;
    temperatureUnit: 'celsius' | 'fahrenheit';
    theme: 'light' | 'dark' | 'auto';
  };
  
  // 메타 정보
  lastUpdateTime: Date | null;
  hasInitialLoaded: boolean;
}

// 액션 타입 정의 (Union Type 활용)
export type AppAction = 
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_WEATHER_DATA'; payload: WeatherData }
  | { type: 'SET_FORECAST_DATA'; payload: WeatherForecast }
  | { type: 'SET_CURRENT_LOCATION'; payload: string }
  | { type: 'SET_LAST_UPDATE_TIME'; payload: Date }
  | { type: 'SET_INITIAL_LOADED'; payload: boolean }
  | { type: 'SHOW_SNACKBAR'; payload: { message: string; severity: 'success' | 'error' | 'warning' | 'info' } }
  | { type: 'HIDE_SNACKBAR' }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<AppState['settings']> }
  | { type: 'CLEAR_DATA' }
  | { type: 'RESET_STATE' };

// 초기 상태
const initialState: AppState = {
  weatherData: null,
  forecastData: null,
  currentLocation: '',
  loading: false,
  error: null,
  snackbar: {
    open: false,
    message: '',
    severity: 'info'
  },
  settings: {
    autoUpdate: true,
    notifications: false,
    temperatureUnit: 'celsius',
    theme: 'auto'
  },
  lastUpdateTime: null,
  hasInitialLoaded: false
};

// 리듀서 함수 (상태 업데이트 로직)
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
        error: action.payload ? null : state.error // 로딩 시작하면 에러 클리어
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false // 에러 발생 시 로딩 종료
      };

    case 'SET_WEATHER_DATA':
      return {
        ...state,
        weatherData: action.payload,
        error: null
      };

    case 'SET_FORECAST_DATA':
      return {
        ...state,
        forecastData: action.payload
      };

    case 'SET_CURRENT_LOCATION':
      return {
        ...state,
        currentLocation: action.payload
      };

    case 'SET_LAST_UPDATE_TIME':
      return {
        ...state,
        lastUpdateTime: action.payload,
        loading: false
      };

    case 'SET_INITIAL_LOADED':
      return {
        ...state,
        hasInitialLoaded: action.payload
      };

    case 'SHOW_SNACKBAR':
      return {
        ...state,
        snackbar: {
          open: true,
          message: action.payload.message,
          severity: action.payload.severity
        }
      };

    case 'HIDE_SNACKBAR':
      return {
        ...state,
        snackbar: {
          ...state.snackbar,
          open: false
        }
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

    case 'RESET_STATE':
      return initialState;

    default:
      // TypeScript에서 모든 액션 타입을 처리했는지 확인
      return state;
  }
}

/**
 * useReducer를 활용한 앱 상태 관리 커스텀 훅
 * 
 * 학습 목표:
 * - useReducer Hook 활용법
 * - 복잡한 상태 로직 관리
 * - 액션 기반 상태 업데이트
 * - 타입 안전한 상태 관리
 * - Immutable 상태 업데이트
 */
export const useAppReducer = () => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // 액션 크리에이터 함수들 (useCallback으로 최적화)
  const actions = {
    setLoading: useCallback((loading: boolean) => {
      dispatch({ type: 'SET_LOADING', payload: loading });
    }, []),

    setError: useCallback((error: string | null) => {
      dispatch({ type: 'SET_ERROR', payload: error });
    }, []),

    setWeatherData: useCallback((data: WeatherData) => {
      dispatch({ type: 'SET_WEATHER_DATA', payload: data });
    }, []),

    setForecastData: useCallback((data: WeatherForecast) => {
      dispatch({ type: 'SET_FORECAST_DATA', payload: data });
    }, []),

    setCurrentLocation: useCallback((location: string) => {
      dispatch({ type: 'SET_CURRENT_LOCATION', payload: location });
    }, []),

    setLastUpdateTime: useCallback((time: Date) => {
      dispatch({ type: 'SET_LAST_UPDATE_TIME', payload: time });
    }, []),

    setInitialLoaded: useCallback((loaded: boolean) => {
      dispatch({ type: 'SET_INITIAL_LOADED', payload: loaded });
    }, []),

    showSnackbar: useCallback((message: string, severity: 'success' | 'error' | 'warning' | 'info' = 'info') => {
      dispatch({ type: 'SHOW_SNACKBAR', payload: { message, severity } });
    }, []),

    hideSnackbar: useCallback(() => {
      dispatch({ type: 'HIDE_SNACKBAR' });
    }, []),

    updateSettings: useCallback((settings: Partial<AppState['settings']>) => {
      dispatch({ type: 'UPDATE_SETTINGS', payload: settings });
    }, []),

    clearData: useCallback(() => {
      dispatch({ type: 'CLEAR_DATA' });
    }, []),

    resetState: useCallback(() => {
      dispatch({ type: 'RESET_STATE' });
    }, [])
  };

  return {
    state,
    dispatch, // 직접 dispatch도 노출 (고급 사용자용)
    actions    // 편의를 위한 액션 크리에이터들
  };
};