// src/app/api/tasks/route.ts - 할 일 목록 API 라우트

import { NextRequest, NextResponse } from 'next/server';
import { getTasks } from '@/lib/actions';

// GET 요청 핸들러 - 할 일 목록 조회
export async function GET(request: NextRequest) {
  try {
    // Server Action을 통해 할 일 목록 가져오기
    const tasks = await getTasks();
    
    // JSON 형태로 응답
    return NextResponse.json(tasks, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, max-age=0', // 캐시 비활성화
      },
    });
  } catch (error) {
    console.error('API - 할 일 목록 조회 실패:', error);
    
    // 에러 응답
    return NextResponse.json(
      { 
        error: '할 일 목록을 불러올 수 없습니다.',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}