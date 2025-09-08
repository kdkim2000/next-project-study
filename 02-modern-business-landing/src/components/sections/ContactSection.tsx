// src/components/sections/ContactSection.tsx
'use client'
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  useTheme,
  alpha,
} from '@mui/material'
import { motion } from 'framer-motion'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import PhoneIcon from '@mui/icons-material/Phone'
import EmailIcon from '@mui/icons-material/Email'
import ContactForm from '@/components/forms/ContactForm'

/**
 * 연락처 섹션 컴포넌트
 */
const ContactSection = () => {
  const theme = useTheme()

  const contactInfo = [
    {
      icon: <LocationOnIcon />,
      title: '주소',
      details: ['서울특별시 강남구', '테헤란로 123, 456빌딩 7층'],
    },
    {
      icon: <PhoneIcon />,
      title: '연락처',
      details: ['02-1234-5678', '010-9876-5432'],
    },
    {
      icon: <EmailIcon />,
      title: '이메일',
      details: ['contact@modernbusiness.com', 'support@modernbusiness.com'],
    },
  ]

  return (
    <Box 
      id="contact"
      sx={{ 
        py: 8, 
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.02)} 0%, ${alpha(theme.palette.secondary.main, 0.02)} 100%)`,
      }}
    >
      <Container maxWidth="lg">
        {/* 섹션 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Typography
            variant="h2"
            component="h2"
            textAlign="center"
            gutterBottom
            sx={{ mb: 2 }}
          >
            문의하기
          </Typography>
          <Typography
            variant="h6"
            textAlign="center"
            color="text.secondary"
            sx={{ mb: 6, maxWidth: 600, mx: 'auto' }}
          >
            궁금한 점이나 협업 제안이 있으시면 언제든지 연락주세요. 
            빠르고 정확한 답변을 드리겠습니다.
          </Typography>
        </motion.div>

        <Grid container spacing={4}>
          {/* 연락처 정보 */}
          <Grid item xs={12} md={4}>
            <Box sx={{ mb: { xs: 4, md: 0 } }}>
              {contactInfo.map((info, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Paper
                    elevation={2}
                    sx={{
                      p: 3,
                      mb: 3,
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 2,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        elevation: 4,
                        transform: 'translateY(-2px)',
                      },
                    }}
                  >
                    <Box
                      sx={{
                        color: 'primary.main',
                        mt: 0.5,
                      }}
                    >
                      {info.icon}
                    </Box>
                    <Box>
                      <Typography
                        variant="h6"
                        component="h3"
                        gutterBottom
                        sx={{ mb: 1 }}
                      >
                        {info.title}
                      </Typography>
                      {info.details.map((detail, detailIndex) => (
                        <Typography
                          key={detailIndex}
                          variant="body2"
                          color="text.secondary"
                        >
                          {detail}
                        </Typography>
                      ))}
                    </Box>
                  </Paper>
                </motion.div>
              ))}
            </Box>
          </Grid>

          {/* 연락처 폼 */}
          <Grid item xs={12} md={8}>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <Paper elevation={3} sx={{ p: 4 }}>
                <Typography
                  variant="h5"
                  component="h3"
                  gutterBottom
                  sx={{ mb: 3 }}
                >
                  프로젝트 문의
                </Typography>
                <ContactForm />
              </Paper>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

export default ContactSection