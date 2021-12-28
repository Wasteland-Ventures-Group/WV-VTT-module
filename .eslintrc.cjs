module.exports = {
  env: {
    es2020: true
  },
  extends: ["eslint:recommended", "plugin:prettier/recommended"],
  parserOptions: {
    sourceType: "module"
  },
  overrides: [
    {
      env: {
        browser: true
      },
      extends: ["plugin:@typescript-eslint/recommended"],
      files: ["./src/main/typescript/**/*.ts"],
      parser: "@typescript-eslint/parser",
      parserOptions: {
        project: "./src/main/typescript/tsconfig.json",
        sourceType: "module"
      },
      plugins: ["@typescript-eslint", "eslint-plugin-tsdoc"],
      rules: {
        "eslint/lines-between-class-members": "off",
        "tsdoc/syntax": "warn",
        "@typescript-eslint/lines-between-class-members": ["error"],
        "@typescript-eslint/member-ordering": [
          "warn",
          {
            default: {
              memberTypes: [
                "public-static-field",
                "protected-static-field",
                "private-static-field",
                "static-field",

                // static accessors go here

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

                // instance accessors go here

                "public-abstract-field",
                "protected-abstract-field",
                "private-abstract-field",
                "abstract-field",

                "public-instance-method",
                "protected-instance-method",
                "private-instance-method",
                "instance-method",

                "public-abstract-method",
                "protected-abstract-method",
                "private-abstract-method",
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
      },
      overrides: [
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
        }
      ]
    },
    {
      extends: ["plugin:@typescript-eslint/recommended"],
      files: ["./src/test/typescript/tsd/**/*.test-d.ts"],
      parser: "@typescript-eslint/parser",
      parserOptions: {
        project: "./src/test/typescript/tsd/tsconfig.json",
        sourceType: "module"
      },
      plugins: ["@typescript-eslint", "eslint-plugin-tsdoc"]
    },
    {
      extends: ["plugin:@typescript-eslint/recommended"],
      files: ["./gulpfile.ts", "./gulp/**/*.ts"],
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
      env: {
        node: true
      },
      files: ["gulp.js"]
    },
    {
      env: {
        commonjs: true
      },
      files: ["./**/*.cjs"],
      parserOptions: {
        sourceType: "script"
      }
    }
  ]
};
