// src/app/search/SearchPageClient.tsx
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from "next/link";
import { 
  Typography, 
  Container, 
  Box, 
  Card, 
  CardContent, 
  Chip,
  Breadcrumbs,
  Alert
} from "@mui/material";
import { CalendarToday, AccessTime, Search } from "@mui/icons-material";
import SearchInput from "@/components/SearchInput";

// 클라이언트 컴포넌트에서 사용할 검색 함수
const searchPosts = (posts: any[], query: string) => {
  if (!query.trim()) return [];
  
  const searchTerm = query.toLowerCase();
  const results: any[] = [];
  
  posts.forEach(post => {
    let score = 0;
    const matchedFields: string[] = [];
    
    // 제목에서 검색 (가중치: 3)
    if (post.title.toLowerCase().includes(searchTerm)) {
      score += 3;
      matchedFields.push('title');
    }
    
    // 설명에서 검색 (가중치: 2)
    if (post.description?.toLowerCase().includes(searchTerm)) {
      score += 2;
      matchedFields.push('description');
    }
    
    // 카테고리에서 검색 (가중치: 2)
    if (post.category?.toLowerCase().includes(searchTerm)) {
      score += 2;
      matchedFields.push('category');
    }
    
    // 태그에서 검색 (가중치: 1.5)
    const matchingTags = post.tags?.filter((tag: string) => 
      tag.toLowerCase().includes(searchTerm)
    ) || [];
    if (matchingTags.length > 0) {
      score += matchingTags.length * 1.5;
      matchedFields.push('tags');
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
};

interface SearchPageClientProps {
  allPosts: any[];
  allCategories: any[];
  allTags: any[];
  initialQuery?: string;
}

export default function SearchPageClient({ 
  allPosts, 
  allCategories, 
  allTags, 
  initialQuery = '' 
}: SearchPageClientProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  useEffect(() => {
    if (query.trim()) {
      const results = searchPosts(allPosts, query);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [query, allPosts]);

  return (
    <Container>
      {/* 브레드크럼 네비게이션 */}
      <Box sx={{ mb: 3 }}>
        <Breadcrumbs>
          <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            홈
          </Link>
          <Link href="/blog" style={{ textDecoration: 'none', color: 'inherit' }}>
            블로그
          </Link>
          <Typography color="text.primary">
            검색
          </Typography>
        </Breadcrumbs>
      </Box>

      {/* 검색 헤더 */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
          <Search sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h3" component="h1">
            검색
          </Typography>
        </Box>
        
        {/* 검색 입력 폼 */}
        <SearchInput 
          initialQuery={query}
          onSearch={(searchQuery: string) => {
            setQuery(searchQuery);
            const params = new URLSearchParams();
            if (searchQuery.trim()) {
              params.set('q', searchQuery);
            }
            const queryString = params.toString();
            router.push(queryString ? `/search?${queryString}` : '/search');
          }}
        />
      </Box>

      {/* 검색 결과 */}
      {query && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            "{query}" 검색 결과
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {searchResults.length}개의 결과를 찾았습니다.
          </Typography>
          
          {searchResults.length === 0 ? (
            <Alert severity="info" sx={{ mb: 4 }}>
              검색 결과가 없습니다. 다른 검색어를 시도해보세요.
            </Alert>
          ) : (
            <Box sx={{ display: 'grid', gap: 3, mb: 4 }}>
              {searchResults.map((result) => (
                <Card 
                  key={result.post.slug} 
                  component={Link}
                  href={`/blog/${result.post.slug}`}
                  sx={{ 
                    textDecoration: 'none',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: 3
                    }
                  }}
                >
                  <CardContent>
                    {/* 점수 표시 (개발 환경에서만) */}
                    {process.env.NODE_ENV === 'development' && (
                      <Box sx={{ mb: 1 }}>
                        <Chip 
                          label={`점수: ${result.score.toFixed(1)}`} 
                          size="small" 
                          color="primary" 
                        />
                        <Chip 
                          label={`매칭: ${result.matchedFields.join(', ')}`} 
                          size="small" 
                          variant="outlined"
                          sx={{ ml: 1 }}
                        />
                      </Box>
                    )}
                    
                    <Typography variant="h5" component="h2" gutterBottom>
                      {result.post.title}
                    </Typography>
                    
                    {result.post.description && (
                      <Typography 
                        variant="body1" 
                        color="text.secondary" 
                        paragraph
                        sx={{ mb: 2 }}
                      >
                        {result.post.description}
                      </Typography>
                    )}
                    
                    {/* 카테고리 - onClick으로 처리하여 중첩된 a 태그 방지 */}
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
                          sx={{ textDecoration: 'none' }}
                        />
                      </Box>
                    )}
                    
                    {/* 메타 정보 */}
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 2, 
                      mb: 2,
                      flexWrap: 'wrap' 
                    }}>
                      {result.post.date && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <CalendarToday fontSize="small" color="action" />
                          <Typography variant="body2" color="text.secondary">
                            {result.post.date}
                          </Typography>
                        </Box>
                      )}
                      
                      {result.post.readingTime && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <AccessTime fontSize="small" color="action" />
                          <Typography variant="body2" color="text.secondary">
                            {result.post.readingTime.text}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                    
                    {/* 태그 - onClick으로 처리하여 중첩된 a 태그 방지 */}
                    {result.post.tags && result.post.tags.length > 0 && (
                      <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                        {result.post.tags.slice(0, 5).map((tag: string, index: number) => (
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
                            sx={{ 
                              fontSize: '0.7rem',
                              textDecoration: 'none',
                              '&:hover': {
                                backgroundColor: 'primary.main',
                                color: 'primary.contrastText'
                              }
                            }}
                          />
                        ))}
                      </Box>
                    )}
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}
        </Box>
      )}
      
      {/* 검색어가 없을 때 카테고리와 태그 표시 */}
      {!query && (
        <Box>
          {/* 인기 카테고리 */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" gutterBottom>
              카테고리별 탐색
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {allCategories.slice(0, 8).map((category: any) => (
                <Chip
                  key={category.slug}
                  label={`${category.name} (${category.count})`}
                  clickable
                  variant="outlined"
                  size="medium"
                  onClick={() => {
                    router.push(`/category/${category.slug}`);
                  }}
                  sx={{
                    textDecoration: 'none',
                    '&:hover': {
                      backgroundColor: 'primary.main',
                      color: 'primary.contrastText'
                    }
                  }}
                />
              ))}
            </Box>
          </Box>
          
          {/* 인기 태그 */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" gutterBottom>
              태그별 탐색
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {allTags.slice(0, 15).map((tag: any) => (
                <Chip
                  key={tag.slug}
                  label={`#${tag.name} (${tag.count})`}
                  clickable
                  variant="outlined"
                  size="small"
                  onClick={() => {
                    router.push(`/tag/${tag.slug}`);
                  }}
                  sx={{
                    textDecoration: 'none',
                    '&:hover': {
                      backgroundColor: 'primary.main',
                      color: 'primary.contrastText'
                    }
                  }}
                />
              ))}
            </Box>
          </Box>
        </Box>
      )}
    </Container>
  );
}