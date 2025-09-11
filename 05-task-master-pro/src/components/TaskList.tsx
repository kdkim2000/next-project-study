// src/components/TaskList.tsx - 단순하고 명확한 할 일 목록

'use client';

import React, { useState } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { Task, Priority, Status } from '@/types';
import TaskCard from './TaskCard';
import TaskForm from './TaskForm';

interface TaskListProps {
  initialTasks: Task[];
}

export default function TaskList({ initialTasks }: TaskListProps) {
  // 🎯 학습 포인트: 기본적인 상태 관리
  const [tasks, setTasks] = useState(initialTasks);
  const [formOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<Status | 'ALL'>('ALL');

  // 🎯 학습 포인트: 간단한 필터링
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase()) ||
                         (task.description?.toLowerCase().includes(search.toLowerCase()) ?? false);
    const matchesStatus = statusFilter === 'ALL' || task.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // 🎯 폼 열기/닫기 처리
  const handleAddClick = () => {
    setEditingTask(undefined);
    setFormOpen(true);
  };

  const handleEditClick = (task: Task) => {
    setEditingTask(task);
    setFormOpen(true);
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setEditingTask(undefined);
  };

  // 🎯 성공 시 페이지 새로고침 (간단한 방법)
  const handleSuccess = () => {
    window.location.reload();
  };

  const handleDelete = () => {
    window.location.reload();
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* 헤더 */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Task Master Pro
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddClick}
        >
          할 일 추가
        </Button>
      </Box>

      {/* 🎯 학습 포인트: 간단한 검색 및 필터 */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            placeholder="할 일 검색..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="small"
            sx={{ flexGrow: 1 }}
          />
          
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>상태</InputLabel>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as Status | 'ALL')}
              label="상태"
            >
              <MenuItem value="ALL">전체</MenuItem>
              <MenuItem value={Status.TODO}>할 일</MenuItem>
              <MenuItem value={Status.IN_PROGRESS}>진행중</MenuItem>
              <MenuItem value={Status.COMPLETED}>완료</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Paper>

      {/* 통계 */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          총 {filteredTasks.length}개의 할 일
        </Typography>
      </Box>

      {/* 🎯 할 일 목록 */}
      {filteredTasks.length === 0 ? (
        <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
          {search || statusFilter !== 'ALL' ? '조건에 맞는 할 일이 없습니다.' : '할 일이 없습니다. 새로운 할 일을 추가해보세요!'}
        </Typography>
      ) : (
        filteredTasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={handleEditClick}
            onDelete={handleDelete}
          />
        ))
      )}

      {/* 🎯 할 일 추가/수정 폼 */}
      <TaskForm
        open={formOpen}
        onClose={handleFormClose}
        task={editingTask}
        onSuccess={handleSuccess}
      />
    </Container>
  );
}