// src/components/InfiniteScrollProducts.tsx - 무한 스크롤로 제품을 로드하는 컴포넌트

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Grid,
  Typography,
  Box,
  CircularProgress,
  Button,
  Alert,
} from '@mui/material';
import ProductCard from './ProductCard';
import { ParsedProduct, FilterOptions, ApiResponse, ProductListResponse } from '@/types';

interface InfiniteScrollProductsProps {
  filters: FilterOptions;
  initialProducts?: ParsedProduct[];
}

/**
 * 무한 스크롤을 구현한 제품 목록 컴포넌트
 * 초보자가 이해하기 쉽도록 단계별로 주석을 추가
 */
export default function InfiniteScrollProducts({ 
  filters, 
  initialProducts = [] 
}: InfiniteScrollProductsProps) {
  // 상태 관리
  const [products, setProducts] = useState<ParsedProduct[]>(initialProducts);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  
  // 스크롤 감지를 위한 ref
  const observerRef = useRef<HTMLDivElement | null>(null);

  /**
   * 제품 데이터를 가져오는 함수
   * @param pageNumber - 가져올 페이지 번호
   * @param resetProducts - 기존 제품 목록을 리셋할지 여부
   */
  const fetchProducts = useCallback(async (pageNumber: number, resetProducts = false) => {
    try {
      setLoading(true);
      setError(null);

      // URL 파라미터 생성 (필터 조건들을 URL에 추가)
      const params = new URLSearchParams({
        page: pageNumber.toString(),
        limit: '12', // 한 번에 12개씩 로드
      });

      // 필터 조건들을 URL 파라미터에 추가
      if (filters.category) params.append('category', filters.category);
      if (filters.search) params.append('search', filters.search);
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
      if (filters.minPrice) params.append('minPrice', filters.minPrice.toString());
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice.toString());

      // API 호출
      const response = await fetch(`/api/products?${params.toString()}`);
      const data: ApiResponse<ProductListResponse> = await response.json();

      if (data.success) {
        const newProducts = data.data.products;
        
        if (resetProducts) {
          // 필터가 변경된 경우 기존 제품 목록을 새로운 것으로 교체
          setProducts(newProducts);
        } else {
          // 무한 스크롤의 경우 기존 목록에 새 제품들을 추가
          setProducts(prev => [...prev, ...newProducts]);
        }

        // 더 로드할 데이터가 있는지 확인
        setHasMore(data.data.pagination.hasNext);
      } else {
        setError(data.error || '제품을 불러오는데 실패했습니다.');
      }
    } catch (error) {
      console.error('제품 로딩 실패:', error);
      setError('네트워크 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  /**
   * 다음 페이지를 로드하는 함수
   */
  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchProducts(nextPage, false);
    }
  }, [loading, hasMore, page, fetchProducts]);

  /**
   * 필터가 변경되었을 때 제품 목록을 다시 로드
   */
  useEffect(() => {
    setPage(1);
    setProducts([]);
    setHasMore(true);
    fetchProducts(1, true);
  }, [filters, fetchProducts]);

  /**
   * Intersection Observer를 사용한 무한 스크롤 구현
   * 사용자가 페이지 하단에 도달하면 자동으로 다음 페이지를 로드
   */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // 마지막 요소가 화면에 나타났을 때
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMore();
        }
      },
      {
        // 요소가 50% 보일 때 트리거
        threshold: 0.5,
      }
    );

    const currentRef = observerRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    // 컴포넌트가 언마운트될 때 observer 정리
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [loadMore, hasMore, loading]);

  return (
    <Box>
      {/* 에러 표시 */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
          <Button 
            color="inherit" 
            size="small" 
            onClick={() => fetchProducts(1, true)}
            sx={{ ml: 2 }}
          >
            다시 시도
          </Button>
        </Alert>
      )}

      {/* 제품 그리드 */}
      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
            <ProductCard product={product} />
          </Grid>
        ))}
      </Grid>

      {/* 로딩 중이거나 더 많은 데이터가 있을 때 표시되는 영역 */}
      {(loading || hasMore) && (
        <Box
          ref={observerRef}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            mt: 4,
            minHeight: 100,
          }}
        >
          {loading && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <CircularProgress size={30} />
              <Typography variant="body2" color="text.secondary">
                제품을 불러오는 중...
              </Typography>
            </Box>
          )}
          
          {!loading && hasMore && (
            <Button
              variant="outlined"
              onClick={loadMore}
              sx={{ py: 1.5, px: 4 }}
            >
              더 많은 제품 보기
            </Button>
          )}
        </Box>
      )}

      {/* 모든 제품을 다 로드한 경우 */}
      {!loading && !hasMore && products.length > 0 && (
        <Box sx={{ textAlign: 'center', mt: 4, py: 3 }}>
          <Typography variant="body2" color="text.secondary">
            모든 제품을 불러왔습니다. ({products.length}개)
          </Typography>
        </Box>
      )}

      {/* 제품이 없는 경우 */}
      {!loading && products.length === 0 && !error && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 300,
            textAlign: 'center',
          }}
        >
          <Typography variant="h6" sx={{ mb: 2, color: 'text.secondary' }}>
            조건에 맞는 제품이 없습니다
          </Typography>
          <Typography variant="body2" color="text.secondary">
            다른 검색어나 필터 조건을 시도해보세요.
          </Typography>
        </Box>
      )}
    </Box>
  );
}