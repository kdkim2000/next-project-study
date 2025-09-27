---
title: "Next.js 블로그 검색 기능 완벽 구현 - 클라이언트부터 Elasticsearch까지"
date: "2024-01-23"
description: "단순한 클라이언트 사이드 검색부터 고급 검색 엔진 통합까지, 블로그에 강력한 검색 기능을 구현하는 모든 방법을 다룹니다."
keywords: ["search", "nextjs", "elasticsearch", "algolia", "full-text-search", "indexing"]
---

# Next.js 블로그 검색 기능 완벽 구현

검색은 현대 웹사이트의 필수 기능입니다. 사용자가 원하는 정보를 빠르게 찾을 수 있게 해주는 검색 기능을 단계별로 구현해보겠습니다. 간단한 클라이언트 사이드 검색부터 고급 검색 엔진 통합까지 모든 것을 다룹니다.

## 검색 기능의 발전 단계

### 1단계: 클라이언트 사이드 기본 검색
```typescript
// lib/simple-search.ts
export function simpleSearch(
  posts: PostMetadata[],
  query: string
): PostMetadata[] {
  const searchTerm = query.toLowerCase().trim();
  
  if (!searchTerm) return posts;
  
  return posts.filter(post => {
    const searchableText = [
      post.title,
      post.description || '',
      post.tags.join(' '),
      post.category
    ].join(' ').toLowerCase();
    
    return searchableText.includes(searchTerm);
  });
}
```

### 2단계: 가중치 기반 검색
```typescript
// lib/weighted-search.ts
interface SearchResult {
  post: PostMetadata;
  score: number;
  matchedFields: string[];
}

export function weightedSearch(
  posts: PostMetadata[],
  query: string
): SearchResult[] {
  const searchTerm = query.toLowerCase().trim();
  const searchTerms = searchTerm.split(/\s+/);
  
  const results: SearchResult[] = [];
  
  posts.forEach(post => {
    let score = 0;
    const matchedFields: string[] = [];
    
    // 제목에서 매치 (가중치: 10)
    const titleMatches = countMatches(post.title.toLowerCase(), searchTerms);
    if (titleMatches > 0) {
      score += titleMatches * 10;
      matchedFields.push('title');
    }
    
    // 설명에서 매치 (가중치: 5)
    if (post.description) {
      const descMatches = countMatches(post.description.toLowerCase(), searchTerms);
      if (descMatches > 0) {
        score += descMatches * 5;
        matchedFields.push('description');
      }
    }
    
    // 태그에서 매치 (가중치: 7)
    const tagMatches = post.tags.filter(tag => 
      searchTerms.some(term => tag.toLowerCase().includes(term))
    ).length;
    if (tagMatches > 0) {
      score += tagMatches * 7;
      matchedFields.push('tags');
    }
    
    // 카테고리에서 매치 (가중치: 3)
    const categoryMatches = countMatches(post.category.toLowerCase(), searchTerms);
    if (categoryMatches > 0) {
      score += categoryMatches * 3;
      matchedFields.push('category');
    }
    
    if (score > 0) {
      results.push({
        post,
        score,
        matchedFields
      });
    }
  });
  
  return results.sort((a, b) => b.score - a.score);
}

function countMatches(text: string, terms: string[]): number {
  return terms.reduce((count, term) => {
    const matches = text.split(term).length - 1;
    return count + matches;
  }, 0);
}
```

### 3단계: 퍼지 검색 (오타 허용)
```typescript
// lib/fuzzy-search.ts
import Fuse from 'fuse.js';

export class FuzzySearch {
  private fuse: Fuse<PostMetadata>;
  
  constructor(posts: PostMetadata[]) {
    this.fuse = new Fuse(posts, {
      keys: [
        {
          name: 'title',
          weight: 0.7  // 70% 가중치
        },
        {
          name: 'description',
          weight: 0.2  // 20% 가중치
        },
        {
          name: 'tags',
          weight: 0.1  // 10% 가중치
        }
      ],
      threshold: 0.3,  // 유사도 임계값 (낮을수록 엄격)
      distance: 100,   // 최대 거리
      includeScore: true,
      includeMatches: true
    });
  }
  
  search(query: string) {
    const results = this.fuse.search(query);
    
    return results.map(result => ({
      post: result.item,
      score: 1 - (result.score || 1), // 점수 뒤집기
      matches: result.matches?.map(match => ({
        field: match.key,
        value: match.value,
        indices: match.indices
      })) || []
    }));
  }
}
```

## 고급 검색 UI 구현

### 검색 입력 컴포넌트
```typescript
// components/SearchInput.tsx
"use client";

import { useState, useEffect, useRef } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { SearchResult } from '@/lib/search-types';

interface SearchInputProps {
  onSearch: (query: string) => Promise<SearchResult[]>;
  placeholder?: string;
}

export default function SearchInput({ onSearch, placeholder }: SearchInputProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  
  const debouncedQuery = useDebounce(query, 300);
  const inputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (debouncedQuery.trim().length >= 2) {
      performSearch(debouncedQuery);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [debouncedQuery]);
  
  const performSearch = async (searchQuery: string) => {
    setIsSearching(true);
    
    try {
      const searchResults = await onSearch(searchQuery);
      setResults(searchResults);
      setIsOpen(true);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsSearching(false);
    }
  };
  
  return (
    <div className="search-container">
      <div className="search-input-wrapper">
        <SearchIcon className="search-icon" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder || "검색어를 입력하세요..."}
          className="search-input"
          onFocus={() => results.length > 0 && setIsOpen(true)}
        />
        {isSearching && <CircularProgress size={20} />}
      </div>
      
      {isOpen && (
        <SearchDropdown
          results={results}
          query={query}
          onClose={() => setIsOpen(false)}
          onSelect={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
```

### 검색 결과 드롭다운
```typescript
// components/SearchDropdown.tsx
interface SearchDropdownProps {
  results: SearchResult[];
  query: string;
  onClose: () => void;
  onSelect: () => void;
}

export default function SearchDropdown({ 
  results, 
  query, 
  onClose, 
  onSelect 
}: SearchDropdownProps) {
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev < results.length - 1 ? prev + 1 : prev
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => prev > 0 ? prev - 1 : prev);
          break;
        case 'Enter':
          e.preventDefault();
          if (selectedIndex >= 0) {
            window.location.href = `/blog/${results[selectedIndex].post.slug}`;
            onSelect();
          }
          break;
        case 'Escape':
          onClose();
          break;
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, results, onClose, onSelect]);
  
  if (results.length === 0) {
    return (
      <div className="search-dropdown">
        <div className="no-results">
          <Typography>"{query}"에 대한 검색 결과가 없습니다.</Typography>
        </div>
      </div>
    );
  }
  
  return (
    <Paper className="search-dropdown" elevation={4}>
      {results.slice(0, 8).map((result, index) => (
        <Link
          key={result.post.slug}
          href={`/blog/${result.post.slug}`}
          className={`search-result-item ${
            index === selectedIndex ? 'selected' : ''
          }`}
          onClick={onSelect}
        >
          <div className="result-content">
            <Typography variant="subtitle1" component="h3">
              <HighlightedText text={result.post.title} query={query} />
            </Typography>
            {result.post.description && (
              <Typography variant="body2" color="text.secondary">
                <HighlightedText 
                  text={result.post.description} 
                  query={query} 
                  maxLength={100}
                />
              </Typography>
            )}
            <div className="result-meta">
              <Chip size="small" label={result.post.category} />
              <Typography variant="caption">
                {new Date(result.post.date).toLocaleDateString()}
              </Typography>
            </div>
          </div>
          <div className="result-score">
            <Typography variant="caption">
              {Math.round(result.score * 100)}% 일치
            </Typography>
          </div>
        </Link>
      ))}
      
      {results.length > 8 && (
        <div className="more-results">
          <Link href={`/search?q=${encodeURIComponent(query)}`}>
            {results.length - 8}개 결과 더 보기
          </Link>
        </div>
      )}
    </Paper>
  );
}
```

### 텍스트 하이라이팅
```typescript
// components/HighlightedText.tsx
interface HighlightedTextProps {
  text: string;
  query: string;
  maxLength?: number;
}

export default function HighlightedText({ 
  text, 
  query, 
  maxLength 
}: HighlightedTextProps) {
  let processedText = text;
  
  if (maxLength && text.length > maxLength) {
    // 쿼리 주변 텍스트를 중심으로 자르기
    const queryIndex = text.toLowerCase().indexOf(query.toLowerCase());
    
    if (queryIndex !== -1) {
      const start = Math.max(0, queryIndex - Math.floor(maxLength / 2));
      const end = Math.min(text.length, start + maxLength);
      processedText = text.slice(start, end);
      
      if (start > 0) processedText = '...' + processedText;
      if (end < text.length) processedText = processedText + '...';
    } else {
      processedText = text.slice(0, maxLength) + '...';
    }
  }
  
  if (!query.trim()) {
    return <span>{processedText}</span>;
  }
  
  const parts = processedText.split(new RegExp(`(${query})`, 'gi'));
  
  return (
    <span>
      {parts.map((part, index) => 
        part.toLowerCase() === query.toLowerCase() ? (
          <mark key={index} className="search-highlight">{part}</mark>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </span>
  );
}
```

## 전문 검색 페이지

### 검색 결과 페이지
```typescript
// app/search/page.tsx
interface SearchPageProps {
  searchParams: Promise<{ q?: string; page?: string; sort?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q: query = '', page = '1', sort = 'relevance' } = await searchParams;
  
  if (!query.trim()) {
    return <EmptySearchState />;
  }
  
  const currentPage = parseInt(page);
  const resultsPerPage = 10;
  
  const searchResults = await performFullSearch(query);
  const sortedResults = sortSearchResults(searchResults, sort);
  const paginatedResults = paginateResults(sortedResults, currentPage, resultsPerPage);
  
  return (
    <div className="search-page">
      <SearchHeader query={query} totalResults={searchResults.length} />
      
      <div className="search-filters">
        <SearchFilters query={query} sort={sort} />
      </div>
      
      <div className="search-results">
        {paginatedResults.map(result => (
          <SearchResultCard key={result.post.slug} result={result} query={query} />
        ))}
      </div>
      
      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(searchResults.length / resultsPerPage)}
        baseUrl="/search"
        queryParams={{ q: query, sort }}
      />
    </div>
  );
}
```

### 검색 필터
```typescript
// components/SearchFilters.tsx
export default function SearchFilters({ query, sort }: { 
  query: string; 
  sort: string; 
}) {
  const router = useRouter();
  
  const updateSort = (newSort: string) => {
    const params = new URLSearchParams({ q: query, sort: newSort });
    router.push(`/search?${params}`);
  };
  
  return (
    <div className="search-filters">
      <FormControl variant="outlined" size="small">
        <InputLabel>정렬</InputLabel>
        <Select
          value={sort}
          label="정렬"
          onChange={(e) => updateSort(e.target.value)}
        >
          <MenuItem value="relevance">관련도순</MenuItem>
          <MenuItem value="date">최신순</MenuItem>
          <MenuItem value="title">제목순</MenuItem>
          <MenuItem value="popular">인기순</MenuItem>
        </Select>
      </FormControl>
      
      <div className="filter-chips">
        <Typography variant="body2" color="text.secondary">
          빠른 필터:
        </Typography>
        <Chip 
          label="이번 달" 
          onClick={() => addDateFilter('month')}
          variant="outlined"
          size="small"
        />
        <Chip 
          label="고급 난이도" 
          onClick={() => addDifficultyFilter('advanced')}
          variant="outlined"
          size="small"
        />
      </div>
    </div>
  );
}
```

## Elasticsearch 통합

### 검색 인덱스 설정
```typescript
// lib/elasticsearch.ts
import { Client } from '@elastic/elasticsearch';

const client = new Client({
  node: process.env.ELASTICSEARCH_URL || 'http://localhost:9200'
});

const INDEX_NAME = 'blog_posts';

export async function createSearchIndex() {
  try {
    // 인덱스 존재 확인
    const exists = await client.indices.exists({ index: INDEX_NAME });
    
    if (!exists) {
      // 인덱스 생성
      await client.indices.create({
        index: INDEX_NAME,
        body: {
          mappings: {
            properties: {
              title: {
                type: 'text',
                analyzer: 'korean',
                fields: {
                  keyword: { type: 'keyword' }
                }
              },
              description: {
                type: 'text',
                analyzer: 'korean'
              },
              content: {
                type: 'text',
                analyzer: 'korean'
              },
              tags: {
                type: 'keyword'
              },
              category: {
                type: 'keyword'
              },
              date: {
                type: 'date'
              },
              slug: {
                type: 'keyword'
              }
            }
          },
          settings: {
            analysis: {
              analyzer: {
                korean: {
                  type: 'custom',
                  tokenizer: 'nori_tokenizer',
                  filter: ['lowercase', 'nori_part_of_speech']
                }
              }
            }
          }
        }
      });
    }
  } catch (error) {
    console.error('Failed to create search index:', error);
  }
}
```

### 문서 인덱싱
```typescript
// lib/index-posts.ts
export async function indexPosts(posts: PostMetadata[]) {
  const body = posts.flatMap(post => [
    { index: { _index: INDEX_NAME, _id: post.slug } },
    {
      title: post.title,
      description: post.description,
      content: post.content, // 마크다운 내용을 텍스트로 변환
      tags: post.tags,
      category: post.category,
      date: post.date,
      slug: post.slug,
      readingTime: post.readingTime
    }
  ]);
  
  try {
    const response = await client.bulk({
      refresh: true,
      body
    });
    
    if (response.errors) {
      const erroredDocuments = response.items.filter((item: any) => 
        item.index && item.index.error
      );
      console.error('Indexing errors:', erroredDocuments);
    }
    
    return response;
  } catch (error) {
    console.error('Failed to index posts:', error);
    throw error;
  }
}
```

### 고급 검색 쿼리
```typescript
// lib/elasticsearch-search.ts
export async function elasticSearch(
  query: string,
  options: {
    page?: number;
    size?: number;
    categories?: string[];
    tags?: string[];
    dateRange?: [string, string];
  } = {}
) {
  const { page = 1, size = 10, categories = [], tags = [], dateRange } = options;
  
  const searchBody = {
    query: {
      bool: {
        must: [
          {
            multi_match: {
              query,
              fields: ['title^3', 'description^2', 'content'],
              type: 'best_fields',
              fuzziness: 'AUTO'
            }
          }
        ],
        filter: []
      }
    },
    highlight: {
      fields: {
        title: {},
        description: {},
        content: {
          fragment_size: 150,
          number_of_fragments: 3
        }
      }
    },
    from: (page - 1) * size,
    size,
    sort: [
      '_score',
      { date: 'desc' }
    ]
  };
  
  // 필터 조건 추가
  if (categories.length > 0) {
    searchBody.query.bool.filter.push({
      terms: { category: categories }
    });
  }
  
  if (tags.length > 0) {
    searchBody.query.bool.filter.push({
      terms: { tags: tags }
    });
  }
  
  if (dateRange) {
    searchBody.query.bool.filter.push({
      range: {
        date: {
          gte: dateRange[0],
          lte: dateRange[1]
        }
      }
    });
  }
  
  try {
    const response = await client.search({
      index: INDEX_NAME,
      body: searchBody
    });
    
    return {
      hits: response.hits.hits.map(hit => ({
        post: hit._source,
        score: hit._score,
        highlights: hit.highlight
      })),
      total: response.hits.total.value,
      took: response.took
    };
  } catch (error) {
    console.error('Elasticsearch query failed:', error);
    throw error;
  }
}
```

## 검색 분석 및 개선

### 검색 로깅
```typescript
// lib/search-analytics.ts
export async function logSearch(
  query: string,
  results: number,
  userId?: string
) {
  const searchLog = {
    query: query.toLowerCase().trim(),
    resultCount: results,
    timestamp: new Date().toISOString(),
    userId: userId || null,
    userAgent: typeof window !== 'undefined' ? navigator.userAgent : null
  };
  
  // 분석용 데이터베이스나 서비스로 전송
  await fetch('/api/search/log', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(searchLog)
  });
}

export async function getSearchAnalytics() {
  // 인기 검색어, 검색 결과가 없는 쿼리 등 분석
  const analytics = await fetch('/api/search/analytics').then(res => res.json());
  
  return {
    popularQueries: analytics.popularQueries,
    noResultQueries: analytics.noResultQueries,
    averageResultCount: analytics.averageResultCount,
    searchTrends: analytics.searchTrends
  };
}
```

### 검색 제안
```typescript
// lib/search-suggestions.ts
export function generateSearchSuggestions(
  query: string,
  posts: PostMetadata[]
): string[] {
  const suggestions = new Set<string>();
  const queryLower = query.toLowerCase();
  
  posts.forEach(post => {
    // 제목에서 제안 추출
    if (post.title.toLowerCase().includes(queryLower)) {
      suggestions.add(post.title);
    }
    
    // 태그에서 제안 추출
    post.tags.forEach(tag => {
      if (tag.toLowerCase().includes(queryLower)) {
        suggestions.add(tag);
      }
    });
  });
  
  return Array.from(suggestions)
    .filter(suggestion => suggestion.toLowerCase() !== queryLower)
    .slice(0, 5);
}
```

## 마무리

검색 기능은 단순해 보이지만 사용자 경험을 크게 좌우하는 중요한 기능입니다. 프로젝트의 규모와 요구사항에 따라 적절한 수준의 검색 기능을 선택하고 구현하는 것이 중요합니다.

다음 포스트에서는 RSS 피드 생성과 외부 서비스와의 통합에 대해 알아보겠습니다.
