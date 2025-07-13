// eslint.config.mjs
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { FlatCompat } from "@eslint/eslintrc"; // still the right package

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });

export default [
  // “translate” the classic Next presets into flat‑config objects
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // keep your override
      "@typescript-eslint/ban-ts-comment": ["error", { "ts-ignore": false }],
    },
  },
];
