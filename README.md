# Next.js 교육 교재 - 10개 실습 프로젝트로 마스터하기

## 교재 구성 철학
React 경험이 없는 팀원들이 Next.js를 통해 현대적인 웹 개발을 학습할 수 있도록, 점진적 난이도의 실습 프로젝트를 중심으로 구성했습니다. 각 프로젝트는 이전 프로젝트의 지식을 바탕으로 새로운 개념을 추가하는 누적 학습 방식을 따릅니다.

## 📚 10개 실습 프로젝트 목차

### 🎯 프로젝트 1: 개인 포트폴리오 웹사이트
**"My Professional Portfolio"**

#### 학습 목표
- Next.js 프로젝트 구조와 개발 환경 설정
- React 컴포넌트 기초 (함수형 컴포넌트)
- JSX 문법과 스타일링 기초

#### 구현 기술
- `create-next-app` 초기 설정
- 파일 기반 라우팅 (App Router)
- CSS Modules / Tailwind CSS
- 정적 페이지 생성
- 이미지 최적화 (`next/image`)
- 메타데이터 설정 (SEO 기초)
- 반응형 디자인
- 다크모드 구현

---

### 🎯 프로젝트 2: 기업 랜딩 페이지
**"Modern Business Landing"**

#### 학습 목표
- 레이아웃과 중첩 라우팅
- Server Components vs Client Components 이해
- 컴포넌트 재사용과 Props

#### 구현 기술
- 공통 레이아웃 (`layout.tsx`)
- Server Components (기본)
- Client Components (`"use client"`)
- Props와 Children 패턴
- 애니메이션 라이브러리 (Framer Motion)
- 폼 처리 (Contact Form)
- 환경 변수 설정
- Google Analytics 연동

---

### 🎯 프로젝트 3: 마크다운 블로그 시스템
**"Developer's Blog Platform"**

#### 학습 목표
- 동적 라우팅과 파라미터 처리
- 파일 시스템 기반 데이터 처리
- 정적 사이트 생성 (SSG)

#### 구현 기술
- 동적 라우트 (`[slug]`)
- `generateStaticParams`
- 마크다운 파싱 (gray-matter, remark)
- 코드 하이라이팅 (Prism.js)
- 카테고리/태그 시스템
- 검색 기능 구현
- RSS 피드 생성
- 읽기 시간 계산

---

### 🎯 프로젝트 4: 실시간 날씨 대시보드
**"Weather Dashboard Pro"**

#### 학습 목표
- 외부 API 연동과 데이터 페칭
- 클라이언트 사이드 상태 관리
- 실시간 데이터 업데이트

#### 구현 기술
- `fetch` API와 데이터 페칭
- React Hooks (`useState`, `useEffect`)
- 에러 핸들링과 로딩 상태
- 데이터 캐싱 전략
- Geolocation API
- 차트 라이브러리 (Chart.js/Recharts)
- Local Storage 활용
- PWA 기능 추가

---

### 🎯 프로젝트 5: 할 일 관리 애플리케이션
**"Task Master Pro"**

#### 학습 목표
- 복잡한 상태 관리
- CRUD 작업 구현
- Server Actions 활용

#### 구현 기술
- Server Actions (Next.js 14+)
- 폼 유효성 검사 (Zod)
- `useFormState`, `useFormStatus`
- Optimistic UI 업데이트
- 드래그 앤 드롭 (dnd-kit)
- 필터링과 정렬
- 데이터 영속성 (SQLite/Prisma)
- 실시간 동기화

---

### 🎯 프로젝트 6: 전자상거래 제품 카탈로그
**"E-Shop Catalog"**

#### 학습 목표
- 데이터베이스 연동
- 동적 데이터 페칭
- 성능 최적화

#### 구현 기술
- Prisma ORM 설정
- PostgreSQL/MySQL 연동
- 동적 라우팅과 쿼리 파라미터
- 페이지네이션
- 무한 스크롤
- 이미지 갤러리
- 장바구니 기능 (Context API)
- 제품 필터링 시스템

---

### 🎯 프로젝트 7: 소셜 인증 회원 시스템
**"Social Auth Hub"**

#### 학습 목표
- 인증과 권한 관리
- 세션 처리
- 보안 best practices

#### 구현 기술
- NextAuth.js v5 (Auth.js)
- OAuth 제공자 (Google, GitHub)
- JWT vs Session 전략
- 미들웨어 (`middleware.ts`)
- Role-based 접근 제어
- 프로필 관리
- 이메일 인증
- Rate Limiting

---

### 🎯 프로젝트 8: 실시간 채팅 애플리케이션
**"Next Chat Live"**

#### 학습 목표
- WebSocket 통신
- 실시간 데이터 동기화
- 복잡한 상태 관리

#### 구현 기술
- Socket.io 통합
- 실시간 메시징
- 온라인 사용자 목록
- 타이핑 인디케이터
- 파일 업로드 (이미지/문서)
- 알림 시스템
- Redis 연동
- 메시지 암호화

---

### 🎯 프로젝트 9: 콘텐츠 관리 시스템 (CMS)
**"Content Studio"**

#### 학습 목표
- 풀스택 애플리케이션 구축
- 관리자 대시보드
- 파일 처리

#### 구현 기술
- 동적 폼 빌더
- 이미지 업로드와 처리
- WYSIWYG 에디터 (TipTap/Slate)
- API Routes (`route.ts`)
- 버전 관리 시스템
- 미리보기 모드
- 다국어 지원 (i18n)
- 백업과 복원

---

### 🎯 프로젝트 10: 엔터프라이즈 대시보드
**"Analytics Dashboard Pro"**

#### 학습 목표
- 대규모 애플리케이션 아키텍처
- 성능 최적화
- 프로덕션 배포

#### 구현 기술
- Partial Prerendering (PPR)
- Streaming SSR
- Parallel Routes
- Intercepting Routes
- 복잡한 데이터 시각화
- Excel/PDF 내보내기
- 성능 모니터링 (Web Vitals)
- Docker 컨테이너화
- CI/CD 파이프라인
- Vercel/AWS 배포

---

## 📖 각 프로젝트별 학습 구조

### 1. 이론적 배경 (Theory)
- 핵심 개념 설명
- 아키텍처 다이어그램
- 코드 패턴 소개

### 2. 단계별 구현 (Step-by-Step)
- 프로젝트 설정
- 기능별 구현 가이드
- 코드 설명과 주석

### 3. 실습 과제 (Exercises)
- 추가 기능 구현
- 버그 수정 챌린지
- 최적화 과제

### 4. 심화 학습 (Advanced)
- 성능 최적화
- 테스팅 추가
- 배포 전략

## 🎓 학습 진행 방식

### 난이도 진행
1. **초급** (프로젝트 1-3): React/Next.js 기초
2. **중급** (프로젝트 4-6): 상태 관리와 데이터 처리
3. **고급** (프로젝트 7-9): 인증과 실시간 기능
4. **전문가** (프로젝트 10): 엔터프라이즈 패턴

### 예상 학습 기간
- 각 프로젝트: 1-2주 (주당 20시간 기준)
- 전체 과정: 3-4개월

### 평가 기준
- 코드 품질과 가독성
- 성능 메트릭 달성
- 테스트 커버리지
- 배포 가능한 완성도

## 🛠 필수 개발 도구
- Node.js 18+ 
- VS Code + 확장 프로그램
- Git & GitHub
- Chrome DevTools
- Postman/Insomnia
- Docker Desktop

## 📚 보충 자료
- Next.js 공식 문서
- React 공식 문서
- MDN Web Docs
- 각 프로젝트별 참고 리포지토리
- 트러블슈팅 가이드

이 교재는 실무에서 바로 활용 가능한 프로젝트들로 구성되어, 학습 과정에서 만든 결과물을 포트폴리오로 활용할 수 있습니다. 각 프로젝트는 점진적으로 복잡도가 증가하며, 최종적으로는 프로덕션 수준의 Next.js 애플리케이션을 개발할 수 있는 역량을 갖추게 됩니다.
