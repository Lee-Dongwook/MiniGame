import globals from "globals";
import pluginJs from "@eslint/js";
import tsParser from "@typescript-eslint/parser";
import pluginReact from "eslint-plugin-react";

export default [
  // Target File
  {
    files: ["**/*.{js,ts,jsx,tsx}"],
    ignores: [
      "**/node_modules/**",
      "packages/app/public/**",
      "dist/**",
      "build/**",
    ],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      },
    },
  },
  pluginJs.configs.recommended, // JavaScript Recommend Rules
  pluginReact.configs.flat.recommended, // React Recommend Rule
  {
    rules: {
      "react/react-in-jsx-scope": "off", // In Next.js, Unnecessary React import
      "import/no-extraneous-dependencies": "off", // Set Off Extraneous dependencies warning
      "react/jsx-filename-extension": [
        "warn",
        { extensions: [".tsx", ".jsx"] },
      ], // Allow JSX extension
      "no-unused-vars": "off",
      "no-undef": "off",
      "no-console": ["warn", { allow: ["warn", "error"] }], // console.log warning
      "react/prop-types": "off",
    },
  },
];
