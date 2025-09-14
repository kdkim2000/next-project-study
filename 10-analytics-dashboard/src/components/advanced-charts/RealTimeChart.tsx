// src/components/advanced-charts/RealTimeChart.tsx - 실시간 차트
'use client';

import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { Box, Typography, Switch, FormControlLabel, Paper } from '@mui/material';
import { RealTimeData, generateRealTimeData } from '@/lib/advanced-data';

interface RealTimeChartProps {
  data: RealTimeData[];
}

export default function RealTimeChart({ data: initialData }: RealTimeChartProps) {
  const [data, setData] = useState<RealTimeData[]>(initialData);
  const [isRealTime, setIsRealTime] = useState(false);

  useEffect(() => {
    if (!isRealTime) return;

    const interval = setInterval(() => {
      const newData = generateRealTimeData();
      setData(newData);
    }, 2000); // 2초마다 업데이트

    return () => clearInterval(interval);
  }, [isRealTime]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const time = new Date(label).toLocaleTimeString();
      return (
        <Box sx={{
          bgcolor: 'background.paper',
          p: 2,
          border: 1,
          borderColor: 'divider',
          borderRadius: 1,
          boxShadow: 2
        }}>
          <Typography variant="body2" fontWeight="bold" gutterBottom>
            시간: {time}
          </Typography>
          {payload.map((entry: any, index: number) => (
            <Typography key={index} variant="body2" sx={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </Typography>
          ))}
        </Box>
      );
    }
    return null;
  };

  // 최신 값들
  const latestData = data[data.length - 1] || { value: 0, users: 0, pageViews: 0 };

  return (
    <Box sx={{ height: '100%', p: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">
          실시간 모니터링
        </Typography>
        <FormControlLabel
          control={
            <Switch
              checked={isRealTime}
              onChange={(e) => setIsRealTime(e.target.checked)}
              color="primary"
            />
          }
          label="실시간 업데이트"
        />
      </Box>

      {/* 현재 상태 카드들 */}
      <Box display="flex" gap={2} mb={3}>
        <Paper sx={{ p: 2, flex: 1, textAlign: 'center' }}>
          <Typography variant="h4" color="primary.main">
            {latestData.value}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            응답 시간 (ms)
          </Typography>
        </Paper>
        <Paper sx={{ p: 2, flex: 1, textAlign: 'center' }}>
          <Typography variant="h4" color="success.main">
            {latestData.users}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            활성 사용자
          </Typography>
        </Paper>
        <Paper sx={{ p: 2, flex: 1, textAlign: 'center' }}>
          <Typography variant="h4" color="warning.main">
            {latestData.pageViews}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            페이지뷰/분
          </Typography>
        </Paper>
      </Box>

      {/* 실시간 차트 */}
      <Box sx={{ height: 'calc(100% - 200px)' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart 
            data={data} 
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="timestamp"
              type="number"
              scale="time"
              domain={['dataMin', 'dataMax']}
              tickFormatter={(value) => new Date(value).toLocaleTimeString()}
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#666', fontSize: 11 }}
            />
            <YAxis 
              yAxisId="left"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#666', fontSize: 11 }}
            />
            <YAxis 
              yAxisId="right" 
              orientation="right"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#666', fontSize: 11 }}
            />
            
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="value"
              stroke="#2196f3"
              strokeWidth={2}
              name="응답시간 (ms)"
              dot={false}
              isAnimationActive={isRealTime}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="users"
              stroke="#4caf50"
              strokeWidth={2}
              name="활성 사용자"
              dot={false}
              isAnimationActive={isRealTime}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="pageViews"
              stroke="#ff9800"
              strokeWidth={2}
              name="페이지뷰/분"
              dot={false}
              isAnimationActive={isRealTime}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
      
      {/* 상태 표시 */}
      <Box sx={{ mt: 1, textAlign: 'center' }}>
        <Typography variant="caption" color="text.secondary">
          {isRealTime ? (
            <>🔴 실시간 업데이트 중... (2초마다 갱신)</>
          ) : (
            '⏸️ 실시간 업데이트 중지됨'
          )}
        </Typography>
      </Box>
    </Box>
  );
}