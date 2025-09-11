# Task Master Pro - 할 일 관리 애플리케이션

React와 Next.js를 처음 접하는 분들을 위한 완성도 높은 할 일 관리 애플리케이션입니다.

## 🚀 프로젝트 설정 및 실행 방법

### 1. 프로젝트 생성 및 설치

```bash
# Next.js 프로젝트 생성 (이미 생성된 경우 생략)
npx create-next-app@latest 05-task-master-pro --typescript --eslint --app --src-dir

# 프로젝트 디렉토리로 이동
cd 05-task-master-pro

# 의존성 패키지 설치
npm install @mui/material @emotion/react @emotion/styled @mui/icons-material @mui/material-nextjs @mui/system @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities @prisma/client zod

# 개발 의존성 패키지 설치
npm install -D prisma sqlite3 tsx @types/node @types/react @types/react-dom
```

### 2. 환경 변수 설정

```bash
# .env 파일 생성 (.env.example을 참고)
cp .env.example .env
```

### 3. 데이터베이스 설정

```bash
# Prisma 클라이언트 생성
npm run prisma:generate

# 데이터베이스 생성 및 마이그레이션
npm run db:migrate

# 샘플 데이터 삽입
npm run db:seed
```

### 4. 개발 서버 실행

```bash
# 개발 서버 시작
npm run dev
```

브라우저에서 `http://localhost:3000`으로 접속하면 애플리케이션을 확인할 수 있습니다.

## 🔧 문제 해결

### 빌드 오류 발생 시
```bash
# 전체 재설치
rm -rf node_modules package-lock.json
npm install

# 데이터베이스 재설정
npm run db:reset
npm run db:seed

# TypeScript 검사
npm run build
```

### 데이터베이스 관련 오류
```bash
# 데이터베이스 파일 삭제 후 재생성
rm prisma/dev.db*
npm run db:push
npm run db:seed
```

## 📁 프로젝트 구조 설명

```
05-task-master-pro/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx         # 루트 레이아웃
│   │   └── page.tsx           # 메인 페이지
│   ├── components/            # 재사용 가능한 컴포넌트
│   │   ├── ThemeProvider.tsx  # Material-UI 테마 설정
│   │   ├── TaskForm.tsx       # 할 일 생성/수정 폼
│   │   ├── TaskCard.tsx       # 할 일 카드 (수정됨)
│   │   ├── TaskList.tsx       # 할 일 목록 (드래그앤드롭)
│   │   └── FilterAndSort.tsx  # 필터링 및 정렬
│   ├── lib/                   # 유틸리티 및 설정
│   │   ├── db.ts             # 데이터베이스 연결
│   │   ├── actions.ts        # Server Actions
│   │   ├── validations.ts    # Zod 유효성 검사
│   │   └── utils.ts          # 유틸리티 함수
│   └── types/                # TypeScript 타입 정의
│       └── index.ts
├── prisma/                   # 데이터베이스 관련
│   ├── schema.prisma        # 데이터베이스 스키마
│   └── seed.ts             # 시드 데이터
├── .env.example             # 환경 변수 예제 (새로 추가)
├── .gitignore              # Git 무시 파일 (새로 추가)
├── next.config.js          # Next.js 설정 (새로 추가)
├── tsconfig.json           # TypeScript 설정 (새로 추가)
├── eslint.config.mjs       # ESLint 설정
└── package.json           # 프로젝트 설정
```

## ✅ 주요 수정사항

### 1. TaskCard.tsx 오류 수정
- 끊어진 주석 블록 완전히 수정
- 모든 JSX 구조 완성

### 2. 새로운 설정 파일들 추가
- `tsconfig.json`: TypeScript 컴파일러 설정
- `next.config.js`: Next.js 최적화 설정
- `.env.example`: 환경 변수 예제
- `.gitignore`: Git 버전 관리 제외 파일

### 3. 에러 핸들링 개선
- 드래그 앤 드롭 에러 처리 추가
- 안전한 타입 체크
- 사용하지 않는 import 정리

## 🛠 주요 기능 (수정됨)

### 1. CRUD 작업 (생성, 읽기, 수정, 삭제) ✅
- Server Actions를 사용한 안정적인 서버사이드 처리
- 완벽한 에러 핸들링과 사용자 피드백
- Zod를 활용한 강력한 폼 유효성 검사

### 2. 드래그 앤 드롭 ✅
- @dnd-kit을 사용한 부드러운 드래그 앤 드롭
- 안전한 에러 처리와 상태 복원
- 시각적 피드백과 애니메이션

### 3. 필터링 및 정렬 ✅
- 실시간 검색과 디바운싱
- 다중 조건 필터링
- 직관적인 UI/UX

### 4. 반응형 디자인 ✅
- Material-UI 기반 현대적 디자인
- 모든 디바이스 대응
- 접근성 고려

## 📚 사용된 기술 스택

### Frontend
- **Next.js 15**: 최신 React 프레임워크
- **React 19**: 최신 React 버전
- **TypeScript**: 완전한 타입 안정성
- **Material-UI v7**: 최신 UI 컴포넌트
- **@dnd-kit**: 현대적 드래그 앤 드롭

### Backend & Database
- **Next.js Server Actions**: 타입 안전한 서버사이드 로직
- **Prisma**: 타입 안전한 ORM
- **SQLite**: 간단한 로컬 데이터베이스
- **Zod**: 런타임 타입 검증

## 🔧 추가 npm 스크립트

```bash
# 데이터베이스 관리
npm run db:studio      # 데이터베이스 시각적 관리 도구
npm run db:push        # 스키마 푸시 (마이그레이션 없이)
npm run db:reset       # 데이터베이스 완전 초기화

# 코드 품질
npm run lint           # ESLint 검사
npm run build          # 프로덕션 빌드
npm run start          # 프로덕션 서버 실행
```

## 📋 개발 팁

### 1. 개발 환경 설정
- Node.js 18+ 필수
- VS Code 권장 (TypeScript IntelliSense)
- Prisma 확장 설치 권장

### 2. 데이터베이스 관리
```bash
# 데이터 확인
npm run db:studio

# 스키마 변경 후
npm run prisma:generate
npm run db:push
```

### 3. 타입스크립트 활용
- 모든 컴포넌트에 명확한 타입 정의
- Prisma가 자동 생성하는 타입 활용
- Zod 스키마로 런타임 검증

## 🚨 주의사항

1. **TypeScript 엄격 모드**: 모든 타입이 명확히 정의되어 있습니다.
2. **데이터베이스**: SQLite 파일은 git에서 제외됩니다.
3. **환경 변수**: `.env` 파일을 생성하여 사용하세요.
4. **Node.js 버전**: 18.0.0 이상 필요합니다.

## 🎯 학습 포인트

### 1. Next.js App Router
- 서버 컴포넌트와 클라이언트 컴포넌트 구분
- Server Actions의 올바른 사용법
- 최신 Next.js 기능 활용

### 2. TypeScript 활용
- 엄격한 타입 체크
- Prisma 타입 시스템
- 컴포넌트 Props 타입 정의

### 3. 상태 관리
- React 19의 최신 훅들
- Optimistic UI 패턴
- 서버-클라이언트 동기화

이제 모든 오류가 수정되어 정상적으로 빌드되고 실행됩니다! 🎉