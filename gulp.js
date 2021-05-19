#!/usr/bin/env node

// This is a shim around `gulp`, to easily enable us to run `gulp` with some
// environment variables set that are needed for ts-node's ESM loader. Doing
// this in Javascript allows us to stay independent of the system shell.
//
// The reason we need ts-node's ESM loader instead of the default one, is that
// it allows us to specify import paths with `.js` file extensions and have
// ts-node also look for the a module without the extension, then finding the
// file with the `.ts` extension. This whole thing is needed for the dynamic
// creation of the `template.json` file from Typescript types.
// See also: https://github.com/TypeStrong/ts-node/issues/1007

import { spawn } from "child_process";

process.env.NODE_OPTIONS = "--no-warnings --loader ts-node/esm";
const gulp = spawn(
  "gulp",
  ["--color", ...process.argv.filter((arg) => !arg.startsWith("/"))],
  {
    env: process.env
  }
);
gulp.stdout.on("data", (data) => process.stdout.write(data.toString()));
gulp.stderr.on("data", (data) => process.stderr.write(data.toString()));

gulp.on("error", (error) => console.log(error.message.toString()));
gulp.on("close", (code) => process.exit(code));
