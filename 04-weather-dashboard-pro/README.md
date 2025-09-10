# Weather Dashboard Pro 🌦️

실시간 날씨 정보와 7일 예보를 제공하는 현대적인 날씨 대시보드입니다.

## 🚀 주요 기능

- **실시간 날씨 정보**: 현재 온도, 습도, 바람 등 상세 정보 제공
- **7일 일기예보**: 향후 일주일간의 날씨 예측
- **인터랙티브 차트**: Recharts를 이용한 데이터 시각화
- **지역 검색**: 전 세계 도시 검색 및 즐겨찾기
- **현재 위치**: GPS를 이용한 현재 위치 날씨 확인
- **PWA 지원**: 모바일 앱처럼 설치 및 사용 가능
- **오프라인 지원**: 서비스 워커를 통한 캐싱
- **반응형 디자인**: 모든 디바이스에서 최적화된 UI

## 🛠️ 기술 스택

- **Frontend**: Next.js 14, React 18, TypeScript
- **UI Library**: Material-UI (MUI) v5
- **차트**: Recharts
- **API**: WeatherAPI.com
- **PWA**: Service Worker, Web App Manifest
- **스타일링**: Material-UI 테마 시스템
- **상태 관리**: React Hooks (useState, useEffect)
- **캐싱**: Local Storage + Service Worker

## 📋 사전 요구사항

- Node.js 18 이상
- npm 8 이상
- WeatherAPI.com API 키

## 🔧 설치 및 실행

### 1. 프로젝트 클론 및 의존성 설치

```bash
# 프로젝트 생성 (Next.js CLI 사용)
npx create-next-app@latest weather-dashboard-pro
cd weather-dashboard-pro

# 필요한 패키지 설치
npm install @mui/material @emotion/react @emotion/styled @mui/icons-material
npm install @mui/x-charts recharts
npm install @types/node @types/react @types/react-dom
```

### 2. API 키 설정

1. [WeatherAPI.com](https://www.weatherapi.com/)에서 무료 계정 생성
2. API 키 발급 받기
3. 루트 디렉토리에 `.env.local` 파일 생성:

```bash
# .env.local
NEXT_PUBLIC_WEATHER_API_KEY=your_api_key_here
```

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:3000` 접속

### 4. 빌드 및 배포

```bash
# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start
```

## 📁 프로젝트 구조

```
weather-dashboard-pro/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # 루트 레이아웃
│   │   └── page.tsx            # 메인 페이지
│   ├── components/
│   │   ├── ThemeProvider.tsx   # Material-UI 테마
│   │   ├── WeatherSearch.tsx   # 날씨 검색 컴포넌트
│   │   ├── CurrentWeather.tsx  # 현재 날씨 표시
│   │   ├── ForecastCards.tsx   # 일기예보 카드
│   │   └── WeatherChart.tsx    # 날씨 차트
│   ├── types/
│   │   └── weather.ts          # 타입 정의
│   └── utils/
│       ├── api.ts             # API 호출 함수
│       └── storage.ts         # 로컬 스토리지 유틸
├── public/
│   ├── manifest.json          # PWA 매니페스트
│   ├── sw.js                 # 서비스 워커
│   └── icons/                # PWA 아이콘들
├── .env.local                # 환경 변수
├── next.config.js           # Next.js 설정
├── tsconfig.json            # TypeScript 설정
├── .eslintrc.json          # ESLint 설정
└── package.json            # 프로젝트 의존성
```

## 🎯 학습 포인트

### 1. 외부 API 연동
- fetch API를 사용한 데이터 페칭
- 에러 핸들링 및 로딩 상태 관리
- API 응답 타입 정의

### 2. React Hooks 활용
- `useState`: 컴포넌트 상태 관리
- `useEffect`: 사이드 이펙트 처리 및 생명주기
- `useCallback`: 함수 메모이제이션

### 3. 데이터 캐싱 전략
- Local Storage를 활용한 클라이언트 사이드 캐싱
- Service Worker를 통한 네트워크 캐싱
- 캐시 유효성 검사 및 업데이트

### 4. PWA 기능 구현
- Web App Manifest 설정
- Service Worker 등록 및 관리
- 오프라인 지원 및 백그라운드 동기화

### 5. Material-UI 활용
- 테마 시스템 커스터마이징
- 반응형 그리드 시스템
- 컴포넌트 스타일링

## 🌐 API 사용법

### WeatherAPI.com 주요 엔드포인트

```typescript
// 현재 날씨
GET https://api.weatherapi.com/v1/current.json?key={API_KEY}&q={location}

// 일기예보
GET https://api.weatherapi.com/v1/forecast.json?key={API_KEY}&q={location}&days=7

// 지역 검색
GET https://api.weatherapi.com/v1/search.json?key={API_KEY}&q={query}
```

### 사용 예시

```typescript
import { getCurrentWeather } from '@/utils/api';

// 현재 날씨 가져오기
const weatherData = await getCurrentWeather('Seoul');
console.log(weatherData.current.temp_c); // 현재 온도
```

## 📱 PWA 기능

### 앱 설치
1. 브라우저에서 사이트 접속
2. 주소창의 "앱 설치" 아이콘 클릭
3. 홈 화면에 추가하여 앱처럼 사용

### 오프라인 지원
- 이전에 검색한 날씨 데이터는 오프라인에서도 조회 가능
- Service Worker가 자동으로 데이터 캐싱 관리

## 🔍 주요 컴포넌트 설명

### WeatherSearch
- 도시 검색 및 자동완성
- 현재 위치 가져오기 (Geolocation API)
- 최근 검색 기록 관리

### CurrentWeather
- 현재 날씨 상세 정보 표시
- 온도, 습도, 바람, 기압 등
- UV 지수에 따른 색상 구분

### ForecastCards
- 7일간 일기예보 카드 형태 표시
- 반응형 그리드 레이아웃
- 호버 효과 및 애니메이션

### WeatherChart
- 온도, 습도 데이터 시각화
- 선형/막대 차트 전환 가능
- Recharts 라이브러리 활용

## 🚨 트러블슈팅

### 1. API 키 오류
```
Error: API 키가 설정되지 않았습니다.
```
→ `.env.local` 파일에 올바른 API 키 설정 확인

### 2. 위치 권한 오류
```
Error: 위치 접근 권한이 거부되었습니다.
```
→ 브라우저 설정에서 위치 권한 허용

### 3. CORS 오류
```
Error: CORS policy 문제
```
→ API 키 유효성 및 도메인 설정 확인

### 4. 빌드 오류
```
Error: Type errors found
```
→ `npm run type-check` 실행하여 타입 오류 확인

## 🔒 보안 고려사항

- API 키는 환경 변수로 관리
- HTTPS 사용 권장
- 사용자 입력값 검증 및 살균
- XSS, CSRF 방지 헤더 설정

## 📈 성능 최적화

- 이미지 최적화 (Next.js Image 컴포넌트)
- 코드 스플리팅 (동적 import)
- 메모이제이션 (React.memo, useCallback)
- 서비스 워커 캐싱

## 🤝 기여하기

1. 저장소 Fork
2. 기능 브랜치 생성 (`git checkout -b feature/amazing-feature`)
3. 변경사항 커밋 (`git commit -m 'Add amazing feature'`)
4. 브랜치에 Push (`git push origin feature/amazing-feature`)
5. Pull Request 생성

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 📞 지원 및 문의

- 이슈: [GitHub Issues](https://github.com/yourusername/weather-dashboard-pro/issues)
- 문의: your.email@example.com

## 🎉 다음 단계

프로젝트가 완성되면 다음과 같은 기능들을 추가해볼 수 있습니다:

- [ ] 다국어 지원 (i18n)
- [ ] 다크 모드
- [ ] 알림 기능 (날씨 경보)
- [ ] 위젯 모드
- [ ] 소셜 공유 기능
- [ ] 날씨 히스토리
- [ ] 사용자 프로필
- [ ] 테마 커스터마이징

---

**Happy Coding! 🌤️**