# 🎓 E-Shop Catalog 학습 가이드

이 프로젝트는 **React와 Next.js 초보자**를 위한 실습 프로젝트입니다. 
각 기능을 단계별로 학습할 수 있도록 구성되어 있습니다.

## 📚 학습 목표 체크리스트

### 1. 데이터베이스 연동 ✅
- **학습 파일**: `prisma/schema.prisma`, `src/lib/prisma.ts`
- **핵심 개념**: Prisma ORM, SQLite, 데이터 모델링
- **실습 내용**: 
  - 데이터베이스 스키마 정의
  - Prisma 클라이언트 설정
  - 데이터 생성/조회/수정/삭제 (CRUD)

### 2. 동적 데이터 페칭 ✅
- **학습 파일**: `src/app/api/products/route.ts`, `src/app/page.tsx`
- **핵심 개념**: API Routes, fetch(), 비동기 처리, 상태 관리
- **실습 내용**:
  - Next.js API Routes 작성
  - 클라이언트에서 데이터 가져오기
  - 로딩/에러 상태 처리

### 3. 성능 최적화 ✅
- **학습 파일**: `src/components/ProductCard.tsx`, `src/components/InfiniteScrollProducts.tsx`
- **핵심 개념**: React.memo, useCallback, Next.js Image, Intersection Observer
- **실습 내용**:
  - 컴포넌트 최적화 (memo, callback)
  - 이미지 최적화 및 lazy loading
  - 메모리 효율적인 무한 스크롤

### 4. Prisma ORM 설정 ✅
- **학습 파일**: `prisma/schema.prisma`, `prisma/seed.ts`
- **핵심 개념**: 스키마 정의, 마이그레이션, 시드 데이터
- **실습 내용**:
  - 관계형 데이터 모델링
  - 데이터베이스 초기화
  - 샘플 데이터 생성

### 5. 동적 라우팅과 쿼리 파라미터 ✅
- **학습 파일**: `src/app/products/[id]/page.tsx`, `src/app/api/products/route.ts`
- **핵심 개념**: Dynamic Routes, URL 파라미터, Query Params
- **실습 내용**:
  - `/products/[id]` 동적 경로
  - URL에서 파라미터 추출
  - 검색/필터링 쿼리 처리

### 6. 페이지네이션 ✅
- **학습 파일**: `src/components/Pagination.tsx`
- **핵심 개념**: 데이터 분할, 페이지 네비게이션, UX
- **실습 내용**:
  - 페이지 단위 데이터 로딩
  - 페이지 네비게이션 UI
  - 페이지 크기 변경

### 7. 무한 스크롤 ✅
- **학습 파일**: `src/components/InfiniteScrollProducts.tsx`
- **핵심 개념**: Intersection Observer API, 무한 로딩, 성능 최적화
- **실습 내용**:
  - 스크롤 감지 구현
  - 점진적 데이터 로딩
  - 사용자 경험 개선

### 8. 이미지 갤러리 ✅
- **학습 파일**: `src/app/products/[id]/page.tsx`, `src/components/ProductCard.tsx`
- **핵심 개념**: Next.js Image, 이미지 최적화, 갤러리 UI
- **실습 내용**:
  - 메인 이미지 + 썸네일 구조
  - 이미지 로딩 상태 처리
  - 이미지 최적화 적용

### 9. 장바구니 기능 (Context API) ✅
- **학습 파일**: `src/contexts/CartContext.tsx`, `src/components/Header.tsx`
- **핵심 개념**: React Context, useReducer, 전역 상태 관리
- **실습 내용**:
  - Context Provider 설정
  - 장바구니 상태 관리
  - 로컬 스토리지 연동

### 10. 제품 필터링 시스템 ✅
- **학습 파일**: `src/components/ProductFilter.tsx`
- **핵심 개념**: 조건부 쿼리, 필터 UI, 검색 기능
- **실습 내용**:
  - 카테고리/가격/검색 필터
  - 정렬 기능
  - 필터 초기화

## 🎯 학습 순서 추천

### 초급 (1-3주차)
1. **데이터베이스 기초** → Prisma 설정 및 기본 CRUD
2. **페이지 구조** → Layout, 기본 컴포넌트 이해
3. **API 연동** → 간단한 데이터 fetch 및 표시

### 중급 (4-6주차)
4. **동적 라우팅** → 제품 상세 페이지 구현
5. **상태 관리** → Context API로 장바구니 기능
6. **필터링** → 검색 및 카테고리 필터 구현

### 고급 (7-8주차)
7. **성능 최적화** → memo, callback, 이미지 최적화
8. **무한 스크롤** → Intersection Observer 활용

## 🔧 실습 방법

### 1. 코드 읽기 연습
```typescript
// 각 파일의 주석을 꼼꼼히 읽어보세요
/**
 * 이런 형태의 JSDoc 주석은 함수의 역할을 설명합니다
 * @param product - 제품 정보 객체
 * @returns JSX 엘리먼트
 */
```

### 2. 기능별 실험
```bash
# 기능을 하나씩 주석 처리하고 어떻게 동작하는지 확인
# npm run dev 후 브라우저에서 변경사항 확인
```

### 3. 새로운 기능 추가 실습
- 제품 리뷰 시스템 추가
- 위시리스트 기능 구현
- 최근 본 제품 기능
- 사용자 인증 시스템

### 4. 디버깅 연습
```bash
# 데이터베이스 상태 확인
npm run db:check

# 브라우저 개발자 도구 활용
# Network 탭에서 API 호출 확인
# Console에서 에러 메시지 확인
```

## 📖 추가 학습 리소스

### 공식 문서
- [Next.js 공식 문서](https://nextjs.org/docs)
- [React 공식 문서](https://react.dev)
- [Prisma 공식 문서](https://www.prisma.io/docs)
- [Material-UI 공식 문서](https://mui.com)

### 핵심 개념별 학습 포인트

#### Context API 심화
```typescript
// src/contexts/CartContext.tsx 파일에서
// useReducer 패턴을 자세히 관찰하세요
const [state, dispatch] = useReducer(cartReducer, { items: [] });
```

#### Next.js App Router
```typescript
// src/app 폴더 구조를 통해
// 파일 기반 라우팅 시스템을 이해하세요
```

#### TypeScript 활용
```typescript
// src/types/index.ts 파일에서
// 인터페이스와 타입 정의 방법을 학습하세요
```

## 🚀 확장 과제

### 기초 과제
1. 새로운 카테고리 추가하기
2. 제품 카드 디자인 변경하기
3. 새로운 정렬 옵션 추가하기

### 중급 과제
1. 제품 리뷰 시스템 구현
2. 쿠폰/할인 시스템 추가
3. 관리자 페이지 구현

### 고급 과제
1. 실시간 재고 업데이트
2. 결제 시스템 연동
3. PWA로 변환
4. 다국어 지원

## 💡 학습 팁

### 1. 단계별 접근
- 한 번에 모든 기능을 이해하려 하지 마세요
- 하나의 컴포넌트씩 천천히 분석하세요

### 2. 실험 정신
- 코드를 수정해보고 어떤 변화가 있는지 확인하세요
- 에러가 나도 당황하지 마세요 - 학습 과정입니다!

### 3. 문서화 습관
- 이해한 내용을 메모하세요
- 어려웠던 부분과 해결 방법을 기록하세요

### 4. 커뮤니티 활용
- 막히는 부분이 있으면 검색하고 질문하세요
- GitHub Issues, Stack Overflow 등을 활용하세요

---

**이 프로젝트를 통해 현업에서 바로 사용할 수 있는 React/Next.js 개발 역량을 기르실 수 있습니다!** 🎉