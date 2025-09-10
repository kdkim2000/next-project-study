# 📚 Weather Dashboard Pro 학습 가이드

이 프로젝트는 React, Next.js, TypeScript를 처음 배우는 개발자를 위한 종합적인 학습 프로젝트입니다.

## 🎯 학습 목표 달성도 체크리스트

### ✅ 외부 API 연동과 데이터 페칭
- **파일 위치**: `src/utils/api.ts`
- **핵심 기능**:
  - `fetch API` 사용법 익히기
  - Promise/async-await 패턴 이해
  - API 응답 에러 처리
  - 타입 안전성 보장

```typescript
// 학습 포인트: fetch API 사용
export const getCurrentWeather = async (location: string): Promise<WeatherData> => {
  const response = await fetch(`${BASE_URL}/current.json?key=${API_KEY}&q=${location}`);
  const data = await handleAPIResponse(response);
  return data as WeatherData;
};
```

### ✅ 클라이언트 사이드 상태 관리
- **파일 위치**: `src/app/page.tsx`, 모든 컴포넌트
- **핵심 기능**:
  - `useState`로 로컬 상태 관리
  - 상태 끌어올리기 (State Lifting)
  - Props를 통한 데이터 전달

```typescript
// 학습 포인트: 상태 관리
const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
const [loading, setLoading] = useState(false);
```

### ✅ 실시간 데이터 업데이트
- **파일 위치**: `src/components/RealTimeUpdater.tsx`
- **핵심 기능**:
  - `setInterval`을 사용한 주기적 업데이트
  - `useEffect`로 타이머 관리
  - 컴포넌트 언마운트 시 정리

```typescript
// 학습 포인트: 실시간 업데이트
useEffect(() => {
  const interval = setInterval(() => {
    onUpdate();
  }, UPDATE_INTERVAL * 60 * 1000);
  
  return () => clearInterval(interval); // 정리 함수
}, []);
```

## 🛠️ 구현 기술별 학습 가이드

### 1. React Hooks 마스터하기

#### useState - 상태 관리
```typescript
// 기본 사용법
const [count, setCount] = useState(0);

// 객체 상태 관리
const [user, setUser] = useState<User | null>(null);

// 배열 상태 관리
const [items, setItems] = useState<string[]>([]);
```

#### useEffect - 생명주기 관리
```typescript
// 컴포넌트 마운트 시 한 번만 실행
useEffect(() => {
  fetchData();
}, []); // 빈 의존성 배열

// 특정 값 변경 시 실행
useEffect(() => {
  if (location) {
    fetchWeatherData(location);
  }
}, [location]); // location 변경 시마다 실행

// 정리 함수 (cleanup)
useEffect(() => {
  const timer = setInterval(() => {}, 1000);
  return () => clearInterval(timer); // 컴포넌트 언마운트 시 실행
}, []);
```

#### useCallback - 함수 메모이제이션
```typescript
// 불필요한 리렌더링 방지
const handleClick = useCallback((id: string) => {
  // 함수 로직
}, [dependency]); // dependency가 변경될 때만 새 함수 생성
```

### 2. 데이터 페칭 패턴

#### 기본 fetch 패턴
```typescript
const fetchData = async () => {
  setLoading(true);
  setError(null);
  
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Network error');
    const data = await response.json();
    setData(data);
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};
```

#### 병렬 데이터 페칭
```typescript
// 여러 API를 동시에 호출
const [weather, forecast] = await Promise.all([
  getCurrentWeather(location),
  getWeatherForecast(location)
]);
```

### 3. 에러 핸들링 전략

#### 커스텀 에러 클래스
```typescript
export class WeatherAPIError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'WeatherAPIError';
  }
}
```

#### 사용자 친화적 에러 표시
```typescript
if (err instanceof WeatherAPIError) {
  setError(err.message); // 구체적인 에러 메시지
} else {
  setError('일반적인 오류 메시지'); // 예상치 못한 에러
}
```

### 4. 데이터 캐싱 전략

#### Local Storage 활용
```typescript
// 데이터 저장
const cacheWeatherData = (location: string, data: WeatherData) => {
  const cachedData = {
    data,
    timestamp: Date.now(),
    location
  };
  localStorage.setItem('weather_data', JSON.stringify(cachedData));
};

// 캐시 유효성 검사
const isValid = Date.now() - cachedData.timestamp < CACHE_DURATION;
```

### 5. Geolocation API 사용법

```typescript
navigator.geolocation.getCurrentPosition(
  (position) => {
    const { latitude, longitude } = position.coords;
    onLocationSelect(`${latitude},${longitude}`);
  },
  (error) => {
    // 에러 처리: 권한 거부, 위치 불가 등
    switch (error.code) {
      case error.PERMISSION_DENIED:
        setError('위치 접근 권한이 거부되었습니다.');
        break;
      // ... 다른 에러 처리
    }
  },
  {
    enableHighAccuracy: true, // 정확도 높이기
    timeout: 5000,            // 타임아웃 5초
    maximumAge: 0             // 캐시된 위치 사용 안함
  }
);
```

### 6. 차트 라이브러리 (Recharts) 활용

#### 기본 차트 구성
```typescript
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

<LineChart data={chartData}>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis dataKey="name" />
  <YAxis />
  <Tooltip content={<CustomTooltip />} />
  <Line type="monotone" dataKey="temperature" stroke="#8884d8" />
</LineChart>
```

#### 반응형 차트
```typescript
import { ResponsiveContainer } from 'recharts';

<ResponsiveContainer width="100%" height={300}>
  <LineChart data={data}>
    {/* 차트 구성요소 */}
  </LineChart>
</ResponsiveContainer>
```

### 7. PWA 구현하기

#### Web App Manifest
```json
{
  "name": "Weather Dashboard Pro",
  "short_name": "WeatherPro",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#1976d2"
}
```

#### Service Worker 등록
```javascript
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then(registration => console.log('SW registered'))
    .catch(error => console.log('SW registration failed'));
}
```

## 🔧 고급 기능 학습

### 1. 알림 시스템
- **브라우저 Notification API** 사용법
- **권한 요청** 및 처리
- **조건부 알림** 로직

### 2. 실시간 업데이트
- **타이머 관리** (setInterval/clearInterval)
- **진행률 표시** 구현
- **사용자 제어** 인터페이스

### 3. 고급 차트
- **다양한 차트 유형** (Line, Bar, Area, Radar, Pie)
- **동적 데이터 필터링**
- **인터랙티브 컨트롤**

## 📖 추가 학습 리소스

### 공식 문서
- [React 공식 문서](https://react.dev/)
- [Next.js 공식 문서](https://nextjs.org/docs)
- [TypeScript 공식 문서](https://www.typescriptlang.org/docs/)
- [Material-UI 공식 문서](https://mui.com/)

### 유용한 도구
- [TypeScript Playground](https://www.typescriptlang.org/play)
- [React DevTools](https://react.dev/learn/react-developer-tools)
- [Next.js DevTools](https://nextjs.org/docs/advanced-features/debugging)

## 🚀 다음 단계 학습 과제

1. **상태 관리 라이브러리**: Redux Toolkit 또는 Zustand 도입
2. **테스팅**: Jest와 React Testing Library로 테스트 작성
3. **성능 최적화**: React.memo, useMemo 활용
4. **접근성**: ARIA 속성과 키보드 네비게이션 개선
5. **국제화**: react-i18next로 다국어 지원

## 💡 문제 해결 가이드

### 일반적인 오류들

1. **무한 루프**: useEffect 의존성 배열 확인
2. **메모리 누수**: cleanup 함수 작성 필수
3. **타입 오류**: 인터페이스 정의 및 타입 가드 사용
4. **API 오류**: 에러 핸들링과 사용자 피드백 제공

### 디버깅 팁
- Chrome DevTools의 Network 탭에서 API 호출 확인
- React DevTools로 컴포넌트 상태 모니터링
- console.log() 대신 debugger 문 사용

이 프로젝트를 통해 현대적인 React 애플리케이션 개발의 모든 측면을 경험할 수 있습니다! 🎉