// src/contexts/TaskContext.tsx - 복잡한 상태 관리를 위한 Task Context

'use client';

import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { Task, Priority, Status, FilterOptions, SortOptions } from '@/types';

// 🔥 학습 포인트: useReducer를 활용한 복잡한 상태 관리

// 액션 타입 정의
type TaskAction = 
  | { type: 'SET_TASKS'; payload: Task[] }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_FILTERS'; payload: FilterOptions }
  | { type: 'SET_SORT'; payload: SortOptions }
  | { type: 'OPTIMISTIC_UPDATE'; payload: { taskId: string; changes: Partial<Task> } }
  | { type: 'ROLLBACK_OPTIMISTIC'; payload: string };

// 상태 타입 정의
interface TaskState {
  // 데이터 상태
  tasks: Task[];
  loading: boolean;
  error: string | null;
  
  // UI 상태
  filters: FilterOptions;
  sort: SortOptions;
  
  // Optimistic UI를 위한 상태
  optimisticUpdates: Map<string, Partial<Task>>;
}

// 초기 상태
const initialState: TaskState = {
  tasks: [],
  loading: false,
  error: null,
  filters: {
    status: 'ALL',
    priority: 'ALL',
    search: undefined,
  },
  sort: {
    field: 'createdAt',
    direction: 'desc',
  },
  optimisticUpdates: new Map(),
};

// 🔥 학습 포인트: Reducer 함수로 상태 변경 로직 집중화
function taskReducer(state: TaskState, action: TaskAction): TaskState {
  switch (action.type) {
    case 'SET_TASKS':
      return {
        ...state,
        tasks: action.payload,
        loading: false,
        error: null,
      };
      
    case 'ADD_TASK':
      return {
        ...state,
        tasks: [...state.tasks, action.payload],
        error: null,
      };
      
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id ? action.payload : task
        ),
        error: null,
      };
      
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload),
        error: null,
      };
      
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
      
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
      
    case 'SET_FILTERS':
      return {
        ...state,
        filters: { ...state.filters, ...action.payload },
      };
      
    case 'SET_SORT':
      return {
        ...state,
        sort: action.payload,
      };
      
    case 'OPTIMISTIC_UPDATE':
      // 🔥 학습 포인트: Optimistic UI 상태 관리
      const newOptimisticUpdates = new Map(state.optimisticUpdates);
      newOptimisticUpdates.set(action.payload.taskId, action.payload.changes);
      
      return {
        ...state,
        optimisticUpdates: newOptimisticUpdates,
        // 즉시 UI에 반영
        tasks: state.tasks.map(task =>
          task.id === action.payload.taskId
            ? { ...task, ...action.payload.changes }
            : task
        ),
      };
      
    case 'ROLLBACK_OPTIMISTIC':
      // 🔥 학습 포인트: 실패 시 Optimistic 변경사항 롤백
      const rollbackOptimisticUpdates = new Map(state.optimisticUpdates);
      rollbackOptimisticUpdates.delete(action.payload);
      
      return {
        ...state,
        optimisticUpdates: rollbackOptimisticUpdates,
        // 원래 상태로 복원 필요 (실제로는 서버에서 최신 데이터 다시 가져와야 함)
      };
      
    default:
      return state;
  }
}

// Context 인터페이스
interface TaskContextType {
  // 상태
  state: TaskState;
  
  // 액션 디스패처들
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  updateTask: (task: Task) => void;
  deleteTask: (taskId: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setFilters: (filters: Partial<FilterOptions>) => void;
  setSort: (sort: SortOptions) => void;
  
  // Optimistic UI 함수들
  optimisticUpdate: (taskId: string, changes: Partial<Task>) => void;
  rollbackOptimistic: (taskId: string) => void;
  
  // 계산된 값들 (메모이제이션됨)
  filteredTasks: Task[];
  taskStats: {
    total: number;
    todo: number;
    inProgress: number;
    completed: number;
  };
}

const TaskContext = createContext<TaskContextType | null>(null);

// 🔥 학습 포인트: 커스텀 훅으로 Context 사용
export const useTask = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
};

interface TaskProviderProps {
  children: React.ReactNode;
  initialTasks?: Task[];
}

// 🔥 학습 포인트: Provider 컴포넌트
export function TaskProvider({ children, initialTasks = [] }: TaskProviderProps) {
  const [state, dispatch] = useReducer(taskReducer, {
    ...initialState,
    tasks: initialTasks,
  });

  // 🔥 학습 포인트: useCallback으로 함수 메모이제이션
  const setTasks = useCallback((tasks: Task[]) => {
    dispatch({ type: 'SET_TASKS', payload: tasks });
  }, []);

  const addTask = useCallback((task: Task) => {
    dispatch({ type: 'ADD_TASK', payload: task });
  }, []);

  const updateTask = useCallback((task: Task) => {
    dispatch({ type: 'UPDATE_TASK', payload: task });
  }, []);

  const deleteTask = useCallback((taskId: string) => {
    dispatch({ type: 'DELETE_TASK', payload: taskId });
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  }, []);

  const setError = useCallback((error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  }, []);

  const setFilters = useCallback((filters: Partial<FilterOptions>) => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
  }, []);

  const setSort = useCallback((sort: SortOptions) => {
    dispatch({ type: 'SET_SORT', payload: sort });
  }, []);

  const optimisticUpdate = useCallback((taskId: string, changes: Partial<Task>) => {
    dispatch({ type: 'OPTIMISTIC_UPDATE', payload: { taskId, changes } });
  }, []);

  const rollbackOptimistic = useCallback((taskId: string) => {
    dispatch({ type: 'ROLLBACK_OPTIMISTIC', payload: taskId });
  }, []);

  // 🔥 학습 포인트: useMemo를 활용한 계산된 값 최적화
  const filteredTasks = React.useMemo(() => {
    let filtered = state.tasks.filter(task => {
      // 상태 필터링
      if (state.filters.status && state.filters.status !== 'ALL' && task.status !== state.filters.status) {
        return false;
      }
      
      // 우선순위 필터링
      if (state.filters.priority && state.filters.priority !== 'ALL' && task.priority !== state.filters.priority) {
        return false;
      }
      
      // 검색어 필터링
      if (state.filters.search) {
        const searchLower = state.filters.search.toLowerCase();
        if (!task.title.toLowerCase().includes(searchLower) &&
            !task.description?.toLowerCase().includes(searchLower)) {
          return false;
        }
      }
      
      return true;
    });

    // 정렬 적용
    filtered.sort((a, b) => {
      let aValue: any;
      let bValue: any;
      
      switch (state.sort.field) {
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'priority':
          const priorityOrder = { HIGH: 3, MEDIUM: 2, LOW: 1 };
          aValue = priorityOrder[a.priority];
          bValue = priorityOrder[b.priority];
          break;
        case 'dueDate':
          aValue = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
          bValue = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
          break;
        case 'createdAt':
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        case 'updatedAt':
          aValue = new Date(a.updatedAt).getTime();
          bValue = new Date(b.updatedAt).getTime();
          break;
        default:
          aValue = a.order;
          bValue = b.order;
      }
      
      const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      return state.sort.direction === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [state.tasks, state.filters, state.sort]);

  const taskStats = React.useMemo(() => {
    const stats = {
      total: state.tasks.length,
      todo: 0,
      inProgress: 0,
      completed: 0,
    };

    state.tasks.forEach(task => {
      switch (task.status) {
        case 'TODO':
          stats.todo++;
          break;
        case 'IN_PROGRESS':
          stats.inProgress++;
          break;
        case 'COMPLETED':
          stats.completed++;
          break;
      }
    });

    return stats;
  }, [state.tasks]);

  const contextValue: TaskContextType = {
    state,
    setTasks,
    addTask,
    updateTask,
    deleteTask,
    setLoading,
    setError,
    setFilters,
    setSort,
    optimisticUpdate,
    rollbackOptimistic,
    filteredTasks,
    taskStats,
  };

  return (
    <TaskContext.Provider value={contextValue}>
      {children}
    </TaskContext.Provider>
  );
}