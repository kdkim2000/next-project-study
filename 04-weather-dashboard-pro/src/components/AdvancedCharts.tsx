// src/components/AdvancedCharts.tsx
// 고급 날씨 차트 컴포넌트 - 다양한 시각화 옵션 제공

'use client';

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  ToggleButton,
  ToggleButtonGroup,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid
} from '@mui/material';
import {
  ComposedChart,
  Line,
  Bar,
  Area,
  AreaChart,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import type { ForecastData } from '@/types/weather';

interface AdvancedChartsProps {
  forecastData: ForecastData[];
}

function AdvancedCharts({ forecastData }: AdvancedChartsProps) {
  const [chartType, setChartType] = useState<'line' | 'area' | 'bar' | 'radar' | 'pie'>('line');
  const [dataType, setDataType] = useState<'temperature' | 'humidity' | 'wind' | 'all'>('temperature');

  // 차트 데이터 변환
  const getChartData = () => {
    return forecastData.map((forecast, index) => ({
      name: new Date(forecast.date).toLocaleDateString('ko-KR', { 
        month: 'short', 
        day: 'numeric' 
      }),
      day: `Day ${index + 1}`,
      maxTemp: forecast.day.maxtemp_c,
      minTemp: forecast.day.mintemp_c,
      avgTemp: Math.round((forecast.day.maxtemp_c + forecast.day.mintemp_c) / 2),
      humidity: forecast.day.avghumidity,
      wind: forecast.day.maxwind_kph,
      uv: forecast.day.uv,
      // 파이 차트용 데이터
      value: forecast.day.maxtemp_c - forecast.day.mintemp_c // 온도 차이
    }));
  };

  // 레이더 차트용 데이터
  const getRadarData = () => {
    return forecastData.map((forecast) => ({
      subject: new Date(forecast.date).toLocaleDateString('ko-KR', { 
        month: 'short', 
        day: 'numeric' 
      }),
      temperature: Math.round((forecast.day.maxtemp_c + forecast.day.mintemp_c) / 2),
      humidity: forecast.day.avghumidity,
      wind: forecast.day.maxwind_kph * 2, // 스케일 조정
      uv: forecast.day.uv * 10 // 스케일 조정
    }));
  };

  // 파이 차트 색상
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  // 차트 타입 변경 핸들러
  const handleChartTypeChange = (
    event: React.MouseEvent<HTMLElement>,
    newType: 'line' | 'area' | 'bar' | 'radar' | 'pie'
  ) => {
    if (newType !== null) {
      setChartType(newType);
    }
  };

  // 데이터 타입 변경 핸들러
  const handleDataTypeChange = (event: any) => {
    setDataType(event.target.value);
  };

  // 커스텀 툴팁
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
            boxShadow: 3
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
              {entry.dataKey.includes('Temp') ? '°C' : 
               entry.dataKey === 'humidity' ? '%' : 
               entry.dataKey === 'wind' ? ' km/h' : ''}
            </Typography>
          ))}
        </Box>
      );
    }
    return null;
  };

  const chartData = getChartData();
  const radarData = getRadarData();

  return (
    <Card elevation={3} sx={{ mb: 3 }}>
      <CardContent>
        {/* 차트 컨트롤 */}
        <Box sx={{ mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={8}>
              <Typography variant="h6" gutterBottom>
                고급 날씨 분석 차트
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
                <ToggleButton value="area" aria-label="area chart">
                  영역
                </ToggleButton>
                <ToggleButton value="bar" aria-label="bar chart">
                  막대
                </ToggleButton>
                <ToggleButton value="radar" aria-label="radar chart">
                  레이더
                </ToggleButton>
                <ToggleButton value="pie" aria-label="pie chart">
                  파이
                </ToggleButton>
              </ToggleButtonGroup>
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth size="small">
                <InputLabel>데이터 유형</InputLabel>
                <Select
                  value={dataType}
                  label="데이터 유형"
                  onChange={handleDataTypeChange}
                >
                  <MenuItem value="temperature">온도</MenuItem>
                  <MenuItem value="humidity">습도</MenuItem>
                  <MenuItem value="wind">바람</MenuItem>
                  <MenuItem value="all">전체</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>

        {/* 차트 렌더링 */}
        <Box sx={{ height: 400 }}>
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'line' && (
              <ComposedChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                {(dataType === 'temperature' || dataType === 'all') && (
                  <>
                    <Line type="monotone" dataKey="maxTemp" stroke="#ff4444" name="최고온도" />
                    <Line type="monotone" dataKey="minTemp" stroke="#4444ff" name="최저온도" />
                  </>
                )}
                {(dataType === 'humidity' || dataType === 'all') && (
                  <Bar dataKey="humidity" fill="#00aa00" name="습도" />
                )}
                {(dataType === 'wind' || dataType === 'all') && (
                  <Line type="monotone" dataKey="wind" stroke="#aa00aa" name="바람" />
                )}
              </ComposedChart>
            )}

            {chartType === 'area' && (
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                {(dataType === 'temperature' || dataType === 'all') && (
                  <>
                    <Area
                      type="monotone"
                      dataKey="maxTemp"
                      stackId="1"
                      stroke="#ff4444"
                      fill="#ff4444"
                      fillOpacity={0.6}
                      name="최고온도"
                    />
                    <Area
                      type="monotone"
                      dataKey="minTemp"
                      stackId="1"
                      stroke="#4444ff"
                      fill="#4444ff"
                      fillOpacity={0.6}
                      name="최저온도"
                    />
                  </>
                )}
                {dataType === 'humidity' && (
                  <Area
                    type="monotone"
                    dataKey="humidity"
                    stroke="#00aa00"
                    fill="#00aa00"
                    fillOpacity={0.6}
                    name="습도"
                  />
                )}
                {dataType === 'wind' && (
                  <Area
                    type="monotone"
                    dataKey="wind"
                    stroke="#aa00aa"
                    fill="#aa00aa"
                    fillOpacity={0.6}
                    name="바람"
                  />
                )}
              </AreaChart>
            )}

            {chartType === 'bar' && (
              <ComposedChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                {(dataType === 'temperature' || dataType === 'all') && (
                  <>
                    <Bar dataKey="maxTemp" fill="#ff4444" name="최고온도" />
                    <Bar dataKey="minTemp" fill="#4444ff" name="최저온도" />
                  </>
                )}
                {dataType === 'humidity' && (
                  <Bar dataKey="humidity" fill="#00aa00" name="습도" />
                )}
                {dataType === 'wind' && (
                  <Bar dataKey="wind" fill="#aa00aa" name="바람" />
                )}
              </ComposedChart>
            )}

            {chartType === 'radar' && (
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis />
                <Radar name="온도" dataKey="temperature" stroke="#ff4444" fill="#ff4444" fillOpacity={0.6} />
                <Radar name="습도" dataKey="humidity" stroke="#00aa00" fill="#00aa00" fillOpacity={0.6} />
                <Radar name="바람" dataKey="wind" stroke="#aa00aa" fill="#aa00aa" fillOpacity={0.6} />
                <Radar name="UV" dataKey="uv" stroke="#ffaa00" fill="#ffaa00" fillOpacity={0.6} />
                <Legend />
                <Tooltip />
              </RadarChart>
            )}

            {chartType === 'pie' && (
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}°C`}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            )}
          </ResponsiveContainer>
        </Box>

        {/* 차트 설명 */}
        <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
          💡 차트 유형을 변경하여 다양한 방식으로 날씨 데이터를 시각화해보세요. 
          레이더 차트는 여러 지표의 균형을 한눈에 파악할 수 있습니다.
        </Typography>
      </CardContent>
    </Card>
  );
}

export default AdvancedCharts;