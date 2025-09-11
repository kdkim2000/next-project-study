// prisma/seed.ts - 초기 데이터 삽입을 위한 시드 스크립트

import { PrismaClient, Priority, Status } from '@prisma/client';

const prisma = new PrismaClient();

// 샘플 할 일 데이터
const sampleTasks = [
  {
    title: 'Next.js 프로젝트 설정',
    description: 'TypeScript와 Material-UI를 사용하여 새로운 Next.js 프로젝트를 설정합니다.',
    priority: Priority.HIGH,
    status: Status.COMPLETED,
    dueDate: new Date('2024-12-01'),
    order: 0,
  },
  {
    title: '데이터베이스 스키마 설계',
    description: 'Prisma를 사용하여 할 일 관리를 위한 데이터베이스 스키마를 설계합니다.',
    priority: Priority.HIGH,
    status: Status.COMPLETED,
    dueDate: new Date('2024-12-02'),
    order: 1,
  },
  {
    title: 'Server Actions 구현',
    description: 'CRUD 작업을 위한 Next.js Server Actions를 구현합니다.',
    priority: Priority.MEDIUM,
    status: Status.IN_PROGRESS,
    dueDate: new Date('2024-12-15'),
    order: 2,
  },
  {
    title: '드래그 앤 드롭 기능 추가',
    description: 'dnd-kit를 사용하여 할 일의 순서를 변경할 수 있는 드래그 앤 드롭 기능을 구현합니다.',
    priority: Priority.MEDIUM,
    status: Status.IN_PROGRESS,
    dueDate: new Date('2024-12-20'),
    order: 3,
  },
  {
    title: '폼 유효성 검사 구현',
    description: 'Zod를 사용하여 할 일 생성/수정 폼의 유효성 검사를 구현합니다.',
    priority: Priority.LOW,
    status: Status.TODO,
    dueDate: new Date('2024-12-25'),
    order: 4,
  },
  {
    title: 'UI 컴포넌트 개선',
    description: 'Material-UI를 사용하여 더 나은 사용자 경험을 위한 UI를 개선합니다.',
    priority: Priority.MEDIUM,
    status: Status.TODO,
    dueDate: new Date('2024-12-30'),
    order: 5,
  },
  {
    title: '필터링 및 정렬 기능',
    description: '사용자가 할 일을 효율적으로 찾을 수 있도록 필터링과 정렬 기능을 추가합니다.',
    priority: Priority.LOW,
    status: Status.TODO,
    order: 6,
  },
  {
    title: '실시간 동기화',
    description: '여러 사용자 간의 실시간 데이터 동기화 기능을 구현합니다.',
    priority: Priority.HIGH,
    status: Status.TODO,
    dueDate: new Date('2025-01-15'),
    order: 7,
  },
  {
    title: '성능 최적화',
    description: 'Optimistic UI 업데이트와 캐싱을 통한 성능 최적화를 수행합니다.',
    priority: Priority.MEDIUM,
    status: Status.TODO,
    order: 8,
  },
  {
    title: '테스트 작성',
    description: '애플리케이션의 안정성을 위한 단위 테스트와 통합 테스트를 작성합니다.',
    priority: Priority.LOW,
    status: Status.TODO,
    dueDate: new Date('2025-02-01'),
    order: 9,
  },
];

async function main() {
  console.log('🌱 데이터베이스 시딩 시작...');

  // 기존 데이터 삭제 (개발 환경에서만)
  if (process.env.NODE_ENV !== 'production') {
    await prisma.task.deleteMany();
    console.log('📝 기존 할 일 데이터를 모두 삭제했습니다.');
  }

  // 샘플 데이터 삽입
  for (const taskData of sampleTasks) {
    const task = await prisma.task.create({
      data: taskData,
    });
    console.log(`✅ 할 일 생성됨: ${task.title}`);
  }

  console.log('🎉 데이터베이스 시딩이 완료되었습니다!');

  // 통계 출력
  const stats = await prisma.task.groupBy({
    by: ['status'],
    _count: {
      id: true,
    },
  });

  console.log('\n📊 현재 데이터베이스 통계:');
  stats.forEach(({ status, _count }) => {
    const statusLabels = {
      TODO: '할 일',
      IN_PROGRESS: '진행중',
      COMPLETED: '완료',
    };
    console.log(`   ${statusLabels[status]}: ${_count.id}개`);
  });

  const totalCount = await prisma.task.count();
  console.log(`   총 할 일: ${totalCount}개`);
}

// 시드 스크립트 실행
main()
  .catch((e) => {
    console.error('❌ 시딩 중 오류 발생:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });