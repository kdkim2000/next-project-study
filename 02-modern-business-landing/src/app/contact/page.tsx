// app/contact/page.tsx
"use client";

import { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  CircularProgress,
  Chip,
  Divider,
} from "@mui/material";
import { motion } from "framer-motion";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Send as SendIcon, Info as InfoIcon } from "@mui/icons-material";

import { contactFormSchema, ContactFormData } from "@/lib/validation";
import { submitContactForm, getEnvironmentInfo } from "@/lib/api";
import { useSnackbar } from "@/hooks/useSnackbar";
import CustomSnackbar from "@/components/CustomSnackbar";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { snackbar, showSuccess, showError, hideSnackbar } = useSnackbar();
  
  // React Hook Form 설정
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid, isDirty },
  } = useForm<ContactFormData>({
    resolver: yupResolver(contactFormSchema),
    mode: 'onChange', // 실시간 유효성 검사
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
  });

  // 폼 제출 핸들러
  const onSubmit = async (data: ContactFormData) => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    
    try {
      const result = await submitContactForm(data);
      
      if (result.success) {
        showSuccess(result.message);
        reset(); // 폼 초기화
      } else {
        showError(result.message);
      }
    } catch (error) {
      showError('예상치 못한 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 환경 정보 (개발 목적)
  const envInfo = getEnvironmentInfo();

  // 폼 필드 애니메이션 variants
  const fieldVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <Box>
      {/* 제목 섹션 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          문의하기
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          궁금한 점이 있으시면 언제든지 연락주세요. 빠른 시간 내에 답변드리겠습니다.
        </Typography>
      </motion.div>

      {/* 환경 정보 표시 (개발용) */}
      {envInfo.environment === 'development' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Paper 
            sx={{ 
              p: 2, 
              mb: 3, 
              backgroundColor: 'info.light', 
              borderLeft: 4, 
              borderColor: 'info.main' 
            }}
          >
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <InfoIcon color="info" />
              <Typography variant="h6" color="info.dark">
                개발 환경 정보
              </Typography>
            </Box>
            <Box display="flex" gap={1} flexWrap="wrap">
              <Chip label={`API: ${envInfo.apiUrl}`} size="small" />
              <Chip label={`환경: ${envInfo.environment}`} size="small" />
              <Chip label={`버전: ${envInfo.version}`} size="small" />
            </Box>
          </Paper>
        </motion.div>
      )}

      {/* Contact Form */}
      <Paper elevation={2} sx={{ p: 4, borderRadius: 2 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* 이름 필드 */}
          <motion.div
            variants={fieldVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="이름 *"
                  fullWidth
                  margin="normal"
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  disabled={isSubmitting}
                />
              )}
            />
          </motion.div>

          {/* 이메일 필드 */}
          <motion.div
            variants={fieldVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="이메일 *"
                  type="email"
                  fullWidth
                  margin="normal"
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  disabled={isSubmitting}
                />
              )}
            />
          </motion.div>

          {/* 제목 필드 */}
          <motion.div
            variants={fieldVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Controller
              name="subject"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="문의 제목 *"
                  fullWidth
                  margin="normal"
                  error={!!errors.subject}
                  helperText={errors.subject?.message}
                  disabled={isSubmitting}
                />
              )}
            />
          </motion.div>

          {/* 메시지 필드 */}
          <motion.div
            variants={fieldVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Controller
              name="message"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="문의 내용 *"
                  multiline
                  rows={6}
                  fullWidth
                  margin="normal"
                  error={!!errors.message}
                  helperText={errors.message?.message || `${field.value?.length || 0}/1000`}
                  disabled={isSubmitting}
                />
              )}
            />
          </motion.div>

          <Divider sx={{ my: 3 }} />

          {/* 제출 버튼 */}
          <motion.div
            variants={fieldVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.6, delay: 0.5 }}
            whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
            whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
          >
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={!isValid || !isDirty || isSubmitting}
              startIcon={
                isSubmitting ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <SendIcon />
                )
              }
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 2,
                fontSize: '1.1rem',
                textTransform: 'none',
                fontWeight: 'bold',
              }}
            >
              {isSubmitting ? '전송 중...' : '문의사항 보내기'}
            </Button>
          </motion.div>

          {/* 폼 상태 정보 */}
          <Box mt={2}>
            <Typography variant="caption" color="text.secondary">
              * 필수 입력 항목입니다. 모든 필드를 올바르게 입력해주세요.
            </Typography>
          </Box>
        </form>
      </Paper>

      {/* 커스텀 Snackbar */}
      <CustomSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={hideSnackbar}
      />
    </Box>
  );
}