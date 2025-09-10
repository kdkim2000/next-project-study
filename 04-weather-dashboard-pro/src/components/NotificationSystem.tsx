// src/components/NotificationSystem.tsx
// 날씨 알림 시스템 - 특정 조건에서 사용자에게 알림

'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Switch,
  FormControlLabel,
  Box,
  Alert,
  Chip,
  Divider,
  Grid,
  TextField,
  Button
} from '@mui/material';
import {
  Notifications,
  WbSunny,
  Umbrella,
  AcUnit,
  Warning
} from '@mui/icons-material';
import type { WeatherData } from '@/types/weather';

interface NotificationSystemProps {
  weatherData: WeatherData | null;
}

interface AlertSettings {
  enabled: boolean;
  highTemp: number;
  lowTemp: number;
  highHumidity: number;
  highWind: number;
  highUV: number;
}

function NotificationSystem({ weatherData }: NotificationSystemProps) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [alertSettings, setAlertSettings] = useState<AlertSettings>({
    enabled: false,
    highTemp: 35,
    lowTemp: 0,
    highHumidity: 80,
    highWind: 50,
    highUV: 8
  });
  const [activeAlerts, setActiveAlerts] = useState<string[]>([]);

  // 알림 권한 확인 및 요청
  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  // 날씨 조건 모니터링
  useEffect(() => {
    if (!alertSettings.enabled || !weatherData) return;

    const alerts: string[] = [];
    const { current } = weatherData;

    // 고온 경보
    if (current.temp_c >= alertSettings.highTemp) {
      alerts.push(`🔥 고온 주의: ${current.temp_c}°C`);
    }

    // 저온 경보
    if (current.temp_c <= alertSettings.lowTemp) {
      alerts.push(`🥶 저온 주의: ${current.temp_c}°C`);
    }

    // 고습도 경보
    if (current.humidity >= alertSettings.highHumidity) {
      alerts.push(`💧 고습도 주의: ${current.humidity}%`);
    }

    // 강풍 경보
    if (current.wind_kph >= alertSettings.highWind) {
      alerts.push(`💨 강풍 주의: ${current.wind_kph} km/h`);
    }

    // 자외선 경보
    if (current.uv >= alertSettings.highUV) {
      alerts.push(`☀️ 강한 자외선: UV ${current.uv}`);
    }

    setActiveAlerts(alerts);

    // 새로운 경보가 있고 알림이 활성화된 경우
    if (alerts.length > 0 && notificationsEnabled && permission === 'granted') {
      showNotification(alerts[0], '날씨 경보가 발령되었습니다.');
    }
  }, [weatherData, alertSettings, notificationsEnabled, permission]);

  // 알림 권한 요청
  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const result = await Notification.requestPermission();
      setPermission(result);
      
      if (result === 'granted') {
        setNotificationsEnabled(true);
        showNotification('알림이 활성화되었습니다', '날씨 경보를 받을 수 있습니다.');
      }
    }
  };

  // 알림 표시
  const showNotification = (title: string, body: string) => {
    if (permission === 'granted') {
      new Notification(title, {
        body,
        icon: '/icon-192x192.png',
        badge: '/icon-96x96.png',
        tag: 'weather-alert',
        requireInteraction: true
      });
    }
  };

  // 알림 토글
  const handleNotificationToggle = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      if (permission !== 'granted') {
        await requestNotificationPermission();
      } else {
        setNotificationsEnabled(true);
      }
    } else {
      setNotificationsEnabled(false);
    }
  };

  // 경보 설정 업데이트
  const handleSettingChange = (field: keyof AlertSettings, value: number | boolean) => {
    setAlertSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Card elevation={3} sx={{ mb: 3 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Notifications color="primary" />
          <Typography variant="h6">
            날씨 알림 시스템
          </Typography>
        </Box>

        {/* 브라우저 알림 설정 */}
        <Box sx={{ mb: 3 }}>
          <FormControlLabel
            control={
              <Switch
                checked={notificationsEnabled}
                onChange={handleNotificationToggle}
              />
            }
            label="브라우저 알림 허용"
          />
          
          {permission === 'denied' && (
            <Alert severity="warning" sx={{ mt: 1 }}>
              알림이 차단되어 있습니다. 브라우저 설정에서 알림을 허용해주세요.
            </Alert>
          )}

          {permission === 'granted' && notificationsEnabled && (
            <Alert severity="success" sx={{ mt: 1 }}>
              알림이 활성화되었습니다. 날씨 경보를 받을 수 있습니다.
            </Alert>
          )}
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* 경보 설정 */}
        <Box sx={{ mb: 3 }}>
          <FormControlLabel
            control={
              <Switch
                checked={alertSettings.enabled}
                onChange={(e) => handleSettingChange('enabled', e.target.checked)}
              />
            }
            label="날씨 경보 활성화"
          />

          {alertSettings.enabled && (
            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={6} sm={3}>
                <TextField
                  label="고온 경보 (°C)"
                  type="number"
                  size="small"
                  fullWidth
                  value={alertSettings.highTemp}
                  onChange={(e) => handleSettingChange('highTemp', Number(e.target.value))}
                  inputProps={{ min: 0, max: 50 }}
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <TextField
                  label="저온 경보 (°C)"
                  type="number"
                  size="small"
                  fullWidth
                  value={alertSettings.lowTemp}
                  onChange={(e) => handleSettingChange('lowTemp', Number(e.target.value))}
                  inputProps={{ min: -20, max: 20 }}
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <TextField
                  label="고습도 경보 (%)"
                  type="number"
                  size="small"
                  fullWidth
                  value={alertSettings.highHumidity}
                  onChange={(e) => handleSettingChange('highHumidity', Number(e.target.value))}
                  inputProps={{ min: 50, max: 100 }}
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <TextField
                  label="강풍 경보 (km/h)"
                  type="number"
                  size="small"
                  fullWidth
                  value={alertSettings.highWind}
                  onChange={(e) => handleSettingChange('highWind', Number(e.target.value))}
                  inputProps={{ min: 20, max: 100 }}
                />
              </Grid>
            </Grid>
          )}
        </Box>

        {/* 현재 활성 경보 */}
        {activeAlerts.length > 0 && (
          <Box>
            <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Warning color="warning" />
              현재 활성 경보
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {activeAlerts.map((alert, index) => (
                <Chip
                  key={index}
                  label={alert}
                  color="warning"
                  variant="filled"
                  size="small"
                />
              ))}
            </Box>
          </Box>
        )}

        {/* 경보 없음 */}
        {alertSettings.enabled && activeAlerts.length === 0 && weatherData && (
          <Alert severity="info" sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <WbSunny />
              현재 날씨는 안전한 범위에 있습니다.
            </Box>
          </Alert>
        )}

        {/* 테스트 알림 버튼 */}
        {notificationsEnabled && permission === 'granted' && (
          <Box sx={{ mt: 2 }}>
            <Button
              variant="outlined"
              size="small"
              onClick={() => showNotification('테스트 알림', '알림 시스템이 정상 작동합니다.')}
            >
              알림 테스트
            </Button>
          </Box>
        )}

        <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
          💡 날씨 조건이 설정한 임계값을 초과하면 자동으로 알림을 받을 수 있습니다.
        </Typography>
      </CardContent>
    </Card>
  );
}

export default NotificationSystem;