// src/app/not-found.tsx - 404 페이지
import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { Search as SearchIcon, Home as HomeIcon } from '@mui/icons-material';
import Link from 'next/link';

export default function NotFound() {
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
        <SearchIcon sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
        
        <Typography variant="h3" gutterBottom>
          404
        </Typography>
        
        <Typography variant="h5" gutterBottom>
          페이지를 찾을 수 없습니다
        </Typography>
        
        <Typography variant="body1" color="text.secondary" paragraph>
          요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
        </Typography>
        
        <Button
          component={Link}
          href="/"
          variant="contained"
          startIcon={<HomeIcon />}
          sx={{ mt: 3 }}
        >
          홈으로 돌아가기
        </Button>
      </Paper>
    </Box>
  );
}