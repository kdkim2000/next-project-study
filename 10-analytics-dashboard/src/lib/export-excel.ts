// src/lib/export-excel.ts - ExcelJS를 사용한 안전한 Excel 내보내기
import ExcelJS from 'exceljs';
import { MetricData, ChartDataPoint } from '@/data/sampleData';

export interface ExportData {
  metrics: MetricData[];
  chartData: ChartDataPoint[];
  pieData: ChartDataPoint[];
}

// Excel 파일로 내보내기 (ExcelJS 사용)
export async function exportToExcel(data: ExportData, filename: string = 'dashboard-data') {
  // 워크북 생성
  const workbook = new ExcelJS.Workbook();
  
  // 메타데이터 설정
  workbook.creator = 'Analytics Dashboard Pro';
  workbook.lastModifiedBy = 'System';
  workbook.created = new Date();
  workbook.modified = new Date();

  // 1. 메트릭 데이터 시트
  const metricsSheet = workbook.addWorksheet('주요지표');
  
  // 헤더 설정
  metricsSheet.addRow(['지표명', '현재값', '변화율', '아이콘', '색상']);
  
  // 헤더 스타일
  const headerRow = metricsSheet.getRow(1);
  headerRow.font = { bold: true };
  headerRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFCCCCCC' }
  };

  // 데이터 추가
  data.metrics.forEach(metric => {
    const row = metricsSheet.addRow([
      metric.title,
      metric.value,
      `${metric.change}%`,
      metric.icon,
      metric.color
    ]);
    
    // 숫자 포맷
    if (typeof metric.value === 'number') {
      row.getCell(2).numFmt = '#,##0';
    }
  });

  // 열 너비 자동 조정
  metricsSheet.columns.forEach(column => {
    column.width = 15;
  });

  // 2. 차트 데이터 시트
  const chartSheet = workbook.addWorksheet('월별데이터');
  chartSheet.addRow(['월', '값']);
  
  const chartHeaderRow = chartSheet.getRow(1);
  chartHeaderRow.font = { bold: true };
  chartHeaderRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFCCCCCC' }
  };

  data.chartData.forEach(item => {
    const row = chartSheet.addRow([item.name, item.value]);
    row.getCell(2).numFmt = '#,##0';
  });

  chartSheet.columns.forEach(column => {
    column.width = 15;
  });

  // 3. 파이 차트 데이터 시트
  const pieSheet = workbook.addWorksheet('디바이스별데이터');
  pieSheet.addRow(['디바이스', '비율']);
  
  const pieHeaderRow = pieSheet.getRow(1);
  pieHeaderRow.font = { bold: true };
  pieHeaderRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFCCCCCC' }
  };

  data.pieData.forEach(item => {
    const row = pieSheet.addRow([item.name, item.value]);
    row.getCell(2).numFmt = '0"%"';
  });

  pieSheet.columns.forEach(column => {
    column.width = 15;
  });

  // 4. 요약 시트
  const summarySheet = workbook.addWorksheet('요약');
  summarySheet.addRow(['항목', '값', '단위']);
  
  const summaryHeaderRow = summarySheet.getRow(1);
  summaryHeaderRow.font = { bold: true };
  summaryHeaderRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFCCCCCC' }
  };

  const summaryData = [
    ['총 매출', data.metrics[0]?.value || 0, '원'],
    ['사용자 수', data.metrics[1]?.value || 0, '명'],
    ['주문 수', data.metrics[2]?.value || 0, '건'],
    ['전환율', data.metrics[3]?.value || 0, '%'],
    ['내보내기 일시', new Date().toLocaleString('ko-KR'), '']
  ];

  summaryData.forEach(([item, value, unit]) => {
    const row = summarySheet.addRow([item, value, unit]);
    if (typeof value === 'number') {
      row.getCell(2).numFmt = '#,##0';
    }
  });

  summarySheet.columns.forEach(column => {
    column.width = 20;
  });

  // 파일 다운로드
  const fileName = `${filename}_${new Date().toISOString().slice(0, 10)}.xlsx`;
  
  try {
    // 브라우저에서 파일 다운로드
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
    
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    return fileName;
  } catch (error) {
    console.error('Excel 파일 생성 실패:', error);
    throw new Error('Excel 파일을 생성할 수 없습니다.');
  }
}

// CSV로 내보내기 (변경 없음 - 안전함)
export function exportToCSV(data: ExportData, filename: string = 'dashboard-data') {
  const csvContent = [
    ['구분', '항목', '값', '변화율'],
    ...data.metrics.map(metric => [
      '메트릭',
      metric.title,
      metric.value.toString(),
      `${metric.change}%`
    ]),
    ['', '', '', ''],
    ['구분', '월', '값', ''],
    ...data.chartData.map(item => [
      '월별데이터',
      item.name,
      item.value.toString(),
      ''
    ])
  ];

  const csvString = csvContent
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n');

  const blob = new Blob(['\uFEFF' + csvString], { 
    type: 'text/csv;charset=utf-8;' 
  });
  
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}