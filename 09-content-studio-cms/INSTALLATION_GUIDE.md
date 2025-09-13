# 🚀 Content Studio CMS 설치 가이드

React 19와의 호환성 문제를 해결하고 CMS를 성공적으로 설치하는 방법을 안내합니다.

## ❗ React 19 호환성 문제

현재 `react-quill@2.0.0`이 React 19와 완전히 호환되지 않습니다. 다음 해결 방법 중 하나를 선택하세요.

## 🔧 해결 방법 1: Legacy Peer Deps 사용 (권장)

가장 간단하고 안전한 방법입니다.

```bash
# 1. 기존 node_modules 제거
rm -rf node_modules package-lock.json

# 2. legacy-peer-deps로 설치
npm install --legacy-peer-deps

# 또는 package.json에 추가된 스크립트 사용
npm run install:force
```

## 🔧 해결 방법 2: 네이티브 에디터 사용

React 19와 완전히 호환되는 자체 구현 에디터를 사용합니다.

### 2-1. 의존성 설치 (react-quill 제외)

```bash
npm install @mui/material @emotion/react @emotion/styled @mui/lab @mui/icons-material @mui/x-date-pickers zustand react-hook-form @hookform/resolvers yup multer better-sqlite3 react-i18next i18next date-fns uuid @types/multer @types/better-sqlite3 @types/uuid
```

### 2-2. 에디터 컴포넌트 교체

`src/components/ContentForm.tsx`에서 에디터 import를 변경하세요:

```typescript
// 기존
import WysiwygEditor from './WysiwygEditor';

// 변경
import WysiwygEditor from './WysiwygEditorAlternative';
```

## 🔧 해결 방법 3: React 18로 다운그레이드

React 버전을 18로 낮추는 방법입니다.

```bash
# React 18로 다운그레이드
npm install react@^18.2.0 react-dom@^18.2.0 @types/react@^18.2.0 @types/react-dom@^18.2.0

# 의존성 설치
npm install
```

## 📦 완전한 설치 순서

### 1단계: 프로젝트 생성

```bash
# Next.js 프로젝트 생성
npx create-next-app@latest content-studio-cms

# 설정 선택:
# ✅ Would you like to use TypeScript? → Yes
# ✅ Would you like to use ESLint? → Yes  
# ❌ Would you like to use Tailwind CSS? → No (Material-UI 사용)
# ✅ Would you like to use `src/` directory? → Yes
# ✅ Would you like to use App Router? → Yes
# ❌ Would you like to customize the default import alias? → No

cd content-studio-cms
```

### 2단계: package.json 교체

제공된 `package.json` 파일로 교체한 후:

```bash
# 방법 1: Legacy peer deps 사용 (권장)
npm install --legacy-peer-deps

# 또는 방법 2: 강제 설치
npm install --force
```

### 3단계: 모든 소스 파일 복사

제공된 모든 파일들을 해당 위치에 복사하세요:

```
src/
├── app/
├── components/
├── lib/
├── stores/
└── types/
```

### 4단계: 개발 서버 시작

```bash
npm run dev
```

## 🎯 각 방법의 장단점

### Legacy Peer Deps (권장)
- ✅ 설치 간편함
- ✅ react-quill의 모든 기능 사용 가능
- ⚠️ peer dependency 경고 메시지 표시

### 네이티브 에디터
- ✅ React 19 완벽 호환
- ✅ 의존성 문제 없음
- ✅ 커스터마이징 용이
- ⚠️ react-quill 일부 고급 기능 제한

### React 18 다운그레이드
- ✅ 모든 라이브러리 호환
- ⚠️ React 19 신기능 사용 불가

## 🐛 설치 중 문제 해결

### Node.js 버전 확인

```bash
node --version  # 18.x 이상 권장
npm --version   # 9.x 이상 권장
```

### 캐시 정리

```bash
# npm 캐시 정리
npm cache clean --force

# node_modules 완전 제거 후 재설치
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

### TypeScript 오류 해결

```bash
# TypeScript 타입 확인
npx tsc --noEmit
```

### SQLite 설치 문제 (Windows)

Windows에서 better-sqlite3 설치 시 문제가 발생할 경우:

```bash
# Visual Studio Build Tools 필요
npm install --global windows-build-tools

# 또는 Python 설치
npm install --global --production windows-build-tools
```

## 🔍 설치 확인

설치가 완료되면 다음을 확인하세요:

1. **개발 서버 실행**: `http://localhost:3000`
2. **관리자 접속**: `http://localhost:3000/admin`
3. **기본 계정**: ID: `admin`, PW: `admin123`

## 📋 설치 후 체크리스트

- [ ] 홈페이지 정상 로드
- [ ] 관리자 대시보드 접속 가능
- [ ] 새 콘텐츠 작성 페이지 동작
- [ ] 에디터 툴바 기능 테스트
- [ ] 이미지 업로드 테스트
- [ ] 콘텐츠 저장/불러오기 테스트

## 🆘 지원

설치 중 문제가 발생하면:

1. **콘솔 에러 확인**: 브라우저 개발자 도구 Console 탭
2. **네트워크 상태**: Network 탭에서 API 호출 확인
3. **서버 로그**: 터미널에서 서버 에러 메시지 확인

## 🎓 학습 팁

설치 완료 후 다음 순서로 학습하는 것을 권장합니다:

1. **프로젝트 구조 파악** (30분)
2. **홈페이지와 관리자 페이지 탐색** (30분)
3. **첫 콘텐츠 작성해보기** (30분)
4. **코드 구조 분석** (1시간)
5. **커스터마이징 시도** (2시간)

---

**성공적인 설치를 위해 이 가이드를 단계별로 따라해주세요! 🚀**