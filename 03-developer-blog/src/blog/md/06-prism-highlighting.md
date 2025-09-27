---
title: "Prism.js 코드 하이라이팅 완전 정복 - 커스텀 테마와 고급 기능"
date: "2024-01-21"
description: "Prism.js를 활용한 고급 코드 하이라이팅 구현과 커스텀 테마 개발, 라인 넘버링, 코드 복사 기능까지 완벽 가이드입니다."
keywords: ["prismjs", "syntax-highlighting", "code", "themes", "plugins"]
---

# Prism.js 코드 하이라이팅 완전 정복

개발 블로그나 기술 문서에서 코드 하이라이팅은 필수입니다. Prism.js는 가볍고 확장 가능한 문법 하이라이터로, 다양한 언어와 테마를 지원하며 플러그인 생태계가 풍부합니다.

## Prism.js 아키텍처 이해

### 핵심 구성 요소
1. **Core**: 기본 토큰화 엔진
2. **Languages**: 각 프로그래밍 언어의 문법 정의
3. **Themes**: CSS 스타일 테마
4. **Plugins**: 확장 기능 (라인 넘버, 복사 버튼 등)

### 토큰화 과정
```javascript
// Prism.js 내부 토큰화 과정
const code = `function hello() { return "world"; }`;
const grammar = Prism.languages.javascript;

// 1. 토큰 분석
const tokens = Prism.tokenize(code, grammar);
/*
결과:
[
  { type: 'keyword', content: 'function' },
  { type: 'function', content: 'hello' },
  '() { ',
  { type: 'keyword', content: 'return' },
  { type: 'string', content: '"world"' },
  '; }'
]
*/

// 2. HTML 생성
const html = Prism.highlight(code, grammar, 'javascript');
```

## Next.js에서 Prism.js 통합

### 서버 사이드 하이라이팅
```typescript
// lib/prism-server.ts
import Prism from 'prismjs';

// 필요한 언어들 미리 로드
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-sql';

export function highlightCode(code: string, language: string): string {
  if (!Prism.languages[language]) {
    console.warn(`Language not supported: ${language}`);
    return escapeHtml(code);
  }
  
  try {
    return Prism.highlight(code, Prism.languages[language], language);
  } catch (error) {
    console.error(`Highlighting failed for ${language}:`, error);
    return escapeHtml(code);
  }
}
```

### Rehype 플러그인과 통합
```typescript
// lib/rehype-prism-custom.ts
import { visit } from 'unist-util-visit';
import { highlightCode } from './prism-server';

export function rehypePrismCustom() {
  return (tree: any) => {
    visit(tree, 'element', (node, index, parent) => {
      if (
        node.tagName === 'pre' &&
        node.children?.[0]?.tagName === 'code'
      ) {
        const codeNode = node.children[0];
        const className = codeNode.properties?.className?.[0] || '';
        const language = className.replace('language-', '');
        const code = getTextContent(codeNode);
        
        if (language && code) {
          const highlightedCode = highlightCode(code, language);
          
          // 하이라이팅된 HTML로 교체
          codeNode.children = [{
            type: 'raw',
            value: highlightedCode
          }];
          
          // 클래스 및 속성 추가
          node.properties = {
            ...node.properties,
            className: ['code-block', `language-${language}`],
            'data-language': language
          };
        }
      }
    });
  };
}
```

## 고급 플러그인 활용

### 라인 넘버링
```css
/* CSS */
.line-numbers .line-numbers-rows {
  position: absolute;
  pointer-events: none;
  top: 0;
  font-size: 100%;
  left: -3.8em;
  width: 3em;
  letter-spacing: -1px;
  border-right: 1px solid #999;
  user-select: none;
}

.line-numbers-rows > span {
  display: block;
  counter-increment: linenumber;
}

.line-numbers-rows > span:before {
  content: counter(linenumber);
  color: #999;
  display: block;
  padding-right: 0.8em;
  text-align: right;
}
```

```typescript
// 라인 넘버 추가 함수
export function addLineNumbers(html: string): string {
  const lines = html.split('\n');
  const numberedLines = lines.map((line, index) => 
    `<span class="line-number" data-line="${index + 1}">${line}</span>`
  );
  
  return numberedLines.join('\n');
}
```

### 코드 복사 기능
```typescript
// components/CodeBlock.tsx
"use client";

import { useState } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';

interface CodeBlockProps {
  children: string;
  language: string;
  filename?: string;
}

export default function CodeBlock({ children, language, filename }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(children);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy code:', error);
    }
  };
  
  return (
    <div className="code-block-container">
      {filename && (
        <div className="code-filename">
          <span>{filename}</span>
        </div>
      )}
      
      <div className="code-header">
        <span className="code-language">{language}</span>
        <Tooltip title={copied ? "Copied!" : "Copy code"}>
          <IconButton onClick={handleCopy} size="small">
            {copied ? <CheckIcon /> : <ContentCopyIcon />}
          </IconButton>
        </Tooltip>
      </div>
      
      <pre className={`language-${language}`}>
        <code dangerouslySetInnerHTML={{ __html: children }} />
      </pre>
    </div>
  );
}
```

## 커스텀 테마 개발

### 베이스 테마 구조
```css
/* custom-prism-theme.css */
:root {
  --prism-bg: #1e1e1e;
  --prism-text: #d4d4d4;
  --prism-comment: #6a9955;
  --prism-keyword: #569cd6;
  --prism-string: #ce9178;
  --prism-function: #dcdcaa;
  --prism-number: #b5cea8;
  --prism-operator: #d4d4d4;
  --prism-punctuation: #cccccc;
}

/* 다크 테마 */
@media (prefers-color-scheme: dark) {
  :root {
    --prism-bg: #0d1117;
    --prism-text: #c9d1d9;
    --prism-comment: #8b949e;
    --prism-keyword: #ff7b72;
    --prism-string: #a5d6ff;
    --prism-function: #d2a8ff;
  }
}

.prism-theme-custom {
  background: var(--prism-bg);
  color: var(--prism-text);
  border-radius: 8px;
  padding: 16px;
  overflow-x: auto;
  font-family: 'Fira Code', 'Consolas', monospace;
  font-size: 14px;
  line-height: 1.5;
}

/* 토큰별 스타일링 */
.token.comment,
.token.prolog,
.token.doctype,
.token.cdata {
  color: var(--prism-comment);
  font-style: italic;
}

.token.keyword,
.token.control,
.token.directive,
.token.unit {
  color: var(--prism-keyword);
  font-weight: 600;
}

.token.string,
.token.attr-value {
  color: var(--prism-string);
}

.token.function,
.token.function-variable {
  color: var(--prism-function);
}

.token.number,
.token.boolean {
  color: var(--prism-number);
}
```

### 테마 전환 기능
```typescript
// hooks/useCodeTheme.ts
import { useState, useEffect } from 'react';

type ThemeType = 'light' | 'dark' | 'auto';

export function useCodeTheme() {
  const [theme, setTheme] = useState<ThemeType>('auto');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');
  
  useEffect(() => {
    if (theme === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      setResolvedTheme(mediaQuery.matches ? 'dark' : 'light');
      
      const handler = (e: MediaQueryListEvent) => {
        setResolvedTheme(e.matches ? 'dark' : 'light');
      };
      
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    } else {
      setResolvedTheme(theme);
    }
  }, [theme]);
  
  return { theme, setTheme, resolvedTheme };
}
```

## 성능 최적화

### 동적 언어 로딩
```typescript
// lib/prism-dynamic.ts
const languageCache = new Map<string, boolean>();

export async function loadLanguage(language: string): Promise<boolean> {
  if (languageCache.has(language)) {
    return languageCache.get(language)!;
  }
  
  try {
    // 동적으로 언어 모듈 로드
    await import(`prismjs/components/prism-${language}`);
    languageCache.set(language, true);
    return true;
  } catch (error) {
    console.warn(`Failed to load language: ${language}`);
    languageCache.set(language, false);
    return false;
  }
}

export async function highlightCodeDynamic(code: string, language: string) {
  const loaded = await loadLanguage(language);
  
  if (!loaded || !Prism.languages[language]) {
    return escapeHtml(code);
  }
  
  return Prism.highlight(code, Prism.languages[language], language);
}
```

### 코드 블록 가상화
```typescript
// components/VirtualizedCodeBlock.tsx
import { FixedSizeList as List } from 'react-window';

interface VirtualCodeBlockProps {
  lines: string[];
  language: string;
  height: number;
}

export default function VirtualizedCodeBlock({ 
  lines, 
  language, 
  height 
}: VirtualCodeBlockProps) {
  const Row = ({ index, style }: { index: number; style: any }) => (
    <div style={style} className="code-line">
      <span className="line-number">{index + 1}</span>
      <code 
        className={`language-${language}`}
        dangerouslySetInnerHTML={{ 
          __html: highlightCode(lines[index], language) 
        }} 
      />
    </div>
  );
  
  return (
    <div className="virtualized-code-block">
      <List
        height={height}
        itemCount={lines.length}
        itemSize={20}
        itemData={lines}
      >
        {Row}
      </List>
    </div>
  );
}
```

## 접근성 개선

### 키보드 내비게이션
```typescript
// components/AccessibleCodeBlock.tsx
export default function AccessibleCodeBlock({ children, language }: Props) {
  const codeRef = useRef<HTMLElement>(null);
  
  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Tab' && event.ctrlKey) {
      event.preventDefault();
      // 다음/이전 코드 블록으로 이동
      const direction = event.shiftKey ? 'previous' : 'next';
      navigateToCodeBlock(direction);
    }
    
    if (event.key === 'c' && (event.ctrlKey || event.metaKey)) {
      // 코드 복사
      copyCodeToClipboard();
    }
  };
  
  return (
    <pre 
      ref={codeRef}
      className={`language-${language}`}
      tabIndex={0}
      role="region"
      aria-label={`Code block in ${language}`}
      onKeyDown={handleKeyDown}
    >
      <code>{children}</code>
    </pre>
  );
}
```

### 스크린 리더 지원
```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.code-block-container::before {
  content: "Code block start";
  @apply sr-only;
}

.code-block-container::after {
  content: "Code block end";
  @apply sr-only;
}
```

## 실무 적용 패턴

### 다중 언어 지원
```typescript
// lib/syntax-detection.ts
export function detectLanguage(code: string, filename?: string): string {
  // 1. 파일 확장자로 판단
  if (filename) {
    const ext = path.extname(filename).toLowerCase();
    const extensionMap = {
      '.js': 'javascript',
      '.ts': 'typescript',
      '.jsx': 'jsx',
      '.tsx': 'tsx',
      '.py': 'python',
      '.rb': 'ruby',
      '.php': 'php',
      '.go': 'go',
      '.rs': 'rust',
      '.java': 'java',
      '.cpp': 'cpp',
      '.c': 'c'
    };
    
    if (extensionMap[ext]) {
      return extensionMap[ext];
    }
  }
  
  // 2. 코드 내용으로 판단
  if (code.includes('<?php')) return 'php';
  if (code.includes('function') && code.includes('=>')) return 'javascript';
  if (code.includes('def ') && code.includes(':')) return 'python';
  if (code.includes('package main')) return 'go';
  
  return 'plaintext';
}
```

### 코드 미리보기 기능
```typescript
// components/CodePreview.tsx
export default function CodePreview({ code, language }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [preview, fullCode] = useMemo(() => {
    const lines = code.split('\n');
    if (lines.length <= 10) {
      return [code, code];
    }
    return [
      lines.slice(0, 7).join('\n') + '\n// ... more code',
      code
    ];
  }, [code]);
  
  return (
    <div className="code-preview">
      <pre className={`language-${language}`}>
        <code dangerouslySetInnerHTML={{ 
          __html: highlightCode(isExpanded ? fullCode : preview, language) 
        }} />
      </pre>
      
      {!isExpanded && preview !== fullCode && (
        <button 
          onClick={() => setIsExpanded(true)}
          className="expand-button"
        >
          Show full code ({code.split('\n').length} lines)
        </button>
      )}
    </div>
  );
}
```

## 마무리

Prism.js는 단순한 문법 하이라이터를 넘어서 풍부한 코드 표현이 가능한 플랫폼입니다. 커스텀 테마, 플러그인, 그리고 접근성 개선을 통해 사용자에게 최상의 코드 읽기 경험을 제공할 수 있습니다.

다음 포스트에서는 카테고리와 태그 시스템 구현을 통한 콘텐츠 조직화 방법을 살펴보겠습니다.
