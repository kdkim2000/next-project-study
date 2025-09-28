// src/app/editor/page.tsx
"use client";

import React, { useState, useCallback } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Stack,
} from '@mui/material';
import {
  Save as SaveIcon,
  Preview as PreviewIcon,
  Download as DownloadIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import { remark } from 'remark';
import remarkRehype from 'remark-rehype';
import rehypePrism from 'rehype-prism-plus';
import rehypeStringify from 'rehype-stringify';

interface BlogPost {
  title: string;
  date: string;
  description: string;
  keywords: string[];
  content: string;
}

export default function EditorPage() {
  const [post, setPost] = useState<BlogPost>({
    title: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    keywords: [],
    content: '',
  });
  const [keywordInput, setKeywordInput] = useState('');
  const [previewHtml, setPreviewHtml] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9가-힣]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const handleKeywordAdd = () => {
    if (keywordInput.trim() && !post.keywords.includes(keywordInput.trim())) {
      setPost(prev => ({
        ...prev,
        keywords: [...prev.keywords, keywordInput.trim()]
      }));
      setKeywordInput('');
    }
  };

  const handleKeywordRemove = (keyword: string) => {
    setPost(prev => ({
      ...prev,
      keywords: prev.keywords.filter(k => k !== keyword)
    }));
  };

  const generatePreview = useCallback(async () => {
    try {
      const processedContent = await remark()
        .use(remarkRehype, { allowDangerousHtml: true })
        .use(rehypePrism, { ignoreMissing: true })
        .use(rehypeStringify, { allowDangerousHtml: true })
        .process(post.content);
      
      setPreviewHtml(processedContent.toString());
      setPreviewOpen(true);
    } catch (error) {
      setSnackbar({
        open: true,
        message: '미리보기 생성 중 오류가 발생했습니다.',
        severity: 'error'
      });
    }
  }, [post.content]);

  const generateMarkdownFile = () => {
    const frontMatter = `---
title: "${post.title}"
date: "${post.date}"
description: "${post.description}"
keywords: [${post.keywords.map(k => `"${k}"`).join(', ')}]
---

${post.content}`;

    return frontMatter;
  };

  const handleDownload = () => {
    if (!post.title) {
      setSnackbar({
        open: true,
        message: '제목을 입력해주세요.',
        severity: 'error'
      });
      return;
    }

    const markdown = generateMarkdownFile();
    const slug = generateSlug(post.title);
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${slug}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setSnackbar({
      open: true,
      message: '마크다운 파일이 다운로드되었습니다.',
      severity: 'success'
    });
  };

  const handleSave = async () => {
    if (!post.title || !post.content) {
      setSnackbar({
        open: true,
        message: '제목과 내용을 입력해주세요.',
        severity: 'error'
      });
      return;
    }

    try {
      // 실제 프로덕션에서는 API 엔드포인트로 전송
      const markdown = generateMarkdownFile();
      
      // 로컬 스토리지에 임시 저장 (데모용)
      const savedPosts = JSON.parse(localStorage.getItem('saved-posts') || '[]');
      const slug = generateSlug(post.title);
      savedPosts.push({ ...post, slug, markdown, savedAt: new Date().toISOString() });
      localStorage.setItem('saved-posts', JSON.stringify(savedPosts));

      setSnackbar({
        open: true,
        message: '포스트가 저장되었습니다. (로컬 스토리지)',
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: '저장 중 오류가 발생했습니다.',
        severity: 'error'
      });
    }
  };

  const handleClear = () => {
    setPost({
      title: '',
      date: new Date().toISOString().split('T')[0],
      description: '',
      keywords: [],
      content: '',
    });
    setKeywordInput('');
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        📝 마크다운 에디터
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        브라우저에서 직접 블로그 포스트를 작성하고 마크다운 파일로 다운로드할 수 있습니다.
      </Typography>

      <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          📋 포스트 정보
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              label="제목"
              value={post.title}
              onChange={(e) => setPost(prev => ({ ...prev, title: e.target.value }))}
              placeholder="블로그 포스트 제목을 입력하세요"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="작성일"
              type="date"
              value={post.date}
              onChange={(e) => setPost(prev => ({ ...prev, date: e.target.value }))}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="설명"
              value={post.description}
              onChange={(e) => setPost(prev => ({ ...prev, description: e.target.value }))}
              placeholder="포스트에 대한 간단한 설명을 입력하세요"
              multiline
              rows={2}
            />
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ mb: 2 }}>
              <TextField
                label="키워드"
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                placeholder="키워드를 입력하고 엔터를 누르세요"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleKeywordAdd())}
                sx={{ mr: 1, minWidth: 200 }}
              />
              <Button variant="outlined" onClick={handleKeywordAdd}>
                추가
              </Button>
            </Box>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {post.keywords.map((keyword) => (
                <Chip
                  key={keyword}
                  label={keyword}
                  onDelete={() => handleKeywordRemove(keyword)}
                  color="primary"
                  variant="outlined"
                />
              ))}
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            ✍️ 마크다운 에디터
          </Typography>
          <Box>
            <Button
              startIcon={<PreviewIcon />}
              onClick={generatePreview}
              disabled={!post.content}
              sx={{ mr: 1 }}
            >
              미리보기
            </Button>
            <Button
              startIcon={<ClearIcon />}
              onClick={handleClear}
              color="secondary"
              sx={{ mr: 1 }}
            >
              초기화
            </Button>
          </Box>
        </Box>
        <TextField
          fullWidth
          multiline
          rows={20}
          value={post.content}
          onChange={(e) => setPost(prev => ({ ...prev, content: e.target.value }))}
          placeholder={`# 포스트 제목

## 소개

여기에 마크다운 내용을 작성하세요.

### 코드 예시

\`\`\`typescript
interface Props {
  title: string;
}

function MyComponent({ title }: Props) {
  return <h1>{title}</h1>;
}
\`\`\`

### 리스트

1. 첫 번째 항목
2. 두 번째 항목
3. 세 번째 항목

**굵은 글씨**와 *기울임 글씨*를 사용할 수 있습니다.`}
          sx={{
            fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
            fontSize: '14px',
            lineHeight: 1.5,
          }}
        />
      </Paper>

      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSave}
          size="large"
        >
          저장
        </Button>
        <Button
          variant="outlined"
          startIcon={<DownloadIcon />}
          onClick={handleDownload}
          size="large"
        >
          다운로드 (.md)
        </Button>
      </Box>

      {/* 미리보기 다이얼로그 */}
      <Dialog 
        open={previewOpen} 
        onClose={() => setPreviewOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          📖 미리보기: {post.title || '제목 없음'}
        </DialogTitle>
        <DialogContent dividers>
          <Box
            sx={{
              '& pre': {
                backgroundColor: '#2d3748',
                color: '#e2e8f0',
                padding: 2,
                borderRadius: 1,
                overflow: 'auto',
              },
              '& code': {
                backgroundColor: '#e2e8f0',
                padding: '2px 4px',
                borderRadius: 1,
                fontSize: '0.875em',
              },
              '& pre code': {
                backgroundColor: 'transparent',
                padding: 0,
              },
              '& h1, & h2, & h3, & h4, & h5, & h6': {
                mt: 3,
                mb: 2,
              },
              '& p': {
                mb: 2,
              },
              '& ul, & ol': {
                mb: 2,
                pl: 3,
              },
            }}
            dangerouslySetInnerHTML={{ __html: previewHtml }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewOpen(false)}>닫기</Button>
        </DialogActions>
      </Dialog>

      {/* 스낵바 */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert 
          severity={snackbar.severity}
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}