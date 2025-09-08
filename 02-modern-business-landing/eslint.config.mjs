// eslint.config.mjs (느슨한 설정으로 수정)
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
    files: ["**/*.{js,jsx,ts,tsx}"],
    rules: {
      // 초보자를 위한 느슨한 규칙들
      "@typescript-eslint/no-unused-vars": "warn", // 사용하지 않는 변수 경고로 변경
      "@typescript-eslint/no-explicit-any": "off", // any 타입 허용
      "@typescript-eslint/no-empty-interface": "off", // 빈 인터페이스 허용
      "@typescript-eslint/ban-ts-comment": "off", // @ts-ignore 등 주석 허용
      
      // React 관련 느슨한 설정
      "react/no-unescaped-entities": "off", // 이스케이프되지 않은 엔티티 허용
      "react/display-name": "off", // 컴포넌트 displayName 요구 비활성화
      "react/prop-types": "off", // PropTypes 검사 비활성화
      "react-hooks/exhaustive-deps": "warn", // useEffect 의존성 경고로 변경
      
      // Next.js 관련 느슨한 설정
      "@next/next/no-page-custom-font": "off", // 커스텀 폰트 경고 비활성화
      "@next/next/no-img-element": "off", // img 태그 사용 허용
      "@next/next/no-html-link-for-pages": "off", // HTML link 태그 허용
      
      // 일반적인 느슨한 설정
      "no-console": "warn", // console.log 경고로 변경 (에러가 아님)
      "no-debugger": "warn", // debugger 경고로 변경
      "no-unused-expressions": "off", // 사용되지 않는 표현식 허용
      "prefer-const": "warn", // const 사용 권장을 경고로
      "no-var": "warn", // var 사용 금지를 경고로
      
      // Import 관련 느슨한 설정
      "import/no-anonymous-default-export": "off", // 익명 기본 내보내기 허용
      "import/order": "off", // import 순서 검사 비활성화
      
      // 기타 느슨한 설정
      "prefer-rest-params": "off", // rest parameters 사용 권장 비활성화
      "no-empty": "warn", // 빈 블록 경고로 변경
      "no-constant-condition": "warn", // 상수 조건문 경고로 변경
    },
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**", 
      "build/**",
      "dist/**",
      "public/**",
      "next-env.d.ts",
      "*.config.js",
      "*.config.mjs",
      "*.config.ts",
      ".env*",
      "coverage/**",
      "*.min.js",
    ],
  },
];

export default eslintConfig;