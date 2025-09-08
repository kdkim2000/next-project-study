# Next.js 포트폴리오 프로젝트 - 완전 초보자를 위한 교육 가이드

## 목차
1. [React와 Next.js 기초 개념](#1-react와-nextjs-기초-개념)
2. [프로젝트 구조와 개발 환경](#2-프로젝트-구조와-개발-환경)
3. [React 컴포넌트 기초](#3-react-컴포넌트-기초)
4. [JSX 문법 완전 가이드](#4-jsx-문법-완전-가이드)
5. [App Router와 라우팅 시스템](#5-app-router와-라우팅-시스템)
6. [스타일링 시스템](#6-스타일링-시스템)
7. [정적 페이지와 메타데이터](#7-정적-페이지와-메타데이터)
8. [이미지 최적화](#8-이미지-최적화)
9. [반응형 디자인](#9-반응형-디자인)
10. [다크모드 구현](#10-다크모드-구현)

---

## 1. React와 Next.js 기초 개념

### 1.1 React란 무엇인가?

React는 Facebook(현 Meta)에서 개발한 **자바스크립트 라이브러리**입니다. 웹 페이지의 사용자 인터페이스(UI)를 만들기 위해 사용됩니다.

**기존 HTML과 React의 차이점:**

```html
<!-- 기존 HTML 방식 -->
<div id="counter">0</div>
<button onclick="increment()">증가</button>

<script>
let count = 0;
function increment() {
  count++;
  document.getElementById('counter').textContent = count;
}
</script>
```

```javascript
// React 방식 (본 프로젝트의 패턴)
function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <div>{count}</div>
      <button onClick={() => setCount(count + 1)}>증가</button>
    </div>
  );
}
```

**React의 핵심 개념:**

1. **컴포넌트(Component)**: UI의 독립적인 재사용 가능한 부분
2. **상태(State)**: 컴포넌트가 기억하는 데이터
3. **가상 DOM**: 실제 DOM 조작을 최적화하는 React의 내부 시스템

### 1.2 Next.js란 무엇인가?

Next.js는 React를 기반으로 한 **풀스택 프레임워크**입니다. React만으로는 복잡한 웹 애플리케이션을 만들기 어려운 점들을 해결해줍니다.

**Next.js가 제공하는 기능들:**

1. **서버 사이드 렌더링(SSR)**: 서버에서 HTML을 미리 생성
2. **파일 기반 라우팅**: 폴더 구조로 URL 경로 결정
3. **자동 코드 분할**: 필요한 코드만 로드하여 성능 최적화
4. **이미지 최적화**: 자동으로 이미지 크기와 형식 최적화
5. **API 라우트**: 백엔드 API를 같은 프로젝트에서 구현 가능

---

## 2. 프로젝트 구조와 개발 환경

### 2.1 create-next-app으로 프로젝트 생성

**create-next-app**은 Next.js 프로젝트를 빠르게 시작할 수 있게 해주는 도구입니다.

```bash
# Next.js 프로젝트 생성 명령어
npx create-next-app@latest portfolio-project --typescript --tailwind --eslint --app

# 각 옵션의 의미:
# --typescript: TypeScript 사용 (자바스크립트에 타입 시스템 추가)
# --tailwind: Tailwind CSS 설정 (유틸리티 기반 CSS 프레임워크)
# --eslint: ESLint 설정 (코드 품질 검사 도구)
# --app: App Router 사용 (Next.js 13+의 새로운 라우팅 시스템)
```

### 2.2 프로젝트 디렉토리 구조 상세 분석

본 프로젝트의 구조를 살펴보겠습니다:

```
src/
├── app/                    # App Router 디렉토리 (Next.js 13+)
│   ├── globals.css        # 모든 페이지에 적용되는 전역 스타일
│   ├── layout.tsx         # 모든 페이지를 감싸는 최상위 레이아웃
│   ├── page.tsx          # 홈페이지 (브라우저에서 "/" 경로)
│   ├── about/            # About 페이지 디렉토리
│   │   └── page.tsx      # About 페이지 (브라우저에서 "/about" 경로)
│   ├── projects/         # Projects 페이지 디렉토리  
│   │   └── page.tsx      # Projects 페이지 ("/projects")
│   └── contact/          # Contact 페이지 디렉토리
│       └── page.tsx      # Contact 페이지 ("/contact")
├── components/            # 재사용 가능한 UI 컴포넌트들
│   ├── layout/           # 레이아웃 관련 컴포넌트
│   │   ├── Navbar.tsx    # 상단 네비게이션 바
│   │   └── Footer.tsx    # 하단 푸터
│   ├── sections/         # 페이지의 큰 섹션들
│   │   ├── Hero.tsx      # 메인 페이지 상단 히어로 섹션
│   │   ├── About.tsx     # 소개 섹션
│   │   ├── Projects.tsx  # 프로젝트 섹션
│   │   └── Skills.tsx    # 기술 스택 섹션
│   └── ui/              # 작은 UI 컴포넌트들
│       ├── ThemeToggle.tsx    # 다크모드 토글 버튼
│       └── ScrollToTop.tsx    # 맨 위로 가기 버튼
├── contexts/             # React Context (전역 상태 관리)
│   └── ThemeContext.tsx  # 테마(다크모드) 상태 관리
├── data/                # 정적 데이터 파일들
│   ├── personal.ts       # 개인 정보 데이터
│   ├── experience.ts     # 경력 데이터
│   ├── projects.ts       # 프로젝트 데이터
│   ├── skills.ts         # 기술 스택 데이터
│   └── navigation.ts     # 네비게이션 메뉴 데이터
├── theme/               # Material-UI 테마 설정
│   └── theme.ts         # 라이트/다크 테마 정의
└── types/               # TypeScript 타입 정의
    └── index.ts         # 프로젝트 전체에서 사용하는 타입들
```

### 2.3 핵심 설정 파일 이해

**package.json**: 프로젝트의 메타데이터와 의존성을 관리
```json
{
  "name": "portfolio-project",
  "version": "0.1.0",
  "scripts": {
    "dev": "next dev",      // 개발 서버 실행
    "build": "next build",  // 프로덕션 빌드
    "start": "next start",  // 프로덕션 서버 실행
    "lint": "next lint"     // 코드 품질 검사
  },
  "dependencies": {
    "next": "14.0.0",       // Next.js 프레임워크
    "react": "^18",         // React 라이브러리
    "@mui/material": "^5"   // Material-UI 컴포넌트 라이브러리
  }
}
```

**tsconfig.json**: TypeScript 설정
```json
{
  "compilerOptions": {
    "baseUrl": ".",           // 기본 경로 설정
    "paths": {
      "@/*": ["./src/*"]      // @ 기호로 src 폴더에 쉽게 접근
    }
  }
}
```

---

## 3. React 컴포넌트 기초

### 3.1 컴포넌트의 개념과 중요성

**컴포넌트**는 React의 핵심 개념입니다. 웹 페이지를 작은 조각들로 나누어 재사용 가능하게 만드는 것입니다.

**실생활 비유**: 레고 블록처럼 작은 부품들을 조합해서 큰 구조물을 만드는 것과 같습니다.

### 3.2 함수형 컴포넌트 분석

본 프로젝트의 `Hero.tsx` 컴포넌트를 분석해보겠습니다:

```typescript
// src/components/sections/Hero.tsx
'use client'  // ← 이것은 클라이언트 컴포넌트임을 Next.js에게 알려주는 지시어

import { useState, useEffect } from 'react'  // ← React Hooks import
import Link from 'next/link'  // ← Next.js의 최적화된 Link 컴포넌트
import {
  Box,
  Container,
  Typography,
  Button,
  Avatar,
} from '@mui/material'  // ← Material-UI 컴포넌트들

// 타이핑 효과를 위한 커스텀 훅(Hook)
function useTypewriter(text: string, speed: number = 100) {
  const [displayText, setDisplayText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex])
        setCurrentIndex(prev => prev + 1)
      }, speed)

      return () => clearTimeout(timeout)
    }
  }, [currentIndex, text, speed])

  return displayText
}

// 메인 Hero 컴포넌트
export default function Hero() {
  const typedText = useTypewriter('Frontend Developer', 150)

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      {/* 컴포넌트의 JSX 반환값 */}
    </Box>
  )
}
```

**컴포넌트의 구조:**

1. **import 섹션**: 필요한 모듈들을 가져옴
2. **함수 선언**: `export default function Hero()`
3. **로직 부분**: useState, useEffect 등의 Hooks 사용
4. **JSX 반환**: 실제 렌더링될 UI 구조

### 3.3 React Hooks 심화 이해

**Hook**은 함수형 컴포넌트에서 상태와 생명주기를 관리할 수 있게 해주는 특별한 함수들입니다.

**1. useState Hook**

본 프로젝트의 `ThemeContext.tsx`에서 사용 예시:
```typescript
const [mode, setMode] = useState<'light' | 'dark'>('light')

// 해석:
// mode: 현재 상태값 (현재 테마 모드)
// setMode: 상태를 변경하는 함수
// useState('light'): 초기값을 'light'로 설정
```

**2. useEffect Hook**

```typescript
useEffect(() => {
  // 저장된 테마 불러오기
  const savedTheme = localStorage.getItem('portfolio-theme')
  if (savedTheme) {
    setMode(savedTheme as 'light' | 'dark')
  }
}, [])  // ← 빈 배열: 컴포넌트가 처음 마운트될 때만 실행

// 해석:
// 첫 번째 매개변수: 실행할 함수
// 두 번째 매개변수: 의존성 배열 (언제 재실행할지 결정)
```

**3. useContext Hook**

본 프로젝트의 테마 시스템에서 사용:
```typescript
const { mode, toggleTheme } = useContext(ThemeContext)

// 해석:
// Context에서 현재 테마 모드와 테마 변경 함수를 가져옴
```

---

## 4. JSX 문법 완전 가이드

### 4.1 JSX의 개념

**JSX(JavaScript XML)**는 JavaScript 코드 안에서 HTML과 비슷한 문법을 사용할 수 있게 해주는 React의 핵심 문법입니다.

**기존 JavaScript vs JSX:**

```javascript
// 기존 JavaScript (DOM 조작)
const element = document.createElement('h1');
element.textContent = 'Hello, World!';
element.className = 'title';
document.body.appendChild(element);

// JSX (React)
const element = <h1 className="title">Hello, World!</h1>;
```

### 4.2 JSX 기본 규칙과 문법

본 프로젝트의 `page.tsx` (홈페이지) 코드를 통해 JSX 문법을 분석해보겠습니다:

```typescript
// src/app/page.tsx
export default function HomePage() {
  const featuredProjects = getFeaturedProjects().slice(0, 3)

  return (
    <Box>  {/* ← 최상위 요소는 반드시 하나여야 함 */}
      {/* 주석은 이렇게 작성합니다 */}
      
      {/* 1. 조건부 렌더링 */}
      <Box sx={{ py: 12, textAlign: 'center' }}>
        <Container maxWidth="md">
          <Typography variant="h2" gutterBottom fontWeight="bold">
            안녕하세요! {personalInfo.koreanName || personalInfo.name}입니다
            {/* ← JavaScript 표현식을 {} 안에 작성 */}
          </Typography>
          
          {/* 2. 이벤트 핸들링 */}
          <Button
            component={Link}
            href="/projects"
            variant="contained"
            size="large"
            endIcon={<ArrowForward />}  {/* ← 컴포넌트를 props로 전달 */}
          >
            프로젝트 보기
          </Button>
        </Container>
      </Box>

      {/* 3. 배열 렌더링 (반복) */}
      <Grid container spacing={4}>
        {mainSkills.map((skill) => (  {/* ← .map()으로 배열을 JSX로 변환 */}
          <Grid item xs={12} sm={6} md={4} key={skill.name}>  {/* ← key 속성 필수 */}
            <Card>
              <CardContent>
                <Typography variant="h6">{skill.name}</Typography>
                <Chip 
                  label={skill.level} 
                  color={skill.color}  {/* ← 동적 props */}
                />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}
```

**JSX 핵심 규칙:**

1. **단일 최상위 요소**: 컴포넌트는 반드시 하나의 요소를 반환해야 함
2. **JavaScript 표현식**: `{}` 안에 변수, 함수 호출, 연산식 등을 작성
3. **속성명 변경**: `class` → `className`, `for` → `htmlFor`
4. **자동 닫힘 태그**: `<img />`, `<br />` 처럼 반드시 닫아야 함
5. **key 속성**: 배열 렌더링 시 각 요소에 고유한 key 필요

### 4.3 조건부 렌더링 패턴

본 프로젝트에서 사용된 다양한 조건부 렌더링 방식:

```typescript
// 1. 삼항 연산자 (조건 ? 참일때 : 거짓일때)
{pathname === item.href ? (
  <strong>{item.name}</strong>
) : (
  <span>{item.name}</span>
)}

// 2. 논리 AND 연산자 (조건 && 렌더링할_요소)
{project.liveUrl && (
  <Button href={project.liveUrl}>
    라이브 데모 보기
  </Button>
)}

// 3. 즉시 실행 함수 (복잡한 조건)
{(() => {
  if (skill.level >= 5) return <Chip color="success" label="전문가" />
  if (skill.level >= 3) return <Chip color="primary" label="숙련" />
  return <Chip color="secondary" label="학습중" />
})()}
```

---

## 5. App Router와 라우팅 시스템

### 5.1 라우팅의 개념

**라우팅(Routing)**은 사용자가 접속한 URL에 따라 어떤 페이지를 보여줄지 결정하는 시스템입니다.

**전통적인 웹사이트 vs SPA(Single Page Application):**

```
전통적인 웹사이트:
/about.html ← 실제 about.html 파일이 서버에 존재
/contact.html ← 실제 contact.html 파일이 서버에 존재

Next.js App Router:
/about ← src/app/about/page.tsx 파일로 처리
/contact ← src/app/contact/page.tsx 파일로 처리
```

### 5.2 App Router의 파일 시스템 기반 라우팅

Next.js 13+에서 도입된 App Router는 폴더 구조가 곧 URL 구조가 됩니다:

```
src/app/
├── page.tsx              → / (홈페이지)
├── about/
│   └── page.tsx          → /about
├── projects/
│   ├── page.tsx          → /projects
│   └── [id]/
│       └── page.tsx      → /projects/1, /projects/2 등 (동적 라우트)
└── contact/
    └── page.tsx          → /contact
```

### 5.3 layout.tsx의 역할

**layout.tsx**는 모든 하위 페이지에 공통으로 적용되는 레이아웃을 정의합니다.

본 프로젝트의 `layout.tsx` 분석:

```typescript
// src/app/layout.tsx
import { Inter } from 'next/font/google'  // ← 구글 폰트 import
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter'
import { CssBaseline } from '@mui/material'
import { AppThemeProvider } from '@/contexts/ThemeContext'
import ClientLayout from '@/components/layout/ClientLayout'
import './globals.css'

// 폰트 설정
const inter = Inter({ subsets: ['latin'] })

// 메타데이터 설정 (SEO를 위한 페이지 정보)
export const metadata = {
  title: 'John Doe - Frontend Developer',  // ← 브라우저 탭 제목
  description: '프론트엔드 개발자 John Doe의 포트폴리오',  // ← 검색 엔진용
}

export default function RootLayout({
  children,  // ← 하위 페이지들이 이곳에 렌더링됨
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" suppressHydrationWarning>  {/* ← 한국어 페이지 설정 */}
      <body className={inter.className}>  {/* ← Inter 폰트 적용 */}
        <AppRouterCacheProvider>  {/* ← Material-UI 캐시 제공자 */}
          <AppThemeProvider>  {/* ← 테마 상태 제공자 */}
            <CssBaseline />  {/* ← CSS 초기화 (normalize.css 역할) */}
            <ClientLayout>  {/* ← 네비게이션, 푸터 등이 포함된 레이아웃 */}
              {children}  {/* ← 실제 페이지 내용이 여기에 렌더링 */}
            </ClientLayout>
          </AppThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  )
}
```

**RootLayout의 특징:**

1. **모든 페이지에 적용**: about, projects, contact 등 모든 페이지가 이 레이아웃을 상속
2. **전역 설정**: 폰트, 테마, CSS 초기화 등
3. **Provider 패턴**: Context Provider들로 전역 상태 관리
4. **SEO 설정**: 메타데이터로 검색 엔진 최적화

---

## 6. 스타일링 시스템

### 6.1 CSS-in-JS vs 전통적 CSS

본 프로젝트에서는 **Material-UI의 sx prop**과 **Tailwind CSS**를 함께 사용합니다.

**전통적 CSS:**
```css
/* styles.css */
.hero-section {
  min-height: 100vh;
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

**CSS-in-JS (Material-UI sx prop):**
```typescript
<Box
  sx={{
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  }}
>
```

### 6.2 Material-UI 시스템 이해

본 프로젝트의 `About.tsx` 컴포넌트에서 Material-UI 사용법을 분석해보겠습니다:

```typescript
// src/components/sections/About.tsx
import {
  Box,           // ← div와 비슷하지만 더 강력한 레이아웃 컴포넌트
  Container,     // ← 최대 너비가 제한된 중앙 정렬 컨테이너
  Typography,    // ← 텍스트 표시를 위한 컴포넌트
  Grid,          // ← 반응형 그리드 시스템
  Card,          // ← 카드 형태의 컨테이너
  alpha,         // ← 색상에 투명도를 적용하는 유틸리티
  useTheme,      // ← 현재 테마를 가져오는 Hook
} from '@mui/material'

export default function About() {
  const theme = useTheme()  // ← 현재 테마 정보 가져오기

  return (
    <Box
      sx={{
        pt: 12,           // ← padding-top: 12 * 8px = 96px
        pb: 6,            // ← padding-bottom: 6 * 8px = 48px
        // 반응형 배경색: 테마에 따라 자동 변경
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
      }}
    >
      <Container maxWidth="lg">  {/* ← 최대 너비 1200px로 제한 */}
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={4}>  {/* ← 모바일: 12/12, 데스크톱: 4/12 */}
            <Avatar
              sx={{
                width: 200,
                height: 200,
                mx: 'auto',   // ← margin 0 auto (가운데 정렬)
                fontSize: '4rem',
                bgcolor: 'primary.main',  // ← 테마의 주요 색상 사용
              }}
            >
              JD
            </Avatar>
          </Grid>
          <Grid item xs={12} md={8}>
            <Typography 
              variant="h2"           // ← 미리 정의된 타이포그래피 스타일
              gutterBottom           // ← 하단 마진 자동 추가
              fontWeight="bold"
            >
              About Me
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}
```

**Material-UI의 핵심 개념:**

1. **sx prop**: JavaScript 객체로 스타일 정의
2. **Theme 시스템**: 일관된 색상, 타이포그래피, 간격 관리
3. **반응형 값**: `{ xs: 12, md: 4 }` 형태로 화면 크기별 다른 값 적용
4. **미리 정의된 컴포넌트**: Button, Card, Typography 등

### 6.3 Tailwind CSS 활용

본 프로젝트의 `globals.css`에서 Tailwind CSS 사용법:

```css
/* src/app/globals.css */
@tailwind base;      /* ← 기본 스타일 리셋 */
@tailwind components; /* ← 컴포넌트 클래스들 */
@tailwind utilities; /* ← 유틸리티 클래스들 */

/* 커스텀 유틸리티 클래스 정의 */
.text-gradient {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.glass {
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 16px;
}
```

**Tailwind CSS의 특징:**

1. **유틸리티 우선**: `p-4`, `text-center` 같은 단일 목적 클래스
2. **반응형**: `sm:text-lg`, `md:p-8` 등 접두사로 브레이크포인트 지정
3. **커스터마이징**: 필요시 전통적 CSS와 혼용 가능

---

## 7. 정적 페이지와 메타데이터

### 7.1 정적 페이지 생성의 개념

**정적 페이지 생성(Static Site Generation, SSG)**은 빌드 시점에 HTML을 미리 생성하는 방식입니다.

**장점:**
1. **빠른 로딩 속도**: 이미 생성된 HTML을 바로 전송
2. **SEO 친화적**: 검색 엔진이 내용을 쉽게 읽을 수 있음
3. **CDN 활용 가능**: 정적 파일이므로 전 세계에 캐시 가능

### 7.2 메타데이터 설정

본 프로젝트의 메타데이터 설정을 분석해보겠습니다:

**루트 레이아웃의 메타데이터:**
```typescript
// src/app/layout.tsx
export const metadata = {
  title: 'John Doe - Frontend Developer',     // ← 브라우저 탭에 표시되는 제목
  description: '프론트엔드 개발자 John Doe의 포트폴리오',  // ← 검색 결과에 나타나는 설명
  keywords: ['프론트엔드', '개발자', 'React', 'Next.js'], // ← 검색 키워드
  authors: [{ name: 'John Doe' }],            // ← 작성자 정보
  viewport: 'width=device-width, initial-scale=1', // ← 모바일 반응형을 위한 설정
}
```

**개별 페이지의 메타데이터 (예시):**
```typescript
// src/app/about/page.tsx
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About - John Doe Portfolio',
  description: '프론트엔드 개발자 John Doe의 상세한 소개와 경력사항',
  openGraph: {  // ← 소셜 미디어 공유시 표시될 정보
    title: 'About John Doe',
    description: '4년차 프론트엔드 개발자의 경력과 기술 스택',
    type: 'website',
  }
}
```

### 7.3 SEO 최적화 기법

본 프로젝트에서 적용된 SEO 최적화 기법들:

1. **시맨틱 HTML**: `<main>`, `<section>`, `<article>` 등 의미있는 태그 사용
2. **alt 속성**: 모든 이미지에 설명 텍스트 제공
3. **구조화된 데이터**: JSON-LD 형식으로 검색 엔진에 추가 정보 제공

---

## 8. 이미지 최적화

### 8.1 next/image 컴포넌트의 중요성

기존 HTML의 `<img>` 태그 대신 Next.js의 `Image` 컴포넌트를 사용하면 자동으로 최적화됩니다.

**기존 방식의 문제점:**
```html
<img src="/large-image.jpg" alt="큰 이미지" />
<!-- 문제점:
1. 원본 크기 그대로 로드 (불필요한 대역폭 사용)
2. 레이아웃 시프트 발생 (이미지 로드 전후 레이아웃 변경)
3. 모든 이미지가 한번에 로드 (페이지 로딩 지연)
-->
```

**Next.js Image 컴포넌트의 최적화:**
```typescript
import Image from 'next/image'

<Image
  src="/large-image.jpg"
  alt="최적화된 이미지"
  width={800}
  height={600}
  priority  // ← 중요한 이미지는 우선 로딩
  placeholder="blur"  // ← 로딩 중 블러 효과
  sizes="(max-width: 768px) 100vw, 50vw"  // ← 반응형 이미지 크기
/>
```

### 8.2 본 프로젝트의 이미지 사용 패턴

본 프로젝트에서는 주로 Avatar 컴포넌트를 사용하여 프로필 이미지를 표시합니다:

```typescript
// src/components/sections/Hero.tsx
<Avatar
  sx={{
    width: { xs: 250, md: 300 },    // ← 반응형 크기
    height: { xs: 250, md: 300 },
    fontSize: '4rem',               // ← 이니셜 텍스트 크기
    bgcolor: 'primary.main',        // ← 배경색
    color: 'white',
  }}
>
  JD  {/* ← 실제 이미지가 없을 때 이니셜 표시 */}
</Avatar>
```

실제 이미지를 사용할 경우:
```typescript
// 실제 프로젝트에서는 이렇게 사용
<Image
  src="/images/profile.jpg"
  alt="John Doe 프로필 사진"
  width={300}
  height={300}
  style={{ borderRadius: '50%', objectFit: 'cover' }}
  priority  // ← 첫 화면에 보이는 중요한 이미지
/>
```

---

## 9. 반응형 디자인

### 9.1 반응형 디자인의 개념

**반응형 디자인(Responsive Design)**은 다양한 화면 크기에서 최적화된 사용자 경험을 제공하는 디자인 방식입니다.

**브레이크포인트 개념:**
- **xs (0px~599px)**: 스마트폰
- **sm (600px~899px)**: 작은 태블릿
- **md (900px~1199px)**: 태블릿, 작은 노트북
- **lg (1200px~1535px)**: 데스크톱
- **xl (1536px+)**: 대형 모니터

### 9.2 Material-UI 반응형 시스템

본 프로젝트의 `Hero.tsx`에서 반응형 구현을 분석해보겠습니다:

```typescript
// src/components/sections/Hero.tsx
<Box
  sx={{
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    // 반응형 패딩: 모바일에서는 작게, 데스크톱에서는 크게
    py: { xs: 4, md: 8 },
    // 반응형 배경: 복잡한 그라데이션은 큰 화면에서만
    background: {
      xs: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      md: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`
    }
  }}
>
  <Container maxWidth="lg">
    <Grid container spacing={6} alignItems="center">
      {/* 텍스트 영역: 모바일에서는 전체 너비, 데스크톱에서는 7/12 */}
      <Grid item xs={12} md={7}>
        <Typography
          variant="h1"
          sx={{
            fontWeight: 'bold',
            // 반응형 폰트 크기
            fontSize: { xs: '2.5rem', md: '3.5rem' },
            // 반응형 정렬
            textAlign: { xs: 'center', md: 'left' },
          }}
        >
          John Doe
        </Typography>
      </Grid>
      
      {/* 이미지 영역: 모바일에서는 전체 너비, 데스크톱에서는 5/12 */}
      <Grid item xs={12} md={5}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            // 반응형 순서: 모바일에서는 이미지가 먼저
            order: { xs: -1, md: 0 }
          }}
        >
          <Avatar
            sx={{
              // 반응형 크기
              width: { xs: 180, sm: 220, md: 280 },
              height: { xs: 180, sm: 220, md: 280 },
              fontSize: { xs: '3rem', md: '4rem' },
            }}
          >
            JD
          </Avatar>
        </Box>
      </Grid>
    </Grid>
  </Container>
</Box>
```

### 9.3 Grid 시스템 이해

Material-UI의 Grid 시스템은 12칼럼 기반입니다:

```typescript
<Grid container spacing={4}>
  {/* 모바일: 전체 너비(12/12), 태블릿: 반(6/12), 데스크톱: 1/3(4/12) */}
  <Grid item xs={12} sm={6} md={4}>
    <Card>첫 번째 카드</Card>
  </Grid>
  <Grid item xs={12} sm={6} md={4}>
    <Card>두 번째 카드</Card>
  </Grid>
  <Grid item xs={12} sm={12} md={4}>
    <Card>세 번째 카드</Card>
  </Grid>
</Grid>
```

**결과:**
- **모바일**: 세로로 3개 카드가 쌓임
- **태블릿**: 2개씩 2줄로 배치 (마지막 하나는 전체 너비)
- **데스크톱**: 가로로 3개 카드가 나란히 배치

---

## 10. 다크모드 구현

### 10.1 다크모드의 필요성

**다크모드**는 어두운 배경에 밝은 텍스트를 사용하는 UI 테마입니다.

**장점:**
1. **눈의 피로 감소**: 어두운 환경에서 화면의 밝기 부담 감소
2. **배터리 절약**: OLED 화면에서 검은 픽셀은 전력을 소모하지 않음
3. **접근성 향상**: 시각적 민감도가 있는 사용자에게 도움
4. **현대적 디자인**: 최신 애플리케이션의 표준 기능

### 10.2 테마 시스템 구조

본 프로젝트의 다크모드는 **React Context**를 사용하여 구현됩니다.

**전체 구조:**
```
ThemeContext (상태 관리)
    ↓
Material-UI ThemeProvider (테마 적용)
    ↓
모든 컴포넌트 (테마 사용)
```

### 10.3 테마 컨텍스트 구현

본 프로젝트의 `ThemeContext.tsx` 분석:

```typescript
// src/contexts/ThemeContext.tsx
'use client'  // ← 클라이언트에서만 실행

import { createContext, useContext, useState, useEffect } from 'react'
import { ThemeProvider } from '@mui/material/styles'
import { lightTheme, darkTheme } from '@/theme/theme'

// 1. Context 타입 정의
interface ThemeContextType {
  mode: 'light' | 'dark'    // ← 현재 테마 모드
  toggleTheme: () => void   // ← 테마 전환 함수
}

// 2. Context 생성 (기본값 설정)
const ThemeContext = createContext<ThemeContextType>({
  mode: 'light',
  toggleTheme: () => {}
})

// 3. Context 사용을 위한 커스텀 Hook
export const useAppTheme = () => {
  return useContext(ThemeContext)
}

// 4. Provider 컴포넌트
export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<'light' | 'dark'>('light')
  const [mounted, setMounted] = useState(false)

  // 컴포넌트 마운트 시 저장된 테마 불러오기
  useEffect(() => {
    setMounted(true)
    
    // 로컬 스토리지에서 저장된 테마 확인
    const savedTheme = localStorage.getItem('portfolio-theme')
    
    if (savedTheme) {
      setMode(savedTheme as 'light' | 'dark')
    } else {
      // 저장된 테마가 없으면 시스템 설정 확인
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setMode(prefersDark ? 'dark' : 'light')
    }
  }, [])

  // 테마 전환 함수
  const toggleTheme = () => {
    const newMode = mode === 'light' ? 'dark' : 'light'
    setMode(newMode)
    localStorage.setItem('portfolio-theme', newMode)  // ← 선택한 테마 저장
  }

  // 마운트 전에는 기본 테마 사용 (깜빡임 방지)
  if (!mounted) {
    return (
      <ThemeProvider theme={lightTheme}>
        {children}
      </ThemeProvider>
    )
  }

  const currentTheme = mode === 'dark' ? darkTheme : lightTheme

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <ThemeProvider theme={currentTheme}>
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  )
}
```

### 10.4 테마 정의

본 프로젝트의 `theme.ts`에서 라이트/다크 테마 정의:

```typescript
// src/theme/theme.ts
import { createTheme } from '@mui/material/styles'

// 공통 테마 설정 (라이트/다크 모두 적용)
const commonTheme = {
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700, fontSize: '3.5rem' },
    h2: { fontWeight: 600, fontSize: '2.75rem' },
  },
  shape: { borderRadius: 12 },  // ← 모든 컴포넌트의 기본 둥근 모서리
}

// 라이트 테마
export const lightTheme = createTheme({
  ...commonTheme,
  palette: {
    mode: 'light',
    primary: { main: '#2563eb' },      // ← 파란색
    secondary: { main: '#7c3aed' },    // ← 보라색
    background: {
      default: '#ffffff',             // ← 페이지 배경
      paper: '#f8fafc',              // ← 카드, 모달 배경
    },
    text: {
      primary: '#1e293b',            // ← 주요 텍스트
      secondary: '#64748b',          // ← 보조 텍스트
    },
  },
})

// 다크 테마
export const darkTheme = createTheme({
  ...commonTheme,
  palette: {
    mode: 'dark',
    primary: { main: '#60a5fa' },      // ← 밝은 파란색
    secondary: { main: '#a78bfa' },    // ← 밝은 보라색
    background: {
      default: '#0f172a',             // ← 어두운 배경
      paper: '#1e293b',              // ← 어두운 카드 배경
    },
    text: {
      primary: '#f1f5f9',            // ← 밝은 텍스트
      secondary: '#cbd5e1',          // ← 보조 밝은 텍스트
    },
  },
})
```

### 10.5 테마 토글 버튼

사용자가 테마를 전환할 수 있는 버튼 구현:

```typescript
// src/components/ui/ThemeToggle.tsx
import { IconButton, Tooltip } from '@mui/material'
import { Brightness4, Brightness7 } from '@mui/icons-material'
import { useAppTheme } from '@/contexts/ThemeContext'

export default function ThemeToggle() {
  const { mode, toggleTheme } = useAppTheme()  // ← Context에서 상태와 함수 가져오기

  return (
    <Tooltip title={`${mode === 'light' ? '다크' : '라이트'} 모드로 전환`}>
      <IconButton
        onClick={toggleTheme}  // ← 클릭시 테마 전환
        sx={{
          color: 'text.primary',  // ← 테마에 따라 자동으로 색상 변경
          '&:hover': { bgcolor: 'action.hover' },
        }}
        aria-label="테마 전환"
      >
        {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
        {/* ← 현재 모드에 따라 다른 아이콘 표시 */}
      </IconButton>
    </Tooltip>
  )
}
```

**테마 전환 과정:**
1. 사용자가 토글 버튼 클릭
2. `toggleTheme()` 함수 실행
3. 새로운 테마 모드 설정
4. localStorage에 선택 사항 저장
5. 모든 컴포넌트에 새 테마 적용
6. CSS 변수와 색상이 자동으로 업데이트

---

## 마무리

이 프로젝트를 통해 다음과 같은 핵심 개념들을 학습했습니다:

### 주요 학습 성과

1. **Next.js 생태계 이해**: App Router, 파일 기반 라우팅, 메타데이터 설정
2. **React 기초 완전 습득**: 함수형 컴포넌트, Hooks, JSX 문법
3. **현대적 스타일링**: Material-UI 시스템과 Tailwind CSS 활용
4. **상태 관리**: Context API를 통한 전역 상태 관리
5. **사용자 경험**: 반응형 디자인과 다크모드로 접근성 향상

### 다음 프로젝트를 위한 준비

이제 다음 단계의 프로젝트들을 진행할 준비가 되었습니다:
- 서버 사이드 렌더링 (SSR)
- API 라우트와 백엔드 통신
- 데이터베이스 연동
- 사용자 인증 시스템
- 상태 관리 라이브러리 (Zustand, Redux)

이 교육 자료가 React와 Next.js 학습에 도움이 되기를 바랍니다.