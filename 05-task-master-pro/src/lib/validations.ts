// src/lib/validations.ts - 단순한 Zod 스키마

import { z } from 'zod';
import { Priority, Status } from '@prisma/client';

// 🎯 기본 할 일 스키마 (간단하게)
export const createTaskSchema = z.object({
  title: z.string().min(1, '제목을 입력해주세요').max(100, '제목은 100자 이하로 입력해주세요'),
  description: z.string().max(500, '설명은 500자 이하로 입력해주세요').nullable().optional(),
  priority: z.nativeEnum(Priority),
  status: z.nativeEnum(Status),
  dueDate: z.date().nullable().optional(),
});

// 🎯 수정용 스키마 (ID 제외하고 동일)
export const updateTaskSchema = createTaskSchema;

// 타입 추출
export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;