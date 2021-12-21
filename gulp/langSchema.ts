import { promises as fs } from "fs";
import { createGenerator } from "ts-json-schema-generator";

// The paths here are relative to the project root
const sourcePath = "./src/main/typescript/lang.d.ts";
const tsConfigPath = "./tsconfig-langSchema.json";
const outputBasePath = "./src/main/schemas";
const outputPath = `${outputBasePath}/lang.json`;
const rootType = "LangSchema";

export default async function langSchemaTask(): Promise<void> {
  const schema = createGenerator({
    path: sourcePath,
    skipTypeCheck: true,
    tsconfig: tsConfigPath,
    type: rootType
  }).createSchema(rootType);
  await fs.mkdir(outputBasePath, { recursive: true });
  return fs.writeFile(outputPath, JSON.stringify(schema));
}
langSchemaTask.description = "Generate a language file schema.";
