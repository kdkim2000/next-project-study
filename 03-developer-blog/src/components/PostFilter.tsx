// src/components/PostFilter.tsx
"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Button
} from '@mui/material';
import { ExpandMore, FilterList, Clear } from '@mui/icons-material';

// 타입 정의를 직접 포함
interface CategoryData {
  name: string;
  slug: string;
  count: number;
}

interface TagData {
  name: string;
  slug: string;
  count: number;
}

interface PostFilterProps {
  categories: CategoryData[];
  tags: TagData[];
  onFilterChange: (filters: FilterState) => void;
}

interface FilterState {
  sortBy: 'date' | 'title' | 'readingTime';
  selectedCategories: string[];
  selectedTags: string[];
  searchQuery: string;
}

export default function PostFilter({ categories, tags, onFilterChange }: PostFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [filters, setFilters] = useState<FilterState>({
    sortBy: (searchParams.get('sort') as 'date' | 'title' | 'readingTime') || 'date',
    selectedCategories: searchParams.getAll('category'),
    selectedTags: searchParams.getAll('tag'),
    searchQuery: searchParams.get('search') || ''
  });
  
  const [showFilters, setShowFilters] = useState(false);

  // URL 파라미터 업데이트
  const updateURL = (newFilters: FilterState) => {
    const params = new URLSearchParams();
    
    if (newFilters.sortBy !== 'date') {
      params.set('sort', newFilters.sortBy);
    }
    
    newFilters.selectedCategories.forEach(cat => {
      params.append('category', cat);
    });
    
    newFilters.selectedTags.forEach(tag => {
      params.append('tag', tag);
    });
    
    if (newFilters.searchQuery.trim()) {
      params.set('search', newFilters.searchQuery);
    }
    
    const queryString = params.toString();
    router.push(queryString ? `?${queryString}` : '', { scroll: false });
  };

  // 필터 변경 처리
  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    updateURL(newFilters);
    onFilterChange(newFilters);
  };

  // 정렬 변경
  const handleSortChange = (sortBy: 'date' | 'title' | 'readingTime') => {
    const newFilters = { ...filters, sortBy };
    handleFilterChange(newFilters);
  };

  // 카테고리 선택/해제
  const handleCategoryToggle = (category: string) => {
    const selectedCategories = filters.selectedCategories.includes(category)
      ? filters.selectedCategories.filter(c => c !== category)
      : [...filters.selectedCategories, category];
    
    const newFilters = { ...filters, selectedCategories };
    handleFilterChange(newFilters);
  };

  // 태그 선택/해제
  const handleTagToggle = (tag: string) => {
    const selectedTags = filters.selectedTags.includes(tag)
      ? filters.selectedTags.filter(t => t !== tag)
      : [...filters.selectedTags, tag];
    
    const newFilters = { ...filters, selectedTags };
    handleFilterChange(newFilters);
  };

  // 필터 초기화
  const handleClearFilters = () => {
    const newFilters: FilterState = {
      sortBy: 'date',
      selectedCategories: [],
      selectedTags: [],
      searchQuery: ''
    };
    handleFilterChange(newFilters);
  };

  // 활성 필터 수 계산
  const activeFiltersCount = 
    filters.selectedCategories.length + 
    filters.selectedTags.length + 
    (filters.sortBy !== 'date' ? 1 : 0) +
    (filters.searchQuery.trim() ? 1 : 0);

  return (
    <Box sx={{ mb: 3 }}>
      {/* 정렬 및 필터 토글 버튼 */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 2, 
        mb: 2,
        flexWrap: 'wrap'
      }}>
        {/* 정렬 드롭다운 */}
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>정렬</InputLabel>
          <Select
            value={filters.sortBy}
            label="정렬"
            onChange={(e) => handleSortChange(e.target.value as 'date' | 'title' | 'readingTime')}
          >
            <MenuItem value="date">최신순</MenuItem>
            <MenuItem value="title">제목순</MenuItem>
            <MenuItem value="readingTime">읽기 시간순</MenuItem>
          </Select>
        </FormControl>

        {/* 필터 토글 버튼 */}
        <Button
          variant="outlined"
          startIcon={<FilterList />}
          onClick={() => setShowFilters(!showFilters)}
          sx={{ position: 'relative' }}
        >
          필터
          {activeFiltersCount > 0 && (
            <Chip 
              label={activeFiltersCount}
              size="small"
              color="primary"
              sx={{ 
                position: 'absolute',
                top: -8,
                right: -8,
                minWidth: 20,
                height: 20
              }}
            />
          )}
        </Button>

        {/* 필터 초기화 버튼 */}
        {activeFiltersCount > 0 && (
          <Button
            variant="text"
            startIcon={<Clear />}
            onClick={handleClearFilters}
            size="small"
          >
            필터 초기화
          </Button>
        )}
      </Box>

      {/* 활성 필터 태그들 */}
      {activeFiltersCount > 0 && (
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
          {filters.selectedCategories.map(category => (
            <Chip
              key={`cat-${category}`}
              label={`카테고리: ${category}`}
              onDelete={() => handleCategoryToggle(category)}
              color="primary"
              variant="outlined"
              size="small"
            />
          ))}
          {filters.selectedTags.map(tag => (
            <Chip
              key={`tag-${tag}`}
              label={`태그: ${tag}`}
              onDelete={() => handleTagToggle(tag)}
              color="secondary"
              variant="outlined"
              size="small"
            />
          ))}
        </Box>
      )}

      {/* 상세 필터 패널 */}
      {showFilters && (
        <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 2 }}>
          {/* 카테고리 필터 */}
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography>카테고리</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <FormGroup>
                {categories.slice(0, 10).map(category => (
                  <FormControlLabel
                    key={category.slug}
                    control={
                      <Checkbox
                        checked={filters.selectedCategories.includes(category.slug)}
                        onChange={() => handleCategoryToggle(category.slug)}
                      />
                    }
                    label={`${category.name} (${category.count})`}
                  />
                ))}
              </FormGroup>
            </AccordionDetails>
          </Accordion>

          {/* 태그 필터 */}
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography>태그</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <FormGroup>
                {tags.slice(0, 15).map(tag => (
                  <FormControlLabel
                    key={tag.slug}
                    control={
                      <Checkbox
                        checked={filters.selectedTags.includes(tag.slug)}
                        onChange={() => handleTagToggle(tag.slug)}
                      />
                    }
                    label={`${tag.name} (${tag.count})`}
                  />
                ))}
              </FormGroup>
            </AccordionDetails>
          </Accordion>
        </Box>
      )}
    </Box>
  );
}