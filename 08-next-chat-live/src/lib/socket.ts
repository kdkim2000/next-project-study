// src/lib/socket.ts (React import 추가 및 오류 수정)
/**
 * Socket.io 클라이언트 관리 - 수정된 버전
 * React import 추가 및 브라우저 환경에서만 실행되도록 수정
 */
'use client';

import { io, Socket } from 'socket.io-client';

class SocketManager {
  private socket: Socket | null = null;
  private static instance: SocketManager;

  /**
   * 싱글톤 패턴
   */
  static getInstance(): SocketManager {
    if (!SocketManager.instance) {
      SocketManager.instance = new SocketManager();
    }
    return SocketManager.instance;
  }

  /**
   * 서버에 연결 - 브라우저 환경 체크 추가
   */
  connect(): Socket {
    // SSR에서는 실행하지 않음
    if (typeof window === 'undefined') {
      throw new Error('Socket connection can only be established on client side');
    }

    // 이미 연결되어 있으면 기존 소켓 반환
    if (this.socket && this.socket.connected) {
      return this.socket;
    }

    // 서버 URL 설정
    const serverUrl = 'http://localhost:3001';

    console.log('🔌 서버 연결 시도:', serverUrl);

    // Socket.io 클라이언트 생성
    this.socket = io(serverUrl, {
      transports: ['websocket', 'polling'],
      timeout: 20000,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      forceNew: true, // 새 연결 강제
    });

    // 연결 이벤트 핸들러
    this.socket.on('connect', () => {
      console.log('✅ 서버 연결 성공!', this.socket?.id);
    });

    this.socket.on('disconnect', (reason) => {
      console.log('❌ 서버 연결 끊김:', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.error('🔥 연결 오류:', error.message);
    });

    this.socket.on('reconnect', (attemptNumber) => {
      console.log('🔄 재연결 성공!', `시도 횟수: ${attemptNumber}`);
    });

    this.socket.on('reconnect_failed', () => {
      console.error('💥 재연결 실패! 서버 상태를 확인해주세요.');
    });

    return this.socket;
  }

  /**
   * 서버 연결 해제
   */
  disconnect(): void {
    if (this.socket) {
      console.log('🔌 서버 연결 해제');
      this.socket.disconnect();
      this.socket = null;
    }
  }

  /**
   * 현재 소켓 인스턴스 반환
   */
  getSocket(): Socket | null {
    return this.socket;
  }

  /**
   * 연결 상태 확인
   */
  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

// 전역에서 사용할 소켓 매니저 인스턴스
export const socketManager = SocketManager.getInstance();