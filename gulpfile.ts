import * as log from "fancy-log";
import { src, dest, parallel, watch } from "gulp";
import * as dartSass from "gulp-dart-sass";
import * as typescript from "gulp-typescript";

// = Sass tasks ================================================================

const cssOutPath = "./dist/css";
const sassPath = "./src/sass/**/*.sass";

function compileSass() {
  return src(sassPath)
    .pipe(dartSass().on("error", dartSass.logError))
    .pipe(dest(cssOutPath));
}
compileSass.description = "Compile all Sass files into CSS";

function watchSass() {
  const watcher = watch(sassPath, compileSass);

  watcher.on("change", (path) => {
    log(`${path} changed`);
  });
}
watchSass.description =
  "Watch the Sass input files for changes and run the compile task";

// = Typescript tasks ==========================================================

const tsProject = typescript.createProject("tsconfig.json");
const jsOutPath = "./dist/modules";

function compileTypescript() {
  return tsProject.src().pipe(tsProject()).js.pipe(dest(jsOutPath));
}
compileTypescript.description = "Compile all Typescript files to Javascript";

function watchTypescript() {
  const includes = tsProject.config.include;
  if (includes) {
    const watcher = watch(includes);

    watcher.on("change", (path) => {
      log(`${path} changed`);
    });
  }
}
watchTypescript.description =
  "Watch the Typescript input files for changes and run the compile task";

// = General tasks =============================================================

const watchAll = parallel(watchSass, watchTypescript);
watchAll.description = "Run all watch tasks";

// = Task exports ==============================================================

export const sass = compileSass;
export const sassWatch = watchSass;
export const ts = compileTypescript;
export const tsWatch = watchTypescript;
export default watchAll;
