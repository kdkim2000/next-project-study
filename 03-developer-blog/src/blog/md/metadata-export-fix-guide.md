---
title: "generateMetadata Export 오류 해결 가이드"
date: "2025-09-27"
description: "**클라이언트 컴포넌트**(`use client`)에서는 metadata 관련 함수 export 불가"
keywords: ["nextjs", "react", "web-development", "javascript"]
category: "frontend"
tags: ["nextjs", "react", "performance", "web-development"]
---
# 

## 문제 상황

```
× You are attempting to export "generateMetadata" from a component marked with "use client", which is disallowed.
```

## 원인 분석

### Next.js App Router의 핵심 규칙
1. **`generateMetadata`** 함수는 **서버 컴포넌트**에서만 export 가능
2. **클라이언트 컴포넌트**(`"use client"`)에서는 metadata 관련 함수 export 불가
3. **SEO와 메타데이터**는 서버에서 처리되어야 함

### 문제가 된 코드 패턴
```typescript
// ❌ 잘못된 패턴
"use client";

// ... 클라이언트 컴포넌트 코드

export async function generateMetadata() {  // 오류 발생!
  // ...
}
```

## 해결 방법: 서버/클라이언트 분리

### 파일 구조 설계

```
src/app/search/
├── page.tsx              # 서버 컴포넌트 (metadata + 데이터 로드)
└── SearchPageClient.tsx  # 클라이언트 컴포넌트 (상태 관리 + UI)
```

### 1. 서버 컴포넌트 (`page.tsx`)

```typescript
// src/app/search/page.tsx
import { 
  getAllPosts, 
  getAllCategories, 
  getAllTags
} from "@/lib/posts";
import SearchPageClient from "./SearchPageClient";

type Props = {
  searchParams: Promise<{ q?: string }>;
};

// ✅ 서버 컴포넌트에서 메타데이터 생성
export async function generateMetadata({ searchParams }: Props) {
  const resolvedParams = await searchParams;
  const query = resolvedParams.q || '';
  
  if (!query) {
    return {
      title: "검색 | Developer's Blog",
      description: "블로그 포스트를 검색해보세요."
    };
  }
  
  return {
    title: `"${query}" 검색 결과 | Developer's Blog`,
    description: `"${query}"에 대한 검색 결과를 확인해보세요.`,
  };
}

// ✅ 서버에서 데이터 로드 후 클라이언트 컴포넌트에 전달
export default async function SearchPage({ searchParams }: Props) {
  const resolvedParams = await searchParams;
  const initialQuery = resolvedParams.q || '';
  
  // 서버에서 데이터 미리 로드
  const allPosts = getAllPosts();
  const allCategories = getAllCategories();
  const allTags = getAllTags();

  return (
    <SearchPageClient 
      allPosts={allPosts}
      allCategories={allCategories}
      allTags={allTags}
      initialQuery={initialQuery}
    />
  );
}
```

### 2. 클라이언트 컴포넌트 (`SearchPageClient.tsx`)

```typescript
// src/app/search/SearchPageClient.tsx
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
// ... 기타 imports

interface SearchPageClientProps {
  allPosts: any[];
  allCategories: any[];
  allTags: any[];
  initialQuery?: string;
}

// ✅ 클라이언트 컴포넌트는 상태 관리와 UI만 담당
export default function SearchPageClient({ 
  allPosts, 
  allCategories, 
  allTags, 
  initialQuery = '' 
}: SearchPageClientProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  
  // 클라이언트 로직과 UI 렌더링
  return (
    <Container>
      {/* UI 컴포넌트들 */}
    </Container>
  );
}
```

## 역할 분담 원칙

### 서버 컴포넌트의 역할
- ✅ SEO 메타데이터 생성 (`generateMetadata`)
- ✅ 정적 파라미터 생성 (`generateStaticParams`)
- ✅ 파일 시스템 접근 (`fs`, `path` 모듈 사용)
- ✅ 데이터베이스 쿼리 및 외부 API 호출
- ✅ 서버 전용 라이브러리 사용

### 클라이언트 컴포넌트의 역할
- ✅ 상태 관리 (`useState`, `useEffect`)
- ✅ 이벤트 처리 및 사용자 인터랙션
- ✅ 브라우저 API 사용 (`localStorage`, `navigator`)
- ✅ 실시간 UI 업데이트
- ✅ 클라이언트 전용 라이브러리 사용

## 데이터 흐름 패턴

```
1. 서버 컴포넌트 (page.tsx)
   ↓ (서버에서 실행)
   - URL 파라미터 파싱
   - 메타데이터 생성
   - 데이터 사전 로드
   ↓ (props로 전달)

2. 클라이언트 컴포넌트 (SearchPageClient.tsx)
   ↓ (브라우저에서 실행)
   - 초기 데이터 받아서 상태 초기화
   - 사용자 인터랙션 처리
   - 동적 UI 업데이트
```

## 다른 페이지 적용 예시

### 블로그 페이지 구조
```
src/app/blog/
├── page.tsx          # 서버: metadata + getAllPosts()
└── BlogClient.tsx    # 클라이언트: 필터링 + 정렬 UI
```

### 카테고리 페이지 구조
```
src/app/category/[category]/
└── page.tsx          # 서버: metadata + getPostsByCategory()
```

### 태그 페이지 구조
```
src/app/tag/[tag]/
└── page.tsx          # 서버: metadata + getPostsByTag()
```

## 일반적인 실수와 해결책

### ❌ 실수 1: 클라이언트에서 메타데이터 시도
```typescript
"use client";
export const metadata = { /* ... */ }; // 오류!
```

### ✅ 해결책 1: 서버 컴포넌트로 분리
```typescript
// page.tsx (서버)
export const metadata = { /* ... */ };

// ClientComponent.tsx (클라이언트)
"use client";
// UI만 담당
```

### ❌ 실수 2: 서버에서 useState 사용 시도
```typescript
// page.tsx (서버)
const [state, setState] = useState(); // 오류!
```

### ✅ 해결책 2: 클라이언트 컴포넌트로 분리
```typescript
// page.tsx (서버)
export default function ServerPage() {
  return <ClientComponent />;
}

// ClientComponent.tsx (클라이언트)
"use client";
const [state, setState] = useState(); // 정상
```

### ❌ 실수 3: 클라이언트에서 fs 모듈 사용
```typescript
"use client";
import fs from 'fs'; // 오류!
```

### ✅ 해결책 3: 서버에서 데이터 준비
```typescript
// page.tsx (서버)
import fs from 'fs'; // 정상
const data = readDataFromFileSystem();
return <ClientComponent data={data} />;
```

## 테스트 방법

1. **빌드 테스트**
   ```bash
   npm run build
   ```

2. **메타데이터 확인**
   - 브라우저에서 페이지 소스 보기
   - `<head>` 태그 내 메타데이터 확인

3. **기능 테스트**
   - 검색 기능 정상 작동 확인
   - URL 파라미터 변경 시 메타데이터 업데이트 확인

## 교육적 가치

이 문제를 통해 학습할 수 있는 개념들:

1. **Next.js App Router 아키텍처**: 서버와 클라이언트의 명확한 경계
2. **SEO 최적화**: 서버 사이드 메타데이터의 중요성
3. **성능 최적화**: 서버에서 데이터 사전 로드의 효과
4. **관심사 분리**: 각 컴포넌트의 명확한 역할 정의
5. **확장 가능성**: 일관된 패턴으로 유지보수 향상

## 결론

이 해결 패턴을 통해:

- ✅ Next.js App Router 규칙 준수
- ✅ SEO 친화적인 메타데이터 생성
- ✅ 서버와 클라이언트의 최적 활용
- ✅ 확장 가능한 아키텍처 구축
- ✅ 일관된 개발 패턴 유지

모든 페이지에서 이 패턴을 일관되게 적용하여 견고하고 유지보수 가능한 Next.js 애플리케이션을 구축할 수 있습니다.
