// src/app/(dashboard)/reports/page.tsx - 리포트 페이지
import React from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { Download as DownloadIcon, Visibility as ViewIcon } from '@mui/icons-material';
import Link from 'next/link';

export const metadata = {
  title: '리포트 | Analytics Dashboard Pro',
  description: '생성된 리포트 목록 및 관리',
};

// 샘플 리포트 데이터
const reports = [
  {
    id: 1,
    name: '월간 성과 리포트',
    type: '성과 분석',
    createdAt: '2024-01-15',
    status: '완료',
    chartType: 'advanced-line'
  },
  {
    id: 2,
    name: '사용자 행동 히트맵',
    type: '사용자 분석',
    createdAt: '2024-01-14',
    status: '완료',
    chartType: 'heatmap'
  },
  {
    id: 3,
    name: '브라우저 사용 분포',
    type: '기술 분석',
    createdAt: '2024-01-13',
    status: '완료',
    chartType: 'treemap'
  },
  {
    id: 4,
    name: '웹사이트 성능 지표',
    type: '성능 분석',
    createdAt: '2024-01-12',
    status: '진행중',
    chartType: 'radar'
  },
];

export default function ReportsPage() {
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box mb={4}>
        <Typography variant="h3" component="h1" gutterBottom>
          리포트 관리
        </Typography>
        <Typography variant="h6" color="text.secondary">
          생성된 리포트들을 확인하고 관리하세요
        </Typography>
      </Box>

      {/* 통계 카드들 */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h3" color="primary.main" gutterBottom>
              {reports.length}
            </Typography>
            <Typography variant="body1">총 리포트</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h3" color="success.main" gutterBottom>
              {reports.filter(r => r.status === '완료').length}
            </Typography>
            <Typography variant="body1">완료된 리포트</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h3" color="warning.main" gutterBottom>
              {reports.filter(r => r.status === '진행중').length}
            </Typography>
            <Typography variant="body1">진행중인 리포트</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h3" color="info.main" gutterBottom>
              7
            </Typography>
            <Typography variant="body1">이번 주 생성</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* 리포트 테이블 */}
      <Paper>
        <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="h5" gutterBottom>
            리포트 목록
          </Typography>
        </Box>
        
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>리포트명</TableCell>
                <TableCell>유형</TableCell>
                <TableCell>생성일</TableCell>
                <TableCell>상태</TableCell>
                <TableCell>작업</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.id} hover>
                  <TableCell>
                    <Typography variant="body1" fontWeight="medium">
                      {report.name}
                    </Typography>
                  </TableCell>
                  <TableCell>{report.type}</TableCell>
                  <TableCell>{report.createdAt}</TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        px: 2,
                        py: 0.5,
                        borderRadius: 1,
                        bgcolor: report.status === '완료' ? 'success.light' : 'warning.light',
                        color: report.status === '완료' ? 'success.dark' : 'warning.dark',
                        display: 'inline-block'
                      }}
                    >
                      {report.status}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" gap={1}>
                      <Button
                        component={Link}
                        href={`/chart/${report.chartType}`}
                        size="small"
                        startIcon={<ViewIcon />}
                        disabled={report.status !== '완료'}
                      >
                        보기
                      </Button>
                      <Button
                        size="small"
                        startIcon={<DownloadIcon />}
                        disabled={report.status !== '완료'}
                      >
                        다운로드
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
}