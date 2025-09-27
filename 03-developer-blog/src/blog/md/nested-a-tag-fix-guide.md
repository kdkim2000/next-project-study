---
title: "중첩된 `<a>` 태그 Hydration 오류 해결 가이드"
date: "2025-09-27"
description: "`<a>` 태그는 다른 `<a>` 태그를 포함할 수 없음"
keywords: ["nextjs", "react", "web-development", "javascript"]
category: "frontend"
tags: ["nextjs", "react", "performance", "web-development"]
---

## 문제 상황

```
In HTML, <a> cannot be a descendant of <a>.
This will cause a hydration error.
```

## 원인 분석

**HTML 표준 위반**: `<a>` 태그는 다른 `<a>` 태그를 포함할 수 없음

### 문제가 된 코드 패턴:
```typescript
<Card component={Link} href="/blog/post-slug">  // 외부 <a>
  <CardContent>
    <Chip
      component={Link}                           // 내부 <a> - 문제!
      href="/category/frontend"
    />
  </CardContent>
</Card>
```

### HTML 출력 결과:
```html
<a href="/blog/post-slug">
  <!-- 카드 내용 -->
  <a href="/category/frontend">카테고리</a>  <!-- 중첩된 <a> 오류! -->
</a>
```

## 해결 방법

### 1. 중첩된 Link 컴포넌트 제거

**Before (문제):**
```typescript
<Chip
  component={Link}
  href={`/category/${post.category}`}
  clickable
/>
```

**After (해결):**
```typescript
<Chip
  clickable
  onClick={(e) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/category/${post.category}`);
  }}
/>
```

### 2. 이벤트 전파 제어

- `e.preventDefault()`: 기본 동작 방지
- `e.stopPropagation()`: 이벤트 버블링 중지
- `router.push()`: Next.js 라우팅 사용

## 수정된 컴포넌트 패턴

### 카테고리 Chip
```typescript
{post.category && (
  <Box sx={{ mb: 2 }}>
    <Chip
      label={post.category}
      size="small"
      color="primary"
      variant="filled"
      clickable
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        router.push(`/category/${post.category}`);
      }}
    />
  </Box>
)}
```

### 태그 Chips
```typescript
{post.tags?.map((tag, index) => (
  <Chip 
    key={index}
    label={tag} 
    size="small" 
    variant="outlined"
    clickable
    onClick={(e) => {
      e.preventDefault();
      e.stopPropagation();
      router.push(`/tag/${tag}`);
    }}
  />
))}
```

## Next.js Router 사용법

### 1. Import 추가
```typescript
import { useRouter } from 'next/navigation';
```

### 2. 컴포넌트에서 사용
```typescript
export default function BlogClient({ initialPosts, categories, tags }) {
  const router = useRouter();
  
  // 클릭 핸들러에서 사용
  const handleChipClick = (url) => {
    router.push(url);
  };
}
```

## 장점과 단점

### onClick 방식의 장점
✅ HTML 표준 준수  
✅ Hydration 오류 방지  
✅ 이벤트 제어 가능  
✅ SPA 네비게이션 활용  

### 단점과 해결책
❌ 마우스 오른쪽 클릭 지원 안됨  
→ 해결: `onContextMenu` 핸들러 추가 가능

❌ SEO 링크 인식 제한  
→ 해결: 중요한 링크는 별도 처리 고려

## 다른 해결 방법들

### Option 1: 구조 재설계
```typescript
// 카드를 클릭 가능하게 만들지 않고, 제목만 링크로
<Card>
  <CardContent>
    <Link href={`/blog/${post.slug}`}>
      <Typography variant="h6">{post.title}</Typography>
    </Link>
    <Chip component={Link} href={`/category/${post.category}`} />
  </CardContent>
</Card>
```

### Option 2: Portal 사용
```typescript
// 중첩을 피하기 위해 DOM 구조 분리
// 복잡한 경우에만 고려
```

## 테스트 방법

1. **개발 서버 확인:**
   ```bash
   npm run dev
   ```

2. **콘솔 오류 확인:**
   - 브라우저 개발자 도구 열기
   - Console 탭에서 hydration 오류 사라짐 확인

3. **기능 테스트:**
   - 카드 클릭 → 포스트 페이지 이동
   - 카테고리 클릭 → 카테고리 페이지 이동
   - 태그 클릭 → 태그 페이지 이동

## 교육적 가치

이 문제를 통해 학습할 수 있는 개념:

1. **HTML 시맨틱**: 올바른 HTML 구조의 중요성
2. **React Hydration**: 서버와 클라이언트 렌더링 일치
3. **이벤트 처리**: preventDefault와 stopPropagation
4. **Next.js 라우팅**: useRouter 훅의 활용
5. **UX 설계**: 직관적인 네비게이션 패턴

이런 실제 문제를 해결하면서 웹 표준과 React의 동작 원리를 깊이 이해할 수 있습니다.

## 결론

중첩된 `<a>` 태그 문제는 웹 개발에서 자주 발생하는 실제 문제입니다. 이를 올바르게 해결하면:

- HTML 표준을 준수하는 깨끗한 마크업
- 안정적인 React hydration
- 향상된 사용자 경험
- SEO 친화적인 구조

를 모두 달성할 수 있습니다.
