// src/components/WeatherSearch.tsx
// 날씨 검색 및 위치 선택을 위한 컴포넌트

'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box,
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Chip,
  Alert
} from '@mui/material';
import { Search, LocationOn, MyLocation } from '@mui/icons-material';
import { searchLocations } from '@/utils/api';
import { getFavoriteLocations, addFavoriteLocation } from '@/utils/storage';
import type { LocationSearchResult } from '@/types/weather';

interface WeatherSearchProps {
  onLocationSelect: (location: string) => void;
  loading: boolean;
}

function WeatherSearch({ onLocationSelect, loading }: WeatherSearchProps) {
  // 상태 관리
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<LocationSearchResult[]>([]);
  const [favoriteLocations, setFavoriteLocations] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // 검색 디바운싱을 위한 ref
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 컴포넌트 마운트 시 즐겨찾기 목록만 로드
  useEffect(() => {
    const favorites = getFavoriteLocations();
    setFavoriteLocations(favorites);
  }, []);

  // 검색 함수 (useCallback으로 안정화)
  const performSearch = useCallback(async (query: string) => {
    if (query.length < 3) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    setError(null);

    try {
      const results = await searchLocations(query);
      setSearchResults(results);
    } catch (error) {
      setError('검색 중 오류가 발생했습니다.');
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // 검색어 입력 핸들러 (디바운싱 포함)
  const handleSearchQueryChange = useCallback((query: string) => {
    setSearchQuery(query);

    // 기존 타이머 클리어
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // 검색어가 3글자 미만이면 결과 초기화
    if (query.length < 3) {
      setSearchResults([]);
      return;
    }

    // 새 타이머 설정 (500ms 디바운싱)
    searchTimeoutRef.current = setTimeout(() => {
      performSearch(query);
    }, 500);
  }, [performSearch]);

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  // 위치 선택 핸들러
  const handleLocationSelect = useCallback((location: string) => {
    // 검색 상태 초기화
    setSearchQuery('');
    setSearchResults([]);
    
    // 즐겨찾기에 추가
    addFavoriteLocation(location);
    const updatedFavorites = getFavoriteLocations();
    setFavoriteLocations(updatedFavorites);
    
    // 부모 컴포넌트에 전달
    onLocationSelect(location);
  }, [onLocationSelect]);

  // 현재 위치 가져오기
  const handleGetCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('현재 위치를 지원하지 않는 브라우저입니다.');
      return;
    }

    setError(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const coords = `${latitude},${longitude}`;
        onLocationSelect(coords);
      },
      (error) => {
        console.error('Geolocation error:', error);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setError('위치 접근 권한이 거부되었습니다.');
            break;
          case error.POSITION_UNAVAILABLE:
            setError('현재 위치를 확인할 수 없습니다.');
            break;
          case error.TIMEOUT:
            setError('위치 확인 요청이 시간 초과되었습니다.');
            break;
          default:
            setError('알 수 없는 오류가 발생했습니다.');
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  }, [onLocationSelect]);

  return (
    <Card elevation={3} sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          날씨 검색
        </Typography>

        {/* 에러 표시 */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* 검색 입력 필드와 현재 위치 버튼 */}
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <TextField
            fullWidth
            placeholder="도시명을 입력하세요 (예: Seoul, New York, Tokyo)"
            value={searchQuery}
            onChange={(e) => handleSearchQueryChange(e.target.value)}
            InputProps={{
              startAdornment: <Search sx={{ color: 'action.active', mr: 1 }} />,
            }}
            disabled={loading}
          />
          <Button
            variant="outlined"
            onClick={handleGetCurrentLocation}
            disabled={loading}
            startIcon={<MyLocation />}
            sx={{ minWidth: 'auto', px: 2 }}
          >
            현재 위치
          </Button>
        </Box>

        {/* 검색 결과 */}
        {(isSearching || searchResults.length > 0) && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              검색 결과
            </Typography>
            {isSearching ? (
              <Typography variant="body2" color="text.secondary">
                검색 중...
              </Typography>
            ) : (
              <List dense sx={{ bgcolor: 'grey.50', borderRadius: 1 }}>
                {searchResults.map((location) => (
                  <ListItem key={location.id} disablePadding>
                    <ListItemButton onClick={() => handleLocationSelect(location.name)}>
                      <LocationOn sx={{ mr: 1, color: 'primary.main' }} />
                      <ListItemText
                        primary={location.name}
                        secondary={`${location.region}, ${location.country}`}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            )}
          </Box>
        )}

        {/* 즐겨찾기 지역 */}
        {favoriteLocations.length > 0 && (
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              최근 검색 지역
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {favoriteLocations.slice(-6).map((location, index) => (
                <Chip
                  key={`${location}-${index}`}
                  label={location}
                  onClick={() => handleLocationSelect(location)}
                  clickable
                  variant="outlined"
                  size="small"
                  disabled={loading}
                />
              ))}
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

export default WeatherSearch;