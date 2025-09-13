// eslint.config.mjs
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
      // 초보자를 위한 느슨한 규칙들
      "@typescript-eslint/no-unused-vars": "warn", // 경고로만 표시
      "@typescript-eslint/no-explicit-any": "off", // any 타입 허용
      "@typescript-eslint/no-empty-function": "off", // 빈 함수 허용
      "react-hooks/exhaustive-deps": "warn", // dependency 누락 시 경고만
      "@next/next/no-img-element": "off", // img 태그 사용 허용
      "prefer-const": "warn", // const 권장사항은 경고로만
      "no-console": "off", // console.log 사용 허용 (학습용)
    },
  },
];

export default eslintConfig;