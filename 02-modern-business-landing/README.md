# 📘 Modern Business Landing

Next.js + MUI 기업 랜딩 페이지 학습 프로젝트

---

## 📖 학습 목적

이 프로젝트는 **React와 Next.js 경험이 전혀 없는 분**들을 대상으로 설계되었습니다.
단순히 코드만 따라 치는 것이 아니라, **왜 이런 코드를 작성하는지** 이해할 수 있도록 기초 이론과 함께 설명합니다.

---

## 🎯 초기 학습 목표

1. **레이아웃과 중첩 라우팅** 이해
2. **Server Components vs Client Components** 구분
3. **컴포넌트 재사용과 Props** 개념 학습

---

## 🛠️ 구현 기술 (이번 단계에서 다룬 것)

* 공통 레이아웃 (`layout.tsx`)
* Server Components (기본)
* Client Components (`"use client"`)
* Props와 Children 패턴

👉 아래 기술들은 **이번 README에서는 소개만 하고, 다음 단계에서 학습 예정**입니다:

* 애니메이션 라이브러리 (Framer Motion)
* 환경 변수 설정
* Google Analytics 연동

---

## 1. React와 Next.js 기초 이해

### React란?

* **React**는 "UI(사용자 인터페이스)를 만들기 위한 JavaScript 라이브러리"입니다.
* 핵심 개념: **컴포넌트(Component)**

  * 화면을 작게 쪼개서 재사용 가능한 단위로 만들고, 조립해서 전체 페이지를 구성합니다.
* 예: 버튼, 네비게이션, 카드 박스 → 모두 컴포넌트

---

### Next.js란?

* **Next.js**는 React 기반의 **웹 애플리케이션 프레임워크**입니다.
* React 단독으로는 라우팅, 서버 렌더링 등을 직접 구현해야 하지만,
  Next.js는 이 모든 기능을 **자동으로 제공**합니다.
* 장점:

  * 페이지 라우팅이 파일 구조만으로 이루어짐 (`/app/about/page.tsx` → `/about` 경로)
  * SEO(Search Engine Optimization) 친화적
  * Server Component 개념으로 더 효율적인 렌더링 가능

---

## 2. 레이아웃과 중첩 라우팅

### 레이아웃(Layout)이란?

웹사이트에서 모든 페이지에 공통으로 적용되는 **틀**을 의미합니다.

* 예: 상단 네비게이션 바, 푸터, 공통 스타일

📄 **app/layout.tsx**

```tsx
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <AppBar> ... 네비게이션 ... </AppBar>
        <Container>{children}</Container>
      </body>
    </html>
  );
}
```

👉 `children` 자리에 각 페이지(`Home`, `About`, `Contact`)가 들어옵니다.

---

### 중첩 라우팅

* Next.js에서는 폴더 구조가 곧 URL 구조입니다.
* `app/about/page.tsx` → `/about`
* `app/contact/page.tsx` → `/contact`

즉, **파일과 폴더를 만드는 것만으로 페이지가 자동 생성**됩니다.

---

## 3. Server Components vs Client Components

### Server Component

* **기본값**: 별도 선언이 없으면 모든 컴포넌트는 서버에서 렌더링됩니다.
* 장점:

  * SEO에 유리 (검색엔진이 읽을 수 있음)
  * 성능 최적화 (필요한 HTML만 미리 준비)

📄 **app/page.tsx (홈 화면)**

```tsx
export default function HomePage() {
  return (
    <Box textAlign="center" mt={8}>
      <Typography variant="h3">환영합니다, Modern Business!</Typography>
    </Box>
  );
}
```

👉 별도의 `use client`가 없으므로 **Server Component**

---

### Client Component

* 브라우저 상호작용(버튼 클릭, 입력, 상태 관리 등)이 필요한 경우 **Client Component**를 사용합니다.
* 선언: 파일 상단에 `"use client"` 추가

📄 **app/contact/page.tsx (문의하기)**

```tsx
"use client";

export default function ContactPage() {
  const [name, setName] = useState("");
  ...
}
```

👉 입력값 관리(`useState`)를 위해 반드시 Client Component로 선언해야 합니다.

---

## 4. 컴포넌트 재사용과 Props

### 컴포넌트란?

* React는 UI를 작은 조각(컴포넌트)으로 쪼갭니다.
* 같은 코드를 반복하지 않고, 재사용할 수 있게 합니다.

---

### Props란?

* **Properties**의 줄임말
* 컴포넌트에 데이터를 전달하는 방법

📄 **app/components/Section.tsx**

```tsx
export default function Section({ title, children }: { title: string; children: ReactNode; }) {
  return (
    <Box>
      <Typography variant="h5">{title}</Typography>
      {children}
    </Box>
  );
}
```

📄 **app/about/page.tsx**

```tsx
<Section title="회사 소개">
  <p>저희 회사는 고객 중심 서비스를 제공합니다.</p>
</Section>
```

👉 `title`은 **Props**, `<p>...</p>`는 **children**

---

## 5. Contact Form (폼 처리)

📄 **app/contact/page.tsx**

* 이름과 메시지를 입력하고 제출 → `alert`로 확인
* React의 **상태 관리(useState)**를 경험할 수 있는 첫 단계

---

## 6. 다음 학습 단계

이번 단계에서는 **기본적인 구조와 개념**을 다뤘습니다.
다음 단계에서는 아래 기능들을 추가 학습합니다:

* **애니메이션 (Framer Motion)** → 컴포넌트 등장/전환 효과
* **환경 변수 설정** → API Key 등 안전한 설정 관리
* **Google Analytics 연동** → 사용자 방문 분석

---

## ✅ 요약

* **레이아웃과 중첩 라우팅** → 모든 페이지의 기본 구조를 정의
* **Server vs Client Components** → 언제 서버/클라이언트에서 동작하는지 이해
* **Props와 Children** → 재사용 가능한 컴포넌트 작성법
* **폼 처리** → 사용자 입력을 React 상태로 관리

👉 이 프로젝트는 React/Next.js 입문자가 **실제 기업 랜딩 페이지**를 만들면서 자연스럽게 학습할 수 있도록 설계되었습니다.

---

혹시 이 README를 **교육용 배포 문서(교재 PDF)** 형식으로 다듬어드릴까요? 아니면 실제 프로젝트용 **GitHub README 스타일**로 유지하는 게 좋으신가요?
