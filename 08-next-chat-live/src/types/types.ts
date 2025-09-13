// src/types/types.ts
/**
 * 채팅 애플리케이션의 기본 타입들
 * 초보자가 이해하기 쉽도록 간단하게 정의
 */

// 사용자 정보
export interface User {
  id: string;
  name: string;
  isOnline: boolean;
}

// 메시지 정보
export interface Message {
  id: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'image';
  fileUrl?: string;
}

// 채팅방 정보
export interface ChatRoom {
  users: User[];
  messages: Message[];
}