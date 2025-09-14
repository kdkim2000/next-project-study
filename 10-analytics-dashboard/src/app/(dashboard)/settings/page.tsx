// src/app/(dashboard)/settings/page.tsx - 설정 페이지
import React from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Switch,
  Divider,
  Button,
  TextField,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { Save as SaveIcon, Restore as RestoreIcon } from '@mui/icons-material';

export const metadata = {
  title: '설정 | Analytics Dashboard Pro',
  description: '대시보드 설정 및 환경 구성',
};

export default function SettingsPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box mb={4}>
        <Typography variant="h3" component="h1" gutterBottom>
          설정
        </Typography>
        <Typography variant="h6" color="text.secondary">
          대시보드 환경을 구성하세요
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* 일반 설정 */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              일반 설정
            </Typography>
            
            <List>
              <ListItem>
                <ListItemText
                  primary="실시간 업데이트"
                  secondary="대시보드 데이터 자동 새로고침"
                />
                <ListItemSecondaryAction>
                  <Switch defaultChecked />
                </ListItemSecondaryAction>
              </ListItem>
              
              <Divider />
              
              <ListItem>
                <ListItemText
                  primary="다크 모드"
                  secondary="어두운 테마 사용"
                />
                <ListItemSecondaryAction>
                  <Switch />
                </ListItemSecondaryAction>
              </ListItem>
              
              <Divider />
              
              <ListItem>
                <ListItemText
                  primary="알림"
                  secondary="중요 이벤트 알림 받기"
                />
                <ListItemSecondaryAction>
                  <Switch defaultChecked />
                </ListItemSecondaryAction>
              </ListItem>
              
              <Divider />
              
              <ListItem>
                <ListItemText
                  primary="성능 모니터링"
                  secondary="Web Vitals 데이터 수집"
                />
                <ListItemSecondaryAction>
                  <Switch defaultChecked />
                </ListItemSecondaryAction>
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* 데이터 설정 */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              데이터 설정
            </Typography>
            
            <Box component="form" sx={{ '& > :not(style)': { mb: 2 } }}>
              <TextField
                fullWidth
                label="새로고침 간격 (초)"
                type="number"
                defaultValue={30}
                inputProps={{ min: 10, max: 300 }}
              />
              
              <TextField
                fullWidth
                label="데이터 보관 기간 (일)"
                type="number"
                defaultValue={90}
                inputProps={{ min: 7, max: 365 }}
              />
              
              <TextField
                fullWidth
                label="API 엔드포인트"
                defaultValue="https://api.analytics-pro.com"
              />
              
              <TextField
                fullWidth
                label="타임존"
                select
                defaultValue="Asia/Seoul"
                SelectProps={{ native: true }}
              >
                <option value="Asia/Seoul">Asia/Seoul</option>
                <option value="UTC">UTC</option>
                <option value="America/New_York">America/New_York</option>
              </TextField>
            </Box>
          </Paper>
        </Grid>

        {/* 내보내기 설정 */}
        <Grid size={{ xs: 12 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              내보내기 설정
            </Typography>
            
            <List>
              <ListItem>
                <ListItemText
                  primary="Excel 내보내기 시 차트 포함"
                  secondary="Excel 파일에 차트 이미지 포함"
                />
                <ListItemSecondaryAction>
                  <Switch defaultChecked />
                </ListItemSecondaryAction>
              </ListItem>
              
              <Divider />
              
              <ListItem>
                <ListItemText
                  primary="PDF 고해상도"
                  secondary="PDF 내보내기 시 고해상도 사용 (파일 크기 증가)"
                />
                <ListItemSecondaryAction>
                  <Switch />
                </ListItemSecondaryAction>
              </ListItem>
              
              <Divider />
              
              <ListItem>
                <ListItemText
                  primary="자동 백업"
                  secondary="일일 데이터 자동 백업"
                />
                <ListItemSecondaryAction>
                  <Switch defaultChecked />
                </ListItemSecondaryAction>
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* 액션 버튼들 */}
        <Grid size={{ xs: 12 }}>
          <Box display="flex" gap={2} justifyContent="flex-end">
            <Button
              variant="outlined"
              startIcon={<RestoreIcon />}
            >
              기본값 복원
            </Button>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
            >
              설정 저장
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}