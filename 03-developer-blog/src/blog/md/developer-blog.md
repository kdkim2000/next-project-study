---
title: "Next.js Blog 만들기"
date: "2025-01-15"
category: "Frontend"
tags: ["Next.js", "React", "Tutorial"]
excerpt: "Developer’s Blog "
---

# Developer’s Blog — 교육용 README

> **목표:** React/Next.js 경험이 없는 부서원이 이 프로젝트 하나로
> ① 동적 라우팅과 파라미터 처리, ② 파일 시스템 기반 데이터 처리, ③ 정적 사이트 생성(SSG)
> 을 이해하고, 직접 수정/확장할 수 있게 합니다.

## 무엇을 만들었나요?

Markdown 파일(`content/posts/*.md`)을 **데이터 소스**로 삼아, Next.js(App Router)로 **정적 블로그 사이트**를 생성합니다.

* 포스트 상세: `/posts/[slug]`
* 포스트 목록/카테고리/검색
* 코드 하이라이트(Prism.js)
* RSS 피드(`/rss.xml`)
* 읽기 시간 표시

UI는 학습 방해를 줄이기 위해 간단히 구성했고, 카드 렌더링에 **MUI(@mui/material)** 를 사용했습니다.

---

## 빠른 시작(Quick Start)

```bash
# 1) 의존성 설치
npm install

# 2) 개발 서버 실행
npm run dev
# http://localhost:3000
```

> Node LTS(예: 18/20) 사용을 권장합니다. 설치 후 첫 실행에서 오류가 나면
> `rm -rf node_modules package-lock.json && npm install`로 초기화 후 다시 실행하세요.

---

## 프로젝트 구조(핵심만)

```
src/
├─ app/                    # Next.js App Router 진입점
│  ├─ layout.tsx           # 전역 레이아웃 + Prism 로드
│  ├─ page.tsx             # 홈(Featured/Recent/Categories)
│  ├─ posts/
│  │  ├─ page.tsx          # 포스트 목록(SSG)
│  │  └─ [slug]/page.tsx   # 포스트 상세(동적 라우트 + SSG)
│  ├─ categories/
│  │  ├─ page.tsx          # 카테고리 목록
│  │  └─ [category]/page.tsx# 카테고리 상세(동적 라우트)
│  └─ rss.xml/route.ts     # RSS 피드
├─ components/
│  └─ PostCard.tsx         # MUI 카드(클라이언트 컴포넌트)
├─ lib/
│  └─ blog.ts              # 파일 시스템 접근/마크다운 파싱 (서버 전용)
└─ types/
   └─ blog.ts              # 타입 정의
content/
└─ posts/
   ├─ hello-world.md
   └─ featured-post.md
```

---

## React/Next 기본 이론 (아주 간단히)

* **컴포넌트**: 화면을 만드는 “함수”입니다. `function MyComp() { return <div/> }`
* **서버 컴포넌트 vs 클라이언트 컴포넌트**

  * *서버 컴포넌트*: 서버에서만 실행. Node API(`fs`, `path`) 사용 가능. 기본값.
  * *클라이언트 컴포넌트*: 브라우저에서 실행. `use client` 지시어가 파일 맨 위에 필요. **Node API 사용 불가**.
* **App Router**: `src/app/` 폴더 구조가 곧 라우팅입니다. 폴더명이 URL이 됩니다.
* **SSG**: 빌드 시 HTML을 만들어 CDN에서 서비스. 아주 빠르고 저렴합니다.

이 프로젝트의 핵심 규칙:

> **Node 내장 모듈(`fs`, `path`)을 사용하는 파일(`lib/blog.ts`)은 “서버 전용(server-only)”이고,
> 클라이언트 컴포넌트(예: `PostCard`)에서는 절대로 import 하지 않습니다.**

---

## 1. 동적 라우팅과 파라미터 처리 — `[slug]`

**폴더명이 곧 라우트 변수**입니다. `/posts/[slug]`는 `/posts/hello-world`처럼 접근합니다.

### 코드: `src/app/posts/[slug]/page.tsx` (발췌)

```tsx
export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export default async function PostDetailPage({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);
  if (!post) return notFound();
  // ...
}
```

* `generateStaticParams()`는 **빌드 시점에 생성할 URL 목록**을 반환합니다. (SSG 핵심)
* `params.slug`로 현재 페이지의 동적 파라미터를 받습니다.
* `notFound()`는 404 페이지로 이동시킵니다.

**실습**

1. `content/posts`에 새로운 `.md` 파일을 하나 복사/수정하세요.
2. 파일명(=slug)을 바꾸고, 다시 `npm run dev`.
3. `http://localhost:3000/posts/새파일명`으로 접근!

---

## 2. 파일 시스템 기반 데이터 처리

Markdown 파일을 **직접 읽고 파싱**합니다.

### 코드: `src/lib/blog.ts` (발췌)

```ts
import "server-only";      // 서버 전용!
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import readingTime from "reading-time";

const POSTS_DIR = path.join(process.cwd(), "content", "posts");

function listMarkdownFiles(): string[] {
  return fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".md") || f.endsWith(".mdx"));
}

export function getAllSlugs(): string[] {
  return listMarkdownFiles().map((f) => f.replace(/\.mdx?$/, ""));
}

export async function getPostBySlug(slug: string) {
  const filePath = path.join(POSTS_DIR, `${slug}.md`);
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);        // frontmatter 파싱
  const processed = await remark().use(html).process(content); // Markdown -> HTML
  const contentHtml = processed.toString();
  const rt = readingTime(content);              // 읽기 시간 계산
  // ...
}
```

* **`gray-matter`**: `---` 사이의 frontmatter를 객체로 파싱합니다.
* **`remark` + `remark-html`**: Markdown 본문을 HTML로 변환합니다.
* **`reading-time`**: 본문 길이로 읽기 시간을 추정합니다.
* **`server-only`**: 이 모듈이 절대 브라우저 번들에 포함되지 않도록 강제합니다.

**중요:** `lib/blog.ts`는 **서버에서만 import**하세요.
클라이언트 컴포넌트(예: `PostCard`)에서 import 하면 `fs 모듈 not found` 오류가 납니다.

---

## 3. 정적 사이트 생성(SSG)

이 프로젝트는 목록/상세/카테고리/검색 페이지를 **모두 정적으로 생성**합니다.

* `generateStaticParams()`로 **정적 URL**을 만들고,
* `export const dynamic = "force-static";`으로 **정적 모드**를 명시합니다.

### 예: 목록 페이지 `src/app/posts/page.tsx`

```tsx
export const dynamic = "force-static";

export default async function PostsPage() {
  const posts = await getAllPosts();
  // ...
}
```

### 예: 카테고리 상세 `src/app/categories/[category]/page.tsx`

```tsx
export async function generateStaticParams() {
  const posts = await getAllPosts();
  const set = new Set<string>();
  posts.forEach((p) => set.add(p.frontMatter.category ?? "uncategorized"));
  return [...set].map((category) => ({ category }));
}
```

**왜 SSG를 쓰나요?**

* Markdown 콘텐츠가 자주 바뀌지 않는 블로그는 **빌드 타임에 HTML을 만들어두면**
  매우 빠르고 안전합니다. 서버 비용도 줄어듭니다.

---

## 구현 기술 별 상세

### ✅ 동적 라우트 `[slug]` & `generateStaticParams`

* 위치: `src/app/posts/[slug]/page.tsx`
* 역할: 정적 상세 페이지 생성, `params.slug`로 파일 로드

### ✅ 마크다운 파싱 (gray-matter, remark)

* 위치: `src/lib/blog.ts` (`getPostBySlug`)
* 역할: frontmatter + 본문 HTML 변환

### ✅ 코드 하이라이팅 (Prism.js)

* 위치: `src/app/layout.tsx`

```tsx
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.30.0/themes/prism.min.css" />
<Script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.30.0/components/prism-core.min.js" strategy="afterInteractive" />
<Script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.30.0/plugins/autoloader/prism-autoloader.min.js" strategy="afterInteractive" />
```

* 사용법: Markdown 코드 블록에 언어 표시(\`\`\`ts, \`\`\`js 등)을 붙이면 자동 하이라이트.

### ✅ 카테고리/태그 시스템

* 위치: `src/lib/blog.ts` (`getCategoriesWithCount`)
* 카테고리 목록: `src/app/categories/page.tsx`
* 카테고리 상세: `src/app/categories/[category]/page.tsx`
* **표시**: 목록/상세/카드에서 `#category`, `#tag` 칩/텍스트로 노출

### ✅ 검색 기능 구현

* 위치: `src/app/search/page.tsx` (서버 컴포넌트, GET 폼)
* 검색 로직: `src/lib/blog.ts` (`searchPosts`)

  * 제목/요약/카테고리/태그 기준으로 필터
  * **API 불필요**: 서버 컴포넌트가 직접 `lib`를 호출

### ✅ RSS 피드 생성

* 위치: `src/app/rss.xml/route.ts`

```ts
export async function GET() {
  const posts = await getAllPosts();
  // posts -> <item>...</item> 로 직렬화하여 XML 반환
  return new NextResponse(xml, { headers: { "Content-Type": "application/rss+xml" } });
}
```

* 브라우저 `http://localhost:3000/rss.xml`에서 확인

### ✅ 읽기 시간 계산

* 위치: `src/lib/blog.ts` (`reading-time(content)`)
* 표시: 카드(`PostCard`)와 상세 페이지 상단 메타 정보에서 `xx min read` 텍스트로 노출

---

## UI 레이어(MUI)는 어디서 쓰나요?

* `src/components/PostCard.tsx`는 **클라이언트 컴포넌트**입니다.

  * MUI(Card/Chip 등) 사용
  * **데이터는 부모(서버 컴포넌트)에서 props로 전달**받습니다.
  * 여기서 `@/lib/blog`를 import하면 안 됩니다. (중요)

```tsx
"use client";
import { Card, Chip, ... } from "@mui/material";
export default function PostCard({ post }: { post: Post }) { /* ... */ }
```

---

## 실습 과제(Hands-on)

1. **새 글 추가**

   * `content/posts/2025-03-01-my-note.md` 파일을 만들고 frontmatter에
     `title`, `date`, `excerpt`, `category`, `tags`를 채운 뒤 본문을 작성하세요.
   * 목록/상세/검색/RSS에 반영되는지 확인합니다.

2. **추천 글(Featured) 지정**

   * 임의 글의 frontmatter에 `featured: true`를 추가.
   * 홈의 “Featured” 섹션에 노출되는지 확인합니다.

3. **태그 검색 테스트**

   * `/search?tags=introduction,sample` 과 같이 접근해 결과를 확인합니다.
   * `search/page.tsx`에서 GET 폼에 태그를 입력하고 제출해도 됩니다.

4. **카테고리 추가/변경**

   * 글의 `category` 값을 바꿔보고 `/categories`와 `/categories/[category]`에서 변화를 확인합니다.

---

## 자주 만나는 오류 & 해결

### ❌ `Module not found: Can't resolve 'fs'`

* 원인: 클라이언트 컴포넌트에서 `@/lib/blog`(= fs 사용)을 import함.
* 해결: `blog.ts`는 **서버 전용**입니다. 클라이언트 파일(예: `PostCard`)에서는 절대 import 금지.
  데이터는 상위 **서버 컴포넌트**에서 받아서 props로 전달하세요.

### ❌ Tailwind/PostCSS 관련 에러

* 원인: 예전 설정이 남아 있을 때 발생.
* 해결: Tailwind 관련 파일/패키지를 제거하고 `postcss.config.mjs`를 비워둡니다(이미 적용됨).

### ❌ 코드 하이라이트가 안 보임

* 원인: Prism CSS/Script가 로드되지 않았거나, 코드 블록 언어 지정 누락.
* 확인: `layout.tsx`의 `<link>`/`<Script>`가 그대로인지, Markdown 코드 블록에 언어가 있는지 확인.

### ❌ 새 글이 안 보임

* 확인: 파일 확장자 `.md`/`.mdx`인지, frontmatter에 `title`/`date`가 있는지 확인.
* 빌드/캐시 이슈일 수 있으니 서버를 재시작해 보세요.

---

## 용어 정리(Glossary)

* **Frontmatter**: Markdown 상단의 `---` 블록. 메타데이터(title, date, tags 등)를 넣습니다.
* **Slug**: URL 조각을 의미. 파일명(`hello-world.md`)이 곧 slug(`hello-world`).
* **SSG**: Static Site Generation. 빌드 시 HTML을 생성. 매우 빠르고 저렴.
* **서버/클라이언트 컴포넌트**: 실행 위치에 따른 분리. 서버는 Node API 가능, 클라이언트는 브라우저 전용.

---

## 다음 단계(확장 아이디어)

* 본문 전체 검색(현재는 제목/요약/카테고리/태그 기준)
* Sitemap 생성(`/sitemap.xml`)
* OG 이미지(소셜 공유 이미지) 자동 생성
* 카테고리/태그 페이지에 페이지네이션 추가
* 포스트 수백/수천개일 때 빌드 최적화(부분 빌드/캐싱)

---

## 체크리스트(학습 목표 달성 확인)

* [ ] `[slug]` 동적 라우팅을 설명할 수 있다.
* [ ] `generateStaticParams`가 무엇이며 언제 호출되는지 말할 수 있다.
* [ ] Markdown(frontmatter 포함)을 `gray-matter`로 파싱하고 `remark`로 HTML 변환하는 과정을 이해했다.
* [ ] `server-only`의 필요성과 클라이언트/서버 컴포넌트 분리를 설명할 수 있다.
* [ ] 카테고리/태그/검색/RSS/읽기 시간 기능이 어디에 구현되어 있는지 찾을 수 있다.
* [ ] 내 글을 추가/수정하고, 목록/상세/검색/RSS에 반영되는 것을 확인했다.

---

> **마지막 팁**
> 이 프로젝트는 “콘텐츠가 파일 시스템에 있는” 전형적인 **정적 블로그** 예제입니다.
> 사내 문서/튜토리얼/기술 노트 등에도 같은 패턴을 적용할 수 있습니다.
> 꼭 기능을 더하지 말고, **폴더 구조/데이터 흐름/서버-클라이언트 경계**를 확실히 이해하는 데 집중해 주세요.
