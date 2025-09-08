// src/components/sections/Skills.tsx
// 기술 스택과 능력을 보여주는 섹션 - 수정된 버전

'use client'

import { useState } from 'react'
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  Tab,
  Tabs,
  alpha,
} from '@mui/material'
import { motion } from 'framer-motion'
import { Skill } from '@/types'

// 기술 스택 데이터
const skillsData: Skill[] = [
  // Frontend
  { name: 'React', level: 5, category: 'frontend', icon: '⚛️' },
  { name: 'Next.js', level: 5, category: 'frontend', icon: '▲' },
  { name: 'TypeScript', level: 4, category: 'frontend', icon: '🔷' },
  { name: 'JavaScript', level: 5, category: 'frontend', icon: '💛' },
  { name: 'HTML/CSS', level: 5, category: 'frontend', icon: '🎨' },
  { name: 'Tailwind CSS', level: 4, category: 'frontend', icon: '🌊' },
  { name: 'Material-UI', level: 4, category: 'frontend', icon: '📦' },
  { name: 'Framer Motion', level: 3, category: 'frontend', icon: '✨' },

  // Backend
  { name: 'Node.js', level: 4, category: 'backend', icon: '💚' },
  { name: 'Express.js', level: 4, category: 'backend', icon: '🚂' },
  { name: 'MongoDB', level: 3, category: 'backend', icon: '🍃' },
  { name: 'PostgreSQL', level: 3, category: 'backend', icon: '🐘' },
  { name: 'REST API', level: 4, category: 'backend', icon: '🔌' },
  { name: 'GraphQL', level: 3, category: 'backend', icon: '📊' },

  // Tools
  { name: 'Git', level: 4, category: 'tools', icon: '📚' },
  { name: 'VS Code', level: 5, category: 'tools', icon: '💙' },
  { name: 'Figma', level: 3, category: 'tools', icon: '🎯' },
  { name: 'Docker', level: 3, category: 'tools', icon: '🐳' },
  { name: 'Vercel', level: 4, category: 'tools', icon: '▲' },
  { name: 'AWS', level: 2, category: 'tools', icon: '☁️' },

  // Design
  { name: 'UI/UX Design', level: 4, category: 'design', icon: '🎨' },
  { name: 'Responsive Design', level: 5, category: 'design', icon: '📱' },
  { name: 'Accessibility', level: 4, category: 'design', icon: '♿' },
  { name: 'Design System', level: 3, category: 'design', icon: '📐' },
]

// 카테고리 매핑
const categoryLabels = {
  frontend: 'Frontend',
  backend: 'Backend',
  tools: 'Tools & Others',
  design: 'Design & UX',
}

// 레벨에 따른 색상 (수정된 타입)
const getLevelColor = (level: number): 'success' | 'primary' | 'warning' | 'error' => {
  if (level >= 5) return 'success'
  if (level >= 4) return 'primary'
  if (level >= 3) return 'warning'
  return 'error'
}

// 애니메이션 variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5 },
  },
}

export default function Skills() {
  const [selectedCategory, setSelectedCategory] = useState<string>('frontend')

  // 선택된 카테고리의 기술들 필터링
  const filteredSkills = skillsData.filter(skill => skill.category === selectedCategory)

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setSelectedCategory(newValue)
  }

  return (
    <Box
      component="section"
      sx={(theme) => ({
        py: { xs: 8, md: 12 },
        bgcolor: alpha(theme.palette.primary.main, 0.02),
      })}
    >
      <Container maxWidth="lg">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {/* 섹션 헤더 */}
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <motion.div variants={itemVariants}>
              <Typography
                variant="h2"
                sx={{
                  mb: 3,
                  fontWeight: 'bold',
                  color: 'text.primary',
                }}
              >
                Skills & Technologies
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: 'text.secondary',
                  maxWidth: '600px',
                  mx: 'auto',
                  lineHeight: 1.8,
                }}
              >
                다양한 기술 스택을 활용하여 완성도 높은 웹 애플리케이션을 개발합니다.
                지속적인 학습을 통해 최신 기술 트렌드를 따라가고 있습니다.
              </Typography>
            </motion.div>
          </Box>

          {/* 카테고리 탭 */}
          <motion.div variants={itemVariants}>
            <Box sx={{ mb: 6, display: 'flex', justifyContent: 'center' }}>
              <Tabs
                value={selectedCategory}
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
                sx={(theme) => ({
                  bgcolor: 'background.paper',
                  borderRadius: 3,
                  p: 1,
                  boxShadow: 1,
                  '& .MuiTab-root': {
                    textTransform: 'none',
                    fontWeight: 500,
                    minWidth: 'auto',
                    px: 3,
                    py: 1.5,
                    borderRadius: 2,
                    '&.Mui-selected': {
                      color: 'primary.main',
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                    },
                  },
                  '& .MuiTabs-indicator': {
                    display: 'none',
                  },
                })}
              >
                {Object.entries(categoryLabels).map(([key, label]) => (
                  <Tab key={key} label={label} value={key} />
                ))}
              </Tabs>
            </Box>
          </motion.div>

          {/* 스킬 카드들 */}
          <motion.div
            key={selectedCategory} // 카테고리 변경 시 재애니메이션
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <Grid container spacing={3}>
              {filteredSkills.map((skill) => {
                const levelColor = getLevelColor(skill.level)
                return (
                  <Grid item xs={12} sm={6} md={4} key={skill.name}>
                    <motion.div
                      variants={itemVariants}
                      whileHover={{ y: -5 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      <Card
                        sx={(theme) => ({
                          p: 3,
                          height: '100%',
                          borderRadius: 3,
                          border: '1px solid',
                          borderColor: 'divider',
                          bgcolor: 'background.paper',
                          transition: 'all 0.3s ease-in-out',
                          '&:hover': {
                            borderColor: `${levelColor}.main`,
                            boxShadow: `0 8px 32px ${alpha(
                              theme.palette[levelColor]?.main || theme.palette.primary.main, 
                              0.12
                            )}`,
                          },
                        })}
                      >
                        <CardContent sx={{ p: 0 }}>
                          {/* 스킬 헤더 */}
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                            <Typography
                              variant="h4"
                              sx={{ mr: 2, fontSize: '2rem' }}
                            >
                              {skill.icon}
                            </Typography>
                            <Box sx={{ flex: 1 }}>
                              <Typography
                                variant="h6"
                                sx={{ fontWeight: 'bold', color: 'text.primary' }}
                              >
                                {skill.name}
                              </Typography>
                              <Chip
                                label={`${skill.level}/5`}
                                size="small"
                                color={levelColor}
                                sx={{ mt: 0.5 }}
                              />
                            </Box>
                          </Box>

                          {/* 스킬 레벨 진행바 */}
                          <Box sx={{ mb: 2 }}>
                            <Typography
                              variant="body2"
                              sx={{ mb: 1, color: 'text.secondary' }}
                            >
                              숙련도
                            </Typography>
                            <LinearProgress
                              variant="determinate"
                              value={(skill.level / 5) * 100}
                              color={levelColor}
                              sx={(theme) => ({
                                height: 8,
                                borderRadius: 4,
                                bgcolor: alpha(theme.palette.grey[500], 0.1),
                                '& .MuiLinearProgress-bar': {
                                  borderRadius: 4,
                                },
                              })}
                            />
                          </Box>

                          {/* 레벨 설명 */}
                          <Typography
                            variant="body2"
                            sx={{ 
                              color: 'text.secondary',
                              fontSize: '0.875rem',
                            }}
                          >
                            {skill.level === 5 && '전문가 수준 - 실무에서 자유롭게 활용'}
                            {skill.level === 4 && '능숙함 - 복잡한 프로젝트에서 활용 가능'}
                            {skill.level === 3 && '보통 - 기본적인 프로젝트에서 활용'}
                            {skill.level === 2 && '초급 - 간단한 작업 수행 가능'}
                            {skill.level === 1 && '입문 - 기초 지식 보유'}
                          </Typography>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>
                )
              })}
            </Grid>
          </motion.div>

          {/* 학습 중인 기술 */}
          <motion.div variants={itemVariants}>
            <Box
              sx={(theme) => ({
                mt: 8,
                p: 4,
                borderRadius: 3,
                bgcolor: alpha(theme.palette.secondary.main, 0.05),
                border: '1px solid',
                borderColor: alpha(theme.palette.secondary.main, 0.1),
                textAlign: 'center',
              })}
            >
              <Typography
                variant="h5"
                sx={{
                  mb: 3,
                  fontWeight: 'bold',
                  color: 'text.primary',
                }}
              >
                현재 학습 중인 기술
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 1 }}>
                {['Vue.js', 'Python', 'Machine Learning', 'WebAssembly', 'Three.js'].map((tech) => (
                  <Chip
                    key={tech}
                    label={tech}
                    variant="outlined"
                    color="secondary"
                    sx={(theme) => ({
                      fontWeight: 500,
                      '&:hover': {
                        bgcolor: alpha(theme.palette.secondary.main, 0.1),
                      },
                    })}
                  />
                ))}
              </Box>
            </Box>
          </motion.div>
        </motion.div>
      </Container>
    </Box>
  )
}