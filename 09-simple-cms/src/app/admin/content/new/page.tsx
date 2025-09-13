// app/admin/content/new/page.tsx
// 새 글 작성 페이지 - 간단한 폼

'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Alert,
  Stack,
} from '@mui/material';
import { ArrowBack, Save } from '@mui/icons-material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NewPostPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 글 저장
  const handleSave = async () => {
    // 간단한 검증
    if (!title.trim()) {
      setError('제목을 입력해주세요.');
      return;
    }
    
    if (!content.trim()) {
      setError('내용을 입력해주세요.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert('글이 저장되었습니다!');
        router.push('/admin/content'); // 글 목록으로 이동
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError('글 저장에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Box display="flex" alignItems="center" mb={4}>
        <Link href="/admin/content" passHref>
          <Button startIcon={<ArrowBack />}>
            목록으로 돌아가기
          </Button>
        </Link>
        
        <Typography variant="h4" component="h1" ml={2}>
          새 글 작성
        </Typography>
      </Box>

      <Card>
        <CardContent>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Stack spacing={3}>
            <TextField
              label="제목"
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="글 제목을 입력하세요"
              disabled={loading}
            />

            <TextField
              label="내용"
              fullWidth
              multiline
              rows={15}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="글 내용을 입력하세요"
              disabled={loading}
            />

            <Box display="flex" justifyContent="flex-end" gap={2}>
              <Link href="/admin/content" passHref>
                <Button disabled={loading}>
                  취소
                </Button>
              </Link>
              
              <Button
                variant="contained"
                startIcon={<Save />}
                onClick={handleSave}
                disabled={loading || !title.trim() || !content.trim()}
              >
                {loading ? '저장 중...' : '저장'}
              </Button>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* 간단한 사용 팁 */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            💡 사용 팁
          </Typography>
          <Typography variant="body2" color="text.secondary">
            • 제목과 내용을 모두 입력해야 저장할 수 있습니다<br />
            • 저장 후 글 목록 페이지로 자동 이동됩니다<br />
            • 저장된 글은 언제든지 편집하거나 삭제할 수 있습니다
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}