# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- back-end bounds validation for the roll modifier dialog
- back-end bounds validation for the character sheet [#9]
- front-end bounds validation for the character sheet [#9]

[#9]: https://github.com/Wasteland-Ventures-Group/WV-VTT-module/issues/9

## [0.3.1] - 2021-07-17

### Added

- flavor text for character sheet rolls ([#1](https://github.com/Wasteland-Ventures-Group/WV-VTT-module/issues/1))
- translatable migration notifications
- clickable labels to focus the corresponding target inputs
- roll with modifier by Shift-Clicking the roll buttons  ([#2](https://github.com/Wasteland-Ventures-Group/WV-VTT-module/issues/2))
- roll as GM whisper by Ctrl-Clicking the roll buttons

### Fixed

- pressing enter in the character sheet no longer triggers a Strength roll
  ([#8](https://github.com/Wasteland-Ventures-Group/WV-VTT-module/issues/8))

## [0.3.0] - 2021-07-10

### Added

- support for Foundry VTT 0.8.X
- automatic AP reset on combat start and next round ([#4](https://github.com/Wasteland-Ventures-Group/WV-VTT-module/issues/4))
- a gulp shim to use the ts-node/esm loader and prevent the module not found
  errors

### Deprecated

- support for Foundry VTT 0.7.X

### Fixed

- actor images getting stretched in the actor sheet in certain cases
- localized the name of the actor sheet
- minor improvements to the character sheet

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

[Unreleased]: https://github.com/Wasteland-Ventures-Group/WV-VTT-module/compare/v0.3.1...HEAD
[0.3.1]:      https://github.com/Wasteland-Ventures-Group/WV-VTT-module/compare/v0.3.0...v0.3.1
[0.3.0]:      https://github.com/Wasteland-Ventures-Group/WV-VTT-module/compare/v0.2.0...v0.3.0
[0.2.0]:      https://github.com/Wasteland-Ventures-Group/WV-VTT-module/compare/v0.1.0...v0.2.0
[0.1.0]:      https://github.com/Wasteland-Ventures-Group/WV-VTT-module/compare/v0.0.2...v0.1.0
[0.0.2]:      https://github.com/Wasteland-Ventures-Group/WV-VTT-module/compare/v0.0.1...v0.0.2
[0.0.1]:      https://github.com/Wasteland-Ventures-Group/WV-VTT-module/releases/tag/v0.0.1
