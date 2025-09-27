# 검색 페이지 중첩된 `<a>` 태그 문제 해결 가이드

## 문제 상황

검색 페이지(`src/app/search/page.tsx`)에서 동일한 중첩된 `<a>` 태그 오류가 발생:

```
In HTML, <a> cannot be a descendant of <a>.
This will cause a hydration error.
```

## 발생 위치

```html
<Card component={Link} href="/blog/post-slug">  <!-- 외부 <a> -->
  <CardContent>
    <Chip component={Link} href="/category/..."> <!-- 내부 <a> - 문제! -->
      카테고리
    </Chip>
    <Chip component={Link} href="/tag/...">      <!-- 내부 <a> - 문제! -->
      태그
    </Chip>
  </CardContent>
</Card>
```

## 해결 방법

### 1. 검색 페이지 구조 개선

**기존 문제가 있는 패턴:**
```typescript
// ❌ 중첩된 Link 컴포넌트
<Card component={Link} href={`/blog/${result.post.slug}`}>
  <CardContent>
    <Chip
      component={Link}  // 문제!
      href={`/category/${result.post.category}`}
    />
  </CardContent>
</Card>
```

**해결된 패턴:**
```typescript
// ✅ onClick 핸들러 사용
<Card component={Link} href={`/blog/${result.post.slug}`}>
  <CardContent>
    <Chip
      clickable
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        router.push(`/category/${result.post.category}`);
      }}
    />
  </CardContent>
</Card>
```

### 2. 서버/클라이언트 컴포넌트 분리

검색 페이지도 서버 컴포넌트와 클라이언트 컴포넌트로 분리:

```typescript
// 서버 컴포넌트 (메타데이터 + 데이터 로드)
export default async function SearchPage({ searchParams }) {
  const resolvedParams = await searchParams;
  const initialQuery = resolvedParams.q || '';
  
  // 서버에서 데이터 로드
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

// 클라이언트 컴포넌트 (상태 관리 + UI)
function SearchPageClient({ allPosts, allCategories, allTags, initialQuery }) {
  const router = useRouter();
  // 검색 로직과 UI
}
```

### 3. 클라이언트 전용 검색 함수

`fs` 모듈 의존성을 피하기 위해 클라이언트에서 검색 로직 구현:

```typescript
const searchPosts = (posts: any[], query: string) => {
  if (!query.trim()) return [];
  
  const searchTerm = query.toLowerCase();
  const results: any[] = [];
  
  posts.forEach(post => {
    let score = 0;
    const matchedFields: string[] = [];
    
    // 제목 검색 (가중치: 3)
    if (post.title.toLowerCase().includes(searchTerm)) {
      score += 3;
      matchedFields.push('title');
    }
    
    // 설명 검색 (가중치: 2)
    if (post.description?.toLowerCase().includes(searchTerm)) {
      score += 2;
      matchedFields.push('description');
    }
    
    // 카테고리 검색 (가중치: 2)
    if (post.category?.toLowerCase().includes(searchTerm)) {
      score += 2;
      matchedFields.push('category');
    }
    
    // 태그 검색 (가중치: 1.5)
    const matchingTags = post.tags?.filter((tag: string) => 
      tag.toLowerCase().includes(searchTerm)
    ) || [];
    if (matchingTags.length > 0) {
      score += matchingTags.length * 1.5;
      matchedFields.push('tags');
    }
    
    if (score > 0) {
      results.push({ post, score, matchedFields });
    }
  });
  
  return results.sort((a, b) => b.score - a.score);
};
```

## 수정된 컴포넌트 패턴

### 카테고리 Chip (검색 결과에서)
```typescript
{result.post.category && (
  <Box sx={{ mb: 2 }}>
    <Chip
      label={result.post.category}
      size="small"
      color="primary"
      variant="filled"
      clickable
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        router.push(`/category/${result.post.category}`);
      }}
    />
  </Box>
)}
```

### 태그 Chips (검색 결과에서)
```typescript
{result.post.tags?.map((tag: string, index: number) => (
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

### 카테고리/태그 탐색 섹션
```typescript
{/* 검색어가 없을 때 표시되는 섹션 */}
{!query && (
  <Box>
    {/* 카테고리 탐색 */}
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" gutterBottom>
        카테고리별 탐색
      </Typography>
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        {allCategories.map((category: any) => (
          <Chip
            key={category.slug}
            label={`${category.name} (${category.count})`}
            clickable
            variant="outlined"
            onClick={() => {
              router.push(`/category/${category.slug}`);
            }}
          />
        ))}
      </Box>
    </Box>
    
    {/* 태그 탐색 */}
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" gutterBottom>
        태그별 탐색
      </Typography>
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        {allTags.map((tag: any) => (
          <Chip
            key={tag.slug}
            label={`#${tag.name} (${tag.count})`}
            clickable
            variant="outlined"
            size="small"
            onClick={() => {
              router.push(`/tag/${tag.slug}`);
            }}
          />
        ))}
      </Box>
    </Box>
  </Box>
)}
```

## SearchInput 컴포넌트 개선

검색 페이지에서 사용할 수 있도록 `onSearch` callback 지원 추가:

```typescript
interface SearchInputProps {
  initialQuery?: string;
  placeholder?: string;
  autoFocus?: boolean;
  onSearch?: (query: string) => void; // 새로 추가
}

export default function SearchInput({ 
  initialQuery = '',
  placeholder = "검색어를 입력하세요...",
  autoFocus = false,
  onSearch 
}: SearchInputProps) {
  const handleSearch = (searchQuery: string) => {
    const trimmedQuery = searchQuery.trim();
    
    // onSearch callback이 제공된 경우 사용
    if (onSearch) {
      onSearch(trimmedQuery);
      return;
    }
    
    // 기본 동작: /search 페이지로 이동
    // ...
  };
}
```

## 파일 구조

수정이 필요한 파일들:

```
src/
├── app/
│   └── search/
│       └── page.tsx           # 새로운 검색 페이지
├── components/
│   └── SearchInput.tsx        # 개선된 검색 입력 컴포넌트
└── lib/
    └── posts.ts              # 기존 유지 (서버에서만 사용)
```

## 테스트 방법

1. **검색 페이지 접근**
   ```
   http://localhost:3000/search
   ```

2. **검색 기능 테스트**
   - 검색어 입력 후 엔터
   - 검색 결과 클릭 → 포스트 페이지 이동
   - 카테고리 클릭 → 카테고리 페이지 이동
   - 태그 클릭 → 태그 페이지 이동

3. **콘솔 오류 확인**
   - 브라우저 개발자 도구
   - Console에서 hydration 오류 없음 확인

## 교육적 가치

이 문제를 통해 학습할 수 있는 개념들:

1. **일관된 아키텍처**: 모든 페이지에서 동일한 패턴 적용
2. **컴포넌트 재사용**: SearchInput의 확장성 있는 설계
3. **클라이언트/서버 분리**: 환경별 적절한 로직 배치
4. **이벤트 처리**: 중첩된 클릭 이벤트의 올바른 처리
5. **사용자 경험**: 검색 기능의 직관적인 인터페이스

## 결론

검색 페이지에서도 동일한 중첩된 `<a>` 태그 문제가 해결됩니다:

- ✅ HTML 표준 준수
- ✅ React hydration 오류 해결
- ✅ 일관된 네비게이션 패턴
- ✅ 향상된 검색 사용자 경험

모든 페이지에서 동일한 패턴을 적용하여 일관성 있는 코드베이스를 유지할 수 있습니다.
