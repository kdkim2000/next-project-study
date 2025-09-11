// src/types/index.ts - 기본 타입 정의

import { Task as PrismaTask, Priority, Status } from '@prisma/client';

// 🎯 학습 포인트: Prisma에서 생성된 타입 사용
export type Task = PrismaTask;

// 🎯 Enum 타입들을 재export
export { Priority, Status };

// 🎯 폼에서 사용할 기본 타입들
export type CreateTaskInput = {
  title: string;
  description?: string | null;
  priority: Priority;
  status: Status;
  dueDate?: Date | null;
};