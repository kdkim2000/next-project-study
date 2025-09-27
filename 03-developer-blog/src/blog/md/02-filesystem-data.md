---
title: "파일 시스템 기반 CMS 구축하기 - Git 친화적 콘텐츠 관리"
date: "2024-01-17"
description: "마크다운 파일과 파일 시스템을 활용해 개발자 친화적인 콘텐츠 관리 시스템을 구축하는 방법을 알아봅니다."
keywords: ["filesystem", "cms", "markdown", "git", "content-management"]
---

# 파일 시스템 기반 CMS 구축하기

데이터베이스나 헤드리스 CMS 대신 파일 시스템을 직접 활용하는 방법이 개발자들 사이에서 인기를 얻고 있습니다. Git과의 완벽한 호환성, 버전 관리, 백업의 용이함 등 많은 장점을 제공하기 때문입니다.

## 왜 파일 시스템 기반인가?

### 전통적인 CMS의 문제점
- 복잡한 관리자 인터페이스
- 데이터베이스 의존성
- 버전 관리의 어려움
- 백업 및 이전의 복잡성

### 파일 시스템 기반의 장점
```typescript
// 단순한 폴더 구조
content/
├── blog/
│   ├── 2024-01-15-nextjs-guide.md
│   ├── 2024-01-16-react-hooks.md
│   └── 2024-01-17-typescript-tips.md
├── pages/
│   ├── about.md
│   └── contact.md
└── config/
    └── site.yaml
```

## Node.js fs 모듈 활용

### 기본적인 파일 읽기
```typescript
import fs from 'fs';
import path from 'path';

export function getContentFiles(dir: string) {
  const contentDir = path.join(process.cwd(), 'content', dir);
  
  // 동기적 읽기 - 빌드 타임에 사용
  const files = fs.readdirSync(contentDir);
  
  return files
    .filter(file => file.endsWith('.md'))
    .map(file => {
      const filePath = path.join(contentDir, file);
      const content = fs.readFileSync(filePath, 'utf8');
      
      return {
        slug: file.replace('.md', ''),
        content,
        filePath
      };
    });
}
```

### 파일 메타데이터 활용
```typescript
import { statSync } from 'fs';

export function getFileMetadata(filePath: string) {
  const stats = statSync(filePath);
  
  return {
    createdAt: stats.birthtime,
    modifiedAt: stats.mtime,
    size: stats.size,
    isDirectory: stats.isDirectory()
  };
}
```

## Gray-Matter로 Front Matter 처리

### Front Matter란?
YAML, TOML, JSON 형식의 메타데이터를 마크다운 파일 상단에 작성하는 방식입니다.

```markdown
---
title: "파일 시스템 기반 CMS"
author: "개발자"
tags: ["nextjs", "cms", "markdown"]
published: true
featured: false
---

# 실제 마크다운 내용
여기부터 본문 내용이 시작됩니다.
```

### Gray-Matter 사용법
```typescript
import matter from 'gray-matter';
import fs from 'fs';

export function parseMarkdownFile(filePath: string) {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  
  // Front Matter와 내용 분리
  const { data, content, excerpt } = matter(fileContent, {
    excerpt: true, // 요약 자동 추출
    excerpt_separator: '<!-- more -->' // 구분자 설정
  });
  
  return {
    frontMatter: data,
    content,
    excerpt,
    wordCount: content.split(' ').length,
    readingTime: Math.ceil(content.split(' ').length / 200) // 분당 200단어 기준
  };
}
```

## 고급 파일 시스템 패턴

### 중첩 폴더 구조 처리
```typescript
import { glob } from 'glob';

export async function getAllMarkdownFiles(pattern: string) {
  // **/*.md 패턴으로 모든 하위 폴더의 마크다운 파일 찾기
  const files = await glob(pattern, {
    cwd: path.join(process.cwd(), 'content')
  });
  
  return files.map(file => {
    const fullPath = path.join(process.cwd(), 'content', file);
    const relativePath = file;
    const slug = file.replace(/\.md$/, '');
    
    return {
      slug,
      path: relativePath,
      fullPath,
      // URL 경로 생성
      url: '/' + slug.replace(/\\/g, '/')
    };
  });
}
```

### 카테고리별 자동 분류
```typescript
export function categorizeContent(files: any[]) {
  const categories = new Map();
  
  files.forEach(file => {
    const category = path.dirname(file.path);
    
    if (!categories.has(category)) {
      categories.set(category, []);
    }
    
    categories.get(category).push(file);
  });
  
  return Object.fromEntries(categories);
}
```

## 실시간 파일 감시 (개발 환경)

### Chokidar를 이용한 파일 변경 감지
```typescript
import chokidar from 'chokidar';

export function watchContentFiles() {
  const watcher = chokidar.watch('content/**/*.md', {
    ignored: /(^|[\/\\])\../, // 숨김 파일 무시
    persistent: true
  });
  
  watcher
    .on('add', path => console.log(`파일 추가됨: ${path}`))
    .on('change', path => console.log(`파일 변경됨: ${path}`))
    .on('unlink', path => console.log(`파일 삭제됨: ${path}`));
    
  return watcher;
}
```

## 캐싱 전략

### 메모리 캐싱
```typescript
const contentCache = new Map();

export function getCachedContent(slug: string) {
  if (contentCache.has(slug)) {
    return contentCache.get(slug);
  }
  
  const content = loadContentFromFile(slug);
  contentCache.set(slug, content);
  
  return content;
}

// 파일 변경 시 캐시 무효화
export function invalidateCache(slug: string) {
  contentCache.delete(slug);
}
```

## Git과의 통합

### Git 메타데이터 활용
```bash
# 파일의 Git 히스토리 가져오기
git log --format="%H|%an|%ad|%s" --date=iso -- content/blog/example.md
```

```typescript
import { execSync } from 'child_process';

export function getGitHistory(filePath: string) {
  try {
    const output = execSync(
      `git log --format="%H|%an|%ad|%s" --date=iso -- ${filePath}`,
      { encoding: 'utf8' }
    );
    
    return output.split('\n')
      .filter(line => line.trim())
      .map(line => {
        const [hash, author, date, message] = line.split('|');
        return { hash, author, date: new Date(date), message };
      });
  } catch (error) {
    return [];
  }
}
```

## 성능 최적화

### 증분 빌드
```typescript
import { createHash } from 'crypto';

export function generateContentHash(content: string) {
  return createHash('md5').update(content).digest('hex');
}

export function shouldRebuild(filePath: string, lastHash: string) {
  const content = fs.readFileSync(filePath, 'utf8');
  const currentHash = generateContentHash(content);
  
  return currentHash !== lastHash;
}
```

## 마무리

파일 시스템 기반 CMS는 개발자에게 친숙한 워크플로우를 제공하며, Git과의 완벽한 통합을 가능하게 합니다. 복잡한 데이터베이스 설정 없이도 강력한 콘텐츠 관리 시스템을 구축할 수 있어, 특히 정적 사이트나 문서 사이트에 최적입니다.

다음 포스트에서는 이러한 파일 시스템 기반 데이터를 Next.js의 정적 사이트 생성(SSG)과 결합하는 방법을 알아보겠습니다.
