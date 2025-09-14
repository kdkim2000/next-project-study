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

// 화면을 통째로 PDF로 저장 (폭 잘림/페이지 컷 개선 + ARIA 워닝 회피)
export async function exportDashboardToPDF(
  elementId: string = 'dashboard-container',
  filename: string = 'dashboard-report'
) {
  let restoreFns: Array<() => void> = [];
  try {
    const element = document.getElementById(elementId);
    if (!element) throw new Error('Dashboard container not found');

    // 0) 폰트가 다 로드될 때까지 대기 (글꼴 깨짐/흐림 방지)
    if ((document as any).fonts?.ready) {
      await (document as any).fonts.ready;
    }

    // 1) ARIA 경고/오버레이 간섭 방지: 포커스 해제 + 오버레이 숨기기
    const active = document.activeElement as HTMLElement | null;
    if (active?.blur) active.blur();
    restoreFns.push(() => {
      // 별도 복구 필요 없음 (blur는 그대로 둬도 무해)
    });

    const hiddenOverlays: Array<{ el: HTMLElement; display: string }> = [];
    document
      .querySelectorAll<HTMLElement>('.MuiPopover-root, .MuiModal-root, [role="menu"], [role="dialog"]')
      .forEach((el) => {
        hiddenOverlays.push({ el, display: el.style.display });
        el.style.display = 'none';
      });
    restoreFns.push(() => {
      hiddenOverlays.forEach(({ el, display }) => (el.style.display = display));
    });

    // 2) 컨테이너 실제 크기 기준 캡처 (가로 잘림 방지)
    const prevOverflow = element.style.overflow;
    element.style.overflow = 'visible'; // 내부 스크롤로 잘리는 것 방지
    restoreFns.push(() => {
      element.style.overflow = prevOverflow;
    });

    const elWidth = element.scrollWidth;   // 요소 전체 가로 px
    const elHeight = element.scrollHeight; // 요소 전체 세로 px

    // 너무 큰 캔버스 생성 방지 (브라우저 한계 고려)
    const baseScale = Math.max(1, Math.min(2, 4096 / Math.max(1, elWidth)));

    const canvas = await html2canvas(element, {
      scale: baseScale,
      backgroundColor: '#ffffff',
      useCORS: true,
      allowTaint: true,
      windowWidth: elWidth,
      windowHeight: elHeight,
      scrollX: 0,
      scrollY: -window.scrollY,
    });

    // 3) PDF(A4 가로) + 여백 설정
    const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
    const margin = 10; // mm
    const pageW = pdf.internal.pageSize.getWidth();
    const pageH = pdf.internal.pageSize.getHeight();
    const usableW = pageW - margin * 2;
    const usableH = pageH - margin * 2;

    // 4) 페이지별 "슬라이스" 전략 (겹침/빈틈/잘림 방지)
    // - 캔버스 픽셀 ↔ mm 비율 계산
    const imgWmm = usableW;
    const pxPerMm = canvas.width / imgWmm;         // 1mm에 해당하는 캔버스 px
    const pageHeightPx = Math.floor(usableH * pxPerMm); // 한 페이지에 들어갈 px 높이

    // 안전: 최소 1px 이상
    const sliceHeight = Math.max(1, pageHeightPx);

    // 슬라이스를 하나씩 잘라서, 각 페이지에 "정확히" 맞춰 넣음
    for (let y = 0, page = 0; y < canvas.height; y += sliceHeight, page++) {
      // 페이지용 캔버스 생성
      const pageCanvas = document.createElement('canvas');
      pageCanvas.width = canvas.width;
      pageCanvas.height = Math.min(sliceHeight, canvas.height - y);
      const ctx = pageCanvas.getContext('2d')!;
      ctx.drawImage(
        canvas,
        0, y, canvas.width, pageCanvas.height, // 원본에서 잘라올 영역
        0, 0, canvas.width, pageCanvas.height  // 페이지 캔버스에 채우기
      );

      // 페이지 이미지 크기(mm) 계산 (가로 맞춤, 세로 비율 유지)
      const pageImgData = pageCanvas.toDataURL('image/jpeg', 0.95);
      const pageImgHmm = (pageCanvas.height / pxPerMm);

      if (page > 0) pdf.addPage();
      pdf.addImage(pageImgData, 'JPEG', margin, margin, imgWmm, pageImgHmm);
    }

    // 5) 저장
    const fileName = `${filename}_${new Date().toISOString().slice(0, 10)}.pdf`;
    pdf.save(fileName);
    return fileName;
  } catch (error) {
    console.error('PDF 내보내기 실패:', error);
    throw error;
  } finally {
    // 숨김/스타일 원복
    restoreFns.forEach((fn) => {
      try { fn(); } catch {}
    });
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
