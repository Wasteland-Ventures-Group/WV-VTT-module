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
Javascript, [Sass](https://sass-lang.com/) to generate its CSS and it and FVTT
itself use [Handlebars](https://handlebarsjs.com/) to populate the application
templates with data. While populating the templates with data, a localization
mechanism is used to put translated strings into the the templates. The entire
templating mechanism is mocked by a few [Gulp](https://gulpjs.com/) tasks. That
way templates can be created and tested without the need to start FVTT and load
the system into it.

### Gulp Tasks

Gulp is a task runner for Javascript, to automate repetitive tasks. It can even
look out for changes in the input files for a task and rerun the task on its own
in that case.

There are three sets of major tasks in this project currently. The `ts` tasks
compile the Typescript under `./src/typescript` (and all subdirs) into
Javascript in `./dist/modules`. The `sass` tasks compile Sass files under
`./src/sass` (and all subdirs) into CSS files in `./dist/css`. The `hbs` tasks
compile Handlebars templates under `./dist/templates` into HTML pages under
`./test/out/html`. In doing so they use the mock character data under
`./test/mock` and the translation data under `./dist/lang`. In contrast to the
`sass` tasks, the `hbs` tasks are not generalized. Instead there is a single
task for each template. However, there is a general `hbs` task, that runs all of
them in parallel.

Some tasks have a variant with the `:watch` suffix. Those tasks are meant to be
run as a background task and will look for changes in the corresponding input
files to run on their own. For example, one can run the following on a terminal
to have the Sass and Handlebars be recompiled when changes are made to the input
files:
```sh
gulp &
```

You can then work on the files and open the final HTML file in a browser to see
the compiled version. The gulp task also takes care of linking the compiled CSS
to the HTML file.

## Contributing

Issues and pull requests are welcome.
