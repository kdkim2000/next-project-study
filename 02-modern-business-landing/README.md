# React & Next.js 실무 교육 교재
## 프로젝트 2: 기업 랜딩 페이지 (Modern Business Landing)

> **"실전으로 배우는 React와 Next.js 완전정복"**  
> React 경험이 전혀 없는 개발자를 위한 단계별 학습 교재

---

## 📚 **교재 개요**

이 교재는 **React와 Next.js 경험이 전혀 없는 개발자**를 대상으로 합니다. 실제 동작하는 기업 랜딩 페이지를 만들어가면서 React의 핵심 개념들을 자연스럽게 학습할 수 있도록 구성되었습니다.

### **🎯 이 교재로 배울 수 있는 것**
- React 컴포넌트의 기본 개념과 작성법
- Next.js의 파일 기반 라우팅 시스템
- TypeScript를 활용한 타입 안전한 개발
- 현대적인 UI 라이브러리 (MUI) 사용법
- 실무에서 바로 적용 가능한 개발 패턴

### **🎓 학습 목표**
1. **레이아웃과 중첩 라우팅**: Next.js의 파일 시스템 기반 라우팅 이해
2. **Server Components vs Client Components**: React의 두 가지 컴포넌트 유형 구분
3. **컴포넌트 재사용과 Props**: 효율적인 컴포넌트 설계 방법

---

## 🛠️ **사용된 기술 스택**

### **✅ 이번 프로젝트에서 다룬 기술**
- **Next.js 15** (App Router) - 프레임워크
- **TypeScript** - 타입 안전성
- **MUI v6** - UI 컴포넌트 라이브러리 (최신 Grid 문법 포함)
- **React 18** - 컴포넌트 기반 개발

### **📋 다음 단계에서 배울 기술들**
- **Framer Motion** - 애니메이션 효과
- **고급 폼 처리** - React Hook Form + Yup 검증
- **환경 변수** - 설정 관리
- **Google Analytics** - 웹 분석 도구 연동
- **상태 관리** - Context API, Zustand

---

## 📖 **Chapter 1: React 기초 이해하기**

### **1.1 React란 무엇인가?**

React는 **사용자 인터페이스(UI)를 만들기 위한 JavaScript 라이브러리**입니다. 웹 페이지를 작은 조각들(컴포넌트)로 나누어 각각 독립적으로 관리할 수 있게 해줍니다.

#### **🏗️ 전통적인 HTML vs React**

**전통적인 HTML 방식:**
```html
<!-- 같은 코드를 여러 번 반복 -->
<div class="card">
  <h3>웹 개발</h3>
  <p>최신 기술을 활용한 웹사이트 제작</p>
</div>
<div class="card">
  <h3>모바일 앱</h3>
  <p>iOS/Android 앱 개발</p>
</div>
```

**React 방식:**
```tsx
// 한 번 정의하고 재사용
function ServiceCard({ title, description }) {
  return (
    <div className="card">
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

// 여러 곳에서 재사용
<ServiceCard title="웹 개발" description="최신 기술을 활용한 웹사이트 제작" />
<ServiceCard title="모바일 앱" description="iOS/Android 앱 개발" />
```

### **1.2 컴포넌트란?**

컴포넌트는 **재사용 가능한 UI 조각**입니다. 우리 프로젝트의 `Header.tsx`를 살펴보겠습니다:

```tsx
// src/components/Header.tsx
export default function Header() {
  return (
    <AppBar position="sticky" elevation={1}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography variant="h6" component="div">
          Modern Business  {/* 회사명 */}
        </Typography>
        
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
          {/* 네비게이션 메뉴들 */}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
```

**핵심 개념:**
- `function Header()`로 컴포넌트를 정의
- `return` 안에 UI 구조를 JSX로 작성
- `export default`로 다른 파일에서 사용할 수 있도록 내보냄

### **1.3 JSX (JavaScript XML)**

JSX는 **JavaScript 안에서 HTML과 비슷한 문법을 사용**할 수 있게 해주는 React의 특별한 문법입니다.

#### **JSX의 주요 규칙:**

1. **하나의 부모 요소**: 반드시 하나의 부모로 감싸야 함
```tsx
// ✅ 올바른 예
return (
  <div>
    <h1>제목</h1>
    <p>내용</p>
  </div>
);

// ❌ 잘못된 예 - 두 개의 최상위 요소
return (
  <h1>제목</h1>
  <p>내용</p>
);
```

2. **JavaScript 표현식**: `{}`로 감싸서 JavaScript 코드 실행
```tsx
const companyName = 'Modern Business';
return <h1>{companyName}</h1>; // "Modern Business" 출력
```

3. **조건부 렌더링**: 조건에 따라 다른 내용 표시
```tsx
const isLoggedIn = true;
return (
  <div>
    {isLoggedIn ? <p>환영합니다!</p> : <p>로그인해주세요</p>}
  </div>
);
```

---

## 📖 **Chapter 2: Next.js 라우팅 시스템**

### **2.1 Next.js란?**

Next.js는 **React를 기반으로 한 풀스택 웹 프레임워크**입니다. React만으로는 복잡한 라우팅, SEO, 성능 최적화 등이 어려운데, Next.js가 이런 문제들을 해결해줍니다.

### **2.2 App Router - 파일 시스템 기반 라우팅**

Next.js 13+에서 도입된 App Router는 **폴더 구조가 곧 URL 구조**가 되는 시스템입니다.

#### **🗂️ 우리 프로젝트의 라우팅 구조:**
```
src/app/
├── layout.tsx          # 모든 페이지 공통 레이아웃
├── page.tsx           # 홈페이지 (/)
├── about/
│   └── page.tsx       # 회사소개 페이지 (/about)
├── services/
│   └── page.tsx       # 서비스 페이지 (/services)
└── contact/
    └── page.tsx       # 연락처 페이지 (/contact)
```

#### **🔗 URL과 파일의 관계:**
- `http://localhost:3000/` → `src/app/page.tsx`
- `http://localhost:3000/about` → `src/app/about/page.tsx`
- `http://localhost:3000/services` → `src/app/services/page.tsx`
- `http://localhost:3000/contact` → `src/app/contact/page.tsx`

### **2.3 layout.tsx - 공통 레이아웃의 이해**

`layout.tsx`는 **모든 페이지에 공통으로 적용되는 레이아웃**을 정의합니다:

```tsx
// src/app/layout.tsx
export default function RootLayout({
  children,  // 실제 페이지 내용이 여기에 들어감
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        {/* MUI 테마 설정 - 모든 페이지에 적용 */}
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}  {/* 페이지별 내용이 이 자리에 렌더링 */}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

**동작 원리:**
1. 사용자가 `/about` 페이지를 방문
2. Next.js가 `layout.tsx`를 먼저 렌더링
3. `{children}` 자리에 `about/page.tsx`의 내용을 삽입
4. 완성된 HTML을 브라우저에 전송

### **2.4 Next.js Link - 클라이언트 사이드 라우팅**

일반적인 `<a>` 태그는 페이지 전체를 새로 로드하지만, Next.js의 `Link`는 **필요한 부분만 업데이트**합니다:

```tsx
// src/components/Header.tsx
import Link from 'next/link';

const navigationItems = [
  { label: '홈', href: '/' },
  { label: '서비스', href: '/services' },
  { label: '회사소개', href: '/about' },
  { label: '연락처', href: '/contact' },
];

// MUI Button과 Next.js Link 결합
<Button
  component={Link}    // MUI Button을 Link로 감싸기
  href={item.href}    // 이동할 경로
  color="inherit"
>
  {item.label}
</Button>
```

**장점:**
- 페이지 전체 새로고침 없음 → 빠른 네비게이션
- 브라우저 뒤로가기/앞으로가기 자동 지원
- SEO 친화적인 URL 구조

---

## 📖 **Chapter 3: Server Components vs Client Components**

### **3.1 React 18의 새로운 개념**

React 18과 Next.js 13+에서는 컴포넌트가 **두 가지 종류**로 나뉩니다:

#### **🖥️ Server Components (서버 컴포넌트)**
- **서버에서 렌더링**되어 완성된 HTML을 브라우저에 전송
- **기본값**으로, 별도 설정 없이 서버 컴포넌트가 됨
- 상호작용(클릭, 입력 등) 불가능
- SEO에 유리하고 초기 로딩이 빠름

#### **💻 Client Components (클라이언트 컴포넌트)**
- **브라우저에서 실행**되는 JavaScript
- `'use client'` 지시어로 명시적 선언 필요
- 사용자 상호작용 가능 (버튼 클릭, 폼 입력 등)
- React 훅(useState, useEffect 등) 사용 가능

### **3.2 Server Component 실제 예시**

우리 프로젝트의 `Header.tsx`를 보겠습니다:

```tsx
// src/components/Header.tsx
'use client';  // 클라이언트 컴포넌트로 설정

import Link from 'next/link';
import { usePathname } from 'next/navigation';  // 브라우저 전용 훅

export default function Header() {
  const pathname = usePathname();  // 현재 경로 확인 (브라우저에서만 가능)
  
  return (
    <AppBar position="sticky">
      {/* 네비게이션 메뉴 렌더링 */}
    </AppBar>
  );
}
```

**왜 Client Component인가?**
- `usePathname()` 훅을 사용하여 현재 경로를 확인
- 현재 페이지 메뉴에 활성화 표시를 해야 함
- 브라우저에서만 실행 가능한 기능이므로 `'use client'` 필요

### **3.3 Client Component 실제 예시**

`ContactSection.tsx`는 폼 처리를 위한 클라이언트 컴포넌트입니다:

```tsx
// src/components/ContactSection.tsx
'use client';  // 필수 선언

import { useState } from 'react';

export default function ContactSection() {
  // React 훅 사용 - 클라이언트에서만 가능
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  // 사용자 입력 처리 - 브라우저 이벤트
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // 폼 제출 처리 - 사용자 상호작용
  const handleSubmit = async (event) => {
    event.preventDefault();
    // 폼 데이터 처리 로직
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        name="name"
        value={formData.name}
        onChange={handleInputChange}  // 사용자 입력에 반응
      />
      {/* 기타 폼 필드들 */}
    </form>
  );
}
```

**Client Component인 이유:**
- `useState`로 폼 데이터 상태 관리
- `onChange`, `onSubmit` 이벤트 처리
- 사용자 입력에 실시간 반응해야 함

### **3.4 언제 어떤 컴포넌트를 사용할까?**

#### **✅ Server Component 사용 시기:**
- 정적 콘텐츠 표시 (텍스트, 이미지, 링크 등)
- 데이터베이스에서 데이터를 가져와서 표시
- SEO가 중요한 페이지
- **예시**: `About` 페이지, 블로그 포스트, 제품 목록

```tsx
// Server Component 예시 - about/page.tsx
export default function AboutPage() {
  // 서버에서 실행되는 코드
  const teamMembers = [
    { name: '김철수', position: 'CEO' },
    { name: '박영희', position: 'CTO' },
  ];

  return (
    <Container>
      {teamMembers.map((member) => (
        <Card key={member.name}>
          <Typography>{member.name}</Typography>
          <Typography>{member.position}</Typography>
        </Card>
      ))}
    </Container>
  );
}
```

#### **✅ Client Component 사용 시기:**
- 사용자 상호작용이 필요한 경우
- 폼 입력, 버튼 클릭, 드래그 앤 드롭 등
- React 훅(useState, useEffect 등) 사용
- 브라우저 API (localStorage, geolocation 등) 사용

```tsx
// Client Component 예시 - contact/page.tsx
'use client';

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = () => {
    setIsSubmitting(true);
    // 폼 제출 로직
  };

  return (
    <Button 
      onClick={handleSubmit} 
      disabled={isSubmitting}
    >
      {isSubmitting ? '전송 중...' : '전송'}
    </Button>
  );
}
```

---

## 📖 **Chapter 4: Props와 컴포넌트 재사용**

### **4.1 Props란 무엇인가?**

Props(Properties)는 **부모 컴포넌트에서 자식 컴포넌트로 데이터를 전달하는 방법**입니다. 함수의 매개변수와 비슷한 개념입니다.

#### **📦 Props의 기본 개념:**
```tsx
// 일반 함수에서 매개변수
function greet(name) {
  return `안녕하세요, ${name}님!`;
}

// React 컴포넌트에서 Props
function Greeting({ name }) {
  return <h1>안녕하세요, {name}님!</h1>;
}
```

### **4.2 실제 프로젝트에서 Props 사용법**

우리 프로젝트의 `HeroSection.tsx`에서 Props를 어떻게 활용하는지 살펴보겠습니다:

```tsx
// src/components/HeroSection.tsx

// 1. Props 타입 정의 (TypeScript)
interface HeroSectionProps {
  companyInfo: {
    name: string;
    tagline: string;
    description: string;
  };
}

// 2. Props 받아오기 (구조 분해 할당)
export default function HeroSection({ companyInfo }: HeroSectionProps) {
  return (
    <Container maxWidth="md">
      {/* 3. Props 데이터 사용 */}
      <Typography variant="h1">
        {companyInfo.tagline}  {/* 전달받은 데이터 표시 */}
      </Typography>
      
      <Typography variant="h5">
        {companyInfo.description}
      </Typography>
    </Container>
  );
}
```

#### **📤 부모 컴포넌트에서 Props 전달:**
```tsx
// src/app/page.tsx
export default function Home() {
  // 데이터 준비
  const companyInfo = {
    name: 'Modern Business',
    tagline: '혁신적인 비즈니스 솔루션',
    description: 'Next.js와 MUI를 활용한 현대적인 웹 개발',
  };

  return (
    <main>
      {/* Props로 데이터 전달 */}
      <HeroSection companyInfo={companyInfo} />
    </main>
  );
}
```

### **4.3 배열 데이터와 map() 함수**

여러 개의 유사한 데이터를 렌더링할 때는 `map()` 함수를 사용합니다:

```tsx
// src/components/ServicesSection.tsx
interface Service {
  id: number;
  title: string;
  description: string;
  icon: string;
}

interface ServicesSectionProps {
  services: Service[];  // 배열 타입
}

export default function ServicesSection({ services }: ServicesSectionProps) {
  return (
    <Grid container spacing={4}>
      {/* map() 함수로 배열을 컴포넌트로 변환 */}
      {services.map((service) => (
        <Grid size={{ xs: 12, md: 4 }} key={service.id}>
          <ServiceCard service={service} />  {/* 개별 서비스를 Props로 전달 */}
        </Grid>
      ))}
    </Grid>
  );
}
```

#### **🔄 map() 함수의 동작 원리:**
```tsx
// JavaScript 배열
const services = [
  { id: 1, title: '웹 개발', icon: '💻' },
  { id: 2, title: '모바일 앱', icon: '📱' },
  { id: 3, title: '디지털 마케팅', icon: '📈' },
];

// map()으로 JSX 배열 생성
services.map((service) => (
  <ServiceCard key={service.id} service={service} />
))

// 결과적으로 이렇게 됨:
[
  <ServiceCard key={1} service={{id: 1, title: '웹 개발', icon: '💻'}} />,
  <ServiceCard key={2} service={{id: 2, title: '모바일 앱', icon: '📱'}} />,
  <ServiceCard key={3} service={{id: 3, title: '디지털 마케팅', icon: '📈'}} />,
]
```

**⚠️ key prop의 중요성:**
- React가 배열의 각 요소를 구분하기 위해 필요
- 고유한 값이어야 함 (보통 ID 사용)
- 성능 최적화에 중요한 역할

### **4.4 Children Pattern**

`children`은 **컴포넌트의 여는 태그와 닫는 태그 사이의 내용**을 전달하는 특별한 Props입니다:

```tsx
// src/app/layout.tsx
export default function RootLayout({
  children,  // 페이지 내용이 children으로 전달됨
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}  {/* 여기에 페이지별 내용 렌더링 */}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

**Children Pattern의 활용:**
```tsx
// 사용법
<Layout>
  <Header />
  <main>메인 컨텐츠</main>
  <Footer />
</Layout>

// Layout 컴포넌트 내부에서
function Layout({ children }) {
  return (
    <div className="layout">
      {children}  // Header, main, Footer가 모두 여기에 렌더링
    </div>
  );
}
```

### **4.5 TypeScript와 Props**

TypeScript를 사용하면 **Props의 타입을 미리 정의**하여 오류를 방지할 수 있습니다:

```tsx
// Footer 컴포넌트 예시
interface FooterProps {
  companyName: string;        // 필수 Props
  year?: number;              // 선택적 Props (? 표시)
  links?: string[];           // 배열 타입 (선택적)
}

export default function Footer({ 
  companyName, 
  year = 2024,                // 기본값 설정
  links = []                  // 빈 배열을 기본값으로
}: FooterProps) {
  return (
    <footer>
      <Typography>
        © {year} {companyName}. All rights reserved.
      </Typography>
    </footer>
  );
}
```

**TypeScript Props 타입의 장점:**
- 개발 중 오타나 잘못된 데이터 타입 사용 방지
- IDE에서 자동 완성 지원
- 코드 가독성 향상
- 런타임 오류 사전 방지

---

## 📖 **Chapter 5: MUI v6 최신 문법과 스타일링**

### **5.1 MUI (Material-UI)란?**

MUI는 **Google의 Material Design을 React로 구현한 컴포넌트 라이브러리**입니다. 버튼, 입력 필드, 카드 등 미리 만들어진 UI 컴포넌트를 제공합니다.

### **5.2 MUI v6의 새로운 Grid 시스템**

MUI v6에서는 Grid 컴포넌트의 문법이 더욱 직관적으로 개선되었습니다:

#### **📐 Grid 시스템의 기본 개념:**
- **Container**: 행(row) 역할
- **Grid**: 열(column) 역할  
- **12컬럼 시스템**: 한 행을 최대 12개 컬럼으로 분할

```tsx
// src/app/about/page.tsx에서 실제 사용 예시
<Grid container spacing={6}>
  {/* 데스크탑에서는 절반씩, 모바일에서는 전체 사용 */}
  <Grid size={{ xs: 12, md: 6 }}>
    <Typography variant="h4">우리의 비전</Typography>
    {/* 비전 내용 */}
  </Grid>
  
  <Grid size={{ xs: 12, md: 6 }}>
    <Typography variant="h4">핵심 가치</Typography>
    {/* 가치 내용 */}
  </Grid>
</Grid>
```

#### **🔄 MUI v6 vs v5 문법 비교:**

```tsx
// ❌ MUI v5 이전 문법
<Grid item xs={12} sm={6} md={4}>
  <Card>내용</Card>
</Grid>

// ✅ MUI v6 새로운 문법
<Grid size={{ xs: 12, sm: 6, md: 4 }}>
  <Card>내용</Card>
</Grid>
```

### **5.3 반응형 디자인 구현**

#### **📱 Breakpoint 시스템:**
- `xs`: 0px 이상 (모바일)
- `sm`: 600px 이상 (작은 태블릿)
- `md`: 900px 이상 (태블릿/노트북)
- `lg`: 1200px 이상 (데스크탑)
- `xl`: 1536px 이상 (큰 모니터)

```tsx
// src/app/services/page.tsx에서 서비스 카드 배치
<Grid container spacing={4}>
  {services.map((service) => (
    <Grid 
      size={{ 
        xs: 12,    // 모바일: 1개씩 세로 배치
        md: 6,     // 태블릿: 2개씩 가로 배치  
        lg: 4      // 데스크탑: 3개씩 가로 배치
      }} 
      key={service.id}
    >
      <ServiceCard service={service} />
    </Grid>
  ))}
</Grid>
```

### **5.4 MUI 테마 시스템**

테마를 통해 **전체 애플리케이션의 일관된 디자인**을 관리할 수 있습니다:

```tsx
// src/lib/theme.ts
const theme = createTheme({
  // 색상 팔레트 정의
  palette: {
    primary: {
      main: '#1976d2',    // 메인 블루 컬러
      light: '#42a5f5',   // 밝은 블루
      dark: '#1565c0',    // 어두운 블루
    },
    secondary: {
      main: '#dc004e',    // 포인트 컬러
    },
  },
  
  // 타이포그래피 스타일
  typography: {
    h1: {
      fontSize: '3.5rem',
      fontWeight: 700,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
  },
});
```

#### **🎨 테마 사용 예시:**
```tsx
// 컴포넌트에서 테마 색상 사용
<Button 
  sx={{
    color: 'primary.main',      // 테마의 메인 컬러
    fontSize: 'h2.fontSize',    // 테마의 타이포그래피
    bgcolor: 'background.paper', // 테마의 배경 색상
  }}
>
  버튼
</Button>
```

---

## 📖 **Chapter 6: 상태 관리와 이벤트 처리**

### **6.1 useState Hook 이해하기**

`useState`는 **컴포넌트에서 상태(데이터)를 관리**하는 React 훅입니다:

```tsx
// src/components/ContactSection.tsx에서 실제 사용 예시
'use client';
import { useState } from 'react';

export default function ContactSection() {
  // 상태 선언: [현재값, 설정함수] = useState(초기값)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  
  return (
    <form>
      <TextField
        value={formData.name}    // 현재 상태값 표시
        onChange={handleInputChange}  // 상태 변경 함수 연결
      />
    </form>
  );
}
```

### **6.2 이벤트 처리**

사용자의 행동(클릭, 입력, 제출 등)에 반응하는 방법입니다:

```tsx
// 입력 필드 변경 처리
const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = event.target;  // 어떤 필드의 어떤 값인지 확인
  
  setFormData(prev => ({
    ...prev,        // 기존 데이터 유지
    [name]: value   // 해당 필드만 새 값으로 업데이트
  }));
};

// 폼 제출 처리
const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();  // 기본 폼 제출 동작 방지
  setIsSubmitting(true);   // 로딩 상태 표시
  
  try {
    // API 호출 또는 데이터 처리
    console.log('폼 데이터:', formData);
    
    // 성공 처리
    setFormData({ name: '', email: '', message: '' });  // 폼 초기화
  } catch (error) {
    // 오류 처리
    console.error('전송 실패:', error);
  } finally {
    setIsSubmitting(false);  // 로딩 상태 해제
  }
};
```

---

## 🎯 **실습 과제와 응용**

### **📝 기본 실습 과제**

#### **1. 컴포넌트 수정해보기**
- `Header.tsx`에서 회사명을 자신의 회사명으로 변경
- `Footer.tsx`에서 연락처 정보 업데이트
- 새로운 서비스 카드 추가해보기

#### **2. Props 연습하기**
- `HeroSection`에 새로운 Props 추가 (예: 배경 이미지 URL)
- 서비스 데이터에 가격 정보 추가하기
- 팀 멤버 정보 확장하기

#### **3. 스타일링 연습**
- 테마 색상 변경해보기
- 새로운 Typography 스타일 정의
- Grid 레이아웃 다양하게 배치해보기

### **🔥 도전 과제**

#### **1. 새로운 페이지 만들기**
```bash
# 블로그 페이지 생성
src/app/blog/page.tsx
```

#### **2. 동적 라우팅 구현하기**
```bash
# 개별 서비스 상세 페이지
src/app/services/[id]/page.tsx
```

#### **3. 커스텀 컴포넌트 만들기**
- 로딩 스피너 컴포넌트
- 모달 팝업 컴포넌트
- 이미지 갤러리 컴포넌트

---

## 🚀 **다음 단계 학습 로드맵**

### **🌟 Level 2: 중급 기능**
- **Framer Motion**: 부드러운 애니메이션 효과
- **React Hook Form**: 복잡한 폼 검증과 처리
- **환경 변수**: 개발/운영 환경 분리
- **API 통신**: 실제 데이터베이스 연결

### **🏆 Level 3: 고급 기능**
- **상태 관리**: Context API, Zustand
- **성능 최적화**: React.memo, useMemo, useCallback
- **테스트**: Jest, React Testing Library
- **배포**: Vercel, AWS, Docker

### **⚡ Level 4: 실무 심화**
- **SEO 최적화**: meta 태그, sitemap, 구조화 데이터
- **웹 접근성**: WCAG 가이드라인 준수
- **성능 모니터링**: Core Web Vitals, 번들 분석
- **CI/CD**: 자동 배포 파이프라인

---

## 🛠️ **개발 환경 설정 및 실행**

### **1. 필수 도구 설치**
- **Node.js** (v18 이상): JavaScript 런타임
- **npm**: 패키지 관리자
- **VS Code**: 코드 에디터 (추천)

### **2. 프로젝트 시작하기**
```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 브라우저에서 확인
http://localhost:3000
```

### **3. 유용한 VS Code 확장 프로그램**
- **ES7+ React/Redux/React-Native snippets**: React 코드 자동 완성
- **TypeScript Importer**: import 문 자동 생성
- **Prettier**: 코드 자동 포매팅
- **Auto Rename Tag**: HTML/JSX 태그 자동 수정

---

## 📚 **참고 자료 및 더 알아보기**

### **공식 문서**
- [React 공식 문서](https://react.dev/) - React 기초 개념
- [Next.js 공식 문서](https://nextjs.org/docs) - App Router 가이드
- [MUI 공식 문서](https://mui.com/) - 컴포넌트 사용법
- [TypeScript 핸드북](https://www.typescriptlang.org/docs/) - 타입 정의

### **추천 학습 순서**
1. **JavaScript ES6+ 문법** (구조 분해, 화살표 함수, Promise 등)
2. **React 기초** (컴포넌트, JSX, Props, State)
3. **Next.js 라우팅** (페이지 생성, Link 컴포넌트)
4. **TypeScript 기초** (타입 정의, 인터페이스)
5. **MUI 컴포넌트** (Grid, Typography, Button 등)

### **커뮤니티**
- **React 한국 사용자 그룹** (Facebook)
- **Next.js Discord** - 영어 커뮤니티
- **Stack Overflow** - 기술적 질문과 답변

---

## 🎉 **마무리**

축하합니다! 이 교재를 통해 다음과 같은 핵심 개념들을 학습했습니다:

### **✅ 달성한 학습 목표**
- ✅ **레이아웃과 중첩 라우팅**: Next.js App Router 완전 이해
- ✅ **Server vs Client Components**: 두 컴포넌트 유형의 차이점과 활용법
- ✅ **컴포넌트 재사용과 Props**: 효율적인 컴포넌트 설계 원칙

### **💼 실무에서 바로 적용 가능한 기술**
- Next.js 13+ App Router를 활용한 현대적인 웹 애플리케이션 구조
- TypeScript를 통한 타입 안전한 개발
- MUI v6을 활용한 일관된 디자인 시스템 구축
- 반응형 웹 디자인 구현

### **🔄 지속적인 학습을 위한 제언**
React와 Next.js 생태계는 빠르게 발전하고 있습니다. 이 교재에서 배운 기초를 바탕으로 계속해서 새로운 기능들을 학습하고 실제 프로젝트에 적용해보세요.

**"배운 것을 실제로 만들어보는 것이 가장 중요합니다."**

---

*이 교재는 실무 개발자가 직접 작성한 교육용 자료입니다. 궁금한 점이나 개선 사항이 있다면 언제든 피드백해주세요.*

**Happy Coding! 🚀**