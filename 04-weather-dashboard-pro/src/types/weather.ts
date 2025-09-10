// src/types/weather.ts
// 날씨 데이터의 타입을 정의하는 파일

export interface WeatherData {
  location: {
    name: string;
    region: string;
    country: string;
    lat: number;
    lon: number;
    localtime: string;
  };
  current: {
    temp_c: number;
    temp_f: number;
    condition: {
      text: string;
      icon: string;
    };
    humidity: number;
    wind_kph: number;
    wind_dir: string;
    pressure_mb: number;
    uv: number;
    feelslike_c: number;
    vis_km: number;
  };
}

export interface ForecastData {
  date: string;
  day: {
    maxtemp_c: number;
    mintemp_c: number;
    condition: {
      text: string;
      icon: string;
    };
    avghumidity: number;
    maxwind_kph: number;
    uv: number;
  };
}

export interface WeatherForecast {
  forecast: {
    forecastday: Array<ForecastData>;
  };
}

// 지역 검색 결과 타입
export interface LocationSearchResult {
  id: number;
  name: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
}

// 차트 데이터 타입 (확장됨)
export interface ChartDataPoint {
  name: string;
  temperature: number;
  humidity: number;
  maxTemp?: number;
  minTemp?: number;
  wind?: number;
  uv?: number;
}