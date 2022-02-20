# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- physical items now have a rarity property
- basic support for ammo items
  ([#140](https://github.com/Wasteland-Ventures-Group/WV-VTT-module/issues/140))
- a basic inventory tab to actors
- misscellaneous items
  ([#140](https://github.com/Wasteland-Ventures-Group/WV-VTT-module/issues/140))
- ability to add misc items to an actor from the actor sheet

### Fixed

- chat message details not expanding
- whispered SPECIAL and Skill rolls not working

## [0.11.3] - 2022-02-06

### Fixed

- GMs who did not create an Actor were only seeing the limited view, if that
  Actor's default permissions were set to "Limited"
  ([#147](https://github.com/Wasteland-Ventures-Group/WV-VTT-module/issues/147))
- rolling initiative not working
  ([#148](https://github.com/Wasteland-Ventures-Group/WV-VTT-module/issues/148))
- weapon "Staff" having a short range of 2 instead of 4
  ([#149](https://github.com/Wasteland-Ventures-Group/WV-VTT-module/issues/149))
- the chat log not scrolling to the bottom on weapon attacks
  ([#150](https://github.com/Wasteland-Ventures-Group/WV-VTT-module/issues/150))

## [0.11.2] - 2022-01-22

### Fixed

- rule element hooks not being required

## [0.11.1] - 2022-01-22

### Added

- rule elements can now modify documents at different places in the data
  preparation chain

## [0.11.0] - 2022-01-22

### Breaking

"playerCharacter" is removed as a possible actor type. Please use the previous
version to migrate your worlds, then upgrade to this version.

## [0.10.0] - 2022-01-22

### Breaking

Please upgrade to this version once, if you are upgrading from an earlier
version, then continue with upgrading to the next version.

### Added

- added background fields for actors
  - race
  - gender
  - age
  - virtue ([#128](https://github.com/Wasteland-Ventures-Group/WV-VTT-module/issues/128))
  - special talent
  - appearance
  - cutie mark
  - personality
  - social contacts
- a limited character sheet for limited access to a character
  ([#11](https://github.com/Wasteland-Ventures-Group/WV-VTT-module/issues/11))
- JSON schema validation for character system data at runtime

### Changed

- weapon attack messages now show non-existent ranges as "-" instead of omitting
  them
- translations have been refactored and most keys changed, deduplicated and made
  more consistent
- SPECIALs are no longer one flat value, but track the points invested, their
  base value, permanent and temporary total
  ([#129](https://github.com/Wasteland-Ventures-Group/WV-VTT-module/issues/129))
- the type name of characters is changed from "playerCharacter" to "character"

### Removed

- history field from actors

## [0.9.1] - 2022-01-08

### Changed

- removed Point Blank entirely, as it is no longer a range, but a malus negator

## [0.9.0] - 2022-01-08

### Breaking

- old weapon attack messages might display incorrectly

### Added

- notifications for errors in weapon macros created from source
- a value replacing rule element
  ([#95](https://github.com/Wasteland-Ventures-Group/WV-VTT-module/issues/95))
- weapon attack details on not executed attacks
  ([#111](https://github.com/Wasteland-Ventures-Group/WV-VTT-module/issues/111))
- action point details on weapon attack messages
  ([#110](https://github.com/Wasteland-Ventures-Group/WV-VTT-module/issues/110))

### Changed

- use esbuild to package the system
  ([#73](https://github.com/Wasteland-Ventures-Group/WV-VTT-module/issues/73))
  - vastly improved system load times (down to less than 100ms from more than
    2s)
  - one bundled javascript file
  - added sourcemaps for typescript sources
- syntax and schema errors in rule elements are now handled more gracefully and
  allow further editing instead of resetting to the previous state. Also syntax
  errors are now communicated with other error messages for a rule element
  instead of using the notification system. Both syntax errors and schema errors
  now prevent saving of a particular rule element only and no longer block
  saving the entire item. The changes are kept until foundry is reloaded or the
  errors are fixed and the rule element could be saved.
- creating or updating weapon items with invalid system data is now prevented
  ([#117](https://github.com/Wasteland-Ventures-Group/WV-VTT-module/issues/117))
- JSON validators are now globally available under `game.wv.validators`

### Fixed

- RuleElements not working on unowned items
- Point Blank rules applying to every weapon

## [0.8.0] - 2021-12-28

### Breaking

- This and future versions only support Foundry VTT v9 or higher

### Fixed

- AP checks not working for GMs, even when the system settings were set up to do
  so
- critical flagging now correctly works with just "fcs" or "fcf" given and uses
  "&lt;=5" and "&gt;=95" by default

## [0.7.1] - 2021-12-19

### Fixed

- the base damage dice amount not being considered when displaying the damage
  formula on weapon sheets

## [0.7.0] - 2021-12-19

### Added

- automatic range measuring when using targeting
  ([#75](https://github.com/Wasteland-Ventures-Group/WV-VTT-module/issues/75))
- a listing of modifiers in weapon attack system messages
  ([#76](https://github.com/Wasteland-Ventures-Group/WV-VTT-module/issues/76))
- weapons
  - Alien Blaster
  - Arcane Glove
  - Auto-Axe
  - Balefire Egg Launcher
  - Baseball Bat
  - Bladed Gauntlets
  - Buckington Automatic Rifle M18
  - Buckscatter G-M7 Launcher
  - Dynamite
  - Enclave Gale Blaster
  - Enclave Hailgun
  - Enclave Novasurge Rifle
  - Enclave Rainmaker
  - Enclave Thunderbuck
  - Frag Grenade
  - GAG Incinerator
  - GAG Thunder Cannon
  - Gauss Minigun
  - Gauss Pistol
  - Gauss Revolver
  - Gauss Rifle
  - Gauss Shotgun
  - Gauss SMG
  - Gretta M28 MG "Pecker"
  - Gretta M33 MG "Predator"
  - Gretta M3 SMG "Greaser"
  - H&K MGat-39 "Mini Gun"
  - Hellhound Gauntlets
  - Hoof of Goddess
  - Hunting Bow
  - IF-44 "Angel Bunny"
  - IF-84 "Stampede"
  - IF-92 "Melrose"
  - IF-G12 "Champion"
  - Improvised Melee (small)
  - Longbow
  - Lumber Axe
  - Mace
  - Manticore Gauntlets
  - Molotrot Cocktail
  - No Weapon
  - Plasma Grenade
  - Power Glove
  - Q-Same AEF-451 Flamer “Book Burner”
  - Q-Same AEW-5 Arcane Pistol
  - Q-Same AEW-6 Arcane Revolver
  - Q-Same AEW-21 Arcane Rifle
  - Q-Same AEW-33 Tri-Arcane Rifle
  - Q-Same Arcane Gatling
  - Q-Same MLEM
  - Ripper
  - SFO Launcher "Thumper"
  - SFO Rocket Launcher "Boomer"
  - Shishkebab
  - Silaha Plasma "Corona"
  - Silaha Plasma "Death Star"
  - Silaha Plasma "Fusion"
  - Silaha Plasma "Hestia"
  - Silaha Plasma "Igneous"
  - Silaha Plasma "Vulcan"
  - Sledgehammer
  - Sparkle-Nade
  - Spear
  - Super Sledge
  - Thermic Lance
  - Warhammer
  - Yao Guai Gauntlets
- missing notes on weapons
  - IF-P39 "Troubleshoes"
  - Zebra Rifle
- new attack "Throw" for weapons:
  - Fire Axe
  - Lumber Axe
- attribute Ranges for weapons:
  - Fire Axe
  - Lumber Axe

### Changed

- the details section of weapon attack messages is listed first before hit and
  damage roll
  ([#76](https://github.com/Wasteland-Ventures-Group/WV-VTT-module/issues/76))
- lint markdown files with prettier
  ([#78](https://github.com/Wasteland-Ventures-Group/WV-VTT-module/issues/78))
- change the weapon attack chat message decoration to using templates

## [0.6.0] - 2021-11-27

### Added

- rule elements can now modify an actor or an item each
  ([#22](https://github.com/Wasteland-Ventures-Group/WV-VTT-module/issues/22))
- a check for duplicate compendium IDs
  ([#61](https://github.com/Wasteland-Ventures-Group/WV-VTT-module/issues/61))
- Quench integration for integration testing
- ability to execute attacks on unowned weapons
  ([#57](https://github.com/Wasteland-Ventures-Group/WV-VTT-module/issues/57))
- helper method to get an actor for various actions
  ([#66](https://github.com/Wasteland-Ventures-Group/WV-VTT-module/issues/66))
- attacks on unowned weapons will now first use the selected token, then the
  impersonated actor of the user to prepopulate their data
- ability to create macros from unowned weapons
- ability to create weapon macros from source provided in a script macro
  ([#60](https://github.com/Wasteland-Ventures-Group/WV-VTT-module/issues/60))
- a remaining AP on movement display to the ruler labels, when measuring from a
  controllable token
  ([#65](https://github.com/Wasteland-Ventures-Group/WV-VTT-module/issues/65))

### Changed

- rule elements are no longer autocorrecting and save the source as-is, provided
  it is parsable JSON ([#21])
- rule elements are now validated against a schema instead of our own,
  hand-written validation logic, which makes them easier to extend ([#21])
- combats now track the Action Points resource by default and skip defeated
  combatants
  ([#64](https://github.com/Wasteland-Ventures-Group/WV-VTT-module/issues/64))
- the default resource for tokens are now set to hit points and action points
  once on first start after world creation
  ([#64](https://github.com/Wasteland-Ventures-Group/WV-VTT-module/issues/64))
- Prompt utitily application can now ask for multiple inputs
  ([#56](https://github.com/Wasteland-Ventures-Group/WV-VTT-module/issues/56))
- shift clicking a weapon attack button no longer does anything special, the
  modifier input is always shown on the combined weapon attack prompt

[#21]: https://github.com/Wasteland-Ventures-Group/WV-VTT-module/issues/21

### Fixed

- migrations no longer run on newly created worlds on first start
- actor hit and action points are now set to their initial default maximum on
  creation
  ([#64](https://github.com/Wasteland-Ventures-Group/WV-VTT-module/issues/64))
- rule elements being indented weirdly
  ([#69](https://github.com/Wasteland-Ventures-Group/WV-VTT-module/issues/69))
- make all Prompt inputs required
- now rerenders item sheets on any SPECIAL change instead of just Strength

## [0.5.1] - 2021-10-23

### Added

- the built-in ruler tool now shows the walk speed AP usage for the distance
  measured (this is incompatible with DragRuler for now)
- an AP check for Token drag/drop movement in combat (this is incompatible with
  DragRuler for now) ([#5])
- AP subtraction for Token drag/drop movement in combat ([#5])
- an AP check and subtraction for Token Ruler movement in combat (this is
  incompatible with DragRuler for now) ([#5])
- translations for system settings
- settings for AP enforcement via drag and drop and via ruler tool

[#5]: https://github.com/Wasteland-Ventures-Group/WV-VTT-module/issues/5

### Fixed

- Action Points are no longer refreshed on defeated combatants
  ([#10](https://github.com/Wasteland-Ventures-Group/WV-VTT-module/issues/10))

## [0.5.0] - 2021-10-03

### Added

- crit chance properties on actors and a display for them on the sheet
- Dice So Nice! support for weapon attacks
- dice roll modifiers for flagging criticals
  - "1d100fcs&lt;=5" to flag a result less or equal to five as critical success
  - "1d100fcf&gt;=60" to flag a result greater or equal to sixty as a crticial
    failure
  - any of the foundry modifier comparison operators are allowed
  - without a comparison operator, "fcs" assumes "&lt;=" and "fcf" assumes
    "&gt;="
  - "1d100fcs5fcf95" means 5 or lower is a crit success, 95 or higher is a crit
    fail
  - these modifiers also influence the overall result
    - critical failures are marked as failures
    - critical successes are marked as successes
- crit chance consideration for all system rolls
- expanded and improved the internal system roll formula generator
  - rolls with negative modifiers, that would result in a target value less than
    0, are now capped and don't break anymore
- item images to the lists in the actor sheet
- headings for the the lists in the inventory
- weapons
  - Machete
  - Staff

### Changed

- system chat messages are now internationalized when rendered, instead of when
  created
- weapon attack messages are now customized with system specific data
  ([#20](https://github.com/Wasteland-Ventures-Group/WV-VTT-module/issues/20))
- weapon attack AP checks and deduction are only done in combat
  ([#37](https://github.com/Wasteland-Ventures-Group/WV-VTT-module/issues/37))
- some weapon properties became optional
  - attacks properties
    - dice range (will default to false)
    - damage fall off (will default to none)
    - rounds (will default to 0)
    - dt reduction (will default to 0)
    - splash (will default to none)
  - weapon ranges (instead of having to set "unused")
    - medium and long range
  - holdout (will default to false)
  - reload (will assume weapon does not support reloading)
- lang schema is now created from types, reducing the maintainance time needed
  for it
- updated the rendering of weapon attack messages, providing a more polished
  experience and only showing condensed info, that can be expanded on demand
  ([#58](https://github.com/Wasteland-Ventures-Group/WV-VTT-module/issues/58))

### Fixed

- a typo in the English 'not enough AP' message for weapon attacks
- SPECIAL not being taken into account when displaying ranges on owned weapons
- restricted width of weapon item range displays
- correct name of rules tab on weapon item sheet

## [0.4.0] - 2021-09-19

### Added

- a schema for the language files
- add a rule engine for items and basic modifier items
  ([#6](https://github.com/Wasteland-Ventures-Group/WV-VTT-module/issues/6))
- German internationalization support
- added support for prototype items
  ([#26](https://github.com/Wasteland-Ventures-Group/WV-VTT-module/issues/26))
  - these are items, whose base stats can not be modified directly
  - they are updated from compendiums, should the stats of them change in the
    rules
- first weapon item implementation
  - support for hit and damage rolls per attack
  - attacks can be dragged to the hotbar to create macros
  - weapons are prototype items
- a system weapon compendium (WIP)
- some support for Manifest+
  ([#16](https://github.com/Wasteland-Ventures-Group/WV-VTT-module/issues/16))

### Changed

- update the compatible core version to Foundry VTT 0.8.9

## [0.3.3] - 2021-08-08

### Added

- configurable minimum bounds for SPECIALs and Skills
- default width and height for actor sheets to avoid a scrollbar on first open

### Fixed

- not being able to save the character sheet due to the new validation

## [0.3.2] - 2021-08-07

### Added

- back-end bounds validation for the roll modifier dialog
- back-end bounds validation for the character sheet ([#9])
- front-end bounds validation for the character sheet ([#9])

[#9]: https://github.com/Wasteland-Ventures-Group/WV-VTT-module/issues/9

## [0.3.1] - 2021-07-17

### Added

- flavor text for character sheet rolls
  ([#1](https://github.com/Wasteland-Ventures-Group/WV-VTT-module/issues/1))
- translatable migration notifications
- clickable labels to focus the corresponding target inputs
- roll with modifier by Shift-Clicking the roll buttons
  ([#2](https://github.com/Wasteland-Ventures-Group/WV-VTT-module/issues/2))
- roll as GM whisper by Ctrl-Clicking the roll buttons

### Fixed

- pressing enter in the character sheet no longer triggers a Strength roll
  ([#8](https://github.com/Wasteland-Ventures-Group/WV-VTT-module/issues/8))

## [0.3.0] - 2021-07-10

### Added

- support for Foundry VTT 0.8.X
- automatic AP reset on combat start and next round
  ([#4](https://github.com/Wasteland-Ventures-Group/WV-VTT-module/issues/4))
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

[unreleased]: https://github.com/Wasteland-Ventures-Group/WV-VTT-module/compare/v0.7.1...HEAD
[0.7.1]: https://github.com/Wasteland-Ventures-Group/WV-VTT-module/compare/v0.7.0...v0.7.1
[0.7.0]: https://github.com/Wasteland-Ventures-Group/WV-VTT-module/compare/v0.6.0...v0.7.0
[0.6.0]: https://github.com/Wasteland-Ventures-Group/WV-VTT-module/compare/v0.5.1...v0.6.0
[0.5.1]: https://github.com/Wasteland-Ventures-Group/WV-VTT-module/compare/v0.5.0...v0.5.1
[0.5.0]: https://github.com/Wasteland-Ventures-Group/WV-VTT-module/compare/v0.4.0...v0.5.0
[0.4.0]: https://github.com/Wasteland-Ventures-Group/WV-VTT-module/compare/v0.3.3...v0.4.0
[0.3.3]: https://github.com/Wasteland-Ventures-Group/WV-VTT-module/compare/v0.3.2...v0.3.3
[0.3.2]: https://github.com/Wasteland-Ventures-Group/WV-VTT-module/compare/v0.3.1...v0.3.2
[0.3.1]: https://github.com/Wasteland-Ventures-Group/WV-VTT-module/compare/v0.3.0...v0.3.1
[0.3.0]: https://github.com/Wasteland-Ventures-Group/WV-VTT-module/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/Wasteland-Ventures-Group/WV-VTT-module/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/Wasteland-Ventures-Group/WV-VTT-module/compare/v0.0.2...v0.1.0
[0.0.2]: https://github.com/Wasteland-Ventures-Group/WV-VTT-module/compare/v0.0.1...v0.0.2
[0.0.1]: https://github.com/Wasteland-Ventures-Group/WV-VTT-module/releases/tag/v0.0.1
