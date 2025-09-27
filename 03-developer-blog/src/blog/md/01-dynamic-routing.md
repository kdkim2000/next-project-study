---
title: "Next.js 15 동적 라우팅 완전 정복 - App Router의 새로운 패러다임"
date: "2024-01-16"
description: "Next.js 15 App Router에서 동적 라우팅을 구현하는 방법과 비동기 params API의 변화를 살펴봅니다."
keywords: ["nextjs", "dynamic-routing", "app-router", "params", "routing"]
---

# Next.js 15 동적 라우팅 완전 정복

Next.js 15에서 도입된 App Router는 동적 라우팅을 구현하는 방식을 완전히 바꿔놓았습니다. 기존 Pages Router와는 어떤 차이점이 있는지, 새로운 비동기 params API는 어떻게 사용하는지 자세히 알아보겠습니다.

## App Router vs Pages Router

### Pages Router (레거시)
```typescript
// pages/blog/[slug].tsx
import { useRouter } from 'next/router';

export default function BlogPost() {
  const router = useRouter();
  const { slug } = router.query; // 클라이언트에서만 접근 가능
  
  return <div>{slug}</div>;
}
```

### App Router (현재)
```typescript
// app/blog/[slug]/page.tsx
type Props = {
  params: Promise<{ slug: string }>; // Next.js 15에서 Promise 타입
};

export default async function BlogPost({ params }: Props) {
  const { slug } = await params; // 서버와 클라이언트 모두에서 접근 가능
  
  return <div>{slug}</div>;
}
```

## 새로운 비동기 Params API

Next.js 15부터 `params`가 Promise 타입이 된 이유는 성능 최적화 때문입니다.

### 왜 비동기가 되었나?

1. **스트리밍 최적화**: 페이지의 다른 부분을 먼저 렌더링할 수 있음
2. **라우트 세그먼트 지연 로딩**: 필요한 시점에만 파라미터 해석
3. **병렬 데이터 페칭**: 여러 비동기 작업을 동시에 처리

```typescript
export default async function ProductPage({ params }: Props) {
  // 병렬로 실행됨
  const [resolvedParams, categories] = await Promise.all([
    params,
    fetchCategories()
  ]);
  
  const product = await fetchProduct(resolvedParams.slug);
  
  return (
    <div>
      <h1>{product.title}</h1>
      <p>Category: {resolvedParams.category}</p>
    </div>
  );
}
```

## 중첩 동적 라우트

복잡한 URL 구조도 쉽게 구현할 수 있습니다:

```
app/
├── blog/
│   ├── [category]/
│   │   └── [slug]/
│   │       └── page.tsx  → /blog/tech/nextjs-guide
│   └── page.tsx          → /blog
```

```typescript
// app/blog/[category]/[slug]/page.tsx
type Props = {
  params: Promise<{ 
    category: string;
    slug: string;
  }>;
};

export default async function CategoryPost({ params }: Props) {
  const { category, slug } = await params;
  
  return (
    <article>
      <nav>카테고리: {category}</nav>
      <h1>포스트: {slug}</h1>
    </article>
  );
}
```

## Catch-all 라우트

모든 하위 경로를 캐치하는 라우트도 지원합니다:

```typescript
// app/docs/[...slug]/page.tsx
type Props = {
  params: Promise<{ slug: string[] }>;
};

export default async function DocsPage({ params }: Props) {
  const { slug } = await params;
  
  // /docs/api/auth/login → ['api', 'auth', 'login']
  const path = slug.join('/');
  
  return <div>문서 경로: {path}</div>;
}
```

## 실무 팁

### 1. 타입 안전성 확보
```typescript
import { z } from 'zod';

const ParamsSchema = z.object({
  slug: z.string(),
  category: z.string().optional(),
});

export default async function SafePage({ params }: Props) {
  const rawParams = await params;
  const validatedParams = ParamsSchema.parse(rawParams);
  
  // 타입 안전한 파라미터 사용
  return <div>{validatedParams.slug}</div>;
}
```

### 2. 에러 처리
```typescript
export default async function RobustPage({ params }: Props) {
  try {
    const { slug } = await params;
    const post = await getPostBySlug(slug);
    
    return <PostComponent post={post} />;
  } catch (error) {
    return <div>포스트를 찾을 수 없습니다.</div>;
  }
}
```

## 마무리

Next.js 15의 새로운 동적 라우팅 시스템은 초기에는 복잡해 보일 수 있지만, 성능과 개발 경험 모두를 크게 향상시킵니다. 비동기 params를 활용해 더 빠르고 안정적인 웹 애플리케이션을 구축해보세요!
