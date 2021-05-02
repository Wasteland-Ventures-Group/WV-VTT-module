import * as log from "fancy-log";
import { src, dest, parallel, watch } from "gulp";
import * as dartSass from "gulp-dart-sass";
import * as typescript from "gulp-typescript";

// = Sass tasks ================================================================

const cssOutPath = "./dist/css";
const sassPath = "./src/sass/**/*.sass";

export function sass() {
  return src(sassPath)
    .pipe(dartSass().on("error", dartSass.logError))
    .pipe(dest(cssOutPath));
}
sass.description = "Compile all Sass files into CSS";

export function sassWatch() {
  const watcher = watch(sassPath, sass);

  watcher.on("change", (path) => {
    log(`${path} changed`);
  });
}
sassWatch.description =
  "Watch the Sass input files for changes and run the compile task";

// = Typescript tasks ==========================================================

const tsProject = typescript.createProject("tsconfig.json");
const jsOutPath = "./dist/modules";

export function ts() {
  return tsProject.src().pipe(tsProject()).js.pipe(dest(jsOutPath));
}
ts.description = "Compile all Typescript files to Javascript";

export function tsWatch() {
  const includes = tsProject.config.include;
  if (includes) {
    const watcher = watch(includes);

    watcher.on("change", (path) => {
      log(`${path} changed`);
    });
  }
}
tsWatch.description =
  "Watch the Typescript input files for changes and run the compile task";

// = General tasks =============================================================

export const watchAll = parallel(sassWatch, tsWatch);
watchAll.description = "Run all watch tasks";
