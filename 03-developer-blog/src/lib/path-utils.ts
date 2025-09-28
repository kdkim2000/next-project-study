// src/lib/path-utils.ts
/**
 * GitHub Pages 배포 시 베이스 경로를 올바르게 처리하는 유틸리티
 */

const isProd = process.env.NODE_ENV === 'production';
const basePath = isProd ? process.env.NEXT_PUBLIC_BASE_PATH || '' : '';

/**
 * 경로에 베이스 경로를 추가
 * @param path - 추가할 경로
 * @returns 베이스 경로가 포함된 완전한 경로
 */
export function withBasePath(path: string): string {
  // 이미 베이스 경로가 포함되어 있는지 확인
  if (basePath && path.startsWith(basePath)) {
    return path;
  }
  
  // 경로가 '/'로 시작하지 않으면 추가
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  
  return `${basePath}${normalizedPath}`;
}

/**
 * 정적 파일 경로 생성
 * @param path - 파일 경로
 * @returns 베이스 경로가 포함된 정적 파일 경로
 */
export function getStaticPath(path: string): string {
  return withBasePath(path);
}

/**
 * API 경로 생성 (GitHub Pages에서는 사용 불가하지만 개발 환경에서 유용)
 * @param path - API 경로
 * @returns API 경로
 */
export function getApiPath(path: string): string {
  if (isProd) {
    console.warn('API routes are not available in GitHub Pages static hosting');
    return '';
  }
  return withBasePath(`/api${path}`);
}

/**
 * 현재 환경의 베이스 URL 반환
 */
export function getBaseUrl(): string {
  return process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
}

/**
 * 완전한 URL 생성
 * @param path - 경로
 * @returns 완전한 URL
 */
export function getFullUrl(path: string): string {
  return `${getBaseUrl()}${withBasePath(path)}`;
}