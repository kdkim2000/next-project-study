// src/lib/actions.ts - Next.js Server Actions를 사용한 서버사이드 로직

'use server'; // 이 파일의 모든 함수는 서버에서 실행됩니다

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma } from './db';
import { 
  createTaskSchema, 
  updateTaskSchema, 
  deleteTaskSchema, 
  reorderTasksSchema 
} from './validations';
import { ActionResult } from '@/types';

// 할 일 목록 조회
export async function getTasks() {
  try {
    const tasks = await prisma.task.findMany({
      orderBy: [
        { order: 'asc' },      // 순서대로 정렬
        { createdAt: 'desc' }  // 생성일 내림차순
      ]
    });
    
    return tasks;
  } catch (error) {
    console.error('할 일 목록 조회 실패:', error);
    throw new Error('할 일 목록을 불러올 수 없습니다.');
  }
}

// 할 일 생성
export async function createTask(formData: FormData): Promise<ActionResult> {
  try {
    // FormData에서 데이터 추출
    const rawData = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      priority: formData.get('priority') as string,
      status: formData.get('status') as string,
      dueDate: formData.get('dueDate') as string,
    };

    // 유효성 검사
    const validatedData = createTaskSchema.parse({
      ...rawData,
      description: rawData.description || undefined,
      dueDate: rawData.dueDate || undefined,
      order: await getNextOrderNumber(), // 새로운 순서 번호 자동 생성
    });

    // 데이터베이스에 저장
    const task = await prisma.task.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        priority: validatedData.priority,
        status: validatedData.status,
        dueDate: validatedData.dueDate ? new Date(validatedData.dueDate) : undefined,
        order: validatedData.order,
      },
    });

    // 캐시 무효화 (페이지를 새로고침하여 변경사항 반영)
    revalidatePath('/', 'page');

    return {
      success: true,
      data: task,
      message: '할 일이 성공적으로 생성되었습니다.',
    };
  } catch (error) {
    console.error('할 일 생성 실패:', error);
    
    // Zod 유효성 검사 에러 처리
    if (error instanceof Error && error.name === 'ZodError') {
      return {
        success: false,
        error: '입력한 데이터가 올바르지 않습니다.',
      };
    }

    return {
      success: false,
      error: '할 일 생성에 실패했습니다.',
    };
  }
}

// 할 일 수정
export async function updateTask(formData: FormData): Promise<ActionResult> {
  try {
    const rawData = {
      id: formData.get('id') as string,
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      priority: formData.get('priority') as string,
      status: formData.get('status') as string,
      dueDate: formData.get('dueDate') as string,
    };

    // 유효성 검사
    const validatedData = updateTaskSchema.parse({
      ...rawData,
      description: rawData.description || undefined,
      dueDate: rawData.dueDate || undefined,
    });

    // 존재하는 할 일인지 확인
    const existingTask = await prisma.task.findUnique({
      where: { id: validatedData.id },
    });

    if (!existingTask) {
      return {
        success: false,
        error: '존재하지 않는 할 일입니다.',
      };
    }

    // 데이터베이스 업데이트
    const updatedTask = await prisma.task.update({
      where: { id: validatedData.id },
      data: {
        title: validatedData.title,
        description: validatedData.description,
        priority: validatedData.priority,
        status: validatedData.status,
        dueDate: validatedData.dueDate ? new Date(validatedData.dueDate) : null,
      },
    });

    revalidatePath('/');

    return {
      success: true,
      data: updatedTask,
      message: '할 일이 성공적으로 수정되었습니다.',
    };
  } catch (error) {
    console.error('할 일 수정 실패:', error);
    return {
      success: false,
      error: '할 일 수정에 실패했습니다.',
    };
  }
}

// 할 일 삭제
export async function deleteTask(formData: FormData): Promise<ActionResult> {
  try {
    const { id } = deleteTaskSchema.parse({
      id: formData.get('id') as string,
    });

    // 존재하는 할 일인지 확인
    const existingTask = await prisma.task.findUnique({
      where: { id },
    });

    if (!existingTask) {
      return {
        success: false,
        error: '존재하지 않는 할 일입니다.',
      };
    }

    // 데이터베이스에서 삭제
    await prisma.task.delete({
      where: { id },
    });

    revalidatePath('/');

    return {
      success: true,
      message: '할 일이 성공적으로 삭제되었습니다.',
    };
  } catch (error) {
    console.error('할 일 삭제 실패:', error);
    return {
      success: false,
      error: '할 일 삭제에 실패했습니다.',
    };
  }
}

// 할 일 순서 변경 (드래그 앤 드롭)
export async function reorderTasks(
  taskId: string, 
  newOrder: number, 
  newStatus?: string
): Promise<ActionResult> {
  try {
    const validatedData = reorderTasksSchema.parse({
      taskId,
      newOrder,
      newStatus,
    });

    // 트랜잭션으로 순서 변경 처리
    await prisma.$transaction(async (tx) => {
      // 기존 할 일의 순서와 상태 가져오기
      const currentTask = await tx.task.findUnique({
        where: { id: validatedData.taskId },
      });

      if (!currentTask) {
        throw new Error('존재하지 않는 할 일입니다.');
      }

      // 새로운 순서에 맞춰 다른 할 일들의 순서 조정
      if (validatedData.newOrder !== currentTask.order) {
        if (validatedData.newOrder > currentTask.order) {
          // 아래로 이동: 사이에 있는 할 일들을 위로 이동
          await tx.task.updateMany({
            where: {
              order: {
                gt: currentTask.order,
                lte: validatedData.newOrder,
              },
            },
            data: {
              order: {
                decrement: 1,
              },
            },
          });
        } else {
          // 위로 이동: 사이에 있는 할 일들을 아래로 이동
          await tx.task.updateMany({
            where: {
              order: {
                gte: validatedData.newOrder,
                lt: currentTask.order,
              },
            },
            data: {
              order: {
                increment: 1,
              },
            },
          });
        }
      }

      // 현재 할 일의 순서 및 상태 업데이트
      await tx.task.update({
        where: { id: validatedData.taskId },
        data: {
          order: validatedData.newOrder,
          ...(validatedData.newStatus && { status: validatedData.newStatus }),
        },
      });
    });

    revalidatePath('/');

    return {
      success: true,
      message: '순서가 성공적으로 변경되었습니다.',
    };
  } catch (error) {
    console.error('순서 변경 실패:', error);
    return {
      success: false,
      error: '순서 변경에 실패했습니다.',
    };
  }
}

// 상태별 할 일 개수 조회
export async function getTaskStats() {
  try {
    const stats = await prisma.task.groupBy({
      by: ['status'],
      _count: {
        id: true,
      },
    });

    // 상태별 개수를 객체로 변환
    const result = {
      TODO: 0,
      IN_PROGRESS: 0,
      COMPLETED: 0,
    };

    stats.forEach((stat) => {
      result[stat.status] = stat._count.id;
    });

    return result;
  } catch (error) {
    console.error('통계 조회 실패:', error);
    throw new Error('통계를 불러올 수 없습니다.');
  }
}

// 다음 순서 번호 계산
async function getNextOrderNumber(): Promise<number> {
  const lastTask = await prisma.task.findFirst({
    orderBy: { order: 'desc' },
    select: { order: true },
  });

  return lastTask ? lastTask.order + 1 : 0;
}

// 모든 할 일의 순서 재정렬 (정리 함수)
export async function normalizeTaskOrder(): Promise<ActionResult> {
  try {
    const tasks = await prisma.task.findMany({
      orderBy: { order: 'asc' },
      select: { id: true },
    });

    // 트랜잭션으로 모든 할 일의 순서를 0부터 연속적으로 재배열
    await prisma.$transaction(
      tasks.map((task, index) =>
        prisma.task.update({
          where: { id: task.id },
          data: { order: index },
        })
      )
    );

    revalidatePath('/');

    return {
      success: true,
      message: '순서가 정리되었습니다.',
    };
  } catch (error) {
    console.error('순서 정리 실패:', error);
    return {
      success: false,
      error: '순서 정리에 실패했습니다.',
    };
  }
}