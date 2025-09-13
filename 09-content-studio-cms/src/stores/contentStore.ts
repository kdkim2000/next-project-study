// src/stores/contentStore.ts
// Zustand를 사용한 전역 상태 관리 - 콘텐츠 관련 상태

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { Content, ContentListResponse, SearchFilters, ContentStatus, ContentType, LanguageCode } from '../types';

/**
 * 콘텐츠 스토어 상태 인터페이스
 */
interface ContentStore {
  // === 상태 ===
  contents: Content[];              // 현재 로드된 콘텐츠 목록
  selectedContent: Content | null;  // 현재 선택된 콘텐츠 (편집용)
  loading: boolean;                 // 로딩 상태
  error: string | null;             // 오류 메시지
  
  // 필터 및 검색
  filters: SearchFilters;           // 현재 적용된 필터
  searchQuery: string;              // 검색 키워드
  
  // 페이지네이션
  currentPage: number;              // 현재 페이지
  totalPages: number;               // 전체 페이지 수
  itemsPerPage: number;             // 페이지당 항목 수

  // 뷰 설정
  viewMode: 'grid' | 'list';        // 목록 표시 방식
  sortBy: 'createdAt' | 'updatedAt' | 'title'; // 정렬 기준
  sortOrder: 'asc' | 'desc';        // 정렬 방향

  // === 액션 ===
  // 콘텐츠 CRUD
  fetchContents: () => Promise<void>;
  fetchContentById: (id: string) => Promise<void>;
  createContent: (content: Omit<Content, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateContent: (id: string, updates: Partial<Content>) => Promise<void>;
  deleteContent: (id: string) => Promise<void>;

  // 검색 및 필터
  setSearchQuery: (query: string) => void;
  setFilters: (filters: Partial<SearchFilters>) => void;
  clearFilters: () => void;

  // 페이지네이션
  setPage: (page: number) => void;
  setItemsPerPage: (count: number) => void;

  // UI 상태
  setViewMode: (mode: 'grid' | 'list') => void;
  setSorting: (sortBy: ContentStore['sortBy'], sortOrder: ContentStore['sortOrder']) => void;
  setSelectedContent: (content: Content | null) => void;

  // 유틸리티
  resetState: () => void;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
}

/**
 * 기본 필터 설정
 */
const defaultFilters: SearchFilters = {
  query: '',
  type: undefined,
  status: undefined,
  language: undefined,
  tags: [],
  dateFrom: undefined,
  dateTo: undefined,
  author: undefined,
};

/**
 * 콘텐츠 스토어 생성
 * - devtools: Redux DevTools 지원 (개발 중 상태 디버깅)
 * - persist: 일부 설정을 localStorage에 저장
 */
export const useContentStore = create<ContentStore>()(
  devtools(
    persist(
      (set, get) => ({
        // === 초기 상태 ===
        contents: [],
        selectedContent: null,
        loading: false,
        error: null,
        filters: defaultFilters,
        searchQuery: '',
        currentPage: 1,
        totalPages: 1,
        itemsPerPage: 10,
        viewMode: 'grid',
        sortBy: 'createdAt',
        sortOrder: 'desc',

        // === 액션 구현 ===

        /**
         * 콘텐츠 목록 조회
         * API를 호출하여 필터와 페이지네이션이 적용된 콘텐츠 목록을 가져옴
         */
        fetchContents: async () => {
          const { filters, currentPage, itemsPerPage, sortBy, sortOrder } = get();
          
          set({ loading: true, error: null });

          try {
            // API 요청 파라미터 구성
            const params = new URLSearchParams({
              page: currentPage.toString(),
              limit: itemsPerPage.toString(),
              sortBy,
              sortOrder,
            });

            // 필터 조건 추가
            if (filters.query) params.set('query', filters.query);
            if (filters.type) params.set('type', filters.type);
            if (filters.status) params.set('status', filters.status);
            if (filters.language) params.set('language', filters.language);
            if (filters.tags && filters.tags.length > 0) {
              params.set('tags', filters.tags.join(','));
            }

            const response = await fetch(`/api/contents?${params}`);
            
            if (!response.ok) {
              throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data: ContentListResponse = await response.json();

            set({ 
              contents: data.contents,
              totalPages: data.pagination.totalPages,
              loading: false 
            });

          } catch (error) {
            console.error('콘텐츠 조회 실패:', error);
            set({ 
              error: error instanceof Error ? error.message : '콘텐츠를 불러오는데 실패했습니다.',
              loading: false 
            });
          }
        },

        /**
         * 단일 콘텐츠 조회
         */
        fetchContentById: async (id: string) => {
          set({ loading: true, error: null });

          try {
            const response = await fetch(`/api/contents/${id}`);
            
            if (!response.ok) {
              throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            
            if (data.success) {
              set({ selectedContent: data.data, loading: false });
            } else {
              throw new Error(data.message || '콘텐츠를 찾을 수 없습니다.');
            }

          } catch (error) {
            console.error('콘텐츠 조회 실패:', error);
            set({ 
              error: error instanceof Error ? error.message : '콘텐츠를 불러오는데 실패했습니다.',
              loading: false 
            });
          }
        },

        /**
         * 새 콘텐츠 생성
         */
        createContent: async (content) => {
          set({ loading: true, error: null });

          try {
            const response = await fetch('/api/contents', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(content),
            });

            if (!response.ok) {
              throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();

            if (data.success) {
              // 성공 시 목록 새로고침
              await get().fetchContents();
              set({ selectedContent: data.data, loading: false });
            } else {
              throw new Error(data.message || '콘텐츠 생성에 실패했습니다.');
            }

          } catch (error) {
            console.error('콘텐츠 생성 실패:', error);
            set({ 
              error: error instanceof Error ? error.message : '콘텐츠 생성에 실패했습니다.',
              loading: false 
            });
          }
        },

        /**
         * 콘텐츠 업데이트
         */
        updateContent: async (id: string, updates: Partial<Content>) => {
          set({ loading: true, error: null });

          try {
            const response = await fetch(`/api/contents/${id}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(updates),
            });

            if (!response.ok) {
              throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();

            if (data.success) {
              // 로컬 상태 업데이트
              const { contents, selectedContent } = get();
              const updatedContents = contents.map(content => 
                content.id === id ? data.data : content
              );

              set({ 
                contents: updatedContents,
                selectedContent: selectedContent?.id === id ? data.data : selectedContent,
                loading: false 
              });
            } else {
              throw new Error(data.message || '콘텐츠 수정에 실패했습니다.');
            }

          } catch (error) {
            console.error('콘텐츠 수정 실패:', error);
            set({ 
              error: error instanceof Error ? error.message : '콘텐츠 수정에 실패했습니다.',
              loading: false 
            });
          }
        },

        /**
         * 콘텐츠 삭제
         */
        deleteContent: async (id: string) => {
          set({ loading: true, error: null });

          try {
            const response = await fetch(`/api/contents/${id}`, {
              method: 'DELETE',
            });

            if (!response.ok) {
              throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();

            if (data.success) {
              // 로컬 상태에서 제거
              const { contents, selectedContent } = get();
              const filteredContents = contents.filter(content => content.id !== id);

              set({ 
                contents: filteredContents,
                selectedContent: selectedContent?.id === id ? null : selectedContent,
                loading: false 
              });
            } else {
              throw new Error(data.message || '콘텐츠 삭제에 실패했습니다.');
            }

          } catch (error) {
            console.error('콘텐츠 삭제 실패:', error);
            set({ 
              error: error instanceof Error ? error.message : '콘텐츠 삭제에 실패했습니다.',
              loading: false 
            });
          }
        },

        // === UI 상태 관리 ===

        setSearchQuery: (query: string) => {
          set({ searchQuery: query, currentPage: 1 });
          // 검색어 변경 시 자동으로 목록 새로고침
          setTimeout(() => get().fetchContents(), 300); // 디바운싱
        },

        setFilters: (newFilters: Partial<SearchFilters>) => {
          set({ 
            filters: { ...get().filters, ...newFilters },
            currentPage: 1 // 필터 변경 시 첫 페이지로
          });
          get().fetchContents();
        },

        clearFilters: () => {
          set({ 
            filters: defaultFilters,
            searchQuery: '',
            currentPage: 1 
          });
          get().fetchContents();
        },

        setPage: (page: number) => {
          set({ currentPage: page });
          get().fetchContents();
        },

        setItemsPerPage: (count: number) => {
          set({ itemsPerPage: count, currentPage: 1 });
          get().fetchContents();
        },

        setViewMode: (mode: 'grid' | 'list') => {
          set({ viewMode: mode });
        },

        setSorting: (sortBy: ContentStore['sortBy'], sortOrder: ContentStore['sortOrder']) => {
          set({ sortBy, sortOrder, currentPage: 1 });
          get().fetchContents();
        },

        setSelectedContent: (content: Content | null) => {
          set({ selectedContent: content });
        },

        // === 유틸리티 ===

        resetState: () => {
          set({
            contents: [],
            selectedContent: null,
            loading: false,
            error: null,
            filters: defaultFilters,
            searchQuery: '',
            currentPage: 1,
            totalPages: 1,
          });
        },

        setError: (error: string | null) => {
          set({ error });
        },

        setLoading: (loading: boolean) => {
          set({ loading });
        },

      }),
      {
        name: 'content-store',
        // 지속 저장할 설정만 선택
        partialize: (state) => ({
          viewMode: state.viewMode,
          itemsPerPage: state.itemsPerPage,
          sortBy: state.sortBy,
          sortOrder: state.sortOrder,
        }),
      }
    ),
    { name: 'ContentStore' }
  )
);

/**
 * 미디어 파일 관리를 위한 별도 스토어
 */
interface MediaStore {
  files: any[];
  uploading: boolean;
  uploadProgress: number;
  
  uploadFile: (file: File) => Promise<any>;
  deleteFile: (id: string) => Promise<void>;
  fetchFiles: () => Promise<void>;
}

export const useMediaStore = create<MediaStore>()((set, get) => ({
  files: [],
  uploading: false,
  uploadProgress: 0,

  uploadFile: async (file: File) => {
    set({ uploading: true, uploadProgress: 0 });

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/media/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('파일 업로드 실패');
      }

      const data = await response.json();
      
      if (data.success) {
        set({ uploading: false, uploadProgress: 100 });
        get().fetchFiles(); // 목록 새로고침
        return data.data;
      } else {
        throw new Error(data.message);
      }

    } catch (error) {
      set({ uploading: false, uploadProgress: 0 });
      throw error;
    }
  },

  deleteFile: async (id: string) => {
    try {
      const response = await fetch(`/api/media/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('파일 삭제 실패');
      }

      const data = await response.json();
      
      if (data.success) {
        const files = get().files.filter(file => file.id !== id);
        set({ files });
      }

    } catch (error) {
      console.error('파일 삭제 오류:', error);
      throw error;
    }
  },

  fetchFiles: async () => {
    try {
      const response = await fetch('/api/media');
      
      if (!response.ok) {
        throw new Error('파일 목록 조회 실패');
      }

      const data = await response.json();
      
      if (data.success) {
        set({ files: data.data });
      }

    } catch (error) {
      console.error('파일 목록 조회 오류:', error);
    }
  },
}));