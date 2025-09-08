// src/app/contact/page.tsx
// 연락처 및 문의 페이지 - Timeline 없는 올바른 버전

'use client'

import { useState } from 'react'
import {
  Box,
  Container,
  Typography,
  Grid,
  TextField,
  Button,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
  Snackbar,
  Paper,
  IconButton,
  alpha,
} from '@mui/material'
import {
  Send,
  Email,
  Phone,
  LocationOn,
  GitHub,
  LinkedIn,
  Twitter,
  AccessTime,
} from '@mui/icons-material'
import { ContactFormData } from '@/types'

export default function ContactPage() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [loading, setLoading] = useState(false)
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  })

  // 폼 데이터 변경 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  // 폼 제출 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // 실제 API 호출 (현재는 시뮬레이션)
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // 성공 처리
      setSnackbar({
        open: true,
        message: '메시지가 성공적으로 전송되었습니다! 빠른 시간 내에 답변드리겠습니다.',
        severity: 'success',
      })

      // 폼 리셋
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      })
    } catch (err) {
      // 에러 처리 - err 변수 사용
      console.log('메시지 전송 오류:', err)
      setSnackbar({
        open: true,
        message: '메시지 전송에 실패했습니다. 다시 시도해주세요.',
        severity: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  // 연락처 정보
  const contactInfo = [
    {
      icon: <Email />,
      title: '이메일',
      content: 'john@example.com',
      link: 'mailto:john@example.com',
    },
    {
      icon: <Phone />,
      title: '전화번호',
      content: '+82 10-1234-5678',
      link: 'tel:+821012345678',
    },
    {
      icon: <LocationOn />,
      title: '위치',
      content: '서울특별시, 대한민국',
    },
    {
      icon: <AccessTime />,
      title: '응답 시간',
      content: '24-48시간 내 답변',
    },
  ]

  // 소셜 미디어 링크
  const socialLinks = [
    { icon: <GitHub />, url: 'https://github.com/johndoe', name: 'GitHub' },
    { icon: <LinkedIn />, url: 'https://linkedin.com/in/johndoe', name: 'LinkedIn' },
    { icon: <Twitter />, url: 'https://twitter.com/johndoe', name: 'Twitter' },
  ]

  return (
    <Box>
      {/* 페이지 헤더 */}
      <Box
        sx={(theme) => ({
          pt: 12,
          pb: 6,
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
        })}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            align="center"
            gutterBottom
            sx={{ fontWeight: 'bold' }}
          >
            Contact Me
          </Typography>
          <Typography
            variant="h6"
            align="center"
            color="text.secondary"
            sx={{ maxWidth: '600px', mx: 'auto', lineHeight: 1.8 }}
          >
            새로운 기회와 흥미로운 프로젝트에 대해 이야기하는 것을 좋아합니다. 
            협업 제안, 기술적 질문, 또는 단순한 인사도 환영합니다!
          </Typography>
        </Container>
      </Box>

      {/* 연락처 정보와 문의 폼 */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={6}>
          {/* 연락처 정보 */}
          <Grid item xs={12} md={5}>
            <Typography variant="h4" gutterBottom fontWeight="bold">
              Let&apos;s Connect
            </Typography>
            <Typography variant="body1" paragraph color="text.secondary" sx={{ lineHeight: 1.8 }}>
              프론트엔드 개발, 새로운 기술, 또는 흥미로운 프로젝트에 대해 
              이야기하는 것을 즐깁니다. 언제든 편하게 연락주세요!
            </Typography>

            {/* 연락처 카드들 */}
            <List sx={{ mt: 4 }}>
              {contactInfo.map((info, index) => (
                <ListItem 
                  key={index}
                  sx={(theme) => ({ 
                    mb: 2,
                    p: 2,
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                    boxShadow: 1,
                    border: '1px solid',
                    borderColor: 'divider',
                    '&:hover': {
                      borderColor: 'primary.main',
                      boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.12)}`,
                    },
                    transition: 'all 0.3s ease-in-out',
                  })}
                >
                  <ListItemIcon>
                    <Box
                      sx={(theme) => ({
                        width: 48,
                        height: 48,
                        borderRadius: '50%',
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'primary.main',
                      })}
                    >
                      {info.icon}
                    </Box>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1" fontWeight="bold">
                        {info.title}
                      </Typography>
                    }
                    secondary={
                      info.link ? (
                        <Typography
                          component="a"
                          href={info.link}
                          sx={{
                            color: 'text.secondary',
                            textDecoration: 'none',
                            '&:hover': { 
                              color: 'primary.main',
                              textDecoration: 'underline',
                            },
                          }}
                        >
                          {info.content}
                        </Typography>
                      ) : (
                        <Typography color="text.secondary">
                          {info.content}
                        </Typography>
                      )
                    }
                  />
                </ListItem>
              ))}
            </List>

            {/* 소셜 미디어 링크 */}
            <Paper sx={{ p: 3, mt: 4 }}>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                소셜 미디어
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                소셜 미디어에서도 만나요!
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                {socialLinks.map((social) => (
                  <IconButton
                    key={social.name}
                    component="a"
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={(theme) => ({
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      color: 'primary.main',
                      '&:hover': {
                        bgcolor: alpha(theme.palette.primary.main, 0.2),
                        transform: 'scale(1.1)',
                      },
                      transition: 'all 0.2s ease-in-out',
                    })}
                  >
                    {social.icon}
                  </IconButton>
                ))}
              </Box>
            </Paper>
          </Grid>

          {/* 문의 폼 */}
          <Grid item xs={12} md={7}>
            <Card 
              sx={{ 
                p: 4,
                border: '1px solid',
                borderColor: 'divider',
                boxShadow: 3,
              }}
            >
              <CardContent>
                <Typography variant="h5" gutterBottom fontWeight="bold">
                  메시지 보내기
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                  아래 폼을 작성해주시면 빠른 시간 내에 답변드리겠습니다.
                </Typography>
                
                <Box component="form" onSubmit={handleSubmit}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        required
                        fullWidth
                        label="이름"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        disabled={loading}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        required
                        fullWidth
                        label="이메일"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={loading}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        label="제목"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        disabled={loading}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        label="메시지"
                        name="message"
                        multiline
                        rows={6}
                        value={formData.message}
                        onChange={handleChange}
                        disabled={loading}
                        placeholder="메시지를 입력해주세요..."
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        startIcon={<Send />}
                        disabled={loading}
                        sx={{
                          px: 4,
                          py: 1.5,
                          borderRadius: 2,
                          textTransform: 'none',
                          fontSize: '1.1rem',
                          fontWeight: 'bold',
                        }}
                      >
                        {loading ? '전송 중...' : '메시지 보내기'}
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* 성공/에러 메시지 스낵바 */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}