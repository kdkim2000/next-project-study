// src/components/ProductFilter.tsx - 제품 필터링 컴포넌트

'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Slider,
  Button,
  Divider,
  Chip,
  SelectChangeEvent,
} from '@mui/material';
import {
  Clear as ClearIcon,
  FilterList as FilterListIcon,
} from '@mui/icons-material';
import { FilterOptions, Category } from '@/types';

interface ProductFilterProps {
  filters: FilterOptions;
  categories: Category[];
  onFiltersChange: (filters: FilterOptions) => void;
  onClearFilters: () => void;
}

/**
 * 제품 필터링 및 정렬 기능을 제공하는 컴포넌트
 */
export default function ProductFilter({
  filters,
  categories,
  onFiltersChange,
  onClearFilters,
}: ProductFilterProps) {
  // 가격 범위 슬라이더 상태
  const [priceRange, setPriceRange] = useState<number[]>([
    filters.minPrice || 0,
    filters.maxPrice || 1000000,
  ]);

  // 검색어 상태 (디바운싱용)
  const [searchInput, setSearchInput] = useState(filters.search || '');

  // 검색어 디바운싱 처리
  useEffect(() => {
    const timer = setTimeout(() => {
      onFiltersChange({
        ...filters,
        search: searchInput || undefined,
      });
    }, 500); // 500ms 지연

    return () => clearTimeout(timer);
  }, [searchInput]);

  // 카테고리 변경 핸들러
  const handleCategoryChange = (event: SelectChangeEvent) => {
    const category = event.target.value;
    onFiltersChange({
      ...filters,
      category: category === 'all' ? undefined : category,
    });
  };

  // 정렬 옵션 변경 핸들러
  const handleSortChange = (event: SelectChangeEvent) => {
    const [sortBy, sortOrder] = event.target.value.split('-');
    onFiltersChange({
      ...filters,
      sortBy: sortBy as any,
      sortOrder: sortOrder as 'asc' | 'desc',
    });
  };

  // 가격 범위 변경 핸들러
  const handlePriceRangeChange = (event: Event, newValue: number | number[]) => {
    const value = newValue as number[];
    setPriceRange(value);
  };

  // 가격 범위 확정 핸들러 (마우스를 떼었을 때)
  const handlePriceRangeCommitted = (event: React.SyntheticEvent | Event, newValue: number | number[]) => {
    const value = newValue as number[];
    onFiltersChange({
      ...filters,
      minPrice: value[0] || undefined,
      maxPrice: value[1] || undefined,
    });
  };

  // 가격 포맷팅 함수
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price);
  };

  // 현재 적용된 필터의 개수 계산
  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.category) count++;
    if (filters.search) count++;
    if (filters.minPrice || filters.maxPrice) count++;
    if (filters.sortBy !== 'createdAt' || filters.sortOrder !== 'desc') count++;
    return count;
  };

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      {/* 필터 제목 */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <FilterListIcon sx={{ mr: 1 }} />
        <Typography variant="h6">
          필터 및 정렬
        </Typography>
        {getActiveFiltersCount() > 0 && (
          <Chip
            label={`${getActiveFiltersCount()}개 적용`}
            size="small"
            color="primary"
            sx={{ ml: 2 }}
          />
        )}
      </Box>

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
        {/* 검색 */}
        <Box sx={{ flex: 1 }}>
          <TextField
            fullWidth
            label="제품 검색"
            variant="outlined"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="제품명 또는 설명으로 검색"
          />
        </Box>

        {/* 카테고리 선택 */}
        <Box sx={{ flex: 1, minWidth: 200 }}>
          <FormControl fullWidth>
            <InputLabel>카테고리</InputLabel>
            <Select
              value={filters.category || 'all'}
              label="카테고리"
              onChange={handleCategoryChange}
            >
              <MenuItem value="all">전체</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* 정렬 옵션 */}
        <Box sx={{ flex: 1, minWidth: 200 }}>
          <FormControl fullWidth>
            <InputLabel>정렬</InputLabel>
            <Select
              value={`${filters.sortBy || 'createdAt'}-${filters.sortOrder || 'desc'}`}
              label="정렬"
              onChange={handleSortChange}
            >
              <MenuItem value="createdAt-desc">최신순</MenuItem>
              <MenuItem value="createdAt-asc">오래된순</MenuItem>
              <MenuItem value="name-asc">이름순 (A-Z)</MenuItem>
              <MenuItem value="name-desc">이름순 (Z-A)</MenuItem>
              <MenuItem value="price-asc">가격 낮은순</MenuItem>
              <MenuItem value="price-desc">가격 높은순</MenuItem>
              <MenuItem value="rating-desc">평점 높은순</MenuItem>
              <MenuItem value="rating-asc">평점 낮은순</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* 가격 범위 슬라이더 */}
      <Box sx={{ px: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          가격 범위
        </Typography>
        <Slider
          value={priceRange}
          onChange={handlePriceRangeChange}
          onChangeCommitted={handlePriceRangeCommitted}
          valueLabelDisplay="auto"
          valueLabelFormat={formatPrice}
          min={0}
          max={1000000}
          step={10000}
          marks={[
            { value: 0, label: '0원' },
            { value: 250000, label: '25만원' },
            { value: 500000, label: '50만원' },
            { value: 750000, label: '75만원' },
            { value: 1000000, label: '100만원' },
          ]}
          sx={{ mt: 2 }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
          <Typography variant="body2" color="text.secondary">
            {formatPrice(priceRange[0])}원
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {formatPrice(priceRange[1])}원
          </Typography>
        </Box>
      </Box>

      {/* 필터 초기화 버튼 */}
      {getActiveFiltersCount() > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Button
            variant="outlined"
            startIcon={<ClearIcon />}
            onClick={onClearFilters}
            color="secondary"
          >
            필터 초기화
          </Button>
        </Box>
      )}
    </Paper>
  );
}