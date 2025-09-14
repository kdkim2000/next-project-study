// src/components/advanced-charts/TreemapChart.tsx - 트리맵 차트
'use client';

import React from 'react';
import { ResponsiveContainer, Treemap, Tooltip } from 'recharts';
import { Box, Typography } from '@mui/material';
import { TreemapData } from '@/lib/advanced-data';

interface TreemapChartProps {
  data: TreemapData[];
}

const COLORS = ['#2196f3', '#4caf50', '#ff9800', '#f44336', '#9c27b0', '#00bcd4'];

export default function TreemapChart({ data }: TreemapChartProps) {
  // 데이터를 Recharts Treemap 형식으로 변환
  const processedData = data.map(item => ({
    ...item,
    children: item.children?.map((child, index) => ({
      ...child,
      fill: COLORS[index % COLORS.length]
    }))
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <Box sx={{
          bgcolor: 'background.paper',
          p: 2,
          border: 1,
          borderColor: 'divider',
          borderRadius: 1,
          boxShadow: 2
        }}>
          <Typography variant="body2" fontWeight="bold">
            {data.name}
          </Typography>
          <Typography variant="body2">
            값: {data.value?.toLocaleString() || 0}
          </Typography>
          {data.root && (
            <Typography variant="body2" color="text.secondary">
              카테고리: {data.root.name}
            </Typography>
          )}
        </Box>
      );
    }
    return null;
  };

  const CustomContent = (props: any) => {
    const { root, depth, x, y, width, height, index, name, value } = props;

    return (
      <g>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          style={{
            fill: depth < 2 ? COLORS[index % COLORS.length] : '#ffffff',
            stroke: '#ffffff',
            strokeWidth: 2,
            strokeOpacity: 1,
            fillOpacity: depth < 2 ? 0.8 : 0.1,
          }}
        />
        {depth === 1 && width > 80 && height > 40 && (
          <text
            x={x + width / 2}
            y={y + height / 2}
            textAnchor="middle"
            fill="#ffffff"
            fontSize="14"
            fontWeight="bold"
          >
            <tspan x={x + width / 2} dy="-0.5em">
              {name}
            </tspan>
            <tspan x={x + width / 2} dy="1.2em">
              {value?.toLocaleString()}
            </tspan>
          </text>
        )}
        {depth === 2 && width > 40 && height > 30 && (
          <text
            x={x + width / 2}
            y={y + height / 2}
            textAnchor="middle"
            fill="#333333"
            fontSize="11"
          >
            <tspan x={x + width / 2} dy="-0.3em">
              {name}
            </tspan>
            <tspan x={x + width / 2} dy="1em">
              {value?.toLocaleString()}
            </tspan>
          </text>
        )}
      </g>
    );
  };

  return (
    <Box sx={{ height: '100%', p: 2 }}>
      <Typography variant="h6" gutterBottom>
        브라우저별 사용자 분포
      </Typography>
      
      <ResponsiveContainer width="100%" height="90%">
        <Treemap
          data={processedData}
          dataKey="value"
          aspectRatio={4 / 3}
          stroke="#ffffff"
          strokeWidth={2}
          content={<CustomContent />}
        >
          <Tooltip content={<CustomTooltip />} />
        </Treemap>
      </ResponsiveContainer>
    </Box>
  );
}