// app/admin/content/page.tsx
// 글 목록 페이지 - 간단한 CRUD 기능

'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  IconButton,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
} from '@mui/material';
import { Article, Add, Edit, Delete } from '@mui/icons-material';
import Link from 'next/link';
import { Post } from '@/lib/posts';

export default function ContentListPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editDialog, setEditDialog] = useState<{
    open: boolean;
    post: Post | null;
  }>({ open: false, post: null });
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');

  // 글 목록 가져오기
  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts');
      const data = await response.json();
      
      if (data.success) {
        setPosts(data.data.reverse()); // 최신순 정렬
        setError('');
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError('글 목록을 가져오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // 글 삭제
  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`"${title}" 글을 삭제하시겠습니까?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/posts?id=${id}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (data.success) {
        fetchPosts(); // 목록 새로고침
        alert('글이 삭제되었습니다.');
      } else {
        alert(data.error);
      }
    } catch (error) {
      alert('글 삭제에 실패했습니다.');
    }
  };

  // 편집 다이얼로그 열기
  const handleEditOpen = (post: Post) => {
    setEditDialog({ open: true, post });
    setEditTitle(post.title);
    setEditContent(post.content);
  };

  // 편집 다이얼로그 닫기
  const handleEditClose = () => {
    setEditDialog({ open: false, post: null });
    setEditTitle('');
    setEditContent('');
  };

  // 글 수정
  const handleEditSave = async () => {
    if (!editDialog.post || !editTitle.trim() || !editContent.trim()) {
      alert('제목과 내용을 모두 입력해주세요.');
      return;
    }

    try {
      const response = await fetch(`/api/posts?id=${editDialog.post.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: editTitle.trim(),
          content: editContent.trim(),
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        fetchPosts(); // 목록 새로고침
        handleEditClose();
        alert('글이 수정되었습니다.');
      } else {
        alert(data.error);
      }
    } catch (error) {
      alert('글 수정에 실패했습니다.');
    }
  };

  if (loading) {
    return (
      <Box textAlign="center" py={4}>
        <Typography>로딩 중...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1">
          <Article sx={{ mr: 1, verticalAlign: 'middle' }} />
          글 관리
        </Typography>
        
        <Link href="/admin/content/new" passHref>
          <Button variant="contained" startIcon={<Add />}>
            새 글 작성
          </Button>
        </Link>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {posts.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <Article sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              작성된 글이 없습니다
            </Typography>
            <Typography color="text.secondary" mb={3}>
              첫 번째 글을 작성해보세요!
            </Typography>
            <Link href="/admin/content/new" passHref>
              <Button variant="contained" startIcon={<Add />}>
                글 작성하기
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <Stack spacing={2}>
          {posts.map((post) => (
            <Card key={post.id}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                  <Box flex={1}>
                    <Typography variant="h6" gutterBottom>
                      {post.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mb={2}>
                      {post.content.length > 200 
                        ? post.content.substring(0, 200) + '...' 
                        : post.content
                      }
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      작성일: {new Date(post.createdAt).toLocaleString('ko-KR')}
                      {post.updatedAt !== post.createdAt && (
                        <> • 수정일: {new Date(post.updatedAt).toLocaleString('ko-KR')}</>
                      )}
                    </Typography>
                  </Box>
                  
                  <Box ml={2}>
                    <IconButton 
                      color="primary"
                      onClick={() => handleEditOpen(post)}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton 
                      color="error"
                      onClick={() => handleDelete(post.id, post.title)}
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}

      {/* 편집 다이얼로그 */}
      <Dialog 
        open={editDialog.open} 
        onClose={handleEditClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>글 편집</DialogTitle>
        <DialogContent>
          <TextField
            label="제목"
            fullWidth
            margin="normal"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
          />
          <TextField
            label="내용"
            fullWidth
            multiline
            rows={10}
            margin="normal"
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose}>
            취소
          </Button>
          <Button 
            onClick={handleEditSave}
            variant="contained"
          >
            저장
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}