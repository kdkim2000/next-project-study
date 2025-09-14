# Analytics Dashboard Pro
## React + Next.js 완전 학습 가이드 📚

> **본 프로젝트는 React와 Next.js를 처음 접하는 개발자들을 위한 교육용 프로젝트입니다.**  
> 기초 개념부터 고급 패턴까지 단계별로 학습할 수 있도록 설계되었습니다.

---

## 📖 목차 (Table of Contents)

1. [프로젝트 소개](#-프로젝트-소개)
2. [React 기초 이론](#-react-기초-이론)
3. [Next.js 핵심 개념](#-nextjs-핵심-개념)
4. [프로젝트 구조 이해](#-프로젝트-구조-이해)
5. [컴포넌트 기반 아키텍처](#-컴포넌트-기반-아키텍처)
6. [상태 관리 (State Management)](#-상태-관리-state-management)
7. [고급 라우팅 패턴](#-고급-라우팅-패턴)
8. [성능 최적화](#-성능-최적화)
9. [데이터 흐름](#-데이터-흐름)
10. [실습 과정](#-실습-과정)
11. [트러블슈팅](#-트러블슈팅)

---

## 🎯 프로젝트 소개

### 무엇을 만들었나요?
**Analytics Dashboard Pro**는 현대적인 웹 애플리케이션의 모든 핵심 기능을 담은 **엔터프라이즈급 대시보드**입니다.

### 프로젝트 특징
- 📊 **실시간 데이터 시각화**: 5가지 고급 차트 구현
- ⚡ **성능 모니터링**: Web Vitals 실시간 수집
- 📤 **데이터 내보내기**: Excel, PDF, CSV 지원
- 🎨 **현대적 UI/UX**: Material-UI + 반응형 디자인
- 🏗️ **고급 아키텍처**: Parallel Routes, Streaming SSR
- 🔒 **프로덕션 준비**: Docker, CI/CD 파이프라인

### 학습 목표
이 프로젝트를 통해 다음을 학습합니다:
1. **React의 핵심 개념** (컴포넌트, 상태, 생명주기)
2. **Next.js의 고급 기능** (App Router, SSR, 라우팅)
3. **TypeScript 활용법** (타입 안정성, 개발 생산성)
4. **현대적 웹 개발 패턴** (성능 최적화, 아키텍처 설계)

---

## 🧠 React 기초 이론

### 1. React란 무엇인가?

**React**는 Facebook(Meta)에서 개발한 **사용자 인터페이스(UI)를 구축하기 위한 JavaScript 라이브러리**입니다.

#### 🌳 React의 핵심 철학: "컴포넌트 기반"
```
전통적인 웹 개발        React 개발
┌─────────────────┐    ┌─────────────────┐
│    HTML 파일     │    │   컴포넌트 1    │
│   + CSS 파일     │ → │   컴포넌트 2    │
│   + JS 파일      │    │   컴포넌트 3    │
└─────────────────┘    └─────────────────┘
```

### 2. 컴포넌트 (Component)

**컴포넌트**는 React의 가장 기본적인 구성 요소입니다. **"재사용 가능한 UI 조각"**이라고 생각하세요.

#### 본 프로젝트의 컴포넌트 예시:
```typescript
// src/components/dashboard/MetricCard.tsx
export default function MetricCard({ data }: MetricCardProps) {
  return (
    <Card className="fade-in" sx={{ height: 120 }}>
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {data.title}
        </Typography>
        <Typography variant="h5" fontWeight="bold">
          {formatNumber(data.value)}
        </Typography>
      </CardContent>
    </Card>
  );
}
```

**이해하기:**
- `MetricCard`는 **함수형 컴포넌트**입니다
- `{ data }`는 **props**(부모에서 전달받은 데이터)입니다
- `return` 안의 JSX가 **실제로 화면에 렌더링**됩니다

### 3. JSX (JavaScript XML)

**JSX**는 JavaScript 안에서 HTML과 같은 문법을 사용할 수 있게 해주는 확장 문법입니다.

#### JSX 변환 과정:
```typescript
// 개발자가 작성하는 JSX
<Typography variant="h5">
  {data.title}
</Typography>

// 실제로 변환되는 JavaScript
React.createElement(
  Typography,
  { variant: "h5" },
  data.title
)
```

### 4. Props (속성)

**Props**는 컴포넌트 간에 데이터를 전달하는 방법입니다. **"함수의 매개변수"**와 같은 역할입니다.

#### 본 프로젝트 예시:
```typescript
// 부모 컴포넌트: src/components/dashboard/Dashboard.tsx
{metricsData.map((metric, index) => (
  <MetricCard data={metric} key={index} />  // data prop으로 전달
))}

// 자식 컴포넌트: src/components/dashboard/MetricCard.tsx
interface MetricCardProps {
  data: MetricData;  // TypeScript로 props 타입 정의
}

export default function MetricCard({ data }: MetricCardProps) {
  // data.title, data.value 등으로 사용
}
```

### 5. State (상태)

**State**는 컴포넌트의 **"기억 저장소"**입니다. 시간에 따라 변할 수 있는 데이터를 저장합니다.

#### 본 프로젝트의 State 예시:
```typescript
// src/hooks/usePerformance.ts
export function usePerformance(): PerformanceData {
  const [metrics, setMetrics] = useState<Record<string, WebVitalMetric>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 성능 데이터가 업데이트될 때마다 state 변경
    const unsubscribe = performanceStore.subscribe((newMetric) => {
      setMetrics(prev => ({
        ...prev,
        [newMetric.name]: newMetric  // 새로운 메트릭 추가
      }));
      setIsLoading(false);  // 로딩 완료
    });
  }, []);
}
```

**이해하기:**
- `useState`: 상태를 선언하는 Hook
- `setMetrics`: 상태를 업데이트하는 함수
- 상태가 변경되면 **컴포넌트가 자동으로 다시 렌더링**됩니다

### 6. useEffect (생명주기)

**useEffect**는 컴포넌트의 **"생명주기"**를 관리합니다. 특정 시점에 작업을 실행할 수 있습니다.

#### 본 프로젝트 예시:
```typescript
// src/components/advanced-charts/RealTimeChart.tsx
useEffect(() => {
  if (!isRealTime) return;

  const interval = setInterval(() => {
    const newData = generateRealTimeData();
    setData(newData);  // 2초마다 데이터 업데이트
  }, 2000);

  return () => clearInterval(interval);  // 컴포넌트 언마운트 시 정리
}, [isRealTime]);  // isRealTime이 변경될 때만 실행
```

**생명주기 단계:**
1. **마운트**: 컴포넌트가 처음 화면에 나타날 때
2. **업데이트**: props나 state가 변경될 때
3. **언마운트**: 컴포넌트가 화면에서 사라질 때

---

## 🚀 Next.js 핵심 개념

### 1. Next.js란 무엇인가?

**Next.js**는 React를 기반으로 한 **프로덕션 준비 완료 프레임워크**입니다. React만으로는 복잡한 **"설정 지옥"**에 빠지기 쉬운데, Next.js가 이를 해결해줍니다.

#### React vs Next.js
```
React (라이브러리)          Next.js (프레임워크)
┌─────────────────┐       ┌─────────────────────┐
│   UI 컴포넌트    │       │   UI 컴포넌트        │
└─────────────────┘       │   + 라우팅          │
                          │   + SSR/SSG         │
                          │   + 빌드 최적화      │
                          │   + 개발 도구        │
                          └─────────────────────┘
```

### 2. App Router (Next.js 13+)

**App Router**는 Next.js 13에서 도입된 **새로운 라우팅 시스템**입니다. 폴더 구조가 곧 URL 구조가 됩니다.

#### 본 프로젝트의 라우팅 구조:
```
src/app/
├── page.tsx                    → / (홈페이지)
├── loading.tsx                 → 모든 페이지의 로딩 UI
├── error.tsx                   → 모든 페이지의 에러 UI
├── (dashboard)/                → Route Group (URL에 영향 없음)
│   ├── analytics/page.tsx      → /analytics
│   ├── reports/page.tsx        → /reports
│   └── settings/page.tsx       → /settings
├── @modal/                     → Parallel Route (모달)
│   ├── default.tsx             → 기본 상태 (모달 없음)
│   └── (.)chart/[id]/page.tsx  → Intercepting Route
└── chart/[id]/page.tsx         → /chart/advanced-line 등
```

**특징:**
- 📁 **폴더 = 경로**: `analytics/page.tsx` → `/analytics` URL
- 🎯 **파일 기반 라우팅**: 파일을 만들면 자동으로 라우트 생성
- 🔗 **중첩 라우팅**: 폴더 안에 폴더로 계층 구조 생성

### 3. Server Components vs Client Components

**Next.js 13+의 가장 중요한 개념** 중 하나입니다.

#### 서버 컴포넌트 (기본값)
```typescript
// src/app/chart/[id]/page.tsx - 서버에서 실행
export default async function ChartPage({ params }: ChartPageProps) {
  // 이 코드는 서버에서만 실행됩니다
  await new Promise(resolve => setTimeout(resolve, 1000)); // 지연 시뮬레이션
  const chartData = generateAdvancedChartData(params.id);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* HTML이 서버에서 미리 생성되어 전송됩니다 */}
    </Container>
  );
}
```

#### 클라이언트 컴포넌트 ('use client' 필요)
```typescript
// src/components/advanced-charts/RealTimeChart.tsx - 브라우저에서 실행
'use client';  // 이 지시어가 핵심!

export default function RealTimeChart({ data: initialData }: RealTimeChartProps) {
  const [data, setData] = useState<RealTimeData[]>(initialData);
  const [isRealTime, setIsRealTime] = useState(false);

  // 이 코드는 브라우저에서만 실행됩니다
  // 버튼 클릭, 상태 변경 등 인터랙션 처리
}
```

**구분 기준:**
- **서버 컴포넌트**: 데이터 가져오기, SEO, 초기 로딩 속도
- **클라이언트 컴포넌트**: 상호작용, 이벤트 처리, 실시간 업데이트

### 4. 동적 라우팅 (Dynamic Routes)

**대괄호 `[]`**를 사용해서 동적 경로를 만들 수 있습니다.

#### 본 프로젝트 예시:
```typescript
// src/app/chart/[id]/page.tsx
interface ChartPageProps {
  params: {
    id: string;  // URL의 [id] 부분이 여기로 전달됩니다
  };
}

export default async function ChartPage({ params }: ChartPageProps) {
  // /chart/advanced-line → params.id = "advanced-line"
  // /chart/heatmap → params.id = "heatmap"
  
  const ChartComponent = chartComponents[params.id];
  // ...
}
```

### 5. Parallel Routes (병렬 라우팅)

**동시에 여러 컴포넌트**를 렌더링할 수 있는 고급 기능입니다.

#### 본 프로젝트 구현:
```typescript
// src/app/layout.tsx
export default function RootLayout({
  children,   // 기본 페이지 내용
  modal,      // @modal 슬롯
  sidebar,    // @sidebar 슬롯
}: {
  children: React.ReactNode;
  modal?: React.ReactNode;
  sidebar?: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {sidebar}       {/* 사이드바 동시 렌더링 */}
      <main className="flex-1">
        {children}    {/* 메인 콘텐츠 */}
      </main>
      {modal}         {/* 모달 동시 렌더링 */}
    </div>
  );
}
```

### 6. Intercepting Routes (인터셉팅 라우팅)

**링크 클릭을 "가로채서"** 다른 UI로 표시하는 기능입니다.

#### 본 프로젝트 예시:
```typescript
// src/app/@modal/(.)chart/[id]/page.tsx
// (.) 표기법: 같은 레벨의 chart/[id] 경로를 인터셉트

export default function ChartModal({ params }: ChartModalProps) {
  // /chart/advanced-line 링크를 클릭하면
  // 새 페이지로 이동하지 않고 모달로 표시됩니다!
  
  return (
    <Dialog open={true} onClose={() => router.back()}>
      <DialogContent>
        {/* 차트 내용을 모달로 표시 */}
      </DialogContent>
    </Dialog>
  );
}
```

---

## 📁 프로젝트 구조 이해

### 전체 구조 살펴보기
```
analytics-dashboard/
├── 📂 src/                     # 소스 코드
│   ├── 📂 app/                 # Next.js App Router
│   │   ├── 📄 layout.tsx       # 전역 레이아웃
│   │   ├── 📄 page.tsx         # 홈페이지
│   │   ├── 📂 (dashboard)/     # Route Group
│   │   ├── 📂 @modal/          # Parallel Route
│   │   └── 📂 chart/[id]/      # 동적 라우팅
│   ├── 📂 components/          # 재사용 컴포넌트
│   │   ├── 📂 dashboard/       # 대시보드 전용
│   │   ├── 📂 advanced-charts/ # 고급 차트들
│   │   └── 📂 layout/          # 레이아웃 전용
│   ├── 📂 data/               # 데이터 관련
│   ├── 📂 hooks/              # 커스텀 훅
│   ├── 📂 lib/                # 유틸리티 라이브러리
│   └── 📂 utils/              # 헬퍼 함수
├── 📄 package.json            # 의존성 관리
├── 📄 tsconfig.json           # TypeScript 설정
└── 📄 next.config.mjs         # Next.js 설정
```

### 구조 설계 원칙

#### 1. 관심사의 분리 (Separation of Concerns)
```
📂 components/     → UI 컴포넌트만
📂 data/          → 데이터 처리만
📂 hooks/         → 상태 로직만
📂 lib/           → 비즈니스 로직만
📂 utils/         → 순수 함수만
```

#### 2. 재사용성 (Reusability)
```typescript
// ❌ 나쁜 예: 하드코딩된 컴포넌트
function SalesCard() {
  return <Card>매출: 1,000,000원</Card>;
}

// ✅ 좋은 예: 재사용 가능한 컴포넌트
function MetricCard({ title, value, unit }: MetricCardProps) {
  return (
    <Card>
      {title}: {formatNumber(value)}{unit}
    </Card>
  );
}
```

#### 3. 확장성 (Scalability)
```typescript
// src/components/dashboard/Dashboard.tsx
const advancedCharts = [
  { id: 'advanced-line', name: '고급 라인 차트' },
  { id: 'heatmap', name: '히트맵' },
  // 새로운 차트 추가 시 여기에 추가하면 자동으로 UI 생성
];
```

---

## 🏗️ 컴포넌트 기반 아키텍처

### 1. 컴포넌트 계층 구조

본 프로젝트의 컴포넌트는 **트리 구조**로 구성되어 있습니다.

```
App (root)
├── ThemeProvider
│   ├── WebVitalsReporter
│   ├── Sidebar
│   ├── Dashboard (main)
│   │   ├── MetricCard (4개)
│   │   ├── PerformanceMonitor
│   │   │   └── Individual Metric Cards (여러개)
│   │   ├── SimpleChart (3개)
│   │   └── Advanced Chart Links (5개)
│   └── Modal (조건부)
│       └── ChartModal
│           └── AdvancedChart
```

### 2. Props 데이터 흐름

**"단방향 데이터 흐름"**은 React의 핵심 원칙입니다.

#### 실제 데이터 흐름:
```typescript
// 1. 데이터 소스 (최상위)
// src/data/sampleData.ts
export const metricsData: MetricData[] = [
  { title: '총 매출', value: 2547893, change: 12.5, /* ... */ }
];

// 2. 부모 컴포넌트 (중간)
// src/components/dashboard/Dashboard.tsx
export default function Dashboard() {
  return (
    <Grid container spacing={3}>
      {metricsData.map((metric, index) => (
        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
          <MetricCard data={metric} />  {/* Props로 전달 */}
        </Grid>
      ))}
    </Grid>
  );
}

// 3. 자식 컴포넌트 (최하위)
// src/components/dashboard/MetricCard.tsx
export default function MetricCard({ data }: MetricCardProps) {
  return (
    <Card>
      <Typography>{data.title}</Typography>         {/* 데이터 사용 */}
      <Typography>{formatNumber(data.value)}</Typography>
      <Typography>{formatChange(data.change)}%</Typography>
    </Card>
  );
}
```

**데이터 흐름 방향:**
```
sampleData → Dashboard → MetricCard
   (원본)      (전달)      (표시)
```

### 3. 컴포넌트 타입

#### A. Presentation Component (표현 컴포넌트)
**"어떻게 보일지만"** 관심 있는 컴포넌트입니다.

```typescript
// src/components/ui/LoadingSpinner.tsx
export default function LoadingSpinner({ size = 40, message }: LoadingSpinnerProps) {
  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <CircularProgress size={size} />
      {message && <Typography>{message}</Typography>}
    </Box>
  );
}
```

#### B. Container Component (컨테이너 컴포넌트)
**"어떻게 동작할지"** 관심 있는 컴포넌트입니다.

```typescript
// src/hooks/usePerformance.ts
export function usePerformance(): PerformanceData {
  const [metrics, setMetrics] = useState<Record<string, WebVitalMetric>>({});
  
  useEffect(() => {
    // 복잡한 비즈니스 로직
    const unsubscribe = performanceStore.subscribe((newMetric) => {
      setMetrics(prev => ({ ...prev, [newMetric.name]: newMetric }));
    });
    return unsubscribe;
  }, []);

  return { metrics, /* ... */ };
}
```

### 4. 컴포넌트 설계 패턴

#### A. Compound Component (복합 컴포넌트)
```typescript
// src/components/dashboard/ExportButtons.tsx
export default function ExportButtons() {
  return (
    <Box>
      <Button onClick={handleClick}>데이터 내보내기</Button>
      <Menu anchorEl={anchorEl} open={open}>
        <MenuItem onClick={handleExcelExport}>Excel</MenuItem>
        <MenuItem onClick={handlePDFExport}>PDF</MenuItem>
        <MenuItem onClick={handleCSVExport}>CSV</MenuItem>
      </Menu>
    </Box>
  );
}
```

#### B. Higher-Order Component (고차 컴포넌트)
```typescript
// src/components/streaming/SuspenseWrapper.tsx
export default function SuspenseWrapper({ children, fallback, title }: SuspenseWrapperProps) {
  return (
    <Suspense fallback={fallback || <DefaultFallback title={title} />}>
      {children}
    </Suspense>
  );
}
```

---

## 💾 상태 관리 (State Management)

### 1. 상태(State)의 종류

#### A. 지역 상태 (Local State)
**한 컴포넌트 안에서만** 사용되는 상태입니다.

```typescript
// src/components/advanced-charts/RealTimeChart.tsx
export default function RealTimeChart({ data: initialData }: RealTimeChartProps) {
  const [data, setData] = useState<RealTimeData[]>(initialData);
  const [isRealTime, setIsRealTime] = useState(false);  // 지역 상태

  // 이 상태는 RealTimeChart 컴포넌트에서만 사용됩니다
}
```

#### B. 전역 상태 (Global State)
**여러 컴포넌트에서 공유**되는 상태입니다.

```typescript
// src/lib/web-vitals.ts
class PerformanceStore {
  private metrics: WebVitalMetric[] = [];  // 전역 상태
  private listeners: ((metric: WebVitalMetric) => void)[] = [];

  addMetric(metric: WebVitalMetric) {
    this.metrics.push(metric);
    // 모든 구독자에게 알림
    this.listeners.forEach(listener => listener(metric));
  }
}

export const performanceStore = new PerformanceStore();  // 싱글톤
```

#### C. 서버 상태 (Server State)
**서버에서 가져오는** 데이터 상태입니다.

```typescript
// src/app/chart/[id]/page.tsx
export default async function ChartPage({ params }: ChartPageProps) {
  // 서버에서 실행되는 데이터 페칭
  await new Promise(resolve => setTimeout(resolve, 1000));  // API 호출 시뮬레이션
  const chartData = generateAdvancedChartData(params.id);   // 서버 상태
  
  return <ChartComponent data={chartData} />;
}
```

### 2. 커스텀 훅 (Custom Hook)

**커스텀 훅**은 상태 로직을 재사용 가능하게 만드는 패턴입니다.

```typescript
// src/hooks/usePerformance.ts
export function usePerformance(): PerformanceData {
  const [metrics, setMetrics] = useState<Record<string, WebVitalMetric>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 복잡한 상태 로직을 훅으로 캡슐화
    const initialMetrics = performanceStore.getLatestMetrics();
    setMetrics(initialMetrics);
    
    const unsubscribe = performanceStore.subscribe((newMetric) => {
      setMetrics(prev => ({
        ...prev,
        [newMetric.name]: newMetric
      }));
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  // 계산된 값도 제공
  const summary = {
    total: Object.keys(metrics).length,
    good: Object.values(metrics).filter(m => m.rating === 'good').length,
    // ...
  };

  return { metrics, summary, isLoading };
}
```

**사용법:**
```typescript
// src/components/dashboard/PerformanceMonitor.tsx
export default function PerformanceMonitor() {
  const { metrics, summary, isLoading } = usePerformance();  // 훅 사용

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Card>
      <Typography>성능 점수: {summary.score}</Typography>
      {/* metrics 데이터 표시 */}
    </Card>
  );
}
```

### 3. 상태 업데이트 패턴

#### A. 불변성 (Immutability)
React에서는 **상태를 직접 변경하면 안 됩니다**. 새로운 객체를 만들어야 합니다.

```typescript
// ❌ 잘못된 방법: 직접 변경
const addMetric = (newMetric) => {
  metrics.push(newMetric);     // 기존 배열 변경
  setMetrics(metrics);         // React가 변화를 감지하지 못함
};

// ✅ 올바른 방법: 새로운 객체 생성
const addMetric = (newMetric) => {
  setMetrics(prev => [...prev, newMetric]);  // 새 배열 생성
};

// ✅ 객체의 경우
setMetrics(prev => ({
  ...prev,                     // 기존 속성 복사
  [newMetric.name]: newMetric  // 새 속성 추가/변경
}));
```

#### B. 비동기 상태 업데이트
```typescript
// src/components/dashboard/ExportButtons.tsx
const handleExcelExport = async () => {
  setLoading(true);            // 로딩 시작
  
  try {
    const filename = await exportToExcel(data);
    showNotification(`Excel 파일 다운로드 완료: ${filename}`, 'success');
  } catch (error) {
    showNotification('Excel 파일 내보내기에 실패했습니다.', 'error');
  } finally {
    setLoading(false);         // 로딩 종료
  }
};
```

---

## 🛣️ 고급 라우팅 패턴

### 1. App Router 심화

#### A. 파일 기반 라우팅의 원리
```
파일 경로                    →  URL 경로
src/app/page.tsx            →  /
src/app/analytics/page.tsx  →  /analytics
src/app/chart/[id]/page.tsx →  /chart/advanced-line
```

#### B. 특수 파일들의 역할
```typescript
// src/app/loading.tsx - 전역 로딩 UI
export default function Loading() {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
      <CircularProgress />
    </Box>
  );
}

// src/app/error.tsx - 전역 에러 UI
export default function ErrorPage({ error, reset }: ErrorPageProps) {
  return (
    <Paper>
      <Typography variant="h4">오류가 발생했습니다</Typography>
      <Button onClick={reset}>다시 시도</Button>
    </Paper>
  );
}

// src/app/not-found.tsx - 404 페이지
export default function NotFound() {
  return <Typography variant="h3">404 - 페이지를 찾을 수 없습니다</Typography>;
}
```

### 2. Route Groups

**Route Groups**는 **URL에 영향을 주지 않고** 파일을 조직화하는 방법입니다.

```typescript
// 폴더 구조:
src/app/(dashboard)/analytics/page.tsx    → /analytics (괄호는 URL에 나타나지 않음)
src/app/(dashboard)/reports/page.tsx      → /reports
src/app/(dashboard)/settings/page.tsx     → /settings

// src/app/(dashboard)/layout.tsx - 공통 레이아웃
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box>
      <Header />              {/* 모든 대시보드 페이지에 공통 헤더 */}
      <Box>{children}</Box>   {/* 각 페이지의 고유 내용 */}
    </Box>
  );
}
```

**사용 이유:**
- 관련된 페이지들을 그룹화
- 공통 레이아웃 적용
- URL 구조는 단순하게 유지

### 3. Parallel Routes (병렬 라우팅)

**동시에 여러 컴포넌트**를 독립적으로 렌더링하는 고급 기능입니다.

#### 구현 구조:
```
src/app/
├── layout.tsx              # 메인 레이아웃
├── page.tsx                # 메인 콘텐츠
├── @modal/                 # 모달 슬롯
│   ├── default.tsx         # 기본 상태 (모달 없음)
│   └── (.)chart/[id]/page.tsx  # 모달 콘텐츠
└── @sidebar/               # 사이드바 슬롯
    ├── default.tsx         # 기본 사이드바
    └── analytics/page.tsx  # 분석 페이지용 사이드바
```

#### 실제 구현:
```typescript
// src/app/layout.tsx
export default function RootLayout({
  children,    // 기본 페이지 내용
  modal,       // @modal 슬롯의 내용
  sidebar,     // @sidebar 슬롯의 내용
}: {
  children: React.ReactNode;
  modal?: React.ReactNode;
  sidebar?: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {sidebar}        {/* 독립적인 사이드바 렌더링 */}
      <main className="flex-1">
        {children}     {/* 메인 콘텐츠 */}
      </main>
      {modal}          {/* 독립적인 모달 렌더링 */}
    </div>
  );
}
```

**장점:**
- 각 슬롯이 **독립적으로 로딩**됩니다
- **URL이 변경되어도** 다른 슬롯은 유지됩니다
- **복잡한 UI**를 간단하게 구성할 수 있습니다

### 4. Intercepting Routes (인터셉팅 라우팅)

**링크 클릭을 "가로채서"** 다른 UI로 표시하는 기능입니다.

#### 표기법 이해:
```
(.)  - 같은 레벨
(..) - 상위 레벨
(...)- 루트에서부터
```

#### 실제 예시:
```typescript
// 파일 위치: src/app/@modal/(.)chart/[id]/page.tsx
// 의미: 같은 레벨의 chart/[id] 경로를 인터셉트

export default function ChartModal({ params }: ChartModalProps) {
  const router = useRouter();
  
  return (
    <Dialog open={true} onClose={() => router.back()}>
      <DialogTitle>차트 모달</DialogTitle>
      <DialogContent>
        {/* /chart/advanced-line 링크 클릭 시
            새 페이지가 아닌 모달로 표시됩니다! */}
        <AdvancedLineChart data={chartData} />
      </DialogContent>
    </Dialog>
  );
}
```

#### 동작 원리:
```
사용자 액션: /chart/advanced-line 링크 클릭
     ↓
Intercepting Route가 감지
     ↓
모달로 표시 (@modal 슬롯 활용)
     ↓
URL은 /chart/advanced-line로 변경되지만
실제로는 모달이 표시됨
```

### 5. 동적 라우팅 심화

#### A. Catch-all Routes
```typescript
// src/app/chart/[...params]/page.tsx  → [...params]는 모든 하위 경로를 잡음
// /chart/a → params = ['a']
// /chart/a/b → params = ['a', 'b']
// /chart/a/b/c → params = ['a', 'b', 'c']
```

#### B. 선택적 Catch-all Routes
```typescript
// src/app/chart/[[...params]]/page.tsx  → [[...params]]는 빈 경로도 포함
// /chart → params = []
// /chart/a → params = ['a']
```

---

## ⚡ 성능 최적화

### 1. 렌더링 최적화

#### A. React.memo (메모이제이션)
**props가 변경되지 않으면** 컴포넌트를 다시 렌더링하지 않습니다.

```typescript
// src/components/dashboard/MetricCard.tsx
import React from 'react';

const MetricCard = React.memo(function MetricCard({ data }: MetricCardProps) {
  console.log('MetricCard 렌더링:', data.title);  // 디버깅용
  
  return (
    <Card>
      <Typography>{data.title}</Typography>
      <Typography>{formatNumber(data.value)}</Typography>
    </Card>
  );
});

export default MetricCard;
```

#### B. useMemo (값 메모이제이션)
**계산 비용이 높은 값**을 메모이제이션합니다.

```typescript
// src/hooks/usePerformance.ts
export function usePerformance(): PerformanceData {
  const [metrics, setMetrics] = useState<Record<string, WebVitalMetric>>({});

  // 성능 점수 계산은 비용이 높으므로 메모이제이션
  const summary = useMemo(() => {
    const values = Object.values(metrics);
    if (values.length === 0) return { score: 0, total: 0, good: 0 };

    const scores = values.map(metric => {
      switch (metric.rating) {
        case 'good': return 100;
        case 'needs-improvement': return 70;
        case 'poor': return 30;
        default: return 0;
      }
    });

    return {
      total: values.length,
      good: values.filter(m => m.rating === 'good').length,
      score: Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length)
    };
  }, [metrics]);  // metrics가 변경될 때만 재계산

  return { metrics, summary, isLoading };
}
```

#### C. useCallback (함수 메모이제이션)
**함수를 메모이제이션**해서 불필요한 자식 컴포넌트 렌더링을 방지합니다.

```typescript
// src/components/dashboard/Dashboard.tsx
export default function Dashboard() {
  const [selectedMetric, setSelectedMetric] = useState<string>('');

  // 함수를 메모이제이션해서 MetricCard가 불필요하게 렌더링되지 않도록
  const handleMetricClick = useCallback((metricId: string) => {
    setSelectedMetric(metricId);
    // 복잡한 로직...
  }, []);  // 의존성 배열이 비어있으므로 함수는 한 번만 생성됨

  return (
    <Grid container spacing={3}>
      {metricsData.map((metric, index) => (
        <MetricCard 
          key={metric.id}
          data={metric}
          onClick={handleMetricClick}  // 메모이제이션된 함수 전달
        />
      ))}
    </Grid>
  );
}
```

### 2. 코드 분할 (Code Splitting)

#### A. 동적 Import
```typescript
// src/components/charts/ChartContainer.tsx
import dynamic from 'next/dynamic';

// 차트 컴포넌트들을 동적으로 로드 (지연 로딩)
const LineChart = dynamic(() => import('./LineChart'), {
  loading: () => <LoadingSpinner message="차트를 불러오는 중..." />,
  ssr: false,  // 서버 사이드 렌더링 비활성화
});

const BarChart = dynamic(() => import('./BarChart'), {
  loading: () => <LoadingSpinner message="차트를 불러오는 중..." />,
  ssr: false,
});
```

#### B. Suspense와 조합
```typescript
// src/components/streaming/SuspenseWrapper.tsx
export default function SuspenseWrapper({ children, title }: SuspenseWrapperProps) {
  return (
    <Suspense fallback={
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <LinearProgress />
        <Typography variant="h6">{title || '콘텐츠 로딩 중...'}</Typography>
      </Box>
    }>
      {children}
    </Suspense>
  );
}
```

### 3. Web Vitals 모니터링

**실제 사용자 경험**을 측정하는 핵심 지표들입니다.

```typescript
// src/lib/web-vitals.ts
import { onCLS, onINP, onFCP, onLCP, onTTFB } from 'web-vitals';

export function startWebVitalsCollection() {
  const handleMetric = (metric: any) => {
    const webVitalMetric: WebVitalMetric = {
      name: metric.name,
      value: Math.round(metric.value),
      rating: getRating(metric.name, metric.value),  // good/needs-improvement/poor
      delta: Math.round(metric.delta),
      id: metric.id,
      timestamp: Date.now()
    };
    
    performanceStore.addMetric(webVitalMetric);

    // 개발 환경에서 콘솔에 출력
    if (process.env.NODE_ENV === 'development') {
      console.log(`🚀 Web Vital: ${metric.name}`, {
        value: `${metric.value}ms`,
        rating: metric.rating,
      });
    }
  };

  // 각 Web Vital 수집
  onCLS(handleMetric);   // 시각적 안정성
  onINP(handleMetric);   // 상호작용 응답성
  onFCP(handleMetric);   // 첫 콘텐츠 표시
  onLCP(handleMetric);   // 최대 콘텐츠 표시
  onTTFB(handleMetric);  // 첫 바이트 시간
}
```

**핵심 지표 설명:**
- **LCP (Largest Contentful Paint)**: 가장 큰 콘텐츠가 표시되는 시간
- **INP (Interaction to Next Paint)**: 사용자 입력에 대한 응답 시간
- **CLS (Cumulative Layout Shift)**: 예기치 않은 레이아웃 이동

### 4. 이미지 최적화

```typescript
// next.config.mjs
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],  // 최신 이미지 포맷 사용
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],  // 반응형 이미지
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
};
```

---

## 🔄 데이터 흐름

### 1. 단방향 데이터 흐름

React의 기본 원칙인 **"단방향 데이터 흐름"**을 본 프로젝트로 이해해봅시다.

```
📊 Data Source (sampleData.ts)
    ↓ import
🏠 Parent Component (Dashboard.tsx)
    ↓ props
📋 Child Component (MetricCard.tsx)
    ↓ user interaction
🎯 Event Handler (onClick)
    ↓ setState
🔄 Re-render (새로운 데이터로 UI 업데이트)
```

#### 실제 코드 흐름:
```typescript
// 1. 데이터 소스
// src/data/sampleData.ts
export const metricsData: MetricData[] = [
  { title: '총 매출', value: 2547893, change: 12.5, /* ... */ }
];

// 2. 부모 컴포넌트에서 데이터 사용
// src/components/dashboard/Dashboard.tsx
import { metricsData } from '@/data/sampleData';

export default function Dashboard() {
  return (
    <>
      {metricsData.map((metric, index) => (
        <MetricCard 
          key={index}
          data={metric}           // ← 데이터를 props로 전달
          onMetricClick={handleClick}  // ← 이벤트 핸들러도 전달
        />
      ))}
    </>
  );
}

// 3. 자식 컴포넌트에서 데이터 사용 및 이벤트 발생
// src/components/dashboard/MetricCard.tsx
export default function MetricCard({ data, onMetricClick }: MetricCardProps) {
  return (
    <Card 
      onClick={() => onMetricClick(data.id)}  // ← 클릭 시 부모에게 알림
    >
      <Typography>{data.title}</Typography>   {/* ← 전달받은 데이터 표시 */}
      <Typography>{data.value}</Typography>
    </Card>
  );
}
```

### 2. 상태 끌어올리기 (Lifting State Up)

**여러 컴포넌트에서 같은 상태를 사용**해야 할 때는 **공통 부모로 상태를 끌어올립니다**.

```typescript
// src/hooks/usePerformance.ts - 성능 데이터를 전역으로 관리
export function usePerformance(): PerformanceData {
  const [metrics, setMetrics] = useState<Record<string, WebVitalMetric>>({});

  useEffect(() => {
    // 전역 성능 저장소 구독
    const unsubscribe = performanceStore.subscribe((newMetric) => {
      setMetrics(prev => ({
        ...prev,
        [newMetric.name]: newMetric  // 새 메트릭 추가
      }));
    });
    return unsubscribe;
  }, []);

  return { metrics, /* ... */ };
}
```

**사용하는 컴포넌트들:**
```typescript
// src/components/dashboard/PerformanceMonitor.tsx
export default function PerformanceMonitor() {
  const { metrics, summary } = usePerformance();  // 동일한 데이터 사용
  
  return (
    <Card>
      <Typography>성능 점수: {summary.score}</Typography>
      {/* 성능 데이터 표시 */}
    </Card>
  );
}

// src/components/layout/Header.tsx (만약 있다면)
export default function Header() {
  const { summary } = usePerformance();  // 동일한 데이터 사용
  
  return (
    <AppBar>
      <Badge badgeContent={summary.poor > 0 ? '!' : null}>
        <NotificationIcon />
      </Badge>
    </AppBar>
  );
}
```

### 3. 이벤트 핸들링

#### A. 기본 이벤트 처리
```typescript
// src/components/advanced-charts/RealTimeChart.tsx
export default function RealTimeChart() {
  const [isRealTime, setIsRealTime] = useState(false);

  const handleToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsRealTime(event.target.checked);  // 체크박스 상태에 따라 실시간 업데이트 토글
  };

  return (
    <FormControlLabel
      control={
        <Switch
          checked={isRealTime}
          onChange={handleToggle}  // 이벤트 핸들러 연결
        />
      }
      label="실시간 업데이트"
    />
  );
}
```

#### B. 비동기 이벤트 처리
```typescript
// src/components/dashboard/ExportButtons.tsx
export default function ExportButtons() {
  const [loading, setLoading] = useState(false);

  const handleExcelExport = async () => {
    setLoading(true);  // 로딩 시작

    try {
      const filename = await exportToExcel({  // 비동기 작업
        metrics: metricsData,
        chartData,
        pieData
      });
      
      // 성공 알림
      showNotification(`Excel 파일 다운로드 완료: ${filename}`, 'success');
    } catch (error) {
      // 에러 처리
      showNotification('Excel 파일 내보내기에 실패했습니다.', 'error');
    } finally {
      setLoading(false);  // 로딩 종료
    }
  };

  return (
    <Button
      onClick={handleExcelExport}
      disabled={loading}  // 로딩 중에는 비활성화
      startIcon={loading ? <CircularProgress size={16} /> : <DownloadIcon />}
    >
      {loading ? '내보내는 중...' : 'Excel 내보내기'}
    </Button>
  );
}
```

### 4. 실시간 데이터 업데이트

```typescript
// src/components/advanced-charts/RealTimeChart.tsx
export default function RealTimeChart({ data: initialData }: RealTimeChartProps) {
  const [data, setData] = useState<RealTimeData[]>(initialData);
  const [isRealTime, setIsRealTime] = useState(false);

  useEffect(() => {
    if (!isRealTime) return;

    // 2초마다 실행되는 인터벌
    const interval = setInterval(() => {
      const newData = generateRealTimeData();  // 새 데이터 생성
      setData(newData);  // 상태 업데이트 → 자동으로 차트 리렌더링
    }, 2000);

    // 컴포넌트 언마운트 시 인터벌 정리
    return () => clearInterval(interval);
  }, [isRealTime]);  // isRealTime이 변경될 때마다 effect 실행

  // ...
}
```

---

## 🎓 실습 과정

### Phase 1: 기본 환경 설정 (30분)

#### 1단계: 프로젝트 생성
```bash
# Next.js 프로젝트 생성
npx create-next-app@latest analytics-dashboard --typescript --tailwind --eslint --app --src-dir
cd analytics-dashboard

# 필수 패키지 설치
npm install @mui/material @emotion/react @emotion/styled @mui/icons-material
npm install recharts web-vitals exceljs jspdf html2canvas
```

#### 2단계: 프로젝트 구조 이해
```
src/
├── app/           # Next.js App Router (라우팅)
├── components/    # 재사용 컴포넌트 (UI)
├── data/         # 데이터 관리
├── hooks/        # 커스텀 훅 (상태 로직)
├── lib/          # 비즈니스 로직
└── utils/        # 순수 함수
```

#### 3단계: 첫 컴포넌트 만들기
```typescript
// src/components/HelloWorld.tsx
export default function HelloWorld() {
  return (
    <div>
      <h1>안녕하세요, React + Next.js!</h1>
      <p>첫 번째 컴포넌트입니다.</p>
    </div>
  );
}
```

### Phase 2: 기본 컴포넌트 구현 (1시간)

#### 1단계: 데이터 정의하기
```typescript
// src/data/sampleData.ts
export interface MetricData {
  title: string;
  value: number;
  change: number;
  icon: string;
  color: string;
}

export const metricsData: MetricData[] = [
  { title: '총 매출', value: 1000000, change: 12.5, icon: 'money', color: 'blue' }
];
```

#### 2단계: 첫 번째 실용 컴포넌트
```typescript
// src/components/MetricCard.tsx
export default function MetricCard({ data }: { data: MetricData }) {
  return (
    <div style={{ 
      border: '1px solid #ddd', 
      padding: '16px', 
      borderRadius: '8px' 
    }}>
      <h3>{data.title}</h3>
      <p style={{ fontSize: '24px', fontWeight: 'bold' }}>
        {data.value.toLocaleString()}
      </p>
      <p style={{ color: data.change > 0 ? 'green' : 'red' }}>
        {data.change > 0 ? '+' : ''}{data.change}%
      </p>
    </div>
  );
}
```

#### 3단계: 컴포넌트 조합하기
```typescript
// src/components/Dashboard.tsx
import { metricsData } from '@/data/sampleData';
import MetricCard from './MetricCard';

export default function Dashboard() {
  return (
    <div>
      <h1>대시보드</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
        {metricsData.map((metric, index) => (
          <MetricCard key={index} data={metric} />
        ))}
      </div>
    </div>
  );
}
```

### Phase 3: 상태 관리 학습 (1시간)

#### 1단계: useState 체험
```typescript
// src/components/Counter.tsx
'use client';
import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);  // 상태 선언

  const increment = () => {
    setCount(count + 1);  // 상태 업데이트
  };

  return (
    <div>
      <p>카운트: {count}</p>
      <button onClick={increment}>증가</button>
    </div>
  );
}
```

#### 2단계: useEffect 체험
```typescript
// src/components/Timer.tsx
'use client';
import { useState, useEffect } from 'react';

export default function Timer() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(prev => prev + 1);  // 1초마다 증가
    }, 1000);

    return () => clearInterval(interval);  // 정리 함수
  }, []);

  return <p>경과 시간: {seconds}초</p>;
}
```

### Phase 4: 고급 기능 구현 (2시간)

#### 1단계: Material-UI 적용
```typescript
// src/components/dashboard/MetricCard.tsx
import { Card, CardContent, Typography, Box } from '@mui/material';

export default function MetricCard({ data }: MetricCardProps) {
  return (
    <Card sx={{ height: 140 }}>
      <CardContent>
        <Typography variant="subtitle2" color="text.secondary">
          {data.title}
        </Typography>
        <Typography variant="h4" component="div" fontWeight="bold">
          {data.value.toLocaleString()}
        </Typography>
        <Typography variant="body2" sx={{ 
          color: data.change > 0 ? 'success.main' : 'error.main' 
        }}>
          {data.change > 0 ? '+' : ''}{data.change}%
        </Typography>
      </CardContent>
    </Card>
  );
}
```

#### 2단계: 차트 구현
```typescript
// src/components/SimpleChart.tsx
'use client';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';

export default function SimpleChart({ data }: { data: any[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="value" stroke="#2196f3" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
}
```

### Phase 5: 실전 프로젝트 완성 (2시간)

본 저장소의 완성된 코드를 단계별로 구현하면서 다음을 학습합니다:
1. **복잡한 상태 관리** (usePerformance 훅)
2. **데이터 흐름** (props drilling vs context)
3. **성능 최적화** (memo, useMemo, useCallback)
4. **에러 처리** (try-catch, 에러 바운더리)
5. **TypeScript 활용** (인터페이스, 제네릭)

---

## 🔧 트러블슈팅

### 자주 발생하는 오류와 해결방법

#### 1. Hydration Mismatch 오류
```
Error: Hydration failed because the initial UI does not match 
what was rendered on the server.
```

**원인:** 서버에서 렌더링한 HTML과 클라이언트에서 렌더링한 HTML이 다름

**해결방법:**
```typescript
// ❌ 문제가 되는 코드
export default function Component() {
  return <div>{new Date().toISOString()}</div>;  // 서버와 클라이언트에서 다른 시간
}

// ✅ 해결된 코드
'use client';
import { useState, useEffect } from 'react';

export default function Component() {
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    setTime(new Date().toISOString());  // 클라이언트에서만 실행
  }, []);

  return <div>{time || '로딩 중...'}</div>;
}
```

#### 2. "Cannot read properties of undefined" 오류
```
TypeError: Cannot read properties of undefined (reading 'title')
```

**원인:** 데이터가 아직 로드되지 않았는데 접근하려 함

**해결방법:**
```typescript
// ❌ 문제가 되는 코드
export default function MetricCard({ data }: { data: MetricData }) {
  return <Typography>{data.title}</Typography>;  // data가 undefined일 수 있음
}

// ✅ 해결된 코드
export default function MetricCard({ data }: { data?: MetricData }) {
  if (!data) {
    return <Skeleton variant="rectangular" width={210} height={118} />;
  }

  return <Typography>{data.title}</Typography>;
}

// 또는 기본값 사용
export default function MetricCard({ data = {} as MetricData }: { data?: MetricData }) {
  return <Typography>{data.title || '제목 없음'}</Typography>;
}
```

#### 3. "Functions cannot be passed to Client Components" 오류
**원인:** 서버 컴포넌트에서 함수를 클라이언트