// src/components/ContentForm.tsx
// 콘텐츠 작성 및 편집을 위한 동적 폼 컴포넌트

'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Button,
  Typography,
  Paper,
  Grid,
  Switch,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
  Divider
} from '@mui/material';
import {
  Save as SaveIcon,
  Publish as PublishIcon,
  Preview as PreviewIcon,
  ExpandMore as ExpandMoreIcon,
  Add as AddIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import WysiwygEditor from './WysiwygEditor';
import { Content, ContentType, ContentStatus, LanguageCode } from '../types';

/**
 * 폼 데이터 타입 정의
 */
interface ContentFormData {
  title: string;
  slug?: string;
  content: string;
  excerpt?: string;
  type: ContentType;
  status: ContentStatus;
  language: LanguageCode;
  
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
 * 컴포넌트 Props
 */
interface ContentFormProps {
  initialData?: Content;           // 편집할 콘텐츠 데이터 (수정 모드)
  onSubmit: (data: ContentFormData, action: 'save' | 'publish') => Promise<void>;
  onPreview?: (data: ContentFormData) => void;
  loading?: boolean;
  mode?: 'create' | 'edit';
}

/**
 * 폼 유효성 검사 스키마
 * 초보자도 이해하기 쉬운 에러 메시지 포함
 */
const validationSchema = yup.object({
  title: yup
    .string()
    .required('제목은 필수 입력 항목입니다')
    .min(2, '제목은 최소 2자 이상이어야 합니다')
    .max(200, '제목은 200자를 넘을 수 없습니다'),
  
  slug: yup
    .string()
    .matches(/^[a-z0-9-\u3131-\u3163\uac00-\ud7a3]*$/, 'URL 주소는 영문, 숫자, 하이픈, 한글만 사용할 수 있습니다'),
  
  content: yup
    .string()
    .required('내용은 필수 입력 항목입니다')
    .min(10, '내용은 최소 10자 이상이어야 합니다'),
  
  excerpt: yup
    .string()
    .max(500, '요약은 500자를 넘을 수 없습니다'),
  
  type: yup
    .string()
    .oneOf(['article', 'page', 'blog', 'news'], '올바른 콘텐츠 유형을 선택해주세요')
    .required('콘텐츠 유형은 필수 선택 항목입니다'),
  
  status: yup
    .string()
    .oneOf(['draft', 'published', 'archived'], '올바른 상태를 선택해주세요')
    .required('상태는 필수 선택 항목입니다'),
  
  language: yup
    .string()
    .oneOf(['ko', 'en', 'ja'], '지원하는 언어를 선택해주세요')
    .required('언어는 필수 선택 항목입니다'),
    
  // 메타데이터 검증
  metaTitle: yup.string().max(60, 'SEO 제목은 60자를 넘지 않는 것이 좋습니다'),
  metaDescription: yup.string().max(160, 'SEO 설명은 160자를 넘지 않는 것이 좋습니다'),
  metaKeywords: yup.array().of(yup.string()),
  
  // 추가 필드
  allowComments: yup.boolean(),
  featuredOrder: yup.number().min(0, '추천 순서는 0 이상이어야 합니다'),
  tags: yup.array().of(yup.string())
});

/**
 * 콘텐츠 작성/편집 폼 컴포넌트
 */
const ContentForm: React.FC<ContentFormProps> = ({
  initialData,
  onSubmit,
  onPreview,
  loading = false,
  mode = 'create'
}) => {
  // 상태 관리
  const [currentAction, setCurrentAction] = useState<'save' | 'publish'>('save');
  const [tagInput, setTagInput] = useState(''); // 태그 입력용
  const [keywordInput, setKeywordInput] = useState(''); // 키워드 입력용

  // React Hook Form 설정
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    getValues,
    reset,
    formState: { errors, isDirty }
  } = useForm<ContentFormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      title: initialData?.title || '',
      slug: initialData?.slug || '',
      content: initialData?.content || '',
      excerpt: initialData?.excerpt || '',
      type: initialData?.type || 'article',
      status: initialData?.status || 'draft',
      language: initialData?.language || 'ko',
      metaTitle: initialData?.meta?.title || '',
      metaDescription: initialData?.meta?.description || '',
      metaKeywords: initialData?.meta?.keywords || [],
      metaAuthor: initialData?.meta?.author || '',
      featuredImage: initialData?.meta?.featuredImage || '',
      socialTitle: initialData?.meta?.socialTitle || '',
      socialDescription: initialData?.meta?.socialDescription || '',
      allowComments: initialData?.allowComments ?? true,
      featuredOrder: initialData?.featuredOrder || 0,
      tags: initialData?.tags || []
    }
  });

  // 폼 데이터 감시 (실시간 변경사항 추적)
  const watchedTitle = watch('title');
  const watchedTags = watch('tags');
  const watchedKeywords = watch('metaKeywords');

  /**
   * 제목 변경 시 자동으로 슬러그 생성
   */
  useEffect(() => {
    if (mode === 'create' && watchedTitle) {
      const autoSlug = generateSlug(watchedTitle);
      setValue('slug', autoSlug);
    }
  }, [watchedTitle, setValue, mode]);

  /**
   * 제목에서 URL 친화적인 슬러그 생성
   */
  const generateSlug = (title: string): string => {
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
  const onFormSubmit = async (data: ContentFormData) => {
    try {
      console.log('폼 제출 데이터:', data);
      await onSubmit(data, currentAction);
      
      // 성공 시 폼 초기화 (생성 모드인 경우만)
      if (mode === 'create' && currentAction === 'save') {
        reset();
      }
      
    } catch (error) {
      console.error('폼 제출 오류:', error);
    }
  };

  /**
   * 태그 추가
   */
  const addTag = () => {
    if (tagInput.trim() && !watchedTags.includes(tagInput.trim())) {
      const newTags = [...watchedTags, tagInput.trim()];
      setValue('tags', newTags, { shouldDirty: true });
      setTagInput('');
    }
  };

  /**
   * 태그 제거
   */
  const removeTag = (tagToRemove: string) => {
    const newTags = watchedTags.filter(tag => tag !== tagToRemove);
    setValue('tags', newTags, { shouldDirty: true });
  };

  /**
   * 키워드 추가
   */
  const addKeyword = () => {
    if (keywordInput.trim() && !watchedKeywords.includes(keywordInput.trim())) {
      const newKeywords = [...watchedKeywords, keywordInput.trim()];
      setValue('metaKeywords', newKeywords, { shouldDirty: true });
      setKeywordInput('');
    }
  };

  /**
   * 키워드 제거
   */
  const removeKeyword = (keywordToRemove: string) => {
    const newKeywords = watchedKeywords.filter(keyword => keyword !== keywordToRemove);
    setValue('metaKeywords', newKeywords, { shouldDirty: true });
  };

  /**
   * 미리보기 처리
   */
  const handlePreview = () => {
    const currentData = getValues();
    onPreview?.(currentData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onFormSubmit)}>
      <Paper sx={{ p: 3 }}>
        {/* 폼 헤더 */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" gutterBottom>
            {mode === 'create' ? '새 콘텐츠 작성' : '콘텐츠 편집'}
          </Typography>
          
          {isDirty && (
            <Alert severity="info" sx={{ mb: 2 }}>
              변경사항이 있습니다. 저장하지 않으면 손실될 수 있습니다.
            </Alert>
          )}
        </Box>

        <Grid container spacing={3}>
          {/* 왼쪽 컬럼: 메인 콘텐츠 */}
          <Grid item xs={12} md={8}>
            {/* 기본 정보 */}
            <Box sx={{ mb: 3 }}>
              {/* 제목 */}
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="제목 *"
                    fullWidth
                    error={!!errors.title}
                    helperText={errors.title?.message || '콘텐츠의 제목을 입력하세요'}
                    sx={{ mb: 2 }}
                  />
                )}
              />

              {/* 슬러그 */}
              <Controller
                name="slug"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="URL 주소 (슬러그)"
                    fullWidth
                    error={!!errors.slug}
                    helperText={errors.slug?.message || 'URL에 사용될 주소입니다. 자동 생성되지만 직접 수정할 수 있습니다'}
                    InputProps={{
                      startAdornment: <Typography variant="body2" color="text.secondary">/{field.value ? '' : '슬러그'}</Typography>
                    }}
                    sx={{ mb: 2 }}
                  />
                )}
              />

              {/* 내용 (WYSIWYG 에디터) */}
              <Controller
                name="content"
                control={control}
                render={({ field }) => (
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      내용 *
                    </Typography>
                    <WysiwygEditor
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="콘텐츠 내용을 입력하세요..."
                      height={400}
                    />
                    {errors.content && (
                      <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                        {errors.content.message}
                      </Typography>
                    )}
                  </Box>
                )}
              />
            </Box>
          </Grid>

          {/* 오른쪽 컬럼: 설정 및 메타데이터 */}
          <Grid item xs={12} md={4}>
            {/* 발행 설정 */}
            <Paper sx={{ p: 2, mb: 2, bgcolor: 'grey.50' }}>
              <Typography variant="h6" gutterBottom>
                발행 설정
              </Typography>
              
              <Grid container spacing={2}>
                {/* 상태 */}
                <Grid item xs={12}>
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth>
                        <InputLabel>상태</InputLabel>
                        <Select {...field} label="상태">
                          <MenuItem value="draft">초안</MenuItem>
                          <MenuItem value="published">발행됨</MenuItem>
                          <MenuItem value="archived">보관됨</MenuItem>
                        </Select>
                      </FormControl>
                    )}
                  />
                </Grid>

                {/* 콘텐츠 유형 */}
                <Grid item xs={12}>
                  <Controller
                    name="type"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth>
                        <InputLabel>콘텐츠 유형</InputLabel>
                        <Select {...field} label="콘텐츠 유형">
                          <MenuItem value="article">기사</MenuItem>
                          <MenuItem value="page">페이지</MenuItem>
                          <MenuItem value="blog">블로그</MenuItem>
                          <MenuItem value="news">뉴스</MenuItem>
                        </Select>
                      </FormControl>
                    )}
                  />
                </Grid>

                {/* 언어 */}
                <Grid item xs={12}>
                  <Controller
                    name="language"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth>
                        <InputLabel>언어</InputLabel>
                        <Select {...field} label="언어">
                          <MenuItem value="ko">한국어</MenuItem>
                          <MenuItem value="en">English</MenuItem>
                          <MenuItem value="ja">日本語</MenuItem>
                        </Select>
                      </FormControl>
                    )}
                  />
                </Grid>
              </Grid>
            </Paper>

            {/* 요약 */}
            <Controller
              name="excerpt"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="요약"
                  multiline
                  rows={3}
                  fullWidth
                  error={!!errors.excerpt}
                  helperText={errors.excerpt?.message || '목록에서 보여질 간단한 요약을 작성하세요'}
                  sx={{ mb: 2 }}
                />
              )}
            />

            {/* 태그 */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                태그
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                <TextField
                  size="small"
                  placeholder="태그 입력"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                />
                <Button size="small" onClick={addTag} variant="outlined">
                  <AddIcon fontSize="small" />
                </Button>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {watchedTags.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    onDelete={() => removeTag(tag)}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
            </Box>

            {/* 추가 설정 */}
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle2">추가 설정</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  {/* 댓글 허용 */}
                  <Grid item xs={12}>
                    <Controller
                      name="allowComments"
                      control={control}
                      render={({ field }) => (
                        <FormControlLabel
                          control={
                            <Switch
                              checked={field.value}
                              onChange={field.onChange}
                            />
                          }
                          label="댓글 허용"
                        />
                      )}
                    />
                  </Grid>

                  {/* 추천 순서 */}
                  <Grid item xs={12}>
                    <Controller
                      name="featuredOrder"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="추천 순서"
                          type="number"
                          fullWidth
                          size="small"
                          helperText="0이면 추천되지 않음. 숫자가 클수록 우선순위 높음"
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>

            {/* SEO 설정 */}
            <Accordion sx={{ mt: 1 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle2">SEO 설정</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  {/* SEO 제목 */}
                  <Grid item xs={12}>
                    <Controller
                      name="metaTitle"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="SEO 제목"
                          fullWidth
                          size="small"
                          error={!!errors.metaTitle}
                          helperText={`${field.value?.length || 0}/60 - 검색 엔진에 표시될 제목`}
                        />
                      )}
                    />
                  </Grid>

                  {/* SEO 설명 */}
                  <Grid item xs={12}>
                    <Controller
                      name="metaDescription"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="SEO 설명"
                          multiline
                          rows={2}
                          fullWidth
                          size="small"
                          error={!!errors.metaDescription}
                          helperText={`${field.value?.length || 0}/160 - 검색 결과에 표시될 설명`}
                        />
                      )}
                    />
                  </Grid>

                  {/* 키워드 */}
                  <Grid item xs={12}>
                    <Typography variant="body2" gutterBottom>
                      SEO 키워드
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                      <TextField
                        size="small"
                        placeholder="키워드 입력"
                        value={keywordInput}
                        onChange={(e) => setKeywordInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                      />
                      <Button size="small" onClick={addKeyword} variant="outlined">
                        <AddIcon fontSize="small" />
                      </Button>
                    </Box>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {watchedKeywords.map((keyword) => (
                        <Chip
                          key={keyword}
                          label={keyword}
                          onDelete={() => removeKeyword(keyword)}
                          size="small"
                          color="secondary"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* 액션 버튼 */}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          {/* 미리보기 버튼 */}
          {onPreview && (
            <Button
              variant="outlined"
              onClick={handlePreview}
              startIcon={<PreviewIcon />}
            >
              미리보기
            </Button>
          )}

          {/* 임시저장 버튼 */}
          <Button
            type="submit"
            variant="outlined"
            disabled={loading}
            onClick={() => setCurrentAction('save')}
            startIcon={<SaveIcon />}
          >
            {loading && currentAction === 'save' ? '저장 중...' : '임시저장'}
          </Button>

          {/* 발행 버튼 */}
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            onClick={() => setCurrentAction('publish')}
            startIcon={<PublishIcon />}
          >
            {loading && currentAction === 'publish' ? '발행 중...' : '발행하기'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default ContentForm;