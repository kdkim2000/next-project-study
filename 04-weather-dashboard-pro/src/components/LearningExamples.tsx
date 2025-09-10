// src/components/LearningExamples.tsx
// 학습을 위한 다양한 React 패턴 예제 모음

'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  TextField,
  Chip,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid
} from '@mui/material';
import { ExpandMore, Code, School, TrendingUp } from '@mui/icons-material';

/**
 * 학습 예제 컴포넌트
 * 
 * 이 컴포넌트는 초보자들이 다양한 React 패턴을 학습할 수 있도록
 * 실제 작동하는 예제들을 제공합니다.
 */
function LearningExamples() {
  // 1. useState 기본 예제
  const [count, setCount] = useState(0);
  const [name, setName] = useState('');
  const [todos, setTodos] = useState<string[]>([]);
  const [newTodo, setNewTodo] = useState('');

  // 2. useEffect 예제
  const [seconds, setSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isTimerRunning) {
      interval = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
    }
    
    // Cleanup function (정리 함수)
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning]);

  // 3. useMemo 예제 - 비용이 큰 계산 메모이제이션
  const expensiveCalculation = useMemo(() => {
    console.log('💡 비용이 큰 계산 실행 중...');
    let result = 0;
    for (let i = 0; i < count * 1000; i++) {
      result += i;
    }
    return result;
  }, [count]); // count가 변경될 때만 재계산

  // 4. useCallback 예제 - 함수 메모이제이션
  const handleAddTodo = useCallback(() => {
    if (newTodo.trim()) {
      setTodos(prev => [...prev, newTodo.trim()]);
      setNewTodo('');
    }
  }, [newTodo]); // newTodo가 변경될 때만 새 함수 생성

  const handleRemoveTodo = useCallback((index: number) => {
    setTodos(prev => prev.filter((_, i) => i !== index));
  }, []); // 의존성이 없으므로 함수는 한 번만 생성

  // 5. 조건부 렌더링 예제
  const renderTimerStatus = () => {
    if (seconds === 0) {
      return <Chip label="타이머 대기 중" color="default" />;
    } else if (seconds < 10) {
      return <Chip label="시작 단계" color="info" />;
    } else if (seconds < 30) {
      return <Chip label="진행 중" color="warning" />;
    } else {
      return <Chip label="오랫동안 실행 중" color="error" />;
    }
  };

  return (
    <Card elevation={3} sx={{ mb: 3 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <School color="primary" />
          <Typography variant="h6">
            React 학습 예제 모음
          </Typography>
        </Box>

        <Grid container spacing={2}>
          {/* useState 예제 */}
          <Grid item xs={12} md={6}>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="subtitle1">
                  <Code fontSize="small" sx={{ mr: 1 }} />
                  1. useState - 상태 관리
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      클릭할 때마다 숫자가 증가합니다
                    </Typography>
                    <Typography variant="h4" color="primary" gutterBottom>
                      {count}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button 
                        variant="contained" 
                        onClick={() => setCount(prev => prev + 1)}
                      >
                        증가 (+1)
                      </Button>
                      <Button 
                        variant="outlined" 
                        onClick={() => setCount(0)}
                      >
                        리셋
                      </Button>
                    </Box>
                  </Box>

                  <Box>
                    <TextField
                      label="이름 입력"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      fullWidth
                      size="small"
                    />
                    {name && (
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        안녕하세요, <strong>{name}</strong>님!
                      </Typography>
                    )}
                  </Box>
                </Box>
              </AccordionDetails>
            </Accordion>
          </Grid>

          {/* useEffect 예제 */}
          <Grid item xs={12} md={6}>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="subtitle1">
                  <Code fontSize="small" sx={{ mr: 1 }} />
                  2. useEffect - 부수 효과
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      타이머 예제 (1초마다 증가)
                    </Typography>
                    <Typography variant="h4" color="primary" gutterBottom>
                      {seconds}초
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                      <Button
                        variant={isTimerRunning ? "outlined" : "contained"}
                        onClick={() => setIsTimerRunning(!isTimerRunning)}
                      >
                        {isTimerRunning ? '일시정지' : '시작'}
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={() => {
                          setSeconds(0);
                          setIsTimerRunning(false);
                        }}
                      >
                        리셋
                      </Button>
                    </Box>
                    {renderTimerStatus()}
                  </Box>
                </Box>
              </AccordionDetails>
            </Accordion>
          </Grid>

          {/* useMemo 예제 */}
          <Grid item xs={12} md={6}>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="subtitle1">
                  <TrendingUp fontSize="small" sx={{ mr: 1 }} />
                  3. useMemo - 성능 최적화
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    비용이 큰 계산을 메모이제이션합니다 (콘솔 확인)
                  </Typography>
                  <Alert severity="info" sx={{ mb: 2 }}>
                    count 값이 변경될 때만 계산이 다시 실행됩니다.
                    브라우저 콘솔을 확인해보세요!
                  </Alert>
                  <Typography variant="h6" gutterBottom>
                    계산 결과: {expensiveCalculation.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    현재 count: {count} (위의 버튼으로 변경해보세요)
                  </Typography>
                </Box>
              </AccordionDetails>
            </Accordion>
          </Grid>

          {/* useCallback 예제 */}
          <Grid item xs={12} md={6}>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="subtitle1">
                  <Code fontSize="small" sx={{ mr: 1 }} />
                  4. useCallback - 함수 최적화
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Todo 리스트 예제 (함수 메모이제이션)
                  </Typography>
                  
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                      label="새 할 일"
                      value={newTodo}
                      onChange={(e) => setNewTodo(e.target.value)}
                      size="small"
                      onKeyPress={(e) => e.key === 'Enter' && handleAddTodo()}
                    />
                    <Button 
                      variant="contained" 
                      onClick={handleAddTodo}
                      disabled={!newTodo.trim()}
                    >
                      추가
                    </Button>
                  </Box>

                  <Box>
                    {todos.length === 0 ? (
                      <Typography variant="body2" color="text.secondary">
                        할 일을 추가해보세요!
                      </Typography>
                    ) : (
                      todos.map((todo, index) => (
                        <Chip
                          key={index}
                          label={todo}
                          onDelete={() => handleRemoveTodo(index)}
                          sx={{ m: 0.5 }}
                        />
                      ))
                    )}
                  </Box>
                </Box>
              </AccordionDetails>
            </Accordion>
          </Grid>
        </Grid>

        <Alert severity="success" sx={{ mt: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            💡 학습 팁
          </Typography>
          <Typography variant="body2">
            각 예제의 코드를 브라우저 개발자 도구로 확인하고, 
            직접 수정해보면서 동작 원리를 이해해보세요. 
            특히 useMemo 예제에서는 콘솔 로그를 확인하여 
            언제 계산이 다시 실행되는지 관찰해보세요!
          </Typography>
        </Alert>
      </CardContent>
    </Card>
  );
}

export default LearningExamples;