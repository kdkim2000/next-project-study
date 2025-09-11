// src/components/FilterAndSort.tsx - 할 일 목록의 필터링과 정렬을 담당하는 컴포넌트

'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Paper,
  Chip,
  IconButton,
  Collapse,
  Typography,
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  FilterList as FilterIcon,
  Sort as SortIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from '@mui/icons-material';
import { Priority, Status } from '@prisma/client';
import { FilterOptions, SortOptions } from '@/types';
import { getPriorityLabel, getStatusLabel, debounce } from '@/lib/utils';

interface FilterAndSortProps {
  // 현재 필터 및 정렬 상태
  filters: FilterOptions;
  sort: SortOptions;
  // 상태 변경 콜백 함수들
  onFiltersChange: (filters: FilterOptions) => void;
  onSortChange: (sort: SortOptions) => void;
  // 총 할 일 개수 (필터링 전)
  totalCount: number;
  // 필터링된 할 일 개수
  filteredCount: number;
}

export default function FilterAndSort({
  filters,
  sort,
  onFiltersChange,
  onSortChange,
  totalCount,
  filteredCount,
}: FilterAndSortProps) {
  // 로컬 검색어 상태 (디바운싱을 위해)
  const [localSearch, setLocalSearch] = useState(filters.search || '');
  
  // 필터 패널 확장/축소 상태
  const [expanded, setExpanded] = useState(false);
  
  // 활성 필터 개수 계산
  const activeFiltersCount = [
    filters.status !== 'ALL',
    filters.priority !== 'ALL',
    filters.search && filters.search.length > 0,
  ].filter(Boolean).length;

  // 검색어 디바운싱 처리
  const debouncedSearchChange = debounce((searchTerm: string) => {
    onFiltersChange({
      ...filters,
      search: searchTerm.trim() || undefined,
    });
  }, 300); // 300ms 지연

  // 로컬 검색어 변경 시 디바운싱 적용
  useEffect(() => {
    debouncedSearchChange(localSearch);
  }, [localSearch, debouncedSearchChange]);

  // 검색어 입력 처리
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearch(event.target.value);
  };

  // 검색어 초기화
  const handleSearchClear = () => {
    setLocalSearch('');
    onFiltersChange({
      ...filters,
      search: undefined,
    });
  };

  // 상태 필터 변경
  const handleStatusChange = (status: string) => {
    onFiltersChange({
      ...filters,
      status: status as Status | 'ALL',
    });
  };

  // 우선순위 필터 변경
  const handlePriorityChange = (priority: string) => {
    onFiltersChange({
      ...filters,
      priority: priority as Priority | 'ALL',
    });
  };

  // 정렬 필드 변경
  const handleSortFieldChange = (field: string) => {
    onSortChange({
      ...sort,
      field: field as SortOptions['field'],
    });
  };

  // 정렬 방향 변경
  const handleSortDirectionChange = (direction: string) => {
    onSortChange({
      ...sort,
      direction: direction as 'asc' | 'desc',
    });
  };

  // 모든 필터 초기화
  const handleClearAllFilters = () => {
    setLocalSearch('');
    onFiltersChange({
      status: 'ALL',
      priority: 'ALL',
      search: undefined,
    });
  };

  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      {/* 상단: 검색바와 필터 토글 */}
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
        {/* 검색 입력 */}
        <TextField
          placeholder="할 일 검색..."
          value={localSearch}
          onChange={handleSearchChange}
          size="small"
          sx={{ flexGrow: 1 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: localSearch && (
              <InputAdornment position="end">
                <IconButton size="small" onClick={handleSearchClear}>
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {/* 필터 토글 버튼 */}
        <IconButton
          onClick={() => setExpanded(!expanded)}
          color={activeFiltersCount > 0 ? 'primary' : 'default'}
          sx={{ position: 'relative' }}
        >
          <FilterIcon />
          {/* 활성 필터 개수 표시 */}
          {activeFiltersCount > 0 && (
            <Chip
              label={activeFiltersCount}
              size="small"
              color="primary"
              sx={{
                position: 'absolute',
                top: -8,
                right: -8,
                height: 16,
                minWidth: 16,
                fontSize: '0.75rem',
              }}
            />
          )}
        </IconButton>

        {/* 확장/축소 아이콘 */}
        <IconButton onClick={() => setExpanded(!expanded)} size="small">
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Box>

      {/* 필터링된 결과 요약 */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          {filteredCount === totalCount 
            ? `총 ${totalCount}개의 할 일`
            : `${totalCount}개 중 ${filteredCount}개 표시`
          }
        </Typography>
        
        {/* 활성 필터 칩들 */}
        {activeFiltersCount > 0 && (
          <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
            {filters.status !== 'ALL' && (
              <Chip
                label={`상태: ${getStatusLabel(filters.status as Status)}`}
                size="small"
                onDelete={() => handleStatusChange('ALL')}
                variant="outlined"
              />
            )}
            {filters.priority !== 'ALL' && (
              <Chip
                label={`우선순위: ${getPriorityLabel(filters.priority as Priority)}`}
                size="small"
                onDelete={() => handlePriorityChange('ALL')}
                variant="outlined"
              />
            )}
            {filters.search && (
              <Chip
                label={`검색: ${filters.search}`}
                size="small"
                onDelete={handleSearchClear}
                variant="outlined"
              />
            )}
            <Chip
              label="모든 필터 해제"
              size="small"
              onClick={handleClearAllFilters}
              variant="outlined"
              color="secondary"
            />
          </Box>
        )}
      </Box>

      {/* 확장 가능한 필터 및 정렬 옵션 */}
      <Collapse in={expanded}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          {/* 상태 필터 */}
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>상태</InputLabel>
            <Select
              value={filters.status || 'ALL'}
              onChange={(e) => handleStatusChange(e.target.value)}
              label="상태"
            >
              <MenuItem value="ALL">전체</MenuItem>
              {Object.values(Status).map((status) => (
                <MenuItem key={status} value={status}>
                  {getStatusLabel(status)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* 우선순위 필터 */}
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>우선순위</InputLabel>
            <Select
              value={filters.priority || 'ALL'}
              onChange={(e) => handlePriorityChange(e.target.value)}
              label="우선순위"
            >
              <MenuItem value="ALL">전체</MenuItem>
              {Object.values(Priority).map((priority) => (
                <MenuItem key={priority} value={priority}>
                  {getPriorityLabel(priority)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* 정렬 기준 */}
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>정렬 기준</InputLabel>
            <Select
              value={sort.field}
              onChange={(e) => handleSortFieldChange(e.target.value)}
              label="정렬 기준"
              startAdornment={<SortIcon fontSize="small" />}
            >
              <MenuItem value="createdAt">생성일</MenuItem>
              <MenuItem value="updatedAt">수정일</MenuItem>
              <MenuItem value="dueDate">마감일</MenuItem>
              <MenuItem value="priority">우선순위</MenuItem>
              <MenuItem value="title">제목</MenuItem>
            </Select>
          </FormControl>

          {/* 정렬 방향 */}
          <FormControl size="small" sx={{ minWidth: 100 }}>
            <InputLabel>정렬 방향</InputLabel>
            <Select
              value={sort.direction}
              onChange={(e) => handleSortDirectionChange(e.target.value)}
              label="정렬 방향"
            >
              <MenuItem value="desc">내림차순</MenuItem>
              <MenuItem value="asc">오름차순</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Collapse>
    </Paper>
  );
}