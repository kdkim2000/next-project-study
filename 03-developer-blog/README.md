# 프로젝트 3: 마크다운 블로그 시스템
# "Developer's Blog Platform"

## 📚 교육 목표

이 프로젝트를 통해 다음의 핵심 React/Next.js 개념들을 학습합니다:

1. **동적 라우팅과 파라미터 처리**: URL 경로에 따라 다른 컨텐츠를 동적으로 렌더링
2. **파일 시스템 기반 데이터 처리**: 마크다운 파일을 읽어서 웹 페이지로 변환
3. **정적 사이트 생성 (SSG)**: 빌드 타임에 모든 페이지를 미리 생성하여 성능 최적화

---

## 🎯 React/Next.js 핵심 개념 이해

### 1. 서버 컴포넌트 vs 클라이언트 컴포넌트

#### 서버 컴포넌트 (Server Components)
서버에서 실행되는 컴포넌트로, 파일 시스템 접근, 데이터베이스 쿼리 등이 가능합니다.

```tsx
// src/app/page.tsx - 서버 컴포넌트 예시
import { getAllPosts } from "@/lib/posts";

export default function HomePage() {
  // 서버에서 실행되므로 fs 모듈 사용 가능
  const recentPosts = getAllPosts().slice(0, 3);
  
  return (
    // JSX 반환
  );
}
```

**특징:**
- `"use client"` 지시어가 없음
- Node.js API 사용 가능 (`fs`, `path` 등)
- 초기 페이지 로딩이 빠름 (서버에서 렌더링 완료)
- SEO에 유리

#### 클라이언트 컴포넌트 (Client Components)
브라우저에서 실행되는 컴포넌트로, 사용자 인터랙션 처리가 가능합니다.

```tsx
// src/app/providers.tsx - 클라이언트 컴포넌트 예시
"use client";

import { ThemeProvider, CssBaseline } from "@mui/material";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
```

**특징:**
- `"use client"` 지시어 필요
- useState, useEffect 등 React Hooks 사용 가능
- 브라우저 이벤트 처리 가능
- Node.js API 사용 불가

---

## 🛠️ 구현된 핵심 기술들

### 1. 동적 라우팅과 파라미터 처리

#### 폴더 기반 라우팅 (App Router)
Next.js는 폴더 구조가 곧 URL 구조가 됩니다:

```
src/app/
├── page.tsx           → / (홈페이지)
├── blog/
│   ├── page.tsx       → /blog (블로그 목록)
│   └── [slug]/
│       └── page.tsx   → /blog/[slug] (개별 포스트)
```

#### 동적 라우트 ([slug])
`[slug]`는 동적 파라미터를 의미합니다. 사용자가 `/blog/next-js-guide`를 방문하면, `slug` 값이 "next-js-guide"가 됩니다.

```tsx
// src/app/blog/[slug]/page.tsx
type Props = {
  params: Promise<{ slug: string }>; // Next.js 15에서는 Promise 타입
};

export default async function BlogPostPage({ params }: Props) {
  // params는 비동기이므로 await 필요
  const resolvedParams = await params;
  
  // slug 값을 사용해 해당 포스트 데이터 가져오기
  const post = await getPostBySlug(resolvedParams.slug);
  
  return (
    <div>
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
    </div>
  );
}
```

**학습 포인트:**
- `[slug]`: 동적 파라미터 표현
- `params`: URL 파라미터를 담은 객체
- `await params`: Next.js 15의 비동기 API

### 2. 정적 사이트 생성 (SSG)

#### generateStaticParams
빌드 타임에 모든 가능한 동적 경로를 미리 생성합니다:

```tsx
// src/app/blog/[slug]/page.tsx
export async function generateStaticParams() {
  const posts = getAllPosts();
  
  // 모든 포스트의 slug를 반환
  return posts.map((post) => ({ 
    slug: post.slug 
  }));
}
```

**동작 원리:**
1. 빌드 시 `getAllPosts()`로 모든 포스트 목록 조회
2. 각 포스트의 slug로 정적 페이지 생성
3. 결과: `/blog/post1`, `/blog/post2`, ... 모든 페이지가 HTML로 생성됨

**장점:**
- 빠른 페이지 로딩 (이미 생성된 HTML 제공)
- 서버 부하 감소
- SEO 최적화

### 3. 파일 시스템 기반 데이터 처리

#### 마크다운 파일 구조
```
src/blog/md/
├── sample-post.md
├── next-js-guide.md
└── react-basics.md
```

#### 프론트매터 (Front Matter)
마크다운 파일 상단의 메타데이터:

```markdown
---
title: "Next.js 블로그 시스템 구축하기"
date: "2024-01-15"
description: "Next.js와 TypeScript를 사용하여 현대적인 블로그 시스템을 구축하는 방법"
keywords: ["nextjs", "typescript", "blog", "react"]
---

# 실제 마크다운 내용
이 포스트에서는...
```

#### 파일 처리 로직
```tsx
// src/lib/posts.ts
import fs from "fs";
import path from "path";
import matter from "gray-matter";

export function getAllPosts(): PostData[] {
  // 1. 마크다운 파일들이 있는 디렉토리
  const postsDirectory = path.join(process.cwd(), "src/blog/md");
  
  // 2. 디렉토리의 모든 파일명 읽기
  const fileNames = fs.readdirSync(postsDirectory);

  return fileNames.map((fileName) => {
    // 3. 파일명에서 확장자 제거 → slug 생성
    const slug = fileName.replace(/\.md$/, "");
    
    // 4. 파일 내용 읽기
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");

    // 5. gray-matter로 프론트매터와 내용 분리
    const { data, content } = matter(fileContents);
    
    // 6. 읽기 시간 계산
    const stats = readingTime(content);

    return {
      slug,
      title: data.title || slug,
      date: data.date || null,
      description: data.description || null,
      keywords: data.keywords || [],
      readingTime: stats,
    };
  });
}
```

**학습 포인트:**
- `fs.readdirSync()`: 동기적으로 디렉토리 내용 읽기
- `gray-matter`: YAML 프론트매터 파싱
- `reading-time`: 텍스트 읽기 시간 자동 계산

### 4. 마크다운을 HTML로 변환

#### Remark와 Rehype를 이용한 처리 파이프라인
```tsx
// src/lib/posts.ts
import { remark } from "remark";
import remarkRehype from "remark-rehype";
import rehypePrism from "rehype-prism-plus";
import rehypeStringify from "rehype-stringify";

export async function getPostBySlug(slug: string): Promise<PostWithContent> {
  // 파일 읽기 및 파싱
  const { data, content } = matter(fileContents);

  // 마크다운 → HTML 변환 파이프라인
  const processedContent = await remark()
    .use(remarkRehype, { allowDangerousHtml: true })  // MD → HTML AST
    .use(rehypePrism, { ignoreMissing: true })         // 코드 하이라이팅
    .use(rehypeStringify, { allowDangerousHtml: true }) // HTML 문자열
    .process(content);
    
  const contentHtml = processedContent.toString();
  
  return {
    // 메타데이터와 HTML 내용 반환
    contentHtml,
    // ...기타 필드들
  };
}
```

**처리 과정:**
1. `remark`: 마크다운을 파싱하여 AST(Abstract Syntax Tree) 생성
2. `remarkRehype`: 마크다운 AST를 HTML AST로 변환
3. `rehypePrism`: 코드 블록에 문법 하이라이팅 적용
4. `rehypeStringify`: HTML AST를 HTML 문자열로 변환

### 5. 코드 하이라이팅 (Prism.js)

#### 코드 하이라이팅 적용 과정
```tsx
// 1. 마크다운에서 코드 블록
```typescript
interface Props {
  title: string;
}
```

// 2. rehype-prism-plus가 변환한 HTML
<pre class="language-typescript">
  <code class="language-typescript">
    <span class="token keyword">interface</span>
    <span class="token class-name">Props</span> {
      title: <span class="token builtin">string</span>;
    }
  </code>
</pre>
```

#### CSS 스타일링
```tsx
// src/app/layout.tsx
<head>
  {/* Prism.js 테마 CSS */}
  <link 
    href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css" 
    rel="stylesheet" 
  />
</head>
```

### 6. SEO 최적화

#### 동적 메타데이터 생성
```tsx
// src/app/blog/[slug]/page.tsx
export async function generateMetadata({ params }: Props) {
  const resolvedParams = await params;
  const post = await getPostBySlug(resolvedParams.slug);
  
  return {
    title: `${post.title} | Developer's Blog`,
    description: post.description || `${post.title}에 대한 개발 블로그 포스트입니다.`,
    keywords: post.keywords?.join(', ') || 'development, programming, blog',
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
    },
  };
}
```

**SEO 요소들:**
- `title`: 페이지 제목
- `description`: 검색 결과에 표시될 설명
- `keywords`: 검색 키워드
- `openGraph`: 소셜 미디어 공유 시 표시될 정보

### 7. TypeScript 인터페이스 활용

#### 타입 정의로 데이터 구조 명시화
```tsx
// src/lib/posts.ts
export interface PostData {
  slug: string;           // URL 경로용 슬러그
  title: string;          // 포스트 제목
  date: string | null;    // 작성일 (optional)
  description?: string;   // 설명 (optional)
  keywords?: string[];    // 키워드 배열 (optional)
  readingTime?: {         // 읽기 시간 정보 (optional)
    text: string;         // "5 min read"
    minutes: number;      // 5
    time: number;         // 밀리초
    words: number;        // 단어 수
  };
}

export interface PostWithContent extends PostData {
  contentHtml: string;    // HTML로 변환된 내용
}
```

**TypeScript 장점:**
- 컴파일 타임에 오류 검출
- IDE에서 자동완성 지원
- 코드의 의도를 명확하게 표현

---

## 🎨 UI/UX 구현

### 1. Material-UI 컴포넌트 활용

#### 카드 기반 블로그 목록
```tsx
// src/app/blog/page.tsx
<Card 
  component={Link} 
  href={`/blog/${post.slug}`}
  sx={{ 
    textDecoration: 'none',
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: 2
    }
  }}
>
  <CardContent>
    <Typography variant="h6" component="h2">
      {post.title}
    </Typography>
    {/* 메타 정보 표시 */}
  </CardContent>
</Card>
```

### 2. 반응형 디자인
```tsx
// 그리드 레이아웃
<Box sx={{ 
  display: 'grid', 
  gap: 2, 
  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' 
}}>
```

---

## 📂 프로젝트 구조

```
src/
├── app/                    # App Router 구조
│   ├── layout.tsx         # 전역 레이아웃
│   ├── page.tsx           # 홈페이지
│   ├── providers.tsx      # MUI 테마 프로바이더
│   └── blog/
│       ├── page.tsx       # 블로그 목록 페이지
│       └── [slug]/
│           └── page.tsx   # 개별 포스트 페이지
├── components/            # 재사용 가능한 컴포넌트
│   └── Header.tsx         # 네비게이션 헤더
├── lib/                   # 유틸리티 함수들
│   └── posts.ts           # 포스트 데이터 처리
├── theme/                 # MUI 테마 설정
│   └── theme.ts
└── blog/md/              # 마크다운 포스트 파일들
    ├── sample-post.md
    └── ...
```

---

## 🚀 시작하기

### 1. 개발 환경 설정

```bash
# 의존성 설치
npm install

# 필요한 추가 패키지 설치
npm install rehype-prism-plus rehype-stringify remark-rehype reading-time

# 개발 서버 실행
npm run dev
```

### 2. 첫 번째 블로그 포스트 작성

`src/blog/md/my-first-post.md` 파일을 생성하세요:

```markdown
---
title: "나의 첫 번째 블로그 포스트"
date: "2024-01-20"
description: "Next.js와 React를 배우면서 작성한 첫 번째 포스트입니다."
keywords: ["nextjs", "react", "첫글"]
---

# 나의 첫 번째 블로그 포스트

안녕하세요! 이것은 제가 작성한 첫 번째 블로그 포스트입니다.

## 학습한 내용

1. React 컴포넌트 작성법
2. Next.js App Router 사용법
3. 마크다운 파일 처리

```typescript
// 간단한 React 컴포넌트 예시
function Greeting({ name }: { name: string }) {
  return <h1>안녕하세요, {name}님!</h1>;
}
```

앞으로 더 많은 내용을 학습하며 포스트를 작성해보겠습니다.
```

### 3. 빌드 및 배포

```bash
# 정적 사이트 생성
npm run build

# 생성된 정적 파일들 확인
npm run start
```

---

## 📚 다음 단계에서 구현할 기능들

현재 프로젝트에서는 기본적인 블로그 시스템을 구현했습니다. 다음 단계에서 추가할 수 있는 기능들:

### 🔍 검색 기능
- 포스트 제목, 내용, 태그 기반 검색
- 클라이언트 사이드 또는 서버 사이드 검색 구현

### 🏷️ 카테고리/태그 시스템
```tsx
// 향후 구현 예시
/blog/tags/[tag]     // 태그별 포스트 목록
/blog/category/[cat] // 카테고리별 포스트 목록
```

### 📡 RSS 피드 생성
```tsx
// 향후 구현 예시
/rss.xml            // RSS 피드 엔드포인트
```

### 📱 추가 UI/UX 개선
- 다크 모드 지원
- 목차 (Table of Contents) 자동 생성
- 포스트 간 이동 (이전글/다음글)
- 소셜 미디어 공유 버튼

---

## 🤔 자주 묻는 질문 (FAQ)

### Q: 서버 컴포넌트에서 useState를 사용할 수 없는 이유는?
A: 서버 컴포넌트는 서버에서 한 번만 실행되고 HTML을 생성합니다. useState는 클라이언트에서 상태를 관리하는 Hook이므로 서버 컴포넌트에서는 사용할 수 없습니다.

### Q: params가 Promise인 이유는?
A: Next.js 15부터 성능 최적화를 위해 동적 라우트 매개변수들이 비동기로 처리됩니다. 이를 통해 라우팅 성능이 향상됩니다.

### Q: 마크다운 파일을 어디에 저장해야 하나요?
A: 현재는 `src/blog/md/` 폴더에 저장하고 있습니다. 이는 파일 시스템 기반의 간단한 방법이며, 나중에 데이터베이스나 CMS로 변경할 수 있습니다.

### Q: 코드 하이라이팅이 적용되지 않는다면?
A: Prism.js CSS 파일이 올바르게 로드되었는지 확인하세요. 또한 마크다운에서 코드 블록을 작성할 때 언어를 명시해야 합니다 (예: \`\`\`typescript).

---

## 📖 추가 학습 자료

### React 기초 개념
- 컴포넌트와 JSX
- Props와 State
- 이벤트 핸들링
- 생명주기와 Hooks

### Next.js 심화 학습
- App Router vs Pages Router
- 서버 사이드 렌더링(SSR) vs 정적 사이트 생성(SSG)
- API Routes
- 미들웨어 활용

### TypeScript 활용
- 인터페이스와 타입 정의
- 제네릭 활용
- 유틸리티 타입들

---

이 프로젝트를 통해 React와 Next.js의 핵심 개념들을 실무에 가까운 환경에서 학습할 수 있습니다. 코드를 직접 수정하고 실험해보면서 더 깊이 있는 이해를 얻으시기 바랍니다! 🚀