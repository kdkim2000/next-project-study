// src/lib/actions.ts - 단순하고 명확한 Server Actions

'use server'; 

import { revalidatePath } from 'next/cache';
import { prisma } from './db';
import { createTaskSchema, updateTaskSchema } from './validations';

// 🎯 학습 목표 1: 할 일 목록 조회
export async function getTasks() {
  try {
    const tasks = await prisma.task.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return tasks;
  } catch (error) {
    console.error('할 일 조회 실패:', error);
    throw new Error('할 일을 불러올 수 없습니다.');
  }
}

// 🎯 학습 목표 2: 할 일 생성
export async function createTask(formData: FormData) {
  try {
    // FormData에서 데이터 추출
    const data = {
      title: formData.get('title') as string,
      description: (formData.get('description') as string) || null,
      priority: formData.get('priority') as string,
      status: formData.get('status') as string,
      dueDate: formData.get('dueDate') as string,
    };

    // Zod로 유효성 검사
    const validatedData = createTaskSchema.parse({
      ...data,
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
    });

    // 데이터베이스에 저장
    const task = await prisma.task.create({
      data: validatedData,
    });

    // 페이지 새로고침
    revalidatePath('/');
    return { success: true, task };
    
  } catch (error) {
    console.error('할 일 생성 실패:', error);
    return { success: false, error: '할 일 생성에 실패했습니다.' };
  }
}

// 🎯 학습 목표 3: 할 일 수정
export async function updateTask(formData: FormData) {
  try {
    const id = formData.get('id') as string;
    const data = {
      title: formData.get('title') as string,
      description: (formData.get('description') as string) || null,
      priority: formData.get('priority') as string,
      status: formData.get('status') as string,
      dueDate: formData.get('dueDate') as string,
    };

    // Zod로 유효성 검사
    const validatedData = updateTaskSchema.parse({
      ...data,
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
    });

    // 데이터베이스 업데이트
    const task = await prisma.task.update({
      where: { id },
      data: validatedData,
    });

    revalidatePath('/');
    return { success: true, task };
    
  } catch (error) {
    console.error('할 일 수정 실패:', error);
    return { success: false, error: '할 일 수정에 실패했습니다.' };
  }
}

// 🎯 학습 목표 4: 할 일 삭제 (가장 간단하게)
export async function deleteTask(taskId: string) {
  try {
    await prisma.task.delete({
      where: { id: taskId },
    });

    revalidatePath('/');
    return { success: true };
    
  } catch (error) {
    console.error('할 일 삭제 실패:', error);
    return { success: false, error: '할 일 삭제에 실패했습니다.' };
  }
}