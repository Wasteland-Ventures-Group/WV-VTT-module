import { promises as fs } from "fs";
import { createGenerator } from "ts-json-schema-generator";
import type { JSONSchema7 } from "json-schema";
import Ajv from "ajv";
import standaloneCode from "ajv/dist/standalone/index.js";

const ajv = new Ajv({
  allErrors: true,
  strict: true,
  code: {
    lines: true,
    source: true
  }
});

// The paths here are relative to the project root
const sourcePath = "./src/main/typescript/ruleEngine/ruleElementSource.d.ts";
const tsConfigPath = "./tsconfig-ruleElementSource.json";
const outputBasePath = "./dist/wasteland-ventures/modules/validators";
const outputPath = `${outputBasePath}/ruleElementSource.js`;
const rootType = "RuleElementSource";

export default async function ruleElementValidatorsTask(): Promise<void> {
  const schema = createSchema();
  const validator = createValidatorFunction(schema);
  const moduleCode = createModuleCode(validator);
  await fs.mkdir(outputBasePath, { recursive: true });
  return fs.writeFile(outputPath, moduleCode);
}
ruleElementValidatorsTask.description =
  "Generate the RuleElement source validator functions.";

function createSchema() {
  return createGenerator({
    path: sourcePath,
    skipTypeCheck: true,
    tsconfig: tsConfigPath,
    type: rootType
  }).createSchema(rootType);
}

function createValidatorFunction(schema: JSONSchema7) {
  return ajv.compile(schema);
}

function createModuleCode(validator: ReturnType<Ajv["compile"]>) {
  return convertToEsm(standaloneCode(ajv, validator));
}

// This conversion is needed, as long as AJV does not support generating ESM
// natively.
// See: https://github.com/ajv-validator/ajv/issues/1523
function convertToEsm(source: string): string {
  return source.replace(
    /module\.exports = \w+;\nmodule\.exports\.default = (\w+)/,
    "export default $1"
  );
}
