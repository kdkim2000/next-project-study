// src/types/index.ts - SQLite에 최적화된 타입 정의

// 제품 타입 (SQLite용 - images가 JSON 문자열)
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  images: string; // SQLite에서는 JSON 문자열로 저장
  categoryId: string;
  category?: Category;
  featured: boolean;
  rating: number;
  reviewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// 프론트엔드에서 사용할 파싱된 제품 타입
export interface ParsedProduct extends Omit<Product, 'images'> {
  images: string[]; // 파싱된 배열 형태
}

// 카테고리 타입
export interface Category {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

// 장바구니 아이템 타입
export interface CartItem {
  id: string;
  productId: string;
  product: ParsedProduct; // 파싱된 제품 정보 사용
  quantity: number;
  sessionId?: string;
}

// 장바구니 컨텍스트 타입
export interface CartContextType {
  items: CartItem[];
  addItem: (product: ParsedProduct, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

// 필터링 옵션 타입
export interface FilterOptions {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'name' | 'price' | 'rating' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  search?: string;
}

// API 응답 타입
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

// 페이지네이션 타입
export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// 제품 목록 API 응답 타입 (파싱된 제품 사용)
export interface ProductListResponse {
  products: ParsedProduct[];
  pagination: PaginationInfo;
}

// SQLite 유틸리티 타입들
export type SQLiteImageData = string; // JSON 문자열
export type ParsedImageData = string[]; // 파싱된 배열

// 이미지 파싱 유틸리티 함수 타입
export interface ImageUtils {
  parseImages: (imagesJson: string) => string[];
  stringifyImages: (images: string[]) => string;
}