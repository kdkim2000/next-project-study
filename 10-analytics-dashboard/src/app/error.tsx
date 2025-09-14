// src/app/error.tsx - 글로벌 에러 페이지
'use client';

import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { Error as ErrorIcon, Refresh as RefreshIcon } from '@mui/icons-material';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  React.useEffect(() => {
    console.error('Global error:', error);
  }, [error]);

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        p: 3,
      }}
    >
      <Paper sx={{ p: 4, textAlign: 'center', maxWidth: 500 }}>
        <ErrorIcon sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />
        
        <Typography variant="h4" gutterBottom>
          오류가 발생했습니다
        </Typography>
        
        <Typography variant="body1" color="text.secondary" paragraph>
          예상치 못한 오류가 발생했습니다. 잠시 후 다시 시도해주세요.
        </Typography>
        
        {process.env.NODE_ENV === 'development' && (
          <Paper sx={{ p: 2, mt: 2, bgcolor: 'grey.100', textAlign: 'left' }}>
            <Typography variant="caption" component="pre" sx={{ fontSize: '0.75rem' }}>
              {error.message}
            </Typography>
          </Paper>
        )}
        
        <Button
          variant="contained"
          startIcon={<RefreshIcon />}
          onClick={reset}
          sx={{ mt: 3 }}
        >
          다시 시도
        </Button>
      </Paper>
    </Box>
  );
}