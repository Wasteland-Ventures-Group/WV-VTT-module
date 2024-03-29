# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.22.0] - 2022-11-12

- improve chat cards and add additional attack options
  ([##439](https://github.com/Wasteland-Ventures-Group/WV-VTT-module/issues/#439))

## [0.21.0] - 2022-09-10

### Added

- all system apparel items in separate compendiums
  ([#329](https://github.com/Wasteland-Ventures-Group/WV-VTT-module/issues/329))
- an explanation to game master movement settings, that they only affect the
  current user and only if they are a game master
  ([#452](https://github.com/Wasteland-Ventures-Group/WV-VTT-module/issues/452))
- ability to edit equipped items from equipment slots in inventory
  ([#483](https://github.com/Wasteland-Ventures-Group/WV-VTT-module/issues/483))
- ability to unequip apparel from equipment slots
  ([#483](https://github.com/Wasteland-Ventures-Group/WV-VTT-module/issues/483))
- ability to unready weapons and items in and out of combat
  ([#483](https://github.com/Wasteland-Ventures-Group/WV-VTT-module/issues/483))
- ability to unslot weapons from weapon slots out of combat
  ([#483](https://github.com/Wasteland-Ventures-Group/WV-VTT-module/issues/483))
- ability edit current quick slot charges on equipment tab
  ([#483](https://github.com/Wasteland-Ventures-Group/WV-VTT-module/issues/483))
- quick slot display in the inventory
  ([#483](https://github.com/Wasteland-Ventures-Group/WV-VTT-module/issues/483))
- automated subtraction of quick slot charges when readying with quick slot
  ([#483](https://github.com/Wasteland-Ventures-Group/WV-VTT-module/issues/483))
- automated quick slots restore when actor leaves last combat they were in
  ([#483](https://github.com/Wasteland-Ventures-Group/WV-VTT-module/issues/483))
- automated action points restore when actor leaves last combat they were in
- bounds for all modifiable CompositeNumbers
  ([#487](https://github.com/Wasteland-Ventures-Group/WV-VTT-module/issues/487))
- a display for readied non-weapons on the equipment tab
- images for all equipment slots

### Changed

- direct SPECIAL editing on the character sheet has been replaced with a
  separate initial character setup window
  ([#385](https://github.com/Wasteland-Ventures-Group/WV-VTT-module/issues/385))
- character's race is no longer a predetermined list of names, but an actual
  item, this also allows homebrew races
  ([#384](https://github.com/Wasteland-Ventures-Group/WV-VTT-module/issues/384))
- hard-coded pain threshold table to dynamic display of current pain threshold
  ([#455](https://github.com/Wasteland-Ventures-Group/WV-VTT-module/issues/455))
- trying to equip an apparel with blocked slots will now fail if one of the
  blocked slots is already occupied
  ([#483](https://github.com/Wasteland-Ventures-Group/WV-VTT-module/issues/483))
- ready item costs to properties tracked on characters, instead of hard-coded
  values
  ([#483](https://github.com/Wasteland-Ventures-Group/WV-VTT-module/issues/483))
- moved the Thaumaturgy SPECIA select from the magic tab to the character setup
  application
  ([#485](https://github.com/Wasteland-Ventures-Group/WV-VTT-module/issues/485))

### Fixed

- a typo in the GM movement settings
  ([#451](https://github.com/Wasteland-Ventures-Group/WV-VTT-module/issues/451))
- the apparel sheet unchecking blocked apparel slots

## [0.20.0] - 2022-08-28

### Changed

- the AP enforcement and subtraction has changed
  ([#415](https://github.com/Wasteland-Ventures-Group/WV-VTT-module/issues/415))
  - it now checks all methods of changing a token's position
  - the settings are now per player level and check or subtraction, not per
    movement method
- added magic data and its sheet, though character sheets still do not support
  a known spell list
  ([#141](https://github.com/Wasteland-Ventures-Group/WV-VTT-module/issues/141))
- added pain thresholds to character sheets, as well as automatic chat messages
  when they are reached
  ([#417](https://github.com/Wasteland-Ventures-Group/WV-VTT-module/issues/417))

## [0.19.1] - 2022-07-16

### Fixed

- some broken layout in weapon source values
- some broken layout in weapon attack component listings
- items in the inventory not being draggable
- FlatModifier and ReplaceValue not modifying the correct properties

## [0.19.0] - 2022-07-16

### Added

- a total SPECIAL points display to the character sheet
- a total Skill points display to the character sheet
- a finalize data step for items
- the ability for RuleElements to affect multiple documents
- DocumentSelectors:
  - "actor": selects only actors
  - "item": selects only items
  - "parent": selects only the parent of the document the selector is attached
    to
  - "sibling": selects siblings in the parent document of the document the
    selector is attached to
  - "this": selects only the document the selector is attached to
  - `{ "tag": "<some tag>" }`: selects only items that have the specified
    tag
  - `{ "type": "<some type>" }`: selects only documents that have the
    specified type
  - `{ "usesSkill": "<some skill name>" }`: selects only skill-using
    documents that use the specified skill
  - `{ "or": [<selectors>] }`: selects documents where at least one of the
    specified selectors matches (can not be nested)
- special target keywords
  - `@attacks|<path>`: applies to the same property on all attacks of a
    weapon
  - `@attacks[<tags list>]|<path>`: applies to the same property on
    all attacks of a weapon, that have the given tags
  - `@ranges|<path>`: applies to the same property on all ranges of a
    weapon
  - `@ranges[<tags list>]|<path>`: applies to the same property on
    all ranges of a weapon, that have the given tags
- conditions for RuleElements. The first and so far only one is "whenEquipped"
  and only applies RuleElements when they are equipped in an apparel slot,
  weapon slot or the readied item
- tags in the source data of items
- automatic bonus damage dice modifier for skillful weapons
- tag display in item sheet header
- tag input field to edit free-form tags
- RuleElements now show their selected documents in their sheets
- ability for RuleElements to modify multiple properties on a document
- tags in the sources of weapon attacks and ranges
- weapons with attacks that are tagged as "melee" or "thrown" now only pick
  ranges that also have the corresponding tag, when executing the attack
  ([#131](https://github.com/Wasteland-Ventures-Group/WV-VTT-module/issues/131))
- size category based range bonus now automatically applies to weapon ranges
  tagged with "melee"
- show size category on the statistics tab on the character sheet
- make tags editable on attacks and ranges
- show tags on equipment tab
- equipped items can now be edited directly from the equipment tab
- modifiable initiative
  ([#383](https://github.com/Wasteland-Ventures-Group/WV-VTT-module/issues/383))
- make SPECIAL and skill rolls always ask for a modifier and add a checkbox to
  prompts to whisper to GMs
  ([#388](https://github.com/Wasteland-Ventures-Group/WV-VTT-module/issues/388))

### Changed

- limited actor sheets now render in a smaller size
  ([#330](https://github.com/Wasteland-Ventures-Group/WV-VTT-module/issues/330))
- background descriptions now support rich text editing
  ([#331](https://github.com/Wasteland-Ventures-Group/WV-VTT-module/issues/331))
- the modifier listings in weapon attacks to use tables
  ([#130](https://github.com/Wasteland-Ventures-Group/WV-VTT-module/issues/130))
- weapon attacks and their chat messages now use CompositeNumbers as well
- CompositeNumber components now have an array of LabelComponents instead of a
  simple string label
- replaces the item constructor hack with a Proxy
- swapped RuleElements' target and selector properties
- renamed RuleElements' "selector" property to "selectors"

### Fixed

- the race not showing on limited actor sheets
- ammo and apparel compendiums not being validated against their schemas
- NumberComponents no longer both show a "property does not exist" and "property
  is not a CompositeNumber" error
- fixed actor and item sheet not using base CSS classes and refactored headers

## [0.18.0] - 2022-05-29

### Added

- crippled limb status to character sheets
  ([#248](https://github.com/Wasteland-Ventures-Group/WV-VTT-module/issues/248))
- walk movement penalties for crippled legs

### Changed

- race handling in characters
  - source data changed from `background.race` to `background.raceName`
  - runtime data added `background.race`, which is an instance of `Race`

## [0.17.2] - 2022-05-28

### Added

- migrations for rule elements pre 0.17.0

## [0.17.1] - 2022-05-28

### Fixed

- some miscellaneous bugs

## [0.17.0] - 2022-05-28

### Added

- new rule elements
  - WV.RuleElement.NumberComponent: allows modifying a number and tracking the
    modifier
  - WV.RuleElement.PermSpecialComponent: allows modifying a permanent SPECIAL by
    name instead of path and tracks the modifier
  - WV.RuleElement.TempSpecialComponent: allows modifying a temporary SPECIAL by
    name instead of path and tracks the modifier
- apparel sheets now allow editing blocked apparel slots
- insanity to the character sheet
  ([#327](https://github.com/Wasteland-Ventures-Group/WV-VTT-module/issues/327))
- resistances to the character sheet
  ([#327](https://github.com/Wasteland-Ventures-Group/WV-VTT-module/issues/327))
- character sheets now show the XP needed for the next level
  ([#297](https://github.com/Wasteland-Ventures-Group/WV-VTT-module/issues/297))

### Changed

- most actor and item numbers are now easily modifiable and keep track of their
  original source and all contributing modifiers
  ([#301](https://github.com/Wasteland-Ventures-Group/WV-VTT-module/issues/301))
- changes to permanent SPECIAL also change the temporary SPECIAL before its own
  modifiers
- item sheets now show their final stats on the stats tab and allow editing on
  the source values tab
- moved damage threshold and quick slots max to statistics tab
- expanded the criticals block on statistics tab to hold other statistics

### Fixed

- migrations using derived values, they are now only using source values and are
  more robust because of that
  ([#315](https://github.com/Wasteland-Ventures-Group/WV-VTT-module/issues/315))
- limited character sheets not scrolling and showing images in huge sizes
  ([#299](https://github.com/Wasteland-Ventures-Group/WV-VTT-module/issues/299))

## [0.16.1] - 2022-04-24

### Fixed

- weapon sheets not disabling their inputs with active compendium link

## [0.16.0] - 2022-04-24

### Added

- grid units to the range display on the equipment tab

### Changed

- amounts of stackable items with compendium link are no longer overwritten by
  default
  ([#249](https://github.com/Wasteland-Ventures-Group/WV-VTT-module/issues/249))
- added an "onAfterComputation" hook for rule elements that is called after all
  other computations on an actor are done
  ([#247](https://github.com/Wasteland-Ventures-Group/WV-VTT-module/issues/247))
- rule elements created on effect items now target the actor by default
- the way weapon ranges are saved
  ([#140](https://github.com/Wasteland-Ventures-Group/WV-VTT-module/issues/140))
- made weapons editable via their sheets
  ([#140](https://github.com/Wasteland-Ventures-Group/WV-VTT-module/issues/140))

### Fixed

- item migrations throwing intermittent errors
  ([#238](https://github.com/Wasteland-Ventures-Group/WV-VTT-module/issues/238))

## [0.15.0] - 2022-04-03

### Added

- default icons for item schemas
- a dedicated ammo sheet
  ([#140](https://github.com/Wasteland-Ventures-Group/WV-VTT-module/issues/140))
- automatic radiation sickness effects and sickness level display
  ([#209](https://github.com/Wasteland-Ventures-Group/WV-VTT-module/issues/209))
- remaining ammo to ammo compendium

### Changed

- inputs which would be overwritten by a compendium link are disabled
- equipped apparel now applies actor targeted rule elements to the actor

## [0.14.3] - 2022-03-30

### Added

- maximum carry weight display in inventory table footer
  ([#239](https://github.com/Wasteland-Ventures-Group/WV-VTT-module/issues/239))

### Fixed

- weapon attacks not working on an actor sheet's equipment tab
  ([#237](https://github.com/Wasteland-Ventures-Group/WV-VTT-module/issues/237))

## [0.14.2] - 2022-03-26

- fix a bug in item compendium data migration

## [0.14.1] - 2022-03-26

- add migrations for rule element hooks

## [0.14.0] - 2022-03-26

### Added

- Tribal Armor
- apparel slot displays to the equipment tab
  ([#197](https://github.com/Wasteland-Ventures-Group/WV-VTT-module/issues/197))
- dedicated, editable apparel item sheets
  ([#140](https://github.com/Wasteland-Ventures-Group/WV-VTT-module/issues/140))
- a radiation tracker to the actor sheet
  ([#209](https://github.com/Wasteland-Ventures-Group/WV-VTT-module/issues/209))

### Changed

- actors are now only considered in combat, if they are part of a started combat
  in the active scene or part of an unlinked, started combat
  ([#210](https://github.com/Wasteland-Ventures-Group/WV-VTT-module/issues/210))
- the way the ready item cost is displayed on the equipment and inventory tabs
  ([#216](https://github.com/Wasteland-Ventures-Group/WV-VTT-module/issues/216))
- the system now tracks per item, whether their data should stay linked to their
  compendium entry
  ([#198](https://github.com/Wasteland-Ventures-Group/WV-VTT-module/issues/198))
- the system now tracks per document, when the last migration happened
  ([#198](https://github.com/Wasteland-Ventures-Group/WV-VTT-module/issues/198))
- ammo, apparel and misc items can now also have a compendium link

### Fixed

- some caliber types not localizing correctly
  ([#211](https://github.com/Wasteland-Ventures-Group/WV-VTT-module/issues/211))

## [0.13.0] - 2022-03-06

### Added

- ability to drag items from actor sheets
  - allows copying items to the global directory or other actors
  - allows sorting items in the inventory
- mocha and chai testing framework
- a dedicated caps field for actors
  ([#193](https://github.com/Wasteland-Ventures-Group/WV-VTT-module/issues/193))
- basic support for apparel items
  ([#140](https://github.com/Wasteland-Ventures-Group/WV-VTT-module/issues/140))
- rework equpment tab to show weapon slots and readied item
  ([#192](https://github.com/Wasteland-Ventures-Group/WV-VTT-module/issues/192))

### Changed

- actor sheets now only scroll their tabbed content instead of the entire sheet.
  This means that the stats header is always visible.
- further condensed the actor sheet item table
- only effect items' rule elements are directly applied to the actor for now.
  Weapon and apparel rule elements will soon only apply when equipped

### Fixed

- AP being subtracted for token movement, if the token is kept from moving due
  to wall collission
  ([#192](https://github.com/Wasteland-Ventures-Group/WV-VTT-module/issues/192))
- inventory total value and total weight in the inventory no longer have
  floating point imprecision errors
  ([#191](https://github.com/Wasteland-Ventures-Group/WV-VTT-module/issues/191))

## [0.12.0] - 2022-02-20

### Added

- physical items now have a rarity property
- basic support for ammo items
  ([#140](https://github.com/Wasteland-Ventures-Group/WV-VTT-module/issues/140))
- a basic inventory tab to actors
- miscellaneous items
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
  - virtue
    ([#128](https://github.com/Wasteland-Ventures-Group/WV-VTT-module/issues/128))
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

## [0.0.1] - 2021-05-08

### Added

- basic character Actor implementation with editable SPECIALs

[unreleased]: https://github.com/Wasteland-Ventures-Group/WV-VTT-module/compare/v0.22.0...HEAD
[0.22.0]: https://github.com/Wasteland-Ventures-Group/WV-VTT-module/compare/v0.21.0...v0.22.0
[0.21.0]: https://github.com/Wasteland-Ventures-Group/WV-VTT-module/compare/v0.20.0...v0.21.0
[0.20.0]: https://github.com/Wasteland-Ventures-Group/WV-VTT-module/compare/v0.19.1...v0.20.0
[0.19.1]: https://github.com/Wasteland-Ventures-Group/WV-VTT-module/compare/v0.19.0...v0.19.1
[0.19.0]: https://github.com/Wasteland-Ventures-Group/WV-VTT-module/compare/v0.18.0...v0.19.0
[0.18.0]: https://github.com/Wasteland-Ventures-Group/WV-VTT-module/compare/v0.17.2...v0.18.0
[0.17.2]: https://github.com/Wasteland-Ventures-Group/WV-VTT-module/compare/v0.17.1...v0.17.2
[0.17.1]: https://github.com/Wasteland-Ventures-Group/WV-VTT-module/compare/v0.17.0...v0.17.1
[0.17.0]: https://github.com/Wasteland-Ventures-Group/WV-VTT-module/compare/v0.16.1...v0.17.0
[0.16.1]: https://github.com/Wasteland-Ventures-Group/WV-VTT-module/compare/v0.16.0...v0.16.1
[0.16.0]: https://github.com/Wasteland-Ventures-Group/WV-VTT-module/compare/v0.15.0...v0.16.0
[0.15.0]: https://github.com/Wasteland-Ventures-Group/WV-VTT-module/compare/v0.14.3...v0.15.0
[0.14.3]: https://github.com/Wasteland-Ventures-Group/WV-VTT-module/compare/v0.14.2...v0.14.3
[0.14.2]: https://github.com/Wasteland-Ventures-Group/WV-VTT-module/compare/v0.14.1...v0.14.2
[0.14.1]: https://github.com/Wasteland-Ventures-Group/WV-VTT-module/compare/v0.14.0...v0.14.1
[0.14.0]: https://github.com/Wasteland-Ventures-Group/WV-VTT-module/compare/v0.13.0...v0.14.0
[0.13.0]: https://github.com/Wasteland-Ventures-Group/WV-VTT-module/compare/v0.12.0...v0.13.0
[0.12.0]: https://github.com/Wasteland-Ventures-Group/WV-VTT-module/compare/v0.11.3...v0.12.0
[0.11.3]: https://github.com/Wasteland-Ventures-Group/WV-VTT-module/compare/v0.11.2...v0.11.3
[0.11.2]: https://github.com/Wasteland-Ventures-Group/WV-VTT-module/compare/v0.11.1...v0.11.2
[0.11.1]: https://github.com/Wasteland-Ventures-Group/WV-VTT-module/compare/v0.11.0...v0.11.1
[0.11.0]: https://github.com/Wasteland-Ventures-Group/WV-VTT-module/compare/v0.10.0...v0.11.0
[0.10.0]: https://github.com/Wasteland-Ventures-Group/WV-VTT-module/compare/v0.9.1...v0.10.0
[0.9.1]: https://github.com/Wasteland-Ventures-Group/WV-VTT-module/compare/v0.9.0...v0.9.1
[0.9.0]: https://github.com/Wasteland-Ventures-Group/WV-VTT-module/compare/v0.8.0...v0.9.0
[0.8.0]: https://github.com/Wasteland-Ventures-Group/WV-VTT-module/compare/v0.7.1...v0.8.0
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
