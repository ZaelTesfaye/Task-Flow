import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores(["dist/**", "node_modules/**"]),

  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    // plugins: { js },
    // extends: ["js/recommended"], // only using TS recommended rules
    extends: [tseslint.configs.recommended], // + sets parser to @typescript-eslint/parser
    languageOptions: {
      globals: globals.node,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          // default
          // globalReturn: false,
          // impliedStrict: false,
          // jsx: false,
        },
      },
    },
    rules: {
      semi: ["error", "always"],
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          vars: "all",
          args: "after-used",
          ignoreRestSiblings: true,
          argsIgnorePattern: "^(next)$",
        },
      ],
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-empty-object-type": "off",
    },
  },
]);
