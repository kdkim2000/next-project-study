// src/components/MessageInput.tsx
/**
 * 메시지를 입력하고 전송하는 간단한 컴포넌트
 */
'use client';

import { useState, useRef } from 'react';
import styles from './MessageInput.module.css';

interface MessageInputProps {
  onSendMessage: (content: string, type?: 'text' | 'image', fileUrl?: string) => void;
}

export default function MessageInput({ onSendMessage }: MessageInputProps) {
  const [message, setMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 메시지 전송
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  // 엔터 키 처리
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // 파일 업로드 (간단한 버전)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 이미지 파일만 허용
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드할 수 있습니다.');
      return;
    }

    // 파일 크기 제한 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('파일 크기가 너무 큽니다. (최대 5MB)');
      return;
    }

    setIsUploading(true);

    try {
      // 파일을 base64로 변환 (간단한 방법)
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        onSendMessage('이미지를 업로드했습니다.', 'image', result);
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('파일 업로드 오류:', error);
      alert('파일 업로드에 실패했습니다.');
      setIsUploading(false);
    }

    // input 값 초기화
    e.target.value = '';
  };

  return (
    <div className={styles.messageInput}>
      <form onSubmit={handleSubmit} className={styles.inputForm}>
        {/* 파일 업로드 버튼 */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className={styles.fileButton}
          title="이미지 업로드"
        >
          📷
        </button>

        {/* 메시지 입력 필드 */}
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="메시지를 입력하세요... (Enter: 전송)"
          className={styles.textInput}
          disabled={isUploading}
        />

        {/* 전송 버튼 */}
        <button
          type="submit"
          disabled={!message.trim() || isUploading}
          className={styles.sendButton}
        >
          {isUploading ? '⏳' : '➤'}
        </button>
      </form>

      {/* 숨겨진 파일 입력 */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        style={{ display: 'none' }}
      />

      {/* 업로드 상태 */}
      {isUploading && (
        <div className={styles.uploadingIndicator}>
          이미지 업로드 중...
        </div>
      )}
    </div>
  );
}