---
title: "Next.js SSG 심화 - 정적 사이트 생성으로 성능 극대화하기"
date: "2024-01-18"
description: "Next.js의 정적 사이트 생성(SSG) 기능을 활용해 번개처럼 빠른 웹사이트를 구축하는 방법과 최적화 기법을 소개합니다."
keywords: ["nextjs", "ssg", "static-generation", "performance", "optimization"]
---

# Next.js SSG 심화 - 정적 사이트 생성으로 성능 극대화하기

정적 사이트 생성(Static Site Generation)은 빌드 타임에 모든 페이지를 미리 생성하여 CDN에서 정적 파일로 제공하는 방식입니다. 이를 통해 극도로 빠른 로딩 속도와 뛰어난 SEO 성능을 달성할 수 있습니다.

## SSG vs SSR vs CSR 비교

### 렌더링 방식별 특징

| 방식 | 렌더링 시점 | 성능 | SEO | 동적 데이터 |
|------|------------|------|-----|------------|
| **SSG** | 빌드 타임 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | 제한적 |
| **SSR** | 요청 시점 | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **CSR** | 클라이언트 | ⭐⭐ | ⭐ | ⭐⭐⭐⭐⭐ |

### SSG가 적합한 경우
```typescript
// 블로그 포스트, 문서 사이트, 포트폴리오 등
// 내용이 자주 변경되지 않는 페이지들
export async function generateStaticParams() {
  // 빌드 타임에 모든 가능한 경로 생성
  const posts = await getAllPosts();
  
  return posts.map((post) => ({
    slug: post.slug,
  }));
}
```

## generateStaticParams 깊이 이해하기

### 기본 사용법
```typescript
// app/blog/[slug]/page.tsx
export async function generateStaticParams() {
  const posts = await fetch('https://api.example.com/posts')
    .then(res => res.json());
  
  // 반환된 객체의 키는 동적 세그먼트 이름과 일치해야 함
  return posts.map((post: any) => ({
    slug: post.slug, // [slug] 폴더명과 일치
  }));
}
```

### 중첩 동적 라우트
```typescript
// app/blog/[category]/[slug]/page.tsx
export async function generateStaticParams() {
  const posts = await getAllPostsWithCategories();
  
  return posts.map((post) => ({
    category: post.category,
    slug: post.slug,
  }));
}
```

### 부분 생성 (Partial Prerendering)
```typescript
// 모든 페이지를 미리 생성하지 않고 필요한 것만
export async function generateStaticParams() {
  // 인기 있는 포스트만 미리 생성
  const popularPosts = await getPopularPosts(50);
  
  return popularPosts.map((post) => ({
    slug: post.slug,
  }));
}

// 나머지는 요청 시 생성 (ISR과 함께 사용)
export const dynamic = 'force-static';
export const dynamicParams = true;
```

## 증분 정적 재생성 (ISR)

### 기본 ISR 설정
```typescript
// app/blog/[slug]/page.tsx
export const revalidate = 3600; // 1시간마다 재생성

export default async function BlogPost({ params }) {
  const post = await getPostBySlug(params.slug);
  
  return (
    <article>
      <h1>{post.title}</h1>
      <time>{post.lastModified}</time>
      <div>{post.content}</div>
    </article>
  );
}
```

### 조건부 재검증
```typescript
import { revalidateTag } from 'next/cache';

// API 라우트에서 수동 재검증
export async function POST(request: Request) {
  const { slug } = await request.json();
  
  // 특정 포스트만 재검증
  revalidateTag(`post-${slug}`);
  
  return Response.json({ revalidated: true });
}
```

## 고급 SSG 패턴

### 동적 sitemap.xml 생성
```typescript
// app/sitemap.ts
export default async function sitemap() {
  const posts = await getAllPosts();
  
  const postUrls = posts.map((post) => ({
    url: `https://yoursite.com/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));
  
  return [
    {
      url: 'https://yoursite.com',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    ...postUrls,
  ];
}
```

### 동적 robots.txt 생성
```typescript
// app/robots.ts
export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/'],
    },
    sitemap: 'https://yoursite.com/sitemap.xml',
  };
}
```

## 데이터 페칭 최적화

### 빌드 타임 데이터 캐싱
```typescript
// lib/cache.ts
const buildTimeCache = new Map();

export async function getCachedData(key: string, fetcher: () => Promise<any>) {
  if (buildTimeCache.has(key)) {
    return buildTimeCache.get(key);
  }
  
  const data = await fetcher();
  buildTimeCache.set(key, data);
  
  return data;
}

// 사용 예시
export async function getAllPosts() {
  return getCachedData('all-posts', async () => {
    const files = fs.readdirSync('content/posts');
    return files.map(processMarkdownFile);
  });
}
```

### 병렬 데이터 페칭
```typescript
export default async function BlogPost({ params }) {
  // 병렬로 데이터 페칭
  const [post, relatedPosts, author] = await Promise.all([
    getPostBySlug(params.slug),
    getRelatedPosts(params.slug, 3),
    getAuthorInfo(params.slug),
  ]);
  
  return (
    <article>
      <PostHeader post={post} author={author} />
      <PostContent content={post.content} />
      <RelatedPosts posts={relatedPosts} />
    </article>
  );
}
```

## 이미지 최적화와 SSG

### Next.js Image 컴포넌트와 SSG
```typescript
import Image from 'next/image';

// 정적 이미지 최적화
export default function OptimizedBlogPost({ post }) {
  return (
    <article>
      <Image
        src={post.coverImage}
        alt={post.title}
        width={800}
        height={400}
        priority // Above-the-fold 이미지에 사용
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,..." // 블러 placeholder
      />
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  );
}
```

### 동적 이미지 처리
```typescript
// 마크다운에서 이미지 경로 자동 최적화
export function optimizeMarkdownImages(content: string) {
  return content.replace(
    /!\[([^\]]*)\]\(([^)]+)\)/g,
    (match, alt, src) => {
      if (src.startsWith('/')) {
        return `<Image src="${src}" alt="${alt}" width={800} height={600} />`;
      }
      return match;
    }
  );
}
```

## 성능 측정과 모니터링

### Core Web Vitals 최적화
```typescript
// app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        {/* 중요한 리소스 미리 로드 */}
        <link rel="preload" href="/fonts/main.woff2" as="font" type="font/woff2" crossOrigin="" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        
        {/* 중요하지 않은 리소스 지연 로드 */}
        <link rel="preload" href="/api/analytics" as="fetch" crossOrigin="anonymous" />
      </head>
      <body>
        {children}
        
        {/* 분석 스크립트 지연 로드 */}
        <script defer src="/js/analytics.js" />
      </body>
    </html>
  );
}
```

### 빌드 시간 최적화
```typescript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // 병렬 빌드 활성화
  experimental: {
    cpus: 4,
  },
  
  // 이미지 최적화 설정
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 31536000, // 1년
  },
  
  // 번들 분석
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@': path.resolve(__dirname, 'src'),
      };
    }
    return config;
  },
};

module.exports = nextConfig;
```

## 실무에서의 SSG 전략

### 하이브리드 접근법
```typescript
// 일부는 SSG, 일부는 SSR
export const runtime = 'nodejs';

export default async function HybridPage({ params, searchParams }) {
  // 정적 콘텐츠
  const staticContent = await getStaticContent(params.slug);
  
  // 동적 콘텐츠 (댓글, 좋아요 수 등)
  const dynamicData = await getDynamicData(params.slug);
  
  return (
    <div>
      {/* SSG로 생성된 정적 부분 */}
      <StaticContent content={staticContent} />
      
      {/* 클라이언트에서 렌더링되는 동적 부분 */}
      <DynamicSection initialData={dynamicData} />
    </div>
  );
}
```

## 마무리

SSG는 성능과 SEO를 극대화할 수 있는 강력한 도구입니다. 하지만 모든 상황에 적합한 것은 아니므로, 프로젝트의 특성에 따라 SSG, SSR, 또는 하이브리드 접근법을 적절히 선택하는 것이 중요합니다.

다음 포스트에서는 generateStaticParams의 고급 활용법과 대규모 사이트에서의 최적화 전략을 더 자세히 다뤄보겠습니다.
