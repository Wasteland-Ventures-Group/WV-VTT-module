// @ts-check
import js from "@eslint/js";
import ts from "typescript-eslint";
import prettierEslint from "eslint-config-prettier";
import tsdoc from "eslint-plugin-tsdoc";
import * as importPlugin from "eslint-plugin-import-x";
import { includeIgnoreFile } from "@eslint/compat";
import * as path from "path";

export default ts.config(
  js.configs.recommended,
  ...ts.configs.strictTypeChecked,
  prettierEslint,
  importPlugin.flatConfigs.recommended,
  includeIgnoreFile(path.resolve(import.meta.dirname, ".gitignore")),
  {
    languageOptions: {
      ecmaVersion: 2023,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname
      }
    },
    plugins: {
      tsdoc
    },
    settings: {
      "import-x/resolver": "typescript"
    },
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          args: "all",
          argsIgnorePattern: "^_",
          caughtErrors: "all",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          ignoreRestSiblings: true
        }
      ],
      "@typescript-eslint/no-namespace": [
        "error",
        {
          allowDeclarations: true
        }
      ],
      "tsdoc/syntax": "warn",
      "eslint/lines-between-class-members": "off",
      "@/lines-between-class-members": "warn",
      "@typescript-eslint/member-ordering": [
        "warn",
        {
          default: {
            memberTypes: [
              "public-static-field",
              "protected-static-field",
              "private-static-field",
              "static-field",
              "public-static-method",
              "protected-static-method",
              "private-static-method",
              "static-method",
              "public-constructor",
              "protected-constructor",
              "private-constructor",
              "constructor",
              "signature",
              "public-instance-field",
              "protected-instance-field",
              "private-instance-field",
              "instance-field",
              "public-abstract-field",
              "protected-abstract-field",
              "abstract-field",
              "public-instance-method",
              "protected-instance-method",
              "private-instance-method",
              "instance-method",
              "public-abstract-method",
              "protected-abstract-method",
              "abstract-method",
              "public-field",
              "protected-field",
              "private-field",
              "field",
              "public-method",
              "protected-method",
              "private-method",
              "method"
            ]
          }
        }
      ]
    }
  },
  {
    files: ["**/*.js"],
    rules: {
      "tsdoc/syntax": "off"
    }
  }
);
