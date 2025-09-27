---
title: "generateStaticParams 마스터하기 - 대규모 사이트 최적화 전략"
date: "2024-01-19"
description: "Next.js generateStaticParams를 활용한 대규모 정적 사이트 생성 최적화 기법과 실무 적용 사례를 소개합니다."
keywords: ["nextjs", "generateStaticParams", "optimization", "performance", "static-params"]
---

# generateStaticParams 마스터하기

`generateStaticParams`는 Next.js App Router의 핵심 기능 중 하나로, 동적 라우트의 모든 경로를 빌드 타임에 미리 생성할 수 있게 해줍니다. 대규모 사이트에서 이 기능을 효율적으로 활용하는 방법을 알아보겠습니다.

## 기본 개념 복습

### Pages Router vs App Router
```typescript
// Pages Router (레거시)
export async function getStaticPaths() {
  const posts = await getAllPosts();
  
  return {
    paths: posts.map(post => ({ params: { slug: post.slug } })),
    fallback: false // 또는 true, 'blocking'
  };
}

// App Router (현재)
export async function generateStaticParams() {
  const posts = await getAllPosts();
  
  return posts.map(post => ({ slug: post.slug }));
}
```

### 핵심 차이점
- **반환 형식**: 직접 params 객체 배열 반환
- **fallback 제거**: `dynamicParams` 옵션으로 대체
- **더 간단한 API**: 보일러플레이트 코드 감소

## 성능 최적화 전략

### 1. 배치 처리 (Batch Processing)
```typescript
// 비효율적 - 각 포스트마다 개별 요청
export async function generateStaticParams() {
  const slugs = await getPostSlugs();
  
  return slugs.map(slug => ({ slug }));
}

// 효율적 - 한 번에 모든 데이터 조회
export async function generateStaticParams() {
  const posts = await getAllPostsOptimized({
    fields: ['slug', 'category'], // 필요한 필드만 조회
    limit: 1000 // 배치 크기 제한
  });
  
  return posts.map(post => ({
    slug: post.slug,
    category: post.category
  }));
}
```

### 2. 페이지네이션 처리
```typescript
// 대량의 컨텐츠를 청크 단위로 처리
export async function generateStaticParams() {
  const allPosts = [];
  let page = 1;
  const limit = 100;
  
  while (true) {
    const posts = await getPostsBatch(page, limit);
    
    if (posts.length === 0) break;
    
    allPosts.push(...posts);
    page++;
    
    // 너무 많은 페이지 방지
    if (page > 50) break;
  }
  
  return allPosts.map(post => ({ slug: post.slug }));
}
```

### 3. 캐싱 전략
```typescript
import { unstable_cache } from 'next/cache';

// 빌드 간 캐싱으로 반복 빌드 시간 단축
const getCachedPosts = unstable_cache(
  async () => {
    const posts = await getAllPosts();
    return posts;
  },
  ['all-posts'], // 캐시 키
  {
    revalidate: 3600, // 1시간 캐시
    tags: ['posts'] // 무효화 태그
  }
);

export async function generateStaticParams() {
  const posts = await getCachedPosts();
  return posts.map(post => ({ slug: post.slug }));
}
```

## 동적 매개변수 처리

### 1. 조건부 생성
```typescript
export async function generateStaticParams() {
  const posts = await getAllPosts();
  
  // 게시된 포스트만 정적 생성
  const publishedPosts = posts.filter(post => post.status === 'published');
  
  // 인기 있는 포스트 우선 생성
  const sortedPosts = publishedPosts.sort((a, b) => b.views - a.views);
  
  // 상위 100개만 미리 생성
  const topPosts = sortedPosts.slice(0, 100);
  
  return topPosts.map(post => ({ slug: post.slug }));
}
```

### 2. 환경별 다른 전략
```typescript
export async function generateStaticParams() {
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  if (isDevelopment) {
    // 개발 환경에서는 최소한만 생성
    const recentPosts = await getRecentPosts(5);
    return recentPosts.map(post => ({ slug: post.slug }));
  }
  
  // 프로덕션에서는 모든 포스트 생성
  const allPosts = await getAllPosts();
  return allPosts.map(post => ({ slug: post.slug }));
}
```

## 중첩 동적 라우트 최적화

### 계층적 매개변수 생성
```typescript
// app/blog/[category]/[year]/[slug]/page.tsx
export async function generateStaticParams() {
  const posts = await getAllPostsWithMetadata();
  
  return posts.map(post => {
    const year = new Date(post.createdAt).getFullYear().toString();
    
    return {
      category: post.category,
      year,
      slug: post.slug
    };
  });
}
```

### 상위 매개변수 활용
```typescript
// app/blog/[category]/[slug]/page.tsx
export async function generateStaticParams({ 
  params 
}: {
  params: { category: string }
}) {
  // 특정 카테고리의 포스트만 생성
  const posts = await getPostsByCategory(params.category);
  
  return posts.map(post => ({
    slug: post.slug
  }));
}
```

## 오류 처리와 복원력

### 1. 안전한 매개변수 생성
```typescript
export async function generateStaticParams() {
  try {
    const posts = await getAllPosts();
    
    return posts
      .filter(post => {
        // 유효성 검사
        return post.slug && 
               typeof post.slug === 'string' && 
               post.slug.length > 0 &&
               !post.slug.includes('/'); // 슬래시 제거
      })
      .map(post => ({ 
        slug: post.slug.toLowerCase().trim() 
      }));
      
  } catch (error) {
    console.error('Error generating static params:', error);
    
    // 폴백으로 빈 배열 반환
    return [];
  }
}
```

### 2. 점진적 복구
```typescript
export async function generateStaticParams() {
  const results = [];
  const posts = await getAllPosts();
  
  for (const post of posts) {
    try {
      // 각 포스트를 개별적으로 검증
      const validatedPost = await validatePost(post);
      results.push({ slug: validatedPost.slug });
    } catch (error) {
      // 개별 포스트 오류는 로그만 남기고 계속 진행
      console.warn(`Skipping post ${post.slug}:`, error.message);
    }
  }
  
  return results;
}
```

## 국제화(i18n) 지원

### 다국어 매개변수 생성
```typescript
// app/[locale]/blog/[slug]/page.tsx
export async function generateStaticParams() {
  const locales = ['en', 'ko', 'ja'];
  const posts = await getAllPosts();
  
  const params = [];
  
  for (const locale of locales) {
    for (const post of posts) {
      // 해당 언어로 번역된 포스트만 포함
      if (post.translations[locale]) {
        params.push({
          locale,
          slug: post.slug
        });
      }
    }
  }
  
  return params;
}
```

## 모니터링과 디버깅

### 빌드 시간 측정
```typescript
export async function generateStaticParams() {
  const startTime = Date.now();
  
  console.log('Starting static params generation...');
  
  const posts = await getAllPosts();
  const params = posts.map(post => ({ slug: post.slug }));
  
  const endTime = Date.now();
  console.log(`Generated ${params.length} static params in ${endTime - startTime}ms`);
  
  return params;
}
```

### 매개변수 중복 검사
```typescript
export async function generateStaticParams() {
  const posts = await getAllPosts();
  const slugs = new Set();
  const duplicates = [];
  
  const params = posts
    .map(post => ({ slug: post.slug }))
    .filter(({ slug }) => {
      if (slugs.has(slug)) {
        duplicates.push(slug);
        return false;
      }
      slugs.add(slug);
      return true;
    });
  
  if (duplicates.length > 0) {
    console.warn('Duplicate slugs found:', duplicates);
  }
  
  return params;
}
```

## 실제 운영 사례

### 대규모 이커머스 사이트
```typescript
// 상품 페이지 생성 최적화
export async function generateStaticParams() {
  // 1. 인기 상품 우선 생성 (상위 1000개)
  const popularProducts = await getPopularProducts(1000);
  
  // 2. 재고가 있는 상품만 포함
  const availableProducts = popularProducts.filter(p => p.stock > 0);
  
  // 3. 카테고리별 균형 맞추기
  const balancedProducts = balanceByCategory(availableProducts, 50);
  
  return balancedProducts.map(product => ({
    category: product.category,
    slug: product.slug
  }));
}
```

### 뉴스/블로그 사이트
```typescript
export async function generateStaticParams() {
  const now = new Date();
  const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
  
  // 최근 1년간의 기사만 정적 생성
  const recentArticles = await getArticlesSince(oneYearAgo);
  
  // 조회수 기준 상위 500개 우선
  const topArticles = recentArticles
    .sort((a, b) => b.views - a.views)
    .slice(0, 500);
  
  return topArticles.map(article => ({ slug: article.slug }));
}
```

## 마무리

`generateStaticParams`는 강력한 도구이지만, 대규모 사이트에서는 신중한 전략이 필요합니다. 모든 페이지를 미리 생성하는 것보다는 중요한 페이지를 우선적으로 생성하고, 나머지는 필요에 따라 동적으로 생성하는 하이브리드 접근법이 효과적입니다.

다음 포스트에서는 마크다운 파싱과 remark 생태계의 고급 활용법을 다뤄보겠습니다.
