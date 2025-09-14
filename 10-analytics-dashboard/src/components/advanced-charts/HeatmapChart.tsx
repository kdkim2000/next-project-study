// src/components/advanced-charts/HeatmapChart.tsx - 히트맵 차트
'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';
import { HeatmapData } from '@/lib/advanced-data';

interface HeatmapChartProps {
  data: HeatmapData[];
}

export default function HeatmapChart({ data }: HeatmapChartProps) {
  const days = ['월', '화', '수', '목', '금', '토', '일'];
  const hours = Array.from({ length: 24 }, (_, i) => i);
  
  // 값에 따른 색상 강도 계산
  const getColor = (value: number) => {
    const intensity = value / 100; // 0-100 범위를 0-1로 정규화
    return `rgba(33, 150, 243, ${intensity})`; // 파란색 계열
  };

  // 값에 따른 텍스트 색상
  const getTextColor = (value: number) => {
    return value > 50 ? '#ffffff' : '#000000';
  };

  return (
    <Box sx={{ p: 2, height: '100%', overflow: 'auto' }}>
      <Typography variant="h6" gutterBottom>
        시간대별 활동 히트맵
      </Typography>
      
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: 'auto repeat(24, 1fr)',
        gap: '2px',
        minWidth: '800px'
      }}>
        {/* 시간 헤더 */}
        <Box></Box>
        {hours.map(hour => (
          <Box key={hour} sx={{ 
            textAlign: 'center', 
            fontSize: '12px',
            p: 0.5,
            minWidth: '30px'
          }}>
            {hour}시
          </Box>
        ))}
        
        {/* 요일별 데이터 */}
        {days.map(day => (
          <React.Fragment key={day}>
            <Box sx={{ 
              display: 'flex',
              alignItems: 'center',
              pr: 1,
              fontSize: '12px',
              fontWeight: 'bold'
            }}>
              {day}
            </Box>
            {hours.map(hour => {
              const dataPoint = data.find(d => d.day === day && d.hour === hour);
              const value = dataPoint?.value || 0;
              
              return (
                <Box
                  key={`${day}-${hour}`}
                  sx={{
                    backgroundColor: getColor(value),
                    color: getTextColor(value),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '30px',
                    minWidth: '30px',
                    fontSize: '10px',
                    fontWeight: 'bold',
                    border: '1px solid #e0e0e0',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    '&:hover': {
                      transform: 'scale(1.1)',
                      zIndex: 1,
                      boxShadow: 2,
                    }
                  }}
                  title={`${day}요일 ${hour}시: ${value}%`}
                >
                  {value}
                </Box>
              );
            })}
          </React.Fragment>
        ))}
      </Box>
      
      {/* 범례 */}
      <Box sx={{ mt: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="body2">낮음</Typography>
        <Box sx={{ display: 'flex', gap: '1px' }}>
          {[0, 20, 40, 60, 80, 100].map(value => (
            <Box
              key={value}
              sx={{
                width: 20,
                height: 20,
                backgroundColor: getColor(value),
                border: '1px solid #ccc'
              }}
            />
          ))}
        </Box>
        <Typography variant="body2">높음</Typography>
      </Box>
    </Box>
  );
}