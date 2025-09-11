// src/types/index.ts - 애플리케이션 전체에서 사용할 타입들을 정의

// Prisma에서 생성된 타입을 import
import { Task as PrismaTask, Priority, Status } from '@prisma/client';

// 기본 Task 타입 (Prisma 타입을 그대로 사용)
export type Task = PrismaTask;

// Priority와 Status enum을 재export (편의성을 위해)
export { Priority, Status };

// 새로운 할 일을 생성할 때 사용하는 타입 (id, createdAt, updatedAt 제외)
export type CreateTaskData = {
  title: string;
  description?: string;
  priority: Priority;
  status: Status;
  dueDate?: Date;
  order: number;
};

// 할 일을 수정할 때 사용하는 타입 (모든 필드가 선택적)
export type UpdateTaskData = {
  title?: string;
  description?: string;
  priority?: Priority;
  status?: Status;
  dueDate?: Date;
  order?: number;
};

// 필터링 옵션을 위한 타입
export type FilterOptions = {
  status?: Status | 'ALL';  // 'ALL'은 모든 상태를 보여주는 옵션
  priority?: Priority | 'ALL';
  search?: string;  // 검색어
};

// 정렬 옵션을 위한 타입
export type SortOptions = {
  field: 'createdAt' | 'updatedAt' | 'dueDate' | 'priority' | 'title';
  direction: 'asc' | 'desc';  // 오름차순/내림차순
};

// 드래그 앤 드롭 이벤트에서 사용할 타입
export type DragEndResult = {
  active: {
    id: string;
  };
  over: {
    id: string;
  } | null;
};

// 서버 액션의 응답 타입 (성공/실패 처리)
export type ActionResult<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
};

// 우선순위별 색상 매핑을 위한 타입
export type PriorityColors = {
  [key in Priority]: string;
};

// 상태별 색상 매핑을 위한 타입
export type StatusColors = {
  [key in Status]: string;
};