# 🚀 프로젝트 2: 기업 랜딩 페이지 생성 가이드

## 📖 **초보자를 위한 완전 설치 가이드**

이 문서는 **컴퓨터에 아무것도 설치되어 있지 않은 상태**에서 시작하여 프로젝트를 완전히 실행하기까지의 모든 과정을 설명합니다.

---

## 🔧 **1단계: 개발 환경 준비**

### 1️⃣ **Node.js 설치** (필수)

#### Windows 사용자:
1. [Node.js 공식 웹사이트](https://nodejs.org/) 방문
2. **LTS 버전** (안정 버전) 다운로드
3. 다운로드된 `.msi` 파일 실행
4. 설치 마법사의 모든 단계에서 **"Next"** 클릭
5. **"Automatically install the necessary tools"** 체크박스 선택

#### macOS 사용자:
```bash
# Homebrew가 없다면 먼저 설치
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Node.js 설치
brew install node
```

#### 설치 확인:
```bash
# 터미널 또는 명령 프롬프트에서 실행
node --version
npm --version
```

**예상 결과:**
```
v20.10.0 (또는 그 이상)
10.2.3 (또는 그 이상)
```

### 2️⃣ **코드 에디터 설치** (추천: VS Code)

1. [Visual Studio Code](https://code.visualstudio.com/) 다운로드
2. 설치 후 다음 **확장 프로그램** 설치:
   - **ES7+ React/Redux/React-Native snippets**
   - **TypeScript Importer**
   - **Prettier - Code formatter**
   - **Auto Rename Tag**

---

## 🏗️ **2단계: 프로젝트 생성**

### 방법 1: **Next.js CLI 사용** (추천)

```bash
# 1. 프로젝트 생성
npx create-next-app@latest modern-business-landing

# 2. 설정 질문들 (다음과 같이 답변)
✔ Would you like to use TypeScript? … Yes
✔ Would you like to use ESLint? … Yes
✔ Would you like to use Tailwind CSS? … No
✔ Would you like to use `src/` directory? … Yes
✔ Would you like to use App Router? … Yes
✔ Would you like to customize the default import alias (@/*)? … Yes

# 3. 프로젝트 폴더로 이동
cd modern-business-landing
```

### 방법 2: **수동 생성** (학습용)

```bash
# 1. 폴더 생성
mkdir modern-business-landing
cd modern-business-landing

# 2. package.json 초기화
npm init -y

# 3. Next.js와 React 설치
npm install next@latest react@latest react-dom@latest

# 4. TypeScript 설치
npm install -D typescript @types/react @types/node @types/react-dom

# 5. ESLint 설치
npm install -D eslint eslint-config-next
```

---

## 📦 **3단계: MUI 설치**

```bash
# MUI 핵심 패키지 설치
npm install @mui/material @emotion/react @emotion/styled

# MUI 아이콘 설치
npm install @mui/icons-material

# Next.js용 MUI 통합 패키지
npm install @mui/material-nextjs

# Framer Motion (애니메이션용, 선택사항)
npm install framer-motion
```

**설치 확인:**
```bash
# package.json 파일에서 다음 패키지들 확인
npm list --depth=0
```

---

## 📁 **4단계: 프로젝트 구조 생성**

### 폴더 구조 만들기:

```bash
# Windows 명령 프롬프트
mkdir src\app src\components src\lib

# macOS/Linux 터미널
mkdir -p src/app src/components src/lib
```

**최종 구조:**
```
modern-business-landing/
├── src/
│   ├── app/
│   ├── components/
│   └── lib/
├── public/
├── package.json
├── tsconfig.json
├── next.config.js
└── .eslintrc.json
```

---

## 📝 **5단계: 기본 파일 생성**

### 5-1. **package.json 스크립트 추가**

`package.json` 파일을 열고 `scripts` 부분을 다음과 같이 수정:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

### 5-2. **TypeScript 설정 파일 생성**

`tsconfig.json` 파일 생성:

```json
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": false,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### 5-3. **Next.js 설정 파일 생성**

`next.config.js` 파일 생성:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['via.placeholder.com', 'images.unsplash.com'],
  },
};

module.exports = nextConfig;
```

---

## 🎨 **6단계: 핵심 파일 생성**

### 6-1. **MUI 테마 설정**

`src/lib/theme.ts` 파일 생성:

```typescript
'use client';

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", sans-serif',
  },
});

export default theme;
```

### 6-2. **루트 레이아웃 생성**

`src/app/layout.tsx` 파일 생성:

```typescript
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import theme from '@/lib/theme';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Modern Business Landing',
  description: 'Next.js와 MUI로 만든 기업 랜딩 페이지',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
```

### 6-3. **메인 페이지 생성**

`src/app/page.tsx` 파일 생성:

```typescript
import { Container, Typography, Button, Box } from '@mui/material';

export default function Home() {
  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          textAlign: 'center',
          gap: 3,
        }}
      >
        <Typography variant="h1" component="h1" gutterBottom>
          Modern Business
        </Typography>
        
        <Typography variant="h5" color="text.secondary">
          Next.js와 MUI로 만든 현대적인 기업 랜딩 페이지
        </Typography>
        
        <Button variant="contained" size="large">
          시작하기
        </Button>
      </Box>
    </Container>
  );
}
```

---

## 🚀 **7단계: 프로젝트 실행**

### 개발 서버 시작:

```bash
npm run dev
```

**성공 메시지:**
```
> modern-business-landing@1.0.0 dev
> next dev

- ready started server on 0.0.0.0:3000, url: http://localhost:3000
- event compiled client and server successfully in 2.3s
```

### 브라우저에서 확인:

1. 웹브라우저 열기
2. 주소창에 `http://localhost:3000` 입력
3. **"Modern Business"** 제목이 보이면 성공! 🎉

---

## 🔧 **문제 해결 가이드**

### ❌ **자주 발생하는 오류들**

#### 1. **"npm: command not found"**
```bash
# Node.js가 설치되지 않았습니다
# 1단계로 돌아가서 Node.js를 설치하세요
```

#### 2. **"Module not found: Can't resolve '@mui/material'"**
```bash
# MUI가 설치되지 않았습니다
npm install @mui/material @emotion/react @emotion/styled
```

#### 3. **"Error: Cannot find module 'next'"**
```bash
# Next.js가 설치되지 않았습니다
npm install next@latest react@latest react-dom@latest
```

#### 4. **포트 3000이 이미 사용중**
```bash
# 다른 포트 사용
npm run dev -- -p 3001

# 또는 기존 프로세스 종료 (Windows)
netstat -ano | findstr :3000
taskkill /PID [PID번호] /F

# macOS/Linux
lsof -ti:3000 | xargs kill -9
```

#### 5. **TypeScript 오류들**
```bash
# TypeScript 의존성 재설치
npm install -D typescript @types/react @types/node @types/react-dom
```

#### 6. **MUI AppRouterCacheProvider 오류**
```bash
# 오류: Cannot read properties of undefined (reading 'call')

# 해결책 1: 간단한 방법 (추천)
# layout.tsx에서 AppRouterCacheProvider 제거하고 기본 설정만 사용

# 해결책 2: MUI 패키지 재설치
npm uninstall @mui/material-nextjs
npm install @mui/material@latest @mui/icons-material@latest
```

**자세한 MUI 오류 해결은 `TROUBLESHOOTING.md` 파일을 참고하세요.**

---

## 📚 **8단계: 완전한 프로젝트로 업그레이드**

기본 구조가 완성되었다면, 이제 [완전한 프로젝트 파일들](computer:///mnt/user-data/outputs/project-2-business-landing)을 복사해서 붙여넣으세요.

### 업그레이드 방법:

1. **기존 파일 백업** (선택사항)
2. **새 컴포넌트들 추가**:
   - `src/components/Header.tsx`
   - `src/components/HeroSection.tsx`
   - `src/components/ServicesSection.tsx`
   - `src/components/ContactSection.tsx`
   - `src/components/Footer.tsx`
3. **page.tsx 업데이트**
4. **개발 서버 재시작**

---

## ✅ **완료 체크리스트**

프로젝트 생성이 완료되었는지 확인해보세요:

- [ ] Node.js와 npm 설치 완료
- [ ] VS Code 설치 및 확장 프로그램 설치
- [ ] Next.js 프로젝트 생성
- [ ] MUI 패키지 설치
- [ ] 기본 파일들 생성 (layout.tsx, page.tsx 등)
- [ ] 개발 서버 실행 성공
- [ ] 브라우저에서 페이지 확인
- [ ] TypeScript 오류 없음

---

## 🎯 **다음 단계**

기본 프로젝트가 실행되면:

1. **컴포넌트 추가** - Header, Footer 등
2. **스타일링 개선** - MUI 테마 커스터마이징
3. **기능 확장** - 폼 처리, 애니메이션 등
4. **배포 준비** - Vercel, Netlify 등

---

## 🆘 **도움이 필요할 때**

### 공식 문서:
- [Next.js 공식 문서](https://nextjs.org/docs)
- [MUI 시작하기](https://mui.com/material-ui/getting-started/)
- [Node.js 설치 가이드](https://nodejs.org/en/download/)

### 커뮤니티:
- Next.js Discord
- React 한국 사용자 그룹
- 스택 오버플로우

---

**축하합니다! 🎉 이제 Next.js와 MUI로 현대적인 웹 개발을 시작할 준비가 되었습니다.**

*문제가 발생하면 각 단계를 천천히 다시 확인해보세요. 대부분의 오류는 설치나 파일 경로 문제입니다.*
