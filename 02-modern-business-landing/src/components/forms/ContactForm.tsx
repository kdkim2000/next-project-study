// src/components/forms/ContactForm.tsx (수정된 버전)
'use client'
import { useState } from 'react'
import {
  Box,
  TextField,
  Button,
  Grid,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import SendIcon from '@mui/icons-material/Send'
import { publicConfig } from '@/lib/config'
import { trackEvent } from '@/lib/analytics'

// 폼 데이터 타입 정의
interface ContactFormData {
  name: string
  email: string
  company: string
  phone: string
  message: string
}

// 유효성 검사 스키마
const schema = yup.object({
  name: yup.string().required('이름을 입력해주세요').min(2, '이름은 2자 이상이어야 합니다'),
  email: yup.string().email('올바른 이메일을 입력해주세요').required('이메일을 입력해주세요'),
  company: yup.string().required('회사명을 입력해주세요'),
  phone: yup.string().required('연락처를 입력해주세요'),
  message: yup.string().required('문의내용을 입력해주세요').min(10, '문의내용은 10자 이상이어야 합니다'),
})

/**
 * 연락처 폼 컴포넌트 (Client Component)
 * 환경변수를 사용한 API 호출 및 Google Analytics 이벤트 추적
 */
const ContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null)

  // React Hook Form 설정
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      company: '',
      phone: '',
      message: '',
    },
  })

  // 폼 제출 처리 함수 (환경변수 사용)
  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      // Google Analytics 이벤트 추적
      trackEvent({
        action: 'form_submit_start',
        category: 'Contact',
        label: 'Contact Form',
      })

      // API 요청 (환경변수에서 URL 가져오기)
      const response = await fetch(`${publicConfig.API_URL}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (response.ok && result.success) {
        // 성공 처리
        setSubmitStatus('success')
        reset() // 폼 초기화
        
        // Google Analytics 성공 이벤트
        trackEvent({
          action: 'form_submit_success',
          category: 'Contact',
          label: 'Contact Form',
        })
      } else {
        throw new Error(result.error || '폼 제출에 실패했습니다.')
      }
    } catch (error) {
      console.error('폼 제출 오류:', error)
      setSubmitStatus('error')
      
      // Google Analytics 에러 이벤트
      trackEvent({
        action: 'form_submit_error',
        category: 'Contact',
        label: 'Contact Form',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      {/* 개발 환경에서만 보이는 디버그 정보 */}
      {publicConfig.NODE_ENV === 'development' && (
        <Alert severity="info" sx={{ mb: 2 }}>
          개발 모드: API URL = {publicConfig.API_URL}
        </Alert>
      )}

      {/* 상태 메시지 */}
      {submitStatus === 'success' && (
        <Alert severity="success" sx={{ mb: 3 }}>
          문의가 성공적으로 전송되었습니다. 빠른 시일 내에 연락드리겠습니다.
        </Alert>
      )}
      
      {submitStatus === 'error' && (
        <Alert severity="error" sx={{ mb: 3 }}>
          문의 전송 중 오류가 발생했습니다. 다시 시도해주세요.
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* 나머지 폼 필드들은 이전과 동일 */}
        <Grid item xs={12} md={6}>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="이름 *"
                error={!!errors.name}
                helperText={errors.name?.message}
                variant="outlined"
              />
            )}
          />
        </Grid>

        {/* 제출 버튼 */}
        <Grid item xs={12}>
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={isSubmitting}
            endIcon={isSubmitting ? <CircularProgress size={20} /> : <SendIcon />}
            sx={{
              px: 4,
              py: 2,
              fontSize: '1.1rem',
            }}
          >
            {isSubmitting ? '전송 중...' : '문의 보내기'}
          </Button>
        </Grid>
      </Grid>

      {/* 개인정보 처리 안내 */}
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mt: 3, fontSize: '0.875rem' }}
      >
        * 입력하신 개인정보는 문의 응답 목적으로만 사용되며, 
        관련 법령에 따라 안전하게 처리됩니다.
      </Typography>
    </Box>
  )
}

export default ContactForm