/* globals module */

module.exports = {
  env: {
    es2020: true
  },
  extends: ["eslint:recommended", "plugin:prettier/recommended"],
  overrides: [
    {
      env: {
        browser: true
      },
      extends: ["plugin:@typescript-eslint/recommended"],
      files: ["src/typescript/**/*.ts"],
      parser: "@typescript-eslint/parser",
      parserOptions: {
        project: "./tsconfig.json",
        sourceType: "module"
      },
      plugins: ["@typescript-eslint", "eslint-plugin-tsdoc"],
      rules: {
        "tsdoc/syntax": "warn"
      }
    },
    {
      extends: ["plugin:@typescript-eslint/recommended"],
      files: ["gulpfile.ts"],
      parser: "@typescript-eslint/parser",
      parserOptions: {
        project: "./tsconfig-gulpfile.json",
        sourceType: "module"
      },
      plugins: ["@typescript-eslint", "eslint-plugin-tsdoc"],
      rules: {
        "tsdoc/syntax": "warn"
      }
    },
    {
      env: {
        node: true
      },
      files: ["gulp.js"]
    }
  ],
  parserOptions: {
    sourceType: "module"
  }
};
