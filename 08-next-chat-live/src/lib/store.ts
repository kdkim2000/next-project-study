// src/lib/store.ts (React import 위치 수정)
/**
 * 간단한 전역 상태 관리 - React import 수정
 */
'use client';

import React from 'react'; // React import를 최상단으로 이동
import { User, Message } from '@/types/types';

// 전역 상태 타입 정의
interface ChatState {
  currentUser: User | null;
  users: User[];
  messages: Message[];
  isConnected: boolean;
  isTyping: boolean;
}

// 초기 상태
const initialState: ChatState = {
  currentUser: null,
  users: [],
  messages: [],
  isConnected: false,
  isTyping: false,
};

// 상태 변경 리스너들
type StateListener = (state: ChatState) => void;
const listeners: Set<StateListener> = new Set();

// 현재 상태
let currentState: ChatState = { ...initialState };

/**
 * 간단한 스토어 클래스
 */
class SimpleStore {
  getState(): ChatState {
    return { ...currentState };
  }

  setState(newState: Partial<ChatState>): void {
    currentState = { ...currentState, ...newState };
    
    console.log('📊 상태 업데이트:', newState);
    
    listeners.forEach(listener => {
      try {
        listener(currentState);
      } catch (error) {
        console.error('상태 리스너 오류:', error);
      }
    });
  }

  subscribe(listener: StateListener): () => void {
    listeners.add(listener);
    
    return () => {
      listeners.delete(listener);
    };
  }

  setCurrentUser(user: User | null): void {
    this.setState({ currentUser: user });
  }

  setUsers(users: User[]): void {
    this.setState({ users });
  }

  addUser(user: User): void {
    const users = currentState.users.filter(u => u.id !== user.id);
    users.push(user);
    this.setState({ users });
  }

  removeUser(userId: string): void {
    const users = currentState.users.filter(u => u.id !== userId);
    this.setState({ users });
  }

  setMessages(messages: Message[]): void {
    this.setState({ messages });
  }

  addMessage(message: Message): void {
    const messages = [...currentState.messages, message];
    this.setState({ messages });
  }

  setConnected(isConnected: boolean): void {
    this.setState({ isConnected });
  }

  setTyping(isTyping: boolean): void {
    this.setState({ isTyping });
  }

  reset(): void {
    currentState = { ...initialState };
    listeners.forEach(listener => listener(currentState));
  }
}

// 전역 스토어 인스턴스
export const chatStore = new SimpleStore();

/**
 * React Hook: 상태를 구독하고 컴포넌트에서 사용
 */
export const useChatStore = () => {
  const [state, setState] = React.useState(chatStore.getState());

  React.useEffect(() => {
    const unsubscribe = chatStore.subscribe(setState);
    return unsubscribe;
  }, []);

  return {
    ...state,
    setCurrentUser: chatStore.setCurrentUser.bind(chatStore),
    setUsers: chatStore.setUsers.bind(chatStore),
    addUser: chatStore.addUser.bind(chatStore),
    removeUser: chatStore.removeUser.bind(chatStore),
    setMessages: chatStore.setMessages.bind(chatStore),
    addMessage: chatStore.addMessage.bind(chatStore),
    setConnected: chatStore.setConnected.bind(chatStore),
    setTyping: chatStore.setTyping.bind(chatStore),
    reset: chatStore.reset.bind(chatStore),
  };
};

// 편의 함수들
export const getCurrentUser = () => chatStore.getState().currentUser;
export const getUsers = () => chatStore.getState().users;
export const getMessages = () => chatStore.getState().messages;
export const isConnected = () => chatStore.getState().isConnected;