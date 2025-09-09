// src/components/PostList.tsx - 블로그 포스트들을 리스트 형태로 표시하는 컴포넌트

'use client';

import React from 'react';
import {
  Grid,
  Typography,
  Box,
  Alert,
} from '@mui/material';
import {
  Article as ArticleIcon,
} from '@mui/icons-material';
import PostCard from './PostCard';
import { BlogPost } from '@/types/blog';

/**
 * PostList 컴포넌트의 Props 타입
 */
interface PostListProps {
  posts: BlogPost[];           // 표시할 포스트 배열
  title?: string;              // 리스트 제목 (선택적)
  loading?: boolean;           // 로딩 상태
  emptyMessage?: string;       // 포스트가 없을 때 표시할 메시지
  showFeatured?: boolean;      // 추천 포스트 표시 여부
  maxItems?: number;           // 표시할 최대 포스트 개수
}

/**
 * 스켈레톤 로딩 카드 컴포넌트
 */
const SkeletonCard: React.FC = () => (
  <Grid item xs={12} sm={6} md={4}>
    <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 2 }}>
      <Skeleton variant="rectangular" width="100%" height={20} sx={{ mb: 2 }} />
      <Skeleton variant="text" width="80%" height={32} sx={{ mb: 1 }} />
      <Skeleton variant="text" width="60%" height={32} sx={{ mb: 2 }} />
      <Skeleton variant="text" width="100%" height={16} sx={{ mb: 1 }} />
      <Skeleton variant="text" width="100%" height={16} sx={{ mb: 1 }} />
      <Skeleton variant="text" width="70%" height={16} sx={{ mb: 2 }} />
      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <Skeleton variant="rounded" width={60} height={24} />
        <Skeleton variant="rounded" width={50} height={24} />
        <Skeleton variant="rounded" width={70} height={24} />
      </Box>
      <Skeleton variant="rectangular" width="100%" height={36} />
    </Box>
  </Grid>
);

/**
 * 블로그 포스트 리스트 컴포넌트
 */
const PostList: React.FC<PostListProps> = ({
  posts,
  title,
  loading = false,
  emptyMessage = '아직 작성된 포스트가 없습니다.',
  showFeatured = false,
  maxItems,
}) => {
  // maxItems가 설정된 경우 해당 개수만큼 자르기
  const displayPosts = maxItems ? posts.slice(0, maxItems) : posts;

  return (
    <Box sx={{ py: 4 }}>
      {/* 리스트 제목 */}
      {title && (
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography
            variant="h4"
            component="h2"
            sx={{
              fontWeight: 700,
              mb: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2,
            }}
          >
            <ArticleIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            {title}
          </Typography>
        </Box>
      )}

      {/* 로딩 상태 */}
      {loading && (
        <Grid container spacing={3}>
          {Array.from({ length: 6 }).map((_, index) => (
            <SkeletonCard key={`skeleton-${index}`} />
          ))}
        </Grid>
      )}

      {/* 포스트가 없는 경우 */}
      {!loading && displayPosts.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Alert 
            severity="info" 
            sx={{ 
              maxWidth: 400, 
              margin: '0 auto',
              '& .MuiAlert-message': {
                width: '100%',
                textAlign: 'center',
              },
            }}
          >
            <Typography variant="h6" sx={{ mb: 1 }}>
              포스트를 찾을 수 없습니다
            </Typography>
            <Typography variant="body2">
              {emptyMessage}
            </Typography>
          </Alert>
        </Box>
      )}

      {/* 포스트 리스트 */}
      {!loading && displayPosts.length > 0 && (
        <Grid container spacing={3}>
          {displayPosts.map((post) => (
            <Grid item xs={12} sm={6} lg={4} key={post.slug}>
              <PostCard 
                post={post} 
                featured={showFeatured && post.featured}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {/* 더 많은 포스트가 있을 때 안내 메시지 */}
      {maxItems && posts.length > maxItems && (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="body2" color="text.secondary">
            총 {posts.length}개의 포스트 중 {maxItems}개를 표시하고 있습니다.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default PostList;