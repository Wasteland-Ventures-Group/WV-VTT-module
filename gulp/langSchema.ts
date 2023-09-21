import { promises as fs } from "fs";
import { zodToJsonSchema } from "zod-to-json-schema";
import { LANG_SCHEMA } from "../src/main/typescript/lang.js";

// The paths here are relative to the project root
const outputBasePath = "./src/main/schemas";
const outputPath = `${outputBasePath}/lang.json`;

export default async function langSchemaTask(): Promise<void> {
  const schema = zodToJsonSchema(LANG_SCHEMA, "Language");
  await fs.mkdir(outputBasePath, { recursive: true });
  return fs.writeFile(outputPath, JSON.stringify(schema));
}
langSchemaTask.description = "Generate a language file schema.";
