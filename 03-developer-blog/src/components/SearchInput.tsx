// src/components/SearchInput.tsx
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  TextField, 
  InputAdornment, 
  IconButton,
  Box
} from '@mui/material';
import { Search, Clear } from '@mui/icons-material';

interface SearchInputProps {
  initialQuery?: string;
  placeholder?: string;
  autoFocus?: boolean;
  onSearch?: (query: string) => void; // 새로 추가된 prop
}

export default function SearchInput({ 
  initialQuery = '',
  placeholder = "검색어를 입력하세요...",
  autoFocus = false,
  onSearch // 새로 추가된 prop
}: SearchInputProps) {
  const [query, setQuery] = useState(initialQuery);
  const router = useRouter();

  // URL에서 쿼리 파라미터가 변경될 때 입력값도 동기화
  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const handleSearch = (searchQuery: string) => {
    const trimmedQuery = searchQuery.trim();
    
    // onSearch callback이 제공된 경우 사용
    if (onSearch) {
      onSearch(trimmedQuery);
      return;
    }
    
    // 기본 동작: /search 페이지로 이동
    if (trimmedQuery) {
      router.push(`/search?q=${encodeURIComponent(trimmedQuery)}`);
    } else {
      router.push('/search');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  const handleClear = () => {
    setQuery('');
    if (onSearch) {
      onSearch('');
    } else {
      router.push('/search');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(query);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', maxWidth: 600, mx: 'auto' }}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyPress={handleKeyPress}
        autoFocus={autoFocus}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <IconButton 
                type="submit"
                edge="start"
                aria-label="검색"
                disabled={!query.trim()}
              >
                <Search />
              </IconButton>
            </InputAdornment>
          ),
          endAdornment: query && (
            <InputAdornment position="end">
              <IconButton 
                onClick={handleClear}
                edge="end"
                aria-label="검색어 지우기"
              >
                <Clear />
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
          }
        }}
      />
    </Box>
  );
}
