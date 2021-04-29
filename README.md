# Wasteland Ventures Foundry VTT System

This is an implementation of the Wasteland Ventures pen and paper RPG system for
the Foundry Virtual Tabletop (Foundry VTT or FVTT) tool.

## Installation

The current version of this system is not production ready yet. Once it is the
installation instructions will be provided here, but should be fairly standard
for Foundry VTT.

## Development

### Setup

To develop this system and make use of the tooling in place, the minimum
requirement is [Node.js](https://nodejs.org/en/). Node.js usually has the
package manager `npm` packaged with it. This is all you need to install the
project's dependencies and get started developing.

A recommended way to install and manage Node.js on Linux systems is by using
[nodenv](https://github.com/nodenv/nodenv) or the distribution's own package
manager. On Windows, using [Chocolatey](https://chocolatey.org/) or the Node.js
installer is recommended.

Once Node.js and `npm` are installed, run `npm install` in the project root
directory and all dependencies will be installed into the `node_modules`
directory.

### Compiling/Transpiling

This project uses [Typescript](https://www.typescriptlang.org/) to generate its
Javascript and [Sass](https://sass-lang.com/) to generate its CSS.

### Gulp Tasks

Gulp is a task runner for Javascript, to automate repetitive tasks. It can even
look out for changes in the input files for a task and rerun the task on its own
in that case.

There are two sets of major tasks in this project currently. The `ts` tasks
compile the Typescript under `./src/typescript` (and all subdirs) into
Javascript in `./dist/modules`. The `sass` tasks compile Sass files under
`./src/sass` (and all subdirs) into CSS files in `./dist/css`.

Some tasks have a variant with the `Watch` suffix. Those tasks are meant to be
run as a background task and will look for changes in the corresponding input
files to run on their own. For example, one can run the following on a terminal
to have the Sass and Typescript be recompiled when changes are made to the input
files:
```sh
gulp &
```

### Putting the results in FoundryVTT

For the time being, development is the easiest, when putting a symlink in
Foundry's data dir as `Data/systems/wasteland-ventures` and having it link to
this repository's `dist` dir. You can then just reload the foundry page ina
browser and your changes are visible. If the `system.json` is changed, you have
to navigate back to the setup page and reload your test world.

## Contributing

Issues and pull requests are welcome.
