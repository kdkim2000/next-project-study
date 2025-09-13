// eslint.config.mjs - 초보자 친화적인 ESLint 설정
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
      // 🎯 초보자를 위한 느슨한 규칙 설정
      "@typescript-eslint/no-unused-vars": "warn", // 사용하지 않는 변수는 경고만
      "@typescript-eslint/no-explicit-any": "off", // any 타입 허용
      "react-hooks/exhaustive-deps": "warn", // useEffect 의존성 배열 경고만
      "react/no-unescaped-entities": "off", // 따옴표 등 특수문자 허용
      "@next/next/no-img-element": "off", // img 태그 허용
      "prefer-const": "warn", // const 사용 권장 (경고만)
      "@typescript-eslint/prefer-as-const": "off", // as const 강제 안함
      "no-console": "off", // console.log 허용 (디버깅 목적)
    },
  },
];

export default eslintConfig;