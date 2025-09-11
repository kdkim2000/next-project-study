// src/components/TaskListWrapper.tsx - TaskList를 위한 클라이언트 래퍼 컴포넌트

'use client'; // 클라이언트 컴포넌트로 설정

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import TaskList from './TaskList';
import { Task } from '@/types';

interface TaskListWrapperProps {
  initialTasks: Task[]; // 서버에서 전달받은 초기 할 일 목록
}

// 새로고침 기능이 있는 TaskList 래퍼 컴포넌트
export default function TaskListWithRefresh({ initialTasks }: TaskListWrapperProps) {
  // Next.js 라우터 (페이지 새로고침용)
  const router = useRouter();
  
  // 할 일 목록 상태 관리
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  
  // 로딩 상태 관리
  const [loading, setLoading] = useState(false);

  // 새로고침 함수 - 페이지 전체를 새로고침
  const handleRefresh = useCallback(() => {
    setLoading(true);
    // Next.js router를 사용한 페이지 새로고침
    router.refresh();
    
    // 약간의 지연 후 로딩 상태 해제
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [router]);

  return (
    <TaskList 
      tasks={tasks} 
      onRefresh={handleRefresh}
      loading={loading}
    />
  );
}