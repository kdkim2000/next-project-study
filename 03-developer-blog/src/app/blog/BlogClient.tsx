// src/app/blog/BlogClient.tsx
"use client";

import { useState, useMemo } from 'react';
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { 
  Typography, 
  List, 
  ListItem, 
  Chip, 
  Box,
  Card,
  CardContent,
  Container
} from "@mui/material";
import { AccessTime, CalendarToday } from "@mui/icons-material";
import SearchInput from "@/components/SearchInput";
import PostFilter from "@/components/PostFilter";

interface FilterState {
  sortBy: 'date' | 'title' | 'readingTime';
  selectedCategories: string[];
  selectedTags: string[];
  searchQuery: string;
}

interface BlogClientProps {
  initialPosts: any[];
  categories: any[];
  tags: any[];
}

// 클라이언트에서 사용할 정렬 함수
const sortPosts = (posts: any[], sortBy: 'date' | 'title' | 'readingTime' = 'date') => {
  return [...posts].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        if (!a.date) return 1;
        if (!b.date) return -1;
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case 'title':
        return a.title.localeCompare(b.title);
      case 'readingTime':
        const aTime = a.readingTime?.minutes || 0;
        const bTime = b.readingTime?.minutes || 0;
        return aTime - bTime;
      default:
        return 0;
    }
  });
};

// 클라이언트에서 사용할 검색 함수
const searchPosts = (posts: any[], query: string) => {
  if (!query.trim()) return posts;
  
  const searchTerm = query.toLowerCase();
  return posts.filter(post => {
    return (
      post.title.toLowerCase().includes(searchTerm) ||
      post.description?.toLowerCase().includes(searchTerm) ||
      post.category?.toLowerCase().includes(searchTerm) ||
      post.tags?.some((tag: string) => tag.toLowerCase().includes(searchTerm)) ||
      post.keywords?.some((keyword: string) => keyword.toLowerCase().includes(searchTerm))
    );
  });
};

// 클라이언트에서 사용할 필터링 함수
const filterPosts = (posts: any[], filters: {
  categories?: string[];
  tags?: string[];
  searchQuery?: string;
}) => {
  let filteredPosts = [...posts];
  
  // 카테고리 필터
  if (filters.categories && filters.categories.length > 0) {
    filteredPosts = filteredPosts.filter(post => 
      filters.categories!.includes(post.category || 'uncategorized')
    );
  }
  
  // 태그 필터
  if (filters.tags && filters.tags.length > 0) {
    filteredPosts = filteredPosts.filter(post => 
      filters.tags!.some(tag => post.tags?.includes(tag))
    );
  }
  
  // 검색어 필터
  if (filters.searchQuery && filters.searchQuery.trim()) {
    filteredPosts = searchPosts(filteredPosts, filters.searchQuery);
  }
  
  return filteredPosts;
};

export default function BlogClient({ initialPosts, categories, tags }: BlogClientProps) {
  const router = useRouter();
  const [filters, setFilters] = useState<FilterState>({
    sortBy: 'date',
    selectedCategories: [],
    selectedTags: [],
    searchQuery: ''
  });

  // 필터링 및 정렬된 포스트 계산
  const filteredAndSortedPosts = useMemo(() => {
    let posts = initialPosts;
    
    // 필터링 적용
    posts = filterPosts(posts, {
      categories: filters.selectedCategories,
      tags: filters.selectedTags,
      searchQuery: filters.searchQuery
    });
    
    // 정렬 적용
    posts = sortPosts(posts, filters.sortBy);
    
    return posts;
  }, [initialPosts, filters]);

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  return (
    <Container>
      {/* 페이지 헤더 */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom>
          블로그 포스트
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          개발과 기술에 대한 다양한 이야기를 나누는 공간입니다.
        </Typography>
        
        {/* 검색 입력 */}
        <Box sx={{ mt: 3, mb: 2 }}>
          <SearchInput placeholder="포스트 검색..." />
        </Box>
      </Box>

      {/* 통계 정보 */}
      <Box sx={{ 
        display: 'flex', 
        gap: 3, 
        mb: 4, 
        p: 2, 
        backgroundColor: 'background.paper',
        borderRadius: 1,
        justifyContent: 'center',
        flexWrap: 'wrap'
      }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h4" color="primary">
            {initialPosts.length}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            전체 포스트
          </Typography>
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h4" color="primary">
            {categories.length}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            카테고리
          </Typography>
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h4" color="primary">
            {tags.length}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            태그
          </Typography>
        </Box>
      </Box>

      {/* 필터 컴포넌트 */}
      <PostFilter 
        categories={categories}
        tags={tags}
        onFilterChange={handleFilterChange}
      />

      {/* 결과 개수 표시 */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="body2" color="text.secondary">
          {filteredAndSortedPosts.length}개의 포스트
          {filters.searchQuery && ` (검색: "${filters.searchQuery}")`}
        </Typography>
      </Box>
      
      {/* 포스트 목록 */}
      <List sx={{ width: '100%' }}>
        {filteredAndSortedPosts.map((post) => (
          <ListItem
            key={post.slug}
            sx={{ 
              px: 0, 
              py: 1,
              display: 'block'
            }}
          >
            <Card 
              component={Link} 
              href={`/blog/${post.slug}`}
              sx={{ 
                textDecoration: 'none',
                display: 'block',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 2
                }
              }}
            >
              <CardContent>
                <Typography variant="h6" component="h2" gutterBottom>
                  {post.title}
                </Typography>
                
                {post.description && (
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    paragraph
                    sx={{ mb: 2 }}
                  >
                    {post.description}
                  </Typography>
                )}
                
                {/* 카테고리 */}
                {post.category && (
                  <Box sx={{ mb: 2 }}>
                    <Chip
                      label={post.category}
                      size="small"
                      color="primary"
                      variant="filled"
                      clickable
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        router.push(`/category/${post.category}`);
                      }}
                      sx={{ textDecoration: 'none' }}
                    />
                  </Box>
                )}
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', mb: 2 }}>
                  {post.date && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <CalendarToday fontSize="small" color="action" />
                      <Typography variant="caption" color="text.secondary">
                        {post.date}
                      </Typography>
                    </Box>
                  )}
                  
                  {post.readingTime && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <AccessTime fontSize="small" color="action" />
                      <Typography variant="caption" color="text.secondary">
                        {post.readingTime.text}
                      </Typography>
                    </Box>
                  )}
                </Box>
                
                {/* 태그 */}
                {post.tags && post.tags.length > 0 && (
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                    {post.tags.slice(0, 3).map((tag, index) => (
                      <Chip 
                        key={index}
                        label={tag} 
                        size="small" 
                        variant="outlined"
                        clickable
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          router.push(`/tag/${tag}`);
                        }}
                        sx={{ 
                          fontSize: '0.7rem',
                          textDecoration: 'none',
                          '&:hover': {
                            backgroundColor: 'primary.main',
                            color: 'primary.contrastText'
                          }
                        }}
                      />
                    ))}
                    {post.tags.length > 3 && (
                      <Typography variant="caption" color="text.secondary">
                        +{post.tags.length - 3} more
                      </Typography>
                    )}
                  </Box>
                )}
              </CardContent>
            </Card>
          </ListItem>
        ))}
      </List>

      {/* 포스트가 없을 때 */}
      {filteredAndSortedPosts.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            조건에 맞는 포스트가 없습니다.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            다른 검색어나 필터를 시도해보세요.
          </Typography>
        </Box>
      )}

      {/* 인기 카테고리 */}
      <Box sx={{ mt: 6 }}>
        <Typography variant="h5" gutterBottom>
          카테고리별 탐색
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 4 }}>
          {categories.slice(0, 6).map(category => (
            <Chip
              key={category.slug}
              label={`${category.name} (${category.count})`}
              clickable
              variant="outlined"
              onClick={() => {
                router.push(`/category/${category.slug}`);
              }}
              sx={{
                textDecoration: 'none',
                '&:hover': {
                  backgroundColor: 'primary.main',
                  color: 'primary.contrastText'
                }
              }}
            />
          ))}
        </Box>
      </Box>

      {/* 인기 태그 */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          인기 태그
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {tags.slice(0, 12).map(tag => (
            <Chip
              key={tag.slug}
              label={`#${tag.name} (${tag.count})`}
              clickable
              variant="outlined"
              size="small"
              onClick={() => {
                router.push(`/tag/${tag.slug}`);
              }}
              sx={{
                textDecoration: 'none',
                '&:hover': {
                  backgroundColor: 'primary.main',
                  color: 'primary.contrastText'
                }
              }}
            />
          ))}
        </Box>
      </Box>
    </Container>
  );
}