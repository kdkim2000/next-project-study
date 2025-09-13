// src/components/Chat.tsx (에러 처리 개선)
/**
 * 메인 채팅 컴포넌트 - 에러 처리 개선
 */
'use client';

import { useEffect, useState } from 'react';
import { socketManager } from '@/lib/socket';
import { generateId, generateRandomUserName } from '@/lib/utils';
import { User, Message } from '@/types/types';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import UserList from './UserList';
import styles from './Chat.module.css';

export default function Chat() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    // 브라우저 환경에서만 실행
    if (typeof window === 'undefined') return;

    let socket: any = null;

    try {
      // 소켓 연결
      socket = socketManager.connect();
      
      // 임시 사용자 생성
      const newUser: User = {
        id: generateId('user'),
        name: generateRandomUserName(),
        isOnline: true
      };
      setCurrentUser(newUser);

      // 소켓 이벤트 리스너 등록
      socket.on('connect', () => {
        console.log('서버에 연결됨');
        setIsConnected(true);
        setError('');
        socket.emit('join', newUser);
      });

      socket.on('disconnect', () => {
        console.log('서버 연결 끊김');
        setIsConnected(false);
      });

      socket.on('connect_error', (err: any) => {
        console.error('연결 오류:', err);
        setError('서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.');
        setIsConnected(false);
      });

      // 메시지 관련 이벤트
      socket.on('message_history', (messageHistory: Message[]) => {
        setMessages(messageHistory);
      });

      socket.on('new_message', (message: Message) => {
        setMessages(prev => [...prev, message]);
      });

      // 사용자 관련 이벤트
      socket.on('users_list', (usersList: User[]) => {
        setUsers(usersList);
      });

      socket.on('user_joined', (user: User) => {
        console.log(`${user.name}님이 입장했습니다.`);
      });

      socket.on('user_left', (userId: string) => {
        const user = users.find(u => u.id === userId);
        if (user) {
          console.log(`${user.name}님이 퇴장했습니다.`);
        }
      });

    } catch (err) {
      console.error('채팅 초기화 오류:', err);
      setError('채팅을 초기화하는 중 오류가 발생했습니다.');
    }

    // 컴포넌트 언마운트 시 정리
    return () => {
      try {
        if (socket) {
          socket.off('connect');
          socket.off('disconnect');
          socket.off('connect_error');
          socket.off('message_history');
          socket.off('new_message');
          socket.off('users_list');
          socket.off('user_joined');
          socket.off('user_left');
        }
        socketManager.disconnect();
      } catch (err) {
        console.error('정리 중 오류:', err);
      }
    };
  }, []); // 빈 의존성 배열

  // 메시지 전송 함수
  const sendMessage = (content: string, type: 'text' | 'image' = 'text', fileUrl?: string) => {
    if (!currentUser || !content.trim()) return;

    const messageData = {
      userId: currentUser.id,
      userName: currentUser.name,
      content: content.trim(),
      type,
      fileUrl
    };

    const socket = socketManager.getSocket();
    if (socket && socket.connected) {
      socket.emit('send_message', messageData);
    } else {
      setError('서버에 연결되지 않았습니다.');
    }
  };

  // 에러 상태일 때 표시
  if (error) {
    return (
      <div className={styles.errorContainer}>
        <h2>연결 오류</h2>
        <p>{error}</p>
        <div className={styles.errorHelp}>
          <h3>해결 방법:</h3>
          <ol>
            <li>터미널에서 <code>npm run server</code>가 실행 중인지 확인</li>
            <li>http://localhost:3001 에 접속하여 서버 상태 확인</li>
            <li>페이지를 새로고침 (F5)</li>
            <li>브라우저의 개발자 도구 콘솔 확인</li>
          </ol>
        </div>
        <button 
          onClick={() => window.location.reload()} 
          className={styles.retryButton}
        >
          다시 시도
        </button>
      </div>
    );
  }

  // 연결되지 않았을 때 표시
  if (!isConnected) {
    return (
      <div className={styles.loading}>
        <h2>서버에 연결 중...</h2>
        <p>Socket.io 서버 연결을 시도하고 있습니다.</p>
        <div className={styles.spinner}></div>
        <div className={styles.loadingHelp}>
          💡 서버가 실행되지 않았다면 터미널에서 <code>npm run server</code>를 실행하세요.
        </div>
      </div>
    );
  }

  return (
    <div className={styles.chatContainer}>
      <div className={styles.header}>
        <h1>Next Chat Live 💬</h1>
        <div className={styles.status}>
          <span className={styles.online}>● 온라인</span>
          {currentUser && <span>({currentUser.name})</span>}
        </div>
      </div>

      <div className={styles.chatBody}>
        <div className={styles.messageArea}>
          <MessageList messages={messages} currentUserId={currentUser?.id || ''} />
          <MessageInput onSendMessage={sendMessage} />
        </div>

        <div className={styles.sidebar}>
          <UserList users={users} currentUserId={currentUser?.id || ''} />
        </div>
      </div>
    </div>
  );
}