// src/components/MetricCard.tsx - 심플한 메트릭 카드
'use client';

import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import {
  AttachMoney as AttachMoneyIcon,
  People as PeopleIcon,
  ShoppingCart as ShoppingCartIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { MetricData } from '@/data/sampleData';
import { formatNumber, getChangeColor, formatChange } from '@/utils/helpers';

interface MetricCardProps {
  data: MetricData;
}

// 아이콘 매핑 (간단하게)
const iconMap = {
  AttachMoney: AttachMoneyIcon,
  People: PeopleIcon,
  ShoppingCart: ShoppingCartIcon,
  TrendingUp: TrendingUpIcon,
};

export default function MetricCard({ data }: MetricCardProps) {
  const IconComponent = iconMap[data.icon as keyof typeof iconMap] || TrendingUpIcon;
  
  return (
    <Card className="fade-in" sx={{ height: 120 }}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
          <Typography variant="body2" color="text.secondary">
            {data.title}
          </Typography>
          <Box 
            sx={{ 
              backgroundColor: data.color,
              borderRadius: '50%',
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <IconComponent sx={{ color: 'white', fontSize: 18 }} />
          </Box>
        </Box>

        <Typography variant="h5" fontWeight="bold" mb={1}>
          {formatNumber(data.value)}
          {data.title === '전환율' && '%'}
        </Typography>

        <Typography 
          variant="body2" 
          sx={{ color: getChangeColor(data.change) }}
        >
          {formatChange(data.change)} 전월 대비
        </Typography>
      </CardContent>
    </Card>
  );
}