import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

const typedFiles = "**/*.{ts,tsx,mts,cts}";
const typedConfigs = [
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
].map((config) => ({
  ...config,
  files: [typedFiles],
}));

export default tseslint.config(
  {
    ignores: [
      ".astro/**",
      "dist/**",
      "node_modules/**",
      "public/**",
      "studio/dist/**",
    ],
  },
  eslint.configs.recommended,
  ...typedConfigs,
  {
    files: [typedFiles],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      "@typescript-eslint/consistent-type-definitions": ["error", "interface"],
      "@typescript-eslint/no-confusing-void-expression": "off",
    },
  },
);
