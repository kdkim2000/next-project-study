// src/app/about/page.tsx
// 분리된 데이터를 활용한 About 페이지

'use client'

import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  Avatar,
  Chip,
  alpha,
  useTheme as useMUITheme,
} from '@mui/material'
import {
  School,
  Work,
  Code,
  Psychology,
  SportsEsports,
  MusicNote,
  DirectionsRun,
} from '@mui/icons-material'

// 분리된 데이터 import
import { personalInfo } from '@/data/personal'
import { experiences, getWorkExperience, getEducationExperience } from '@/data/experience'

// 개인적인 관심사 및 취미 (나중에 data 폴더로 분리 가능)
const interests = [
  { icon: <Code />, name: '오픈소스 기여', description: '개발 커뮤니티 활동' },
  { icon: <Psychology />, name: 'AI/ML 학습', description: '인공지능과 머신러닝 공부' },
  { icon: <SportsEsports />, name: '게임 개발', description: '인디 게임 제작 프로젝트' },
  { icon: <MusicNote />, name: '음악 감상', description: '재즈와 클래식 음악 애호가' },
  { icon: <DirectionsRun />, name: '러닝', description: '건강한 라이프스타일 유지' },
]

export default function AboutPage() {
  const theme = useMUITheme()

  // 분리된 데이터 사용
  const workExperiences = getWorkExperience()
  const educationExperiences = getEducationExperience()
  const allExperiences = experiences

  return (
    <Box>
      {/* 페이지 헤더 */}
      <Box
        sx={{
          pt: 12,
          pb: 6,
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
              <Avatar
                sx={{
                  width: 200,
                  height: 200,
                  mx: 'auto',
                  mb: 3,
                  fontSize: '4rem',
                  bgcolor: 'primary.main',
                }}
              >
                {/* 분리된 데이터에서 이니셜 생성 */}
                {personalInfo.name.split(' ').map(n => n[0]).join('')}
              </Avatar>
            </Grid>
            <Grid item xs={12} md={8}>
              <Typography variant="h2" gutterBottom fontWeight="bold">
                About Me
              </Typography>
              {/* 분리된 데이터 사용 */}
              <Typography variant="h6" paragraph color="text.secondary" sx={{ lineHeight: 1.8 }}>
                안녕하세요! {personalInfo.koreanName || personalInfo.name}입니다. {personalInfo.longIntro}
              </Typography>
              <Typography variant="body1" paragraph color="text.secondary" sx={{ lineHeight: 1.8 }}>
                {personalInfo.shortIntro}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 3 }}>
                {/* 주요 기술 스택 표시 (하드코딩된 부분) */}
                {['React', 'Next.js', 'TypeScript', 'Node.js'].map((skill) => (
                  <Chip key={skill} label={skill} color="primary" variant="outlined" />
                ))}
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 8 }}>
        {/* 경력 및 교육 */}
        <Box sx={{ mb: 10 }}>
          <Typography variant="h3" align="center" gutterBottom fontWeight="bold" sx={{ mb: 6 }}>
            경력 및 교육
          </Typography>
          <Grid container spacing={4}>
            {/* 분리된 데이터 사용 */}
            {allExperiences.map((exp) => (
              <Grid item xs={12} md={6} key={exp.id}>
                <Card
                  sx={{
                    p: 4,
                    height: '100%',
                    border: '1px solid',
                    borderColor: 'divider',
                    '&:hover': {
                      borderColor: exp.type === 'work' ? 'primary.main' : 'secondary.main',
                      boxShadow: `0 8px 25px ${alpha(
                        exp.type === 'work' ? theme.palette.primary.main : theme.palette.secondary.main, 
                        0.15
                      )}`,
                    },
                    transition: 'all 0.3s ease-in-out',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Avatar
                      sx={{
                        bgcolor: exp.type === 'work' 
                          ? alpha(theme.palette.primary.main, 0.1)
                          : alpha(theme.palette.secondary.main, 0.1),
                        color: exp.type === 'work' ? 'primary.main' : 'secondary.main',
                        mr: 2,
                      }}
                    >
                      {exp.type === 'work' ? <Work /> : <School />}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" fontWeight="bold">
                        {exp.title}
                      </Typography>
                      <Typography variant="subtitle1" color="primary">
                        {exp.company}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Chip 
                    label={exp.period} 
                    size="small" 
                    sx={{ mb: 3 }}
                    color={exp.type === 'work' ? 'primary' : 'secondary'}
                  />
                  
                  {/* 위치 정보가 있는 경우 표시 */}
                  {exp.location && (
                    <Chip 
                      label={exp.location} 
                      size="small" 
                      variant="outlined"
                      sx={{ mb: 3, ml: 1 }}
                    />
                  )}
                  
                  <Box component="ul" sx={{ pl: 2, m: 0 }}>
                    {exp.description.map((desc, i) => (
                      <Typography 
                        key={i} 
                        component="li" 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ mb: 1, lineHeight: 1.6 }}
                      >
                        {desc}
                      </Typography>
                    ))}
                  </Box>

                  {/* 기술 스택이 있는 경우 표시 */}
                  {exp.technologies && exp.technologies.length > 0 && (
                    <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {exp.technologies.map((tech) => (
                        <Chip 
                          key={tech} 
                          label={tech} 
                          size="small" 
                          variant="outlined"
                          color="primary"
                        />
                      ))}
                    </Box>
                  )}
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* 연락처 정보 섹션 */}
        <Box sx={{ mb: 10 }}>
          <Typography variant="h3" align="center" gutterBottom fontWeight="bold" sx={{ mb: 6 }}>
            연락처 정보
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} md={8}>
              <Card sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom>
                  {personalInfo.contact.email}
                </Typography>
                {personalInfo.contact.phone && (
                  <Typography variant="body1" color="text.secondary" gutterBottom>
                    {personalInfo.contact.phone}
                  </Typography>
                )}
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  {personalInfo.contact.location}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {personalInfo.contact.responseTime}
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* 관심사 및 취미 */}
        <Box sx={{ mb: 10 }}>
          <Typography variant="h3" align="center" gutterBottom fontWeight="bold" sx={{ mb: 6 }}>
            관심사 & 취미
          </Typography>
          <Grid container spacing={4}>
            {interests.map((interest) => (
              <Grid item xs={12} sm={6} md={4} key={interest.name}>
                <Card
                  sx={{
                    p: 3,
                    textAlign: 'center',
                    border: '1px solid',
                    borderColor: 'divider',
                    '&:hover': {
                      borderColor: 'secondary.main',
                      bgcolor: alpha(theme.palette.secondary.main, 0.05),
                    },
                    transition: 'all 0.3s ease-in-out',
                  }}
                >
                  <Avatar
                    sx={{
                      width: 56,
                      height: 56,
                      mx: 'auto',
                      mb: 2,
                      bgcolor: alpha(theme.palette.secondary.main, 0.1),
                      color: 'secondary.main',
                    }}
                  >
                    {interest.icon}
                  </Avatar>
                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    {interest.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {interest.description}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* 개발 철학 섹션 - 분리된 데이터 사용 */}
        <Box
          sx={{
            mt: 10,
            p: 4,
            borderRadius: 3,
            bgcolor: alpha(theme.palette.primary.main, 0.05),
            border: '1px solid',
            borderColor: alpha(theme.palette.primary.main, 0.1),
          }}
        >
          <Typography
            variant="h5"
            sx={{
              mb: 3,
              fontWeight: 'bold',
              color: 'text.primary',
              textAlign: 'center',
            }}
          >
            개발 철학
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: 'text.secondary',
              lineHeight: 1.8,
              textAlign: 'center',
              maxWidth: '800px',
              mx: 'auto',
            }}
          >
            {/* 분리된 데이터에서 개발 철학 가져오기 */}
            {personalInfo.philosophy}
          </Typography>
        </Box>
      </Container>
    </Box>
  )
}