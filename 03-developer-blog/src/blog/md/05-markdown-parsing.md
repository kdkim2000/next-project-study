---
title: "마크다운 파싱 완전 정복 - Gray-Matter와 Remark 생태계"
date: "2024-01-20"
description: "Gray-Matter와 Remark를 활용한 고급 마크다운 처리 기법과 커스텀 플러그인 개발 방법을 알아봅니다."
keywords: ["markdown", "gray-matter", "remark", "rehype", "parsing", "content"]
---

# 마크다운 파싱 완전 정복

마크다운은 개발자들이 가장 선호하는 콘텐츠 작성 형식입니다. 하지만 단순한 마크다운을 웹에 적합한 HTML로 변환하고, 메타데이터를 처리하며, 커스텀 기능을 추가하는 것은 생각보다 복잡한 과정입니다.

## Gray-Matter 심화 활용

### Front Matter 형식들
Gray-Matter는 다양한 메타데이터 형식을 지원합니다:

```markdown
<!-- YAML (가장 일반적) -->
---
title: "블로그 포스트 제목"
date: 2024-01-20
tags: ["nextjs", "markdown"]
published: true
---

<!-- TOML -->
+++
title = "TOML 형식 예시"
date = 2024-01-20T10:00:00Z
[author]
name = "개발자"
email = "dev@example.com"
+++

<!-- JSON -->
{
  "title": "JSON 형식 예시",
  "date": "2024-01-20",
  "metadata": {
    "category": "development",
    "priority": 1
  }
}
```

### 고급 파싱 옵션
```typescript
import matter from 'gray-matter';

export function parseMarkdownAdvanced(content: string) {
  const result = matter(content, {
    // 다양한 구분자 지원
    delimiters: ['---', '+++'],
    
    // 언어별 파서 지정
    language: 'yaml', // 'toml', 'json', 'coffee' 등
    
    // 요약(excerpt) 추출
    excerpt: true,
    excerpt_separator: '<!-- more -->',
    
    // 커스텀 파서 함수
    engines: {
      yaml: (str) => require('js-yaml').load(str, { schema: require('js-yaml').JSON_SCHEMA }),
      toml: (str) => require('@iarna/toml').parse(str)
    }
  });
  
  return {
    data: result.data,      // Front matter 데이터
    content: result.content, // 마크다운 본문
    excerpt: result.excerpt, // 요약
    isEmpty: result.isEmpty, // 비어있는지 여부
    orig: result.orig       // 원본 문자열
  };
}
```

### 타입 안전한 Front Matter
```typescript
import { z } from 'zod';

// 스키마 정의
const PostFrontMatterSchema = z.object({
  title: z.string(),
  date: z.string().datetime().or(z.string()),
  description: z.string().optional(),
  tags: z.array(z.string()).default([]),
  published: z.boolean().default(false),
  author: z.object({
    name: z.string(),
    email: z.string().email().optional()
  }).optional(),
  seo: z.object({
    keywords: z.array(z.string()).optional(),
    ogImage: z.string().url().optional()
  }).optional()
});

export function parseTypedMarkdown(content: string) {
  const { data, content: markdownContent } = matter(content);
  
  try {
    const validatedData = PostFrontMatterSchema.parse(data);
    
    return {
      frontMatter: validatedData,
      content: markdownContent,
      isValid: true
    };
  } catch (error) {
    console.error('Invalid front matter:', error);
    
    return {
      frontMatter: null,
      content: markdownContent,
      isValid: false,
      errors: error.errors
    };
  }
}
```

## Remark/Rehype 파이프라인

### 처리 과정 이해
```
Markdown → [remark] → MDAST → [remark-rehype] → HAST → [rehype] → HTML
```

1. **MDAST** (Markdown Abstract Syntax Tree): 마크다운의 구조를 나타내는 트리
2. **HAST** (HTML Abstract Syntax Tree): HTML의 구조를 나타내는 트리

### 기본 파이프라인 구축
```typescript
import { remark } from 'remark';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import rehypeHighlight from 'rehype-highlight';

export async function processMarkdown(content: string) {
  const result = await remark()
    // Markdown 플러그인들
    .use(remarkGfm)           // GitHub Flavored Markdown
    .use(remarkToc)           // 목차 생성
    .use(remarkMath)          // 수학 공식
    
    // Markdown → HTML 변환
    .use(remarkRehype, { allowDangerousHtml: true })
    
    // HTML 플러그인들
    .use(rehypeHighlight)     // 코드 하이라이팅
    .use(rehypeSlug)         // 헤딩에 ID 추가
    .use(rehypeAutolinkHeadings) // 헤딩 자동 링크
    
    // HTML 문자열 생성
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(content);
  
  return String(result);
}
```

## 커스텀 Remark 플러그인

### 읽기 시간 계산 플러그인
```typescript
import { visit } from 'unist-util-visit';

export function remarkReadingTime() {
  return (tree, file) => {
    let textContent = '';
    
    // 모든 텍스트 노드 수집
    visit(tree, 'text', (node) => {
      textContent += node.value;
    });
    
    // 단어 수 계산 (한글/영어 혼합 고려)
    const koreanChars = (textContent.match(/[가-힣]/g) || []).length;
    const englishWords = (textContent.match(/[a-zA-Z]+/g) || []).length;
    
    // 읽기 시간 계산 (한글: 500자/분, 영어: 200단어/분)
    const koreanReadingTime = koreanChars / 500;
    const englishReadingTime = englishWords / 200;
    const totalMinutes = Math.ceil(koreanReadingTime + englishReadingTime);
    
    // 파일 메타데이터에 저장
    file.data.readingTime = {
      minutes: Math.max(1, totalMinutes),
      words: englishWords,
      characters: koreanChars
    };
  };
}
```

### 이미지 최적화 플러그인
```typescript
export function remarkOptimizeImages() {
  return (tree, file) => {
    visit(tree, 'image', (node, index, parent) => {
      const { url, alt } = node;
      
      // 상대 경로 이미지만 처리
      if (url.startsWith('/') || url.startsWith('./')) {
        // Next.js Image 컴포넌트로 변환
        const imageNode = {
          type: 'html',
          value: `<Image
            src="${url}"
            alt="${alt || ''}"
            width={800}
            height={600}
            className="blog-image"
          />`
        };
        
        parent.children[index] = imageNode;
      }
    });
  };
}
```

### 코드 블록 메타데이터 플러그인
```typescript
export function remarkCodeMeta() {
  return (tree) => {
    visit(tree, 'code', (node) => {
      const { lang, meta } = node;
      
      if (meta) {
        // 메타 정보 파싱 (예: title="app.js" highlight="1,3-5")
        const metaProps = {};
        meta.split(' ').forEach(prop => {
          const [key, value] = prop.split('=');
          metaProps[key] = value?.replace(/['"]/g, '');
        });
        
        // 노드에 메타 정보 추가
        node.data = {
          hName: 'pre',
          hProperties: {
            className: [`language-${lang}`],
            'data-title': metaProps.title,
            'data-highlight': metaProps.highlight
          }
        };
      }
    });
  };
}
```

## Rehype 플러그인 개발

### 목차(TOC) 생성 플러그인
```typescript
import { visit } from 'unist-util-visit';
import { toString } from 'hast-util-to-string';

export function rehypeToc() {
  return (tree, file) => {
    const toc = [];
    
    // 헤딩 요소들 수집
    visit(tree, 'element', (node) => {
      if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(node.tagName)) {
        const level = parseInt(node.tagName.charAt(1));
        const text = toString(node);
        const id = node.properties.id || slugify(text);
        
        // ID가 없으면 추가
        if (!node.properties.id) {
          node.properties.id = id;
        }
        
        toc.push({
          level,
          text,
          id,
          children: []
        });
      }
    });
    
    // 계층 구조 생성
    const hierarchicalToc = buildTocHierarchy(toc);
    
    // 파일 데이터에 저장
    file.data.toc = hierarchicalToc;
  };
}

function buildTocHierarchy(flatToc) {
  const hierarchy = [];
  const stack = [];
  
  flatToc.forEach(item => {
    while (stack.length > 0 && stack[stack.length - 1].level >= item.level) {
      stack.pop();
    }
    
    if (stack.length === 0) {
      hierarchy.push(item);
    } else {
      const parent = stack[stack.length - 1];
      parent.children.push(item);
    }
    
    stack.push(item);
  });
  
  return hierarchy;
}
```

### 외부 링크 처리 플러그인
```typescript
export function rehypeExternalLinks() {
  return (tree) => {
    visit(tree, 'element', (node) => {
      if (node.tagName === 'a' && node.properties.href) {
        const href = node.properties.href;
        
        // 외부 링크 판별
        if (href.startsWith('http') && !href.includes(process.env.SITE_URL)) {
          node.properties.target = '_blank';
          node.properties.rel = 'noopener noreferrer';
          
          // 외부 링크 아이콘 추가
          node.children.push({
            type: 'element',
            tagName: 'span',
            properties: { className: 'external-link-icon' },
            children: [{ type: 'text', value: ' ↗' }]
          });
        }
      }
    });
  };
}
```

## 성능 최적화

### 파싱 결과 캐싱
```typescript
import LRU from 'lru-cache';

const markdownCache = new LRU<string, any>({
  max: 500, // 최대 500개 파일 캐시
  ttl: 1000 * 60 * 60 // 1시간 TTL
});

export async function cachedMarkdownProcess(content: string, filePath?: string) {
  const cacheKey = filePath || createHash('md5').update(content).digest('hex');
  
  if (markdownCache.has(cacheKey)) {
    return markdownCache.get(cacheKey);
  }
  
  const result = await processMarkdown(content);
  markdownCache.set(cacheKey, result);
  
  return result;
}
```

### 점진적 파싱
```typescript
export async function processMarkdownProgressive(content: string, options = {}) {
  const { skipHeavyPlugins = false } = options;
  
  let processor = remark()
    .use(remarkGfm)
    .use(remarkRehype);
  
  // 개발 환경에서는 무거운 플러그인 스킵
  if (!skipHeavyPlugins) {
    processor = processor
      .use(rehypeHighlight)    // 코드 하이라이팅 (상대적으로 무거움)
      .use(remarkMath)         // 수학 공식 처리
      .use(rehypeKatex);       // LaTeX 렌더링
  }
  
  processor = processor.use(rehypeStringify);
  
  return await processor.process(content);
}
```

## 실무 적용 패턴

### 마크다운 파일 전처리
```typescript
export function preprocessMarkdown(content: string, filePath: string) {
  // 1. 상대 경로 이미지를 절대 경로로 변환
  const baseDir = path.dirname(filePath);
  content = content.replace(
    /!\[([^\]]*)\]\((?!http)([^)]+)\)/g,
    (match, alt, src) => {
      const absolutePath = path.resolve(baseDir, src);
      return `![${alt}](${absolutePath})`;
    }
  );
  
  // 2. 코드 블록에 파일명 추가
  content = content.replace(
    /```(\w+)\s*\n/g,
    (match, lang) => {
      const filename = getFilenameFromContext(content, match);
      return `\`\`\`${lang} title="${filename}"\n`;
    }
  );
  
  return content;
}
```

### 에러 복구 전략
```typescript
export async function robustMarkdownProcess(content: string) {
  try {
    // 전체 파이프라인 실행
    return await processMarkdown(content);
  } catch (error) {
    console.warn('Full pipeline failed, attempting basic processing:', error);
    
    try {
      // 기본 파이프라인으로 폴백
      return await remark()
        .use(remarkRehype)
        .use(rehypeStringify)
        .process(content);
    } catch (fallbackError) {
      console.error('Basic processing also failed:', fallbackError);
      
      // 최후의 수단: HTML 이스케이프만 수행
      return escapeHtml(content.replace(/\n/g, '<br>'));
    }
  }
}
```

## 마무리

마크다운 파싱은 단순해 보이지만, 실제로는 매우 깊이 있는 영역입니다. Gray-Matter와 Remark 생태계를 제대로 이해하고 활용하면, 단순한 텍스트를 풍부하고 인터랙티브한 웹 콘텐츠로 변환할 수 있습니다.

다음 포스트에서는 Prism.js를 활용한 고급 코드 하이라이팅 기법과 커스텀 테마 개발에 대해 알아보겠습니다.
