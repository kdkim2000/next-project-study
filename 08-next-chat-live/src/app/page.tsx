// src/app/page.tsx
/**
 * 간단한 홈페이지
 * 채팅 애플리케이션 소개 및 입장 버튼
 */
'use client';

import Link from 'next/link';
import styles from './page.module.css';

export default function HomePage() {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>
          Next Chat Live 💬
        </h1>
        
        <p className={styles.description}>
          React와 Next.js로 만든 간단한 실시간 채팅 애플리케이션입니다.
          <br />
          Socket.io를 사용해서 실시간으로 메시지를 주고받을 수 있어요!
        </p>

        <div className={styles.features}>
          <div className={styles.feature}>
            <h3>✨ 주요 기능</h3>
            <ul>
              <li>실시간 메시지 전송</li>
              <li>온라인 사용자 목록</li>
              <li>간단한 이미지 업로드</li>
              <li>사용자 입/퇴장 알림</li>
            </ul>
          </div>
          
          <div className={styles.feature}>
            <h3>🛠️ 사용 기술</h3>
            <ul>
              <li>React 19</li>
              <li>Next.js 15</li>
              <li>Socket.io</li>
              <li>TypeScript</li>
            </ul>
          </div>
        </div>

        <Link href="/chat" className={styles.chatButton}>
          채팅 시작하기 🚀
        </Link>

        <div className={styles.tip}>
          💡 팁: 여러 브라우저 탭을 열어서 실시간 채팅을 테스트해보세요!
        </div>
      </main>
    </div>
  );
}