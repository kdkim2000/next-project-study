// src/app/page.tsx - 단순한 메인 페이지

import { getTasks } from '@/lib/actions';
import TaskList from '@/components/TaskList';

// 🎯 학습 포인트: 서버 컴포넌트에서 데이터 가져오기
export default async function HomePage() {
  // 서버에서 할 일 목록 가져오기
  const tasks = await getTasks();

  return <TaskList initialTasks={tasks} />;
}