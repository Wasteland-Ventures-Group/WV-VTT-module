# Wasteland Ventures Foundry VTT System

This is an implementation of the Wasteland Ventures pen and paper RPG system for
the Foundry Virtual Tabletop (Foundry VTT or FVTT) tool.

The system rules themselves can be found on [Google Docs][rules].

## Installation

### The latest release

Simply search for "Wasteland Ventures" in the systems list in the Foundry
package management. You can install it directly via Foundry.

### From main/git

To install the latest development version onto your Foundry instance, first copy
[this URL][system], then go into your setup pages to systems, then paste the URL
into the manifest URL bar and click install.

## Development

### Setup

To develop this system and make use of the tooling in place, the minimum
requirement is [Node.js][node-js]. Node.js usually has the package manager `npm`
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
but generated from Typescript classes. Further, compendiums are composed of one
JSON file per entry and then compiled as part of the build process.

### Gulp Tasks

Gulp is a task runner for Javascript, to automate repetitive tasks. It can even
look out for changes in the input files for a task and rerun the task on its own
in that case.

#### Running gulp

On Linux machines, you can easily run gulp with just this command:

```sh
./gulp.js
```

On Windows machines, you likely have to run it this way:

```pwsh
node gulp.js
```

From here on, only the Linux form will be listed, the Windows form should work
in a similar way.

#### Getting an overview over tasks

For an overview of the tasks, run:

```sh
./gulp.js --tasks
```

#### Background tasks

Some tasks have a variant with the `Watch` suffix. Those tasks are meant to be
run as a background task and will look for changes in the corresponding input
files to run on their own. For example, one can run the following on a terminal
to have the files be recompiled when changes are made to the input files:

```sh
./gulp.js watchAll &
```

### Adding entries to compendiums

The compendium sources are located under `src/compendiums`. They are grouped
first by document type (Usually "actor" and "item") and then by their system sub
types (for example "weapon").

It is recommended to edit the JSON files in those directories with an editor,
that can supply additional information and checks via JSON schema. Currently
there are ready made configurations for VS Code and Nvim with coc-nvim
available.

Before you can start editing, the schemas have to be generated at least once and
again, if changes are made to the system data types. To generate the schemas,
run:

```sh
./gulp.js compSchemas
```

### Adding translations

The translation files are located in `src/lang` and have a ready made JSON
schema in the repo. This schema is written by hand and changes every time the
translations change.

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
Afterwards log in to the [Foundty VTT admin interface][foundry-admin], go to the
wasteland-ventures package and add a new package version.

## Contributing

Issues and pull requests are welcome.

[rules]: https://drive.google.com/drive/folders/0B9tzIuxnnTLrTzlsb3BMTlhpbFk?resourcekey=0-0eZ5HHuCDrAs8sYYkoOTLA
[system]: https://raw.githubusercontent.com/Wasteland-Ventures-Group/WV-VTT-module/main/src/system.json
[node-js]: https://nodejs.org/en/
[nodenv]: https://github.com/nodenv/nodenv
[choco]: https://chocolatey.org/
[ts]: https://www.typescriptlang.org/
[sass]: https://sass-lang.com/
[foundry-admin]: https://foundryvtt.com/admin
