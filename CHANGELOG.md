# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- automatic AP reset on combat start and next round ([#4](https://github.com/Wasteland-Ventures-Group/WV-VTT-module/issues/4))

### Fixed

- actor images getting stretched in the actor sheet in certain cases
- localized the name of the actor sheet

## [0.2.0] - 2021-05-16

### Added

- internal system settings
- data migration framework

### Changed

- changed vitals into foundry "Resources", so they can be used as bars

### Fixed

- fixed the default data path for initiative

## [0.1.0] - 2021-05-15

### Added

- support for the DragRuler foundry module, supporting ground movement and
  sprinting highlights
- saving actor background information
- show the associated SPECIAL for each skill in the character sheet
- ability to select the Thaumaturgy associated SPECIAL
- editable strain

### Changed

- restyled most of the character sheet

### Removed

- the system specific "name" field for actors, since this is already saved by
  foundry itself

### Fixed

- actor images can now be saved properly

## [0.0.2] - 2021-05-11

### Added

- editable skill ranks on the basic character Actor

## [0.1.0] - 2021-05-08

### Added

- basic character Actor implementation with editable SPECIALs

[Unreleased]: https://github.com/Wasteland-Ventures-Group/WV-VTT-module/compare/v0.2.0...HEAD
[0.2.0]:      https://github.com/Wasteland-Ventures-Group/WV-VTT-module/compare/v0.1.0...v0.2.0
[0.1.0]:      https://github.com/Wasteland-Ventures-Group/WV-VTT-module/compare/v0.0.2...v0.1.0
[0.0.2]:      https://github.com/Wasteland-Ventures-Group/WV-VTT-module/compare/v0.0.1...v0.0.2
[0.0.1]:      https://github.com/Wasteland-Ventures-Group/WV-VTT-module/releases/tag/v0.0.1
