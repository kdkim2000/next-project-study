// src/lib/client-actions.ts - 클라이언트에서 호출할 수 있는 액션들

'use client';

import { Task } from '@/types';

// 할 일 목록을 가져오는 클라이언트 함수
export async function fetchTasks(): Promise<Task[]> {
  try {
    // API 라우트를 통해 데이터 가져오기
    const response = await fetch('/api/tasks', {
      method: 'GET',
      cache: 'no-store', // 항상 최신 데이터 가져오기
    });

    if (!response.ok) {
      throw new Error('Failed to fetch tasks');
    }

    const tasks = await response.json();
    return tasks;
  } catch (error) {
    console.error('할 일 목록 조회 실패:', error);
    throw error;
  }
}

// 할 일 통계를 가져오는 클라이언트 함수
export async function fetchTaskStats() {
  try {
    const response = await fetch('/api/tasks/stats', {
      method: 'GET',
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch task stats');
    }

    const stats = await response.json();
    return stats;
  } catch (error) {
    console.error('통계 조회 실패:', error);
    throw error;
  }
}