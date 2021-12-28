import { promises as fs } from "fs";
import {
  Config,
  createFormatter,
  createParser,
  createProgram,
  ObjectType,
  ObjectTypeFormatter,
  SchemaGenerator
} from "ts-json-schema-generator";
import type { JSONSchema7 } from "json-schema";

// The paths here are relative to the project root
const sourceBasePath = "./src/main/typescript/data";
const itemSourceBasePath = `${sourceBasePath}/item`;
const tsConfigPath = "./tsconfig-schemas.json";
const outputBasePath = "./src/main/schemas";
const itemOutputBasePath = `${outputBasePath}/item`;

const schemaConfigs: SchemaConfig[] = [
  {
    fileName: "weapon",
    outputBasePath: itemOutputBasePath,
    path: `${itemSourceBasePath}/weapon/source.ts`,
    type: "CompendiumWeapon"
  }
];

export default async function compendiumSchemasTask(): Promise<void[]> {
  return Promise.all(
    schemaConfigs.map((config) => {
      return createSchema(
        {
          skipTypeCheck: true,
          tsconfig: tsConfigPath,
          ...config
        },
        config.outputBasePath,
        config.fileName
      );
    })
  );
}
compendiumSchemasTask.description =
  "Generate the JSON schemas for the compendiums.";

async function createSchema(
  config: Config,
  outputBasePath: string,
  fileName: string
): Promise<void> {
  const formatter = createFormatter(
    config,
    (fmt, circularReferenceTypeFormatter) =>
      fmt.addTypeFormatter(new IdFormatter(circularReferenceTypeFormatter))
  );
  const program = createProgram(config);
  const parser = createParser(program, config);
  const generator = new SchemaGenerator(program, parser, formatter, config);

  await fs.mkdir(outputBasePath, { recursive: true });
  return fs.writeFile(
    `${outputBasePath}/${fileName}.json`,
    JSON.stringify(generator.createSchema(config.type))
  );
}

interface SchemaConfig {
  fileName: string;
  outputBasePath: string;
  path: string;
  type: string;
}

class IdFormatter extends ObjectTypeFormatter {
  override supportsType(type: ObjectType): boolean {
    if (!(type instanceof ObjectType)) return false;
    return type
      .getProperties()
      .some((property) => property.getName() === "_id");
  }

  override getDefinition(type: ObjectType): JSONSchema7 {
    const definition = super.getDefinition(type);
    if (definition?.properties?._id) {
      if (typeof definition.properties._id !== "boolean") {
        definition.properties._id.pattern = "^[a-zA-Z0-9]{16}$";
      }
    }
    return definition;
  }
}
