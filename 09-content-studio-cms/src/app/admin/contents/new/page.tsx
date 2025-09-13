// src/app/admin/contents/new/page.tsx
// 새로운 콘텐츠 작성 페이지

'use client';

import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Breadcrumbs, 
  Link, 
  Alert,
  Snackbar
} from '@mui/material';
import { useRouter } from 'next/navigation';
import ContentForm from '../../../../components/ContentForm';
import { useContentStore } from '../../../../stores/contentStore';
import type { Content } from '../../../../types';

// ContentForm에서 사용하는 데이터 타입 (다시 정의)
interface ContentFormData {
  title: string;
  slug?: string;
  content: string;
  excerpt?: string;
  type: 'article' | 'page' | 'blog' | 'news';
  status: 'draft' | 'published' | 'archived';
  language: 'ko' | 'en' | 'ja';
  
  // 메타데이터
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords: string[];
  metaAuthor?: string;
  featuredImage?: string;
  
  // 소셜 미디어
  socialTitle?: string;
  socialDescription?: string;
  
  // 추가 설정
  allowComments: boolean;
  featuredOrder: number;
  tags: string[];
}

/**
 * 새 콘텐츠 작성 페이지 컴포넌트
 */
const NewContentPage = () => {
  const router = useRouter();
  const { createContent, loading } = useContentStore();
  
  // 성공/에러 메시지 상태
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  /**
   * 폼 데이터를 Content 타입으로 변환
   */
  const transformFormDataToContent = (
    formData: ContentFormData, 
    action: 'save' | 'publish'
  ): Omit<Content, 'id' | 'createdAt' | 'updatedAt'> => {
    // 현재 날짜/시간
    const now = new Date().toISOString();
    
    // 발행 액션인 경우 상태를 'published'로 변경
    const finalStatus = action === 'publish' ? 'published' : formData.status;
    
    return {
      title: formData.title,
      slug: formData.slug || generateSlugFromTitle(formData.title),
      content: formData.content,
      excerpt: formData.excerpt,
      type: formData.type,
      status: finalStatus,
      language: formData.language,
      
      // 메타데이터 구성
      meta: {
        title: formData.metaTitle,
        description: formData.metaDescription,
        keywords: formData.metaKeywords,
        author: formData.metaAuthor,
        featuredImage: formData.featuredImage,
        socialTitle: formData.socialTitle,
        socialDescription: formData.socialDescription,
      },
      
      // 작성자 정보 (실제로는 현재 로그인한 사용자 ID 사용)
      createdBy: 'admin-001', // 임시 하드코딩
      updatedBy: 'admin-001', // 임시 하드코딩
      
      // 발행 일시 (발행 상태인 경우만)
      publishedAt: finalStatus === 'published' ? now : undefined,
      
      // 버전 관리
      currentVersion: 1,
      
      // 추가 설정
      allowComments: formData.allowComments,
      featuredOrder: formData.featuredOrder,
      tags: formData.tags,
    };
  };

  /**
   * 제목에서 슬러그 생성 (폼에서도 사용하는 로직과 동일)
   */
  const generateSlugFromTitle = (title: string): string => {
    return title
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\u3131-\u3163\uac00-\ud7a3-]/g, '')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .substring(0, 100);
  };

  /**
   * 폼 제출 처리
   */
  const handleSubmit = async (formData: ContentFormData, action: 'save' | 'publish') => {
    try {
      console.log('새 콘텐츠 작성 요청:', { formData, action });

      // 폼 데이터를 Content 형태로 변환
      const contentData = transformFormDataToContent(formData, action);

      // Zustand 스토어를 통해 콘텐츠 생성
      await createContent(contentData);

      // 성공 메시지 표시
      const actionText = action === 'publish' ? '발행' : '저장';
      setSuccessMessage(`콘텐츠가 성공적으로 ${actionText}되었습니다.`);

      // 잠시 후 목록 페이지로 이동
      setTimeout(() => {
        router.push('/admin/contents');
      }, 2000);

    } catch (error) {
      console.error('콘텐츠 생성 실패:', error);
      
      // 에러 메시지 표시
      const errorMsg = error instanceof Error ? error.message : '콘텐츠 생성 중 오류가 발생했습니다.';
      setErrorMessage(errorMsg);
    }
  };

  /**
   * 미리보기 처리
   */
  const handlePreview = (formData: ContentFormData) => {
    console.log('미리보기 요청:', formData);
    
    // 임시로 새 탭에서 미리보기 페이지 열기
    // 실제로는 임시 저장 후 미리보기 링크로 이동
    const previewUrl = `/preview/temp-${Date.now()}`;
    window.open(previewUrl, '_blank');
  };

  /**
   * 알림 메시지 닫기
   */
  const handleCloseSnackbar = () => {
    setSuccessMessage('');
    setErrorMessage('');
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* 브레드크럼 네비게이션 */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link
          underline="hover"
          color="inherit"
          href="/admin"
          onClick={(e) => {
            e.preventDefault();
            router.push('/admin');
          }}
          sx={{ cursor: 'pointer' }}
        >
          관리자
        </Link>
        <Link
          underline="hover"
          color="inherit"
          href="/admin/contents"
          onClick={(e) => {
            e.preventDefault();
            router.push('/admin/contents');
          }}
          sx={{ cursor: 'pointer' }}
        >
          콘텐츠 관리
        </Link>
        <Typography color="text.primary">새 콘텐츠 작성</Typography>
      </Breadcrumbs>

      {/* 페이지 제목 */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          새 콘텐츠 작성
        </Typography>
        <Typography variant="body1" color="text.secondary">
          기사, 블로그, 페이지 등 다양한 형태의 콘텐츠를 작성할 수 있습니다.
        </Typography>
      </Box>

      {/* 도움말 안내 */}
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>💡 작성 팁:</strong>
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          • 제목을 입력하면 URL 주소(슬러그)가 자동으로 생성됩니다<br/>
          • '임시저장'으로 초안을 저장하거나 '발행하기'로 즉시 공개할 수 있습니다<br/>
          • SEO 설정에서 검색 엔진 최적화를 위한 메타 정보를 입력하세요<br/>
          • 이미지는 에디터에서 직접 업로드하거나 드래그&드롭으로 추가할 수 있습니다
        </Typography>
      </Alert>

      {/* 콘텐츠 작성 폼 */}
      <ContentForm
        mode="create"
        onSubmit={handleSubmit}
        onPreview={handlePreview}
        loading={loading}
      />

      {/* 성공/에러 메시지 스낵바 */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity="success" 
          sx={{ width: '100%' }}
        >
          {successMessage}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!errorMessage}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity="error" 
          sx={{ width: '100%' }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default NewContentPage;