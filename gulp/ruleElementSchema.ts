import { promises as fs } from "fs";
import { createGenerator } from "ts-json-schema-generator";

// The paths here are relative to the project root
const sourcePath = "./src/typescript/ruleEngine/ruleElementSource.d.ts";
const tsConfigPath = "./tsconfig-ruleElementSource.json";
const outputBasePath = "./dist/wasteland-ventures/schemas";
const outputPath = `${outputBasePath}/ruleElementSource.json`;
const rootType = "RuleElementSource";

export default async function ruleElementSourceSchemaTask(): Promise<void> {
  const schema = createGenerator({
    path: sourcePath,
    skipTypeCheck: true,
    tsconfig: tsConfigPath,
    type: rootType
  }).createSchema(rootType);
  await fs.mkdir(outputBasePath, { recursive: true });
  return fs.writeFile(outputPath, JSON.stringify(schema));
}
ruleElementSourceSchemaTask.description =
  "Generate the RuleElement source schema.";
