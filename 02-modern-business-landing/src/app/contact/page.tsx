// src/app/contact/page.tsx
/**
 * Contact 페이지 컴포넌트
 */
import { Metadata } from 'next'
import { Container, Box, Typography, Grid, Paper } from '@mui/material'
import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'
import ContactForm from '@/components/forms/ContactForm'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import PhoneIcon from '@mui/icons-material/Phone'
import EmailIcon from '@mui/icons-material/Email'
import AccessTimeIcon from '@mui/icons-material/AccessTime'

export const metadata: Metadata = {
  title: '연락처 - Modern Business',
  description: 'Modern Business에 문의하실 내용이 있으시면 언제든지 연락주세요. 빠르고 정확한 답변을 드리겠습니다.',
}

const contactInfo = [
  {
    icon: <LocationOnIcon sx={{ fontSize: 32 }} />,
    title: '주소',
    details: [
      '서울특별시 강남구 테헤란로 123',
      '456빌딩 7층 (우: 06234)',
    ],
  },
  {
    icon: <PhoneIcon sx={{ fontSize: 32 }} />,
    title: '연락처',
    details: [
      '대표: 02-1234-5678',
      '팩스: 02-1234-5679',
    ],
  },
  {
    icon: <EmailIcon sx={{ fontSize: 32 }} />,
    title: '이메일',
    details: [
      '일반문의: contact@modernbusiness.com',
      '기술지원: support@modernbusiness.com',
    ],
  },
  {
    icon: <AccessTimeIcon sx={{ fontSize: 32 }} />,
    title: '운영시간',
    details: [
      '월~금: 09:00 - 18:00',
      '주말/공휴일: 휴무',
    ],
  },
]

const faqItems = [
  {
    question: '프로젝트 진행 기간은 얼마나 걸리나요?',
    answer: '프로젝트 규모와 복잡도에 따라 다르지만, 일반적으로 웹사이트는 4-8주, 모바일 앱은 8-16주 정도 소요됩니다.',
  },
  {
    question: '유지보수 서비스도 제공하나요?',
    answer: '네, 프로젝트 완료 후에도 지속적인 유지보수 서비스를 제공합니다. 월간 유지보수 계약을 통해 안정적인 서비스를 보장합니다.',
  },
  {
    question: '견적은 어떻게 받을 수 있나요?',
    answer: '연락처 폼을 통해 프로젝트 상세 내용을 보내주시거나, 직접 연락주시면 무료로 상담 및 견적을 제공해드립니다.',
  },
  {
    question: '결제는 어떻게 이루어지나요?',
    answer: '프로젝트 계약금(30%), 중간금(40%), 잔금(30%)으로 나누어 결제하시며, 카드결제나 계좌이체 모두 가능합니다.',
  },
]

export default function ContactPage() {
  return (
    <Box component="main">
      <Header />
      
      {/* 페이지 헤더 */}
      <Box sx={{ py: 8, backgroundColor: 'primary.main', color: 'white' }}>
        <Container maxWidth="lg">
          <Typography variant="h2" component="h1" textAlign="center" gutterBottom>
            연락처
          </Typography>
          <Typography variant="h6" textAlign="center" sx={{ opacity: 0.9 }}>
            궁금한 점이나 협업 제안이 있으시면 언제든지 연락주세요
          </Typography>
        </Container>
      </Box>

      {/* 연락처 정보 */}
      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} sx={{ mb: 8 }}>
            {contactInfo.map((info, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Paper 
                  elevation={2} 
                  sx={{ 
                    p: 3, 
                    textAlign: 'center', 
                    height: '100%',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      elevation: 6,
                      transform: 'translateY(-4px)',
                    }
                  }}
                >
                  <Box sx={{ color: 'primary.main', mb: 2 }}>
                    {info.icon}
                  </Box>
                  <Typography variant="h6" component="h3" gutterBottom>
                    {info.title}
                  </Typography>
                  {info.details.map((detail, detailIndex) => (
                    <Typography
                      key={detailIndex}
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 0.5 }}
                    >
                      {detail}
                    </Typography>
                  ))}
                </Paper>
              </Grid>
            ))}
          </Grid>

          {/* 연락처 폼과 지도 */}
          <Grid container spacing={6}>
            <Grid item xs={12} md={8}>
              <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 3 }}>
                  문의하기
                </Typography>
                <ContactForm />
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={4}>
              {/* 지도 영역 (실제로는 Google Maps나 Naver Maps API 사용) */}
              <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" component="h3" gutterBottom>
                  오시는 길
                </Typography>
                <Box
                  sx={{
                    width: '100%',
                    height: 250,
                    backgroundColor: 'grey.100',
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2,
                  }}
                >
                  <Typography color="text.secondary">
                    지도 영역
                    <br />
                    (Google Maps 연동)
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  지하철: 강남역 3번 출구에서 도보 5분<br />
                  버스: 강남역 정류장 하차<br />
                  주차: 건물 지하 1-3층 (2시간 무료)
                </Typography>
              </Paper>

              {/* 빠른 연락 */}
              <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h6" component="h3" gutterBottom>
                  빠른 상담
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  급하신 문의사항이 있으시면 아래 연락처로 직접 연락주세요.
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    📞 <strong>02-1234-5678</strong>
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    📧 <strong>contact@modernbusiness.com</strong>
                  </Typography>
                  <Typography variant="body2" color="primary">
                    💬 <strong>카카오톡 상담: @modernbiz</strong>
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* FAQ 섹션 */}
      <Box sx={{ py: 8, backgroundColor: 'grey.50' }}>
        <Container maxWidth="lg">
          <Typography variant="h4" component="h2" textAlign="center" gutterBottom sx={{ mb: 6 }}>
            자주 묻는 질문
          </Typography>
          
          <Grid container spacing={3}>
            {faqItems.map((faq, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
                  <Typography variant="h6" component="h3" gutterBottom color="primary">
                    Q. {faq.question}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    A. {faq.answer}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Footer />
    </Box>
  )
}