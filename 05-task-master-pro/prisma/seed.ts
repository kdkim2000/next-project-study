// prisma/seed.ts - 단순한 시드 데이터

import { PrismaClient, Priority, Status } from '@prisma/client';

const prisma = new PrismaClient();

// 🎯 간단한 샘플 데이터
const sampleTasks = [
  {
    title: 'Next.js 학습하기',
    description: 'React와 Next.js의 기본 개념을 익힙니다.',
    priority: Priority.HIGH,
    status: Status.IN_PROGRESS,
    dueDate: new Date('2024-12-31'),
  },
  {
    title: 'Prisma 데이터베이스 설정',
    description: 'SQLite 데이터베이스와 Prisma ORM 설정을 완료합니다.',
    priority: Priority.MEDIUM,
    status: Status.COMPLETED,
  },
  {
    title: 'Material-UI 컴포넌트 학습',
    description: 'Material-UI의 기본 컴포넌트들을 사용해봅니다.',
    priority: Priority.LOW,
    status: Status.TODO,
    dueDate: new Date('2025-01-15'),
  },
  {
    title: 'Server Actions 구현',
    description: 'Next.js Server Actions를 사용한 CRUD 작업을 구현합니다.',
    priority: Priority.HIGH,
    status: Status.TODO,
  },
  {
    title: 'TypeScript 타입 정의',
    description: 'Zod와 함께 타입 안전한 애플리케이션을 만듭니다.',
    priority: Priority.MEDIUM,
    status: Status.TODO,
  },
];

async function main() {
  console.log('🌱 데이터베이스 시딩 시작...');

  // 기존 데이터 삭제
  await prisma.task.deleteMany();
  console.log('📝 기존 데이터를 삭제했습니다.');

  // 샘플 데이터 삽입
  for (const taskData of sampleTasks) {
    const task = await prisma.task.create({
      data: taskData,
    });
    console.log(`✅ 할 일 생성: ${task.title}`);
  }

  console.log('🎉 시딩이 완료되었습니다!');

  // 통계 출력
  const totalCount = await prisma.task.count();
  console.log(`📊 총 ${totalCount}개의 할 일이 생성되었습니다.`);
}

main()
  .catch((e) => {
    console.error('❌ 시딩 중 오류:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });