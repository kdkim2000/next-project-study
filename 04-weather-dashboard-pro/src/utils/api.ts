// src/utils/api.ts
// API 호출을 위한 유틸리티 함수들

import { WeatherData, WeatherForecast, LocationSearchResult } from '@/types/weather';

const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
const BASE_URL = 'https://api.weatherapi.com/v1';

// 에러 처리를 위한 커스텀 에러 클래스
export class WeatherAPIError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'WeatherAPIError';
  }
}

// API 응답을 검증하는 함수
const handleAPIResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new WeatherAPIError(
      errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`,
      response.status
    );
  }
  return response.json();
};

// 현재 날씨 정보를 가져오는 함수
export const getCurrentWeather = async (location: string): Promise<WeatherData> => {
  if (!API_KEY) {
    throw new WeatherAPIError('API 키가 설정되지 않았습니다.');
  }

  try {
    const response = await fetch(
      `${BASE_URL}/current.json?key=${API_KEY}&q=${encodeURIComponent(location)}&aqi=no`
    );
    
    const data = await handleAPIResponse(response);
    return data as WeatherData;
  } catch (error) {
    if (error instanceof WeatherAPIError) {
      throw error;
    }
    throw new WeatherAPIError('네트워크 오류가 발생했습니다.');
  }
};

// 일기예보 정보를 가져오는 함수 (무료 사용자는 3일 제한)
export const getWeatherForecast = async (location: string, days: number = 3): Promise<WeatherForecast> => {
  if (!API_KEY) {
    throw new WeatherAPIError('API 키가 설정되지 않았습니다.');
  }

  // 무료 사용자는 최대 3일까지만 가능
  const limitedDays = Math.min(days, 3);

  try {
    const response = await fetch(
      `${BASE_URL}/forecast.json?key=${API_KEY}&q=${encodeURIComponent(location)}&days=${limitedDays}&aqi=no`
    );
    
    const data = await handleAPIResponse(response);
    return data as WeatherForecast;
  } catch (error) {
    if (error instanceof WeatherAPIError) {
      throw error;
    }
    throw new WeatherAPIError('네트워크 오류가 발생했습니다.');
  }
};

// 지역 검색을 위한 함수
export const searchLocations = async (query: string): Promise<LocationSearchResult[]> => {
  if (!API_KEY) {
    throw new WeatherAPIError('API 키가 설정되지 않았습니다.');
  }

  if (query.length < 3) {
    return [];
  }

  try {
    const response = await fetch(
      `${BASE_URL}/search.json?key=${API_KEY}&q=${encodeURIComponent(query)}`
    );
    
    const data = await handleAPIResponse(response);
    return data as LocationSearchResult[];
  } catch (error) {
    console.error('Location search error:', error);
    return [];
  }
};