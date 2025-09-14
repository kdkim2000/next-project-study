# Analytics Dashboard Pro — 교육용 README

> **대상**: React/Next.js 경험이 거의 없는 분
> **목표**: 이 프로젝트를 통해 React/Next.js의 기본 개념을 익히고, **데이터 시각화**, **성능 모니터링(Web Vitals)**, **Excel/CSV/PDF 내보내기**를 실습합니다.
> ※ 아래 **학습 목표 중 실제 구현된 것만** 다룹니다:
>
> * 대규모 애플리케이션 **아키텍처 기초**(폴더 구조, 컴포넌트/훅/유틸 분리)
> * **성능 최적화**(Web Vitals 수집·리포트, UI 경고 해결, Grid v2)
> * **복잡한 데이터 시각화**(선/막대/파이 차트)
> * **Excel/CSV/PDF 내보내기**

---

## 0) 빠른 시작(Quick Start)

1. **설치**

   ```bash
   npm install
   # (필수 패키지 예시)
   npm install @mui/material @emotion/react @emotion/styled @mui/icons-material
   npm install recharts jspdf html2canvas exceljs
   ```

2. **실행**

   ```bash
   npm run dev
   # http://localhost:3000 접속
   ```

3. **폴더 개요**

   ```
   src/
     app/
       layout.tsx        # 페이지 공통 레이아웃(MUI 테마 적용)
       page.tsx          # 대시보드 첫 화면
       globals.css       # 전역 스타일
     components/
       Dashboard.tsx     # 메인 대시보드 화면
       MetricCard.tsx    # KPI 카드
       SimpleChart.tsx   # Line/Bar/Pie 차트
       PerformanceMonitor.tsx # Web Vitals 실시간 카드
       ExportButtons.tsx # Excel/CSV/PDF 내보내기 메뉴
       LoadingSpinner.tsx# 로딩 스피너
     data/
       sampleData.ts     # 화면에 표시할 샘플 데이터
     hooks/
       usePerformance.ts # Web Vitals 구독 + 요약/점수 계산 훅
     lib/
       web-vitals.ts     # 성능 수집/등급/리포트 생성
       export-excel.ts   # Excel/CSV 내보내기 유틸
       export-pdf.ts     # PDF 내보내기 유틸
     utils/
       helpers.ts        # 숫자/퍼센트 포맷 유틸
   ```

---

## 1) React 기초 개념(아주 간단히)

* **컴포넌트**: 화면 조각을 함수로 만든 것.
* **Props**: 부모 → 자식으로 내려주는 값(읽기 전용).
* **State**: 컴포넌트 안에서 변하는 값(화면 다시 그림).
* **Hook**: `useState`, `useEffect` 같은 **특별한 함수**. 브라우저에서만 동작하는 일(데이터 요청, 구독 등)을 처리.

> 이 프로젝트는 **함수형 컴포넌트 + 훅**만 사용합니다.

---

## 2) Next.js App Router 기초

* `src/app/layout.tsx`: 모든 페이지의 **공통 틀**. 폰트/테마/전역 CSS를 여기서 적용합니다.
* `src/app/page.tsx`: `/` 주소로 들어오면 보이는 **첫 페이지**.
* `'use client'`: **브라우저에서 실행**해야 하는 컴포넌트의 맨 위에 적습니다(클릭, 다운로드, DOM 접근 등).

### 예: 메인 페이지

```tsx
// src/app/page.tsx
import Dashboard from '@/components/Dashboard';

export default function Home() {
  return <Dashboard />;
}
```

→ 브라우저가 `/`를 열면 `Dashboard` 컴포넌트를 보여줍니다.

### 레이아웃에서 MUI 테마 적용

```tsx
// src/app/layout.tsx (발췌)
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

const theme = createTheme({
  palette: { primary: { main: '#2196f3' }, secondary: { main: '#f50057' } },
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

* **ThemeProvider**: 전체 앱에 색상/폰트 스타일을 적용합니다.
* **CssBaseline**: 브라우저 기본 스타일을 깔끔하게 정리합니다.

> 팁: Next의 **서버/클라이언트 경계** 때문에 UI 라이브러리 설정은 **클라이언트 래퍼(Providers)** 로 분리하기도 합니다.

---

## 3) 대시보드 화면(구조 이해)

### 화면 조합

```tsx
// src/components/Dashboard.tsx (발췌)
<Container maxWidth="xl" sx={{ py: 4 }} id="dashboard-container">
  {/* 헤더 */}
  {/* KPI 카드 그리드 */}
  {/* 성능 모니터 카드 */}
  {/* 차트(라인/파이/막대) */}
</Container>
```

* **KPI 카드**: `MetricCard.tsx`
* **차트**: `SimpleChart.tsx`(Line/Bar/Pie)
* **성능 모니터**: `PerformanceMonitor.tsx`
* **내보내기 버튼**: `ExportButtons.tsx`(우측 상단)

### KPI 카드(Props 사용 예)

```tsx
// src/components/MetricCard.tsx (발췌)
export default function MetricCard({ data }: { data: MetricData }) {
  return (
    <Card>
      {/* data.title, data.value, data.change 등을 화면에 */}
    </Card>
  );
}
```

* `MetricData` 타입을 받아 화면에 **제목/값/증감**을 표시합니다.
* **도움 함수** `formatNumber`, `formatChange`로 예쁘게 포맷합니다.

---

## 4) 데이터 시각화(Recharts)

```tsx
// src/components/SimpleChart.tsx (발췌)
export default function SimpleChart({ title, data, type, color = '#2196f3' }) {
  switch (type) {
    case 'line': /* LineChart ... */
    case 'bar':  /* BarChart  ... */
    case 'pie':  /* PieChart  ... */
  }
}
```

* **Line/Bar**: `ResponsiveContainer`, `CartesianGrid`, `XAxis`, `YAxis`, `Tooltip`
* **Pie**: `Pie`, `Cell`, `Legend`
* **반응형 컨테이너**로 부모 너비에 맞춰 크기가 바뀝니다.

> 차트에 먹이는 데이터는 `src/data/sampleData.ts`에 있습니다.

---

## 5) 성능 모니터링(Web Vitals)

### 개념

* **LCP**: 큰 내용이 보일 때까지
* **FCP**: 첫 내용이 보일 때까지
* **TTFB**: 서버 첫 응답
* **CLS**: 화면이 덜컥거리며 움직이는 정도
* **INP**: 여러 번 입력에 대한 전체 반응성(※ FID 대신 최신 지표)

### 수집/등급/리포트

```ts
// src/lib/web-vitals.ts (발췌)
import { onCLS, onINP, onFCP, onLCP, onTTFB } from 'web-vitals';

export function startWebVitalsCollection() {
  const handleMetric = (metric: any) => { /* 등급 계산 후 저장소에 push */ };
  onCLS(handleMetric);
  onINP(handleMetric);
  onFCP(handleMetric);
  onLCP(handleMetric);
  onTTFB(handleMetric);
}

export function generatePerformanceReport() {
  // 최신값만 모아 요약(좋음/개선필요/나쁨 개수, 총합)
}
```

### 화면 표시(실시간 구독)

```ts
// src/hooks/usePerformance.ts (발췌)
const initial = performanceStore.getLatestMetrics();
const unsubscribe = performanceStore.subscribe((newMetric) => {
  setMetrics(prev => ({ ...prev, [newMetric.name]: newMetric }));
});
```

→ `PerformanceMonitor.tsx`에서 이 훅을 사용해 **실시간 카드**를 렌더링합니다.

---

## 6) 내보내기(Excel/CSV/PDF)

### Excel/CSV

```ts
// src/lib/export-excel.ts (발췌)
export async function exportToExcel(data, filename = 'dashboard-data') {
  // ExcelJS 워크북 생성 → 시트(주요지표/월별/디바이스별/요약) 구성 → 다운로드
}

export function exportToCSV(data, filename = 'dashboard-data') {
  // CSV 문자열 생성(BOM 추가로 한글 깨짐 방지) → 다운로드
}
```

* **Excel 시트 4개**: 주요지표/월별데이터/디바이스별데이터/요약
* 숫자 포맷(`#,#00`), 비율 포맷(`0"%"`) 등 **읽기 쉬운 형식** 적용
* CSV는 `\uFEFF`(BOM)를 붙여 **엑셀 한글 깨짐 방지**

### PDF(두 가지 방식)

```ts
// src/lib/export-pdf.ts (발췌)

// 1) 화면 스크린샷 기반 PDF
export async function exportDashboardToPDF(elementId='dashboard-container', filename='dashboard-report') {
  // html2canvas로 해당 요소를 이미지로 캡처 → jsPDF에 페이지 단위로 붙여 저장
}

// 2) 데이터 텍스트 기반 PDF
export function exportDataToPDF(data, filename='data-report') {
  // 제목/일시/지표/월별/디바이스 값을 텍스트로 적어 PDF 저장
}
```

* **스크린샷 방식**: 실제 화면을 그대로 저장(차트/스타일 유지)
* **데이터 방식**: 글자 위주 보고서(용량 작고 깔끔)
* 한글 폰트 문제 시, 데이터 방식은 **폰트 등록**이 필요합니다(교육 중 이미 다룸).

### 버튼(메뉴) 한 곳에서 실행

```tsx
// src/components/ExportButtons.tsx (발췌)
<Button onClick={handleClick} startIcon={loading ? <CircularProgress/> : <DownloadIcon/>}>
  {loading ? '내보내는 중...' : '데이터 내보내기'}
</Button>
<Menu ...>
  <MenuItem onClick={handleExcelExport}>Excel 파일로 내보내기</MenuItem>
  <MenuItem onClick={handleCSVExport}>CSV 파일로 내보내기</MenuItem>
  <MenuItem onClick={handlePDFScreenshot}>PDF 스크린샷</MenuItem>
  <MenuItem onClick={handlePDFReport}>PDF 리포트</MenuItem>
</Menu>
<Snackbar>완료/실패 알림</Snackbar>
```

---

## 7) UI/레이아웃 팁

### Grid v2 (MUI 최신 문법)

* 예전: `<Grid item xs={12} sm={6} md={3}>`
* 최신: `<Grid size={{ xs: 12, sm: 6, md: 3 }}>`
* **경고(Warning)** 가 뜬다면 v2 문법으로 바꿔 주세요(프로젝트에 이미 반영되어 있음).

### 로딩 상태

```tsx
// src/components/LoadingSpinner.tsx (발췌)
<LoadingSpinner size={40} message="데이터를 불러오는 중..." fullScreen />
```

* 작은 영역/전체 화면 오버레이 모두 지원합니다.

---

## 8) 자주 나오는 경고 & 해결

* **Each child in a list should have a unique "key" prop.**
  → 리스트 렌더링 시 `key`는 **고유값**(예: `metric.title` 또는 `id`)을 사용.

* **MUI Grid: The `item`/`xs` prop has been removed.**
  → v2 문법: `size={{ xs: 12, sm: 6, ... }}` 로 수정.

* **Functions cannot be passed to Client Components…**
  → 서버에서 만든 객체(함수 포함)를 클라이언트에 직접 넘기지 않기.
  → UI Provider(MUI Theme)는 **클라이언트 래퍼** 안에서 생성하는 패턴 권장.

* **PDF 한글 깨짐**
  → 데이터 기반 PDF는 **한글 폰트 등록** 필요.
  → 스크린샷 기반 PDF는 **`await document.fonts.ready` 후 캡처**.

* **PDF 폭 잘림/페이지 컷 어긋남**
  → 캡처 대상 요소의 **실제 폭/높이**로 `html2canvas` 생성,
  PDF는 **여백 포함** 크기에 맞춰 **페이지 단위 슬라이스**로 넣기(프로젝트 코드에 반영).

* **ARIA 워닝(aria-hidden/focus)**
  → 캡처 전에 **메뉴/팝오버 닫기** 또는 임시 숨김(포커스 블러) 후 캡처.

---

## 9) 데이터/유틸 설계(아키텍처 맛보기)

* **표시 데이터**: `src/data/sampleData.ts`
  → 컴포넌트는 **데이터 구조(타입)** 를 받아 화면만 담당(관심사 분리).

* **표시 포맷**: `src/utils/helpers.ts`
  → 숫자/증감색/퍼센트 문자열 등 **반복 로직**을 유틸로 분리.

* **비즈니스 로직**:

  * **성능 수집/요약**: `src/lib/web-vitals.ts` + `src/hooks/usePerformance.ts`
  * **내보내기**: `src/lib/export-excel.ts`, `src/lib/export-pdf.ts`
    → 화면과 로직을 **모듈 단위로 나누어** 유지보수/테스트가 쉬워집니다.

---

## 10) 실행 시 내부 흐름(한 번 더 정리)

1. `npm run dev` → 개발 서버 시작
2. 브라우저가 `/` 요청 → `app/layout.tsx` → `app/page.tsx` → `Dashboard` 렌더
3. `Dashboard`는 **KPI/차트/모니터/버튼**을 조합
4. 화면이 뜨면 `startWebVitalsCollection()`이 브라우저에서 성능을 수집
5. 사용자가 **내보내기 버튼**을 누르면, **Excel/CSV/PDF** 생성 후 다운로드

---

## 11) FAQ / 트러블슈팅

* **VS Code에서 import가 빨갛게 떠요**
  → TypeScript 서버 재시작: **Ctrl+Shift+P → “TypeScript: Restart TS server”**
  → 또는 VS Code 재시작.

* **`GET /sw-simple.js 404`가 보여요**
  → 서비스워커를 쓰지 않으면 **등록 코드를 제거**하거나 **개발 모드에서 비활성화** 하세요.

* **차트/폰트가 흐릿**
  → 웹폰트 로딩 전 캡처하거나 너무 큰 화면을 캡처하면 흐려질 수 있습니다.
  → `document.fonts.ready` 대기, 대시보드 **최대 폭 제한**(예: 1200px) 권장.

---

## 12) 마무리

이 프로젝트는 **작은 대시보드지만 구조를 명확히 분리**했습니다.

* **컴포넌트**는 “보여주기”에 집중
* **훅과 lib**은 “수집/계산/파일 출력” 같은 로직 담당
* **데이터/유틸**은 재사용 가능한 형태로 분리

> 여기까지 익히면, 다른 페이지/모듈을 **추가**하거나 **실제 데이터 API로 교체**하는 것도 어렵지 않습니다.
> 궁금한 점은 파일 경로를 기준으로 해당 코드를 열고, 이 README를 안내서로 삼아 하나씩 따라가 보세요. 👍
