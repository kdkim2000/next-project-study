// src/components/streaming/SuspenseWrapper.tsx - Suspense 래퍼
import React, { Suspense } from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';

interface SuspenseWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  title?: string;
}

function DefaultFallback({ title }: { title?: string }) {
  return (
    <Box sx={{ p: 4, textAlign: 'center' }}>
      <Typography variant="h6" gutterBottom>
        {title || '콘텐츠 로딩 중...'}
      </Typography>
      <LinearProgress sx={{ mt: 2 }} />
    </Box>
  );
}

export default function SuspenseWrapper({ children, fallback, title }: SuspenseWrapperProps) {
  return (
    <Suspense fallback={fallback || <DefaultFallback title={title} />}>
      {children}
    </Suspense>
  );
}