import { z } from "zod";
import {
  ApparelTypes,
  Calibers,
  EquipmentSlots,
  GeneralMagicSchools,
  MagicTypes,
  Rarities,
  SkillNames,
  SpecialNames
} from "./constants.js";
import { fullRecord, fullRecordWithVal } from "./data/common.js";
import type { Join, PathsToStringProps } from "./helperTypes.js";
import type { DocumentRelation } from "./item/wvItem.js";

/** Names in singular and plural */
const QUANTITY_NAMES = z.object({
  /** The singular name */
  singular: z.string(),
  /** The plural name */
  plural: z.string()
});

/** A schema for system settings */
const SETTING = z.object({
  /** The name of the setting */
  name: z.string(),
  /** The hint for the setting */
  hint: z.string()
});

/** Names in long and short form */
const SHORT_LONG_NAMES = z.object({
  /** The long name */
  long: z.string(),
  /** The short name */
  short: z.string()
});

/** A schema for SPECIALs */
const SPECIAL = SHORT_LONG_NAMES.extend({
  /**
   * @maxLength 3
   * @minLength 3
   */
  short: z.string().min(3).max(3)
});
const I18N_RARITIES = fullRecord(Rarities);
const I18N_CALIBERS = fullRecord(Calibers);
const I18N_APPAREL_TYPES = fullRecord(ApparelTypes);
const I18N_EQUIPMENT_SLOTS = fullRecord(EquipmentSlots);
const I18N_MAGIC_TYPES = fullRecord(MagicTypes);
const I18N_MAGIC_SCHOOLS = fullRecord(GeneralMagicSchools);
const I18N_SKILLS = fullRecord(SkillNames);
const I18N_SPECIALS = fullRecordWithVal(SpecialNames, SPECIAL);
/** The relation of the owning item to the document that caused a message */
export const DocumentRelations = [
  "thisItem",
  "parentActor",
  "parentOwnedItem"
] as const;

// Ensures that DocumentRelations doesn't get out of sync with its type
// This is a bit ugly, but importing a non-type from WvItem breaks the build
// tools.
type _<T extends typeof DocumentRelations[number] = DocumentRelation> = never;

// export type DocumentRelation = typeof DocumentRelations[number];
const DOCUMENT_RELATIONS = fullRecord<DocumentRelation>(DocumentRelations);

/** A union of possible i18n keys. */
export type WvI18nKey = Join<PathsToStringProps<LangSchema>, ".">;

const NAME_STRING = z.string().regex(/\{name\}/);
const WHAT_STRING = z.string().regex(/\{what\}/);
const PATH_STRING = z.string().regex(/\{path\}/);
const TYPE_STRING = z.string().regex(/\{type\}/);
const SYSNAME_VERSION_STRING = z
  .string()
  .regex(/(?=.*\{systemName\})(?=.*{version\})/);

export type LangSchema = z.infer<typeof LANG_SCHEMA>;
export const LANG_SCHEMA = z.object({
  /** The root element for the Wasteland Ventures system localization */
  wv: z.object({
    /** Labels coming straight out of the rule book */
    rules: z.object({
      /** Labels for Action Points */
      actionPoints: SHORT_LONG_NAMES.extend({
        /** A label for action point use */
        use: z.string()
      }),
      /** Labels for different actions */
      actions: z.object({
        /** Labels relating to attack actions */
        attack: z.object({
          /** A label for the aimed attacks */
          aim: z.string(),
          /** A label for called shots */
          calledShot: z.string(),
          /** A label for sneak attacks */
          sneakAttack: z.string()
        })
      }),
      /** Labels for the background */
      background: z.object({
        /** Label for the age */
        age: z.string(),
        /** Label for the appearance */
        appearance: z.string(),
        /** Label for the background */
        background: z.string(),
        /** Label for the cutie mark */
        cutieMark: z.string(),
        /** Label for the dreams */
        dreams: z.string(),
        /** Label for the fears */
        fears: z.string(),
        /** Label for the gender */
        gender: z.string(),
        /** Label for the personality */
        personality: z.string(),
        /** Label for the size */
        sizeCategory: z.string(),
        /** Label for the social contacts */
        socialContacts: z.string(),
        /** Label for the special talent */
        specialTalent: z.string(),
        /** Label for the virtue */
        virtue: z.string()
      }),
      /** Labels relating to crippled limbs */
      crippledLimbs: z.object({
        /** Status labels for different limbs */
        status: z.object({
          torso: z.string(),
          head: z.string(),
          secondHead: z.string(),
          frontLeftLeg: z.string(),
          frontRightLeg: z.string(),
          rearLeftLeg: z.string(),
          rearRightLeg: z.string(),
          leftWing: z.string(),
          rightWing: z.string()
        })
      }),
      /** Labels relating to criticals */
      criticals: z.object({
        /** The grouping title for criticals */
        title: z.string(),
        /** The label for the success */
        failure: z.string(),
        /** The label for the failure */
        success: z.string(),
        /** The label for the critical failure chance */
        failureChance: z.string(),
        /** The label for the critical success chance */
        successChance: z.string()
      }),
      /** Labels related to damage */
      damage: SHORT_LONG_NAMES.extend({
        /** Label for the base damage without dice */
        baseDamage: z.string(),
        /** Label for the damage dice */
        damageDice: z.string(),
        /** Label for the Strength based dice range */
        diceRange: z.string(),
        /** Labels related to damage fall-off */
        fallOff: z.object({
          /** The name of the damage fall-off concept */
          name: z.string(),
          /** The names for the fall-off types */
          types: z.object({
            shotgun: z.string()
          })
        }),
        /** Labels related to damage threshold */
        threshold: SHORT_LONG_NAMES.extend({
          /** Names for damage threshold reduction */
          reduction: SHORT_LONG_NAMES
        })
      }),
      /** Labels related to equipment */
      equipment: z.object({
        ammo: z.object({
          /** The label for the caliber */
          caliber: z.string(),
          /** Names for different calibers */
          calibers: I18N_CALIBERS,
          /** The name of ammunition */
          name: z.string(),
          subTypes: z.object({
            standard: z.string(),
            armorPiercing: z.string(),
            hollowPoint: z.string(),
            incendiary: z.string(),
            explosive: z.string(),
            buckshot: z.string(),
            magnum: z.string(),
            slug: z.string(),
            pulseSlug: z.string(),
            flechette: z.string(),
            dragonsBreath: z.string(),
            overcharge: z.string(),
            maxCharge: z.string(),
            optimized: z.string(),
            drakeOil: z.string(),
            causticSludge: z.string(),
            cryoFluid: z.string(),
            arcane: z.string(),
            lightweight: z.string(),
            piercing: z.string(),
            broadhead: z.string(),
            highExplosive: z.string(),
            plasma: z.string(),
            pulse: z.string(),
            timed: z.string(),
            highVelocity: z.string()
          }),
          /** The label for the ammo type */
          type: z.string()
        }),
        /** Labels relating to the concept of apparel. */
        apparel: z.object({
          /** The name of apparel. */
          name: z.string(),
          /** The name for the concept of apparel type */
          type: z.string(),
          /** Names for the different apparel types */
          types: I18N_APPAREL_TYPES
        }),
        /** Labels relating to the concept of bottle caps */
        caps: QUANTITY_NAMES,
        /** The name for the inventory */
        inventory: z.string(),
        /** The name for equipment */
        name: z.string(),
        /** Labels relating to rarity */
        rarity: z.object({
          /** The name for the concept of rarity */
          name: z.string(),
          /** Names for the rarity levels */
          names: I18N_RARITIES
        }),
        /** Labels for different equipment slots */
        slots: QUANTITY_NAMES.extend({
          /** The name for the apparel slot concept */
          apparelSlot: z.string(),
          /** The names for blocked apparel slots */
          blockedSlots: QUANTITY_NAMES,
          /** The names for mod slots */
          modSlot: QUANTITY_NAMES,
          /** The names for quick slots */
          quickSlot: QUANTITY_NAMES,
          /** The names for weapon slots */
          weaponSlot: QUANTITY_NAMES,
          /** Names for different equipment slots */
          names: I18N_EQUIPMENT_SLOTS
        }),
        /** Labels for the concept of value */
        value: z.object({
          /** The name of the value concept */
          name: z.string()
        }),
        /** Labels related to weapons */
        weapon: QUANTITY_NAMES.extend({
          /** Names for attacks */
          attack: QUANTITY_NAMES,
          /** The label for the holdout property */
          holdout: z.string(),
          /** Labels related to reloading */
          reload: z.object({
            /** The label for the container size */
            containerSize: z.string(),
            /** The label for the container type */
            containerType: z.string(),
            /** Labels for the different container types */
            containerTypes: z.object({
              internal: z.string(),
              magazine: z.string()
            }),
            /** The noun for reload */
            name: z.string()
          }),
          /** The name for the number of shots per attack */
          shots: z.string(),
          /** The name for the strength requirement */
          strengthRequirement: SHORT_LONG_NAMES
        }),
        /** Labels relating to the concept of weight */
        weight: z.object({
          /** The name of the concept of weight */
          name: z.string()
        })
      }),
      /** Labels relating to health */
      health: z.object({
        /** The label for the health */
        health: z.string(),
        /** The label for the short version of "health points" */
        hp: z.string(),
        /** The label for the healing rate */
        healingRate: z.string()
      }),
      /** Label for the initiative */
      initiative: z.string(),
      /** Label for the insanity field */
      insanity: z.string(),
      /** Label for the karma field */
      karma: z.string(),
      /** Labels related to leveling */
      leveling: z.object({
        /** The label for the level */
        level: z.string(),
        /** The label for the experience */
        experience: z.string()
      }),
      /** Labels related to magic */
      magic: z.object({
        /** The label for potency */
        potency: z.string(),
        /** The name of "Magic" */
        magic: z.string(),
        /** The label for the strain */
        strain: z.string(),
        /** The label for the strain use */
        strainUse: z.string(),
        /** The label of the types of magic */
        type: QUANTITY_NAMES.extend({
          names: I18N_MAGIC_TYPES
        }),
        school: QUANTITY_NAMES.extend({
          /** The label of the schools of magic */
          names: I18N_MAGIC_SCHOOLS
        })
      }),
      painThreshold: QUANTITY_NAMES.extend({
        /** The label for when a pain threshold has been reached */
        reached: z.string()
      }),
      /** Labels related to radiation */
      radiation: z.object({
        /** The name of the radiation concept */
        name: z.string(),
        /** The label for the absorbed dose */
        dose: z.string(),
        /** The label for the radiation sickness level */
        sicknessLevel: z.string(),
        /** Names for levels of radiation sickness */
        sicknessLevels: z.object({
          none: z.string(),
          minor: z.string(),
          moderate: z.string(),
          major: z.string(),
          critical: z.string()
        })
      }),
      /** Labels related to range */
      range: QUANTITY_NAMES.extend({
        /** Labels relating to the distance */
        distance: z.object({
          /** The name for the concept of distance */
          name: z.string()
        }),
        /** Names for different ranges */
        ranges: z.object({
          /** The name for out of range */
          outOfRange: SHORT_LONG_NAMES,
          /** The name for long range */
          long: SHORT_LONG_NAMES,
          /** The name for medium range */
          medium: SHORT_LONG_NAMES,
          /** The name for short range */
          short: SHORT_LONG_NAMES
        })
      }),
      resistances: z.object({
        /** Labels for the poison resistance */
        poison: SHORT_LONG_NAMES,
        /** Labels for the radiation resistance */
        radiation: SHORT_LONG_NAMES
      }),
      /** Rules labels related to rolls */
      rolls: z.object({
        /** Labels for roll results */
        results: z.object({
          /** The label for a critical failure */
          criticalFailure: z.string(),
          /** The label for a critical hit */
          criticalHit: z.string(),
          /** The label for a critical miss */
          criticalMiss: z.string(),
          /** The label for a critical success */
          criticalSuccess: z.string(),
          /** The label for a failure */
          failure: z.string(),
          /** The label for degrees of failure */
          failureDegrees: z.string(),
          /** The label for a hit */
          hit: z.string(),
          /** The label for a miss */
          miss: z.string(),
          /** The label for a success */
          success: z.string(),
          /** The label for degrees of success */
          successDegrees: z.string()
        }),
        /** Labels for various targets to roll for */
        targets: z.object({
          /** Label for a hit chance reason */
          hitChance: z.string(),
          /** Label for a success chance reason */
          successChance: z.string()
        })
      }),
      /** Labels related to skills */
      skills: QUANTITY_NAMES.extend({
        /** Labels for skill points */
        points: SHORT_LONG_NAMES,
        /** The names of the skills */
        names: I18N_SKILLS,
        /** The label for an unknown Skill */
        unknown: z.string()
      }),
      /** Labels related to SPECIAL */
      special: QUANTITY_NAMES.extend({
        /** The names of SPECIALs */
        names: I18N_SPECIALS,
        /** The label for the permanent total of a SPECIAL */
        permTotal: z.string(),
        /** Labels for SPECIAL points */
        points: SHORT_LONG_NAMES,
        /** The label for the temporary total of a SPECIAL */
        tempTotal: z.string(),
        /** The label for an unknown SPECIAL */
        unknown: z.string()
      })
    }),
    /** Labels used by the system module itself */
    system: z.object({
      /** Labels for actions */
      actions: z.object({
        cancel: z.string(),
        create: z.string(),
        delete: z.string(),
        edit: z.string(),
        execute: z.string(),
        submit: z.string(),
        unequip: z.string(),
        update: z.string()
      }),
      /** Labels relating to different dialogs */
      dialogs: z.object({
        /** Labels for the compendium overwrite confirmation dialog */
        compendiumOverwriteConfirm: z.object({
          /**
           * The title for the dialog
           *
           * Parameters:
           * - name: the name of the item
           * @pattern (?=.*\{name\})
           */
          title: NAME_STRING,
          /** The content of the dialog */
          content: z.string()
        })
      }),
      /** Labels related to Effect Items */
      effect: QUANTITY_NAMES,
      /** Labels related to generic Misc Items */
      item: QUANTITY_NAMES,
      /** Labels used in the initial character setup app */
      initialCharacterSetup: z.object({
        /** The label for the open button on the character sheet */
        openButton: z.string(),
        /**
         * The title for the window
         *
         * Parameters:
         * - name: the name of the character
         * @pattern (?=.*\{name\})
         */
        title: NAME_STRING,
        /** Labels relating to the initial character setup */
        messages: z.object({
          /** A message for when the user spent too few SPECIAL points */
          tooFewSpecialPointsSpent: z.string(),
          /** A message for when the user spent too many SPECIAL points */
          tooManySpecialPointsSpent: z.string()
        })
      }),
      /** Different system messages. */
      messages: z.object({
        /**
         * The message when a specified attack could not be found on a weapon.
         *
         * Parameters:
         * - name: the name of the attack
         * @pattern (?=.*\{name\})
         */
        attackNotFound: NAME_STRING,
        /**
         * The message when a specified attack already exists on a weapon.
         * Parameters:
         * - name: the name of the attack
         * @pattern (?=.*\{name\})
         */
        attackAlreadyExists: NAME_STRING,
        /**
         * A general message that a slot a newly equipped apparel would block,
         * is already occupied by another apparel.
         */
        blockedApparelSlotIsOccupied: z.string(),
        /**
         * A general message that an apparel slot is already blocked by another
         * apparel item.
         */
        blockedByAnotherApparel: z.string(),
        /** A general message that something can not be done in combat. */
        canNotDoInCombat: z.string(),
        /**
         * The message when an object attempted to be created could not be
         * created
         */
        couldNotCreateDocument: z.string(),
        /**
         * The message when a macro tried to create an Actor or Item with
         * invalid system data
         */
        invalidSystemDataInMacro: z.string(),
        /**
         * The message when an item just changed compendium link to linked.
         *
         * Parameters:
         * - name: the name of the item
         * @pattern (?=.*\{name\})
         */
        itemIsNowLinked: NAME_STRING,
        /**
         * The message when an item just changed compendium link to unlinked.
         *
         * Parameters:
         * - name: the name of the item
         * @pattern (?=.*\{name\})
         */
        itemIsNowUnlinked: NAME_STRING,
        /**
         * The notification text for completed migrations.
         *
         * Parameters:
         * - systemName: the name of the system
         * - version: the system version that was migrated to
         * @pattern (?=.*\{systemName\})(?=.*\{version\})
         */
        migrationCompleted: SYSNAME_VERSION_STRING,
        /**
         * The notification text for started migration.
         *
         * Parameters:
         * - systemName: the name of the system
         * - version: the system version will be migrated to
         * @pattern (?=.*\{systemName\})(?=.*\{version\})
         */
        migrationStarted: SYSNAME_VERSION_STRING,
        /**
         * The message when a Document does not have an Actor.
         *
         * Parameters:
         * - name: the name of the document
         * @pattern (?=.*\{name\})
         */
        noActor: NAME_STRING,
        /**
         * The message when an actor does not have enough AP to do something.
         */
        notEnoughAp: z.string(),
        /**
         * The message when an actor does not have enough AP to move a specific
         * distance.
         *
         * Parameters:
         * - needed: the needed amount of AP
         * - actual: the actually available AP
         * - name: the name of the Actor trying to move
         * @pattern (?=.*\{needed\})(?=.*\{actual\})(?=.*\{name\})
         */
        notEnoughApToMove: z
          .string()
          .regex(/(?=.*\{needed\})(?=.*\{actual\})(?=.*\{name\})/),
        /**
         * The message when an actor does not have enough quick slots to ready
         * something.
         */
        notEnoughQuickSlots: z.string(),
        /** The message when a target is out of range */
        targetOutOfRange: z.string()
      }),
      /** Miscellaneous labels not fitting anywhere else */
      misc: z.object({
        /** Label for a description */
        description: z.string(),
        /** Label for details */
        details: z.string(),
        /** The label for a modifier, when the target is not known */
        modifier: z.string(),
        /**
         * The label for a modifier.
         *
         * Parameters:
         * - what: a reference to what the modifier is for
         * @pattern (?=.*\{what\})
         */
        modifierFor: WHAT_STRING,
        /** The name placeholder label for documents */
        name: z.string(),
        /**
         * The placeholder name for a new Document.
         *
         * Parameters:
         * - what: the document type name
         * @pattern (?=.*\{what\})
         */
        newName: WHAT_STRING,
        /** The label for user provided notes */
        notes: z.string(),
        /** The label for roll modes */
        rollMode: QUANTITY_NAMES,
        /** The label for source values */
        sourceValues: z.string(),
        /** The label for a speaker alias */
        speakerAlias: z.string(),
        /** A collective name for miscellaneous statistics */
        statistics: z.string(),
        /** A collective name for tags */
        tags: z.string(),
        /** A label for toggling a compendium link */
        toggleCompendiumLink: z.string(),
        /** A label for updating an item from a compendium */
        updateFromCompendium: z.string()
      }),
      /** Labels related to the prompt dialog */
      prompt: z.object({
        /** Default labels for the prompt */
        defaults: z.object({
          /** The default window title */
          title: z.string()
        })
      }),
      /** Labels relating to race items */
      races: QUANTITY_NAMES.extend({
        /** Label for the fallback race */
        noRace: z.string(),
        /** Labels for physical attributes */
        physical: z.object({
          /** Label for the "canFly" attribute */
          canFly: z.string(),
          /** Label for the "canUseMagic" attribute */
          canUseMagic: z.string(),
          /** Label for the "hasSecondHead" attribute */
          hasSecondHead: z.string(),
          /** Label for the "hasSpecialTalent" attribute */
          hasSpecialTalent: z.string(),
          /** Label for the "hasWings" attribute */
          hasWings: z.string()
        }),
        /** Labels for character creation attributes */
        creation: z.object({
          /** Label for the "startingSpecialPoints" attribute */
          startingSpecialPoints: z.string()
        })
      }),
      /** System labels related to rolls */
      rolls: z.object({
        /**
         * A descriptive verb for what is being rolled
         *
         * Parameters:
         * - what: the label for what is being rolled
         * @pattern (?=.*\{what\})
         */
        descriptive: WHAT_STRING,
        /** A capitalized, imperative verb for rolling dice */
        imperative: z.string(),
        /** A description for whispering to GMs */
        whisperToGms: z.string()
      }),
      /** Labels related to the Rule Engine */
      ruleEngine: z.object({
        /** Labels for document related rule element messages */
        documentMessages: z.object({
          /** The descriptive name for document related rule element messages */
          name: z.string(),
          /** Labels for different document relations */
          relations: DOCUMENT_RELATIONS
        }),
        /** Labels for different errors */
        errors: z.object({
          /** Various logical errors */
          logical: z.object({
            /**
             * An error message when the selected property on the target is not
             * a CompositeNumber.
             *
             * Parameters:
             * - path: the selector path
             * @pattern (?=.*\{path\})
             */
            notCompositeNumber: PATH_STRING,
            /**
             * An error message when the target does not match a property on a
             * selected Document.
             *
             * Parameters
             * - path: the target path
             * @pattern (?=.*\{path\})
             */
            notMatchingTarget: PATH_STRING,
            /**
             * An error message when a selected document is not of the expected
             * type.
             *
             * Parameters
             * - type: the expected type
             * @pattern (?=.*\{type\})
             */
            wrongDocumentType: TYPE_STRING,
            /**
             * An error message when the target property on the selected
             * Document is of the wrong type.
             *
             * Parameters:
             * - path: the target path
             * - type: the expected type of the rule element type
             * @pattern (?=.*\{path\})(?=.*\{type\})
             */
            wrongTargetType: z.string().regex(/(?=.*\{path\})(?=.*\{type\})/),
            /**
             * An error message when the value of a rule is of the wrong type.
             *
             * Parameters:
             * - type: the expected type for the rule element type
             * @pattern (?=.*\{type\})
             */
            wrongValueType: TYPE_STRING
          }),
          /** Various semantic errors */
          semantic: z.object({
            /**
             * An error message for fields that are not allowed.
             *
             * Parameters:
             * - path: the path of the additional property's parent
             * - property: the name of the additional property
             * @pattern (?=.*\{path\})(?=.*\{property\})
             */
            additional: z.string().regex(/(?=.*\{path\})(?=.*\{property\})/),
            /**
             * An error message for fields that are missing.
             *
             * Parameters:
             * - path: the path of the missing property's parent
             * - property: the name of the missing property
             * @pattern (?=.*\{path\})(?=.*\{property\})
             */
            missing: z.string().regex(/(?=.*\{path\})(?=.*\{property\})/),
            /** An error message for an unknown error. */
            unknown: z.string(),
            /** An error message for an unknown RuleElement condition. */
            unknownCondition: z.string(),
            /** An error message for an unknown RuleElement hook. */
            unknownHook: z.string(),
            /** An error message for an unknown RuleElement type. */
            unknownRuleElement: z.string(),
            /** An error message for an unknown SPECIAL name. */
            unknownSpecialName: z.string(),
            /** An error message for an unknown RuleElement selector. */
            unknownSelector: z.string(),
            /**
             * An error message for fields that are of the wrong type.
             *
             * Parameters:
             * - path: the path of the field with the wrong type
             * - type: the expected type of the field
             * @pattern (?=.*\{path\})(?=.*\{type\})
             */
            wrongType: z.string().regex(/(?=.*\{path\})(?=.*\{type\})/)
          }),
          /**
           * The description for the JSON syntax error.
           *
           * Parameters:
           * - message: the JSON parser error message
           * @pattern (?=.*\{message\})
           */
          syntax: z.string().regex(/(?=.*\{message\})/)
        }),
        /** Labels for rule elements */
        ruleElement: QUANTITY_NAMES,
        /** Labels related to selectors */
        selectors: z.object({
          /** A summary label for selected documents */
          selectedDocuments: z.string()
        }),
        /** Labels for different warnings */
        warnings: z.object({
          /**
           * A warning, stating that the type of a property was changed.
           *
           * Parameters:
           * - path: the path of the property on the target
           * - original: the original type of the property
           * - new: the new type of the property
           * @pattern (?=.*\{path\})(?=.*\{original\})(?=.*\{new\})
           */
          changedType: z
            .string()
            .regex(/(?=.*\{path\})(?=.*\{original\})(?=.*\{new\})/),
          /**
           * A warning for when a rule element was not saved because of errors,
           * explaining that changes will be lost if foundry is reloaded.
           */
          notSaved: z.string()
        })
      }),
      /** Labels related to settings. */
      settings: z.object({
        /** Labels relating to an always/never setting */
        alwaysNeverSetting: z.object({
          /** The choices for the setting */
          choices: z.object({
            always: z.string(),
            never: z.string()
          })
        }),
        /** Movement related setting labels */
        movement: z.object({
          /** The enforcement and subtract setting for players */
          enforceAndSubtractApForPlayers: SETTING,
          /** The enforcement setting for game masters */
          enforceApForGameMasters: SETTING,
          /** The subtract setting for game masters */
          subtractApForGameMasters: SETTING
        }),
        /** The Skill Points minimum bounds setting */
        skillPointsMinBounds: SETTING,
        /** The SPECIAL Points minimum bounds setting */
        specialPointsMinBounds: SETTING
      }),
      /** Labels relating to sheets */
      sheets: z.object({
        /** Names for different sheets */
        names: z.object({
          /** The label for the Actor sheet */
          actorSheet: z.string(),
          /** The label for the Ammo sheet */
          ammoSheet: z.string(),
          /** The label for the Apparel sheet */
          apparelSheet: z.string(),
          /** The label for the Effect sheet */
          effectSheet: z.string(),
          /** The label for the generic Item Sheet */
          itemSheet: z.string(),
          /** The label for the Magic sheet */
          magicSheet: z.string(),
          /** The label for the Race sheet */
          raceSheet: z.string(),
          /** The label for the Weapon sheet */
          weaponSheet: z.string()
        })
      }),
      spell: QUANTITY_NAMES,
      /** The label for the Thaumaturgy special select */
      thaumSpecial: z.string(),
      /** Labels for describing different values */
      values: z.object({
        /** Label for an amount of something */
        amount: z.string(),
        /** Label for a base value */
        base: z.string(),
        /** Label for a cost */
        cost: z.string(),
        /** Label for a previous value */
        previous: z.string(),
        /** Label for a remaining value */
        remaining: z.string(),
        /** Label for a total value */
        total: z.string()
      })
    })
  })
});
