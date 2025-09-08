# 📚 Project02: Modern Business Landing - React & Next.js 교육 가이드

> **React와 Next.js 경험이 없는 개발자를 위한 완전한 학습 프로젝트**

이 프로젝트는 현대적인 기업 랜딩 페이지를 만들면서 React와 Next.js의 핵심 개념들을 단계적으로 학습할 수 있도록 설계되었습니다.

---

## 🎯 학습 목표

1. **레이아웃과 중첩 라우팅** - 웹 애플리케이션의 구조적 설계
2. **Server Components vs Client Components** - Next.js의 핵심 개념
3. **컴포넌트 재사용과 Props** - React의 기본 철학

## 🛠️ 구현 기술

- 공통 레이아웃 (layout.tsx)
- Server Components (기본)
- Client Components ("use client")
- Props와 Children 패턴
- 애니메이션 라이브러리 (Framer Motion)
- 폼 처리 (Contact Form)
- 환경 변수 설정
- Google Analytics 연동

---

## 📖 Chapter 1: React 기본 개념 이해

### 1.1 React란 무엇인가?

**React**는 Facebook(현 Meta)에서 개발한 사용자 인터페이스를 만들기 위한 JavaScript 라이브러리입니다.

#### 🔑 React의 핵심 개념

1. **컴포넌트 기반 아키텍처**
   - UI를 독립적이고 재사용 가능한 조각들로 나누어 개발
   - 각 컴포넌트는 자체적인 로직과 렌더링을 담당

2. **선언형 프로그래밍**
   - 원하는 결과를 선언하면 React가 알아서 DOM을 업데이트
   - 명령형 프로그래밍과 달리 "어떻게"보다는 "무엇을" 중심으로 생각

3. **가상 DOM (Virtual DOM)**
   - 메모리에 가상의 DOM을 만들어 효율적으로 실제 DOM을 업데이트
   - 성능 최적화의 핵심 메커니즘

#### 📝 프로젝트 예시로 이해하기

우리 프로젝트의 `src/components/common/Header.tsx`를 보면:

```typescript
// src/components/common/Header.tsx
'use client'
import { useState } from 'react'
// ... 다른 imports

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false)  // 상태 관리
  
  // 컴포넌트 렌더링 (선언형)
  return (
    <AppBar position="sticky">
      <Toolbar>
        <Typography variant="h6">Modern Business</Typography>
        {/* 조건부 렌더링 */}
        {!isMobile ? (
          <DesktopMenu />
        ) : (
          <MobileMenu />
        )}
      </Toolbar>
    </AppBar>
  )
}
```

**여기서 배우는 것:**
- `useState`: React의 상태 관리 Hook
- 조건부 렌더링: `{condition ? A : B}` 패턴
- 컴포넌트 분리: 복잡한 UI를 작은 단위로 나누기

### 1.2 JSX 문법 이해

**JSX**는 JavaScript 안에서 HTML과 유사한 문법을 사용할 수 있게 해주는 문법 확장입니다.

#### 📝 프로젝트 예시

```typescript
// src/components/sections/HeroSection.tsx
return (
  <Box sx={{ minHeight: '100vh' }}>
    <Container maxWidth="lg">
      <Typography variant="h1" component="h1">
        혁신적인 비즈니스 솔루션
      </Typography>
      <Button variant="contained" onClick={handleClick}>
        시작하기
      </Button>
    </Container>
  </Box>
)
```

**JSX 규칙:**
- 최상위에는 하나의 요소만 (Fragment `<>` 사용 가능)
- 모든 태그는 닫혀야 함 (`<br />`, `<img />`)
- JavaScript 표현식은 `{}` 안에 작성
- CSS 클래스는 `className`, 인라인 스타일은 객체 형태

---

## 📖 Chapter 2: Next.js와 App Router

### 2.1 Next.js란?

**Next.js**는 React 기반의 프레임워크로, 서버사이드 렌더링(SSR), 정적 사이트 생성(SSG), API 라우팅 등의 기능을 제공합니다.

#### 🔑 Next.js의 주요 특징

1. **파일 기반 라우팅**: 폴더 구조가 URL 구조가 됨
2. **자동 코드 분할**: 페이지별로 JavaScript 번들을 자동으로 분리
3. **이미지 최적화**: `next/image`로 자동 이미지 최적화
4. **API 라우팅**: 백엔드 API를 같은 프로젝트 내에서 구현 가능

### 2.2 App Router vs Pages Router

Next.js 13부터 도입된 **App Router**는 기존 Pages Router의 진화된 형태입니다.

#### 📁 프로젝트 구조 분석

```
src/app/                 # App Router의 루트
├── layout.tsx          # 전역 레이아웃 (모든 페이지에 적용)
├── page.tsx           # 홈페이지 (/ 경로)
├── about/             # /about 경로
│   └── page.tsx       # About 페이지 컴포넌트
├── services/          # /services 경로  
│   └── page.tsx       # Services 페이지 컴포넌트
├── contact/           # /contact 경로
│   └── page.tsx       # Contact 페이지 컴포넌트
└── api/               # API 라우트
    └── contact/
        └── route.ts   # POST /api/contact
```

### 2.3 레이아웃과 중첩 라우팅 심화

#### 🎨 전역 레이아웃 (`app/layout.tsx`)

```typescript
// src/app/layout.tsx
export default function RootLayout({
  children,  // 각 페이지의 내용이 여기에 삽입됨
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body>
        {/* Google Analytics 스크립트 */}
        <GoogleAnalytics GA_MEASUREMENT_ID={process.env.NEXT_PUBLIC_GA_ID} />
        
        {/* Material-UI 테마 프로바이더 */}
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}  {/* 여기에 각 페이지가 렌더링됨 */}
        </ThemeProvider>
      </body>
    </html>
  )
}
```

**핵심 개념:**
- `children` props: 자식 컴포넌트를 받아서 렌더링하는 패턴
- 전역 설정: 모든 페이지에서 공통으로 사용할 설정들
- Provider 패턴: 하위 컴포넌트들에게 데이터나 기능을 제공

#### 🔄 중첩 라우팅 실습

우리 프로젝트를 확장해서 중첩 라우팅을 만들어보면:

```
src/app/
├── services/
│   ├── layout.tsx          # 서비스 공통 레이아웃
│   ├── page.tsx           # /services (서비스 목록)
│   ├── web-development/   
│   │   └── page.tsx       # /services/web-development
│   └── consulting/
│       └── page.tsx       # /services/consulting
```

**실습 과제:**
1. `src/app/services/web-development/page.tsx` 파일 생성
2. 서비스 상세 페이지 구현
3. 네비게이션 링크 연결

---

## 📖 Chapter 3: Server vs Client Components

### 3.1 Server Components란?

**Server Components**는 Next.js 13+의 App Router에서 도입된 개념으로, 서버에서 렌더링되는 컴포넌트입니다.

#### 🔑 Server Components의 특징

1. **서버에서 실행**: JavaScript가 클라이언트로 전송되지 않음
2. **더 빠른 초기 로딩**: HTML이 서버에서 생성되어 전송
3. **SEO 친화적**: 검색엔진이 완성된 HTML을 크롤링 가능
4. **제한사항**: 브라우저 API, 이벤트 핸들러, useState 등 사용 불가

#### 📝 프로젝트 예시: Server Component

```typescript
// src/app/page.tsx (Server Component - 기본값)
import Header from '@/components/common/Header'
import HeroSection from '@/components/sections/HeroSection'
// ... 다른 imports

export default function HomePage() {
  // 여기서는 useState, useEffect 등 사용 불가
  // console.log는 서버 콘솔에 출력됨
  
  return (
    <Box component="main">
      <Header />
      <HeroSection />
      {/* 다른 섹션들 */}
    </Box>
  )
}
```

### 3.2 Client Components란?

**Client Components**는 브라우저에서 실행되는 컴포넌트로, React의 모든 기능을 사용할 수 있습니다.

#### 🔑 Client Components의 특징

1. **브라우저에서 실행**: JavaScript 번들에 포함
2. **상호작용 가능**: 이벤트 핸들러, 상태 관리 가능
3. **React Hooks 사용 가능**: useState, useEffect 등
4. **'use client' 지시문 필요**: 파일 최상단에 명시

#### 📝 프로젝트 예시: Client Component

```typescript
// src/components/common/Header.tsx (Client Component)
'use client'  // ← 이 지시문이 핵심!
import { useState } from 'react'  // Hook 사용 가능

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false)  // 상태 관리
  
  const handleDrawerToggle = () => {  // 이벤트 핸들러
    setMobileOpen(!mobileOpen)
  }
  
  return (
    <AppBar>
      <IconButton onClick={handleDrawerToggle}>  {/* 이벤트 처리 */}
        <MenuIcon />
      </IconButton>
      {/* 나머지 UI */}
    </AppBar>
  )
}
```

### 3.3 언제 어떤 컴포넌트를 사용할까?

#### ✅ Server Components 사용 시기

- 데이터 페칭이 필요한 경우
- SEO가 중요한 페이지
- 정적 콘텐츠 표시
- 초기 로딩 속도가 중요한 경우

#### ✅ Client Components 사용 시기

- 사용자 상호작용이 필요한 경우 (버튼 클릭, 폼 입력)
- 브라우저 API 사용이 필요한 경우 (localStorage, geolocation)
- React Hooks 사용이 필요한 경우
- 실시간 업데이트가 필요한 경우

#### 📊 프로젝트 내 컴포넌트 분류

| 컴포넌트 | 타입 | 이유 |
|----------|------|------|
| `app/page.tsx` | Server | 정적 페이지 구조, SEO 중요 |
| `app/about/page.tsx` | Server | 정적 콘텐츠 |
| `Header.tsx` | Client | 모바일 메뉴 토글 상태 관리 |
| `HeroSection.tsx` | Client | Framer Motion 애니메이션 |
| `ContactForm.tsx` | Client | 폼 상태 관리, 사용자 입력 |

---

## 📖 Chapter 4: 컴포넌트 재사용과 Props

### 4.1 Props란?

**Props**(Properties의 줄임말)는 React 컴포넌트에 데이터를 전달하는 방법입니다. 함수의 매개변수와 비슷한 개념입니다.

#### 🔑 Props의 특징

1. **읽기 전용**: 컴포넌트 내부에서 props를 수정할 수 없음
2. **단방향 데이터 흐름**: 부모에서 자식으로만 데이터 전달
3. **타입 안정성**: TypeScript로 props의 타입을 정의 가능

### 4.2 TypeScript로 Props 타입 정의

#### 📝 프로젝트 예시: ContactForm Props

```typescript
// src/components/forms/ContactForm.tsx
interface ContactFormData {  // Props의 타입 정의
  name: string
  email: string
  company: string
  phone: string
  message: string
}

// React Hook Form의 useForm에서 타입 사용
const {
  control,
  handleSubmit,
  formState: { errors },
} = useForm<ContactFormData>({  // ← 제네릭으로 타입 지정
  resolver: yupResolver(schema),
  defaultValues: {
    name: '',
    email: '',
    company: '',
    phone: '',
    message: '',
  },
})
```

#### 📝 프로젝트 예시: GoogleAnalytics Props

```typescript
// src/components/common/GoogleAnalytics.tsx
interface GoogleAnalyticsProps {
  GA_MEASUREMENT_ID: string  // 필수 prop
}

const GoogleAnalytics = ({ GA_MEASUREMENT_ID }: GoogleAnalyticsProps) => {
  return (
    <Script
      src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
    />
  )
}

// 사용할 때:
<GoogleAnalytics GA_MEASUREMENT_ID={process.env.NEXT_PUBLIC_GA_ID} />
```

### 4.3 Children 패턴 이해

**Children 패턴**은 컴포넌트가 자식 요소들을 받아서 렌더링하는 패턴입니다.

#### 📝 프로젝트 예시: Layout의 Children

```typescript
// src/app/layout.tsx
export default function RootLayout({
  children,  // ← children prop
}: {
  children: React.ReactNode  // ← 타입 정의
}) {
  return (
    <html lang="ko">
      <body>
        <ThemeProvider theme={theme}>
          {children}  {/* ← 여기에 페이지 내용이 삽입됨 */}
        </ThemeProvider>
      </body>
    </html>
  )
}
```

**동작 원리:**
1. `app/page.tsx`가 렌더링될 때
2. 해당 페이지의 내용이 `children`으로 전달됨
3. Layout이 `children`을 감싸서 완성된 HTML 생성

### 4.4 컴포넌트 재사용성 높이기

#### 📝 프로젝트 예시: 재사용 가능한 Card 컴포넌트

우리 프로젝트의 서비스 카드를 재사용 가능하게 만들면:

```typescript
// 재사용 가능한 ServiceCard 컴포넌트 (예시)
interface ServiceCardProps {
  title: string
  description: string
  icon: React.ReactNode
  features: string[]
  onButtonClick?: () => void  // 선택적 prop (?)
}

const ServiceCard = ({ 
  title, 
  description, 
  icon, 
  features,
  onButtonClick 
}: ServiceCardProps) => {
  return (
    <Card>
      <CardContent>
        {icon}
        <Typography variant="h5">{title}</Typography>
        <Typography>{description}</Typography>
        {features.map((feature, index) => (
          <Typography key={index}>✓ {feature}</Typography>
        ))}
      </CardContent>
      <CardActions>
        <Button onClick={onButtonClick}>자세히 보기</Button>
      </CardActions>
    </Card>
  )
}

// 사용 방법:
<ServiceCard
  title="웹 개발"
  description="현대적인 웹사이트 개발"
  icon={<CodeIcon />}
  features={['반응형 디자인', 'SEO 최적화']}
  onButtonClick={() => router.push('/services/web-development')}
/>
```

### 4.5 Props 전달 패턴들

#### 1. 구조 분해 할당 (Destructuring)

```typescript
// ❌ 비효율적
const Header = (props) => {
  return <h1>{props.title}</h1>
}

// ✅ 효율적
const Header = ({ title, subtitle }) => {
  return (
    <div>
      <h1>{title}</h1>
      <h2>{subtitle}</h2>
    </div>
  )
}
```

#### 2. 기본값 설정

```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary'  // 선택적 prop
  children: React.ReactNode
}

const Button = ({ 
  variant = 'primary',  // ← 기본값 설정
  children 
}: ButtonProps) => {
  return (
    <button className={`btn btn-${variant}`}>
      {children}
    </button>
  )
}
```

---

## 📖 Chapter 5: 애니메이션 라이브러리 (Framer Motion)

### 5.1 왜 애니메이션이 필요한가?

현대 웹 개발에서 애니메이션은 단순한 장식이 아닙니다:

1. **사용자 경험 개선**: 자연스러운 인터랙션 제공
2. **주의 집중**: 중요한 요소에 시선 유도
3. **브랜드 차별화**: 독특한 개성 표현
4. **피드백 제공**: 사용자 행동에 대한 시각적 반응

### 5.2 Framer Motion 기본 개념

**Framer Motion**은 React를 위한 production-ready 애니메이션 라이브러리입니다.

#### 🔑 핵심 개념들

1. **motion 컴포넌트**: HTML 태그를 애니메이션 가능한 컴포넌트로 변환
2. **animate props**: 애니메이션 대상 상태 정의
3. **transition**: 애니메이션 방식과 속도 제어
4. **variants**: 복잡한 애니메이션 시퀀스 관리

### 5.3 프로젝트 내 애니메이션 분석

#### 📝 HeroSection의 Fade In Up 애니메이션

```typescript
// src/components/sections/HeroSection.tsx
'use client'
import { motion } from 'framer-motion'

const HeroSection = () => {
  // 애니메이션 설정 객체
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },      // 시작 상태
    animate: { opacity: 1, y: 0 },       // 끝 상태
    transition: { duration: 0.8, ease: "easeOut" }  // 전환 방식
  }

  return (
    <Box>
      {/* motion.div로 감싸서 애니메이션 적용 */}
      <motion.div {...fadeInUp}>
        <Typography variant="h1">
          혁신적인 비즈니스 솔루션
        </Typography>
      </motion.div>
      
      {/* 다른 요소들은 지연시켜서 애니메이션 */}
      <motion.div 
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}  // ← 0.2초 지연
      >
        <Typography variant="h5">
          현대적이고 효율적인 솔루션으로...
        </Typography>
      </motion.div>
    </Box>
  )
}
```

**애니메이션 분석:**
- `initial`: 컴포넌트가 처음 나타날 때의 상태
- `animate`: 애니메이션이 완료된 후의 상태
- `y: 60`: Y축으로 60px 아래에서 시작
- `opacity: 0`: 완전히 투명한 상태에서 시작
- `duration: 0.8`: 0.8초 동안 애니메이션 실행
- `delay: 0.2`: 0.2초 후에 애니메이션 시작

#### 📝 스크롤 기반 애니메이션

```typescript
// src/components/sections/ServicesSection.tsx
<motion.div
  initial={{ opacity: 0, y: 50 }}
  whileInView={{ opacity: 1, y: 0 }}      // ← 화면에 보일 때 애니메이션
  transition={{ duration: 0.6, delay: index * 0.1 }}  // ← 순차적 등장
  viewport={{ once: true }}                // ← 한 번만 실행
>
  <Card>
    {/* 서비스 카드 내용 */}
  </Card>
</motion.div>
```

**스크롤 애니메이션 분석:**
- `whileInView`: 요소가 뷰포트에 보이는 동안의 상태
- `viewport={{ once: true }}`: 한 번만 애니메이션 실행 (성능 최적화)
- `delay: index * 0.1`: 각 카드마다 0.1초씩 지연 (순차적 등장)

#### 📝 호버 애니메이션

```typescript
// 카드에 마우스를 올렸을 때 위로 살짝 올라가는 효과
<motion.div
  whileHover={{ y: -10 }}  // ← 호버 시 10px 위로
>
  <Card>
    {/* 카드 내용 */}
  </Card>
</motion.div>
```

### 5.4 애니메이션 성능 최적화

#### 🚀 최적화 팁들

1. **GPU 가속 속성 사용**: `transform`, `opacity` 우선 사용
2. **will-change 속성**: 브라우저에게 변경될 속성 미리 알려주기
3. **once: true**: 스크롤 애니메이션은 한 번만 실행
4. **적절한 duration**: 너무 길거나 짧지 않게 (0.3~0.8초 권장)

#### 📝 성능 최적화된 애니메이션

```typescript
// 좋은 예: GPU 가속 속성 사용
<motion.div
  initial={{ opacity: 0, scale: 0.8, y: 20 }}
  animate={{ opacity: 1, scale: 1, y: 0 }}
  transition={{ 
    duration: 0.5,
    ease: "easeOut"
  }}
>

// 피해야 할 예: 레이아웃을 변경하는 속성
<motion.div
  initial={{ width: 0, height: 0 }}  // ← 성능에 좋지 않음
  animate={{ width: 200, height: 200 }}
>
```

---

## 📖 Chapter 6: 폼 처리와 상태 관리

### 6.1 React에서 폼 다루기

웹 애플리케이션에서 폼은 사용자와의 주요 접점입니다. React에서 폼을 다루는 방법은 크게 두 가지입니다:

1. **제어 컴포넌트 (Controlled Components)**: React가 폼 상태를 관리
2. **비제어 컴포넌트 (Uncontrolled Components)**: DOM이 폼 상태를 관리

### 6.2 React Hook Form 선택 이유

우리 프로젝트에서는 **React Hook Form**을 사용합니다:

#### ✅ 장점들
- 성능이 우수 (불필요한 리렌더링 최소화)
- 코드가 간결함
- TypeScript 완벽 지원
- 유효성 검사 라이브러리와 쉬운 통합

#### 📝 프로젝트 예시: ContactForm 분석

```typescript
// src/components/forms/ContactForm.tsx
'use client'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

// 1. 폼 데이터 타입 정의
interface ContactFormData {
  name: string
  email: string
  company: string
  phone: string
  message: string
}

// 2. 유효성 검사 스키마 정의
const schema = yup.object({
  name: yup.string()
    .required('이름을 입력해주세요')
    .min(2, '이름은 2자 이상이어야 합니다'),
  email: yup.string()
    .email('올바른 이메일을 입력해주세요')
    .required('이메일을 입력해주세요'),
  message: yup.string()
    .required('문의내용을 입력해주세요')
    .min(10, '문의내용은 10자 이상이어야 합니다'),
})

const ContactForm = () => {
  // 3. React Hook Form 초기화
  const {
    control,      // 폼 컨트롤
    handleSubmit, // 제출 핸들러
    reset,        // 폼 리셋 함수
    formState: { errors }, // 에러 상태
  } = useForm<ContactFormData>({
    resolver: yupResolver(schema),  // Yup 스키마 연결
    defaultValues: {
      name: '',
      email: '',
      company: '',
      phone: '',
      message: '',
    },
  })

  // 4. 제출 처리 함수
  const onSubmit = async (data: ContactFormData) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      
      if (response.ok) {
        reset() // 성공 시 폼 초기화
        // 성공 메시지 표시
      }
    } catch (error) {
      // 에러 처리
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      {/* 5. Controller로 입력 필드 제어 */}
      <Controller
        name="name"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            fullWidth
            label="이름 *"
            error={!!errors.name}
            helperText={errors.name?.message}
          />
        )}
      />
      
      <Button type="submit">문의 보내기</Button>
    </Box>
  )
}
```

### 6.3 코드 단계별 분석

#### 1단계: 타입 정의

```typescript
interface ContactFormData {
  name: string
  email: string
  company: string
  phone: string
  message: string
}
```
**목적**: TypeScript로 폼 데이터 구조를 명확히 정의하여 타입 안정성 확보

#### 2단계: 유효성 검사 스키마

```typescript
const schema = yup.object({
  name: yup.string().required('이름을 입력해주세요').min(2, '이름은 2자 이상이어야 합니다'),
  email: yup.string().email('올바른 이메일을 입력해주세요').required('이메일을 입력해주세요'),
})
```
**목적**: 사용자 입력의 유효성을 검사하는 규칙 정의

#### 3단계: useForm Hook 사용

```typescript
const { control, handleSubmit, reset, formState: { errors } } = useForm<ContactFormData>({
  resolver: yupResolver(schema),
  defaultValues: { name: '', email: '', /* ... */ },
})
```
**목적**: 폼 상태 관리와 유효성 검사 연결

#### 4단계: Controller로 필드 제어

```typescript
<Controller
  name="name"
  control={control}
  render={({ field }) => (
    <TextField {...field} error={!!errors.name} helperText={errors.name?.message} />
  )}
/>
```
**목적**: Material-UI TextField와 React Hook Form 연결

### 6.4 상태 관리 패턴

#### 📝 로딩 상태 관리

```typescript
const [isSubmitting, setIsSubmitting] = useState(false)
const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null)

const onSubmit = async (data: ContactFormData) => {
  setIsSubmitting(true)    // 로딩 시작
  setSubmitStatus(null)    // 이전 상태 초기화
  
  try {
    // API 호출
    setSubmitStatus('success')  // 성공 상태
  } catch (error) {
    setSubmitStatus('error')    // 에러 상태
  } finally {
    setIsSubmitting(false)      // 로딩 종료
  }
}
```

#### 📝 조건부 렌더링

```typescript
{/* 성공 메시지 */}
{submitStatus === 'success' && (
  <Alert severity="success">
    문의가 성공적으로 전송되었습니다.
  </Alert>
)}

{/* 에러 메시지 */}
{submitStatus === 'error' && (
  <Alert severity="error">
    문의 전송 중 오류가 발생했습니다.
  </Alert>
)}

{/* 로딩 상태의 버튼 */}
<Button 
  disabled={isSubmitting}
  endIcon={isSubmitting ? <CircularProgress size={20} /> : <SendIcon />}
>
  {isSubmitting ? '전송 중...' : '문의 보내기'}
</Button>
```

---

## 📖 Chapter 7: 환경 변수와 설정 관리

### 7.1 환경 변수가 필요한 이유

현대적인 웹 애플리케이션은 다양한 환경에서 실행됩니다:

1. **개발 환경**: 로컬 개발 서버
2. **스테이징 환경**: 테스트용 서버  
3. **운영 환경**: 실제 사용자가 접속하는 서버

각 환경마다 다른 설정값(API URL, 데이터베이스 주소, 서비스 키 등)이 필요합니다.

### 7.2 Next.js의 환경 변수 시스템

#### 🔑 환경 변수 타입

1. **서버 사이드 전용**: `VARIABLE_NAME`
2. **클라이언트 사이드 접근 가능**: `NEXT_PUBLIC_VARIABLE_NAME`

#### 📝 프로젝트 예시: 환경 변수 설정

```bash
# .env.local
# Google Analytics (클라이언트에서 접근)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# API 엔드포인트 (클라이언트에서 접근)
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# 이메일 서비스 (서버에서만 접근)
MAIL_SERVICE_API_KEY=your_sendgrid_api_key
MAIL_SERVICE_FROM_EMAIL=noreply@yourdomain.com
```

### 7.3 환경 변수 중앙 관리

#### 📝 프로젝트 예시: config.ts

```typescript
// src/lib/config.ts
// 클라이언트 사이드에서 접근 가능한 환경 변수
export const publicConfig = {
  GA_ID: process.env.NEXT_PUBLIC_GA_ID,
  API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  NODE_ENV: process.env.NODE_ENV || 'development',
} as const

// 서버 사이드에서만 접근 가능한 환경 변수
export const privateConfig = {
  MAIL_SERVICE_API_KEY: process.env.MAIL_SERVICE_API_KEY,
  MAIL_SERVICE_FROM_EMAIL: process.env.MAIL_SERVICE_FROM_EMAIL,
} as const
```

**중앙 관리의 장점:**
- 환경 변수 사용 위치를 한눈에 파악
- 타입 안정성 확보
- 기본값 설정 용이
- 리팩토링 시 변경점 최소화

### 7.4 실제 사용 예시

#### 📝 클라이언트 컴포넌트에서 사용

```typescript
// src/components/forms/ContactForm.tsx
'use client'
import { publicConfig } from '@/lib/config'

const ContactForm = () => {
  const onSubmit = async (data: ContactFormData) => {
    // 환경 변수로 API URL 동적 설정
    const response = await fetch(`${publicConfig.API_URL}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
  }
}
```

#### 📝 서버 컴포넌트에서 사용

```typescript
// src/app/api/contact/route.ts (API 라우트)
import { privateConfig } from '@/lib/config'

export async function POST(request: NextRequest) {
  // 서버에서만 접근 가능한 환경 변수 사용
  const apiKey = privateConfig.MAIL_SERVICE_API_KEY
  
  if (!apiKey) {
    return NextResponse.json(
      { error: '이메일 서비스 설정 오류' },
      { status: 500 }
    )
  }
  
  // 이메일 발송 로직...
}
```

### 7.5 환경별 설정 관리

#### 📁 환경별 파일 구조

```
프로젝트/
├── .env                 # 기본 설정 (모든 환경)
├── .env.local          # 로컬 개발 설정 (git 제외)
├── .env.development    # 개발 환경 설정
├── .env.production     # 운영 환경 설정
└── .env.example        # 환경변수 템플릿 (git 포함)
```

#### 📝 .env.example (팀원 공유용)

```bash
# .env.example - 실제 값은 제거하고 구조만 공유
# Google Analytics
NEXT_PUBLIC_GA_ID=G-YOUR_GA_ID_HERE

# API Configuration  
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Email Service (Server-side only)
MAIL_SERVICE_API_KEY=your_api_key_here
MAIL_SERVICE_FROM_EMAIL=your_email@domain.com
```

---

## 📖 Chapter 8: Google Analytics 연동

### 8.1 왜 Google Analytics가 필요한가?

**Google Analytics**는 웹사이트 방문자의 행동을 분석하는 도구입니다:

1. **사용자 이해**: 어떤 페이지가 인기 있는지 파악
2. **성과 측정**: 마케팅 캠페인 효과 분석
3. **개선점 발견**: 사용자가 어디서 이탈하는지 추적
4. **비즈니스 의사결정**: 데이터 기반 전략 수립

### 8.2 Next.js에서 GA 연동 구조

#### 📁 연동 구조 분석

```
src/
├── components/common/
│   └── GoogleAnalytics.tsx     # GA 스크립트 컴포넌트
├── lib/
│   └── analytics.ts            # GA 유틸리티 함수들
├── hooks/
│   └── useAnalytics.ts         # 페이지 추적 Hook
└── app/
    └── layout.tsx              # GA 컴포넌트 사용
```

### 8.3 Google Analytics 컴포넌트

#### 📝 프로젝트 예시: GoogleAnalytics.tsx

```typescript
// src/components/common/GoogleAnalytics.tsx
'use client'  // 클라이언트 컴포넌트 (브라우저 API 사용)
import Script from 'next/script'

interface GoogleAnalyticsProps {
  GA_MEASUREMENT_ID: string
}

const GoogleAnalytics = ({ GA_MEASUREMENT_ID }: GoogleAnalyticsProps) => {
  return (
    <>
      {/* Google Analytics 스크립트 로드 */}
      <Script
        strategy="afterInteractive"  // 페이지 로드 후 실행
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      
      {/* GA 초기화 스크립트 */}
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_title: document.title,
              page_location: window.location.href,
            });
          `,
        }}
      />
    </>
  )
}
```

**코드 분석:**
- `Script` 컴포넌트: Next.js의 최적화된 스크립트 로더
- `strategy="afterInteractive"`: 페이지가 상호작용 가능해진 후 로드
- `dangerouslySetInnerHTML`: HTML 문자열을 직접 삽입 (보안 주의 필요)

### 8.4 Analytics 유틸리티 함수

#### 📝 프로젝트 예시: analytics.ts

```typescript
// src/lib/analytics.ts
// Google Analytics 이벤트 타입
export interface GAEvent {
  action: string
  category: string
  label?: string
  value?: number
}

// 페이지뷰 추적
export const trackPageView = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', process.env.NEXT_PUBLIC_GA_ID, {
      page_path: url,
    })
  }
}

// 커스텀 이벤트 추적
export const trackEvent = ({ action, category, label, value }: GAEvent) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}

// 자주 사용하는 이벤트들
export const trackButtonClick = (buttonName: string) => {
  trackEvent({
    action: 'click',
    category: 'Button',
    label: buttonName,
  })
}

export const trackFormSubmit = (formName: string) => {
  trackEvent({
    action: 'submit',
    category: 'Form',
    label: formName,
  })
}
```

### 8.5 실제 사용 예시

#### 📝 ContactForm에서 이벤트 추적

```typescript
// src/components/forms/ContactForm.tsx
import { trackEvent, trackFormSubmit } from '@/lib/analytics'

const ContactForm = () => {
  const onSubmit = async (data: ContactFormData) => {
    // 폼 제출 시작 이벤트
    trackEvent({
      action: 'form_submit_start',
      category: 'Contact',
      label: 'Contact Form',
    })

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        body: JSON.stringify(data),
      })

      if (response.ok) {
        // 성공 이벤트 추적
        trackFormSubmit('Contact Form Success')
        
        trackEvent({
          action: 'form_submit_success',
          category: 'Contact',
          label: 'Contact Form',
        })
      }
    } catch (error) {
      // 에러 이벤트 추적
      trackEvent({
        action: 'form_submit_error',
        category: 'Contact',
        label: 'Contact Form',
      })
    }
  }
}
```

#### 📝 버튼 클릭 추적

```typescript
// 히어로 섹션의 CTA 버튼
<Button
  onClick={() => {
    trackButtonClick('Hero CTA - 시작하기')
    // 실제 액션 수행
  }}
>
  시작하기
</Button>
```

### 8.6 자동 페이지 추적

#### 📝 useAnalytics Hook

```typescript
// src/hooks/useAnalytics.ts
'use client'
import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { trackPageView } from '@/lib/analytics'

export function useAnalytics() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (pathname) {
      const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '')
      trackPageView(url)  // 페이지 변경 시 자동 추적
    }
  }, [pathname, searchParams])
}
```

#### 📝 Layout에서 자동 추적 활성화

```typescript
// src/app/layout.tsx
import GoogleAnalytics from '@/components/common/GoogleAnalytics'
import AnalyticsProvider from '@/components/common/AnalyticsProvider'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {/* Google Analytics 스크립트 로드 */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics GA_MEASUREMENT_ID={process.env.NEXT_PUBLIC_GA_ID} />
        )}
        
        <ThemeProvider theme={theme}>
          {/* 자동 페이지 추적 활성화 */}
          <AnalyticsProvider>
            {children}
          </AnalyticsProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
```

---

## 📖 Chapter 9: 실습 과제와 확장 아이디어

### 9.1 단계별 실습 과제

#### 🎯 초급 과제 (개념 이해)

1. **새로운 페이지 추가**
   - `src/app/portfolio/page.tsx` 생성
   - Header의 네비게이션에 Portfolio 링크 추가
   - 간단한 포트폴리오 목록 표시

2. **컴포넌트 분리**
   - HeroSection에서 버튼 부분을 별도 컴포넌트로 분리
   - Props를 통해 버튼 텍스트와 클릭 이벤트 전달

3. **애니메이션 추가**
   - About 페이지의 팀 멤버 카드에 stagger 애니메이션 적용

#### 🎯 중급 과제 (실무 응용)

1. **중첩 라우팅 구현**
   ```
   src/app/services/
   ├── layout.tsx
   ├── page.tsx
   ├── web-development/page.tsx
   └── consulting/page.tsx
   ```

2. **커스텀 Hook 만들기**
   - 폼 입력값을 localStorage에 자동 저장하는 Hook
   - API 호출 상태를 관리하는 Hook

3. **에러 바운더리 추가**
   - `error.tsx` 파일을 각 경로에 추가
   - 사용자 친화적인 에러 페이지 구현

#### 🎯 고급 과제 (최적화)

1. **성능 최적화**
   - React.memo를 사용한 컴포넌트 메모이제이션
   - 이미지 lazy loading 구현
   - Bundle Analyzer로 번들 크기 분석

2. **SEO 최적화**
   - 동적 메타데이터 생성
   - JSON-LD 구조화 데이터 추가
   - sitemap.xml 생성

3. **접근성 개선**
   - 키보드 네비게이션 지원
   - ARIA 라벨 추가
   - 스크린 리더 호환성 확보

### 9.2 확장 아이디어

#### 💡 추가 기능 아이디어

1. **다국어 지원 (i18n)**
   - next-i18next 라이브러리 사용
   - 언어 선택기 컴포넌트
   - 동적 언어 로딩

2. **다크 모드 지원**
   - Material-UI 테마 동적 변경
   - 사용자 설정 localStorage 저장
   - 시스템 설정 자동 감지

3. **실시간 채팅**
   - Socket.IO 연동
   - 고객 상담 기능
   - 실시간 알림

4. **관리자 대시보드**
   - 문의 내역 관리
   - 통계 데이터 시각화
   - 컨텐츠 관리 시스템

### 9.3 학습 진도 체크리스트

#### ✅ 기본 개념 이해도 체크

- [ ] React 컴포넌트 생성 및 사용
- [ ] JSX 문법 이해
- [ ] Props 전달 및 타입 정의
- [ ] useState를 이용한 상태 관리
- [ ] 이벤트 핸들러 작성

#### ✅ Next.js App Router 이해도 체크

- [ ] 파일 기반 라우팅 이해
- [ ] layout.tsx의 역할 이해
- [ ] Server vs Client Component 구분
- [ ] 환경 변수 사용법
- [ ] API 라우트 생성

#### ✅ 실무 적용 능력 체크

- [ ] Material-UI 컴포넌트 커스터마이징
- [ ] Framer Motion 애니메이션 적용
- [ ] 폼 유효성 검사 구현
- [ ] API 연동 및 에러 처리
- [ ] Google Analytics 이벤트 추적

---

## 🚀 다음 단계: 9개의 후속 프로젝트

### 📋 학습 로드맵

1. **Project02: Modern Business Landing** ← 현재 프로젝트
2. **Project03: E-commerce Product Page** - 상품 상세, 장바구니, 결제
3. **Project04: Blog with CMS** - 동적 콘텐츠, MDX, Headless CMS
4. **Project05: Dashboard Analytics** - 차트, 데이터 시각화, 실시간 업데이트
5. **Project06: Social Media Feed** - 무한 스크롤, 이미지 업로드, 좋아요
6. **Project07: Real-time Chat App** - WebSocket, 실시간 통신, 알림
7. **Project08: Weather App with Maps** - 외부 API, 지도 연동, PWA
8. **Project09: Task Management** - 드래그 앤 드롭, 상태 관리, 협업 기능
9. **Project10: Multi-tenant SaaS** - 인증, 권한, 멀티테넌시
10. **Project11: Full-stack Application** - 데이터베이스, 배포, CI/CD

### 🎯 각 프로젝트별 학습 목표

이 프로젝트에서 배운 기본기를 바탕으로, 각 후속 프로젝트에서는 다음과 같은 고급 개념들을 학습하게 됩니다:

- **상태 관리**: Redux Toolkit, Zustand, Jotai
- **데이터 페칭**: TanStack Query, SWR, GraphQL
- **인증 & 보안**: NextAuth.js, JWT, OAuth
- **테스팅**: Jest, Testing Library, E2E 테스트
- **성능 최적화**: 코드 분할, 이미지 최적화, 캐싱
- **배포 & 운영**: Vercel, Docker, CI/CD 파이프라인

---

## 📚 추가 학습 자료

### 📖 공식 문서

- [React 공식 문서](https://react.dev/) - React 개념과 Hook 상세 설명
- [Next.js 공식 문서](https://nextjs.org/docs) - App Router와 최신 기능
- [TypeScript 공식 문서](https://www.typescriptlang.org/docs/) - 타입 시스템 이해
- [Material-UI 공식 문서](https://mui.com/) - 컴포넌트 사용법과 커스터마이징

### 🎥 추천 학습 영상

- React 기초부터 고급까지 단계별 학습
- Next.js App Router 마이그레이션 가이드
- TypeScript와 React의 조합 활용법
- 현대적인 웹 개발 워크플로우

### 📝 실습 가이드

1. **매일 30분 코딩**: 작은 기능이라도 꾸준히 구현
2. **코드 리뷰**: 동료들과 코드를 공유하고 피드백 받기
3. **오픈소스 기여**: GitHub에서 React/Next.js 프로젝트 참여
4. **사이드 프로젝트**: 개인적인 아이디어로 완성도 높은 앱 제작

---

## 🎉 마무리

축하합니다! React와 Next.js의 핵심 개념들을 모두 학습하셨습니다. 이 프로젝트를 통해 다음과 같은 능력을 갖추게 되었습니다:

### ✅ 습득한 기술들

1. **React 기초**: 컴포넌트, Props, State, Hook
2. **Next.js App Router**: 라우팅, 레이아웃, Server/Client Components
3. **TypeScript**: 타입 안정성, 인터페이스 정의
4. **UI 라이브러리**: Material-UI 활용과 커스터마이징
5. **애니메이션**: Framer Motion으로 UX 개선
6. **폼 처리**: React Hook Form과 유효성 검사
7. **환경 설정**: 환경 변수와 배포 준비
8. **분석 도구**: Google Analytics 연동

### 🚀 다음 학습 방향

이제 여러분은 현대적인 웹 개발자로서 첫걸음을 내디뎠습니다. 다음 9개의 프로젝트를 통해 더욱 전문적인 개발자로 성장하실 수 있습니다.

**"완벽한 프로젝트는 끝난 프로젝트입니다."**

계속해서 코딩하고, 실험하고, 배워나가세요. 여러분의 개발 여정을 응원합니다! 🎯

---

*이 README.md는 React와 Next.js 학습을 위한 교육 자료로 제작되었습니다. 질문이나 개선 제안이 있으시면 언제든 문의해 주세요.*