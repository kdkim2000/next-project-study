# 🔧 문제 해결 가이드 (Troubleshooting Guide)

## ❌ Webpack 오류 해결

### **오류 메시지**
```
webpack.js:1 Uncaught TypeError: Cannot read properties of undefined (reading 'call')
```

### **🔍 원인 분석**
이 오류는 주로 다음과 같은 이유로 발생합니다:

1. **MUI 버전 호환성 문제** - Next.js 15와 MUI v6/v7 간의 충돌
2. **AppRouterCacheProvider 설정 문제** - 캐시 프로바이더 버전 불일치  
3. **Framer Motion 버전 문제** - 과도한 최신 버전 사용
4. **Grid 시스템 문법 불일치** - MUI v5 vs v6+ 문법 혼재

### **✅ 해결 방법**

#### **1. 안정적인 버전으로 다운그레이드**

```bash
# 기존 패키지 제거
npm uninstall @mui/material @mui/system @mui/icons-material next framer-motion

# 안정적인 버전으로 재설치
npm install next@^14.2.15 react@^18.3.1 react-dom@^18.3.1
npm install @mui/material@^5.16.7 @mui/system@^5.16.7 @mui/icons-material@^5.16.7
npm install @mui/material-nextjs@^5.16.6
npm install @emotion/react@^11.11.4 @emotion/styled@^11.11.5 @emotion/cache@^11.11.0
npm install framer-motion@^10.18.0
```

#### **2. layout.tsx 수정**

```tsx
// src/app/layout.tsx
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
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

#### **3. Grid 시스템 문법 수정**

```tsx
// ❌ MUI v6+ 문법 (오류 발생)
<Grid size={{ xs: 12, md: 6 }}>

// ✅ MUI v5 문법 (안정적)
<Grid item xs={12} md={6}>
```

#### **4. next.config.js 최적화**

```javascript
// next.config.js
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@mui/styled-engine': '@mui/styled-engine-sc',
    };
    return config;
  },
};
```

---

## 🚀 **단계별 해결 가이드**

### **Step 1: 프로젝트 초기화**
```bash
# node_modules와 package-lock.json 삭제
rm -rf node_modules package-lock.json

# 캐시 정리
npm cache clean --force
```

### **Step 2: 올바른 package.json 사용**
파일에서 제공한 수정된 `package.json`을 사용하세요:

```json
{
  "dependencies": {
    "next": "^14.2.15",
    "@mui/material": "^5.16.7",
    "framer-motion": "^10.18.0",
    // ... 기타 안정 버전들
  }
}
```

### **Step 3: 패키지 재설치**
```bash
npm install
```

### **Step 4: 개발 서버 재시작**
```bash
npm run dev
```

---

## 🔍 **추가 문제 해결**

### **문제: 'use client' 지시어 오류**
```tsx
// 해결책: 파일 상단에 명시적으로 추가
'use client';

import React from 'react';
// ... 나머지 imports
```

### **문제: Emotion CSS 충돌**
```bash
# Emotion 패키지 버전 통일
npm install @emotion/react@^11.11.4 @emotion/styled@^11.11.5 --save-exact
```

### **문제: TypeScript 타입 오류**
```bash
# 타입 정의 업데이트
npm install @types/react@^18.3.12 @types/react-dom@^18.3.1
```

### **문제: Framer Motion 호환성**
```tsx
// v10 호환 문법 사용
import { motion } from 'framer-motion';

const variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};
```

---

## ⚠️ **주의사항**

### **1. 버전 호환성**
- Next.js 15는 아직 많은 라이브러리와 호환성 문제가 있습니다
- 안정성을 위해 Next.js 14를 사용하는 것을 권장합니다
- MUI v5가 현재 가장 안정적인 선택입니다

### **2. 실험적 기능 사용 금지**
```javascript
// ❌ 피해야 할 설정
experimental: {
  optimizePackageImports: ['@mui/material'],
  appDir: true, // Next.js 14에서는 기본값
}
```

### **3. 캐시 문제**
```bash
# 빌드 캐시 정리
rm -rf .next
npm run build
```

---

## 📋 **체크리스트**

개발 환경 설정을 확인하세요:

- [ ] Node.js 18+ 설치 확인
- [ ] npm 캐시 정리 완료
- [ ] 올바른 package.json 버전 사용
- [ ] AppRouterCacheProvider v14 사용
- [ ] MUI v5 Grid 문법 적용
- [ ] 'use client' 지시어 추가
- [ ] 개발 서버 재시작

---

## 💡 **추가 도움말**

### **VSCode 설정**
```json
// .vscode/settings.json
{
  "typescript.preferences.includePackageJsonAutoImports": "off",
  "typescript.suggest.autoImports": false
}
```

### **환경 변수 확인**
```bash
# .env.local 파일 생성 확인
echo "NEXT_PUBLIC_APP_ENV=development" > .env.local
```

### **빌드 테스트**
```bash
# 배포 전 빌드 테스트
npm run build

# 빌드 결과 확인
npm run start
```

---

## 🆘 **여전히 문제가 있다면**

1. **GitHub Issues** - 구체적인 오류 메시지와 함께 이슈 생성
2. **개발자 도구** - 브라우저 콘솔에서 추가 오류 확인
3. **단계적 접근** - 컴포넌트를 하나씩 추가하면서 문제 지점 파악

이 가이드를 따라하면 webpack 오류와 대부분의 호환성 문제를 해결할 수 있습니다.