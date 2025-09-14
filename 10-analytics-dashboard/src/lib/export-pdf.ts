// src/lib/export-pdf.ts - PDF 내보내기 유틸리티
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { MetricData, ChartDataPoint } from '@/data/sampleData';
import { formatNumber } from '@/utils/helpers';

export interface PDFExportData {
  metrics: MetricData[];
  chartData: ChartDataPoint[];
  pieData: ChartDataPoint[];
}

// 한글 폰트를 jsPDF에 등록하는 헬퍼
async function useKoreanFont(pdf: jsPDF) {
  const res = await fetch('/fonts/NotoSansKR-Regular.ttf');
  const fontBuf = await res.arrayBuffer();

  // ArrayBuffer → base64
  const bytes = new Uint8Array(fontBuf);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
  const base64 = btoa(binary);

  // jsPDF VFS에 등록하고 사용
  pdf.addFileToVFS('NotoSansKR.ttf', base64);
  pdf.addFont('NotoSansKR.ttf', 'NotoSansKR', 'normal');
  pdf.setFont('NotoSansKR', 'normal');
}

// 전체 대시보드를 PDF로 내보내기
export async function exportDashboardToPDF(
  elementId: string = 'dashboard-container',
  filename: string = 'dashboard-report'
) {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error('Dashboard container not found');
    }

    // HTML을 캔버스로 변환
    const canvas = await html2canvas(element, {
      scale: 2, // 해상도 향상
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff'
    });

    const imgData = canvas.toDataURL('image/png');
    
    // PDF 생성
    const pdf = new jsPDF({
      orientation: 'landscape', // 가로 방향
      unit: 'mm',
      format: 'a4'
    });

    // 이미지 크기 계산
    const imgWidth = 297; // A4 가로 폭 (mm)
    const pageHeight = 210; // A4 세로 높이 (mm)
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    let position = 0;

    // 첫 페이지
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // 여러 페이지 처리
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // 파일 다운로드
    const fileName = `${filename}_${new Date().toISOString().slice(0, 10)}.pdf`;
    pdf.save(fileName);

    return fileName;
  } catch (error) {
    console.error('PDF 내보내기 실패:', error);
    throw error;
  }
}

// 데이터만으로 PDF 리포트 생성 (한글 폰트 적용)
export async function exportDataToPDF(data: PDFExportData, filename: string = 'data-report') {
  const pdf = new jsPDF();

  // ✅ 한글 폰트 로드/적용
  await useKoreanFont(pdf);

  let yPosition = 20;

  pdf.setFontSize(20);
  pdf.text('Analytics Dashboard Report', 20, yPosition);
  yPosition += 15;

  pdf.setFontSize(10);
  pdf.text(`Generated: ${new Date().toLocaleString('ko-KR')}`, 20, yPosition);
  yPosition += 20;

  pdf.setFontSize(16);
  pdf.text('Key Metrics', 20, yPosition);
  yPosition += 10;

  pdf.setFontSize(10);
  data.metrics.forEach(metric => {
    const text = `${metric.title}: ${formatNumber(metric.value)} (${metric.change > 0 ? '+' : ''}${metric.change}%)`;
    pdf.text(text, 25, yPosition);
    yPosition += 8;
  });

  yPosition += 10;
  pdf.setFontSize(16);
  pdf.text('Monthly Data', 20, yPosition);
  yPosition += 10;

  pdf.setFontSize(10);
  data.chartData.forEach(item => {
    pdf.text(`${item.name}: ${formatNumber(item.value)}`, 25, yPosition);
    yPosition += 6;
    if (yPosition > 270) { pdf.addPage(); yPosition = 20; }
  });

  yPosition += 10;
  if (yPosition > 200) { pdf.addPage(); yPosition = 20; }

  pdf.setFontSize(16);
  pdf.text('Device Distribution', 20, yPosition);
  yPosition += 10;

  pdf.setFontSize(10);
  data.pieData.forEach(item => {
    pdf.text(`${item.name}: ${item.value}%`, 25, yPosition);
    yPosition += 6;
  });

  const fileName = `${filename}_${new Date().toISOString().slice(0, 10)}.pdf`;
  pdf.save(fileName);
  return fileName;
}
