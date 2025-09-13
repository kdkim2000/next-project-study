// src/types/index.ts
// TypeScript 타입 정의 파일 - CMS에서 사용하는 모든 타입들을 정의

/**
 * 콘텐츠 상태 - 콘텐츠의 현재 상태를 나타냄
 */
export type ContentStatus = 'draft' | 'published' | 'archived';

/**
 * 콘텐츠 타입 - 다양한 종류의 콘텐츠 유형
 */
export type ContentType = 'article' | 'page' | 'blog' | 'news';

/**
 * 언어 코드 - 다국어 지원을 위한 언어 식별자
 */
export type LanguageCode = 'ko' | 'en' | 'ja';

/**
 * 미디어 파일 인터페이스
 * - 업로드된 이미지나 파일의 정보를 담는 구조
 */
export interface MediaFile {
  id: string;                    // 파일 고유 ID
  filename: string;              // 원본 파일명
  originalName: string;          // 사용자가 업로드한 원본 이름
  mimeType: string;             // 파일 MIME 타입 (image/jpeg 등)
  size: number;                 // 파일 크기 (바이트)
  url: string;                  // 파일 접근 URL
  uploadedAt: string;           // 업로드 일시 (ISO 문자열)
  uploadedBy: string;           // 업로드한 사용자 ID
}

/**
 * 콘텐츠 메타데이터
 * - SEO와 소셜 미디어 공유를 위한 메타 정보
 */
export interface ContentMeta {
  title?: string;               // 메타 제목 (SEO용)
  description?: string;         // 메타 설명 (SEO용)  
  keywords?: string[];          // 키워드 배열
  author?: string;              // 작성자
  featuredImage?: string;       // 대표 이미지 URL
  socialTitle?: string;         // 소셜 미디어용 제목
  socialDescription?: string;   // 소셜 미디어용 설명
}

/**
 * 콘텐츠 버전 정보
 * - 콘텐츠의 변경 이력을 추적하는 버전 관리
 */
export interface ContentVersion {
  id: string;                   // 버전 고유 ID
  contentId: string;            // 원본 콘텐츠 ID
  version: number;              // 버전 번호 (1, 2, 3...)
  title: string;                // 해당 버전의 제목
  content: string;              // 해당 버전의 내용
  meta: ContentMeta;            // 해당 버전의 메타데이터
  createdAt: string;            // 버전 생성 일시
  createdBy: string;            // 버전 생성자
  changeNote?: string;          // 변경 사항 메모
}

/**
 * 메인 콘텐츠 인터페이스
 * - CMS의 핵심 콘텐츠 데이터 구조
 */
export interface Content {
  id: string;                   // 콘텐츠 고유 ID
  title: string;                // 콘텐츠 제목
  slug: string;                 // URL용 슬러그 (예: "my-first-post")
  content: string;              // 콘텐츠 본문 (HTML)
  excerpt?: string;             // 콘텐츠 요약 (목록용)
  type: ContentType;            // 콘텐츠 유형
  status: ContentStatus;        // 현재 상태
  language: LanguageCode;       // 언어
  
  // 메타데이터
  meta: ContentMeta;            // SEO 및 소셜 미디어 정보
  
  // 날짜 정보
  createdAt: string;            // 생성 일시
  updatedAt: string;            // 최종 수정 일시
  publishedAt?: string;         // 발행 일시
  
  // 작성자 정보
  createdBy: string;            // 생성자 ID
  updatedBy: string;            // 최종 수정자 ID
  
  // 버전 관리
  currentVersion: number;       // 현재 버전 번호
  versions?: ContentVersion[];  // 이전 버전들 (옵셔널)
  
  // 추가 설정
  allowComments?: boolean;      // 댓글 허용 여부
  featuredOrder?: number;       // 추천 콘텐츠 순서
  tags?: string[];              // 태그 배열
}

/**
 * 사용자 인터페이스
 * - CMS 사용자 정보 (간단한 버전)
 */
export interface User {
  id: string;                   // 사용자 고유 ID
  username: string;             // 사용자명
  email: string;                // 이메일 주소
  displayName: string;          // 화면에 표시될 이름
  role: 'admin' | 'editor' | 'viewer'; // 사용자 권한
  createdAt: string;            // 가입 일시
  lastLoginAt?: string;         // 마지막 로그인 일시
  isActive: boolean;            // 계정 활성화 상태
}

/**
 * API 응답 래퍼 인터페이스
 * - API 호출 결과를 일관된 형식으로 반환
 */
export interface ApiResponse<T = any> {
  success: boolean;             // 성공 여부
  data?: T;                     // 응답 데이터
  message?: string;             // 성공/오류 메시지
  error?: string;               // 오류 상세 내용
  code?: number;                // HTTP 상태 코드
}

/**
 * 페이지네이션 정보
 * - 목록 조회 시 사용하는 페이징 정보
 */
export interface PaginationInfo {
  page: number;                 // 현재 페이지 (1부터 시작)
  limit: number;                // 페이지당 항목 수
  total: number;                // 전체 항목 수
  totalPages: number;           // 전체 페이지 수
  hasNext: boolean;             // 다음 페이지 존재 여부
  hasPrev: boolean;             // 이전 페이지 존재 여부
}

/**
 * 콘텐츠 목록 응답
 * - 콘텐츠 목록 조회 API 응답 타입
 */
export interface ContentListResponse {
  contents: Content[];          // 콘텐츠 배열
  pagination: PaginationInfo;   // 페이지네이션 정보
}

/**
 * 검색 필터 옵션
 * - 콘텐츠 검색 시 사용하는 필터 조건
 */
export interface SearchFilters {
  query?: string;               // 검색 키워드
  type?: ContentType;           // 콘텐츠 유형 필터
  status?: ContentStatus;       // 상태 필터
  language?: LanguageCode;      // 언어 필터
  tags?: string[];              // 태그 필터
  dateFrom?: string;            // 시작 날짜
  dateTo?: string;              // 종료 날짜
  author?: string;              // 작성자 필터
}

/**
 * 폼 필드 타입
 * - 동적 폼 빌더에서 사용하는 필드 유형
 */
export type FormFieldType = 
  | 'text'          // 텍스트 입력
  | 'textarea'      // 여러 줄 텍스트
  | 'select'        // 선택 박스
  | 'checkbox'      // 체크박스
  | 'radio'         // 라디오 버튼
  | 'date'          // 날짜 선택
  | 'file'          // 파일 업로드
  | 'wysiwyg';      // 위지윅 에디터

/**
 * 동적 폼 필드 설정
 * - 폼 빌더에서 각 필드의 설정 정보
 */
export interface FormField {
  id: string;                   // 필드 고유 ID
  name: string;                 // 필드 이름 (form name 속성)
  label: string;                // 필드 라벨
  type: FormFieldType;          // 필드 유형
  required: boolean;            // 필수 여부
  placeholder?: string;         // placeholder 텍스트
  defaultValue?: any;           // 기본값
  options?: Array<{             // select, radio용 옵션들
    value: string;
    label: string;
  }>;
  validation?: {                // 유효성 검사 규칙
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
  order: number;                // 필드 정렬 순서
}

/**
 * 백업 데이터 구조
 * - 시스템 백업 시 사용하는 데이터 형식
 */
export interface BackupData {
  version: string;              // 백업 버전
  timestamp: string;            // 백업 일시
  contents: Content[];          // 모든 콘텐츠
  users: User[];                // 모든 사용자
  mediaFiles: MediaFile[];      // 모든 미디어 파일
  metadata: {                   // 백업 메타데이터
    totalContents: number;
    totalUsers: number;
    totalMediaFiles: number;
    backupSize: number;         // 백업 크기 (바이트)
  };
}