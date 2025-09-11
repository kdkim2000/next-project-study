// src/lib/validations.ts - Zod를 사용한 폼 유효성 검사 스키마

import { z } from 'zod';
import { Priority, Status } from '@prisma/client';

// 할 일 생성/수정을 위한 기본 스키마
export const taskSchema = z.object({
  // 제목: 필수, 최소 1자, 최대 100자
  title: z.string()
    .min(1, '제목을 입력해주세요')
    .max(100, '제목은 100자 이하로 입력해주세요')
    .trim(), // 앞뒤 공백 제거

  // 설명: 선택사항, 최대 500자
  description: z.string()
    .max(500, '설명은 500자 이하로 입력해주세요')
    .optional()
    .or(z.literal('')), // 빈 문자열도 허용

  // 우선순위: LOW, MEDIUM, HIGH 중 하나
  priority: z.nativeEnum(Priority, {
    errorMap: () => ({ message: '올바른 우선순위를 선택해주세요' })
  }),

  // 상태: TODO, IN_PROGRESS, COMPLETED 중 하나
  status: z.nativeEnum(Status, {
    errorMap: () => ({ message: '올바른 상태를 선택해주세요' })
  }),

  // 마감일: 선택사항, 현재 날짜 이후여야 함
  dueDate: z.string()
    .optional()
    .refine(
      (date) => {
        if (!date) return true; // 빈 값은 허용
        const selectedDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // 시간 제거하여 날짜만 비교
        return selectedDate >= today;
      },
      { message: '마감일은 오늘 이후로 설정해주세요' }
    ),
});

// 할 일 생성 스키마 (taskSchema를 확장)
export const createTaskSchema = taskSchema.extend({
  // 순서: 필수, 0 이상의 정수
  order: z.number().int().min(0).default(0),
});

// 할 일 수정 스키마 (모든 필드가 선택적)
export const updateTaskSchema = z.object({
  // ID는 필수 (어떤 할 일을 수정할지 식별)
  id: z.string().min(1, '할 일 ID가 필요합니다'),
  
  // 제목: 선택적이지만 있으면 검사
  title: z.string()
    .min(1, '제목을 입력해주세요')
    .max(100, '제목은 100자 이하로 입력해주세요')
    .trim()
    .optional(),

  // 설명: 선택적
  description: z.string()
    .max(500, '설명은 500자 이하로 입력해주세요')
    .optional()
    .nullable()
    .transform(val => val === '' ? undefined : val),

  // 우선순위: 선택적이지만 있으면 검사
  priority: z.nativeEnum(Priority, {
    errorMap: () => ({ message: '올바른 우선순위를 선택해주세요' })
  }).optional(),

  // 상태: 선택적이지만 있으면 검사
  status: z.nativeEnum(Status, {
    errorMap: () => ({ message: '올바른 상태를 선택해주세요' })
  }).optional(),

  // 마감일: 선택적
  dueDate: z.string()
    .optional()
    .nullable()
    .transform(val => val === '' ? undefined : val)
    .refine(
      (date) => {
        if (!date) return true; // 빈 값은 허용
        const selectedDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // 시간 제거하여 날짜만 비교
        return selectedDate >= today;
      },
      { message: '마감일은 오늘 이후로 설정해주세요' }
    ),
  
  order: z.number().int().min(0).optional(),
});

// 할 일 삭제 스키마
export const deleteTaskSchema = z.object({
  id: z.string().min(1, '삭제할 할 일 ID가 필요합니다'),
});

// 드래그 앤 드롭을 위한 순서 변경 스키마
export const reorderTasksSchema = z.object({
  // 이동할 할 일의 ID
  taskId: z.string().min(1, '할 일 ID가 필요합니다'),
  // 새로운 순서 (0 이상)
  newOrder: z.number().int().min(0, '순서는 0 이상이어야 합니다'),
  // 새로운 상태 (드래그 앤 드롭으로 상태 변경 시)
  newStatus: z.nativeEnum(Status).optional(),
});

// 검색 및 필터링을 위한 스키마
export const filterSchema = z.object({
  // 검색어: 선택사항
  search: z.string().optional(),
  
  // 상태 필터: Status enum 또는 'ALL'
  status: z.union([
    z.nativeEnum(Status),
    z.literal('ALL')
  ]).optional().default('ALL'),
  
  // 우선순위 필터: Priority enum 또는 'ALL'
  priority: z.union([
    z.nativeEnum(Priority),
    z.literal('ALL')
  ]).optional().default('ALL'),
});

// 정렬을 위한 스키마
export const sortSchema = z.object({
  // 정렬 기준 필드
  field: z.enum(['createdAt', 'updatedAt', 'dueDate', 'priority', 'title'])
    .default('createdAt'),
  
  // 정렬 방향: 오름차순(asc) 또는 내림차순(desc)
  direction: z.enum(['asc', 'desc']).default('desc'),
});

// 타입 추출 (TypeScript에서 사용하기 위해)
export type TaskFormData = z.infer<typeof taskSchema>;
export type CreateTaskData = z.infer<typeof createTaskSchema>;
export type UpdateTaskData = z.infer<typeof updateTaskSchema>;
export type FilterData = z.infer<typeof filterSchema>;
export type SortData = z.infer<typeof sortSchema>;