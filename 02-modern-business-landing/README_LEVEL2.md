# React & Next.js 실무 교육 교재
## 프로젝트 2 업그레이드: Modern Business Landing (Level 2)

> **"MUI v7 + Framer Motion + React Hook Form으로 업그레이드된 실전 학습 교재"**  
> Level 1 기초를 마스터한 개발자를 위한 중급 기능 완전정복

---

## 🚀 **Level 2 업그레이드 내용**

### **새롭게 추가된 기술 스택**
- ✅ **MUI v7** - 최신 Material Design 3 시스템
- ✅ **Framer Motion 11** - 부드러운 애니메이션 효과
- ✅ **React Hook Form + Yup** - 고급 폼 처리 및 검증
- ✅ **환경 변수 관리** - 개발/운영 환경 분리
- ✅ **Fake API 시스템** - 백엔드 없는 완전한 개발 환경
- ✅ **SWR 데이터 페칭** - 캐싱 및 상태 관리
- ✅ **GitHub Pages 배포** - 자동 배포 파이프라인

### **향상된 기능들**
- 🎬 **페이지 전환 애니메이션** - 부드러운 사용자 경험
- 📝 **실시간 폼 검증** - 즉각적인 피드백 시스템
- 📱 **완전한 반응형 디자인** - 모든 디바이스 최적화
- ⚡ **성능 최적화** - 로딩 상태, 에러 처리, 캐싱
- 🎨 **고급 UI/UX** - Material Design 3 적용
- 🔄 **상태 관리 고도화** - SWR, 로딩, 에러 상태

---

## 📋 **프로젝트 구조**

```
modern-business-landing-v2/
├── src/
│   ├── app/                    # Next.js 15 App Router
│   │   ├── layout.tsx         # 루트 레이아웃 (MUI v7 적용)
│   │   ├── page.tsx           # 홈페이지 (SWR 데이터 페칭)
│   │   ├── about/             # 회사소개 페이지
│   │   ├── services/          # 서비스 페이지
│   │   └── contact/           # 연락처 페이지
│   ├── components/            # 재사용 가능한 컴포넌트
│   │   ├── Header.tsx         # 네비게이션 (애니메이션 적용)
│   │   ├── Footer.tsx         # 푸터
│   │   ├── HeroSection.tsx    # 메인 배너 (Framer Motion)
│   │   ├── ServicesSection.tsx # 서비스 소개
│   │   └── ContactSection.tsx # 연락처 폼 (React Hook Form)
│   └── lib/                   # 유틸리티 및 설정
│       ├── theme.ts           # MUI v7 테마 설정
│       ├── api.ts             # Fake API 및 데이터 관리
│       ├── animations.ts      # Framer Motion 애니메이션
│       └── validationSchemas.ts # Yup 폼 검증 스키마
├── .env.local                 # 개발 환경 변수
├── .env.production           # 운영 환경 변수
├── next.config.js            # Next.js 설정 (GitHub Pages)
└── package.json              # 의존성 및 스크립트
```

---

## 🛠️ **설치 및 실행 가이드**

### **1. 시스템 요구사항**
- **Node.js** 18.0.0 이상
- **npm** 9.0.0 이상 또는 **yarn** 1.22.0 이상
- **Git** (GitHub Pages 배포용)

### **2. 프로젝트 클론 및 설정**

```bash
# GitHub에서 프로젝트 클론
git clone https://github.com/your-username/modern-business-landing-v2.git
cd modern-business-landing-v2

# 의존성 설치
npm install

# 환경 변수 설정
cp .env.local.example .env.local
# .env.local 파일을 열어서 필요한 값들을 수정하세요
```

### **3. 개발 서버 실행**

```bash
# 개발 서버 시작
npm run dev

# 브라우저에서 확인
open http://localhost:3000
```

### **4. 환경 변수 설정**

`.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```env
# 앱 기본 설정
NEXT_PUBLIC_APP_ENV=development
NEXT_PUBLIC_APP_NAME=Modern Business Landing
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Fake API 설정
NEXT_PUBLIC_ENABLE_MOCK_API=true
NEXT_PUBLIC_API_DELAY=1000

# 연락처 정보
NEXT_PUBLIC_CONTACT_EMAIL=your-email@company.com
NEXT_PUBLIC_COMPANY_PHONE=02-1234-5678
```

---

## 🚀 **GitHub Pages 배포 가이드**

### **1. GitHub 저장소 설정**

```bash
# GitHub에 새 저장소 생성 후
git remote add origin https://github.com/your-username/modern-business-landing-v2.git
git branch -M main
git push -u origin main
```

### **2. 배포 설정 수정**

`next.config.js` 파일에서 저장소 이름 수정:
```javascript
const repoName = 'your-repository-name'; // 실제 저장소 이름으로 변경
```

`package.json`의 homepage URL 수정:
```json
"homepage": "https://your-username.github.io/your-repository-name"
```

### **3. 배포 실행**

```bash
# 프로덕션 빌드 및 배포
npm run deploy
```

### **4. GitHub Pages 활성화**

1. GitHub 저장소 → Settings → Pages
2. Source: Deploy from a branch
3. Branch: gh-pages / (root) 선택
4. Save 클릭

배포 완료 후 `https://your-username.github.io/your-repository-name`에서 확인 가능합니다.

---

## 📚 **Level 2 핵심 학습 포인트**

### **1. MUI v7 최신 기능**

#### **새로운 Grid 시스템**
```tsx
// MUI v7 새로운 Grid 문법
<Grid container spacing={4}>
  <Grid size={{ xs: 12, md: 6 }}>
    <Card>내용</Card>
  </Grid>
</Grid>
```

#### **Material Design 3 색상 시스템**
```tsx
// 확장된 색상 팔레트 (50-900)
const theme = createTheme({
  palette: {
    primary: {
      50: '#e3f2fd',
      100: '#bbdefb',
      // ... 더 많은 색상 단계
      main: '#1976d2',
    },
  },
});
```

#### **개선된 컴포넌트 커스터마이징**
```tsx
components: {
  MuiButton: {
    styleOverrides: {
      root: {
        textTransform: 'none',
        borderRadius: 8,
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
}
```

### **2. Framer Motion 애니메이션**

#### **페이지 전환 애니메이션**
```tsx
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 },
};

<motion.div
  variants={pageVariants}
  initial="initial"
  animate="in"
  exit="out"
>
```

#### **스크롤 기반 애니메이션**
```tsx
<motion.div
  variants={fadeInUp}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true }}
>
```

#### **상호작용 애니메이션**
```tsx
const buttonVariants = {
  hover: { scale: 1.05 },
  tap: { scale: 0.95 },
};
```

### **3. React Hook Form + Yup 검증**

#### **폼 설정**
```tsx
const { control, handleSubmit, formState: { errors } } = useForm({
  resolver: yupResolver(contactFormSchema),
  mode: 'onChange',
});
```

#### **실시간 검증**
```tsx
const contactFormSchema = yup.object({
  name: yup
    .string()
    .required('이름은 필수입니다')
    .min(2, '최소 2글자 이상'),
  email: yup
    .string()
    .required('이메일은 필수입니다')
    .email('올바른 이메일 형식'),
});
```

#### **Controller 패턴**
```tsx
<Controller
  name="email"
  control={control}
  render={({ field }) => (
    <TextField
      {...field}
      error={!!errors.email}
      helperText={errors.email?.message}
    />
  )}
/>
```

### **4. SWR 데이터 페칭**

#### **기본 사용법**
```tsx
const { data, error, isLoading } = useSWR('api-key', fetcher, {
  revalidateOnFocus: false,
  dedupingInterval: 60000,
});
```

#### **에러 처리와 로딩 상태**
```tsx
if (isLoading) return <LoadingSpinner />;
if (error) return <ErrorAlert error={error} />;
return <DataComponent data={data} />;
```

### **5. 환경 변수 관리**

#### **환경별 설정 분리**
```bash
# .env.local (개발)
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api

# .env.production (운영)
NEXT_PUBLIC_API_BASE_URL=https://your-domain.com/api
```

#### **타입 안전한 환경 변수**
```tsx
const config = {
  apiUrl: process.env.NEXT_PUBLIC_API_BASE_URL!,
  enableMockApi: process.env.NEXT_PUBLIC_ENABLE_MOCK_API === 'true',
};
```

### **6. Fake API 시스템**

#### **Mock 데이터와 실제 API 전환**
```tsx
// 환경 변수로 Mock/실제 API 전환
const ENABLE_MOCK_API = process.env.NEXT_PUBLIC_ENABLE_MOCK_API === 'true';

export async function submitContactForm(data) {
  if (ENABLE_MOCK_API) {
    // Mock 로직
    return mockApiCall(data);
  }
  
  // 실제 API 호출
  return realApiCall(data);
}
```

---

## 🎯 **실습 과제와 확장 아이디어**

### **기본 실습 과제**

#### **1. 커스텀 애니메이션 만들기**
- 새로운 페이지 전환 효과 구현
- 카드 호버 시 3D 회전 효과
- 로딩 스피너 커스터마이징

#### **2. 폼 기능 확장**
- 파일 업로드 필드 추가
- 다단계 폼 마법사 구현
- 폼 저장 및 불러오기 기능

#### **3. 새로운 컴포넌트 개발**
```tsx
// 예시: 통계 카운터 컴포넌트
<AnimatedCounter 
  endValue={1500} 
  duration={2000}
  suffix="+"
/>
```

### **고급 확장 과제**

#### **1. 다크 모드 구현**
```tsx
// 테마 토글 기능 추가
const [darkMode, setDarkMode] = useState(false);
const theme = createTheme({
  palette: {
    mode: darkMode ? 'dark' : 'light',
  },
});
```

#### **2. 국제화 (i18n) 추가**
```tsx
// 다국어 지원
const messages = {
  en: { welcome: 'Welcome' },
  ko: { welcome: '환영합니다' },
};
```

#### **3. PWA (Progressive Web App) 변환**
- 서비스 워커 추가
- 오프라인 지원
- 홈 화면 설치 가능

#### **4. 실제 백엔드 연동**
- Node.js + Express API 서버
- 데이터베이스 연동 (MongoDB/PostgreSQL)
- 이메일 전송 기능

---

## 🔧 **문제 해결 가이드**

### **자주 발생하는 오류들**

#### **1. MUI v7 스타일링 오류**
```bash
# 해결책: emotion/react 호환성 확인
npm install @emotion/react@^11.13.0 @emotion/styled@^11.13.0
```

#### **2. Framer Motion 성능 이슈**
```tsx
// 해결책: will-change 속성 추가
<motion.div
  style={{ willChange: 'transform' }}
  animate={{ x: 100 }}
/>
```

#### **3. React Hook Form 타입 오류**
```tsx
// 해결책: 정확한 타입 정의
interface FormData {
  name: string;
  email: string;
}

const { control } = useForm<FormData>();
```

#### **4. GitHub Pages 배포 실패**
```bash
# 해결책: gh-pages 브랜치 수동 생성
git checkout --orphan gh-pages
git rm -rf .
git commit --allow-empty -m "Initial gh-pages commit"
git push origin gh-pages
git checkout main
```

### **성능 최적화 팁**

#### **1. 번들 크기 최적화**
```javascript
// next.config.js
experimental: {
  optimizePackageImports: ['@mui/material', '@mui/icons-material'],
}
```

#### **2. 이미지 최적화**
```tsx
import Image from 'next/image';

<Image
  src="/hero-bg.jpg"
  alt="Hero Background"
  fill
  priority
  sizes="100vw"
/>
```

#### **3. 코드 스플리팅**
```tsx
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <LoadingSkeleton />,
  ssr: false,
});
```

---

## 📈 **다음 단계 학습 로드맵**

### **🌟 Level 3: 실무 고급 (예정)**
- **상태 관리**: Zustand, Context API 심화
- **테스트**: Jest, React Testing Library, Playwright
- **성능 최적화**: React.memo, useMemo, useCallback
- **SEO 고급**: 구조화 데이터, 다국어 SEO
- **접근성**: WCAG 가이드라인 준수

### **⚡ Level 4: 엔터프라이즈 (예정)**
- **모노레포**: Nx, Turborepo
- **마이크로프론트엔드**: Module Federation
- **CI/CD**: GitHub Actions, 자동 배포
- **모니터링**: Sentry, Google Analytics 4
- **보안**: CSP, OWASP 보안 가이드

---

## 🤝 **기여 및 피드백**

이 교육 교재는 지속적으로 개선되고 있습니다.

### **피드백 방법**
- **GitHub Issues**: 버그 리포트, 개선 제안
- **Pull Requests**: 코드 기여, 문서 개선
- **Discussions**: 학습 질문, 경험 공유

### **기여 가이드라인**
1. Fork 후 feature 브랜치 생성
2. 코드 스타일 가이드 준수
3. 테스트 코드 작성 (해당하는 경우)
4. 명확한 커밋 메시지 작성
5. PR 템플릿에 따라 상세한 설명 작성

---

## 📞 **지원 및 연락처**

- **GitHub**: [프로젝트 저장소](https://github.com/your-username/modern-business-landing-v2)
- **Issues**: 기술적 질문 및 버그 리포트
- **Discussions**: 일반적인 질문 및 토론

---

## 📄 **라이센스**

이 프로젝트는 교육 목적으로 제작되었습니다.
- 개인 학습 및 포트폴리오 사용: ✅ 자유롭게 사용 가능
- 상업적 사용: ✅ 허용 (출처 표기 권장)
- 재배포: ✅ 허용 (라이센스 포함)

---

**Happy Coding! 🚀**

*이 교재가 여러분의 React/Next.js 학습 여정에 도움이 되기를 바랍니다.*