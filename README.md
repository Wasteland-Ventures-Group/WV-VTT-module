# Wasteland Ventures Foundry VTT System

This is an implementation of the Wasteland Ventures pen and paper RPG system for
the Foundry Virtual Tabletop (Foundry VTT or FVTT) tool.

## Installation

To install this system onto your Foundry instance, first copy [this
URL][system], then go into your setup pages to systems, then paste the URL into
the manifest URL bar and click install.

## Development

### Setup

To develop this system and make use of the tooling in place, the minimum
requirement is [Node.js][nodeJs]. Node.js usually has the package manager `npm`
packaged with it. This is all you need to install the project's dependencies and
get started developing.

A recommended way to install and manage Node.js on Linux systems is by using
[nodenv][nodenv] or the distribution's own package manager. On Windows, using
[Chocolatey][choco] or the Node.js installer is recommended.

Once Node.js and `npm` are installed, run `npm ci` in the project root directory
and all dependencies will be installed into the `node_modules` directory.

### Compiling/Transpiling

This project uses [Typescript][ts] to generate its Javascript and [Sass][sass]
to generate its CSS. In addition, the `template.json` is not written by hand,
but generated from Typescript classes.

### Gulp Tasks

Gulp is a task runner for Javascript, to automate repetitive tasks. It can even
look out for changes in the input files for a task and rerun the task on its own
in that case.

There are two sets of major tasks in this project currently. The `ts` tasks
compile the Typescript under `./src/typescript` (and all subdirs) into
Javascript in `./dist/wasteland-ventures/modules`. The `sass` tasks compile Sass
files under `./src/sass` (and all subdirs) into CSS files in
`./dist/wasteland-ventures/css`. Besides that, there is the `template` task that
generate the `template.json` file out of the Typescript source code. Finally
there are copy tasks for the `system.json` (`system`) and Handlebars templates
(`hbs`). If you just want to build the whole thing, use the `pack` task.

Some tasks have a variant with the `Watch` suffix. Those tasks are meant to be
run as a background task and will look for changes in the corresponding input
files to run on their own. For example, one can run the following on a terminal
to have the Sass and Typescript be recompiled when changes are made to the input
files:
```sh
./gulp.js watchAll &
```

### Putting the results in FoundryVTT

For the time being, development is the easiest, when putting a symlink in
Foundry's data dir as `Data/systems/wasteland-ventures` and having it link to
this repository's `dist/wasteland-ventures` dir. You can then just reload the
foundry page in a browser and your changes are visible. If the `system.json` is
changed, you have to navigate back to the setup page and reload your test world.

### Releasing

To create a release, first go into the `CHANGELOG.md` and check for changes.
Based on the unreleased changes, determine a new version number by following the
semantic versioning spec. Then add that version number to the changelog and
change the `system.json` version number to the new version. Also in the
`system.json` change the `download` property to the location where the new
download will be in. Then commit all that and tag it with a version tag like so:
`git tag v0.0.2`. After this run `./gulp.js buildZip`, push the commit and tag
with `git push; git push --tags` and create a new release from the tag on
GitHub. Then upload the packaged zip from the `dist` dir to the release.

## Contributing

Issues and pull requests are welcome.

[system]: https://raw.githubusercontent.com/Wasteland-Ventures-Group/WV-VTT-module/main/src/system.json
[nodeJs]: https://nodejs.org/en/
[nodenv]: https://github.com/nodenv/nodenv
[choco]: https://chocolatey.org/
[ts]: https://www.typescriptlang.org/
[sass]: https://sass-lang.com/
