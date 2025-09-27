---
title: "Next.js 블로그 카테고리/태그 시스템 구축 - 콘텐츠 조직화의 완성"
date: "2024-01-22"
description: "계층적 카테고리와 플렉서블한 태그 시스템을 구현하여 사용자가 원하는 콘텐츠를 쉽게 찾을 수 있는 블로그를 만들어봅니다."
keywords: ["nextjs", "category", "tags", "taxonomy", "content-organization", "filtering"]
---

# Next.js 블로그 카테고리/태그 시스템 구축

콘텐츠가 늘어날수록 적절한 분류 시스템의 중요성이 커집니다. 카테고리는 계층적 구조를 제공하고, 태그는 유연한 분류를 가능하게 합니다. 두 시스템을 효과적으로 조합하여 사용자 경험을 향상시켜봅시다.

## 분류 시스템 설계 철학

### 카테고리 vs 태그
```typescript
// 카테고리: 계층적, 배타적 분류
interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parent?: string;      // 상위 카테고리
  children?: string[];  // 하위 카테고리들
  postCount: number;
  color?: string;       // 브랜딩용
}

// 태그: 평면적, 포괄적 분류
interface Tag {
  id: string;
  name: string;
  slug: string;
  description?: string;
  postCount: number;
  relatedTags?: string[]; // 관련 태그들
}
```

### 실제 사용 예시
```yaml
# 포스트의 Front Matter
---
title: "Next.js 15 새로운 기능들"
category: "frontend/nextjs"    # 계층적 카테고리
tags: ["nextjs", "react", "performance", "ssr"] # 다중 태그
---
```

## 데이터 구조와 타입 정의

### 포스트 메타데이터 확장
```typescript
// types/content.ts
export interface PostMetadata {
  slug: string;
  title: string;
  date: string;
  description?: string;
  
  // 분류 시스템
  category: string;        // 단일 카테고리 (필수)
  tags: string[];          // 다중 태그
  series?: string;         // 연재 시리즈
  
  // 추가 메타데이터
  featured: boolean;       // 추천 포스트
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  readingTime?: number;
  
  // SEO
  keywords?: string[];
  ogImage?: string;
}

export interface CategoryData extends Category {
  posts: PostMetadata[];
  subcategories?: CategoryData[];
}

export interface TagData extends Tag {
  posts: PostMetadata[];
}
```

### 분류법(Taxonomy) 구조
```typescript
// lib/taxonomy.ts
export class Taxonomy {
  private categories: Map<string, Category> = new Map();
  private tags: Map<string, Tag> = new Map();
  private posts: PostMetadata[] = [];
  
  constructor(posts: PostMetadata[]) {
    this.posts = posts;
    this.buildTaxonomy();
  }
  
  private buildTaxonomy() {
    // 카테고리 구조 구축
    this.posts.forEach(post => {
      this.addCategory(post.category);
      post.tags.forEach(tag => this.addTag(tag));
    });
    
    // 계층 구조 설정
    this.buildCategoryHierarchy();
    
    // 관련 태그 계산
    this.calculateTagRelations();
  }
  
  private addCategory(categoryPath: string) {
    const segments = categoryPath.split('/');
    let currentPath = '';
    
    segments.forEach((segment, index) => {
      currentPath += (index > 0 ? '/' : '') + segment;
      
      if (!this.categories.has(currentPath)) {
        const parentPath = index > 0 ? 
          segments.slice(0, index).join('/') : undefined;
          
        this.categories.set(currentPath, {
          id: currentPath,
          name: segment,
          slug: currentPath,
          parent: parentPath,
          children: [],
          postCount: 0
        });
      }
    });
  }
}
```

## 카테고리 페이지 구현

### 동적 카테고리 라우팅
```
app/
├── category/
│   └── [category]/
│       └── page.tsx         → /category/frontend
├── category/
│   └── [...segments]/
│       └── page.tsx         → /category/frontend/nextjs
```

### 카테고리 페이지 컴포넌트
```typescript
// app/category/[...segments]/page.tsx
interface CategoryPageProps {
  params: Promise<{ segments: string[] }>;
  searchParams: Promise<{ page?: string; sort?: string }>;
}

export async function generateStaticParams() {
  const taxonomy = new Taxonomy(await getAllPosts());
  const categories = taxonomy.getAllCategories();
  
  return categories.map(category => ({
    segments: category.slug.split('/')
  }));
}

export default async function CategoryPage({ 
  params, 
  searchParams 
}: CategoryPageProps) {
  const { segments } = await params;
  const { page = '1', sort = 'date' } = await searchParams;
  
  const categoryPath = segments.join('/');
  const category = await getCategoryData(categoryPath);
  
  if (!category) {
    notFound();
  }
  
  // 페이지네이션 설정
  const postsPerPage = 10;
  const currentPage = parseInt(page);
  const sortedPosts = sortPosts(category.posts, sort);
  const paginatedPosts = paginatePosts(sortedPosts, currentPage, postsPerPage);
  
  return (
    <div className="category-page">
      <CategoryHeader category={category} />
      <CategoryNavigation category={category} />
      <PostGrid posts={paginatedPosts} />
      <Pagination 
        currentPage={currentPage}
        totalPages={Math.ceil(category.posts.length / postsPerPage)}
        baseUrl={`/category/${categoryPath}`}
      />
    </div>
  );
}
```

### 카테고리 네비게이션
```typescript
// components/CategoryNavigation.tsx
export default function CategoryNavigation({ 
  category 
}: { 
  category: CategoryData 
}) {
  const breadcrumbs = buildBreadcrumbs(category.slug);
  
  return (
    <nav className="category-navigation">
      {/* 브레드크럼 */}
      <Breadcrumbs>
        <Link href="/blog">전체</Link>
        {breadcrumbs.map((crumb, index) => (
          <Link key={index} href={`/category/${crumb.path}`}>
            {crumb.name}
          </Link>
        ))}
      </Breadcrumbs>
      
      {/* 하위 카테고리 */}
      {category.subcategories && category.subcategories.length > 0 && (
        <div className="subcategories">
          <Typography variant="h6">하위 카테고리</Typography>
          <div className="subcategory-grid">
            {category.subcategories.map(sub => (
              <CategoryCard key={sub.id} category={sub} />
            ))}
          </div>
        </div>
      )}
      
      {/* 관련 태그 */}
      <div className="related-tags">
        <Typography variant="h6">관련 태그</Typography>
        <TagCloud tags={getRelatedTags(category)} />
      </div>
    </nav>
  );
}

function buildBreadcrumbs(categoryPath: string) {
  const segments = categoryPath.split('/');
  return segments.map((segment, index) => ({
    name: segment,
    path: segments.slice(0, index + 1).join('/')
  }));
}
```

## 태그 시스템 구현

### 태그 클라우드
```typescript
// components/TagCloud.tsx
interface TagCloudProps {
  tags: TagData[];
  maxSize?: number;
  minSize?: number;
  colorScheme?: 'blue' | 'green' | 'purple';
}

export default function TagCloud({ 
  tags, 
  maxSize = 24, 
  minSize = 12,
  colorScheme = 'blue'
}: TagCloudProps) {
  const maxCount = Math.max(...tags.map(tag => tag.postCount));
  const minCount = Math.min(...tags.map(tag => tag.postCount));
  
  const getFontSize = (count: number) => {
    if (maxCount === minCount) return (maxSize + minSize) / 2;
    
    const ratio = (count - minCount) / (maxCount - minCount);
    return minSize + (maxSize - minSize) * ratio;
  };
  
  const getOpacity = (count: number) => {
    const ratio = (count - minCount) / (maxCount - minCount);
    return 0.6 + 0.4 * ratio;
  };
  
  return (
    <div className="tag-cloud">
      {tags.map(tag => (
        <Link
          key={tag.id}
          href={`/tag/${tag.slug}`}
          className={`tag-link ${colorScheme}`}
          style={{
            fontSize: `${getFontSize(tag.postCount)}px`,
            opacity: getOpacity(tag.postCount)
          }}
        >
          {tag.name}
          <span className="tag-count">({tag.postCount})</span>
        </Link>
      ))}
    </div>
  );
}
```

### 태그 페이지
```typescript
// app/tag/[slug]/page.tsx
export default async function TagPage({ params }: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;
  const tag = await getTagData(slug);
  
  if (!tag) {
    notFound();
  }
  
  return (
    <div className="tag-page">
      <div className="tag-header">
        <Typography variant="h3" component="h1">
          #{tag.name}
        </Typography>
        {tag.description && (
          <Typography variant="body1" color="text.secondary">
            {tag.description}
          </Typography>
        )}
        <Typography variant="caption">
          {tag.postCount}개의 포스트
        </Typography>
      </div>
      
      <div className="tag-content">
        <PostGrid posts={tag.posts} />
        
        {/* 관련 태그 */}
        <aside className="related-tags">
          <Typography variant="h6">관련 태그</Typography>
          <TagCloud tags={tag.relatedTags || []} />
        </aside>
      </div>
    </div>
  );
}
```

## 검색과 필터링

### 고급 필터링 시스템
```typescript
// components/ContentFilter.tsx
interface ContentFilterProps {
  initialCategory?: string;
  initialTags?: string[];
  onFilterChange: (filters: FilterState) => void;
}

interface FilterState {
  categories: string[];
  tags: string[];
  dateRange: [Date, Date] | null;
  difficulty: string[];
  series: string[];
}

export default function ContentFilter({ 
  initialCategory, 
  initialTags = [],
  onFilterChange 
}: ContentFilterProps) {
  const [filters, setFilters] = useState<FilterState>({
    categories: initialCategory ? [initialCategory] : [],
    tags: initialTags,
    dateRange: null,
    difficulty: [],
    series: []
  });
  
  const taxonomy = useTaxonomy();
  
  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);
  
  return (
    <Paper className="content-filter">
      {/* 카테고리 선택 */}
      <FilterSection title="카테고리">
        <CategoryTree 
          categories={taxonomy.categories}
          selected={filters.categories}
          onChange={(categories) => 
            setFilters(prev => ({ ...prev, categories }))
          }
        />
      </FilterSection>
      
      {/* 태그 선택 */}
      <FilterSection title="태그">
        <TagSelector
          tags={taxonomy.tags}
          selected={filters.tags}
          onChange={(tags) => 
            setFilters(prev => ({ ...prev, tags }))
          }
        />
      </FilterSection>
      
      {/* 날짜 범위 */}
      <FilterSection title="발행일">
        <DateRangePicker
          value={filters.dateRange}
          onChange={(dateRange) => 
            setFilters(prev => ({ ...prev, dateRange }))
          }
        />
      </FilterSection>
      
      {/* 난이도 */}
      <FilterSection title="난이도">
        <CheckboxGroup
          options={[
            { value: 'beginner', label: '초급' },
            { value: 'intermediate', label: '중급' },
            { value: 'advanced', label: '고급' }
          ]}
          selected={filters.difficulty}
          onChange={(difficulty) => 
            setFilters(prev => ({ ...prev, difficulty }))
          }
        />
      </FilterSection>
    </Paper>
  );
}
```

### 필터링 로직
```typescript
// lib/content-filtering.ts
export function filterPosts(
  posts: PostMetadata[],
  filters: FilterState
): PostMetadata[] {
  return posts.filter(post => {
    // 카테고리 필터
    if (filters.categories.length > 0) {
      const matchesCategory = filters.categories.some(category => 
        post.category.startsWith(category)
      );
      if (!matchesCategory) return false;
    }
    
    // 태그 필터 (AND 조건)
    if (filters.tags.length > 0) {
      const hasAllTags = filters.tags.every(tag => 
        post.tags.includes(tag)
      );
      if (!hasAllTags) return false;
    }
    
    // 날짜 범위 필터
    if (filters.dateRange) {
      const postDate = new Date(post.date);
      const [start, end] = filters.dateRange;
      if (postDate < start || postDate > end) return false;
    }
    
    // 난이도 필터
    if (filters.difficulty.length > 0 && post.difficulty) {
      if (!filters.difficulty.includes(post.difficulty)) return false;
    }
    
    return true;
  });
}
```

## URL 기반 상태 관리

### 검색 파라미터와 동기화
```typescript
// hooks/useFilterState.ts
export function useFilterState() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [filters, setFilters] = useState<FilterState>(() => ({
    categories: searchParams.getAll('category'),
    tags: searchParams.getAll('tag'),
    dateRange: getDateRangeFromParams(searchParams),
    difficulty: searchParams.getAll('difficulty'),
    series: searchParams.getAll('series')
  }));
  
  const updateFilters = useCallback((newFilters: FilterState) => {
    setFilters(newFilters);
    
    // URL 파라미터 업데이트
    const params = new URLSearchParams();
    
    newFilters.categories.forEach(cat => params.append('category', cat));
    newFilters.tags.forEach(tag => params.append('tag', tag));
    newFilters.difficulty.forEach(diff => params.append('difficulty', diff));
    
    if (newFilters.dateRange) {
      params.set('from', newFilters.dateRange[0].toISOString());
      params.set('to', newFilters.dateRange[1].toISOString());
    }
    
    router.push(`?${params.toString()}`);
  }, [router]);
  
  return { filters, updateFilters };
}
```

## 성능 최적화

### 분류 데이터 캐싱
```typescript
// lib/taxonomy-cache.ts
class TaxonomyCache {
  private static instance: TaxonomyCache;
  private cache: Map<string, any> = new Map();
  private lastUpdate: Date = new Date(0);
  
  static getInstance(): TaxonomyCache {
    if (!TaxonomyCache.instance) {
      TaxonomyCache.instance = new TaxonomyCache();
    }
    return TaxonomyCache.instance;
  }
  
  async getTaxonomy(): Promise<Taxonomy> {
    const cacheKey = 'taxonomy';
    
    if (this.cache.has(cacheKey) && this.isCacheFresh()) {
      return this.cache.get(cacheKey);
    }
    
    const posts = await getAllPosts();
    const taxonomy = new Taxonomy(posts);
    
    this.cache.set(cacheKey, taxonomy);
    this.lastUpdate = new Date();
    
    return taxonomy;
  }
  
  private isCacheFresh(): boolean {
    const maxAge = 5 * 60 * 1000; // 5분
    return Date.now() - this.lastUpdate.getTime() < maxAge;
  }
}
```

### 인덱스 기반 검색
```typescript
// lib/search-index.ts
export class SearchIndex {
  private categoryIndex: Map<string, Set<string>> = new Map();
  private tagIndex: Map<string, Set<string>> = new Map();
  
  constructor(posts: PostMetadata[]) {
    this.buildIndices(posts);
  }
  
  private buildIndices(posts: PostMetadata[]) {
    posts.forEach(post => {
      // 카테고리 인덱스
      const categoryParts = post.category.split('/');
      categoryParts.forEach((part, index) => {
        const categoryPath = categoryParts.slice(0, index + 1).join('/');
        if (!this.categoryIndex.has(categoryPath)) {
          this.categoryIndex.set(categoryPath, new Set());
        }
        this.categoryIndex.get(categoryPath)!.add(post.slug);
      });
      
      // 태그 인덱스
      post.tags.forEach(tag => {
        if (!this.tagIndex.has(tag)) {
          this.tagIndex.set(tag, new Set());
        }
        this.tagIndex.get(tag)!.add(post.slug);
      });
    });
  }
  
  findPostsByCategory(category: string): Set<string> {
    return this.categoryIndex.get(category) || new Set();
  }
  
  findPostsByTags(tags: string[]): Set<string> {
    if (tags.length === 0) return new Set();
    
    let result = this.tagIndex.get(tags[0]) || new Set();
    
    for (let i = 1; i < tags.length; i++) {
      const tagPosts = this.tagIndex.get(tags[i]) || new Set();
      result = new Set([...result].filter(x => tagPosts.has(x)));
    }
    
    return result;
  }
}
```

## 마무리

효과적인 카테고리/태그 시스템은 사용자가 원하는 콘텐츠를 빠르게 찾을 수 있게 도와줍니다. 계층적 카테고리로 구조를 제공하고, 유연한 태그로 다양한 관점의 분류를 지원하며, 강력한 필터링 기능으로 정확한 검색을 가능하게 합니다.

다음 포스트에서는 전문적인 검색 기능 구현과 Elasticsearch, Algolia 같은 검색 엔진 통합에 대해 알아보겠습니다.
