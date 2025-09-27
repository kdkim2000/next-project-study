# Modern Business Landing - React & Next.js 학습 프로젝트

## 📚 프로젝트 개요

이 프로젝트는 React와 Next.js를 처음 접하는 개발자들을 위한 교육용 기업 랜딩 페이지입니다. 실무에서 자주 사용되는 핵심 개념들을 단계적으로 학습할 수 있도록 설계되었습니다.

### 🎯 학습 목표
- **레이아웃과 중첩 라우팅**: Next.js App Router의 파일 시스템 기반 라우팅 이해
- **Server Components vs Client Components**: React의 렌더링 모델과 상호작용 패턴 학습
- **컴포넌트 재사용과 Props**: 재사용 가능한 컴포넌트 설계 원칙
- **Framer Motion 애니메이션**: 현대적인 웹 애니메이션 구현

---

## 🏗️ 프로젝트 구조 이해

```
app/
├── layout.tsx          # 전체 애플리케이션 레이아웃
├── page.tsx           # 홈 페이지 (/)
├── about/
│   └── page.tsx       # About 페이지 (/about)
├── contact/
│   └── page.tsx       # Contact 페이지 (/contact)
└── components/
    └── Section.tsx    # 재사용 가능한 섹션 컴포넌트
```

### 📁 Next.js App Router 파일 시스템 라우팅

Next.js는 **파일과 폴더 구조**가 곧 **URL 경로**가 되는 혁신적인 라우팅 시스템을 제공합니다.

#### 핵심 개념
- `page.tsx`: 해당 경로의 실제 페이지 컴포넌트
- `layout.tsx`: 여러 페이지가 공유하는 레이아웃
- 폴더명이 URL 세그먼트가 됨

#### 실제 예시 (본 프로젝트)
```
app/page.tsx → / (홈페이지)
app/about/page.tsx → /about
app/contact/page.tsx → /contact
```

---

## 🔧 핵심 기술 이해

### 1. Server Components vs Client Components

React 18과 Next.js 13+에서 도입된 가장 중요한 개념 중 하나입니다.

#### 🖥️ Server Components (서버 컴포넌트)
**서버에서 렌더링되어 HTML로 전송되는 컴포넌트**

**특징:**
- JavaScript 번들에 포함되지 않아 성능이 우수
- 데이터베이스나 파일 시스템에 직접 접근 가능
- 상태(state)나 브라우저 이벤트 사용 불가
- 기본적으로 모든 컴포넌트는 Server Component

**본 프로젝트 예시:**
```tsx
// app/components/Section.tsx (초기 버전)
import { Box, Typography } from "@mui/material";

// 이 컴포넌트는 Server Component입니다
// - 상태 관리 없음
// - 브라우저 이벤트 없음  
// - 순수하게 UI 렌더링만 담당
export default function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Box my={4}>
      <Typography variant="h5" gutterBottom>
        {title}
      </Typography>
      {children}
    </Box>
  );
}
```

#### 💻 Client Components (클라이언트 컴포넌트)
**브라우저에서 실행되는 상호작용 가능한 컴포넌트**

**특징:**
- `"use client"` 지시어로 명시적 선언
- 상태 관리 가능 (useState, useEffect 등)
- 브라우저 이벤트 처리 가능
- JavaScript 번들에 포함됨

**본 프로젝트 예시:**
```tsx
// app/contact/page.tsx
"use client";  // 👈 Client Component 선언

import { useState } from "react";
import { TextField, Button, Typography, Box } from "@mui/material";

export default function ContactPage() {
  // 🎯 상태 관리: Server Component에서는 불가능
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  // 🎯 이벤트 핸들러: 브라우저에서만 실행 가능
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`이름: ${name}\n메시지: ${message}`);
  };

  return (
    // JSX 내용...
  );
}
```

#### 🔄 언제 Client Component로 변경해야 할까?

**Server Component → Client Component 변경이 필요한 경우:**

1. **상태 관리가 필요한 경우**
   ```tsx
   const [count, setCount] = useState(0); // ❌ Server Component에서 불가능
   ```

2. **브라우저 이벤트 처리**
   ```tsx
   const handleClick = () => { ... }; // ❌ Server Component에서 불가능
   ```

3. **브라우저 전용 API 사용**
   ```tsx
   useEffect(() => {
     window.localStorage.setItem(...); // ❌ Server Component에서 불가능
   }, []);
   ```

4. **애니메이션 라이브러리 사용** (본 프로젝트 사례)
   ```tsx
   import { motion } from "framer-motion"; // ❌ Server Component에서 불가능
   ```

### 2. 레이아웃 시스템 (Layout System)

#### 🏛️ Root Layout의 역할

`app/layout.tsx`는 **애플리케이션의 최상위 레이아웃**으로, 모든 페이지에서 공유되는 구조를 정의합니다.

**본 프로젝트 예시 분석:**
```tsx
// app/layout.tsx
"use client";

import { ReactNode } from "react";
import { AppBar, Toolbar, Typography, Container, CssBaseline, Button } from "@mui/material";
import Link from "next/link";
import { motion } from "framer-motion";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <title>Modern Business Landing</title>
        <meta name="description" content="기업 랜딩 페이지 예제" />
      </head>
      <body>
        <CssBaseline /> {/* 👈 MUI 스타일 초기화 */}
        
        {/* 🏗️ 공통 네비게이션 - 모든 페이지에서 표시됨 */}
        <motion.div
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" sx={{ flexGrow: 1 }}>
                ModernBiz
              </Typography>
              {/* 네비게이션 링크들 */}
            </Toolbar>
          </AppBar>
        </motion.div>
        
        {/* 🎯 각 페이지의 고유 콘텐츠가 여기에 렌더링됩니다 */}
        <Container sx={{ mt: 4 }}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {children} {/* 👈 page.tsx 컴포넌트들이 여기에 들어감 */}
          </motion.div>
        </Container>
      </body>
    </html>
  );
}
```

#### 🔗 중첩 라우팅 (Nested Routing)

Next.js의 중첩 라우팅은 **레이아웃을 중첩**하여 복잡한 UI 구조를 효율적으로 관리할 수 있게 해줍니다.

**렌더링 과정:**
1. `app/layout.tsx` (Root Layout) 로드
2. 해당 경로의 `page.tsx` 컴포넌트가 `{children}` 자리에 렌더링
3. 페이지 전환 시 Layout은 유지되고 page.tsx만 교체

### 3. 컴포넌트 재사용과 Props

#### 🧩 Props란?

Props(Properties)는 **부모 컴포넌트에서 자식 컴포넌트로 데이터를 전달하는 메커니즘**입니다.

**본 프로젝트 예시:**
```tsx
// app/components/Section.tsx
interface SectionProps {
  title: string;           // 👈 제목을 위한 prop
  children: React.ReactNode; // 👈 내용을 위한 prop
  delay?: number;          // 👈 선택적(optional) prop
}

export default function Section({ title, children, delay = 0 }: SectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay }} // 👈 prop 사용
    >
      <Box my={4} sx={{ p: 3, borderRadius: 2, backgroundColor: "grey.50" }}>
        <Typography variant="h5" gutterBottom sx={{ color: "primary.main", mb: 2 }}>
          {title} {/* 👈 prop 사용 */}
        </Typography>
        <Box sx={{ "& p": { mb: 1, lineHeight: 1.6 } }}>
          {children} {/* 👈 prop 사용 */}
        </Box>
      </Box>
    </motion.div>
  );
}
```

**Section 컴포넌트 사용 예시:**
```tsx
// app/about/page.tsx
export default function AboutPage() {
  return (
    <>
      {/* 👇 Props를 통해 데이터 전달 */}
      <Section title="회사 소개">
        <p>저희 회사는 고객 중심 서비스를 제공하며 최신 기술을 활용합니다.</p>
      </Section>
      
      <Section title="비전">
        <p>미래지향적 혁신으로 고객과 함께 성장합니다.</p>
      </Section>
    </>
  );
}
```

#### 🔄 재사용성의 장점

같은 `Section` 컴포넌트를 **다른 내용**으로 여러 번 사용할 수 있어:
- 코드 중복 제거
- 일관된 디자인 유지
- 유지보수 효율성 증대

---

## 🎬 Framer Motion 애니메이션 시스템

### 애니메이션의 필요성

현대 웹 애플리케이션에서 애니메이션은 단순한 장식이 아닌 **사용자 경험(UX)의 핵심 요소**입니다.

#### 🎯 애니메이션의 역할
- **피드백 제공**: 사용자 행동에 대한 즉각적 반응
- **주의 집중**: 중요한 요소로 시선 유도
- **전환 부드럽게**: 페이지나 상태 변화를 자연스럽게 연결
- **전문성 표현**: 세련되고 완성도 높은 인상

### Framer Motion 라이브러리

Framer Motion은 **React를 위한 선언적 애니메이션 라이브러리**로, 복잡한 애니메이션을 간단하게 구현할 수 있게 해줍니다.

#### 🌟 주요 특징
- **선언적 API**: 애니메이션을 JSX로 직관적으로 정의
- **성능 최적화**: GPU 가속과 최적화된 렌더링
- **제스처 지원**: 드래그, 호버, 탭 등 다양한 인터랙션
- **접근성 고려**: `prefers-reduced-motion` 자동 지원

### 애니메이션 구현 패턴 분석

#### 1. 페이드인 애니메이션 (Hero 섹션)

**구현 목적**: 페이지 로드 시 콘텐츠를 순차적으로 부드럽게 나타나게 함

```tsx
// app/page.tsx
export default function HomePage() {
  return (
    <Box textAlign="center" mt={8}>
      {/* 🎯 첫 번째 요소: 제목 */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}    // 시작: 투명하고 아래쪽에 위치
        animate={{ opacity: 1, y: 0 }}     // 끝: 완전히 보이고 제자리에
        transition={{ duration: 0.8 }}     // 0.8초 동안 애니메이션
      >
        <Typography variant="h3" gutterBottom>
          환영합니다, Modern Business!
        </Typography>
      </motion.div>

      {/* 🎯 두 번째 요소: 부제목 (0.2초 지연) */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }} // 👈 지연으로 순차 등장
      >
        <Typography variant="h6" gutterBottom>
          전문적인 서비스를 제공하는 기업을 위한 랜딩 페이지 예제입니다.
        </Typography>
      </motion.div>
    </Box>
  );
}
```

**핵심 개념:**
- `initial`: 애니메이션 시작 상태
- `animate`: 애니메이션 끝 상태  
- `transition`: 애니메이션 지속 시간과 지연
- `delay`: 순차적 등장 효과

#### 2. 인터랙티브 버튼 애니메이션

**구현 목적**: 사용자 행동(호버, 클릭)에 즉각적으로 반응하여 피드백 제공

```tsx
// app/page.tsx - Contact 버튼
<motion.div
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8, delay: 0.4 }}
  whileHover={{ scale: 1.05 }}    // 👈 마우스 올릴 때 5% 확대
  whileTap={{ scale: 0.95 }}      // 👈 클릭할 때 5% 축소
  style={{ display: "inline-block", marginTop: "24px" }}
>
  <Button
    variant="contained"
    color="primary"
    component={Link}
    href="/contact"
  >
    문의하기
  </Button>
</motion.div>
```

**핵심 개념:**
- `whileHover`: 마우스 호버 시 스타일
- `whileTap`: 클릭/터치 시 스타일
- `scale`: 크기 변경 (1.0 = 원본 크기)

#### 3. 슬라이드 애니메이션 (About 페이지)

**구현 목적**: 각 섹션을 다른 방향에서 등장시켜 역동적인 느낌 연출

```tsx
// app/about/page.tsx
export default function AboutPage() {
  // 🎯 재사용 가능한 애니메이션 설정
  const sectionVariants = {
    hidden: { opacity: 0, x: -50 },  // 숨김: 투명하고 왼쪽에 위치
    visible: { opacity: 1, x: 0 }    // 보임: 완전히 보이고 제자리에
  };

  return (
    <>
      {/* 👈 왼쪽에서 슬라이드 */}
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Section title="회사 소개">
          <p>저희 회사는 고객 중심 서비스를 제공하며...</p>
        </Section>
      </motion.div>

      {/* 👉 오른쪽에서 슬라이드 */}
      <motion.div
        variants={{
          hidden: { opacity: 0, x: 50 },   // 오른쪽에서 시작
          visible: { opacity: 1, x: 0 }
        }}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <Section title="비전">
          <p>미래지향적 혁신으로 고객과 함께...</p>
        </Section>
      </motion.div>
    </>
  );
}
```

**핵심 개념:**
- `variants`: 재사용 가능한 애니메이션 상태 정의
- `x` 속성: 수평 이동 (음수: 왼쪽, 양수: 오른쪽)
- 다양한 `delay`로 순차적 등장 효과

#### 4. 스크롤 기반 애니메이션 (Section 컴포넌트)

**구현 목적**: 스크롤 시 뷰포트에 들어오는 요소들을 애니메이션으로 등장

```tsx
// app/components/Section.tsx
export default function Section({ title, children, delay = 0 }: SectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}          // 👈 뷰포트에 들어올 때
      viewport={{ once: true, margin: "-100px" }} // 👈 한 번만 실행, 100px 마진
      transition={{ duration: 0.6, delay }}
    >
      {/* 섹션 내용 */}
    </motion.div>
  );
}
```

**핵심 개념:**
- `whileInView`: 스크롤로 요소가 화면에 나타날 때 실행
- `viewport.once`: 애니메이션을 한 번만 실행 (성능 최적화)
- `viewport.margin`: 애니메이션 트리거 지점 조절

---

## 🚀 프로젝트 실행 및 개발

### 설치 및 실행
```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 브라우저에서 http://localhost:3000 접속
```

### 주요 의존성
```json
{
  "dependencies": {
    "react": "^19.0.0",           // React 핵심 라이브러리
    "react-dom": "^19.0.0",       // DOM 렌더링
    "next": "^15.0.0",            // Next.js 프레임워크
    "@mui/material": "^6.1.6",    // Material-UI 컴포넌트
    "framer-motion": "^11.11.9"   // 애니메이션 라이브러리
  }
}
```

---

## 📈 학습 진행 단계

### 1단계: 기본 구조 이해 ✅
- [x] 파일 시스템 라우팅 개념
- [x] Server vs Client Components 차이점
- [x] Layout 시스템 동작 원리

### 2단계: 상호작용 구현 ✅  
- [x] useState를 활용한 상태 관리
- [x] 이벤트 핸들러 구현
- [x] 폼 처리 패턴

### 3단계: 애니메이션 시스템 ✅
- [x] Framer Motion 기본 개념
- [x] 다양한 애니메이션 패턴 구현
- [x] 사용자 인터랙션 애니메이션

### 4단계: 다음 학습 과제 🔄
- [ ] API 연동 (데이터 fetching)
- [ ] 전역 상태 관리 (Context API/Zustand)
- [ ] 성능 최적화 (memo, useMemo, useCallback)
- [ ] 접근성 향상 (ARIA, 키보드 네비게이션)
- [ ] 반응형 디자인 (모바일 최적화)
- [ ] 테스트 코드 작성 (Jest, Testing Library)

---

## 💡 핵심 학습 포인트

### 🧠 React 패러다임 이해
1. **컴포넌트 기반 아키텍처**: UI를 재사용 가능한 조각으로 분리
2. **선언적 프로그래밍**: "어떻게"가 아닌 "무엇"을 렌더링할지 선언
3. **단방향 데이터 흐름**: Props를 통한 부모→자식 데이터 전달

### 🏗️ Next.js App Router 특징
1. **파일 기반 라우팅**: 폴더 구조가 곧 URL 구조
2. **레이아웃 중첩**: 공통 UI 요소의 효율적 관리
3. **Server-First**: 기본적으로 서버 렌더링, 필요시에만 클라이언트

### 🎨 현대적 UX 패턴
1. **마이크로 인터랙션**: 작은 애니메이션이 만드는 큰 차이
2. **프로그레시브 인핸스먼트**: 점진적 기능 향상
3. **접근성 고려**: 모든 사용자를 위한 포용적 디자인

---

## 🔍 문제 해결 가이드

### 자주 발생하는 오류와 해결법

#### 1. "use client" 관련 오류
```
Error: useState only works in Client Components
```

**원인**: Server Component에서 브라우저 전용 기능 사용  
**해결**: 파일 상단에 `"use client";` 추가

#### 2. Framer Motion 애니메이션 미작동
```
TypeError: Cannot read properties of undefined (reading 'initial')
```

**원인**: Server Component에서 motion 컴포넌트 사용  
**해결**: 해당 컴포넌트를 Client Component로 변경

#### 3. 라우팅 404 오류
**원인**: 잘못된 폴더 구조 또는 page.tsx 파일명 오타  
**해결**: 파일명과 폴더 구조 확인

---

## 📚 추가 학습 자료

### 공식 문서
- [Next.js App Router 가이드](https://nextjs.org/docs/app)
- [React 공식 문서](https://react.dev/)
- [Framer Motion 문서](https://www.framer.com/motion/)
- [Material-UI 가이드](https://mui.com/)

### 심화 학습 주제
1. **성능 최적화**: Image 최적화, Code Splitting, Bundle Analysis
2. **SEO 최적화**: Meta tags, Structured data, Sitemap
3. **배포 전략**: Vercel, Netlify, AWS 등 플랫폼별 배포
4. **모니터링**: Analytics, Error tracking, Performance monitoring

---

이 README는 여러분의 React & Next.js 학습 여정의 첫걸음입니다. 각 개념을 충분히 이해한 후 다음 단계로 진행하시기 바랍니다. 궁금한 점이 있으시면 언제든지 문의해주세요! 🚀