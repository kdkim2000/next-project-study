# 🛣️ Next.js Router 문제 해결 가이드

## ❌ **발생했던 Router 문제들**

### 1. **앵커 링크 방식 사용**
- **문제**: `href="#home"`, `href="#services"` 같은 해시 링크 사용
- **결과**: 실제 페이지 이동 없이 같은 페이지 내 스크롤만 됨
- **해결**: 실제 Next.js 라우트 경로로 변경

### 2. **Next.js Link 컴포넌트 미사용**
- **문제**: MUI Button의 기본 `href` 속성만 사용
- **결과**: 전체 페이지 새로고침으로 느린 네비게이션
- **해결**: `component={Link}` 패턴으로 클라이언트 사이드 라우팅 구현

### 3. **실제 페이지 라우트 부재**
- **문제**: `/about`, `/services`, `/contact` 페이지가 존재하지 않음
- **결과**: 404 오류 발생
- **해결**: Next.js App Router 구조에 맞는 페이지 파일 생성

---

## ✅ **완전히 해결된 Router 구조**

### **📁 최종 라우팅 구조**
```
src/app/
├── layout.tsx          # 루트 레이아웃
├── page.tsx           # 홈페이지 (/)
├── about/
│   └── page.tsx       # 회사소개 (/about)
├── services/
│   └── page.tsx       # 서비스 (/services)
└── contact/
    └── page.tsx       # 연락처 (/contact)
```

### **🧭 Header 컴포넌트 개선사항**
```typescript
// Before: 앵커 링크
{ label: '홈', href: '#home' }

// After: 실제 라우트
{ label: '홈', href: '/' }

// Before: 기본 href
<Button href={item.href}>

// After: Next.js Link + 활성 상태 표시
<Button
  component={Link}
  href={item.href}
  sx={{
    backgroundColor: pathname === item.href ? 'rgba(255, 255, 255, 0.1)' : 'transparent'
  }}
>
```

### **🎯 주요 개선 기능들**

#### 1. **클라이언트 사이드 라우팅**
- 페이지 간 이동 시 전체 새로고침 없음
- 빠른 네비게이션 경험
- 브라우저 뒤로가기/앞으로가기 지원

#### 2. **활성 메뉴 표시**
```typescript
const pathname = usePathname(); // 현재 경로 감지
// 현재 페이지 메뉴에 하이라이트 효과
```

#### 3. **완전한 페이지 라우트**
- **홈페이지** (`/`): 메인 랜딩 페이지
- **서비스** (`/services`): 상세 서비스 소개
- **회사소개** (`/about`): 팀 소개 및 회사 비전
- **연락처** (`/contact`): 고급 연락 폼과 정보

---

## 🔧 **Router 관련 주요 코드 패턴**

### **1. Next.js Link 사용법**
```typescript
import Link from 'next/link';

// MUI Button과 결합
<Button component={Link} href="/services">
  서비스 보기
</Button>

// Typography와 결합
<Typography component={Link} href="/">
  회사 로고
</Typography>
```

### **2. 현재 경로 감지**
```typescript
'use client';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();
  
  return (
    <Button 
      sx={{
        backgroundColor: pathname === '/services' ? 'primary.light' : 'transparent'
      }}
    >
      서비스
    </Button>
  );
}
```

### **3. 페이지 컴포넌트 구조**
```typescript
// src/app/about/page.tsx
export default function AboutPage() {
  return (
    <>
      <Header />
      <main>
        {/* 페이지 컨텐츠 */}
      </main>
      <Footer />
    </>
  );
}
```

---

## ⚠️ **Router 사용 시 주의사항**

### **1. Client vs Server Components**
```typescript
// usePathname 사용 시 'use client' 필요
'use client';
import { usePathname } from 'next/navigation';

// Link는 어디서든 사용 가능
import Link from 'next/link';
```

### **2. 올바른 경로 설정**
```typescript
// ✅ 올바른 절대 경로
href="/services"
href="/about" 
href="/contact"

// ❌ 상대 경로나 해시 링크
href="services"
href="#services"
```

### **3. MUI와의 올바른 결합**
```typescript
// ✅ 올바른 방법
<Button component={Link} href="/services">
  링크 버튼
</Button>

// ❌ 잘못된 방법  
<Link>
  <Button href="/services">
    링크 버튼
  </Button>
</Link>
```

---

## 🧪 **Router 동작 테스트 방법**

### **1. 기본 네비게이션 테스트**
```bash
# 개발 서버 실행
npm run dev

# 브라우저에서 테스트
http://localhost:3000/         # 홈페이지
http://localhost:3000/services # 서비스 페이지  
http://localhost:3000/about    # 회사소개
http://localhost:3000/contact  # 연락처
```

### **2. 네비게이션 기능 확인**
- [ ] 헤더 메뉴 클릭 시 해당 페이지로 이동
- [ ] 현재 페이지 메뉴에 활성 표시
- [ ] 로고 클릭 시 홈페이지로 이동
- [ ] 히어로 섹션 버튼으로 페이지 이동
- [ ] 브라우저 뒤로가기/앞으로가기 동작

### **3. 성능 확인**
- [ ] 페이지 이동 시 전체 새로고침 없음
- [ ] 빠른 라우팅 속도
- [ ] URL 변경 확인

---

## 🎯 **학습 포인트**

### **초보자를 위한 핵심 개념**

1. **Next.js App Router**
   - 폴더 기반 라우팅 시스템
   - `page.tsx` 파일이 실제 라우트가 됨
   - `layout.tsx`로 공통 레이아웃 적용

2. **클라이언트 사이드 라우팅**
   - `next/link` 컴포넌트 사용
   - 페이지 새로고침 없는 빠른 네비게이션
   - SEO 친화적인 URL 구조

3. **상태 관리**
   - `usePathname`으로 현재 경로 감지
   - 활성 메뉴 표시로 사용자 경험 향상

---

**이제 Router가 완벽하게 동작합니다! 🎉**

모든 페이지 간 네비게이션이 원활하고, 현대적인 SPA(Single Page Application) 경험을 제공합니다.
