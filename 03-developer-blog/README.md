# Developer's Blog Platform

> **프로젝트 3 — 마크다운 블로그 시스템**
>
> 교육 목적: React / Next.js 경험이 없는 부서원을 대상으로 한 학습형 예제 프로젝트

---

## 목차

1. 소개
2. 학습 대상 및 목표
3. 사전 준비(필수 도구)
4. 프로젝트 설치 및 실행 방법
5. 프로젝트 구조(중요 파일 설명)
6. 주요 개념 및 이론 설명

   * React 기초
   * Next.js(App Router) 핵심 개념
   * Server / Client 컴포넌트
   * 동적 라우팅([slug])와 generateStaticParams
   * 파일 시스템 기반 데이터 처리(마크다운)
   * 정적 사이트 생성(SSG) 흐름
7. 마크다운 파일 작성 방법(실습 가이드)
8. 디버깅 & 자주 발생하는 오류와 해결법
9. 향후 확장 기능(다음 단계)
10. 기타(테스트, 빌드, 컨트리뷰션)

---

## 1. 소개

이 저장소는 **Next.js + MUI**를 사용한 간단한 마크다운 기반 블로그 플랫폼 예제입니다. 교육용으로 설계되어 있으며, React와 Next.js에 익숙하지 않은 분들도 단계적으로 따라오며 학습할 수 있도록 구성되어 있습니다.

`/src/blog/md` 폴더에 마크다운(`.md`) 파일을 추가하면 자동으로 목록에 노출되고, 각 항목을 클릭하면 마크다운이 HTML로 변환되어 상세 페이지에서 확인할 수 있습니다.

---

## 2. 학습 대상 및 목표

### 대상

* React와 Next.js 경험이 거의 없는 부서원
* 프론트엔드의 기본 개념(컴포넌트, props, 상태)을 배우고 싶은 분
* 파일 기반 콘텐츠(마크다운)를 이용한 정적 블로그 제작을 이해하고 싶은 분

### 초기 학습 목표 (이 프로젝트에서 달성할 것들)

* **동적 라우팅과 파라미터 처리** (예: `/blog/[slug]`)
* **파일 시스템 기반 데이터 처리** (프로젝트 내부의 `src/blog/md/*.md` 파일을 읽음)
* **정적 사이트 생성(SSG)**: 빌드 시점에 정적 페이지를 생성하는 흐름 이해

---

## 3. 사전 준비 (필수 도구)

* Node.js (v18 이상 권장)
* npm 또는 pnpm
* 에디터 (VSCode 권장)
* Git (PR/버전 관리용)

---

## 4. 프로젝트 설치 및 실행 방법

### 초기 프로젝트 생성 (이미 실행했다면 건너뛰세요)

```bash
npx create-next-app@latest 03-developer-blog
```

### 필요한 패키지 설치

(프로젝트 루트에서 실행)

```bash
npm install @mui/material @emotion/react @emotion/styled @mui/icons-material
npm install gray-matter remark remark-html
```

**향후 확장(선택)**

```bash
# 코드 하이라이팅(Prism) 적용 시
npm install prismjs remark-prism
# 읽기 시간 계산
npm install reading-time
# RSS 피드 생성
npm install rss
```

### 개발 서버 실행

```bash
npm run dev
# 브라우저에서 http://localhost:3000 접속
```

### 정적 빌드(SSG 동작 확인)

```bash
npm run build
npm run start
```

---

## 5. 프로젝트 구조(중요 파일 설명)

아래는 교육용으로 핵심이 되는 파일과 그 역할입니다.

```
src/
 ┣ app/
 ┃ ┣ layout.tsx           # 루트 레이아웃 (서버 컴포넌트)
 ┃ ┣ providers.tsx       # (클라이언트) MUI ThemeProvider를 분리하여 사용
 ┃ ┣ page.tsx            # 홈 페이지
 ┃ ┗ blog/
 ┃   ┣ page.tsx          # 블로그 목록 페이지 (getAllPosts 사용)
 ┃   ┗ [slug]/page.tsx   # 동적 라우트: 개별 포스트 출력 (generateStaticParams 사용)
 ┣ components/
 ┃ ┗ Header.tsx          # 상단 AppBar (MUI)
 ┣ lib/
 ┃ ┗ posts.ts            # 마크다운 로드/파싱 유틸 (fs + gray-matter + remark)
 ┗ blog/
   ┗ md/                 # 실제 마크다운 파일(.md)이 위치하는 폴더
```

### 핵심 파일별 설명 (프로젝트 코드를 기준으로)

* **`src/lib/posts.ts`**

  * `postsDirectory`를 기준으로 `fs.readdirSync()`로 `.md` 파일 목록을 읽습니다.
  * `gray-matter`로 front-matter(메타데이터: title, date 등)를 분리하고,
  * `remark().use(html)`를 사용해 마크다운 본문을 HTML로 변환합니다.
  * 이 모듈의 함수는 서버 환경(Node)에서 실행되어야 합니다(파일 시스템 접근 때문).

* **`src/app/blog/page.tsx`**

  * `getAllPosts()`를 호출하여 포스트 목록을 불러오고, MUI `List`로 렌더링합니다.
  * 목록 항목은 `/blog/[slug]`로 연결됩니다.

* **`src/app/blog/[slug]/page.tsx`**

  * `generateStaticParams()`를 구현하여 빌드 시점에 어떤 `slug`들을 정적 생성할지 Next.js에게 알려줍니다.
  * 페이지 컴포넌트는 `params`가 `Promise`로 전달되는 점에 유의하고 `const { slug } = await params;` 와 같이 사용합니다.
  * `getPostBySlug(slug)`로 마크다운을 파싱한 뒤, `dangerouslySetInnerHTML`로 변환된 HTML을 삽입해 렌더링합니다.

* **`src/app/providers.tsx`**

  * MUI의 `ThemeProvider` 및 `CssBaseline`은 **클라이언트 컴포넌트**로 분리되어야 합니다. (Next.js의 서버/클라이언트 직렬화 제약 때문)

---

## 6. 주요 개념 및 이론 설명

아래는 React와 Next.js의 기초 개념을 교육용으로 자세히 풀어 설명한 내용입니다.

### 6.1 React 기초(간단히)

* **컴포넌트(Component)**: UI를 작고 재사용 가능한 조각으로 나눈 것. 함수형 컴포넌트(예: `function Header() { ... }`)가 현재 표준입니다.
* **JSX**: JavaScript 내부에 HTML처럼 보이는 문법을 작성하는 방식. `return <div>Hello</div>` 같은 형태.
* **props**: 부모가 자식 컴포넌트에 전달하는 데이터(읽기 전용).
* **상태(state)**: 컴포넌트 내부에서 변경 가능한 데이터.

> 이 프로젝트에서는 상태 관리(예: useState) 사용을 최소화하고 파일 기반 콘텐츠 렌더링에 초점을 맞추어 기초에 익숙해지도록 설계했습니다.

### 6.2 Next.js (App Router) 핵심 개념

* **`src/app` 디렉토리**: App Router의 핵심. `page.tsx`, `layout.tsx` 등의 파일로 라우팅과 레이아웃을 구성합니다.
* **`layout.tsx`**: 해당 경로 아래의 모든 페이지에 적용되는 레이아웃. 예: 헤더, 푸터, 공통 스타일.
* **서버 컴포넌트 vs 클라이언트 컴포넌트**:

  * 기본적으로 `app` 디렉토리의 파일은 **서버 컴포넌트**입니다. 서버에서 렌더링되며 Node API(예: `fs`)를 직접 사용 가능합니다.
  * 클라이언트에서 동작해야 하는 컴포넌트(브라우저 이벤트, useState 사용 등)는 파일 최상단에 `"use client"`를 선언해야 합니다.

**왜 분리하는가?** 서버 컴포넌트는 서버에서 미리 렌더링하여 퍼포먼스를 높이고, 클라이언트 컴포넌트는 사용자 상호작용을 담당합니다. 또한 서버와 클라이언트 간에 전달 가능한 값은 제한됩니다(함수는 전달 불가).

### 6.3 동적 라우팅([slug]) 및 generateStaticParams

* **동적 라우팅**: 폴더명을 대괄호로 감싸면 동적 파라미터가 됩니다. 예: `src/app/blog/[slug]/page.tsx` → `slug`라는 변수로 접근 가능.
* **`params` 사용법(중요)**: Next.js는 `params`를 `Promise`로 전달할 수 있습니다. 따라서 페이지 컴포넌트에서 `params`를 받을 때는

  ```ts
  const { slug } = await params;
  ```

  처럼 `await`로 풀어서 사용해야 합니다.
* **`generateStaticParams()`**: SSG(정적 생성)를 위해 빌드 시점에 Next.js에 어떤 동적 경로들을 생성할지 알려주는 함수입니다. 이 프로젝트에서는 `getAllPosts()`를 사용해 모든 `.md` 파일의 슬러그 목록을 반환하고, 빌드 시 해당 경로들이 정적으로 생성됩니다.

### 6.4 파일 시스템 기반 데이터 처리(마크다운)

* **마크다운(.md) + front-matter**: 각 글은 마크다운 파일이며 문서 상단에 `---`로 감싼 메타데이터(예: `title`, `date`)를 작성합니다. 이 메타데이터를 `gray-matter`로 파싱합니다.
* **마크다운 파싱 흐름**:

  1. `fs.readdirSync(postsDirectory)`로 `.md` 파일 목록 조회
  2. `fs.readFileSync(fullPath, 'utf8')`로 파일 내용 읽기
  3. `matter(fileContents)`로 front-matter(메타데이터)와 본문 분리
  4. `remark().use(html).process(content)`로 마크다운을 HTML로 변환
  5. 페이지에서 `dangerouslySetInnerHTML`로 삽입

**보안 주의**: `dangerouslySetInnerHTML`는 XSS(크로스 사이트 스크립팅) 위험이 있을 수 있습니다. 이 프로젝트는 내부용 교육 예제이므로 간단히 사용하지만, 외부 입력을 허용하는 경우에는 추가적인 sanitization이 필요합니다.

### 6.5 정적 사이트 생성(SSG)의 이해

* **SSG 정의**: 빌드 시점에 HTML 파일을 미리 생성해 배포하는 방식.
* **장점**: 빠른 응답, CDN 배포에 유리, 비용 효율적
* **단점**: 빌드 후 콘텐츠 변경 시 재빌드 필요

이 프로젝트는 파일 기반 콘텐츠(로컬 마크다운)를 사용하므로 SSG가 적합합니다. `generateStaticParams()`를 통해 모든 `slug`를 빌드 시점에 생성하면 사용자에게 빠른 정적 페이지 제공이 가능합니다.

---

## 7. 마크다운 파일 작성 방법(실습 가이드)

1. `src/blog/md` 폴더를 생성합니다.
2. 새 파일을 추가합니다. 예: `post-hello.md`
3. 파일 상단에 front-matter를 추가합니다:

```md
---
title: "첫 번째 글"
date: "2025-09-01"
---

# 본문 제목

내용을 작성하세요.
```

4. 개발 서버가 실행 중이면 `/blog`에서 목록을 확인하고, 각 글을 클릭하여 내용 확인이 가능합니다.

---

## 8. 디버깅 & 자주 발생하는 오류와 해결법

아래는 이 프로젝트를 교육하면서 자주 만나는 문제들과 해결 방법입니다.

### 8.1 `ENOENT: no such file or directory, scandir '.../src/blog/md'`

**원인**: `src/blog/md` 디렉토리가 없어서 `fs.readdirSync()`가 실패함.
**해결**: 프로젝트 루트에 `src/blog/md` 폴더를 만들고 `.md` 파일을 추가하세요. 또는 `src/lib/posts.ts`에 `fs.existsSync()` 체크를 추가해 빈 배열을 반환하도록 방어코드를 넣을 수 있습니다.

### 8.2 `Functions cannot be passed directly to Client Components ...` (MUI 관련)

**원인**: 서버 컴포넌트에서 MUI `ThemeProvider` 혹은 `sx`에 함수형 값을 직렬화하여 클라이언트로 전달하려 할 때 발생.
**해결**:

* `ThemeProvider`는 `"use client"` 선언이 있는 `src/app/providers.tsx` 같은 클라이언트 컴포넌트로 분리하세요.
* `sx`에 함수 형태(`sx={{ p: (theme) => ... }}`) 대신, 빌드 시점에 값을 계산하거나 `theme.spacing(...)`을 직접 호출한 값을 전달하세요.
* MUI와 Next.js App Router를 함께 사용할 때는 `component={Link}`보다는 `Link`로 감싼 구조를 권장합니다.

### 8.3 `Route "/blog/[slug]" used params.slug. params should be awaited` 오류

**원인**: App Router에서 `params`가 `Promise`로 전달되므로 동기적으로 `params.slug`에 접근하면 에러 발생.
**해결**: 페이지 컴포넌트에서 `params`를 `await`으로 해제합니다.

```ts
const { slug } = await params;
```

---

## 9. 향후 확장 기능(다음 단계)

아래는 README 상단에 명시된 구현 기술 중 **현재 프로젝트에 적용된 항목**과 **다음 단계에서 구현할 항목**을 구분한 목록입니다.

### 현재 구현된 기술

* **동적 라우트 ([slug])**: `src/app/blog/[slug]/page.tsx`
* **generateStaticParams**: 빌드 시점에 slug 목록을 생성
* **마크다운 파싱**: `gray-matter`로 front-matter 파싱, `remark` + `remark-html`로 마크다운 -> HTML 변환

### 다음 단계(추가 구현 권장)

* **코드 하이라이팅 (Prism.js)**

  * 목적: 마크다운 내 코드 블록에 색상 하이라이트 적용
  * 구현 방향: `remark-prism` 또는 `rehype-prism-plus` 같은 plugin을 `remark` 파이프라인에 추가
  * 설치: `npm install prismjs remark-prism`
  * 적용 위치: `src/lib/posts.ts`의 remark 파이프라인

* **카테고리/태그 시스템**

  * 목적: 포스트를 분류하고 필터링할 수 있게 함
  * 구현 방향: front-matter에 `tags`, `category` 필드를 추가하고 `getAllPosts()`가 이를 반환하도록 확장
  * UI: `/blog` 목록에서 필터 드롭다운 혹은 태그 클라우드 추가

* **검색 기능**

  * 목적: 제목/본문/태그로 빠르게 검색
  * 구현 방향: 클라이언트 측 인덱싱(작은 데이터셋) 또는 빌드 시 인덱스 생성 후 클라이언트에서 필터링
  * 추가 패키지: `fuse.js` 등(옵션)

* **RSS 피드 생성**

  * 목적: 구독자에게 업데이트 알림 제공
  * 구현 방향: 빌드 시점에 `rss` 패키지를 이용해 `public/rss.xml` 생성

* **읽기 시간 계산**

  * 목적: 예상 읽기 시간을 표시하여 사용자 경험 향상
  * 구현 방향: `reading-time` 패키지 사용 또는 단어 수 기반 직접 계산

---

## 10. 기타 (테스트, 빌드, 컨트리뷰션)

* **기능 확인 및 테스트**

  * 개발 서버: `npm run dev` → `/blog` 및 `/blog/[slug]` 확인
  * 정적 빌드: `npm run build` 후 `npm run start`로 실행하여 SSG가 정상 동작하는지 확인

* **README 업데이트**: 기능 추가 시 `README.md`에 사용 방법과 예시 포스트를 갱신하세요.

* **PR 템플릿 예시**: PR 제출 시 아래 항목을 포함하면 검토에 도움이 됩니다.

  * 작업 내용 요약
  * 테스트 항목(정상 동작 여부)
  * 특별한 변경 사항(마이그레이션, 환경변수 등)

---

## 맺음말

이 문서는 교육용으로 실습하면서 React와 Next.js의 기초를 이해하도록 돕기 위해 작성되었습니다. 처음에는 어렵게 느껴질 수 있지만, 단계별로 파일을 수정하고 포스트를 추가해보면 Next.js의 서버/클라이언트 분리, 정적 생성 흐름, 파일 기반 데이터 처리 등의 개념이 빠르게 체득됩니다.

필요하시면 다음 단계에서 **Prism 코드 하이라이팅 적용 예시**, **태그/카테고리 확장**, **검색 UI 구현** 중 하나를 실제 코드로 확장해서 만들어 드리겠습니다.
