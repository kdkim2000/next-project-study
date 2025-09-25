// src/components/ContactSection.tsx
// 📞 연락처 섹션 - Client Component 학습 ('use client' 사용)

'use client';

import { useState } from 'react';
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
} from '@mui/material';

// 🏷️ 폼 데이터 타입 정의
interface FormData {
  name: string;
  email: string;
  message: string;
}

// 📋 초기 폼 상태
const initialFormData: FormData = {
  name: '',
  email: '',
  message: '',
};

// 📞 연락처 섹션 컴포넌트
export default function ContactSection() {
  // 🔄 React 상태 관리
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);

  // 📝 입력 필드 변경 처리
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // 📤 폼 제출 처리
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      // 💡 실제 프로젝트에서는 API 호출을 여기서 합니다
      console.log('폼 데이터:', formData);
      
      // 시뮬레이션된 API 호출
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSubmitMessage('메시지가 성공적으로 전송되었습니다!');
      setFormData(initialFormData); // 폼 초기화
      
    } catch (error) {
      setSubmitMessage('전송 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box component="section" id="contact" sx={{ py: 8, bgcolor: 'grey.50' }}>
      <Container maxWidth="md">
        {/* 섹션 제목 */}
        <Typography
          variant="h2"
          component="h2"
          textAlign="center"
          gutterBottom
          sx={{ mb: 6 }}
        >
          연락하기
        </Typography>

        {/* 연락처 폼 카드 */}
        <Card elevation={2}>
          <CardContent sx={{ p: 4 }}>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                {/* 이름 필드 */}
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="이름"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    variant="outlined"
                  />
                </Grid>

                {/* 이메일 필드 */}
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="이메일"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    variant="outlined"
                  />
                </Grid>

                {/* 메시지 필드 */}
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="메시지"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    multiline
                    rows={4}
                    variant="outlined"
                  />
                </Grid>

                {/* 제출 버튼 */}
                <Grid size={{ xs: 12 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={isSubmitting}
                    sx={{ mt: 2 }}
                  >
                    {isSubmitting ? '전송 중...' : '메시지 보내기'}
                  </Button>
                </Grid>

                {/* 제출 결과 메시지 */}
                {submitMessage && (
                  <Grid size={{ xs: 12 }}>
                    <Alert severity={submitMessage.includes('성공') ? 'success' : 'error'}>
                      {submitMessage}
                    </Alert>
                  </Grid>
                )}
              </Grid>
            </form>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

/* 
📚 학습 노트:
1. 'use client'로 클라이언트 컴포넌트임을 선언합니다
2. useState로 폼 상태를 관리합니다
3. 이벤트 핸들러로 사용자 상호작용을 처리합니다
4. TypeScript로 이벤트 타입을 정의합니다
5. 폼 검증과 제출 상태를 관리합니다
6. async/await로 비동기 처리를 합니다
*/