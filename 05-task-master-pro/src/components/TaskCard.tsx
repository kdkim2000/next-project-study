// src/components/TaskCard.tsx - 개별 할 일을 표시하는 카드 컴포넌트

'use client';

import React, { useState, useTransition } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Chip,
  IconButton,
  Box,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  DragIndicator as DragIcon,
  AccessTime as TimeIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';
import { Task } from '@/types';
import { deleteTask } from '@/lib/actions';
import {
  getPriorityLabel,
  getStatusLabel,
  priorityColors,
  statusColors,
  formatDateOnly,
  getDaysUntilDue,
  getDueDateStatus,
  truncateText,
} from '@/lib/utils';

interface TaskCardProps {
  task: Task; // 표시할 할 일 데이터
  onEdit: (task: Task) => void; // 수정 버튼 클릭 시 실행할 함수
  onDelete?: (taskId: string) => void; // 삭제 완료 시 실행할 함수 (선택사항)
}

export default function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  // 드래그 앤 드롭을 위한 sortable 설정
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  // 드래그 시 적용될 스타일
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1, // 드래그 중일 때 투명하게
  };

  // React 18+ useTransition 훅 사용
  const [isPending, startTransition] = useTransition();

  // 메시지 상태
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  // 삭제 버튼 클릭 처리
  const handleDelete = () => {
    if (window.confirm('정말로 이 할 일을 삭제하시겠습니까?')) {
      startTransition(async () => {
        try {
          // ID 문자열을 직접 전달
          const result = await deleteTask(task.id);
          
          if (result.success) {
            setMessage({
              type: 'success',
              text: result.message || '할 일이 삭제되었습니다.'
            });
            
            // 성공 시 콜백 실행
            setTimeout(() => {
              onDelete?.(task.id);
            }, 1000);
          } else {
            setMessage({
              type: 'error',
              text: result.error || '삭제에 실패했습니다.'
            });
          }
        } catch (error) {
          console.error('삭제 실패:', error);
          setMessage({
            type: 'error',
            text: '예상치 못한 오류가 발생했습니다.'
          });
        }
      });
    }
  };

  // 마감일 상태에 따른 색상 결정
  const dueDateStatus = getDueDateStatus(task.dueDate);
  const dueDateColor = dueDateStatus === 'overdue' ? 'error' : 
                      dueDateStatus === 'soon' ? 'warning' : 'default';

  // 마감일까지 남은 일수
  const daysUntilDue = getDaysUntilDue(task.dueDate);

  return (
    <>
      <Card
        ref={setNodeRef}
        style={style}
        sx={{
          cursor: isDragging ? 'grabbing' : 'default',
          userSelect: 'none', // 텍스트 선택 방지
          position: 'relative',
          '&:hover .drag-handle': {
            opacity: 1, // 호버 시 드래그 핸들 표시
          },
        }}
      >
        {/* 드래그 핸들 */}
        <Box
          className="drag-handle"
          {...attributes}
          {...listeners}
          sx={{
            position: 'absolute',
            top: 8,
            left: 8,
            opacity: 0.3,
            cursor: 'grab',
            transition: 'opacity 0.2s',
            '&:hover': {
              opacity: 0.7,
            },
            '&:active': {
              cursor: 'grabbing',
            },
          }}
        >
          <DragIcon fontSize="small" />
        </Box>

        <CardContent sx={{ pl: 5, pb: 1 }}>
          {/* 제목과 우선순위/상태 칩 */}
          <Box sx={{ mb: 1 }}>
            <Typography 
              variant="h6" 
              component="h3" 
              sx={{ 
                mb: 1,
                fontSize: '1.1rem',
                fontWeight: 500,
                lineHeight: 1.3,
              }}
            >
              {task.title}
            </Typography>
            
            {/* 우선순위와 상태 표시 */}
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip
                label={getPriorityLabel(task.priority)}
                size="small"
                sx={{
                  backgroundColor: priorityColors[task.priority],
                  color: 'white',
                  fontWeight: 500,
                }}
              />
              <Chip
                label={getStatusLabel(task.status)}
                size="small"
                sx={{
                  backgroundColor: statusColors[task.status],
                  color: 'white',
                  fontWeight: 500,
                }}
              />
            </Box>
          </Box>

          {/* 설명 (있는 경우에만 표시) */}
          {task.description && (
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ 
                mb: 2,
                lineHeight: 1.4,
              }}
            >
              {truncateText(task.description, 100)}
            </Typography>
          )}

          {/* 날짜 정보 */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            {/* 마감일 */}
            {task.dueDate && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CalendarIcon fontSize="small" color={dueDateColor as any} />
                <Typography 
                  variant="body2" 
                  color={dueDateColor === 'error' ? 'error' : 
                         dueDateColor === 'warning' ? 'warning.main' : 'text.secondary'}
                  sx={{ fontWeight: dueDateColor !== 'default' ? 500 : 400 }}
                >
                  마감: {formatDateOnly(task.dueDate)}
                  {daysUntilDue !== null && (
                    <span style={{ marginLeft: 4 }}>
                      ({daysUntilDue === 0 ? '오늘' : 
                        daysUntilDue > 0 ? `${daysUntilDue}일 후` : 
                        `${Math.abs(daysUntilDue)}일 지남`})
                    </span>
                  )}
                </Typography>
              </Box>
            )}

            {/* 생성일 */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TimeIcon fontSize="small" color="disabled" />
              <Typography variant="caption" color="text.disabled">
                생성: {formatDateOnly(task.createdAt)}
              </Typography>
            </Box>
          </Box>
        </CardContent>

        {/* 액션 버튼들 */}
        <CardActions sx={{ justifyContent: 'flex-end', pt: 0 }}>
          {/* 수정 버튼 */}
          <IconButton
            onClick={() => onEdit(task)}
            disabled={isPending}
            size="small"
            color="primary"
            aria-label="할 일 수정"
          >
            <EditIcon fontSize="small" />
          </IconButton>

          {/* 삭제 버튼 */}
          <IconButton
            onClick={handleDelete}
            disabled={isPending}
            size="small"
            color="error"
            aria-label="할 일 삭제"
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </CardActions>

        {/* 에러 메시지 표시 */}
        {message?.type === 'error' && (
          <Box sx={{ p: 2, pt: 0 }}>
            <Alert severity="error" size="small">
              {message.text}
            </Alert>
          </Box>
        )}
      </Card>

      {/* 성공/에러 메시지 스낵바 */}
      <Snackbar
        open={!!message}
        autoHideDuration={3000}
        onClose={() => setMessage(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setMessage(null)} 
          severity={message?.type || 'info'}
          variant="filled"
        >
          {message?.text}
        </Alert>
      </Snackbar>
    </>
  );
}