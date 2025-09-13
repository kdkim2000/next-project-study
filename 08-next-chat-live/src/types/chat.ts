// src/types/chat.ts
/**
 * 채팅 애플리케이션에서 사용되는 모든 타입 정의
 * TypeScript의 타입 안전성을 보장하기 위한 인터페이스들
 */

export interface User {
  id: string;
  name: string;
  avatar?: string;
  isOnline: boolean;
  lastSeen: Date;
}

export interface Message {
  id: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'image' | 'file';
  fileUrl?: string;
  fileName?: string;
  isEncrypted: boolean;
}

export interface TypingUser {
  userId: string;
  userName: string;
}

export interface ChatRoom {
  id: string;
  name: string;
  users: User[];
  messages: Message[];
  typingUsers: TypingUser[];
}

// Socket 이벤트 타입들
export interface ServerToClientEvents {
  message: (message: Message) => void;
  user_joined: (user: User) => void;
  user_left: (userId: string) => void;
  user_typing: (typingUser: TypingUser) => void;
  user_stop_typing: (userId: string) => void;
  users_list: (users: User[]) => void;
  notification: (message: string, type: 'info' | 'success' | 'error') => void;
}

export interface ClientToServerEvents {
  join: (user: User) => void;
  leave: (userId: string) => void;
  send_message: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  start_typing: (user: TypingUser) => void;
  stop_typing: (userId: string) => void;
}