# Project09: Content Studio CMS

> **React와 Next.js를 학습하기 위한 완전한 콘텐츠 관리 시스템(CMS)**

![Content Studio CMS](https://img.shields.io/badge/Next.js-15.1.0-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19.1.0-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![Material-UI](https://img.shields.io/badge/Material--UI-5.15-blue?style=flat-square&logo=mui)

## 📋 프로젝트 개요

Content Studio는 React와 Next.js를 학습하기 위해 설계된 완전한 풀스택 CMS입니다. 초보자도 쉽게 따라할 수 있도록 상세한 주석과 설명이 포함되어 있으며, 현업에서 실제로 사용되는 패턴과 기술들을 학습할 수 있습니다.

### 🎯 학습 목표

- **풀스택 애플리케이션 구축**: 프론트엔드부터 백엔드까지 완전한 웹 애플리케이션 개발
- **관리자 대시보드**: 실무에서 사용되는 관리자 인터페이스 패턴 학습
- **파일 처리**: 이미지 업로드, 관리, 최적화 기법 습득

### 🛠 핵심 구현 기술

- **동적 폼 빌더**: React Hook Form과 Yup을 활용한 유연한 폼 시스템
- **이미지 업로드와 처리**: Multer를 사용한 파일 업로드 및 관리
- **WYSIWYG 에디터**: React Quill을 활용한 리치 텍스트 에디터
- **API Routes**: Next.js의 route.ts를 활용한 RESTful API 구현
- **버전 관리 시스템**: 콘텐츠 변경 이력 추적 및 롤백 기능
- **미리보기 모드**: 실시간 콘텐츠 미리보기 기능
- **다국어 지원**: i18n을 활용한 기초적인 다국어 지원
- **백업과 복원**: 데이터 안전을 위한 백업 시스템

## 🚀 빠른 시작

### 1. 프로젝트 생성

```bash
# Next.js 프로젝트 생성 (권장 옵션과 함께)
npx create-next-app@latest content-studio-cms

# 프로젝트 생성 시 선택 사항:
# ✅ TypeScript 사용
# ✅ ESLint 사용
# ❌ Tailwind CSS 사용 안함 (Material-UI 사용)
# ✅ src/ 디렉토리 사용
# ✅ App Router 사용 (최신 기능)
# ❌ import alias 커스터마이즈 안함

cd content-studio-cms
```

### 2. 의존성 설치

```bash
# Material-UI 관련 패키지
npm install @mui/material @emotion/react @emotion/styled
npm install @mui/lab @mui/icons-material @mui/x-date-pickers

# 상태 관리 및 폼
npm install zustand react-hook-form @hookform/resolvers yup

# 에디터 및 파일 처리
npm install react-quill multer
npm install @types/multer --save-dev

# 데이터베이스
npm install better-sqlite3 @types/better-sqlite3

# 다국어 지원
npm install react-i18next i18next

# 유틸리티
npm install date-fns uuid @types/uuid
```

### 3. 데이터베이스 초기화

```bash
# 데이터베이스 테이블 생성 및 초기 데이터 설정
npm run db:init
```

### 4. 개발 서버 시작

```bash
npm run dev
```

브라우저에서 `http://localhost:3000`을 열어 확인하세요.

## 📁 프로젝트 구조

```
content-studio-cms/
├── public/
│   └── uploads/                 # 업로드된 미디어 파일
├── src/
│   ├── app/
│   │   ├── admin/              # 관리자 페이지들
│   │   │   ├── contents/       # 콘텐츠 관리 페이지
│   │   │   ├── media/          # 미디어 관리 페이지
│   │   │   ├── backup/         # 백업 관리 페이지
│   │   │   └── layout.tsx      # 관리자 레이아웃
│   │   ├── api/                # API Routes
│   │   │   ├── contents/       # 콘텐츠 API
│   │   │   └── media/          # 미디어 API
│   │   ├── preview/            # 미리보기 페이지
│   │   ├── globals.css         # 전역 스타일
│   │   ├── layout.tsx          # 루트 레이아웃
│   │   └── page.tsx            # 홈페이지
│   ├── components/             # 재사용 가능한 컴포넌트
│   │   ├── ContentForm.tsx     # 콘텐츠 작성/편집 폼
│   │   └── WysiwygEditor.tsx   # WYSIWYG 에디터
│   ├── lib/                    # 라이브러리 및 유틸리티
│   │   └── database.ts         # 데이터베이스 설정
│   ├── stores/                 # Zustand 상태 관리
│   │   └── contentStore.ts     # 콘텐츠 스토어
│   └── types/                  # TypeScript 타입 정의
│       └── index.ts            # 공통 타입들
├── database.db                 # SQLite 데이터베이스 파일
├── eslint.config.mjs          # ESLint 설정 (초보자 친화적)
└── package.json
```

## 🔧 주요 설정 파일들

### ESLint 설정 (초보자 친화적)

```javascript
// eslint.config.mjs
// 학습 초기 단계에서는 느슨한 규칙을 적용
export default [
  {
    rules: {
      "react/no-unescaped-entities": "warn",    // 경고만 표시
      "@typescript-eslint/no-unused-vars": "warn", // 미사용 변수도 경고만
      "no-console": "off",                      // console.log 허용 (학습용)
      // ... 기타 완화된 규칙들
    }
  }
];
```

### TypeScript 설정

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": false,        // 초보자를 위해 엄격 모드 비활성화
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

## 💻 핵심 기능 구현

### 1. WYSIWYG 에디터 (React Quill)

```typescript
// src/components/WysiwygEditor.tsx
import dynamic from 'next/dynamic';

// SSR 문제 방지를 위한 동적 import
const ReactQuill = dynamic(() => import('react-quill'), { 
  ssr: false 
});

const WysiwygEditor = ({ value, onChange }) => {
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline'],
      ['link', 'image'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['clean']
    ]
  };

  return (
    <ReactQuill
      theme="snow"
      value={value}
      onChange={onChange}
      modules={modules}
    />
  );
};
```

### 2. 파일 업로드 API

```typescript
// src/app/api/media/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get('file') as File;
  
  // 파일 검증
  if (!file || file.size > 5 * 1024 * 1024) {
    return NextResponse.json(
      { error: '파일 크기는 5MB를 초과할 수 없습니다.' },
      { status: 400 }
    );
  }
  
  // 파일 저장
  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = `${Date.now()}-${file.name}`;
  
  await writeFile(`./public/uploads/${filename}`, buffer);
  
  return NextResponse.json({ 
    url: `/uploads/${filename}`,
    filename 
  });
}
```

### 3. Zustand 상태 관리

```typescript
// src/stores/contentStore.ts
import { create } from 'zustand';

interface ContentStore {
  contents: Content[];
  loading: boolean;
  fetchContents: () => Promise<void>;
  createContent: (content: Content) => Promise<void>;
}

export const useContentStore = create<ContentStore>((set, get) => ({
  contents: [],
  loading: false,
  
  fetchContents: async () => {
    set({ loading: true });
    try {
      const response = await fetch('/api/contents');
      const data = await response.json();
      set({ contents: data.contents, loading: false });
    } catch (error) {
      set({ loading: false });
      console.error('콘텐츠 로드 실패:', error);
    }
  },
  
  createContent: async (content) => {
    const response = await fetch('/api/contents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(content)
    });
    
    if (response.ok) {
      get().fetchContents(); // 목록 새로고침
    }
  }
}));
```

## 📚 학습 가이드

### 단계별 학습 순서

1. **프로젝트 구조 이해** (30분)
   - Next.js App Router 구조 파악
   - 컴포넌트와 페이지의 관계 이해

2. **기본 컴포넌트 구현** (2시간)
   - Material-UI 컴포넌트 활용법
   - 재사용 가능한 컴포넌트 작성

3. **API Routes 구현** (2시간)
   - RESTful API 설계 원칙
   - Next.js API Routes 활용법

4. **상태 관리** (1시간)
   - Zustand 기본 개념과 사용법
   - 전역 상태 vs 로컬 상태

5. **폼 처리** (1.5시간)
   - React Hook Form 활용법
   - Yup을 이용한 유효성 검사

6. **파일 업로드** (1시간)
   - Multer를 이용한 파일 처리
   - 이미지 최적화 기법

### 초보자를 위한 주요 개념

#### 1. Next.js App Router
```
app/
├── page.tsx          # 홈페이지 (/)
├── admin/
│   ├── page.tsx      # 관리자 홈 (/admin)
│   └── contents/
│       └── page.tsx  # 콘텐츠 관리 (/admin/contents)
└── api/
    └── contents/
        └── route.ts  # API 엔드포인트 (/api/contents)
```

#### 2. TypeScript 타입 정의
```typescript
// 명확한 타입 정의로 개발 시 오류 방지
interface Content {
  id: string;
  title: string;
  content: string;
  status: 'draft' | 'published';
  createdAt: string;
}
```

#### 3. 컴포넌트 재사용성
```typescript
// 재사용 가능한 컴포넌트 패턴
interface ButtonProps {
  variant: 'primary' | 'secondary';
  onClick: () => void;
  children: React.ReactNode;
}

const CustomButton = ({ variant, onClick, children }: ButtonProps) => {
  // 컴포넌트 로직
};
```

## 🎨 UI/UX 특징

### Material-UI 디자인 시스템
- **일관된 디자인**: Google의 Material Design 원칙 적용
- **반응형 레이아웃**: 모바일부터 데스크톱까지 완벽 지원
- **접근성**: WCAG 가이드라인 준수
- **다크모드**: 사용자 선호도에 따른 테마 전환 (추후 구현)

### 관리자 인터페이스
- **직관적인 네비게이션**: 사이드바 기반 메뉴 구조
- **실시간 피드백**: 로딩 상태, 성공/오류 메시지 표시
- **키보드 단축키**: 효율적인 콘텐츠 작성을 위한 단축키 지원

## 🛡️ 보안 및 검증

### 입력 검증
```typescript
// Yup 스키마를 통한 강력한 검증
const contentSchema = yup.object({
  title: yup
    .string()
    .required('제목은 필수입니다')
    .min(2, '제목은 2자 이상이어야 합니다'),
  content: yup
    .string()
    .required('내용은 필수입니다')
    .min(10, '내용은 10자 이상이어야 합니다')
});
```

### 파일 업로드 보안
```typescript
// 허용되는 파일 타입과 크기 제한
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// 파일 검증 로직
if (!ALLOWED_TYPES.includes(file.type)) {
  throw new Error('지원하지 않는 파일 형식입니다');
}
```

## 🚨 일반적인 문제와 해결법

### 1. React Quill SSR 오류
```typescript
// 해결: 동적 import 사용
const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
  loading: () => <div>에디터 로딩 중...</div>
});
```

### 2. 파일 업로드 실패
```bash
# 업로드 디렉토리 권한 확인
chmod 755 public/uploads
```

### 3. 데이터베이스 연결 오류
```bash
# SQLite 파일 권한 확인
chmod 644 database.db
```

## 🔄 확장 가능성

### 추가 구현 가능한 기능들
1. **사용자 인증**: JWT 기반 로그인/로그아웃
2. **권한 관리**: 역할 기반 접근 제어 (RBAC)
3. **실시간 협업**: Socket.io를 활용한 실시간 편집
4. **검색 기능**: Elasticsearch 또는 전문 검색 구현
5. **캐싱**: Redis를 활용한 성능 최적화
6. **CDN 연동**: AWS CloudFront 등 CDN 서비스 연동

### 데이터베이스 마이그레이션
```typescript
// PostgreSQL로 마이그레이션 시
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});
```

## 📈 성능 최적화

### 이미지 최적화
```typescript
// Next.js Image 컴포넌트 활용
import Image from 'next/image';

<Image
  src="/uploads/image.jpg"
  alt="콘텐츠 이미지"
  width={800}
  height={600}
  priority={true}  // LCP 최적화
/>
```

### 번들 최적화
```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // 트리 셰이킹 최적화
  experimental: {
    optimizePackageImports: ['@mui/material', '@mui/icons-material']
  },
  // 이미지 최적화
  images: {
    domains: ['localhost'],
    formats: ['image/avif', 'image/webp']
  }
};
```

## 🧪 테스팅

### 단위 테스트 설정
```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom
```

```typescript
// __tests__/components/ContentForm.test.tsx
import { render, screen } from '@testing-library/react';
import ContentForm from '@/components/ContentForm';

test('제목 입력 필드가 렌더링된다', () => {
  render(<ContentForm onSubmit={() => {}} />);
  
  const titleInput = screen.getByLabelText(/제목/i);
  expect(titleInput).toBeInTheDocument();
});
```

## 📊 모니터링 및 분석

### 성능 모니터링
```typescript
// src/lib/analytics.ts
export const trackEvent = (eventName: string, properties: object) => {
  // Google Analytics 또는 기타 분석 도구 연동
  if (typeof window !== 'undefined') {
    gtag('event', eventName, properties);
  }
};
```

## 🤝 기여 가이드

이 프로젝트는 학습용이므로 다음과 같은 방향으로 개선할 수 있습니다:

1. **코드 개선**: 더 나은 TypeScript 타입 정의
2. **기능 추가**: 새로운 CMS 기능 구현
3. **문서화**: 더 상세한 학습 가이드 작성
4. **테스트**: 단위 테스트 및 E2E 테스트 추가

## 📝 라이선스

이 프로젝트는 MIT 라이선스 하에 있습니다. 학습 목적으로 자유롭게 사용하실 수 있습니다.

## 📞 지원

문제가 발생하거나 질문이 있으시면:

1. **GitHub Issues**: 버그 리포트 및 기능 요청
2. **학습 가이드**: 단계별 학습 문서 참조
3. **커뮤니티**: React/Next.js 커뮤니티 참여

---

**Happy Coding! 🚀**

이 프로젝트를 통해 React와 Next.js의 실무 패턴을 익히고, 완전한 풀스택 애플리케이션 개발 경험을 쌓으시기 바랍니다.