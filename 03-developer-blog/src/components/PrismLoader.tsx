// src/components/PrismLoader.tsx
"use client";

import { useEffect } from 'react';

export default function PrismLoader() {
  useEffect(() => {
    // CSS 스타일만 동적 로드
    const loadPrismCSS = () => {
      // Prism 테마 CSS가 이미 로드되어 있는지 확인
      if (!document.querySelector('link[href*="prism"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css';
        document.head.appendChild(link);
      }

      // Line numbers 플러그인 CSS
      if (!document.querySelector('link[href*="line-numbers"]')) {
        const lineNumbersLink = document.createElement('link');
        lineNumbersLink.rel = 'stylesheet';
        lineNumbersLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/line-numbers/prism-line-numbers.min.css';
        document.head.appendChild(lineNumbersLink);
      }
    };

    loadPrismCSS();
  }, []);

  return null;
}