// src/lib/utils.ts - 애플리케이션에서 공통으로 사용되는 유틸리티 함수들

import { Priority, Status } from '@prisma/client';
import { PriorityColors, StatusColors } from '@/types';

// 날짜를 사용자 친화적인 형태로 포맷팅
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  // 한국 시간대로 포맷팅
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

// 날짜만 포맷팅 (시간 제외)
export function formatDateOnly(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d);
}

// 상대적 시간 표시 (예: "3일 전", "2시간 후")
export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInMs = d.getTime() - now.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) {
    return '오늘';
  } else if (diffInDays === 1) {
    return '내일';
  } else if (diffInDays === -1) {
    return '어제';
  } else if (diffInDays > 1) {
    return `${diffInDays}일 후`;
  } else {
    return `${Math.abs(diffInDays)}일 전`;
  }
}

// 우선순위별 색상 반환
export const priorityColors: PriorityColors = {
  HIGH: '#f44336',   // 빨간색 - 높은 우선순위
  MEDIUM: '#ff9800', // 주황색 - 중간 우선순위
  LOW: '#4caf50',    // 초록색 - 낮은 우선순위
};

// 상태별 색상 반환
export const statusColors: StatusColors = {
  TODO: '#2196f3',        // 파란색 - 할 일
  IN_PROGRESS: '#ff9800', // 주황색 - 진행중
  COMPLETED: '#4caf50',   // 초록색 - 완료
};

// 우선순위를 한글로 변환
export function getPriorityLabel(priority: Priority): string {
  const labels = {
    HIGH: '높음',
    MEDIUM: '중간',
    LOW: '낮음',
  };
  return labels[priority];
}

// 상태를 한글로 변환
export function getStatusLabel(status: Status): string {
  const labels = {
    TODO: '할 일',
    IN_PROGRESS: '진행중',
    COMPLETED: '완료',
  };
  return labels[status];
}

// 마감일까지의 남은 일수 계산
export function getDaysUntilDue(dueDate: Date | string | null): number | null {
  if (!dueDate) return null;
  
  const due = typeof dueDate === 'string' ? new Date(dueDate) : dueDate;
  const today = new Date();
  
  // 시간 부분을 제거하고 날짜만 비교
  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);
  
  const diffTime = due.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
}

// 마감일 상태 확인 (지남/임박/여유)
export function getDueDateStatus(dueDate: Date | string | null): 'overdue' | 'soon' | 'ok' | null {
  const daysUntil = getDaysUntilDue(dueDate);
  
  if (daysUntil === null) return null;
  
  if (daysUntil < 0) return 'overdue';  // 마감일 지남
  if (daysUntil <= 3) return 'soon';    // 3일 이내 마감
  return 'ok';                          // 여유있음
}

// 문자열을 안전하게 자르기 (말줄임표 추가)
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

// 배열의 요소 순서 변경 (드래그 앤 드롭용)
export function reorderArray<T>(array: T[], fromIndex: number, toIndex: number): T[] {
  const result = Array.from(array);
  const [removed] = result.splice(fromIndex, 1);
  result.splice(toIndex, 0, removed);
  return result;
}

// 검색어로 텍스트 필터링
export function matchesSearch(text: string, searchTerm: string): boolean {
  if (!searchTerm.trim()) return true;
  return text.toLowerCase().includes(searchTerm.toLowerCase().trim());
}

// 디바운싱 함수 (검색 입력 시 성능 최적화)
export function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// 에러 메시지를 사용자 친화적으로 변환
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  return '알 수 없는 오류가 발생했습니다.';
}