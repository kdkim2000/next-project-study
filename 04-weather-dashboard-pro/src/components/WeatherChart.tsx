// src/components/WeatherChart.tsx
// 날씨 데이터를 차트로 시각화하는 컴포넌트

'use client';

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  ToggleButton,
  ToggleButtonGroup
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import type { ForecastData, ChartDataPoint } from '@/types/weather';

interface WeatherChartProps {
  forecastData: ForecastData[];
}

function WeatherChart({ forecastData }: WeatherChartProps) {
  // 차트 타입 상태 (line 또는 bar)
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');

  // 일기예보 데이터를 차트 데이터로 변환
  const chartData: ChartDataPoint[] = forecastData.map((forecast) => ({
    name: new Date(forecast.date).toLocaleDateString('ko-KR', { 
      month: 'short', 
      day: 'numeric' 
    }),
    temperature: Math.round((forecast.day.maxtemp_c + forecast.day.mintemp_c) / 2),
    maxTemp: forecast.day.maxtemp_c,
    minTemp: forecast.day.mintemp_c,
    humidity: forecast.day.avghumidity,
    wind: forecast.day.maxwind_kph,
    uv: forecast.day.uv
  }));

  // 차트 타입 변경 핸들러
  const handleChartTypeChange = (
    event: React.MouseEvent<HTMLElement>,
    newChartType: 'line' | 'bar'
  ) => {
    if (newChartType !== null) {
      setChartType(newChartType);
    }
  };

  // 커스텀 툴팁 컴포넌트
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            bgcolor: 'background.paper',
            p: 2,
            border: 1,
            borderColor: 'divider',
            borderRadius: 1,
            boxShadow: 2
          }}
        >
          <Typography variant="subtitle2" gutterBottom>
            {label}
          </Typography>
          {payload.map((entry: any, index: number) => (
            <Typography
              key={index}
              variant="body2"
              sx={{ color: entry.color }}
            >
              {entry.name}: {entry.value}
              {entry.name.includes('온도') ? '°C' : 
               entry.name === '습도' ? '%' : 
               entry.name === '바람' ? ' km/h' : 
               entry.name === 'UV' ? '' : ''}
            </Typography>
          ))}
        </Box>
      );
    }
    return null;
  };

  return (
    <Card elevation={3} sx={{ mb: 3 }}>
      <CardContent>
        {/* 헤더와 차트 타입 선택 */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 3 
        }}>
          <Typography variant="h6">
            3일 날씨 예보
          </Typography>
          <ToggleButtonGroup
            value={chartType}
            exclusive
            onChange={handleChartTypeChange}
            aria-label="chart type"
            size="small"
          >
            <ToggleButton value="line" aria-label="line chart">
              선형
            </ToggleButton>
            <ToggleButton value="bar" aria-label="bar chart">
              막대
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {/* 온도 차트 */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle1" gutterBottom>
            온도 (°C)
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            {chartType === 'line' ? (
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12 }}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="maxTemp"
                  stroke="#ff4444"
                  strokeWidth={2}
                  name="최고온도"
                  dot={{ fill: '#ff4444', strokeWidth: 2, r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="minTemp"
                  stroke="#4444ff"
                  strokeWidth={2}
                  name="최저온도"
                  dot={{ fill: '#4444ff', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            ) : (
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="maxTemp" fill="#ff4444" name="최고온도" />
                <Bar dataKey="minTemp" fill="#4444ff" name="최저온도" />
              </BarChart>
            )}
          </ResponsiveContainer>
        </Box>

        {/* 습도와 바람 차트 */}
        <Box>
          <Typography variant="subtitle1" gutterBottom>
            습도 (%) 및 바람 (km/h)
          </Typography>
          <ResponsiveContainer width="100%" height={250}>
            {chartType === 'line' ? (
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="humidity"
                  stroke="#00aa00"
                  strokeWidth={2}
                  name="습도"
                  dot={{ fill: '#00aa00', strokeWidth: 2, r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="wind"
                  stroke="#aa00aa"
                  strokeWidth={2}
                  name="바람"
                  dot={{ fill: '#aa00aa', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            ) : (
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="humidity" fill="#00aa00" name="습도" />
                <Bar dataKey="wind" fill="#aa00aa" name="바람" />
              </BarChart>
            )}
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
}

export default WeatherChart;