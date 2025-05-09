const { defineConfig } = require("eslint/config");

const globals = require("globals");
const tsParser = require("@typescript-eslint/parser");
const typescriptEslint = require("@typescript-eslint/eslint-plugin");
const tsdoc = require("eslint-plugin-tsdoc");
const js = require("@eslint/js");

const { FlatCompat } = require("@eslint/eslintrc");

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
});

module.exports = defineConfig([
  {
    languageOptions: {
      globals: {},
      sourceType: "module",
      parserOptions: {}
    },

    extends: compat.extends("eslint:recommended", "plugin:prettier/recommended")
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser
      },

      parser: tsParser,
      sourceType: "module",

      parserOptions: {
        project: "./src/main/typescript/tsconfig.json"
      }
    },

    extends: compat.extends("plugin:@typescript-eslint/recommended"),
    files: ["./src/main/typescript/**/*.ts"],

    plugins: {
      "@typescript-eslint": typescriptEslint,
      tsdoc
    },

    rules: {
      "eslint/lines-between-class-members": "off",
      "tsdoc/syntax": "warn",
      "@/lines-between-class-members": ["warn"],

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
      ],

      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_"
        }
      ]
    }
  },
  {
    files: ["./src/main/typescript/data/**/*.ts"],

    rules: {
      "@typescript-eslint/no-inferrable-types": "off"
    }
  },
  {
    files: ["./src/main/typescript/lang.d.ts"],

    rules: {
      "tsdoc/syntax": "off"
    }
  },
  {
    extends: compat.extends("plugin:@typescript-eslint/recommended"),
    files: ["./src/test/typescript/tsd/**/*.test-d.ts"],

    languageOptions: {
      parser: tsParser,
      sourceType: "module",

      parserOptions: {
        project: "./src/test/typescript/tsd/tsconfig.json"
      }
    },

    plugins: {
      "@typescript-eslint": typescriptEslint,
      tsdoc
    }
  },
  {
    extends: compat.extends("plugin:@typescript-eslint/recommended"),
    files: ["./gulpfile.ts", "./gulp/**/*.ts"],

    languageOptions: {
      parser: tsParser,
      sourceType: "module",

      parserOptions: {
        project: "./tsconfig.json"
      }
    },

    plugins: {
      "@typescript-eslint": typescriptEslint,
      tsdoc
    },

    rules: {
      "tsdoc/syntax": "warn"
    }
  },
  {
    languageOptions: {
      globals: {
        ...globals.node
      }
    },

    files: ["**/gulp.js"]
  },
  {
    languageOptions: {
      globals: {
        ...globals.commonjs
      },

      sourceType: "script",
      parserOptions: {}
    },

    files: ["./**/*.cjs"]
  }
]);
