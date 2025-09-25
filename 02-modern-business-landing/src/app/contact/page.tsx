// src/app/contact/page.tsx
// 📞 연락처 페이지 - 독립된 페이지 라우트

'use client';

import { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Alert,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Email,
  Phone,
  LocationOn,
  Schedule,
  Send,
} from '@mui/icons-material';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// 🏷️ 폼 데이터 타입 정의
interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  subject: string;
  message: string;
}

// 📋 초기 폼 상태
const initialFormData: ContactFormData = {
  name: '',
  email: '',
  phone: '',
  company: '',
  subject: '',
  message: '',
};

// 📞 연락처 정보
const contactInfo = [
  {
    icon: <Email color="primary" />,
    title: '이메일',
    content: 'info@modernbusiness.com',
    link: 'mailto:info@modernbusiness.com',
  },
  {
    icon: <Phone color="primary" />,
    title: '전화번호',
    content: '02-1234-5678',
    link: 'tel:02-1234-5678',
  },
  {
    icon: <LocationOn color="primary" />,
    title: '주소',
    content: '서울특별시 강남구 테헤란로 123, 15층',
    link: null,
  },
  {
    icon: <Schedule color="primary" />,
    title: '운영시간',
    content: '평일 09:00 - 18:00',
    link: null,
  },
];

export default function ContactPage() {
  const [formData, setFormData] = useState<ContactFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

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
      console.log('연락처 폼 데이터:', formData);
      
      // 시뮬레이션된 API 호출
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSubmitMessage({
        type: 'success',
        text: '메시지가 성공적으로 전송되었습니다! 빠른 시일 내에 연락드리겠습니다.'
      });
      setFormData(initialFormData); // 폼 초기화
      
    } catch (error) {
      setSubmitMessage({
        type: 'error',
        text: '전송 중 오류가 발생했습니다. 다시 시도해주세요.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      
      <main>
        {/* 연락처 메인 섹션 */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, #43cea2 0%, #185a9d 100%)',
            color: 'white',
            py: 8,
            textAlign: 'center',
          }}
        >
          <Container maxWidth="md">
            <Typography
              variant="h2"
              component="h1"
              gutterBottom
              sx={{ mb: 3 }}
            >
              연락하기
            </Typography>
            
            <Typography
              variant="h5"
              component="p"
              sx={{ opacity: 0.9 }}
            >
              궁금한 점이 있으시면 언제든지 연락주세요
            </Typography>
          </Container>
        </Box>

        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Grid container spacing={6}>
            {/* 연락처 정보 */}
            <Grid size={{ xs: 12, lg: 4 }}>
              <Typography variant="h4" gutterBottom color="primary">
                연락처 정보
              </Typography>
              
              <Typography variant="body1" paragraph color="text.secondary">
                프로젝트 문의, 기술 상담, 견적 요청 등 
                언제든지 편하게 연락주시기 바랍니다.
              </Typography>

              <Paper elevation={2} sx={{ mt: 4 }}>
                <List>
                  {contactInfo.map((info, index) => (
                    <ListItem
                      key={index}
                      component={info.link ? "a" : "div"}
                      href={info.link || undefined}
                      sx={{
                        textDecoration: 'none',
                        color: 'inherit',
                        '&:hover': info.link ? {
                          bgcolor: 'action.hover',
                        } : {},
                      }}
                    >
                      <ListItemIcon>
                        {info.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={info.title}
                        secondary={info.content}
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>

              {/* 지도 영역 (실제로는 Google Maps 등을 사용) */}
              <Paper 
                elevation={2} 
                sx={{ 
                  mt: 4, 
                  height: 200, 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'grey.100'
                }}
              >
                <Typography color="text.secondary">
                  🗺️ 구글 맵 영역
                  <br />
                  (실제 구현 시 Google Maps API 사용)
                </Typography>
              </Paper>
            </Grid>

            {/* 연락처 폼 */}
            <Grid size={{ xs: 12, lg: 8 }}>
              <Typography variant="h4" gutterBottom color="primary">
                메시지 보내기
              </Typography>
              
              <Card elevation={2}>
                <CardContent sx={{ p: 4 }}>
                  <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                      {/* 이름과 이메일 */}
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

                      {/* 전화번호와 회사명 */}
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          fullWidth
                          label="전화번호"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          variant="outlined"
                          placeholder="010-0000-0000"
                        />
                      </Grid>
                      
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          fullWidth
                          label="회사명"
                          name="company"
                          value={formData.company}
                          onChange={handleInputChange}
                          variant="outlined"
                        />
                      </Grid>

                      {/* 제목 */}
                      <Grid size={{ xs: 12 }}>
                        <TextField
                          fullWidth
                          label="문의 제목"
                          name="subject"
                          value={formData.subject}
                          onChange={handleInputChange}
                          required
                          variant="outlined"
                        />
                      </Grid>

                      {/* 메시지 */}
                      <Grid size={{ xs: 12 }}>
                        <TextField
                          fullWidth
                          label="문의 내용"
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          required
                          multiline
                          rows={6}
                          variant="outlined"
                          placeholder="프로젝트에 대한 자세한 내용을 적어주세요..."
                        />
                      </Grid>

                      {/* 제출 버튼 */}
                      <Grid size={{ xs: 12 }}>
                        <Button
                          type="submit"
                          variant="contained"
                          size="large"
                          disabled={isSubmitting}
                          startIcon={<Send />}
                          sx={{ 
                            mt: 2,
                            minWidth: '200px',
                          }}
                        >
                          {isSubmitting ? '전송 중...' : '메시지 보내기'}
                        </Button>
                      </Grid>

                      {/* 제출 결과 메시지 */}
                      {submitMessage && (
                        <Grid size={{ xs: 12 }}>
                          <Alert 
                            severity={submitMessage.type}
                            sx={{ mt: 2 }}
                          >
                            {submitMessage.text}
                          </Alert>
                        </Grid>
                      )}
                    </Grid>
                  </form>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </main>
      
      <Footer companyName="Modern Business" />
    </>
  );
}

/* 
📚 학습 노트:
1. Next.js App Router: /contact/page.tsx 독립 페이지
2. 'use client'로 상호작용 가능한 클라이언트 컴포넌트
3. 상세한 폼 검증과 사용자 피드백
4. MUI Icons를 활용한 시각적 개선
5. 연락처 정보를 구조화하여 관리
6. Grid 시스템으로 반응형 레이아웃 구성
7. TypeScript로 폼 데이터 타입 안전성 확보
*/