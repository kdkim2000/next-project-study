// src/app/search/SearchPageClient.tsx - 검색 페이지 클라이언트 컴포넌트

'use client';

import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Breadcrumbs,
  Link as MuiLink,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Home as HomeIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Layout from '@/components/Layout';
import PostList from '@/components/PostList';
import SearchBox from '@/components/SearchBox';
import { BlogPost, SearchFilters } from '@/types/blog';

interface SearchPageClientProps {
  initialCategories: string[];
  initialTags: string[];
}

/**
 * 검색 페이지 클라이언트 컴포넌트
 * 사용자가 키워드, 카테고리, 태그를 통해 블로그 포스트를 검색할 수 있는 페이지
 */
export default function SearchPageClient({ 
  initialCategories, 
  initialTags 
}: SearchPageClientProps) {
  // URL 쿼리 파라미터 읽기
  const searchParams = useSearchParams();
  
  // 상태 관리
  const [searchResults, setSearchResults] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentFilters, setCurrentFilters] = useState<SearchFilters>({});
  const [hasSearched, setHasSearched] = useState(false);

  /**
   * URL 쿼리 파라미터가 변경될 때 초기 검색 실행
   */
  useEffect(() => {
    const query = searchParams.get('query');
    const category = searchParams.get('category');
    const tagParam = searchParams.get('tags');
    
    // URL에서 검색 조건이 있으면 자동으로 검색 실행
    if (query || category || tagParam) {
      const initialFilters: SearchFilters = {
        query: query || undefined,
        category: category || undefined,
        tags: tagParam ? tagParam.split(',') : undefined,
      };
      
      handleSearch(initialFilters);
    }
  }, [searchParams]);

  /**
   * 검색 실행 함수 (API 사용)
   * @param filters - 검색 필터 조건
   */
  const handleSearch = async (filters: SearchFilters) => {
    setLoading(true);
    setCurrentFilters(filters);
    setHasSearched(true);

    try {
      // API 엔드포인트를 통해 검색 실행
      const queryParams = new URLSearchParams();
      
      if (filters.query) queryParams.append('query', filters.query);
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.tags && filters.tags.length > 0) {
        queryParams.append('tags', filters.tags.join(','));
      }

      const response = await fetch(`/api/search?${queryParams.toString()}`);
      const data = await response.json();

      if (data.success) {
        setSearchResults(data.data);
      } else {
        console.error('Search API error:', data.error);
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 현재 적용된 필터 개수 계산
   */
  const activeFiltersCount = Object.values(currentFilters).filter(value => {
    if (Array.isArray(value)) {
      return value.length > 0;
    }
    return Boolean(value);
  }).length;

  /**
   * 검색 결과 요약 메시지 생성
   */
  const getSearchSummary = () => {
    if (!hasSearched) {
      return '검색어를 입력하거나 필터를 설정하여 포스트를 찾아보세요.';
    }

    if (activeFiltersCount === 0) {
      return '검색 조건을 설정해주세요.';
    }

    const conditions: string[] = [];
    
    if (currentFilters.query) {
      conditions.push(`"${currentFilters.query}"`);
    }
    if (currentFilters.category) {
      conditions.push(`카테고리: ${currentFilters.category}`);
    }
    if (currentFilters.tags && currentFilters.tags.length > 0) {
      conditions.push(`태그: ${currentFilters.tags.map(tag => `#${tag}`).join(', ')}`);
    }

    const conditionText = conditions.join(', ');
    const resultCount = searchResults.length;

    return `"${conditionText}" 조건으로 ${resultCount}개의 포스트를 찾았습니다.`;
  };

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* 브레드크럼 네비게이션 */}
        <Box sx={{ mb: 4 }}>
          <Breadcrumbs aria-label="breadcrumb" separator="›">
            <MuiLink
              component={Link}
              href="/"
              color="inherit"
              sx={{
                display: 'flex',
                alignItems: 'center',
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              <HomeIcon sx={{ mr: 0.5, fontSize: 20 }} />
              홈
            </MuiLink>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                color: 'text.primary',
              }}
            >
              <SearchIcon sx={{ mr: 0.5, fontSize: 20 }} />
              검색
            </Box>
          </Breadcrumbs>
        </Box>

        {/* 페이지 헤더 */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontWeight: 700,
              mb: 2,
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
            }}
          >
            포스트 검색
          </Typography>
          
          <Typography
            variant="h6"
            component="p"
            color="text.secondary"
            sx={{
              fontWeight: 400,
              maxWidth: 600,
              margin: '0 auto',
              lineHeight: 1.6,
            }}
          >
            관심 있는 주제의 포스트를 빠르게 찾아보세요. <br />
            키워드, 카테고리, 태그로 원하는 글을 검색할 수 있습니다.
          </Typography>
        </Box>

        {/* 검색 박스 */}
        <SearchBox
          onSearch={handleSearch}
          categories={initialCategories}
          tags={initialTags}
          loading={loading}
          placeholder="찾고 싶은 포스트의 제목이나 내용을 입력하세요..."
        />

        {/* 검색 결과 요약 */}
        <Box sx={{ mb: 4 }}>
          <Alert
            severity={searchResults.length > 0 ? 'success' : hasSearched && activeFiltersCount > 0 ? 'info' : 'info'}
            sx={{ borderRadius: 2 }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {loading && <CircularProgress size={20} />}
              <Typography variant="body1">
                {loading ? '검색 중...' : getSearchSummary()}
              </Typography>
            </Box>
          </Alert>
        </Box>

        {/* 검색 결과 */}
        {hasSearched && (
          <PostList
            posts={searchResults}
            loading={loading}
            emptyMessage={
              activeFiltersCount > 0
                ? '검색 조건에 맞는 포스트를 찾을 수 없습니다. 다른 키워드나 필터를 시도해보세요.'
                : '검색 조건을 입력해주세요.'
            }
            showFeatured={true}
          />
        )}

        {/* 검색 팁 */}
        {!hasSearched && (
          <Box
            sx={{
              mt: 6,
              p: 4,
              bgcolor: 'background.paper',
              borderRadius: 2,
              border: 1,
              borderColor: 'divider',
            }}
          >
            <Typography variant="h6" component="h3" sx={{ mb: 2, fontWeight: 600 }}>
              검색 팁
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography variant="body2" color="text.secondary">
                • <strong>키워드 검색:</strong> 포스트 제목, 내용, 요약에서 키워드를 찾습니다
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • <strong>카테고리 필터:</strong> 특정 주제별로 포스트를 필터링할 수 있습니다
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • <strong>태그 검색:</strong> 여러 태그를 선택하여 관련 포스트를 찾을 수 있습니다
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • <strong>조합 검색:</strong> 키워드, 카테고리, 태그를 함께 사용하여 정확한 검색이 가능합니다
              </Typography>
            </Box>
          </Box>
        )}

        {/* 인기 검색어나 추천 카테고리 */}
        {!hasSearched && initialCategories.length > 0 && (
          <Box sx={{ mt: 6 }}>
            <Typography variant="h6" component="h3" sx={{ mb: 3, fontWeight: 600 }}>
              인기 카테고리
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              {initialCategories.slice(0, 8).map((category) => (
                <Box
                  key={category}
                  component="button"
                  onClick={() => handleSearch({ category })}
                  sx={{
                    px: 3,
                    py: 1,
                    border: 1,
                    borderColor: 'primary.main',
                    borderRadius: 2,
                    bgcolor: 'transparent',
                    color: 'primary.main',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      bgcolor: 'primary.main',
                      color: 'primary.contrastText',
                    },
                  }}
                >
                  {category}
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </Container>
    </Layout>
  );
}