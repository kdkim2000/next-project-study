// src/components/TaskCard.tsx - 단순하고 명확한 할 일 카드

'use client';

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Chip,
  IconButton,
  Box,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { Task } from '@/types';
import { deleteTask } from '@/lib/actions';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: () => void;
}

export default function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  // 🎯 학습 포인트: 간단한 로딩 상태
  const [deleting, setDeleting] = useState(false);

  // 🎯 학습 포인트: 간단한 삭제 처리
  const handleDelete = async () => {
    if (!window.confirm('정말로 삭제하시겠습니까?')) return;
    
    setDeleting(true);
    try {
      const result = await deleteTask(task.id);
      if (result.success) {
        onDelete(); // 부모에게 삭제 완료 알림
      } else {
        alert(result.error);
      }
    } catch (error) {
      alert('삭제 중 오류가 발생했습니다.');
    } finally {
      setDeleting(false);
    }
  };

  // 🎯 우선순위별 색상
  const priorityColor = {
    HIGH: '#f44336',
    MEDIUM: '#ff9800', 
    LOW: '#4caf50',
  }[task.priority];

  // 🎯 상태별 색상
  const statusColor = {
    TODO: '#2196f3',
    IN_PROGRESS: '#ff9800',
    COMPLETED: '#4caf50',
  }[task.status];

  // 🎯 상태 라벨
  const statusLabel = {
    TODO: '할 일',
    IN_PROGRESS: '진행중',
    COMPLETED: '완료',
  }[task.status];

  // 🎯 우선순위 라벨
  const priorityLabel = {
    HIGH: '높음',
    MEDIUM: '보통',
    LOW: '낮음',
  }[task.priority];

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        {/* 제목 */}
        <Typography variant="h6" component="h3" gutterBottom>
          {task.title}
        </Typography>

        {/* 설명 */}
        {task.description && (
          <Typography variant="body2" color="text.secondary" paragraph>
            {task.description}
          </Typography>
        )}

        {/* 우선순위와 상태 칩 */}
        <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
          <Chip
            label={priorityLabel}
            size="small"
            sx={{ backgroundColor: priorityColor, color: 'white' }}
          />
          <Chip
            label={statusLabel}
            size="small"
            sx={{ backgroundColor: statusColor, color: 'white' }}
          />
        </Box>

        {/* 마감일 */}
        {task.dueDate && (
          <Typography variant="caption" color="text.secondary">
            마감일: {new Date(task.dueDate).toLocaleDateString('ko-KR')}
          </Typography>
        )}
      </CardContent>

      <CardActions>
        <IconButton 
          onClick={() => onEdit(task)}
          disabled={deleting}
          color="primary"
          size="small"
        >
          <EditIcon />
        </IconButton>
        
        <IconButton 
          onClick={handleDelete}
          disabled={deleting}
          color="error" 
          size="small"
        >
          <DeleteIcon />
        </IconButton>
        
        {deleting && (
          <Typography variant="caption" sx={{ ml: 1 }}>
            삭제 중...
          </Typography>
        )}
      </CardActions>
    </Card>
  );
}