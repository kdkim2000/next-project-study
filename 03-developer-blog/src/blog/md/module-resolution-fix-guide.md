---
title: "Module Resolution Error 해결 가이드"
date: "2025-09-27"
description: "클라이언트 컴포넌트에서 Node.js 전용 모듈을 사용 오류 해결"
keywords: ["nextjs", "react", "web-development", "javascript"]
category: "frontend"
tags: ["nextjs", "react", "performance", "web-development"]
---


## 문제 상황

```
Module not found: Can't resolve 'fs'
./src/lib/posts.ts (2:1)
```

## 원인 분석

이 오류는 **클라이언트 컴포넌트에서 Node.js 전용 모듈을 사용**하려고 할 때 발생합니다:

1. **BlogClient.tsx** → `"use client"` (브라우저 환경)
2. **posts.ts** → `import fs from "fs"` (Node.js 전용)
3. **브라우저**에서는 `fs` 모듈이 존재하지 않음

## 핵심 원칙

### Next.js App Router의 환경 분리
- **서버 컴포넌트**: Node.js 환경 (fs, path 등 사용 가능)
- **클라이언트 컴포넌트**: 브라우저 환경 (fs 사용 불가)

## 완전한 해결 방법

### 1. 서버 컴포넌트 (page.tsx) - 수정 불필요
```typescript
// src/app/blog/page.tsx
import { 
  getAllPosts, 
  getAllCategories, 
  getAllTags
} from "@/lib/posts"; // ✅ 서버에서만 실행되므로 OK

export const metadata = {
  title: "Blog Posts | Developer's Blog",
  description: "개발 관련 블로그 포스트들을 확인해보세요.",
  keywords: "blog, development, programming, nextjs, react, typescript",
};

export default async function BlogPage() {
  // 서버에서 데이터 미리 로드
  const allPosts = getAllPosts();
  const categories = getAllCategories();
  const tags = getAllTags();

  return (
    <BlogClient 
      initialPosts={allPosts}
      categories={categories}
      tags={tags}
    />
  );
}
```

### 2. 클라이언트 컴포넌트 수정 - BlogClient.tsx

**문제 부분 제거:**
```typescript
// ❌ 제거해야 할 부분
import { 
  sortPosts,
  filterPosts
} from "@/lib/posts";
```

**해결책 적용:**
```typescript
// ✅ 수정된 버전
"use client";

import { useState, useMemo } from 'react';
import Link from "next/link";
// posts.ts는 import하지 않음

// 클라이언트에서 사용할 유틸리티 함수들을 직접 정의
const sortPosts = (posts: any[], sortBy: 'date' | 'title' | 'readingTime' = 'date') => {
  return [...posts].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        if (!a.date) return 1;
        if (!b.date) return -1;
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case 'title':
        return a.title.localeCompare(b.title);
      case 'readingTime':
        const aTime = a.readingTime?.minutes || 0;
        const bTime = b.readingTime?.minutes || 0;
        return aTime - bTime;
      default:
        return 0;
    }
  });
};

const searchPosts = (posts: any[], query: string) => {
  if (!query.trim()) return posts;
  
  const searchTerm = query.toLowerCase();
  return posts.filter(post => {
    return (
      post.title.toLowerCase().includes(searchTerm) ||
      post.description?.toLowerCase().includes(searchTerm) ||
      post.category?.toLowerCase().includes(searchTerm) ||
      post.tags?.some((tag: string) => tag.toLowerCase().includes(searchTerm))
    );
  });
};

const filterPosts = (posts: any[], filters: {
  categories?: string[];
  tags?: string[];
  searchQuery?: string;
}) => {
  let filteredPosts = [...posts];
  
  if (filters.categories && filters.categories.length > 0) {
    filteredPosts = filteredPosts.filter(post => 
      filters.categories!.includes(post.category || 'uncategorized')
    );
  }
  
  if (filters.tags && filters.tags.length > 0) {
    filteredPosts = filteredPosts.filter(post => 
      filters.tags!.some(tag => post.tags?.includes(tag))
    );
  }
  
  if (filters.searchQuery && filters.searchQuery.trim()) {
    filteredPosts = searchPosts(filteredPosts, filters.searchQuery);
  }
  
  return filteredPosts;
};

// 나머지 컴포넌트 코드는 동일
```

### 3. PostFilter.tsx 수정

**문제 부분:**
```typescript
// ❌ 제거해야 할 부분
import { CategoryData, TagData } from '@/lib/posts';
```

**해결책:**
```typescript
// ✅ 타입을 직접 정의
interface CategoryData {
  name: string;
  slug: string;
  count: number;
}

interface TagData {
  name: string;
  slug: string;
  count: number;
}
```

## 아키텍처 패턴 요약

```
데이터 흐름:
서버 컴포넌트 → 클라이언트 컴포넌트
     ↓                    ↓
   fs 접근             순수 JavaScript
 posts.ts 사용         브라우저 API 사용
데이터 로드             상태 관리
```

### 역할 분담
- **서버**: 파일 시스템 접근, 데이터 로드, SEO
- **클라이언트**: 사용자 인터랙션, 상태 관리, 동적 UI

## 테스트 방법

1. **파일 적용 후 빌드 테스트:**
   ```bash
   npm run build
   ```

2. **개발 서버 테스트:**
   ```bash
   npm run dev
   ```

3. **기능 테스트:**
   - 블로그 페이지 로드 확인
   - 필터링 기능 확인
   - 검색 기능 확인

## 교육적 가치

이 문제를 통해 학습할 수 있는 개념들:

1. **환경 분리**: 서버와 클라이언트의 실행 환경 차이점
2. **모듈 해상도**: Node.js vs 브라우저 환경의 모듈 시스템
3. **아키텍처 설계**: 적절한 책임 분리와 데이터 흐름 설계
4. **성능 최적화**: 서버에서 데이터를 미리 준비하는 방법

이런 실제 문제를 경험하면서 Next.js App Router의 핵심 개념을 체득할 수 있습니다.
