// src/app/api/socket/route.ts
/**
 * Socket.io 서버 상태를 확인하는 API 엔드포인트
 * Next.js App Router 스타일의 API 라우트
 */
import { NextRequest, NextResponse } from 'next/server';

// GET 요청 - Socket 서버 상태 확인
export async function GET(request: NextRequest) {
  try {
    // Socket.io 서버 상태 확인을 위한 기본 정보
    const socketServerUrl = process.env.NODE_ENV === 'development' 
      ? 'http://localhost:3001'
      : process.env.SOCKET_SERVER_URL || 'http://localhost:3001';

    // Socket 서버에 헬스체크 요청
    let serverStatus = 'unknown';
    let serverInfo = {};

    try {
      const response = await fetch(`${socketServerUrl}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // 타임아웃 설정 (5초)
        signal: AbortSignal.timeout(5000)
      });

      if (response.ok) {
        serverInfo = await response.json();
        serverStatus = 'running';
      } else {
        serverStatus = 'error';
      }
    } catch (error) {
      console.error('Socket 서버 연결 실패:', error);
      serverStatus = 'disconnected';
    }

    return NextResponse.json({
      status: 'success',
      socketServer: {
        url: socketServerUrl,
        status: serverStatus,
        info: serverInfo
      },
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV
    });

  } catch (error) {
    console.error('Socket API 오류:', error);
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Socket 서버 상태를 확인할 수 없습니다.',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// POST 요청 - Socket 서버에 명령 전송 (필요시 확장 가능)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // 여기서 Socket 서버에 특별한 명령을 보낼 수 있습니다
    // 예: 서버 재시작, 통계 리셋 등
    
    return NextResponse.json({
      status: 'success',
      message: 'Socket 명령이 전송되었습니다.',
      command: body
    });

  } catch (error) {
    return NextResponse.json(
      { status: 'error', message: 'Socket 명령 처리 중 오류가 발생했습니다.' },
      { status: 400 }
    );
  }
}