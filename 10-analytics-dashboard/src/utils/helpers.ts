// src/utils/helpers.ts - 심플한 헬퍼 함수들

// 숫자를 한국어 형식으로 포맷
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + '백만';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(0) + '천';
  }
  return num.toString();
}

// 퍼센트 변화 색상 결정
export function getChangeColor(change: number): string {
  if (change > 0) return '#4caf50'; // 녹색
  if (change < 0) return '#f44336'; // 빨간색
  return '#757575'; // 회색
}

// 퍼센트 변화 표시 텍스트
export function formatChange(change: number): string {
  const prefix = change > 0 ? '+' : '';
  return `${prefix}${change.toFixed(1)}%`;
}