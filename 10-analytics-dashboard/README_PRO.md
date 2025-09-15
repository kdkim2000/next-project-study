# Analytics Dashboard Pro

## React + Next.js 학습 가이드 (고급편) 📚

> 목표: “**왜 이렇게 설계했는지**”까지 이해하고, 실제 서비스에 올릴 수 있는 **프로덕션 품질**을 감 잡기.

---

## 1) 프로젝트 한눈에 보기

### 우리가 만든 것

* **대시보드 웹앱**: 카드(KPI), 다양한 차트, 성능 모니터링(Web Vitals), 파일 내보내기(Excel/CSV/PDF).
* **현대적 라우팅**: App Router, **Parallel Routes(@sidebar, @modal)**, **Intercepting Routes**.
* **스트리밍 렌더링**: **Streaming SSR** + `Suspense`로 점진적 표시.
* **배포 준비**: Docker 이미지, CI/CD 스크립트(예: GitHub Actions), Vercel/AWS 배포 호환.

### 왜 이렇게 구성했나 (설계 의도)

* **UX**: 모달/사이드바를 **메인과 독립적으로** 갱신 → 빠르고 매끄러운 화면 전환(Parallel/Intercepting).
* **성능**: 서버에서 **먼저** 그릴 수 있는 건 그려서 보내고, 나머지는 **스트리밍**(Streaming SSR).
* **안정성**: 타입(TypeScript) + ESLint/구조화된 폴더 → 확장에 강함.
* **데이터 가시성**: Web Vitals를 **실시간 수집/표시** → 개선 포인트 즉시 확인.

---

## 2) React를 “엔진”처럼 이해하기

### 컴포넌트 = 작은 엔진 블록

* 예: `src/components/MetricCard.tsx`는 **KPI 카드**라는 기능을 가진 블록.
* **Props**는 입력(연료), **State**는 내부 메모리.
* 입력이나 메모리가 바뀌면 **렌더링(화면 갱신)** 이 다시 돈다.

### 상태(State) 전략

* **지역 상태**: 특정 컴포넌트만 쓰는 값(예: 버튼 열림/닫힘).
* **전역 상태**: 여러 컴포넌트가 공유(예: 성능 측정치).

  * 예: `src/lib/web-vitals.ts`의 `performanceStore`(간단한 “전역 창고”).
  * `src/hooks/usePerformance.ts`가 **구독**해서 `PerformanceMonitor`에 제공.

### 리렌더 최소화(성능)

* 가격비싼 계산은 `useMemo`, 콜백은 `useCallback`, “변화 없음”은 `React.memo`.
* 예: `usePerformance`에서 **평균 점수 계산**은 메모이제이션 대상.

---

## 3) Next.js를 “차체”처럼 이해하기

### App Router(폴더 = URL)

* `src/app/page.tsx` → `/`
* `src/app/chart/[id]/page.tsx` → `/chart/고급차트ID` (동적 라우팅)
* **특수 파일**: `loading.tsx`(로딩 UI), `error.tsx`(에러 UI), `not-found.tsx`(404)

### 서버/클라이언트 컴포넌트 구분

* **기본 서버**: 데이터 조립·SEO·빠른 첫 화면.
* **클라이언트(‘use client’)**: 클릭, 입력, 애니메이션, 실시간 갱신.
* 팁: **서버에서 함수/복잡 객체를** 클라이언트로 **직접 넘기지 말기**(경계 오류 방지).

### Parallel Routes + Intercepting Routes

* `src/app/layout.tsx`에서 **@sidebar**, **@modal** 슬롯을 동시에 렌더.
* `/chart/[id]`로 가는 링크를 **@modal**로 “가로채서” 모달로 띄울 수 있음.
* 새 탭으로 열면 **정식 페이지**가 열려서 **접근성/공유성** 확보.

### Streaming SSR

* 서버가 **먼저 준비된 조각부터** 전송.
* `Suspense`의 `fallback`과 조합해 **체감 속도** 개선.
* 느린 그래프/데이터도 **중간중간** 보여주기 시작.

---

## 4) 화면(UX) 구성 요소

### 대시보드 본체: `src/components/Dashboard.tsx`

* 헤더 + `ExportButtons`(Excel/CSV/PDF), KPI 카드 그리드(`MetricCard`), 차트(`SimpleChart`), 성능 패널(`PerformanceMonitor`).
* **Grid v2** 사용 시: `Grid container`/`Grid item` 대신 `Grid container` + `Grid size={{ xs:…, md:… }}` 구조로 마이그레이션.

### 차트: `src/components/SimpleChart.tsx`

* `type`에 따라 **라인/막대/파이**를 재사용 프레임 하나로 그림.
* 데이터는 `src/data/sampleData.ts`에서 주입.

### 성능 모니터:

* 수집: `src/lib/web-vitals.ts` (`onCLS`, `onINP`, `onFCP`, `onLCP`, `onTTFB`)
* 구독/가공: `src/hooks/usePerformance.ts` (평균 점수, 등급 카운트)
* 표시: `src/components/PerformanceMonitor.tsx` (Chip/Progress로 가독성↑)

### 내보내기: `src/components/ExportButtons.tsx`

* Excel/CSV: `src/lib/export-excel.ts` (ExcelJS)
* PDF(화면 스냅샷/텍스트 리포트): `src/lib/export-pdf.ts` (html2canvas + jsPDF)

---

## 5) 데이터 흐름(조립 라인) 이해

```
샘플 데이터(sampleData.ts)
   ↓ import
부모(Dashboard.tsx)
   ↓ props
자식(MetricCard.tsx / SimpleChart.tsx)
   ↓ 사용자 상호작용(클릭/토글)
이벤트 핸들러 호출 → setState → 자동 리렌더
```

* 전역 성능 데이터는 **store → hook → 여러 컴포넌트**로 동시에 공급.

---

## 6) 성능 최적화 실전 감각

### 렌더링 비용 줄이기

* 불필요한 리렌더를 줄이려면 **props 불변성** 유지 + `React.memo`.
* 리스트 렌더링은 **안정적 key** 사용(경고 “Each child in a list…” 방지).

### Hydration(수화) 함정

* 서버 HTML과 브라우저 렌더 결과가 다르면 **Hydration Mismatch**.
* **시간/난수/브라우저전용 API**는 클라이언트에서만(`useEffect`) 처리.

### Web Vitals로 데이터 기반 개선

* LCP, INP, CLS 같은 **실사용자 체감 지표**로 병목 파악.
* `PerformanceMonitor`에서 점수/등급을 즉시 확인하고, 개선 전후 비교.

---

## 7) 라우팅 고급 패턴

### Route Groups

* `src/app/(dashboard)/…`처럼 괄호 그룹은 **URL에 안 드러남**.
* 공통 레이아웃/헤더를 묶고 URL은 깨끗하게 유지.

### 동적 라우팅 심화

* `[...params]`(모든 하위 경로), `[[...params]]`(옵션)로 **유연한 URL** 처리.
* 예: 다양한 차트/레벨을 한 라우트로 받음.

---

## 8) 배포·운영 관점(프로급 체크리스트)

### 빌드 & 번들

* **코드 분할**(`next/dynamic`), `ssr: false`로 클라 전용 차트 최적화.
* 이미지 최적화(`next.config.mjs`의 `images.formats` 등)로 전송량 절감.

### 접근성(A11y)

* 모달/메뉴는 **포커스 트랩**과 `aria-*` 속성 주의.
* 이전에 본 경고(aria-hidden 관련)는 **열린 메뉴에 포커스가 남아있는데 상위에 aria-hidden이 걸려** 발생.

  * 해결: 메뉴 닫을 때 **포커스 반환**, 숨김은 `inert` 고려, MUI 컴포넌트의 기본 접근성 흐름 존중.

### PDF/Excel 내보내기 실전 팁

* PDF 스크린샷 잘림 → **컨테이너 폭 고정/패딩**, **스케일 조정**, **메뉴/모달 닫고 캡처**.
* Excel 한글/숫자 포맷은 ExcelJS의 **numFmt/스타일**로 해결(이미 적용).

### CI/CD & Docker

* Dockerfile로 **빌드 이미지** 생성 → 런타임 베이스 이미지로 가볍게.
* GitHub Actions에서 **lint/test/build**, Lighthouse로 **품질 게이트**.
* Vercel/AWS: 환경 변수, 캐시 전략, 이미지 도메인 허용 등 설정.

---

## 9) 트러블슈팅(원인 → 대처)

* **Functions cannot be passed…**

  * 서버 컴포넌트의 **함수/객체**를 클라로 **직접 전달**해서 생기는 오류.
  * 대처: 클라 쪽에서 함수 정의(‘use client’), 또는 **서버 액션은 호출 트리거만** 넘김.

* **Grid v2 경고**

  * MUI v6에서 `item`, `xs`, `sm`, `md`, `lg` prop가 변경.
  * 대체: `<Grid container spacing={…}>` + 내부는 `<Grid size={{ xs:…, md:… }}>`.

* **한글 PDF 깨짐**

  * 텍스트 리포트형은 **웹폰트 등록/임베드** 단계 필요(이미 안내한 방식 적용 가능).
  * 스크린샷형은 **이미지 캡처**라 폰트 문제는 거의 없음(대신 레이아웃/폭 주의).

---

## 10) 실습 로드맵(짧고 굵게)

1. **KPI 카드 하나 추가** → 데이터만 추가해도 UI 자동 반영.
2. **모달 인터셉트 체험** → 차트 상세 링크를 눌러 모달(@modal)로 열기.
3. **Streaming 체감** → 일부 컴포넌트에 의도적 지연을 넣고 `loading.tsx`/`Suspense` 확인.
4. **Web Vitals 변화를 기록** → 이미지 크기/차트 렌더량 줄이며 LCP/INP 개선 확인.
5. **Excel/PDF 내보내기** → 보고서 파일을 실제로 내려받아 내용 확인.

---

## 11) 주요 용어 사전 (필수만 꽉 잡기)

* **컴포넌트(Component)**: 재사용 가능한 화면 조각(함수형 UI 블록).
* **Props**: 부모 → 자식으로 주는 입력 값(읽기 전용).
* **State**: 컴포넌트 내부에서 바뀌는 값(바뀌면 리렌더).
* **서버 컴포넌트/클라이언트 컴포넌트**: 서버에서 렌더 vs 브라우저에서 상호작용.
* **Hydration(수화)**: 서버가 보낸 HTML에 브라우저가 이벤트·상태를 “끼워 넣는” 과정.
* **App Router**: 폴더 구조로 라우팅을 정의하는 Next.js 시스템.
* **동적 라우팅**: `[id]`처럼 URL 일부를 변수로 받는 방식.
* **Parallel Routes**: 메인/사이드바/모달을 **동시에** 독립적으로 렌더.
* **Intercepting Routes**: 링크 이동을 “가로채” 모달로 띄우는 패턴.
* **Streaming SSR**: 서버가 준비된 내용을 **조각 단위로** 먼저 보내는 렌더링.
* **Suspense**: 비동기 컴포넌트를 감싸 “기다리는 동안” 대체 UI(fallback) 보여줌.
* **Web Vitals(LCP/INP/CLS/TTFB/FCP)**: 실제 사용자 체감 성능 지표.
* **코드 분할(Code Splitting)**: 필요한 컴포넌트만 **지연 로딩**하여 초기 로딩 가볍게.
* **메모이제이션(memo/useMemo/useCallback)**: 값/함수를 **캐시**해 불필요한 연산·리렌더 절약.
* **불변성(Immutability)**: 기존 상태를 직접 바꾸지 않고 **새 값**으로 교체하는 원칙.
* **CI/CD**: 코드를 **자동으로 검사/빌드/배포**하는 파이프라인.
* **Docker**: 실행 환경을 **컨테이너**로 묶어 어디서나 동일하게 실행.

---

