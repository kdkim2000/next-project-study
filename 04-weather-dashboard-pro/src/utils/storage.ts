// src/utils/storage.ts
// 로컬 스토리지를 활용한 데이터 캐싱 유틸리티

import { WeatherData } from '@/types/weather';

const CACHE_KEYS = {
  WEATHER_DATA: 'weather_data',
  FAVORITE_LOCATIONS: 'favorite_locations',
  LAST_LOCATION: 'last_location'
} as const;

// 캐시 데이터 인터페이스
interface CachedWeatherData {
  data: WeatherData;
  timestamp: number;
  location: string;
}

// 캐시 유효 시간 (10분)
const CACHE_DURATION = 10 * 60 * 1000;

// 로컬 스토리지에서 데이터를 안전하게 가져오는 함수
const getFromStorage = <T>(key: string): T | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error(`Error reading from localStorage:`, error);
    return null;
  }
};

// 로컬 스토리지에 데이터를 안전하게 저장하는 함수
const setToStorage = <T>(key: string, value: T): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing to localStorage:`, error);
  }
};

// 날씨 데이터를 캐시에 저장
export const cacheWeatherData = (location: string, data: WeatherData): void => {
  const cachedData: CachedWeatherData = {
    data,
    timestamp: Date.now(),
    location
  };
  setToStorage(CACHE_KEYS.WEATHER_DATA, cachedData);
};

// 캐시된 날씨 데이터를 가져오기 (유효하지 않으면 null 반환)
export const getCachedWeatherData = (location: string): WeatherData | null => {
  const cachedData = getFromStorage<CachedWeatherData>(CACHE_KEYS.WEATHER_DATA);
  
  if (!cachedData) return null;
  
  const isExpired = Date.now() - cachedData.timestamp > CACHE_DURATION;
  const isSameLocation = cachedData.location.toLowerCase() === location.toLowerCase();
  
  if (isExpired || !isSameLocation) return null;
  
  return cachedData.data;
};

// 즐겨찾는 지역 관리
export const getFavoriteLocations = (): string[] => {
  return getFromStorage<string[]>(CACHE_KEYS.FAVORITE_LOCATIONS) || [];
};

export const addFavoriteLocation = (location: string): void => {
  const favorites = getFavoriteLocations();
  if (!favorites.includes(location)) {
    favorites.push(location);
    setToStorage(CACHE_KEYS.FAVORITE_LOCATIONS, favorites);
  }
};

export const removeFavoriteLocation = (location: string): void => {
  const favorites = getFavoriteLocations();
  const updated = favorites.filter(fav => fav !== location);
  setToStorage(CACHE_KEYS.FAVORITE_LOCATIONS, updated);
};

// 마지막 검색 지역 저장/가져오기
export const getLastLocation = (): string | null => {
  return getFromStorage<string>(CACHE_KEYS.LAST_LOCATION);
};

export const setLastLocation = (location: string): void => {
  setToStorage(CACHE_KEYS.LAST_LOCATION, location);
};