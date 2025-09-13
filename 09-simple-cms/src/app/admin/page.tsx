// app/admin/page.tsx
// 간단한 관리자 대시보드

'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Alert,
} from '@mui/material';
import { Article, Add, Dashboard } from '@mui/icons-material';
import Link from 'next/link';
import { Post } from '@/lib/posts';

export default function AdminDashboard() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 글 목록 가져오기
  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await fetch('/api/posts');
        const data = await response.json();
        
        if (data.success) {
          setPosts(data.data);
        } else {
          setError(data.error);
        }
      } catch (error) {
        setError('글 목록을 가져오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <Box textAlign="center" py={4}>
        <Typography>로딩 중...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        <Dashboard sx={{ mr: 1, verticalAlign: 'middle' }} />
        대시보드
      </Typography>
      
      <Typography variant="body1" color="text.secondary" mb={4}>
        간단한 CMS 관리 페이지입니다
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3} mb={4}>
        {/* 통계 카드 */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Article color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">
                  총 글 수
                </Typography>
              </Box>
              <Typography variant="h4" color="primary.main">
                {posts.length}개
              </Typography>
              <Typography variant="body2" color="text.secondary">
                작성된 글의 총 개수
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                빠른 작업
              </Typography>
              <Box display="flex" flexDirection="column" gap={1}>
                <Link href="/admin/content/new" passHref>
                  <Button 
                    variant="contained" 
                    startIcon={<Add />}
                    fullWidth
                  >
                    새 글 작성
                  </Button>
                </Link>
                <Link href="/admin/content" passHref>
                  <Button variant="outlined" fullWidth>
                    모든 글 보기
                  </Button>
                </Link>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                최근 활동
              </Typography>
              {posts.length > 0 ? (
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    최근 글: {posts[posts.length - 1]?.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(posts[posts.length - 1]?.createdAt).toLocaleDateString('ko-KR')}
                  </Typography>
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  아직 작성된 글이 없습니다
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* 최근 글 목록 (간단히) */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            최근 글 목록
          </Typography>
          
          {posts.length === 0 ? (
            <Box textAlign="center" py={4}>
              <Typography color="text.secondary" mb={2}>
                아직 작성된 글이 없습니다
              </Typography>
              <Link href="/admin/content/new" passHref>
                <Button variant="contained" startIcon={<Add />}>
                  첫 번째 글 작성하기
                </Button>
              </Link>
            </Box>
          ) : (
            <Box>
              {posts.slice(-5).reverse().map((post) => (
                <Box 
                  key={post.id} 
                  py={2} 
                  borderBottom="1px solid"
                  borderColor="divider"
                >
                  <Typography variant="subtitle1" fontWeight="medium">
                    {post.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {post.content.substring(0, 100)}
                    {post.content.length > 100 ? '...' : ''}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(post.createdAt).toLocaleDateString('ko-KR')}
                  </Typography>
                </Box>
              ))}
              
              <Box mt={2} textAlign="center">
                <Link href="/admin/content" passHref>
                  <Button variant="outlined">
                    모든 글 보기
                  </Button>
                </Link>
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}