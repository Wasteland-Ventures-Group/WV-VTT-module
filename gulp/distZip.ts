import { promises as fs } from "fs";
import gulp from "gulp";
import zip from "gulp-zip";
import { distPrefix, distWvPrefix } from "../gulpfile.js";
import { CONSTANTS } from "../src/main/typescript/constants.js";

export default async function distZipTask(): Promise<NodeJS.ReadWriteStream> {
  return gulp
    .src(`${distPrefix}/**`)
    .pipe(zip(`${CONSTANTS.systemId}-${await getVersionNumber()}.zip`))
    .pipe(gulp.dest(distPrefix));
}
distZipTask.description = "Zip the distribution files";

async function getVersionNumber(): Promise<string> {
  let systemJson: string;
  try {
    await fs.access(`${distWvPrefix}/system.json`);
    systemJson = `${distWvPrefix}/system.json`;
  } catch {
    systemJson = "./src/main/system.json";
  }
  return JSON.parse((await fs.readFile(systemJson)).toString())["version"];
}
