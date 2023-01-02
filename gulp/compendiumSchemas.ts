import { promises as fs } from "fs";
import { z, ZodSchema } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

// The paths here are relative to the project root
const outputBasePath = "./src/main/schemas";
const itemOutputBasePath = `${outputBasePath}/item`;

export default async function compendiumSchemasTask(): Promise<void[]> {
  const schemaConfigs: SchemaConfig[] = [
    {
      fileName: "ammo",
      outputBasePath: itemOutputBasePath,
      schema: (await import("../src/main/typescript/data/item/ammo/source.js"))
        .COMP_AMMO_SCHEMA
    },
    {
      fileName: "apparel",
      outputBasePath: itemOutputBasePath,
      schema: (
        await import("../src/main/typescript/data/item/apparel/source.js")
      ).COMP_APPAREL_SCHEMA
    },
    {
      fileName: "magic",
      outputBasePath: itemOutputBasePath,
      schema: (await import("../src/main/typescript/data/item/magic/source.js"))
        .COMP_MAGIC_SCHEMA
    },
    {
      fileName: "race",
      outputBasePath: itemOutputBasePath,
      schema: (await import("../src/main/typescript/data/item/race/source.js"))
        .COMP_RACE_SCHEMA
    },
    {
      fileName: "weapon",
      outputBasePath: itemOutputBasePath,
      schema: (
        await import("../src/main/typescript/data/item/weapon/source.js")
      ).COMP_WEAPON_SCHEMA
    }
  ];
  return Promise.all(schemaConfigs.map((config) => createSchema(config)));
}
compendiumSchemasTask.description =
  "Generate the JSON schemas for the compendiums.";

async function createSchema(config: SchemaConfig): Promise<void> {
  await fs.mkdir(config.outputBasePath, { recursive: true });
  const schema = deepRemoveDefaults(config.schema);
  return fs.writeFile(
    `${config.outputBasePath}/${config.fileName}.json`,
    JSON.stringify({
      ...zodToJsonSchema(schema, { target: "jsonSchema7" })
    })
  );
}

function deepRemoveDefaults(schema: z.ZodTypeAny): z.ZodTypeAny {
  if (schema instanceof z.ZodDefault)
    return deepRemoveDefaults(schema.removeDefault());

  if (schema instanceof z.ZodObject) {
    const newShape = { ...schema.shape };

    for (const key in schema.shape) {
      const fieldSchema = schema.shape[key];
      newShape[key] = deepRemoveDefaults(fieldSchema);
    }
    return new z.ZodObject({
      ...schema._def,
      shape: () => newShape
    });
  }

  if (schema instanceof z.ZodArray)
    return z.ZodArray.create(deepRemoveDefaults(schema.element));

  if (schema instanceof z.ZodOptional)
    return z.ZodOptional.create(deepRemoveDefaults(schema.unwrap()));

  if (schema instanceof z.ZodNullable)
    return z.ZodNullable.create(deepRemoveDefaults(schema.unwrap()));

  if (schema instanceof z.ZodTuple)
    return z.ZodTuple.create(
      schema.items.map((item: z.ZodTypeAny) => deepRemoveDefaults(item))
    );

  return schema;
}

interface SchemaConfig {
  fileName: string;
  outputBasePath: string;
  schema: ZodSchema;
}
