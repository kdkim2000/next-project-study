// src/contexts/RealtimeContext.tsx - 실시간 동기화를 위한 React Context

'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Task } from '@/types';

// 🔥 학습 포인트: React Context API로 복잡한 상태 관리
interface RealtimeContextType {
  // 실시간으로 동기화되는 할 일 목록
  tasks: Task[];
  // 연결 상태
  isConnected: boolean;
  // 수동 새로고침 함수
  refreshTasks: () => Promise<void>;
  // 다른 사용자의 변경사항 알림
  lastUpdate: {
    type: 'create' | 'update' | 'delete' | null;
    taskId?: string;
    timestamp?: number;
  };
}

const RealtimeContext = createContext<RealtimeContextType | null>(null);

// 🔥 학습 포인트: 커스텀 훅으로 Context 사용 간소화
export const useRealtime = () => {
  const context = useContext(RealtimeContext);
  if (!context) {
    throw new Error('useRealtime must be used within a RealtimeProvider');
  }
  return context;
};

interface RealtimeProviderProps {
  children: React.ReactNode;
  initialTasks: Task[];
}

// 🔥 학습 포인트: Provider 컴포넌트로 전역 상태 관리
export function RealtimeProvider({ children, initialTasks }: RealtimeProviderProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<{
    type: 'create' | 'update' | 'delete' | null;
    taskId?: string;
    timestamp?: number;
  }>({ type: null });

  // 🔥 학습 포인트: Server-Sent Events (SSE)를 사용한 실시간 동기화
  // 실제 프로덕션에서는 WebSocket이나 Socket.IO를 사용할 수 있음
  useEffect(() => {
    // EventSource를 사용한 Server-Sent Events 연결
    // 현재는 시뮬레이션만 구현 (실제 SSE 엔드포인트 없음)
    
    // 연결 상태 시뮬레이션
    setIsConnected(true);
    
    // 주기적으로 변경사항 체크 (실제 앱에서는 SSE나 WebSocket 사용)
    const pollInterval = setInterval(async () => {
      try {
        // 실제로는 /api/tasks/updates 같은 엔드포인트에서 변경사항 확인
        const response = await fetch('/api/tasks', {
          cache: 'no-store'
        });
        
        if (response.ok) {
          const latestTasks = await response.json();
          
          // 간단한 변경 감지 (실제로는 더 정교한 로직 필요)
          if (JSON.stringify(latestTasks) !== JSON.stringify(tasks)) {
            setTasks(latestTasks);
            setLastUpdate({
              type: 'update',
              timestamp: Date.now()
            });
          }
        }
      } catch (error) {
        console.log('실시간 동기화 폴링 실패 (정상 - API 엔드포인트 없음):', error);
        setIsConnected(false);
      }
    }, 10000); // 10초마다 체크 (실제로는 실시간 연결 사용)

    // 정리
    return () => {
      clearInterval(pollInterval);
      setIsConnected(false);
    };
  }, [tasks]);

  // 수동 새로고침 함수
  const refreshTasks = async () => {
    try {
      const response = await fetch('/api/tasks', {
        cache: 'no-store'
      });
      
      if (response.ok) {
        const latestTasks = await response.json();
        setTasks(latestTasks);
        setLastUpdate({
          type: 'update',
          timestamp: Date.now()
        });
      }
    } catch (error) {
      console.error('수동 새로고침 실패:', error);
    }
  };

  // 🔥 학습 포인트: Context Provider로 상태와 함수들 전역 제공
  const contextValue: RealtimeContextType = {
    tasks,
    isConnected,
    refreshTasks,
    lastUpdate,
  };

  return (
    <RealtimeContext.Provider value={contextValue}>
      {children}
    </RealtimeContext.Provider>
  );
}

// 🔥 학습 포인트: 실시간 동기화 상태 표시 컴포넌트
export function RealtimeStatus() {
  const { isConnected, lastUpdate } = useRealtime();
  
  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: 8,
      fontSize: '0.875rem',
      color: isConnected ? '#4caf50' : '#f44336'
    }}>
      <div style={{
        width: 8,
        height: 8,
        borderRadius: '50%',
        backgroundColor: isConnected ? '#4caf50' : '#f44336'
      }} />
      {isConnected ? '실시간 연결됨' : '연결 끊김'}
      {lastUpdate.type && (
        <span style={{ color: '#666', marginLeft: 8 }}>
          마지막 업데이트: {new Date(lastUpdate.timestamp!).toLocaleTimeString()}
        </span>
      )}
    </div>
  );
}