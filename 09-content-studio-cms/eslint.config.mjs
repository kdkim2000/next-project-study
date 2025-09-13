// eslint.config.mjs
// ESLint 설정 파일 - 초보자를 위한 느슨한 규칙 적용

import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals"),
  {
    rules: {
      // React 관련 규칙 완화
      "react/no-unescaped-entities": "warn", // 특수문자 경고만
      "react-hooks/exhaustive-deps": "warn", // useEffect 의존성 경고만
      "react/display-name": "off", // displayName 검사 끄기
      
      // TypeScript 관련 규칙 완화
      "@typescript-eslint/no-unused-vars": "warn", // 미사용 변수 경고만
      "@typescript-eslint/no-explicit-any": "off", // any 타입 허용
      "@typescript-eslint/ban-ts-comment": "off", // @ts-ignore 허용
      
      // 일반적인 규칙 완화
      "no-console": "off", // console.log 허용 (학습용)
      "no-unused-vars": "warn", // 미사용 변수 경고만
      "prefer-const": "warn", // const 사용 권장만
      
      // Next.js 관련 규칙 완화
      "@next/next/no-img-element": "warn", // img 태그 경고만
      "@next/next/no-html-link-for-pages": "warn", // 링크 경고만
      
      // 들여쓰기 및 포매팅 완화
      "indent": "off", // 들여쓰기 검사 끄기
      "quotes": "off", // 따옴표 스타일 자유
      "semi": "warn", // 세미콜론 경고만
    }
  }
];

export default eslintConfig;