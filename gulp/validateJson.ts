import { promises as fs } from "fs";
import Ajv, { ValidateFunction } from "ajv";
import glob from "glob-promise";
import log from "fancy-log";

const ajv = new Ajv({ allErrors: true, strict: true });

const baseSchemaPath = "./src/main/schemas";
const langSchemaPath = `${baseSchemaPath}/lang.json`;
const baseItemSchemaPath = `${baseSchemaPath}/item`;

const validationConfigs: ValidationConfig[] = [
  {
    dataGlob: "./src/main/lang/*.json",
    schemaPath: langSchemaPath
  },
  {
    dataGlob: "./src/main/compendiums/item/ammo/**/*.json",
    schemaPath: `${baseItemSchemaPath}/ammo.json`
  },
  {
    dataGlob: "./src/main/compendiums/item/apparel/**/*.json",
    schemaPath: `${baseItemSchemaPath}/apparel.json`
  },
  {
    dataGlob: "./src/main/compendiums/item/magic/**/*.json",
    schemaPath: `${baseItemSchemaPath}/magic.json`
  },
  {
    dataGlob: "./src/main/compendiums/item/misc/**/*.json",
    schemaPath: `${baseItemSchemaPath}/misc.json`
  },
  {
    dataGlob: "./src/main/compendiums/item/race/**/*.json",
    schemaPath: `${baseItemSchemaPath}/race.json`
  },
  {
    dataGlob: "./src/main/compendiums/item/weapon/**/*.json",
    schemaPath: `${baseItemSchemaPath}/weapon.json`
  }
];

export default async function validateJsonTask(): Promise<void> {
  await Promise.all(
    validationConfigs.map((config) => {
      return validateFiles(config);
    })
  );
}
validateJsonTask.description =
  "Validate all JSON files with already existing schemas.";

async function validateFiles(config: ValidationConfig): Promise<void> {
  const fileNames = await glob(config.dataGlob);
  const validate = ajv.compile(
    JSON.parse((await fs.readFile(config.schemaPath)).toString())
  );
  const results = await Promise.all(
    fileNames.map(async (fileName) => {
      const valid = validate(
        JSON.parse((await fs.readFile(fileName)).toString())
      );
      if (!valid) logErrors(fileName, validate);
      return valid;
    })
  );
  if (results.some((result) => result === false)) {
    return Promise.reject(new Error("One or more JSON files are invalid."));
  }
}

function logErrors(fileName: string, validate: ValidateFunction<unknown>) {
  validate.errors?.forEach((error) => {
    log(`${fileName}: ${JSON.stringify(error)}`);
    log.error(`${fileName}: ${error?.message}`);
  });
}

interface ValidationConfig {
  dataGlob: string;
  schemaPath: string;
}
