// eslint.config.mjs - 초보자 친화적인 느슨한 ESLint 설정
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
    // 초보자를 위한 느슨한 규칙 설정
    rules: {
      // 세미콜론 강제하지 않음 (편의성)
      "semi": "off",
      // 따옴표 통일 강제하지 않음
      "quotes": "off",
      // 콘솔 로그 허용 (디버깅용)
      "no-console": "off",
      // 사용하지 않는 변수 경고만 (에러 아님)
      "no-unused-vars": "warn",
      // React import 자동 감지
      "react/react-in-jsx-scope": "off",
      // prop-types 검사 비활성화 (TypeScript 사용)
      "react/prop-types": "off",
      // 빈 줄 강제하지 않음
      "no-multiple-empty-lines": "off",
      // 들여쓰기 규칙 느슨하게
      "indent": "off",
      // 줄 끝 공백 허용
      "no-trailing-spaces": "off",
    },
  },
];

export default eslintConfig;