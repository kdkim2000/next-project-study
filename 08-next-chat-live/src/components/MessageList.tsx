// src/components/MessageList.tsx
/**
 * 메시지 목록을 보여주는 간단한 컴포넌트
 */
'use client';

import { useEffect, useRef } from 'react';
import { Message } from '@/types/types';
import styles from './MessageList.module.css';

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
}

export default function MessageList({ messages, currentUserId }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 새 메시지가 올 때마다 스크롤을 맨 아래로
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 시간 포맷 함수
  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={styles.messageList}>
      {messages.length === 0 ? (
        <div className={styles.emptyState}>
          <h3>채팅을 시작해보세요! 👋</h3>
          <p>첫 번째 메시지를 보내서 대화를 시작하세요.</p>
        </div>
      ) : (
        messages.map((message) => {
          const isOwnMessage = message.userId === currentUserId;
          
          return (
            <div
              key={message.id}
              className={`${styles.message} ${isOwnMessage ? styles.own : styles.other}`}
            >
              {/* 다른 사람 메시지일 때 이름 표시 */}
              {!isOwnMessage && (
                <div className={styles.userName}>{message.userName}</div>
              )}
              
              {/* 메시지 내용 */}
              <div className={styles.messageContent}>
                {message.type === 'text' ? (
                  <span>{message.content}</span>
                ) : (
                  <div className={styles.imageMessage}>
                    <img src={message.fileUrl} alt="업로드된 이미지" />
                    {message.content && <span>{message.content}</span>}
                  </div>
                )}
              </div>
              
              {/* 시간 표시 */}
              <div className={styles.messageTime}>
                {formatTime(message.timestamp)}
              </div>
            </div>
          );
        })
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}