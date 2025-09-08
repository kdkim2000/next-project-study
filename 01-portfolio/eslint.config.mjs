// eslint.config.mjs
// 초보자 친화적인 ESLint 설정 - 매우 느슨한 버전

import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // TypeScript 관련 - 매우 느슨하게
      "@typescript-eslint/no-unused-vars": "off", // 사용하지 않는 변수 완전 허용
      "@typescript-eslint/no-explicit-any": "off", // any 타입 허용
      "@typescript-eslint/ban-ts-comment": "off", // @ts-ignore 등 주석 허용
      "@typescript-eslint/no-non-null-assertion": "off", // ! 연산자 허용
      "@typescript-eslint/no-empty-function": "off", // 빈 함수 허용
      "@typescript-eslint/no-inferrable-types": "off", // 추론 가능한 타입 명시 허용
      "@typescript-eslint/prefer-as-const": "off",
      "@typescript-eslint/no-var-requires": "off", // require 사용 허용
      
      // React 관련 - 느슨하게
      "react/no-unescaped-entities": "off", // 따옴표 에스케이프 불요
      "react/display-name": "off", // displayName 불요
      "react/prop-types": "off", // PropTypes 불요
      "react/react-in-jsx-scope": "off", // React import 불요
      "react/no-unknown-property": "off", // 알려지지 않은 속성 허용
      "react-hooks/rules-of-hooks": "warn", // Hook 규칙은 경고로만
      "react-hooks/exhaustive-deps": "off", // useEffect 의존성 체크 끄기
      
      // JavaScript 기본 규칙 - 매우 느슨하게
      "no-console": "off", // console.log 완전 허용
      "no-debugger": "off", // debugger 허용
      "no-alert": "off", // alert 허용
      "no-unused-vars": "off", // 사용하지 않는 변수 허용
      "prefer-const": "off", // const 선호 끄기
      "no-var": "off", // var 사용 허용
      "no-undef": "off", // 정의되지 않은 변수 허용
      "no-redeclare": "off", // 재선언 허용
      
      // 스타일링 관련
      "indent": "off", // 들여쓰기 규칙 끄기
      "quotes": "off", // 따옴표 스타일 자유
      "semi": "off", // 세미콜론 자유
      "comma-dangle": "off", // 마지막 쉼표 자유
      "object-curly-spacing": "off", // 중괄호 공백 자유
      "array-bracket-spacing": "off", // 대괄호 공백 자유
      
      // Import 관련
      "import/order": "off", // import 순서 자유
      "import/no-unresolved": "off", // 해결되지 않는 import 허용
      "import/named": "off",
      "import/namespace": "off",
      "import/default": "off",
      "import/export": "off",
      
      // 기타 일반적인 규칙들
      "no-empty": "off", // 빈 블록 허용
      "no-empty-function": "off", // 빈 함수 허용
      "no-useless-constructor": "off", // 무의미한 생성자 허용
      "no-useless-escape": "off", // 불필요한 이스케이프 허용
      "no-prototype-builtins": "off",
      "no-case-declarations": "off", // case에서 선언 허용
      "no-fallthrough": "off", // switch case fallthrough 허용
      "no-irregular-whitespace": "off", // 불규칙한 공백 허용
      "no-mixed-spaces-and-tabs": "off", // 공백과 탭 혼용 허용
      
      // Next.js 관련
      "@next/next/no-img-element": "off", // img 태그 사용 허용
      "@next/next/no-html-link-for-pages": "off",
      "@next/next/no-sync-scripts": "off",
      
      // 성능 관련 (느슨하게)
      "jsx-a11y/alt-text": "off", // alt 텍스트 강제하지 않음
      "jsx-a11y/anchor-is-valid": "off", // 앵커 유효성 검사 끄기
      "jsx-a11y/click-events-have-key-events": "off", // 키보드 이벤트 강제하지 않음
      "jsx-a11y/no-static-element-interactions": "off", // 정적 요소 상호작용 허용
    },
  },
  {
    // 무시할 파일/폴더들
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "dist/**",
      "public/**",
      ".git/**",
      "next-env.d.ts",
      "*.config.js",
      "*.config.ts",
      "*.config.mjs",
      "postcss.config.js",
      "tailwind.config.js",
      "tailwind.config.ts",
      "jest.config.js",
      "jest.setup.js",
      "coverage/**",
      "*.test.ts",
      "*.test.tsx",
      "*.spec.ts",
      "*.spec.tsx",
      "__tests__/**",
    ],
  },
];

export default eslintConfig;