# 🔧 MUI v6 오류 해결 가이드

## ❌ **발생한 오류**
```
Cannot read properties of undefined (reading 'call')
AppRouterCacheProvider
```

## 💡 **오류 원인**
MUI v6에서 `AppRouterCacheProvider`의 import 경로와 사용법이 변경되었습니다.

---

## ✅ **해결 방법**

### **방법 1: 간단한 해결 (추천)**
`AppRouterCacheProvider`를 제거하고 기본 MUI 설정만 사용:

```typescript
// src/app/layout.tsx
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '@/lib/theme';

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

### **방법 2: 올바른 패키지 설치**
MUI Next.js 통합 패키지가 필요한 경우:

```bash
# 기존 패키지 제거
npm uninstall @mui/material-nextjs

# 올바른 버전 설치
npm install @mui/material-nextjs@latest

# 또는 특정 버전
npm install @mui/material-nextjs@6.1.0
```

### **방법 3: 완전한 재설치**
모든 MUI 패키지를 다시 설치:

```bash
# 기존 MUI 패키지 모두 제거
npm uninstall @mui/material @mui/icons-material @emotion/react @emotion/styled @mui/material-nextjs

# 최신 버전으로 재설치
npm install @mui/material@latest @mui/icons-material@latest @emotion/react@latest @emotion/styled@latest

# 캐시 정리
npm cache clean --force

# node_modules 완전 삭제 후 재설치
rm -rf node_modules package-lock.json
npm install
```

---

## 🎯 **권장 해결책**

**초보자에게는 방법 1을 추천합니다:**

1. `AppRouterCacheProvider` 제거
2. 기본 `ThemeProvider`와 `CssBaseline`만 사용
3. 나중에 필요할 때 최적화 추가

**이유:**
- 더 간단하고 안정적
- MUI v6의 기본 설정으로 충분
- 학습 목적에 최적화

---

## 📝 **업데이트된 package.json**

```json
{
  "dependencies": {
    "next": "^15.0.3",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "@mui/material": "^6.1.6",
    "@mui/icons-material": "^6.1.6",
    "@emotion/react": "^11.13.3",
    "@emotion/styled": "^11.13.0",
    "framer-motion": "^11.11.7"
  }
}
```

---

## ⚠️ **주의사항**

1. **MUI v6는 아직 베타 버전**일 수 있습니다
2. **안정성을 위해 MUI v5 사용 고려:**
   ```bash
   npm install @mui/material@^5.15.0 @mui/icons-material@^5.15.0
   ```
3. **Next.js 15와의 호환성** 확인 필요

---

## 🔄 **대안 설정**

### MUI v5 안정 버전 사용:
```bash
# MUI v5로 다운그레이드
npm install @mui/material@^5.15.0 @mui/icons-material@^5.15.0 @mui/material-nextjs@^5.15.0
```

### 최소 설정으로 시작:
```typescript
// 가장 기본적인 설정
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const theme = createTheme();

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

---

## ✅ **해결 확인**

오류가 해결되었는지 확인하는 방법:

1. **개발 서버 재시작:**
   ```bash
   npm run dev
   ```

2. **브라우저에서 확인:**
   - `http://localhost:3000` 접속
   - 콘솔에 오류가 없어야 함
   - 페이지가 정상적으로 렌더링되어야 함

3. **MUI 컴포넌트 동작 확인:**
   - 버튼, 타이포그래피 등이 MUI 스타일로 표시
   - 테마 색상이 적용되어야 함

---

이 해결 방법들을 시도해보시고, 여전히 문제가 있다면 추가로 도움을 요청해주세요! 🚀
