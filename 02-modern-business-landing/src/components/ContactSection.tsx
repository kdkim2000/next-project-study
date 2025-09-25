// src/components/ContactSection.tsx
// 📞 연락처 섹션 - React Hook Form + Yup + Framer Motion 통합

'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Box,
  Alert,
  Divider,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  Fade,
  Chip,
} from '@mui/material';
import {
  Send as SendIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  Schedule as ScheduleIcon,
  Business as BusinessIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { contactFormSchema, type ContactFormData } from '@/lib/validationSchemas';
import { submitContactForm } from '@/lib/api';
import { fadeInUp, staggerContainer, staggerItem } from '@/lib/animations';

// 🏷️ 폼 상태 타입
interface FormStatus {
  isSubmitting: boolean;
  message: string | null;
  type: 'success' | 'error' | null;
}

// 📞 연락처 정보
const contactInfo = [
  {
    icon: <PhoneIcon color="primary" />,
    title: '전화번호',
    content: process.env.NEXT_PUBLIC_COMPANY_PHONE || '02-1234-5678',
    href: `tel:${process.env.NEXT_PUBLIC_COMPANY_PHONE}`,
    description: '평일 09:00 - 18:00',
  },
  {
    icon: <EmailIcon color="primary" />,
    title: '이메일',
    content: process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'info@modernbusiness.com',
    href: `mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL}`,
    description: '24시간 내 답변',
  },
  {
    icon: <LocationIcon color="primary" />,
    title: '주소',
    content: '서울특별시 강남구 테헤란로 123, 15층',
    href: 'https://maps.google.com/?q=서울특별시+강남구+테헤란로+123',
    description: '지하철 2호선 강남역 도보 5분',
  },
  {
    icon: <ScheduleIcon color="primary" />,
    title: '운영시간',
    content: '평일 09:00 - 18:00',
    href: null,
    description: '토요일 09:00 - 15:00 (예약제)',
  },
];

// 🎯 문의 주제 옵션
const inquirySubjects = [
  '웹사이트 개발',
  '모바일 앱 개발',
  'UI/UX 디자인',
  '디지털 마케팅',
  '기술 컨설팅',
  '유지보수 및 지원',
  '기타',
];

// 📞 연락처 섹션 컴포넌트
export default function ContactSection() {
  const [formStatus, setFormStatus] = useState<FormStatus>({
    isSubmitting: false,
    message: null,
    type: null,
  });

  // 🎛️ React Hook Form 설정
  const {
    control,
    handleSubmit,
    formState: { errors, isValid, dirtyFields },
    reset,
    watch,
    setValue,
  } = useForm<ContactFormData>({
    resolver: yupResolver(contactFormSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      company: '',
      subject: '',
      message: '',
    },
  });

  // 🔍 실시간 폼 값 감시
  const watchedValues = watch();
  const messageLength = watchedValues.message?.length || 0;
  const maxMessageLength = 1000;

  // 📤 폼 제출 처리
  const onSubmit = async (data: ContactFormData) => {
    setFormStatus({
      isSubmitting: true,
      message: null,
      type: null,
    });

    try {
      const result = await submitContactForm(data);
      
      if (result.success) {
        setFormStatus({
          isSubmitting: false,
          message: result.message || '메시지가 성공적으로 전송되었습니다!',
          type: 'success',
        });
        reset(); // 폼 초기화
        
        // 성공 후 스크롤 (선택적)
        setTimeout(() => {
          document.getElementById('contact-success')?.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          });
        }, 100);
      } else {
        throw new Error(result.error || '전송 실패');
      }
    } catch (error: any) {
      setFormStatus({
        isSubmitting: false,
        message: error.message || '전송 중 오류가 발생했습니다.',
        type: 'error',
      });
    }
  };

  // 🔄 상태 메시지 초기화
  const clearStatus = () => {
    setFormStatus({
      isSubmitting: false,
      message: null,
      type: null,
    });
  };

  // 🎯 주제 빠른 선택
  const handleSubjectSelect = (subject: string) => {
    setValue('subject', subject, { shouldValidate: true, shouldDirty: true });
  };

  return (
    <Box component="section" id="contact" sx={{ py: { xs: 6, md: 10 }, bgcolor: 'grey.50' }}>
      <Container maxWidth="lg">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {/* 섹션 제목 */}
          <motion.div variants={staggerItem}>
            <Typography
              variant="h2"
              component="h2"
              textAlign="center"
              gutterBottom
              sx={{ mb: 2 }}
            >
              연락하기
            </Typography>
            <Typography
              variant="h5"
              textAlign="center"
              color="text.secondary"
              sx={{ mb: 6, maxWidth: '600px', mx: 'auto' }}
            >
              프로젝트 문의, 기술 상담, 견적 요청 등<br />
              언제든지 편하게 연락주세요
            </Typography>
          </motion.div>

          <Grid container spacing={4}>
            {/* 왼쪽: 연락처 정보 */}
            <Grid xs={12} lg={5}>
              <motion.div variants={staggerItem}>
                <Typography variant="h4" gutterBottom color="primary.main" sx={{ mb: 3 }}>
                  연락처 정보
                </Typography>

                <Paper elevation={2} sx={{ p: 0, borderRadius: 3, overflow: 'hidden' }}>
                  <List>
                    {contactInfo.map((info, index) => (
                      <motion.div
                        key={index}
                        variants={staggerItem}
                        whileHover={{ x: 4 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      >
                        <ListItem
                          component={info.href ? 'a' : 'div'}
                          href={info.href || undefined}
                          target={info.href?.startsWith('http') ? '_blank' : undefined}
                          rel={info.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                          sx={{
                            textDecoration: 'none',
                            color: 'inherit',
                            borderBottom: index < contactInfo.length - 1 ? '1px solid' : 'none',
                            borderColor: 'divider',
                            py: 3,
                            px: 3,
                            '&:hover': info.href ? {
                              bgcolor: 'action.hover',
                              cursor: 'pointer',
                            } : {},
                            transition: 'all 0.2s ease-in-out',
                          }}
                        >
                          <ListItemIcon sx={{ minWidth: 56 }}>
                            {info.icon}
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Typography variant="h6" color="text.primary">
                                {info.title}
                              </Typography>
                            }
                            secondary={
                              <Box>
                                <Typography variant="body1" color="text.primary" sx={{ mb: 0.5 }}>
                                  {info.content}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {info.description}
                                </Typography>
                              </Box>
                            }
                          />
                        </ListItem>
                      </motion.div>
                    ))}
                  </List>
                </Paper>

                {/* 추가 정보 */}
                <Paper elevation={1} sx={{ mt: 3, p: 3, borderRadius: 2, bgcolor: 'primary.50' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <BusinessIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6" color="primary.main">
                      빠른 응답 보장
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    • 일반 문의: 24시간 내 응답<br />
                    • 견적 요청: 3영업일 내 상세 견적서 제공<br />
                    • 긴급 문의: 전화 상담 즉시 가능
                  </Typography>
                </Paper>
              </motion.div>
            </Grid>

            {/* 오른쪽: 연락처 폼 */}
            <Grid xs={12} lg={7}>
              <motion.div variants={staggerItem}>
                <Typography variant="h4" gutterBottom color="primary.main" sx={{ mb: 3 }}>
                  메시지 보내기
                </Typography>

                <Card elevation={3} sx={{ borderRadius: 3 }}>
                  <CardContent sx={{ p: 4 }}>
                    {/* 상태 메시지 */}
                    <AnimatePresence>
                      {formStatus.message && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          id="contact-success"
                        >
                          <Alert
                            severity={formStatus.type || 'info'}
                            onClose={clearStatus}
                            icon={
                              formStatus.type === 'success' ? (
                                <CheckCircleIcon fontSize="inherit" />
                              ) : (
                                <ErrorIcon fontSize="inherit" />
                              )
                            }
                            sx={{ mb: 3, borderRadius: 2 }}
                          >
                            {formStatus.message}
                          </Alert>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <form onSubmit={handleSubmit(onSubmit)} noValidate>
                      <Grid container spacing={3}>
                        {/* 이름과 이메일 */}
                        <Grid xs={12} sm={6}>
                          <Controller
                            name="name"
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                fullWidth
                                label="이름"
                                placeholder="홍길동"
                                error={!!errors.name}
                                helperText={errors.name?.message}
                                slotProps={{ inputLabel: { shrink: true } }}
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                      borderColor: 'primary.main',
                                      borderWidth: 2,
                                    },
                                  },
                                }}
                              />
                            )}
                          />
                        </Grid>

                        <Grid xs={12} sm={6}>
                          <Controller
                            name="email"
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                fullWidth
                                label="이메일"
                                type="email"
                                placeholder="example@email.com"
                                error={!!errors.email}
                                helperText={errors.email?.message}
                                slotProps={{ inputLabel: { shrink: true } }}
                              />
                            )}
                          />
                        </Grid>

                        {/* 전화번호와 회사명 */}
                        <Grid xs={12} sm={6}>
                          <Controller
                            name="phone"
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                fullWidth
                                label="전화번호"
                                placeholder="010-1234-5678"
                                error={!!errors.phone}
                                helperText={errors.phone?.message || '선택사항'}
                                slotProps={{ inputLabel: { shrink: true } }}
                              />
                            )}
                          />
                        </Grid>

                        <Grid xs={12} sm={6}>
                          <Controller
                            name="company"
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                fullWidth
                                label="회사명"
                                placeholder="회사명을 입력해주세요"
                                error={!!errors.company}
                                helperText={errors.company?.message || '선택사항'}
                                slotProps={{ inputLabel: { shrink: true } }}
                              />
                            )}
                          />
                        </Grid>

                        {/* 문의 주제 빠른 선택 */}
                        <Grid xs={12}>
                          <Typography variant="subtitle1" gutterBottom>
                            주요 문의 주제 (빠른 선택)
                          </Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                            {inquirySubjects.map((subject) => (
                              <Chip
                                key={subject}
                                label={subject}
                                onClick={() => handleSubjectSelect(subject)}
                                variant={watchedValues.subject === subject ? 'filled' : 'outlined'}
                                color={watchedValues.subject === subject ? 'primary' : 'default'}
                                sx={{
                                  cursor: 'pointer',
                                  '&:hover': {
                                    backgroundColor: watchedValues.subject === subject
                                      ? 'primary.dark'
                                      : 'action.hover',
                                  },
                                }}
                              />
                            ))}
                          </Box>
                        </Grid>

                        {/* 문의 제목 */}
                        <Grid xs={12}>
                          <Controller
                            name="subject"
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                fullWidth
                                label="문의 제목"
                                placeholder="구체적인 문의 제목을 입력해주세요"
                                error={!!errors.subject}
                                helperText={errors.subject?.message}
                                slotProps={{ inputLabel: { shrink: true } }}
                              />
                            )}
                          />
                        </Grid>

                        {/* 문의 내용 */}
                        <Grid xs={12}>
                          <Controller
                            name="message"
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                fullWidth
                                label="문의 내용"
                                multiline
                                rows={6}
                                placeholder="프로젝트에 대한 자세한 내용, 예산 범위, 일정 등을 포함하여 작성해주시면 더 정확한 답변을 드릴 수 있습니다."
                                error={!!errors.message}
                                helperText={
                                  errors.message?.message || 
                                  `${messageLength}/${maxMessageLength}자`
                                }
                                slotProps={{ 
                                  inputLabel: { shrink: true },
                                  formHelperText: {
                                    sx: {
                                      textAlign: 'right',
                                      color: messageLength > maxMessageLength * 0.9 
                                        ? 'warning.main' 
                                        : 'text.secondary'
                                    }
                                  }
                                }}
                              />
                            )}
                          />
                        </Grid>

                        {/* 제출 버튼 */}
                        <Grid xs={12}>
                          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                            <Button
                              type="submit"
                              variant="contained"
                              size="large"
                              disabled={formStatus.isSubmitting || !isValid}
                              startIcon={
                                formStatus.isSubmitting ? (
                                  <CircularProgress size={18} color="inherit" />
                                ) : (
                                  <SendIcon />
                                )
                              }
                              sx={{
                                minWidth: 200,
                                py: 1.5,
                                textTransform: 'none',
                                fontWeight: 600,
                                borderRadius: 2,
                                '&:disabled': {
                                  opacity: 0.7,
                                },
                              }}
                            >
                              {formStatus.isSubmitting ? '전송 중...' : '메시지 보내기'}
                            </Button>
                          </Box>
                        </Grid>
                      </Grid>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          </Grid>
        </motion.div>
      </Container>
    </Box>
  );
}

/* 
📚 학습 노트: React Hook Form + Yup + Framer Motion 통합

1. 🎛️ React Hook Form 고급 기능:
   - yupResolver로 스키마 기반 검증
   - Controller로 MUI 컴포넌트 통합
   - 실시간 폼 상태 관리 (watch, formState)
   - 조건부 검증과 동적 에러 처리

2. 🎨 향상된 사용자 경험:
   - 실시간 글자 수 표시
   - 빠른 주제 선택 칩
   - 시각적 피드백 (색상, 아이콘)
   - 접근성 고려한 레이블과 헬프 텍스트

3. 🎬 Framer Motion 애니메이션:
   - Stagger 애니메이션으로 순차 등장
   - 상태 메시지 부드러운 전환
   - 호버 효과로 상호작용성 증대

4. 📱 반응형 최적화:
   - Grid v2 시스템으로 유연한 레이아웃
   - 모바일/데스크톱 다른 간격 설정
   - 터치 친화적 인터페이스

5. 🔧 에러 처리 및 상태 관리:
   - 포괄적인 에러 처리
   - 로딩 상태 시각화
   - 성공/실패 피드백 시스템

6. ⚡ 성능 최적화:
   - Controller로 불필요한 리렌더링 방지
   - 조건부 렌더링 활용
   - 메모이제이션 패턴 적용
*/