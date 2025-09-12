// src/app/page.tsx - 메인 페이지 (제품 목록 및 필터링)

'use client';

import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  CircularProgress,
  Alert,
  Skeleton,
} from '@mui/material';
import ProductCard from '@/components/ProductCard';
import ProductFilter from '@/components/ProductFilter';
import Pagination from '@/components/Pagination';
import { Product, Category, FilterOptions, ProductListResponse, ApiResponse } from '@/types';

/**
 * 메인 페이지 - 제품 목록을 보여주고 필터링/페이지네이션을 제공
 */
export default function HomePage() {
  // 상태 관리
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  });

  // 필터 상태
  const [filters, setFilters] = useState<FilterOptions>({
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  // 카테고리 목록 가져오기
  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data: ApiResponse<Category[]> = await response.json();
      
      if (data.success) {
        setCategories(data.data);
      } else {
        console.error('카테고리 로드 실패:', data.error);
      }
    } catch (error) {
      console.error('카테고리 API 호출 실패:', error);
    }
  };

  // 제품 목록 가져오기
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      // URL 파라미터 구성
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });

      // 필터 조건 추가
      if (filters.category) params.append('category', filters.category);
      if (filters.search) params.append('search', filters.search);
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
      if (filters.minPrice) params.append('minPrice', filters.minPrice.toString());
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice.toString());

      const response = await fetch(`/api/products?${params.toString()}`);
      const data: ApiResponse<ProductListResponse> = await response.json();

      if (data.success) {
        setProducts(data.data.products);
        setPagination(data.data.pagination);
      } else {
        setError(data.error || '제품을 불러오는데 실패했습니다.');
      }
    } catch (error) {
      console.error('제품 API 호출 실패:', error);
      setError('네트워크 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 초기 데이터 로드
  useEffect(() => {
    fetchCategories();
  }, []);

  // 필터나 페이지 변경시 제품 목록 새로고침
  useEffect(() => {
    fetchProducts();
  }, [filters, pagination.page, pagination.limit]);

  // 필터 변경 핸들러
  const handleFiltersChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    // 필터가 변경되면 첫 페이지로 이동
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  // 필터 초기화 핸들러
  const handleClearFilters = () => {
    setFilters({
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
    // 페이지 변경시 상단으로 스크롤
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 페이지당 항목 수 변경 핸들러
  const handleLimitChange = (limit: number) => {
    setPagination(prev => ({ ...prev, limit, page: 1 }));
  };

  // 로딩 스켈레톤 컴포넌트
  const ProductCardSkeleton = () => (
    <Box>
      <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 1, mb: 2 }} />
      <Skeleton variant="text" height={32} sx={{ mb: 1 }} />
      <Skeleton variant="text" height={24} sx={{ mb: 2 }} />
      <Skeleton variant="text" height={28} />
    </Box>
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* 페이지 제목 */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', mb: 2 }}>
          E-Shop Catalog
        </Typography>
        <Typography variant="h6" color="text.secondary">
          다양한 제품을 둘러보고 원하는 상품을 장바구니에 담아보세요!
        </Typography>
      </Box>

      {/* 필터 컴포넌트 */}
      <ProductFilter
        filters={filters}
        categories={categories}
        onFiltersChange={handleFiltersChange}
        onClearFilters={handleClearFilters}
      />

      {/* 에러 표시 */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* 제품 목록 */}
      {loading ? (
        // 로딩 중일 때 스켈레톤 표시
        <Grid container spacing={3}>
          {Array.from({ length: pagination.limit }).map((_, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <ProductCardSkeleton />
            </Grid>
          ))}
        </Grid>
      ) : products.length > 0 ? (
        // 제품이 있을 때
        <>
          {/* 검색 결과 정보 */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="body1" color="text.secondary">
              {filters.search && `"${filters.search}" 검색결과: `}
              총 {pagination.total.toLocaleString()}개의 제품이 있습니다
            </Typography>
          </Box>

          {/* 제품 그리드 */}
          <Grid container spacing={3}>
            {products.map((product) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                <ProductCard product={product} />
              </Grid>
            ))}
          </Grid>

          {/* 페이지네이션 */}
          <Pagination
            pagination={pagination}
            onPageChange={handlePageChange}
            onLimitChange={handleLimitChange}
          />
        </>
      ) : (
        // 제품이 없을 때
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 400,
            textAlign: 'center',
          }}
        >
          <Typography variant="h5" sx={{ mb: 2, color: 'text.secondary' }}>
            검색 결과가 없습니다
          </Typography>
          <Typography variant="body1" color="text.secondary">
            다른 검색어나 필터 조건을 시도해보세요.
          </Typography>
        </Box>
      )}
    </Container>
  );
}