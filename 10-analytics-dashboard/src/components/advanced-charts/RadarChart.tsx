// src/components/advanced-charts/RadarChart.tsx - 레이더 차트
'use client';

import React from 'react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  Tooltip,
} from 'recharts';
import { Box, Typography } from '@mui/material';
import { RadarData } from '@/lib/advanced-data';

interface RadarChartProps {
  data: RadarData[];
}

export default function RadarChartComponent({ data }: RadarChartProps) {
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
          <Typography variant="body2" fontWeight="bold" gutterBottom>
            {label}
          </Typography>
          {payload.map((entry: any, index: number) => (
            <Typography key={index} variant="body2" sx={{ color: entry.color }}>
              {entry.name}: {entry.value}/100
            </Typography>
          ))}
        </Box>
      );
    }
    return null;
  };

  return (
    <Box sx={{ height: '100%', p: 2 }}>
      <Typography variant="h6" gutterBottom>
        웹사이트 성능 지표
      </Typography>
      
      <ResponsiveContainer width="100%" height="90%">
        <RadarChart data={data} margin={{ top: 40, right: 40, bottom: 40, left: 40 }}>
          <PolarGrid stroke="#e0e0e0" />
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ fill: '#666', fontSize: 12 }}
            className="text-sm"
          />
          <PolarRadiusAxis 
            angle={90} 
            domain={[0, 100]}
            tickCount={5}
            tick={{ fill: '#999', fontSize: 10 }}
          />
          
          {/* 목표선 */}
          <Radar
            name="목표"
            dataKey="target"
            stroke="#ff9800"
            fill="#ff9800"
            fillOpacity={0.1}
            strokeWidth={2}
            strokeDasharray="5 5"
          />
          
          {/* 현재값 */}
          <Radar
            name="현재"
            dataKey="current"
            stroke="#2196f3"
            fill="#2196f3"
            fillOpacity={0.3}
            strokeWidth={3}
          />
          
          <Tooltip content={<CustomTooltip />} />
          <Legend />
        </RadarChart>
      </ResponsiveContainer>
      
      {/* 상세 정보 */}
      <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        {data.map((item, index) => (
          <Box key={index} sx={{ minWidth: '120px' }}>
            <Typography variant="caption" color="text.secondary">
              {item.subject}
            </Typography>
            <Typography variant="body2">
              {item.current}/{item.target} 
              <span style={{ 
                color: item.current >= item.target ? '#4caf50' : '#f44336',
                marginLeft: '4px'
              }}>
                {item.current >= item.target ? '✓' : '△'}
              </span>
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}