# 📋 GitHub Pages 배포 가이드 (TypeScript next.config.ts 기준)

## 🚀 **TypeScript Next.js 프로젝트를 GitHub Pages에 배포하기**

### **📂 프로젝트 구조 확인**
```
your-repository/
├── 01-project-1/
├── 02-project-2/
├── 03-developer-blog/          # 이 프로젝트 (TypeScript)
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   └── lib/
│   ├── types/
│   │   └── env.d.ts
│   ├── public/
│   ├── next.config.ts          # TypeScript 설정
│   ├── tsconfig.json
│   ├── package.json
│   └── ...
├── .github/
│   └── workflows/
│       └── deploy-github-pages.yml
└── README.md
```

## ⚙️ **필수 설정 파일들**

### **1. next.config.ts 설정**
```typescript
import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';
const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1] || 'your-repo-name';

const nextConfig: NextConfig = {
  output: 'export',                    // ✅ 필수: 정적 사이트 생성
  trailingSlash: true,                 // ✅ 필수: GitHub Pages 호환
  basePath: isProd ? `/${repoName}` : '', // ✅ 필수: 경로 설정
  assetPrefix: isProd ? `/${repoName}/` : '',
  images: { unoptimized: true },       // ✅ 필수: 이미지 최적화 비활성화
  
  // 환경별 설정
  env: {
    NEXT_PUBLIC_BASE_URL: isProd 
      ? `https://${process.env.GITHUB_REPOSITORY_OWNER || 'username'}.github.io/${repoName}`
      : 'http://localhost:3000',
  },
};

export default nextConfig;
```

**🔧 중요: `repoName`을 실제 repository 이름으로 변경하세요!**

### **2. TypeScript 환경변수 타입 (types/env.d.ts)**
```typescript
declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: 'development' | 'production' | 'test';
    readonly NEXT_PUBLIC_BASE_URL: string;
    readonly GITHUB_REPOSITORY: string;
    readonly GITHUB_REPOSITORY_OWNER: string;
  }
}
```

### **3. tsconfig.json 설정**
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    },
    "types": ["node", "./types/env.d.ts"]
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", "types/**/*.ts"],
  "exclude": ["node_modules", ".next", "out"]
}
```

## 🔧 **GitHub 설정**

### **1. Repository Settings**
1. GitHub repository → **Settings** → **Pages**
2. **Source**: `Deploy from a branch` 선택
3. **Branch**: `gh-pages` 선택 (자동 생성됨)
4. **Folder**: `/ (root)` 선택

### **2. Actions 권한 활성화**
1. **Settings** → **Actions** → **General**
2. **Workflow permissions**: `Read and write permissions` 선택
3. **Allow GitHub Actions to create and approve pull requests** 체크

## 🚀 **배포 실행**

### **1. 로컬 테스트**
```bash
# 프로젝트 폴더로 이동
cd 03-developer-blog

# 의존성 설치
npm install

# TypeScript 타입 체크
npm run type-check

# 개발 서버 테스트
npm run dev

# 프로덕션 빌드 테스트
npm run build
```

### **2. 배포 실행**
```bash
# 모든 변경사항 커밋
git add .
git commit -m "feat: TypeScript Next.js GitHub Pages 배포 설정"

# main 브랜치에 푸시 (자동 배포 트리거)
git push origin main
```

### **3. 배포 과정 모니터링**
1. GitHub repository → **Actions** 탭
2. "Deploy to GitHub Pages" 워크플로우 확인
3. 각 단계별 진행 상황:
   - ✅ **Type check**: TypeScript 타입 검사
   - ✅ **Lint check**: 코드 품질 검사  
   - ✅ **Build**: Next.js 빌드 (out/ 폴더 생성)
   - ✅ **Deploy**: GitHub Pages 배포
   - ✅ **Verify**: 사이트 접근성 확인

## 🌐 **배포 완료 후 확인**

### **1. 사이트 접속**
```
https://[username].github.io/[repo-name]
```
예시: `https://myusername.github.io/my-react-projects`

### **2. 페이지별 확인**
- ✅ **메인 페이지**: `/`
- ✅ **블로그 목록**: `/blog/`
- ✅ **개별 포스트**: `/blog/sample-post/`
- ✅ **에디터**: `/editor/`

### **3. 리소스 로딩 확인**
- ✅ CSS 스타일 적용
- ✅ JavaScript 동작
- ✅ 이미지 표시
- ✅ 링크 동작

## 🛠️ **TypeScript 관련 추가 설정**

### **1. 경로 유틸리티 사용**
```typescript
// src/components/MyComponent.tsx
import { withBasePath, getMetaUrl } from '@/lib/path-utils';

export default function MyComponent() {
  return (
    <Link href={withBasePath('/blog')}>
      블로그 보기
    </Link>
  );
}
```

### **2. SEO 메타데이터 생성**
```typescript
// src/app/blog/[slug]/page.tsx
import { generateBlogPostSEO } from '@/lib/seo-ts';

export async function generateMetadata({ params }: Props) {
  const post = await getPostBySlug(params.slug);
  return generateBlogPostSEO(post);
}
```

### **3. 이미지 경로 처리**
```typescript
// next.config.ts에서 images.unoptimized: true 설정 필요
import Image from 'next/image';
import { getImagePath } from '@/lib/path-utils';

<Image 
  src={getImagePath('/blog-hero.jpg')}
  alt="Blog Hero"
  width={1200}
  height={630}
  unoptimized // GitHub Pages 필수 설정
/>
```

## 🐛 **문제 해결 (TypeScript 특화)**

### **빌드 실패 시**
1. **TypeScript 오류 확인**
   ```bash
   npm run type-check
   ```

2. **주요 확인사항**
   - `next.config.ts` 문법 오류
   - 환경변수 타입 정의 (`types/env.d.ts`)
   - import 경로 오류 (`@/` 별칭)
   - 컴포넌트 타입 정의

### **경로 오류 시**
1. **베이스 경로 확인**
   ```typescript
   // next.config.ts
   const repoName = 'actual-repo-name'; // 실제 이름으로 변경
   ```

2. **컴포넌트에서 경로 사용**
   ```typescript
   // ❌ 잘못된 방법
   <Link href="/blog">

   // ✅ 올바른 방법
   <Link href={withBasePath("/blog")}>
   ```

### **타입 오류 시**
1. **환경변수 타입 확인**
   ```typescript
   // types/env.d.ts가 올바르게 설정되었는지 확인
   ```

2. **Next.js 타입 확인**
   ```bash
   npm install --save-dev @types/node @types/react @types/react-dom
   ```

## 📊 **성능 최적화 (TypeScript 기준)**

### **1. 빌드 최적화**
```typescript
// next.config.ts
const nextConfig: NextConfig = {
  // 기본 설정...
  
  // webpack 최적화
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
            },
          },
        },
      };
    }
    return config;
  },
};
```

### **2. 타입 안전성 보장**
```typescript
// 타입 가드 함수 활용
export function isValidPost(post: unknown): post is BlogPost {
  return (
    typeof post === 'object' &&
    post !== null &&
    typeof (post as BlogPost).title === 'string'
  );
}
```

## 🔄 **업데이트 배포**

코드 수정 후 배포:
```bash
# TypeScript 검사
npm run type-check

# 로컬 빌드 테스트
npm run build

# 커밋 및 푸시
git add .
git commit -m "fix: 버그 수정 및 기능 개선"
git push origin main
```

GitHub Actions가 자동으로:
1. TypeScript 타입 체크 실행
2. ESLint 코드 품질 검사
3. Next.js 빌드 및 배포

## 🎯 **성공 체크리스트**

### **배포 전**
- [ ] `next.config.ts`에 실제 repository 이름 설정
- [ ] TypeScript 타입 오류 없음 (`npm run type-check`)
- [ ] ESLint 오류 없음 (`npm run lint`)
- [ ] 로컬 빌드 성공 (`npm run build`)

### **배포 후**
- [ ] GitHub Actions 모든 단계 성공 (녹색 체크)
- [ ] 사이트 접속 가능
- [ ] 모든 페이지 정상 동작
- [ ] 스타일 및 JavaScript 정상 로딩
- [ ] TypeScript 타입 안전성 유지

---

## 🎉 **축하합니다!**

TypeScript 기반 Next.js 프로젝트가 GitHub Pages에 성공적으로 배포되었습니다!

**배포 URL**: `https://[username].github.io/[repo-name]`

이제 코드 수정 시 자동으로 타입 체크부터 배포까지 모든 과정이 자동화됩니다. 🚀
