// src/components/UserList.tsx
/**
 * 온라인 사용자 목록을 보여주는 간단한 컴포넌트
 */
'use client';

import { User } from '@/types/types';
import styles from './UserList.module.css';

interface UserListProps {
  users: User[];
  currentUserId: string;
}

export default function UserList({ users, currentUserId }: UserListProps) {
  return (
    <div className={styles.userList}>
      <div className={styles.header}>
        <h3>참여자 ({users.length})</h3>
      </div>

      <div className={styles.users}>
        {users.length === 0 ? (
          <div className={styles.emptyState}>
            아직 참여자가 없습니다.
          </div>
        ) : (
          users.map((user) => {
            const isCurrentUser = user.id === currentUserId;
            return (
              <div
                key={user.id}
                className={`${styles.user} ${isCurrentUser ? styles.currentUser : ''}`}
              >
                {/* 온라인 상태 표시 */}
                <div className={`${styles.status} ${user.isOnline ? styles.online : styles.offline}`}>
                  ●
                </div>

                {/* 사용자 이름 */}
                <div className={styles.userName}>
                  {user.name}
                  {isCurrentUser && <span className={styles.youLabel}> (나)</span>}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 간단한 도움말 */}
      <div className={styles.help}>
        <div className={styles.helpItem}>
          <span className={styles.online}>●</span> 온라인
        </div>
        <div className={styles.helpItem}>
          <span className={styles.offline}>●</span> 오프라인
        </div>
      </div>
    </div>
  );
}