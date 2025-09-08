// src/components/ui/LoadingSpinner.tsx
// 로딩 스피너 컴포넌트

'use client'

import { Box, CircularProgress, Typography } from '@mui/material'

export default function LoadingSpinner() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        bgcolor: 'background.default',
        color: 'text.primary',
      }}
    >
      <CircularProgress size={60} thickness={4} sx={{ mb: 3 }} />
      <Typography variant="h6" color="text.secondary">
        포트폴리오 로딩 중...
      </Typography>
    </Box>
  )
}