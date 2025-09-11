// src/components/TaskForm.tsx - 단순하고 명확한 할 일 폼

'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
} from '@mui/material';
import { Priority, Status } from '@prisma/client';
import { createTask, updateTask } from '@/lib/actions';
import { Task } from '@/types';

interface TaskFormProps {
  open: boolean;
  onClose: () => void;
  task?: Task; // 수정할 때만 전달
  onSuccess: () => void;
}

export default function TaskForm({ open, onClose, task, onSuccess }: TaskFormProps) {
  // 🎯 학습 포인트: 간단한 로딩 상태 관리
  const [loading, setLoading] = useState(false);
  
  // 수정 모드인지 확인
  const isEditing = !!task;

  // 🎯 학습 포인트: 폼 제출 처리 (Server Action 사용)
  async function handleSubmit(formData: FormData) {
    setLoading(true);
    
    try {
      let result;
      
      if (isEditing) {
        // 수정 시 ID 추가
        formData.append('id', task.id);
        result = await updateTask(formData);
      } else {
        // 생성
        result = await createTask(formData);
      }

      if (result.success) {
        onClose();
        onSuccess();
      } else {
        alert(result.error); // 간단한 에러 표시
      }
    } catch (error) {
      alert('오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form action={handleSubmit}>
        <DialogTitle>
          {isEditing ? '할 일 수정' : '새 할 일 추가'}
        </DialogTitle>
        
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            {/* 제목 */}
            <TextField
              name="title"
              label="제목"
              defaultValue={task?.title || ''}
              required
              fullWidth
              disabled={loading}
            />

            {/* 설명 */}
            <TextField
              name="description"
              label="설명 (선택사항)"
              defaultValue={task?.description || ''}
              multiline
              rows={3}
              fullWidth
              disabled={loading}
            />

            {/* 우선순위 */}
            <FormControl fullWidth disabled={loading}>
              <InputLabel>우선순위</InputLabel>
              <Select
                name="priority"
                defaultValue={task?.priority || Priority.MEDIUM}
                label="우선순위"
              >
                <MenuItem value={Priority.HIGH}>높음</MenuItem>
                <MenuItem value={Priority.MEDIUM}>보통</MenuItem>
                <MenuItem value={Priority.LOW}>낮음</MenuItem>
              </Select>
            </FormControl>

            {/* 상태 */}
            <FormControl fullWidth disabled={loading}>
              <InputLabel>상태</InputLabel>
              <Select
                name="status"
                defaultValue={task?.status || Status.TODO}
                label="상태"
              >
                <MenuItem value={Status.TODO}>할 일</MenuItem>
                <MenuItem value={Status.IN_PROGRESS}>진행중</MenuItem>
                <MenuItem value={Status.COMPLETED}>완료</MenuItem>
              </Select>
            </FormControl>

            {/* 마감일 */}
            <TextField
              name="dueDate"
              label="마감일"
              type="date"
              defaultValue={
                task?.dueDate 
                  ? new Date(task.dueDate).toISOString().split('T')[0] 
                  : ''
              }
              disabled={loading}
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            취소
          </Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? '처리중...' : (isEditing ? '수정' : '추가')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}