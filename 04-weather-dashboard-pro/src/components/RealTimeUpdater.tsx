// src/components/RealTimeUpdater.tsx
// 실시간 업데이트 관리 컴포넌트

'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Switch,
  FormControlLabel,
  Box,
  Chip,
  LinearProgress
} from '@mui/material';
import { Schedule, Refresh } from '@mui/icons-material';

interface RealTimeUpdaterProps {
  onUpdate: () => void;
  lastUpdateTime: Date | null;
  loading: boolean;
}

function RealTimeUpdater({ onUpdate, lastUpdateTime, loading }: RealTimeUpdaterProps) {
  const [autoUpdate, setAutoUpdate] = useState(true);
  const [nextUpdateIn, setNextUpdateIn] = useState(0);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  // 자동 업데이트 간격 (분)
  const UPDATE_INTERVAL = 10; // 10분

  // 다음 업데이트까지 남은 시간 계산
  useEffect(() => {
    if (!autoUpdate || !lastUpdateTime) return;

    const updateCountdown = () => {
      const now = new Date();
      const nextUpdate = new Date(lastUpdateTime.getTime() + UPDATE_INTERVAL * 60 * 1000);
      const remaining = Math.max(0, Math.floor((nextUpdate.getTime() - now.getTime()) / 1000));
      
      setNextUpdateIn(remaining);
      
      if (remaining === 0) {
        onUpdate();
      }
    };

    updateCountdown();
    const countdown = setInterval(updateCountdown, 1000);

    return () => clearInterval(countdown);
  }, [autoUpdate, lastUpdateTime, onUpdate]);

  // 자동 업데이트 토글
  const handleAutoUpdateToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAutoUpdate(event.target.checked);
    
    if (!event.target.checked && intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
  };

  // 시간 포맷팅 (초 → 분:초)
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  // 업데이트 진행률 계산 (0-100%)
  const getUpdateProgress = () => {
    if (!autoUpdate || !lastUpdateTime) return 0;
    const totalSeconds = UPDATE_INTERVAL * 60;
    const elapsed = totalSeconds - nextUpdateIn;
    return Math.min(100, (elapsed / totalSeconds) * 100);
  };

  return (
    <Card variant="outlined" sx={{ mb: 2 }}>
      <CardContent sx={{ pb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Schedule fontSize="small" />
            실시간 업데이트
          </Typography>
          <FormControlLabel
            control={
              <Switch
                checked={autoUpdate}
                onChange={handleAutoUpdateToggle}
                disabled={loading}
                size="small"
              />
            }
            label="자동 업데이트"
            sx={{ m: 0 }}
          />
        </Box>

        {autoUpdate && (
          <>
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  다음 업데이트까지
                </Typography>
                <Typography variant="body2" color="primary">
                  {formatTime(nextUpdateIn)}
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={getUpdateProgress()} 
                sx={{ height: 4, borderRadius: 2 }}
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <Chip
                icon={<Refresh fontSize="small" />}
                label={`${UPDATE_INTERVAL}분마다 자동 업데이트`}
                size="small"
                variant="outlined"
                color={loading ? "default" : "primary"}
              />
              {loading && (
                <Chip
                  label="업데이트 중..."
                  size="small"
                  color="info"
                />
              )}
            </Box>
          </>
        )}

        {!autoUpdate && (
          <Typography variant="body2" color="text.secondary">
            자동 업데이트가 비활성화되어 있습니다. 수동으로 새로고침 버튼을 사용하세요.
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}

export default RealTimeUpdater;