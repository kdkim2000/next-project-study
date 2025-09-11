# 📚 Task Master Pro - React/Next.js 완전 학습 가이드

> **Project 05/10**: 할 일 관리 애플리케이션으로 배우는 React와 Next.js 핵심 개념

## 🎯 이 프로젝트로 배울 내용

이 프로젝트는 React와 Next.js 경험이 없는 개발자들을 위한 **실전 교육용 프로젝트**입니다. 
실제 업무에서 사용하는 핵심 개념들을 단계별로 학습할 수 있도록 설계되었습니다.

### 📋 학습 목표
- **복잡한 상태 관리**: React의 핵심인 상태(State) 관리 완전 마스터
- **CRUD 작업 구현**: 실제 애플리케이션의 기본이 되는 데이터 조작
- **Server Actions 활용**: Next.js 14+의 혁신적인 서버-클라이언트 통신

### 🛠 구현 기술
- **Server Actions (Next.js 14+)**: 서버와 클라이언트 간 데이터 통신의 새로운 패러다임
- **폼 유효성 검사 (Zod)**: 타입 안전한 데이터 검증
- **데이터 영속성 (SQLite/Prisma)**: 실제 데이터베이스와의 상호작용
- **필터링과 정렬**: 사용자 경험을 위한 데이터 조작

---

## 📚 Chapter 1: React 핵심 이론

### 1.1 React란 무엇인가?

React는 **사용자 인터페이스(UI)를 구축하기 위한 JavaScript 라이브러리**입니다. 
가장 중요한 특징은 **컴포넌트 기반 아키텍처**와 **상태(State) 관리**입니다.

#### 🔍 핵심 개념: 컴포넌트 (Component)

**컴포넌트는 재사용 가능한 UI 조각**입니다. 함수처럼 입력(props)을 받아 UI(JSX)를 반환합니다.

```typescript
// src/components/TaskCard.tsx에서 발췌
export default function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6">{task.title}</Typography>
        {/* UI 구성... */}
      </CardContent>
    </Card>
  );
}
```

**설명:**
- `TaskCard`는 하나의 할 일을 표시하는 컴포넌트
- `{ task, onEdit, onDelete }`는 **props**(부모에서 전달받은 데이터)
- `return` 안의 JSX가 실제 화면에 렌더링되는 UI

#### 🔍 핵심 개념: JSX (JavaScript XML)

JSX는 **JavaScript 안에서 HTML과 유사한 구문을 사용할 수 있게 해주는 문법**입니다.

```typescript
// 일반 JavaScript로 쓴다면
React.createElement('div', null, 
  React.createElement('h1', null, '할 일 목록')
);

// JSX로 쓰면
<div>
  <h1>할 일 목록</h1>
</div>
```

### 1.2 상태(State) 관리 - React의 핵심

**상태(State)는 컴포넌트가 기억해야 하는 데이터**입니다. 상태가 변경되면 React가 자동으로 화면을 다시 그립니다.

#### 📖 이론: useState 훅 (Hook)

```typescript
// src/components/TaskList.tsx에서 발췌
const [tasks, setTasks] = useState(initialTasks);
const [search, setSearch] = useState('');
const [statusFilter, setStatusFilter] = useState<Status | 'ALL'>('ALL');
```

**해부해보기:**
1. `useState(initialTasks)`: 초기값으로 상태를 생성
2. `tasks`: 현재 상태값 (읽기 전용)
3. `setTasks`: 상태를 변경하는 함수 (이것을 호출하면 화면이 다시 그려짐)

#### 🎯 실제 예시: 검색 기능

```typescript
// 검색어 입력 시 상태 업데이트
<TextField
  placeholder="할 일 검색..."
  value={search}  // 현재 상태값을 표시
  onChange={(e) => setSearch(e.target.value)}  // 입력 시 상태 업데이트
  size="small"
  sx={{ flexGrow: 1 }}
/>

// 검색어에 따른 필터링 (상태가 변경되면 자동으로 재계산됨)
const filteredTasks = tasks.filter(task => {
  const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase());
  return matchesSearch;
});
```

**동작 원리:**
1. 사용자가 검색창에 타이핑
2. `onChange` 이벤트 발생
3. `setSearch()` 호출로 `search` 상태 변경
4. React가 컴포넌트 다시 렌더링
5. 새로운 `search` 값으로 `filteredTasks` 재계산
6. 화면에 필터링된 결과 표시

---

## 📚 Chapter 2: Next.js App Router 이해하기

### 2.1 Next.js란?

Next.js는 **React 기반의 풀스택 웹 프레임워크**입니다. React만으로는 할 수 없는 다음 기능들을 제공합니다:

- **서버 사이드 렌더링 (SSR)**: 서버에서 HTML을 미리 생성
- **라우팅 시스템**: 폴더 구조로 URL 자동 생성
- **API 라우트**: 백엔드 API를 같은 프로젝트에서 구현

### 2.2 App Router vs Pages Router

Next.js 13+에서 도입된 **App Router**는 새로운 라우팅 시스템입니다.

#### 📁 폴더 구조가 곧 URL 구조

```
src/app/
├── page.tsx          → / (홈페이지)
├── about/
│   └── page.tsx      → /about
└── tasks/
    ├── page.tsx      → /tasks
    └── [id]/
        └── page.tsx  → /tasks/123
```

#### 🔍 우리 프로젝트의 구조

```typescript
// src/app/page.tsx - 메인 페이지 (서버 컴포넌트)
export default async function HomePage() {
  // 🎯 서버에서 데이터를 미리 가져옴 (SSR)
  const tasks = await getTasks();

  // 🎯 클라이언트 컴포넌트에 데이터 전달
  return <TaskList initialTasks={tasks} />;
}
```

**핵심 포인트:**
- `async function`: 서버에서 실행되는 비동기 함수
- `await getTasks()`: 데이터베이스에서 할 일 목록을 가져옴
- 사용자가 페이지에 접속하기 전에 서버에서 데이터를 준비

### 2.3 서버 컴포넌트 vs 클라이언트 컴포넌트

#### 📖 이론: 서버 컴포넌트 (Server Component)

- **서버에서 실행**되는 컴포넌트
- 데이터베이스 접근, API 호출 등 서버 작업 수행
- **상태(useState), 이벤트 핸들러 사용 불가**
- HTML이 서버에서 미리 생성되어 빠른 초기 로딩

```typescript
// src/app/page.tsx - 서버 컴포넌트 예시
export default async function HomePage() {
  const tasks = await getTasks(); // 🎯 서버에서 실행
  return <TaskList initialTasks={tasks} />;
}
```

#### 📖 이론: 클라이언트 컴포넌트 (Client Component)

- **브라우저에서 실행**되는 컴포넌트
- `'use client'` 지시어로 명시
- 상태 관리, 이벤트 처리, 사용자 상호작용 담당

```typescript
// src/components/TaskList.tsx - 클라이언트 컴포넌트 예시
'use client';  // 🎯 클라이언트에서 실행됨을 명시

export default function TaskList({ initialTasks }: TaskListProps) {
  const [tasks, setTasks] = useState(initialTasks);  // 🎯 상태 관리 가능
  const [search, setSearch] = useState('');
  
  // 🎯 사용자 이벤트 처리 가능
  const handleAddClick = () => {
    setFormOpen(true);
  };
}
```

---

## 📚 Chapter 3: Server Actions - 혁신적인 서버 통신

### 3.1 Server Actions란?

**Server Actions**는 Next.js 14+에서 도입된 혁신적인 기능으로, **클라이언트에서 서버 함수를 마치 일반 함수처럼 호출**할 수 있게 해줍니다.

#### 📖 기존 방식의 문제점

```javascript
// 기존 방식 (복잡함)
const response = await fetch('/api/tasks', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ title, description })
});
const result = await response.json();
```

#### 🚀 Server Actions의 혁신

```typescript
// src/lib/actions.ts - Server Action 정의
'use server';  // 🎯 서버에서 실행되는 함수임을 명시

export async function createTask(formData: FormData) {
  // 🎯 서버에서 직접 데이터베이스 접근
  const task = await prisma.task.create({ data: validatedData });
  return { success: true, task };
}

// src/components/TaskForm.tsx - 클라이언트에서 호출
async function handleSubmit(formData: FormData) {
  const result = await createTask(formData);  // 🎯 서버 함수를 직접 호출!
}
```

### 3.2 Server Actions의 동작 원리

#### 🔄 데이터 흐름 분석

```typescript
// src/components/TaskForm.tsx에서 폼 제출 과정
async function handleSubmit(formData: FormData) {
  setLoading(true);
  
  try {
    // 🎯 1단계: 클라이언트에서 Server Action 호출
    let result = await createTask(formData);
    
    // 🎯 4단계: 서버에서 응답 받음
    if (result.success) {
      onClose();
      onSuccess(); // 🎯 5단계: UI 업데이트
    }
  } finally {
    setLoading(false);
  }
}
```

```typescript
// src/lib/actions.ts에서 서버 처리 과정
export async function createTask(formData: FormData) {
  try {
    // 🎯 2단계: 서버에서 데이터 처리
    const validatedData = createTaskSchema.parse({...});
    
    // 🎯 3단계: 데이터베이스에 저장
    const task = await prisma.task.create({ data: validatedData });
    
    // 🎯 페이지 캐시 무효화 (자동 새로고침)
    revalidatePath('/');
    
    return { success: true, task };
  } catch (error) {
    return { success: false, error: '생성 실패' };
  }
}
```

#### 🎯 핵심 개념: revalidatePath

```typescript
revalidatePath('/');  // 🎯 "/" 경로의 캐시를 무효화
```

**설명:** Server Action이 데이터를 변경한 후, 해당 페이지의 캐시를 무효화하여 최신 데이터로 자동 새로고침됩니다.

### 3.3 폼과 Server Actions 연동

#### 📖 HTML Form의 action 속성 활용

```typescript
// src/components/TaskForm.tsx
<form action={handleSubmit}>  {/* 🎯 Server Action을 직접 연결 */}
  <TextField name="title" />
  <TextField name="description" />
  <Button type="submit">저장</Button>
</form>
```

#### 📖 FormData 객체 이해하기

```typescript
// Server Action에서 FormData 처리
export async function createTask(formData: FormData) {
  // 🎯 HTML 폼의 입력값들을 추출
  const data = {
    title: formData.get('title') as string,        // <input name="title">
    description: formData.get('description') as string, // <input name="description">
    priority: formData.get('priority') as string,  // <select name="priority">
  };
}
```

---

## 📚 Chapter 4: 데이터 유효성 검사 (Zod)

### 4.1 왜 유효성 검사가 필요한가?

사용자 입력 데이터는 **항상 의심해야 합니다**. 잘못된 데이터가 서버에 도달하면:
- 데이터베이스 오류
- 보안 취약점
- 애플리케이션 크래시

### 4.2 Zod 스키마 정의

```typescript
// src/lib/validations.ts
import { z } from 'zod';

// 🎯 할 일 생성을 위한 스키마 정의
export const createTaskSchema = z.object({
  title: z.string()
    .min(1, '제목을 입력해주세요')                    // 필수 입력
    .max(100, '제목은 100자 이하로 입력해주세요'),      // 최대 길이
    
  description: z.string()
    .max(500, '설명은 500자 이하로 입력해주세요')
    .nullable()                                   // null 허용
    .optional(),                                  // 선택적 필드
    
  priority: z.nativeEnum(Priority),              // enum 검증
  status: z.nativeEnum(Status),
  dueDate: z.date().nullable().optional(),       // 날짜 타입 검증
});
```

### 4.3 Server Action에서 검증 적용

```typescript
// src/lib/actions.ts
export async function createTask(formData: FormData) {
  try {
    const data = {
      title: formData.get('title') as string,
      description: (formData.get('description') as string) || null,
      priority: formData.get('priority') as string,
      dueDate: formData.get('dueDate') as string,
    };

    // 🎯 Zod로 유효성 검사 실행
    const validatedData = createTaskSchema.parse({
      ...data,
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
    });

    // 🎯 검증된 데이터로만 데이터베이스 작업 수행
    const task = await prisma.task.create({
      data: validatedData,
    });
    
  } catch (error) {
    // 🎯 Zod 검증 실패 시 에러 처리
    return { success: false, error: '입력 데이터가 올바르지 않습니다.' };
  }
}
```

#### 🔍 Zod의 장점

1. **타입 안전성**: TypeScript 타입을 자동 생성
2. **런타임 검증**: 실행 시점에 실제 데이터 검증
3. **명확한 에러 메시지**: 사용자 친화적인 오류 알림

```typescript
// 타입 자동 추론
export type CreateTaskInput = z.infer<typeof createTaskSchema>;
// 결과: { title: string; description?: string | null; ... }
```

---

## 📚 Chapter 5: 데이터베이스와 Prisma ORM

### 5.1 ORM이란?

**ORM(Object-Relational Mapping)**은 데이터베이스의 테이블을 객체로 다룰 수 있게 해주는 기술입니다.

#### 📖 SQL vs Prisma 비교

```sql
-- 기존 SQL 방식
INSERT INTO tasks (title, description, priority, status) 
VALUES ('할 일 제목', '설명', 'HIGH', 'TODO');

SELECT * FROM tasks WHERE status = 'TODO' ORDER BY createdAt DESC;
```

```typescript
// Prisma ORM 방식
const task = await prisma.task.create({
  data: {
    title: '할 일 제목',
    description: '설명',
    priority: 'HIGH',
    status: 'TODO'
  }
});

const tasks = await prisma.task.findMany({
  where: { status: 'TODO' },
  orderBy: { createdAt: 'desc' }
});
```

### 5.2 Prisma 스키마 이해하기

```prisma
// prisma/schema.prisma
model Task {
  id          String   @id @default(cuid())      // 기본 키 (자동 생성)
  title       String                             // 제목 (필수)
  description String?                            // 설명 (선택적, ? 표시)
  priority    Priority @default(MEDIUM)          // 우선순위 (기본값: MEDIUM)
  status      Status   @default(TODO)            // 상태 (기본값: TODO)
  dueDate     DateTime?                          // 마감일 (선택적)
  createdAt   DateTime @default(now())           // 생성일 (자동 설정)
  updatedAt   DateTime @updatedAt                // 수정일 (자동 업데이트)

  @@map("tasks")  // 실제 테이블명
}

enum Priority {
  LOW     // 낮음
  MEDIUM  // 보통  
  HIGH    // 높음
}
```

### 5.3 CRUD 작업 구현

#### 📖 Create (생성)

```typescript
// src/lib/actions.ts
export async function createTask(formData: FormData) {
  const validatedData = createTaskSchema.parse(data);
  
  // 🎯 새로운 할 일 생성
  const task = await prisma.task.create({
    data: validatedData,
  });
  
  return { success: true, task };
}
```

#### 📖 Read (조회)

```typescript
// 🎯 모든 할 일 조회 (최신순)
export async function getTasks() {
  const tasks = await prisma.task.findMany({
    orderBy: { createdAt: 'desc' }
  });
  return tasks;
}

// 🎯 특정 조건으로 조회 (예시)
const todoTasks = await prisma.task.findMany({
  where: { 
    status: 'TODO',
    dueDate: { gte: new Date() }  // 마감일이 오늘 이후
  }
});
```

#### 📖 Update (수정)

```typescript
export async function updateTask(formData: FormData) {
  const id = formData.get('id') as string;
  const validatedData = updateTaskSchema.parse(data);
  
  // 🎯 특정 ID의 할 일 수정
  const task = await prisma.task.update({
    where: { id },           // 조건: ID가 일치하는 레코드
    data: validatedData,     // 수정할 데이터
  });
  
  return { success: true, task };
}
```

#### 📖 Delete (삭제)

```typescript
export async function deleteTask(taskId: string) {
  // 🎯 특정 ID의 할 일 삭제
  await prisma.task.delete({
    where: { id: taskId },
  });
  
  return { success: true };
}
```

---

## 📚 Chapter 6: 실전 상태 관리 패턴

### 6.1 상태 끌어올리기 (Lifting State Up)

React에서 **여러 컴포넌트가 같은 데이터를 공유**해야 할 때, 상태를 **공통 부모 컴포넌트로 끌어올립니다**.

#### 🔍 우리 프로젝트의 상태 구조

```typescript
// src/components/TaskList.tsx - 부모 컴포넌트
export default function TaskList({ initialTasks }: TaskListProps) {
  // 🎯 상태들이 여기에 집중됨
  const [tasks, setTasks] = useState(initialTasks);
  const [formOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [search, setSearch] = useState('');
  
  // 🎯 자식 컴포넌트들에게 데이터와 함수를 전달
  return (
    <div>
      {/* 검색 기능에 상태 전달 */}
      <TextField 
        value={search} 
        onChange={(e) => setSearch(e.target.value)} 
      />
      
      {/* 할 일 카드들에 데이터와 이벤트 핸들러 전달 */}
      {filteredTasks.map(task => (
        <TaskCard
          key={task.id}
          task={task}                    // 🎯 데이터 전달
          onEdit={handleEditClick}       // 🎯 편집 함수 전달  
          onDelete={handleDelete}        // 🎯 삭제 함수 전달
        />
      ))}
      
      {/* 폼에 상태 전달 */}
      <TaskForm
        open={formOpen}                  // 🎯 폼 열림 상태 전달
        task={editingTask}               // 🎯 편집할 할 일 전달
        onClose={() => setFormOpen(false)}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
```

### 6.2 이벤트 핸들러 패턴

#### 📖 콜백 함수 (Callback Function) 이해하기

```typescript
// src/components/TaskCard.tsx - 자식 컴포넌트
interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;    // 🎯 콜백 함수 타입
  onDelete: () => void;
}

export default function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const handleDelete = async () => {
    if (!window.confirm('정말로 삭제하시겠습니까?')) return;
    
    const result = await deleteTask(task.id);
    if (result.success) {
      onDelete(); // 🎯 부모의 함수 호출 (콜백 실행)
    }
  };

  return (
    <Card>
      <IconButton onClick={() => onEdit(task)}>  {/* 🎯 편집 콜백 */}
        <EditIcon />
      </IconButton>
      <IconButton onClick={handleDelete}>        {/* 🎯 삭제 처리 */}
        <DeleteIcon />
      </IconButton>
    </Card>
  );
}
```

**데이터 흐름:**
1. 사용자가 편집 버튼 클릭
2. `TaskCard`에서 `onEdit(task)` 호출
3. `TaskList`의 `handleEditClick` 함수 실행
4. `editingTask` 상태 업데이트
5. `TaskForm`이 해당 할 일로 열림

### 6.3 필터링 및 검색 로직

```typescript
// src/components/TaskList.tsx
const filteredTasks = tasks.filter(task => {
  // 🎯 검색어 필터링
  const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase()) ||
                       (task.description?.toLowerCase().includes(search.toLowerCase()) ?? false);
  
  // 🎯 상태 필터링                     
  const matchesStatus = statusFilter === 'ALL' || task.status === statusFilter;
  
  // 🎯 둘 다 만족하는 할 일만 통과
  return matchesSearch && matchesStatus;
});
```

**실시간 필터링 동작 원리:**
1. `search` 상태가 변경됨 (사용자 입력)
2. React가 컴포넌트 리렌더링
3. `filteredTasks` 재계산 실행
4. 새로운 필터링 결과로 화면 업데이트

---

## 📚 Chapter 7: TypeScript와 타입 안전성

### 7.1 TypeScript의 필요성

JavaScript는 **동적 타이핑** 언어로, 런타임에 타입이 결정됩니다. 이는 유연함을 제공하지만 오류를 찾기 어렵게 만듭니다.

```javascript
// JavaScript - 런타임 에러 발생 가능
function createTask(data) {
  return data.title.toUpperCase(); // data.title이 없으면 에러!
}

createTask({}); // 💥 런타임 에러: Cannot read property 'title' of undefined
```

```typescript
// TypeScript - 컴파일 시점에 에러 발견
interface TaskData {
  title: string;
  description?: string;
}

function createTask(data: TaskData) {
  return data.title.toUpperCase(); // ✅ title이 항상 존재함을 보장
}

createTask({}); // 💥 컴파일 에러: Property 'title' is missing
```

### 7.2 프로젝트의 타입 정의

```typescript
// src/types/index.ts
import { Task as PrismaTask, Priority, Status } from '@prisma/client';

// 🎯 Prisma에서 자동 생성된 타입 활용
export type Task = PrismaTask;

// 🎯 폼 입력용 타입 (ID 제외)
export type CreateTaskInput = {
  title: string;
  description?: string | null;
  priority: Priority;
  status: Status;
  dueDate?: Date | null;
};
```

### 7.3 컴포넌트 Props 타입 정의

```typescript
// src/components/TaskCard.tsx
interface TaskCardProps {
  task: Task;                        // 필수: Task 객체
  onEdit: (task: Task) => void;      // 필수: 편집 콜백 함수
  onDelete: () => void;              // 필수: 삭제 콜백 함수
}

// 🎯 Props 타입을 명시하여 컴파일 시점에 오류 방지
export default function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  // task.invalidProperty // 💥 컴파일 에러: Property 'invalidProperty' does not exist
}
```

### 7.4 제네릭과 유니언 타입

```typescript
// src/components/TaskList.tsx
const [statusFilter, setStatusFilter] = useState<Status | 'ALL'>('ALL');
//                                              ^^^^^^^^^^^^^^^^
//                                              유니언 타입: Status 또는 'ALL'

// 🎯 제네릭을 사용한 상태 타입 지정
const [editingTask, setEditingTask] = useState<Task | undefined>();
//                                            ^^^^^^^^^^^^^^^^^^
//                                            Task 객체 또는 undefined
```

---

## 📚 Chapter 8: Material-UI 컴포넌트 시스템

### 8.1 Material-UI란?

**Material-UI (MUI)**는 Google의 Material Design을 React로 구현한 컴포넌트 라이브러리입니다. 
일관된 디자인과 접근성이 보장된 컴포넌트들을 제공합니다.

### 8.2 주요 컴포넌트 활용법

#### 📖 Card 컴포넌트

```typescript
// src/components/TaskCard.tsx
import { Card, CardContent, CardActions } from '@mui/material';

<Card sx={{ mb: 2 }}>  {/* sx prop으로 스타일링 */}
  <CardContent>
    {/* 카드 내용 */}
  </CardContent>
  <CardActions>
    {/* 액션 버튼들 */}
  </CardActions>
</Card>
```

#### 📖 Form 컴포넌트들

```typescript
// src/components/TaskForm.tsx
import { TextField, Select, MenuItem, FormControl } from '@mui/material';

{/* 텍스트 입력 */}
<TextField
  name="title"
  label="제목"
  required
  fullWidth
  disabled={loading}  // 로딩 중 비활성화
/>

{/* 드롭다운 선택 */}
<FormControl fullWidth>
  <Select name="priority" value={Priority.MEDIUM}>
    <MenuItem value={Priority.HIGH}>높음</MenuItem>
    <MenuItem value={Priority.MEDIUM}>보통</MenuItem>
    <MenuItem value={Priority.LOW}>낮음</MenuItem>
  </Select>
</FormControl>
```

#### 📖 sx prop을 활용한 스타일링

```typescript
// sx prop은 CSS-in-JS 방식으로 스타일을 적용
<Box sx={{ 
  display: 'flex',           // Flexbox 사용
  gap: 2,                    // 간격 (theme spacing * 2)
  alignItems: 'center',      // 세로 중앙 정렬
  mb: 3                      // margin-bottom: theme.spacing(3)
}}>
```

### 8.3 테마와 일관성

```typescript
// src/components/TaskCard.tsx - 색상 시스템
const priorityColor = {
  HIGH: '#f44336',    // 빨간색 (긴급)
  MEDIUM: '#ff9800',  // 주황색 (보통)
  LOW: '#4caf50',     // 초록색 (낮음)
}[task.priority];

<Chip
  label={priorityLabel}
  sx={{ backgroundColor: priorityColor, color: 'white' }}
/>
```

---

## 📚 Chapter 9: 실전 디버깅과 문제 해결

### 9.1 React DevTools 활용하기

브라우저 확장프로그램 "React Developer Tools"를 설치하면:

1. **Components 탭**: 컴포넌트 구조와 props 확인
2. **Profiler 탭**: 성능 분석
3. **상태 변경 추적**: useState 값 실시간 모니터링

### 9.2 일반적인 오류 패턴과 해결법

#### 🐛 오류 1: "Cannot read property of undefined"

```typescript
// ❌ 잘못된 코드
function TaskCard({ task }) {
  return <div>{task.title.toUpperCase()}</div>; // task가 undefined이면 에러
}

// ✅ 올바른 코드
function TaskCard({ task }: TaskCardProps) {
  if (!task) return null; // 방어적 프로그래밍
  return <div>{task.title.toUpperCase()}</div>;
}
```

#### 🐛 오류 2: "Hook을 조건문 안에서 사용"

```typescript
// ❌ 잘못된 코드
function TaskList({ initialTasks }) {
  if (initialTasks.length === 0) {
    return <div>할 일이 없습니다</div>;
  }
  const [tasks, setTasks] = useState(initialTasks); // 🚨 조건부 Hook 사용
}

// ✅ 올바른 코드  
function TaskList({ initialTasks }) {
  const [tasks, setTasks] = useState(initialTasks); // 🎯 항상 최상단에서 Hook 호출
  
  if (tasks.length === 0) {
    return <div>할 일이 없습니다</div>;
  }
}
```

#### 🐛 오류 3: "상태가 즉시 업데이트되지 않음"

```typescript
// ❌ 잘못된 이해
function handleClick() {
  setCount(count + 1);
  console.log(count); // 🚨 이전 값이 출력됨 (상태 업데이트는 비동기)
}

// ✅ 올바른 방법
function handleClick() {
  setCount(prevCount => {
    const newCount = prevCount + 1;
    console.log(newCount); // 🎯 새로운 값 출력
    return newCount;
  });
}
```

---

## 🚀 실습 과제 및 확장 아이디어

### 📝 초급 과제

1. **할 일 완료 토글 기능 추가**
   - 체크박스 클릭으로 TODO ↔ COMPLETED 전환

2. **우선순위별 색상 표시 개선**
   - 카드 전체에 우선순위 색상 테두리 추가

3. **마감일 알림 기능**
   - 마감일이 3일 이내인 할 일에 경고 표시

### 📝 중급 과제

1. **할 일 카테고리/태그 시스템**
   - 프로젝트별로 할 일을 분류하는 기능

2. **통계 대시보드**
   - 완료율, 우선순위별 분포 등을 차트로 표시

3. **사용자별 할 일 관리**
   - 간단한 로그인 기능과 사용자별 데이터 분리

### 📝 고급 과제

1. **실시간 알림 시스템**
   - 마감일 임박, 할 일 추가 등의 브라우저 알림

2. **오프라인 지원**
   - Service Worker를 활용한 PWA 구현

3. **팀 협업 기능**  
   - 할 일 공유, 댓글, 협업자 초대 기능

---

## 📖 추천 학습 자료

### 📚 공식 문서

- **React 공식 문서**: https://react.dev/
- **Next.js 공식 문서**: https://nextjs.org/docs
- **Prisma 가이드**: https://www.prisma.io/docs
- **Material-UI 문서**: https://mui.com/

### 🎥 추천 영상 강의

1. **React 기초 개념**: "React 18 완전 정복"
2. **Next.js App Router**: "Next.js 14 새로운 기능들"
3. **TypeScript 실전**: "실무에서 사용하는 TypeScript 패턴"

### 📱 다음 프로젝트 Preview

**Project 06**: **E-commerce 쇼핑몰** (상태 관리 심화)
- React Context API
- useReducer 패턴  
- 장바구니 시스템
- 결제 시스템 연동

**Project 07**: **실시간 채팅 앱** (WebSocket 통신)
- Socket.IO 활용
- 실시간 데이터 동기화
- 사용자 인증 시스템

---

## 🎉 마무리

이 프로젝트를 통해 다음과 같은 **실무 핵심 역량**을 획득하셨습니다:

✅ **React 컴포넌트 설계 능력**
✅ **상태 관리 패턴 이해**  
✅ **Next.js Server Actions 활용**
✅ **데이터베이스 연동 및 CRUD 구현**
✅ **타입스크립트 실전 활용**
✅ **사용자 경험 중심의 UI 구현**

**다음 단계:** 이제 더 복잡한 프로젝트에 도전하거나, 현재 프로젝트에 새로운 기능을 추가해보세요. 
React와 Next.js의 핵심 개념을 확실히 이해했다면, 어떤 웹 애플리케이션도 구현할 수 있습니다!

**Happy Coding! 🚀**