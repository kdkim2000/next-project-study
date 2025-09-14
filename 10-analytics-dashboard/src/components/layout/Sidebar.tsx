// src/components/layout/Sidebar.tsx - 네비게이션 사이드바
'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Divider,
  Badge,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Analytics as AnalyticsIcon,
  Assessment as ReportsIcon,
  Settings as SettingsIcon,
  TrendingUp as TrendingUpIcon,
  ShowChart as ChartIcon,
  Timeline as TimelineIcon,
  BubbleChart as BubbleChartIcon,
  DonutLarge as DonutIcon,
  Speed as SpeedIcon,
} from '@mui/icons-material';
import Link from 'next/link';

const DRAWER_WIDTH = 240;

interface SidebarProps {
  activeSection?: string;
}

const mainMenuItems = [
  {
    text: '대시보드',
    icon: DashboardIcon,
    href: '/',
    badge: null,
  },
  {
    text: '분석',
    icon: AnalyticsIcon,
    href: '/analytics',
    badge: null,
  },
  {
    text: '리포트',
    icon: ReportsIcon,
    href: '/reports',
    badge: '새로운',
  },
  {
    text: '설정',
    icon: SettingsIcon,
    href: '/settings',
    badge: null,
  },
];

const chartMenuItems = [
  {
    text: '고급 라인 차트',
    icon: TimelineIcon,
    href: '/chart/advanced-line',
  },
  {
    text: '히트맵',
    icon: SpeedIcon,
    href: '/chart/heatmap',
  },
  {
    text: '트리맵',
    icon: BubbleChartIcon,
    href: '/chart/treemap',
  },
  {
    text: '레이더 차트',
    icon: DonutIcon,
    href: '/chart/radar',
  },
  {
    text: '실시간 차트',
    icon: ChartIcon,
    href: '/chart/realtime',
  },
];

export default function Sidebar({ activeSection }: SidebarProps) {
  const pathname = usePathname();

  const MenuItem = ({ item, isChart = false }: { item: any, isChart?: boolean }) => {
    const isActive = pathname === item.href;
    
    return (
      <ListItem key={item.href} disablePadding>
        <ListItemButton
          component={Link}
          href={item.href}
          selected={isActive}
          sx={{
            mx: 1,
            borderRadius: 1,
            '&.Mui-selected': {
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              '&:hover': {
                bgcolor: 'primary.dark',
              },
              '& .MuiListItemIcon-root': {
                color: 'inherit',
              },
            },
          }}
        >
          <ListItemIcon>
            <item.icon fontSize={isChart ? 'small' : 'medium'} />
          </ListItemIcon>
          <ListItemText 
            primary={item.text}
            primaryTypographyProps={{
              fontSize: isChart ? '0.875rem' : '1rem'
            }}
          />
          {item.badge && (
            <Badge 
              badgeContent={item.badge} 
              color="error" 
              variant="dot"
            />
          )}
        </ListItemButton>
      </ListItem>
    );
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          borderRight: '1px solid',
          borderColor: 'divider',
        },
      }}
    >
      {/* 헤더 */}
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <TrendingUpIcon color="primary" fontSize="large" />
        <Typography variant="h6" component="div" color="primary">
          Analytics Pro
        </Typography>
      </Box>
      
      <Divider />
      
      {/* 메인 메뉴 */}
      <List sx={{ pt: 2 }}>
        {mainMenuItems.map((item) => (
          <MenuItem key={item.href} item={item} />
        ))}
      </List>

      <Divider sx={{ my: 2 }} />
      
      {/* 차트 메뉴 */}
      <Box sx={{ px: 2, py: 1 }}>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          고급 차트
        </Typography>
      </Box>
      
      <List dense>
        {chartMenuItems.map((item) => (
          <MenuItem key={item.href} item={item} isChart />
        ))}
      </List>
      
      {/* 하단 정보 */}
      <Box sx={{ mt: 'auto', p: 2, borderTop: 1, borderColor: 'divider' }}>
        <Typography variant="caption" color="text.secondary" display="block">
          Analytics Dashboard Pro
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block">
          v2.0.0 - Phase 2
        </Typography>
      </Box>
    </Drawer>
  );
}