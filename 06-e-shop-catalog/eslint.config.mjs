// eslint.config.mjs - ESLint 설정 (초보자를 위한 느슨한 설정)

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
      "@typescript-eslint/no-unused-vars": "warn", // 사용하지 않는 변수를 경고로만 표시
      "@typescript-eslint/no-explicit-any": "warn", // any 타입 사용을 경고로만 표시
      "react/no-unescaped-entities": "warn", // HTML 엔티티 관련 경고로만 표시
      "react-hooks/exhaustive-deps": "warn", // useEffect 의존성 배열 경고로만 표시
      "@next/next/no-img-element": "warn", // img 태그 사용을 경고로만 표시
      "prefer-const": "warn", // const 사용 권장을 경고로만 표시
      "no-console": "off", // console.log 사용 허용
      "no-debugger": "warn", // debugger 사용을 경고로만 표시
    },
  },
];

export default eslintConfig;