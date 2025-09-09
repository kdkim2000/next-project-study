// src/components/SearchBox.tsx - 간단한 검색 컴포넌트 (초보자용)

'use client';

import React, { useState } from 'react';
import {
  Paper,
  InputBase,
  IconButton,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import { SearchFilters } from '@/types/blog';

/**
 * SearchBox 컴포넌트의 Props 타입
 */
interface SearchBoxProps {
  onSearch: (filters: SearchFilters) => void;  // 검색 실행 콜백 함수
  categories: string[];                        // 사용 가능한 카테고리 목록
  placeholder?: string;                        // 검색 입력 필드 플레이스홀더
}

/**
 * 🎯 학습 목표: 간단한 검색 인터페이스
 * 초보자를 위한 단순한 검색 컴포넌트
 */
const SearchBox: React.FC<SearchBoxProps> = ({
  onSearch,
  categories = [],
  placeholder = '포스트 제목이나 내용을 검색하세요...',
}) => {
  // 검색 상태 관리
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  /**
   * 검색 실행 함수
   */
  const executeSearch = () => {
    const filters: SearchFilters = {
      query: query.trim() || undefined,
      category: selectedCategory || undefined,
    };

    onSearch(filters);
  };

  /**
   * 카테고리 변경 핸들러
   */
  const handleCategoryChange = (event: SelectChangeEvent<string>) => {
    const category = event.target.value;
    setSelectedCategory(category);
    
    // 카테고리 변경 시 즉시 검색 실행
    onSearch({
      query: query.trim() || undefined,
      category: category || undefined,
    });
  };

  /**
   * 모든 필터 초기화
   */
  const handleClearAll = () => {
    setQuery('');
    setSelectedCategory('');
    onSearch({}); // 빈 필터로 검색 (모든 포스트 표시)
  };

  /**
   * Enter 키 눌렀을 때 즉시 검색
   */
  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      executeSearch();
    }
  };

  return (
    <Box sx={{ mb: 4 }}>
      {/* 메인 검색 바 */}
      <Paper
        elevation={2}
        sx={{
          p: '2px 4px',
          display: 'flex',
          alignItems: 'center',
          mb: 2,
          borderRadius: 2,
        }}
      >
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        
        {/* 검색 버튼 */}
        <IconButton 
          type="button" 
          sx={{ p: '10px' }} 
          aria-label="검색"
          onClick={executeSearch}
        >
          <SearchIcon />
        </IconButton>

        {/* 초기화 버튼 */}
        {(query || selectedCategory) && (
          <IconButton
            sx={{ p: '10px' }}
            aria-label="초기화"
            onClick={handleClearAll}
          >
            <ClearIcon />
          </IconButton>
        )}
      </Paper>

      {/* 카테고리 선택 */}
      {categories.length > 0 && (
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel id="category-select-label">카테고리</InputLabel>
          <Select
            labelId="category-select-label"
            value={selectedCategory}
            label="카테고리"
            onChange={handleCategoryChange}
          >
            <MenuItem value="">
              <em>모든 카테고리</em>
            </MenuItem>
            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
    </Box>
  );
};

export default SearchBox;