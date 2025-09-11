// src/components/TaskForm.tsx - 할 일을 생성하거나 수정하는 폼 컴포넌트

'use client';

import React, { useState, useTransition } from 'react';
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
  Alert,
  Box,
  CircularProgress,
  Snackbar,
} from '@mui/material';
import { Priority, Status } from '@prisma/client';
import { createTask, updateTask } from '@/lib/actions';
import { Task } from '@/types';
import { getPriorityLabel, getStatusLabel } from '@/lib/utils';

interface TaskFormProps {
  open: boolean; // 다이얼로그 열림/닫힘 상태
  onClose: () => void; // 다이얼로그 닫기 함수
  task?: Task; // 수정할 할 일 (없으면 새 할 일 생성)
  onSuccess?: () => void; // 성공 시 실행할 함수
}

// 폼의 초기값 설정
const getInitialFormData = (task?: Task) => ({
  title: task?.title || '',
  description: task?.description || '',
  priority: task?.priority || Priority.MEDIUM,
  status: task?.status || Status.TODO,
  dueDate: task?.dueDate ? task.dueDate.toISOString().split('T')[0] : '', // YYYY-MM-DD 형식
});

export default function TaskForm({ open, onClose, task, onSuccess }: TaskFormProps) {
  // 폼 데이터 상태 관리
  const [formData, setFormData] = useState(getInitialFormData(task));
  
  // React 18+ useTransition 훅 사용
  const [isPending, startTransition] = useTransition();
  
  // 상태 메시지 관리
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  // 현재 편집 모드 확인
  const isEditing = !!task;

  // 폼 입력 변경 처리
  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  // 폼 제출 처리
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    // 에러/성공 메시지 초기화
    setMessage(null);
    
    const form = event.target as HTMLFormElement;
    const formDataObj = new FormData(form);
    
    // 수정 모드인 경우 ID 추가
    if (isEditing) {
      formDataObj.append('id', task.id);
    }

    // startTransition을 사용하여 Server Action 호출
    startTransition(async () => {
      try {
        let result;
        
        if (isEditing) {
          result = await updateTask(formDataObj);
        } else {
          result = await createTask(formDataObj);
        }

        if (result.success) {
          setMessage({
            type: 'success',
            text: result.message || (isEditing ? '할 일이 수정되었습니다.' : '할 일이 생성되었습니다.')
          });
          
          // 성공 시 폼 초기화 후 닫기
          setTimeout(() => {
            handleClose();
            onSuccess?.();
          }, 1500);
        } else {
          setMessage({
            type: 'error',
            text: result.error || '작업에 실패했습니다.'
          });
        }
      } catch (error) {
        console.error('폼 제출 실패:', error);
        setMessage({
          type: 'error',
          text: '예상치 못한 오류가 발생했습니다.'
        });
      }
    });
  };

  // 다이얼로그 닫기 처리
  const handleClose = () => {
    if (!isPending) {
      setFormData(getInitialFormData(task));
      setMessage(null);
      onClose();
    }
  };

  // 다이얼로그가 열릴 때마다 폼 데이터 초기화
  React.useEffect(() => {
    if (open) {
      setFormData(getInitialFormData(task));
      setMessage(null);
    }
  }, [open, task]);

  return (
    <>
      <Dialog 
        open={open} 
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        // 진행 중일 때는 닫기 방지
        disableEscapeKeyDown={isPending}
      >
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            {isEditing ? '할 일 수정' : '새 할 일 추가'}
          </DialogTitle>
          
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
              {/* 메시지 표시 */}
              {message && (
                <Alert severity={message.type}>
                  {message.text}
                </Alert>
              )}

              {/* 제목 입력 */}
              <TextField
                name="title"
                label="제목"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                required
                fullWidth
                disabled={isPending}
                inputProps={{ maxLength: 100 }}
                helperText={`${formData.title.length}/100`}
              />

              {/* 설명 입력 */}
              <TextField
                name="description"
                label="설명"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                multiline
                rows={3}
                fullWidth
                disabled={isPending}
                inputProps={{ maxLength: 500 }}
                helperText={`${formData.description.length}/500 (선택사항)`}
              />

              {/* 우선순위 선택 */}
              <FormControl fullWidth disabled={isPending}>
                <InputLabel>우선순위</InputLabel>
                <Select
                  name="priority"
                  value={formData.priority}
                  onChange={(e) => handleInputChange('priority', e.target.value)}
                  label="우선순위"
                >
                  {Object.values(Priority).map((priority) => (
                    <MenuItem key={priority} value={priority}>
                      {getPriorityLabel(priority)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* 상태 선택 */}
              <FormControl fullWidth disabled={isPending}>
                <InputLabel>상태</InputLabel>
                <Select
                  name="status"
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  label="상태"
                >
                  {Object.values(Status).map((status) => (
                    <MenuItem key={status} value={status}>
                      {getStatusLabel(status)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* 마감일 입력 */}
              <TextField
                name="dueDate"
                label="마감일"
                type="date"
                value={formData.dueDate}
                onChange={(e) => handleInputChange('dueDate', e.target.value)}
                disabled={isPending}
                InputLabelProps={{
                  shrink: true, // 라벨이 항상 위에 표시되도록
                }}
                helperText="선택사항"
              />
            </Box>
          </DialogContent>

          <DialogActions sx={{ p: 2, gap: 1 }}>
            {/* 취소 버튼 */}
            <Button 
              onClick={handleClose}
              disabled={isPending}
              variant="outlined"
            >
              취소
            </Button>
            
            {/* 저장 버튼 */}
            <Button
              type="submit"
              variant="contained"
              disabled={isPending}
              startIcon={isPending ? <CircularProgress size={16} /> : undefined}
            >
              {isPending 
                ? (isEditing ? '수정 중...' : '생성 중...') 
                : (isEditing ? '수정' : '생성')
              }
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* 성공 메시지 스낵바 */}
      <Snackbar
        open={message?.type === 'success'}
        autoHideDuration={3000}
        onClose={() => setMessage(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setMessage(null)} 
          severity="success"
          variant="filled"
        >
          {message?.text}
        </Alert>
      </Snackbar>
    </>
  );
}