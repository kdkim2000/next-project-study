// src/components/Pagination.tsx - 페이지네이션 컴포넌트

'use client';

import React from 'react';
import {
  Box,
  Pagination as MUIPagination,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import { PaginationInfo } from '@/types';

interface PaginationProps {
  pagination: PaginationInfo;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

/**
 * 페이지네이션과 페이지당 항목 수 선택 기능을 제공하는 컴포넌트
 */
export default function Pagination({
  pagination,
  onPageChange,
  onLimitChange,
}: PaginationProps) {
  // 페이지 변경 핸들러
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    onPageChange(value);
  };

  // 페이지당 항목 수 변경 핸들러
  const handleLimitChange = (event: SelectChangeEvent<number>) => {
    const newLimit = event.target.value as number;
    onLimitChange(newLimit);
  };

  // 현재 보여지는 항목 범위 계산
  const startItem = (pagination.page - 1) * pagination.limit + 1;
  const endItem = Math.min(pagination.page * pagination.limit, pagination.total);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        mt: 4,
        p: 2,
        backgroundColor: 'background.paper',
        borderRadius: 1,
        boxShadow: 1,
      }}
    >
      {/* 항목 정보 및 페이지당 항목 수 선택 */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          flexDirection: { xs: 'column', sm: 'row' },
        }}
      >
        <Typography variant="body2" color="text.secondary">
          전체 {pagination.total.toLocaleString()}개 중{' '}
          {startItem.toLocaleString()}-{endItem.toLocaleString()}개 표시
        </Typography>

        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>페이지당</InputLabel>
          <Select
            value={pagination.limit}
            label="페이지당"
            onChange={handleLimitChange}
          >
            <MenuItem value={6}>6개씩</MenuItem>
            <MenuItem value={12}>12개씩</MenuItem>
            <MenuItem value={24}>24개씩</MenuItem>
            <MenuItem value={48}>48개씩</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* 페이지네이션 */}
      {pagination.totalPages > 1 && (
        <MUIPagination
          count={pagination.totalPages}
          page={pagination.page}
          onChange={handlePageChange}
          color="primary"
          size="large"
          showFirstButton
          showLastButton
          sx={{
            '& .MuiPagination-ul': {
              justifyContent: 'center',
            },
          }}
        />
      )}

      {/* 페이지 정보 */}
      <Typography variant="body2" color="text.secondary">
        {pagination.page} / {pagination.totalPages} 페이지
      </Typography>
    </Box>
  );
}