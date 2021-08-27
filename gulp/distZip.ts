import fs from "fs";
import gulp from "gulp";
import zip from "gulp-zip";
import { distPrefix, distWvPrefix } from "../gulpfile.js";
import { CONSTANTS } from "../src/typescript/constants.js";

export default function distZipTask(): NodeJS.ReadWriteStream {
  return gulp
    .src(`${distPrefix}/**`)
    .pipe(zip(`${CONSTANTS.systemId}-${getVersionNumber()}.zip`))
    .pipe(gulp.dest(distPrefix));
}
distZipTask.description = "Zip the distribution files";

function getVersionNumber(): string {
  let systemJson: string;
  if (fs.existsSync(`${distWvPrefix}/system.json`)) {
    systemJson = `${distWvPrefix}/system.json`;
  } else {
    systemJson = "./src/system.json";
  }
  return JSON.parse(fs.readFileSync(systemJson).toString())["version"];
}
