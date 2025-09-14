// src/components/advanced-charts/AdvancedLineChart.tsx - 고급 라인 차트
'use client';

import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Brush,
  ReferenceLine,
} from 'recharts';
import { Box, Typography } from '@mui/material';
import { AdvancedLineData } from '@/lib/advanced-data';

interface AdvancedLineChartProps {
  data: AdvancedLineData[];
}

export default function AdvancedLineChart({ data }: AdvancedLineChartProps) {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Box sx={{ 
          bgcolor: 'background.paper', 
          p: 2, 
          border: 1, 
          borderColor: 'divider',
          borderRadius: 1,
          boxShadow: 2
        }}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            날짜: {label}
          </Typography>
          {payload.map((entry: any, index: number) => (
            <Typography key={index} variant="body2" sx={{ color: entry.color }}>
              {entry.name}: {entry.value.toLocaleString()}
            </Typography>
          ))}
          <Typography variant="body2" sx={{ mt: 1, fontWeight: 'bold' }}>
            총합: {payload.reduce((sum: number, item: any) => 
              item.dataKey !== 'total' ? sum + item.value : sum, 0
            ).toLocaleString()}
          </Typography>
        </Box>
      );
    }
    return null;
  };

  // 평균값 계산
  const avgTotal = data.reduce((sum, item) => sum + item.total, 0) / data.length;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis 
          dataKey="timestamp" 
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#666', fontSize: 12 }}
          angle={-45}
          textAnchor="end"
          height={60}
        />
        <YAxis 
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#666', fontSize: 12 }}
          tickFormatter={(value) => `${(value / 1000).toFixed(1)}k`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        
        {/* 평균선 */}
        <ReferenceLine 
          y={avgTotal} 
          stroke="#ff7300" 
          strokeDasharray="5 5" 
          label="평균"
        />
        
        {/* 라인들 */}
        <Line
          type="monotone"
          dataKey="desktop"
          stroke="#2196f3"
          strokeWidth={3}
          name="데스크톱"
          dot={{ fill: '#2196f3', strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, stroke: '#2196f3', strokeWidth: 2 }}
        />
        <Line
          type="monotone"
          dataKey="mobile"
          stroke="#4caf50"
          strokeWidth={3}
          name="모바일"
          dot={{ fill: '#4caf50', strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, stroke: '#4caf50', strokeWidth: 2 }}
        />
        <Line
          type="monotone"
          dataKey="tablet"
          stroke="#ff9800"
          strokeWidth={3}
          name="태블릿"
          dot={{ fill: '#ff9800', strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, stroke: '#ff9800', strokeWidth: 2 }}
        />
        
        {/* 브러시 (확대/축소) */}
        <Brush 
          dataKey="timestamp" 
          height={30} 
          stroke="#8884d8"
          startIndex={data.length - 14} // 최근 14일만 기본 표시
        />
      </LineChart>
    </ResponsiveContainer>
  );
}