import { promises as fs } from "fs";
import glob from "glob-promise";
import gulp from "gulp";
import { logChange } from "../gulpfile.js";

const inputBasePath = "./src/compendiums";
const itemInputBasePath = `${inputBasePath}/item`;
const outputBasePath = "./dist/wasteland-ventures/compendiums";
const itemOutputBasePath = `${outputBasePath}/item`;

const watchPath = `${inputBasePath}/**/*.json`;

const compendiumConfigs: CompendiumConfig[] = [
  {
    inputGlob: `${itemInputBasePath}/weapon/*.json`,
    outputPath: `${itemOutputBasePath}/weapons.db`
  }
];

export default async function compileCompendiumsTask(): Promise<void[]> {
  await Promise.all([fs.mkdir(itemOutputBasePath, { recursive: true })]);

  return Promise.all(
    compendiumConfigs.map((config) => {
      return compileCompendium(config);
    })
  );
}
compileCompendiumsTask.description =
  "Compile all single entry files to compemdiums.";

export function compileCompendiumsWatchTask(): void {
  gulp.watch(watchPath, compileCompendiumsTask).on("change", logChange);
}

async function compileCompendium(config: CompendiumConfig): Promise<void> {
  const fileNames = await glob(config.inputGlob);
  const contents = await Promise.all(
    fileNames.map(async (fileName) =>
      JSON.stringify(JSON.parse((await fs.readFile(fileName)).toString()))
    )
  );
  return fs.writeFile(config.outputPath, contents.join("\n"));
}

interface CompendiumConfig {
  inputGlob: string;
  outputPath: string;
}
