// src/app/page.tsx - 애플리케이션의 메인 페이지

import React from 'react';
import { Container, Box, Alert } from '@mui/material';
import TaskListWithRefresh from '@/components/TaskListWrapper';
import { getTasks, getTaskStats } from '@/lib/actions';

// 메인 페이지 컴포넌트 (서버 컴포넌트)
export default async function HomePage() {
  // 서버 컴포넌트에서 데이터를 미리 가져옴
  let tasks;
  let stats;
  let error;

  try {
    // 병렬로 데이터 가져오기
    [tasks, stats] = await Promise.all([
      getTasks(),
      getTaskStats(),
    ]);
  } catch (err) {
    console.error('데이터 로딩 실패:', err);
    error = '데이터를 불러오는데 실패했습니다.';
  }

  // 에러 상태 처리
  if (error || !tasks) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          {error || '알 수 없는 오류가 발생했습니다.'}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ minHeight: '100vh' }}>
        {/* 클라이언트 컴포넌트로 분리된 TaskList */}
        <TaskListWithRefresh initialTasks={tasks} />
      </Box>
    </Container>
  );
}