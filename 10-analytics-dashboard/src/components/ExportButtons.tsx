// src/components/ExportButtons.tsx - 내보내기 버튼 컴포넌트
'use client';

import React, { useState } from 'react';
import {
  Box,
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  FileDownload as DownloadIcon,
  TableChart as ExcelIcon,
  PictureAsPdf as PdfIcon,
  DataArray as CsvIcon,
} from '@mui/icons-material';
import { exportToExcel, exportToCSV } from '@/lib/export-excel';
import { exportDashboardToPDF, exportDataToPDF } from '@/lib/export-pdf';
import { metricsData, chartData, pieData } from '@/data/sampleData';

export default function ExportButtons() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success'
  });

  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const showNotification = (message: string, severity: 'success' | 'error') => {
    setNotification({
      open: true,
      message,
      severity
    });
  };

  const handleExcelExport = async () => {
    setLoading(true);
    handleClose();
    
    try {
      const filename = exportToExcel({
        metrics: metricsData,
        chartData,
        pieData
      });
      showNotification(`Excel 파일 다운로드 완료: ${filename}`, 'success');
    } catch (error) {
      console.error('Excel 내보내기 실패:', error);
      showNotification('Excel 파일 내보내기에 실패했습니다.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCSVExport = async () => {
    setLoading(true);
    handleClose();
    
    try {
      exportToCSV({
        metrics: metricsData,
        chartData,
        pieData
      });
      showNotification('CSV 파일 다운로드 완료', 'success');
    } catch (error) {
      console.error('CSV 내보내기 실패:', error);
      showNotification('CSV 파일 내보내기에 실패했습니다.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handlePDFScreenshot = async () => {
    setLoading(true);
    handleClose();
    
    try {
      const filename = await exportDashboardToPDF('dashboard-container', 'dashboard-screenshot');
      showNotification(`PDF 스크린샷 다운로드 완료: ${filename}`, 'success');
    } catch (error) {
      console.error('PDF 스크린샷 실패:', error);
      showNotification('PDF 스크린샷에 실패했습니다.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handlePDFReport = async () => {
    setLoading(true);
    handleClose();
    
    try {
      const filename = exportDataToPDF({
        metrics: metricsData,
        chartData,
        pieData
      });
      showNotification(`PDF 리포트 다운로드 완료: ${filename}`, 'success');
    } catch (error) {
      console.error('PDF 리포트 실패:', error);
      showNotification('PDF 리포트 생성에 실패했습니다.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Button
        variant="contained"
        onClick={handleClick}
        startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <DownloadIcon />}
        disabled={loading}
      >
        {loading ? '내보내는 중...' : '데이터 내보내기'}
      </Button>
      
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <MenuItem onClick={handleExcelExport}>
          <ListItemIcon>
            <ExcelIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Excel 파일로 내보내기</ListItemText>
        </MenuItem>
        
        <MenuItem onClick={handleCSVExport}>
          <ListItemIcon>
            <CsvIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>CSV 파일로 내보내기</ListItemText>
        </MenuItem>
        
        <MenuItem onClick={handlePDFScreenshot}>
          <ListItemIcon>
            <PdfIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>PDF 스크린샷</ListItemText>
        </MenuItem>
        
        <MenuItem onClick={handlePDFReport}>
          <ListItemIcon>
            <PdfIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>PDF 리포트</ListItemText>
        </MenuItem>
      </Menu>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification(prev => ({ ...prev, open: false }))}
      >
        <Alert 
          onClose={() => setNotification(prev => ({ ...prev, open: false }))} 
          severity={notification.severity}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}