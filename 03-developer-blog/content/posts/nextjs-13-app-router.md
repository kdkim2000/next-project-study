---
title: "Next.js 13 App Router: 새로운 라우팅 시스템 완벽 가이드"
excerpt: "Next.js 13에서 도입된 App Router의 모든 것을 알아보세요. 파일 시스템 기반 라우팅부터 서버 컴포넌트, 레이아웃까지 실무에 바로 적용할 수 있는 내용을 다룹니다."
date: "2024-12-10"
author: "이프론트"
category: "Next.js"
tags: ["Next.js", "App Router", "React", "SSR"]
featured: true
---

# Next.js 13 App Router: 새로운 라우팅 시스템

Next.js 13에서 도입된 App Router는 기존의 Pages Router를 대체하는 새로운 라우팅 시스템입니다. 더 직관적인 파일 구조와 강력한 기능들을 제공합니다.

## App Router vs Pages Router

### 기존 Pages Router 구조

```
pages/
  index.js          # /
  about.js          # /about
  blog/
    index.js        # /blog
    [slug].js       # /blog/[slug]
  _app.js
  _document.js
```

### 새로운 App Router 구조

```
app/
  layout.js         # 루트 레이아웃
  page.js           # /
  about/
    page.js         # /about
  blog/
    layout.js       # 블로그 레이아웃
    page.js         # /blog
    [slug]/
      page.js       # /blog/[slug]
  loading.js        # 로딩 UI
  error.js          # 에러 UI
```

## 핵심 개념들

### 1. 특수 파일들

App Router에서는 특별한 의미를 가지는 파일들이 있습니다:

- `page.js`: 페이지 컴포넌트
- `layout.js`: 레이아웃 컴포넌트
- `loading.js`: 로딩 UI
- `error.js`: 에러 UI
- `not-found.js`: 404 페이지
- `route.js`: API 라우트

### 2. 레이아웃 시스템

```javascript
// app/layout.js - 루트 레이아웃
export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        <header>
          <nav>네비게이션</nav>
        </header>
        <main>{children}</main>
        <footer>푸터</footer>
      </body>
    </html>
  );
}
```

```javascript
// app/blog/layout.js - 중첩 레이아웃
export default function BlogLayout({ children }) {
  return (
    <div className="blog-container">
      <aside>
        <h3>최근 포스트</h3>
        {/* 사이드바 내용 */}
      </aside>
      <div className="blog-content">
        {children}
      </div>
    </div>
  );
}
```

### 3. 서버 컴포넌트와 클라이언트 컴포넌트

```javascript
// app/blog/page.js - 서버 컴포넌트 (기본)
async function getBlogPosts() {
  const res = await fetch('https://api.example.com/posts');
  return res.json();
}

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <div>
      <h1>블로그 포스트</h1>
      {posts.map(post => (
        <article key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.excerpt}</p>
        </article>
      ))}
    </div>
  );
}
```

```javascript
// components/SearchBox.js - 클라이언트 컴포넌트
'use client';

import { useState } from 'react';

export default function SearchBox() {
  const [query, setQuery] = useState('');

  return (
    <input
      type="text"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="검색어를 입력하세요"
    />
  );
}
```

## 동적 라우팅

### 1. 기본 동적 라우팅

```javascript
// app/blog/[slug]/page.js
export default function BlogPost({ params }) {
  return (
    <div>
      <h1>포스트: {params.slug}</h1>
    </div>
  );
}

// 정적 경로 생성
export async function generateStaticParams() {
  const posts = await fetch('https://api.example.com/posts').then(res => res.json());
  
  return posts.map(post => ({
    slug: post.slug
  }));
}
```

### 2. 캐치올 라우팅

```javascript
// app/docs/[...slug]/page.js
export default function DocsPage({ params }) {
  // /docs/guide/getting-started -> params.slug = ['guide', 'getting-started']
  return (
    <div>
      <h1>문서: {params.slug.join('/')}</h1>
    </div>
  );
}
```

### 3. 옵셔널 캐치올 라우팅

```javascript
// app/shop/[[...slug]]/page.js
export default function ShopPage({ params }) {
  // /shop -> params.slug = undefined
  // /shop/clothes -> params.slug = ['clothes']
  // /shop/clothes/shirts -> params.slug = ['clothes', 'shirts']
  
  return (
    <div>
      {params.slug ? (
        <h1>카테고리: {params.slug.join('/')}</h1>
      ) : (
        <h1>전체 상품</h1>
      )}
    </div>
  );
}
```

## 데이터 페칭

### 1. 서버에서 데이터 페칭

```javascript
// app/products/page.js
async function getProducts() {
  const res = await fetch('https://api.example.com/products', {
    // 캐싱 옵션
    next: { revalidate: 60 } // 60초마다 재검증
  });
  
  if (!res.ok) {
    throw new Error('데이터를 불러올 수 없습니다');
  }
  
  return res.json();
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div>
      <h1>상품 목록</h1>
      {products.map(product => (
        <div key={product.id}>
          <h2>{product.name}</h2>
          <p>{product.price}원</p>
        </div>
      ))}
    </div>
  );
}
```

### 2. 병렬 데이터 페칭

```javascript
// app/dashboard/page.js
async function getUser() {
  const res = await fetch('https://api.example.com/user');
  return res.json();
}

async function getPosts() {
  const res = await fetch('https://api.example.com/posts');
  return res.json();
}

export default async function Dashboard() {
  // 병렬로 데이터 페칭
  const [user, posts] = await Promise.all([
    getUser(),
    getPosts()
  ]);

  return (
    <div>
      <h1>안녕하세요, {user.name}님!</h1>
      <div>
        <h2>최근 포스트</h2>
        {posts.map(post => (
          <article key={post.id}>
            <h3>{post.title}</h3>
          </article>
        ))}
      </div>
    </div>
  );
}
```

## 로딩과 에러 처리

### 1. 로딩 UI

```javascript
// app/blog/loading.js
export default function Loading() {
  return (
    <div className="loading">
      <div className="spinner"></div>
      <p>블로그 포스트를 불러오는 중...</p>
    </div>
  );
}
```

### 2. 에러 처리

```javascript
// app/blog/error.js
'use client';

export default function Error({ error, reset }) {
  return (
    <div className="error">
      <h2>문제가 발생했습니다!</h2>
      <p>{error.message}</p>
      <button onClick={reset}>다시 시도</button>
    </div>
  );
}
```

### 3. 404 페이지

```javascript
// app/not-found.js
export default function NotFound() {
  return (
    <div>
      <h1>404 - 페이지를 찾을 수 없습니다</h1>
      <p>요청하신 페이지가 존재하지 않습니다.</p>
    </div>
  );
}
```

## API 라우트

### 1. 기본 API 라우트

```javascript
// app/api/posts/route.js
export async function GET() {
  const posts = await fetch('https://api.example.com/posts');
  return Response.json(posts);
}

export async function POST(request) {
  const body = await request.json();
  
  // 포스트 생성 로직
  const newPost = await createPost(body);
  
  return Response.json(newPost, { status: 201 });
}
```

### 2. 동적 API 라우트

```javascript
// app/api/posts/[id]/route.js
export async function GET(request, { params }) {
  const post = await getPostById(params.id);
  
  if (!post) {
    return new Response('포스트를 찾을 수 없습니다', { status: 404 });
  }
  
  return Response.json(post);
}

export async function PUT(request, { params }) {
  const body = await request.json();
  const updatedPost = await updatePost(params.id, body);
  
  return Response.json(updatedPost);
}

export async function DELETE(request, { params }) {
  await deletePost(params.id);
  return new Response(null, { status: 204 });
}
```

## 메타데이터 관리

### 1. 정적 메타데이터

```javascript
// app/blog/page.js
export const metadata = {
  title: '블로그',
  description: '최신 기술 블로그 포스트들',
  keywords: ['블로그', '기술', '개발'],
};

export default function BlogPage() {
  return <div>블로그 페이지</div>;
}
```

### 2. 동적 메타데이터

```javascript
// app/blog/[slug]/page.js
export async function generateMetadata({ params }) {
  const post = await getPost(params.slug);
  
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.image],
    },
  };
}
```

## 마이그레이션 팁

### Pages Router에서 App Router로

1. **점진적 마이그레이션**: 한 번에 모든 페이지를 마이그레이션하지 말고 점진적으로 진행
2. **공존 가능**: Pages Router와 App Router는 같은 프로젝트에서 공존 가능
3. **서버 컴포넌트 우선**: 기본적으로 서버 컴포넌트를 사용하고, 필요시에만 클라이언트 컴포넌트로

## 결론

App Router는 Next.js의 미래입니다. 더 직관적인 파일 구조, 강력한 레이아웃 시스템, 그리고 서버 컴포넌트의 장점을 활용하여 더 나은 개발 경험을 제공합니다. 기존 프로젝트를 점진적으로 마이그레이션하거나 새 프로젝트에서 App Router를 적극 활용해보시기 바랍니다!