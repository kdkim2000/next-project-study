// src/components/TaskList.tsx - 드래그 앤 드롭이 가능한 할 일 목록 컴포넌트

'use client';

import React, { useState, useMemo, useOptimistic } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Chip,
  Button,
  Alert,
  Skeleton,
} from '@mui/material';
import {
  Add as AddIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { Task, Status } from '@/types';
import { FilterOptions, SortOptions } from '@/types';
import TaskCard from './TaskCard';
import TaskForm from './TaskForm';
import FilterAndSort from './FilterAndSort';
import { reorderTasks } from '@/lib/actions';
import { 
  getStatusLabel, 
  statusColors, 
  matchesSearch,
} from '@/lib/utils';

interface TaskListProps {
  tasks: Task[]; // 할 일 목록
  onRefresh?: () => void; // 새로고침 함수
  loading?: boolean; // 로딩 상태
}

export default function TaskList({ tasks, onRefresh, loading = false }: TaskListProps) {
  // 폼 다이얼로그 상태
  const [formOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  
  // 필터 및 정렬 상태
  const [filters, setFilters] = useState<FilterOptions>({
    status: 'ALL',
    priority: 'ALL',
    search: undefined,
  });
  
  const [sort, setSort] = useState<SortOptions>({
    field: 'createdAt',
    direction: 'desc',
  });

  // Optimistic UI를 위한 상태 (드래그 앤 드롭 시 즉시 UI 업데이트)
  const [optimisticTasks, setOptimisticTasks] = useOptimistic(
    tasks,
    (currentTasks: Task[], { taskId, newOrder, newStatus }: {
      taskId: string;
      newOrder: number;
      newStatus?: Status;
    }) => {
      const taskIndex = currentTasks.findIndex(t => t.id === taskId);
      if (taskIndex === -1) return currentTasks;
      
      const updatedTasks = [...currentTasks];
      const task = { ...updatedTasks[taskIndex] };
      
      // 상태 변경 (있는 경우)
      if (newStatus) {
        task.status = newStatus;
      }
      
      // 순서 변경
      task.order = newOrder;
      updatedTasks[taskIndex] = task;
      
      return updatedTasks;
    }
  );

  // 드래그 앤 드롭 센서 설정
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px 이동해야 드래그 시작
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // 필터링 및 정렬된 할 일 목록 계산
  const filteredAndSortedTasks = useMemo(() => {
    let filtered = optimisticTasks.filter(task => {
      // 상태 필터링
      if (filters.status && filters.status !== 'ALL' && task.status !== filters.status) {
        return false;
      }
      
      // 우선순위 필터링
      if (filters.priority && filters.priority !== 'ALL' && task.priority !== filters.priority) {
        return false;
      }
      
      // 검색어 필터링
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
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
      
      switch (sort.field) {
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'priority':
          // 우선순위: HIGH(3) > MEDIUM(2) > LOW(1)
          const priorityOrder = { HIGH: 3, MEDIUM: 2, LOW: 1 };
          aValue = priorityOrder[a.priority];
          bValue = priorityOrder[b.priority];
          break;
        case 'dueDate':
          // 마감일이 없는 경우 가장 뒤로
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
      return sort.direction === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [optimisticTasks, filters, sort]);

  // 상태별로 할 일 그룹화
  const tasksByStatus = useMemo(() => {
    const grouped = {
      TODO: [] as Task[],
      IN_PROGRESS: [] as Task[],
      COMPLETED: [] as Task[],
    };

    filteredAndSortedTasks.forEach(task => {
      grouped[task.status].push(task);
    });

    return grouped;
  }, [filteredAndSortedTasks]);

  // 드래그 앤 드롭 완료 처리
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) return;
    
    const activeId = active.id as string;
    const overId = over.id as string;
    
    if (activeId === overId) return;

    // 드롭 위치가 상태 영역인지 확인
    const newStatus = Object.values(Status).find(status => overId.startsWith(status));
    
    if (newStatus) {
      // 상태 변경
      const newOrder = tasksByStatus[newStatus].length;
      
      // Optimistic UI 업데이트
      setOptimisticTasks({
        taskId: activeId,
        newOrder,
        newStatus,
      });
      
      // 서버에 변경사항 전송
      await reorderTasks(activeId, newOrder, newStatus);
    } else {
      // 같은 상태 내에서 순서 변경
      const activeTask = optimisticTasks.find(t => t.id === activeId);
      const overTask = optimisticTasks.find(t => t.id === overId);
      
      if (activeTask && overTask && activeTask.status === overTask.status) {
        const statusTasks = tasksByStatus[activeTask.status];
        const oldIndex = statusTasks.findIndex(t => t.id === activeId);
        const newIndex = statusTasks.findIndex(t => t.id === overId);
        
        // Optimistic UI 업데이트
        setOptimisticTasks({
          taskId: activeId,
          newOrder: newIndex,
        });
        
        // 서버에 변경사항 전송
        await reorderTasks(activeId, newIndex);
      }
    }
    
    // 변경사항 반영을 위해 새로고침
    onRefresh?.();
  };

  // 새 할 일 추가 버튼 클릭
  const handleAddTask = () => {
    setEditingTask(undefined);
    setFormOpen(true);
  };

  // 할 일 수정 버튼 클릭
  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setFormOpen(true);
  };

  // 폼 닫기
  const handleFormClose = () => {
    setFormOpen(false);
    setEditingTask(undefined);
  };

  // 폼 제출 성공
  const handleFormSuccess = () => {
    onRefresh?.(); // 목록 새로고침
  };

  return (
    <Box>
      {/* 상단 액션바 */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" fontWeight={600}>
          Task Master Pro
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          {/* 새로고침 버튼 */}
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={onRefresh}
            disabled={loading}
          >
            새로고침
          </Button>
          
          {/* 새 할 일 추가 버튼 */}
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddTask}
          >
            할 일 추가
          </Button>
        </Box>
      </Box>

      {/* 필터 및 정렬 */}
      <FilterAndSort
        filters={filters}
        sort={sort}
        onFiltersChange={setFilters}
        onSortChange={setSort}
        totalCount={tasks.length}
        filteredCount={filteredAndSortedTasks.length}
      />

      {/* 로딩 상태 */}
      {loading && (
        <Box sx={{ mb: 3 }}>
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} variant="rectangular" height={120} sx={{ mb: 2, borderRadius: 2 }} />
          ))}
        </Box>
      )}

      {/* 할 일이 없는 경우 */}
      {!loading && filteredAndSortedTasks.length === 0 && (
        <Alert severity="info" sx={{ mb: 3 }}>
          {tasks.length === 0 
            ? '아직 할 일이 없습니다. 새로운 할 일을 추가해보세요!' 
            : '현재 필터 조건에 맞는 할 일이 없습니다.'
          }
        </Alert>
      )}

      {/* 드래그 앤 드롭 컨텍스트 */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        {/* 상태별 칼럼 레이아웃 */}
        <Grid container spacing={3}>
          {Object.entries(tasksByStatus).map(([status, statusTasks]) => (
            <Grid item xs={12} md={4} key={status}>
              <Paper
                sx={{
                  p: 2,
                  minHeight: 400,
                  backgroundColor: 'background.default',
                  border: '2px dashed',
                  borderColor: 'divider',
                }}
                id={status} // 드롭 영역 식별용
              >
                {/* 상태 헤더 */}
                <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography variant="h6" component="h2">
                    {getStatusLabel(status as Status)}
                  </Typography>
                  <Chip
                    label={statusTasks.length}
                    size="small"
                    sx={{
                      backgroundColor: statusColors[status as Status],
                      color: 'white',
                      fontWeight: 600,
                    }}
                  />
                </Box>

                {/* 할 일 카드 목록 */}
                <SortableContext items={statusTasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {statusTasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onEdit={handleEditTask}
                        onDelete={() => onRefresh?.()}
                      />
                    ))}
                  </Box>
                </SortableContext>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </DndContext>

      {/* 할 일 추가/수정 폼 */}
      <TaskForm
        open={formOpen}
        onClose={handleFormClose}
        task={editingTask}
        onSuccess={handleFormSuccess}
      />
    </Box>
  );
}