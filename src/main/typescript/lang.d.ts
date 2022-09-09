import type { Join, PathsToStringProps } from "./helperTypes.js";
import type { DocumentRelation } from "./item/wvItem.js";
import type {
  I18nApparelTypes,
  I18nCalibers,
  I18nEquipmentSlots,
  I18nMagicTypes,
  I18nMagicSchools,
  I18nRarities,
  I18nSkills,
  I18nSpecials
} from "./wvI18n.js";

/** A union of possible i18n keys. */
export type WvI18nKey = Join<PathsToStringProps<LangSchema>, ".">;

export interface LangSchema {
  /** The root element for the Wasteland Ventures system localization */
  wv: {
    /** Labels coming straight out of the rule book */
    rules: {
      /** Labels for Action Points */
      actionPoints: ShortLongNames & {
        /** A label for action point use */
        use: string;
      };
      /** Labels for the background */
      background: {
        /** Label for the age */
        age: string;
        /** Label for the appearance */
        appearance: string;
        /** Label for the background */
        background: string;
        /** Label for the cutie mark */
        cutieMark: string;
        /** Label for the dreams */
        dreams: string;
        /** Label for the fears */
        fears: string;
        /** Label for the gender */
        gender: string;
        /** Label for the personality */
        personality: string;
        /** Label for the size */
        sizeCategory: string;
        /** Label for the social contacts */
        socialContacts: string;
        /** Label for the special talent */
        specialTalent: string;
        /** Label for the virtue */
        virtue: string;
      };
      /** Labels relating to crippled limbs */
      crippledLimbs: {
        /** Status labels for different limbs */
        status: {
          torso: string;
          head: string;
          secondHead: string;
          frontLeftLeg: string;
          frontRightLeg: string;
          rearLeftLeg: string;
          rearRightLeg: string;
          leftWing: string;
          rightWing: string;
        };
      };
      /** Labels relating to criticals */
      criticals: {
        /** The grouping title for criticals */
        title: string;
        /** The label for the success */
        failure: string;
        /** The label for the failure */
        success: string;
        /** The label for the critical failure chance */
        failureChance: string;
        /** The label for the critical success chance */
        successChance: string;
      };
      /** Labels related to damage */
      damage: ShortLongNames & {
        /** Label for the base damage without dice */
        baseDamage: string;
        /** Label for the damage dice */
        damageDice: string;
        /** Label for the Strength based dice range */
        diceRange: string;
        /** Labels related to damage fall-off */
        fallOff: {
          /** The name of the damage fall-off concept */
          name: string;
          /** The names for the fall-off types */
          types: {
            shotgun: string;
          };
        };
        /** Labels related to damage threshold */
        threshold: ShortLongNames & {
          /** Names for damage threshold reduction */
          reduction: ShortLongNames;
        };
      };
      /** Labels related to equipment */
      equipment: {
        ammo: {
          /** The label for the caliber */
          caliber: string;
          /** Names for different calibers */
          calibers: I18nCalibers;
          /** The name of ammunition */
          name: string;
          subTypes: {
            standard: string;
            armorPiercing: string;
            hollowPoint: string;
            incendiary: string;
            explosive: string;
            buckshot: string;
            magnum: string;
            slug: string;
            pulseSlug: string;
            flechette: string;
            dragonsBreath: string;
            overcharge: string;
            maxCharge: string;
            optimized: string;
            drakeOil: string;
            causticSludge: string;
            cryoFluid: string;
            arcane: string;
            lightweight: string;
            piercing: string;
            broadhead: string;
            highExplosive: string;
            plasma: string;
            pulse: string;
            timed: string;
            highVelocity: string;
          };
          /** The label for the ammo type */
          type: string;
        };
        /** Labels relating to the concept of apparel. */
        apparel: {
          /** The name of apparel. */
          name: string;
          /** The name for the concept of apparel type */
          type: string;
          /** Names for the different apparel types */
          types: I18nApparelTypes;
        };
        /** Labels relating to the concept of bottle caps */
        caps: QuantityNames;
        /** The name for the inventory */
        inventory: string;
        /** The name for equipment */
        name: string;
        /** Labels relating to rarity */
        rarity: {
          /** The name for the concept of rarity */
          name: string;
          /** Names for the rarity levels */
          names: I18nRarities;
        };
        /** Labels for different equipment slots */
        slots: QuantityNames & {
          /** The name for the apparel slot concept */
          apparelSlot: string;
          /** The names for blocked apparel slots */
          blockedSlots: QuantityNames;
          /** The names for mod slots */
          modSlot: QuantityNames;
          /** The names for quick slots */
          quickSlot: QuantityNames;
          /** The names for weapon slots */
          weaponSlot: QuantityNames;
          /** Names for different equipment slots */
          names: I18nEquipmentSlots;
        };
        /** Labels for the concept of value */
        value: {
          /** The name of the value concept */
          name: string;
        };
        /** Labels related to weapons */
        weapon: QuantityNames & {
          /** Names for attacks */
          attack: QuantityNames;
          /** The label for the holdout property */
          holdout: string;
          /** Labels related to reloading */
          reload: {
            /** The label for the container size */
            containerSize: string;
            /** The label for the container type */
            containerType: string;
            /** Labels for the different container types */
            containerTypes: {
              internal: string;
              magazine: string;
            };
            /** The noun for reload */
            name: string;
          };
          /** The name for the number of shots per attack */
          shots: string;
          /** The name for the strength requirement */
          strengthRequirement: ShortLongNames;
        };
        /** Labels relating to the concept of weight */
        weight: {
          /** The name of the concept of weight */
          name: string;
        };
      };
      /** Labels relating to health */
      health: {
        /** The label for the health */
        health: string;
        /** The label for the short version of "health points" */
        hp: string;
        /** The label for the healing rate */
        healingRate: string;
      };
      /** Label for the initiative */
      initiative: string;
      /** Label for the insanity field */
      insanity: string;
      /** Label for the karma field */
      karma: string;
      /** Labels related to leveling */
      leveling: {
        /** The label for the level */
        level: string;
        /** The label for the experience */
        experience: string;
      };
      /** Labels related to magic */
      magic: {
        /** The label for potency */
        potency: string;
        /** The name of "Magic" */
        magic: string;
        /** The label for the strain */
        strain: string;
        /** The label for the strain use */
        strainUse: string;
        /** The label of the types of magic */
        type: QuantityNames & {
          names: I18nMagicTypes;
        };
        school: QuantityNames & {
          names: I18nMagicSchools;
        };
      };
      painThreshold: QuantityNames & {
        reached: string;
      };
      /** Labels related to radiation */
      radiation: {
        /** The name of the radiation concept */
        name: string;
        /** The label for the absorbed dose */
        dose: string;
        /** The label for the radiation sickness level */
        sicknessLevel: string;
        /** Names for levels of radiation sickness */
        sicknessLevels: {
          none: string;
          minor: string;
          moderate: string;
          major: string;
          critical: string;
        };
      };
      /** Labels related to range */
      range: QuantityNames & {
        /** Labels relating to the distance */
        distance: {
          /** The name for the concept of distance */
          name: string;
        };
        /** Names for different ranges */
        ranges: {
          /** The name for out of range */
          outOfRange: ShortLongNames;
          /** The name for long range */
          long: ShortLongNames;
          /** The name for medium range */
          medium: ShortLongNames;
          /** The name for short range */
          short: ShortLongNames;
        };
      };
      resistances: {
        /** Labels for the poison resistance */
        poison: ShortLongNames;
        /** Labels for the radiation resistance */
        radiation: ShortLongNames;
      };
      /** Rules labels related to rolls */
      rolls: {
        /** Labels for roll results */
        results: {
          /** The label for a critical failure */
          criticalFailure: string;
          /** The label for a critical hit */
          criticalHit: string;
          /** The label for a critical miss */
          criticalMiss: string;
          /** The label for a critical success */
          criticalSuccess: string;
          /** The label for a failure */
          failure: string;
          /** The label for a hit */
          hit: string;
          /** The label for a miss */
          miss: string;
          /** The label for a success */
          success: string;
        };
        /** Labels for various targets to roll for */
        targets: {
          /** Label for a hit chance reason */
          hitChance: string;
        };
      };
      /** Labels related to skills */
      skills: QuantityNames & {
        /** Labels for skill points */
        points: ShortLongNames;
        /** The names of the skills */
        names: I18nSkills;
        /** The label for an unknown Skill */
        unknown: string;
      };
      /** Labels related to SPECIAL */
      special: QuantityNames & {
        /** The names of SPECIALs */
        names: I18nSpecials;
        /** The label for the permanent total of a SPECIAL */
        permTotal: string;
        /** Labels for SPECIAL points */
        points: ShortLongNames;
        /** The label for the temporary total of a SPECIAL */
        tempTotal: string;
        /** The label for an unknown SPECIAL */
        unknown: string;
      };
    };
    /** Labels used by the system module itself */
    system: {
      /** Labels for actions */
      actions: {
        cancel: string;
        create: string;
        delete: string;
        edit: string;
        execute: string;
        submit: string;
        update: string;
      };
      /** Labels relating to different dialogs */
      dialogs: {
        /** Labels for the compendium overwrite confirmation dialog */
        compendiumOverwriteConfirm: {
          /**
           * The title for the dialog
           *
           * Parameters:
           * - name: the name of the item
           * @pattern (?=.*\{name\})
           */
          title: string;
          /** The content of the dialog */
          content: string;
        };
      };
      /** Labels related to Effect Items */
      effect: QuantityNames;
      /** Labels related to generic Misc Items */
      item: QuantityNames;
      /** Labels used in the initial character setup app */
      initialCharacterSetup: {
        /** The label for the open button on the character sheet */
        openButton: string;
        /**
         * The title for the window
         *
         * Parameters:
         * - name: the name of the character
         * @pattern (?=.*\{name\})
         */
        title: string;
        /** Labels relating to the initial character setup */
        messages: {
          /** A message for when the user spent too few SPECIAL points */
          tooFewSpecialPointsSpent: string;
          /** A message for when the user spent too many SPECIAL points */
          tooManySpecialPointsSpent: string;
        };
      };
      /** Different system messages. */
      messages: {
        /**
         * The message when a specified attack could not be found on a weapon.
         *
         * Parameters:
         * - name: the name of the attack
         * @pattern (?=.*\{name\})
         */
        attackNotFound: string;
        /**
         * The message when a specified attack already exists on a weapon.
         * Parameters:
         * - name: the name of the attack
         * @pattern (?=.*\{name\})
         */
        attackAlreadyExists: string;
        /**
         * A general message that a slot a newly equipped apparel would block,
         * is already occupied by another apparel.
         */
        blockedApparelSlotIsOccupied: string;
        /**
         * A general message that an apparel slot is already blocked by another
         * apparel item.
         */
        blockedByAnotherApparel: string;
        /** A general message that something can not be done in combat. */
        canNotDoInCombat: string;
        /**
         * The message when an object attempted to be created could not be
         * created
         */
        couldNotCreateDocument: string;
        /**
         * The message when a macro tried to create an Actor or Item with
         * invalid system data
         */
        invalidSystemDataInMacro: string;
        /**
         * The message when an item just changed compendium link to linked.
         *
         * Parameters:
         * - name: the name of the item
         * @pattern (?=.*\{name\})
         */
        itemIsNowLinked: string;
        /**
         * The message when an item just changed compendium link to unlinked.
         *
         * Parameters:
         * - name: the name of the item
         * @pattern (?=.*\{name\})
         */
        itemIsNowUnlinked: string;
        /**
         * The notification text for completed migrations.
         *
         * Parameters:
         * - systemName: the name of the system
         * - version: the system version that was migrated to
         * @pattern (?=.*\{systemName\})(?=.*\{version\})
         */
        migrationCompleted: string;
        /**
         * The notification text for started migration.
         *
         * Parameters:
         * - systemName: the name of the system
         * - version: the system version will be migrated to
         * @pattern (?=.*\{systemName\})(?=.*\{version\})
         */
        migrationStarted: string;
        /**
         * The message when a Document does not have an Actor.
         *
         * Parameters:
         * - name: the name of the document
         * @pattern (?=.*\{name\})
         */
        noActor: string;
        /**
         * The message when an actor does not have enough AP to do something.
         */
        notEnoughAp: string;
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
        notEnoughApToMove: string;
        /** The message when a target is out of range */
        targetOutOfRange: string;
      };
      /** Miscellaneous labels not fitting anywhere else */
      misc: {
        /** Label for a description */
        description: string;
        /** Label for details */
        details: string;
        /** The label for a modifier, when the target is not known */
        modifier: string;
        /**
         * The label for a modifier.
         *
         * Parameters:
         * - what: a reference to what the modifier is for
         * @pattern (?=.*\{what\})
         */
        modifierFor: string;
        /** The name placeholder label for documents */
        name: string;
        /**
         * The placeholder name for a new Document.
         *
         * Parameters:
         * - what: the document type name
         * @pattern (?=.*\{what\})
         */
        newName: string;
        /** The label for user provided notes */
        notes: string;
        /** The label for source values */
        sourceValues: string;
        /** The label for a speaker alias */
        speakerAlias: string;
        /** A collective name for miscellaneous statistics */
        statistics: string;
        /** A collective name for tags */
        tags: string;
        /** A label for toggling a compendium link */
        toggleCompendiumLink: string;
        /** A label for updating an item from a compendium */
        updateFromCompendium: string;
      };
      /** Labels related to the prompt dialog */
      prompt: {
        /** Default labels for the prompt */
        defaults: {
          /** The default window title */
          title: string;
        };
      };
      /** Labels relating to race items */
      races: QuantityNames & {
        /** Label for the fallback race */
        noRace: string;
        /** Labels for physical attributes */
        physical: {
          /** Label for the "canFly" attribute */
          canFly: string;
          /** Label for the "canUseMagic" attribute */
          canUseMagic: string;
          /** Label for the "hasSecondHead" attribute */
          hasSecondHead: string;
          /** Label for the "hasSpecialTalent" attribute */
          hasSpecialTalent: string;
          /** Label for the "hasWings" attribute */
          hasWings: string;
        };
        /** Labels for character creation attributes */
        creation: {
          /** Label for the "startingSpecialPoints" attribute */
          startingSpecialPoints: string;
        };
      };
      /** System labels related to rolls */
      rolls: {
        /**
         * A descriptive verb for what is being rolled
         *
         * Parameters:
         * - what: the label for what is being rolled
         * @pattern (?=.*\{what\})
         */
        descriptive: string;
        /** A capitalized, imperative verb for rolling dice */
        imperative: string;
        /** A description for whispering to GMs */
        whisperToGms: string;
      };
      /** Labels related to the Rule Engine */
      ruleEngine: {
        /** Labels for document related rule element messages */
        documentMessages: {
          /** The descriptive name for document related rule element messages */
          name: string;
          /** Labels for different document relations */
          relations: Record<DocumentRelation, string>;
        };
        /** Labels for different errors */
        errors: {
          /** Various logical errors */
          logical: {
            /**
             * An error message when the selected property on the target is not
             * a CompositeNumber.
             *
             * Parameters:
             * - path: the selector path
             * @pattern (?=.*\{path\})
             */
            notCompositeNumber: string;
            /**
             * An error message when the target does not match a property on a
             * selected Document.
             *
             * Parameters
             * - path: the target path
             * @pattern (?=.*\{path\})
             */
            notMatchingTarget: string;
            /**
             * An error message when a selected document is not of the expected
             * type.
             *
             * Parameters
             * - type: the expected type
             * @pattern (?=.*\{type\})
             */
            wrongDocumentType: string;
            /**
             * An error message when the target property on the selected
             * Document is of the wrong type.
             *
             * Parameters:
             * - path: the target path
             * - type: the expected type of the rule element type
             * @pattern (?=.*\{path\})(?=.*\{type\})
             */
            wrongTargetType: string;
            /**
             * An error message when the value of a rule is of the wrong type.
             *
             * Parameters:
             * - type: the expected type for the rule element type
             * @pattern (?=.*\{type\})
             */
            wrongValueType: string;
          };
          /** Various semantic errors */
          semantic: {
            /**
             * An error message for fields that are not allowed.
             *
             * Parameters:
             * - path: the path of the additional property's parent
             * - property: the name of the additional property
             * @pattern (?=.*\{path\})(?=.*\{property\})
             */
            additional: string;
            /**
             * An error message for fields that are missing.
             *
             * Parameters:
             * - path: the path of the missing property's parent
             * - property: the name of the missing property
             * @pattern (?=.*\{path\})(?=.*\{property\})
             */
            missing: string;
            /** An error message for an unknown error. */
            unknown: string;
            /** An error message for an unknown RuleElement condition. */
            unknownCondition: string;
            /** An error message for an unknown RuleElement hook. */
            unknownHook: string;
            /** An error message for an unknown RuleElement type. */
            unknownRuleElement: string;
            /** An error message for an unknown SPECIAL name. */
            unknownSpecialName: string;
            /** An error message for an unknown RuleElement selector. */
            unknownSelector: string;
            /**
             * An error message for fields that are of the wrong type.
             *
             * Parameters:
             * - path: the path of the field with the wrong type
             * - type: the expected type of the field
             * @pattern (?=.*\{path\})(?=.*\{type\})
             */
            wrongType: string;
          };
          /**
           * The description for the JSON syntax error.
           *
           * Parameters:
           * - message: the JSON parser error message
           * @pattern (?=.*\{message\})
           */
          syntax: string;
        };
        /** Labels for rule elements */
        ruleElement: QuantityNames;
        /** Labels related to selectors */
        selectors: {
          /** A summary label for selected documents */
          selectedDocuments: string;
        };
        /** Labels for different warnings */
        warnings: {
          /**
           * A warning, stating that the type of a property was changed.
           *
           * Parameters:
           * - path: the path of the property on the target
           * - original: the original type of the property
           * - new: the new type of the property
           * @pattern (?=.*\{path\})(?=.*\{original\})(?=.*\{new\})
           */
          changedType: string;
          /**
           * A warning for when a rule element was not saved because of errors,
           * explaining that changes will be lost if foundry is reloaded.
           */
          notSaved: string;
        };
      };
      /** Labels related to settings. */
      settings: {
        /** Labels relating to an always/never setting */
        alwaysNeverSetting: {
          /** The choices for the setting */
          choices: {
            always: string;
            never: string;
          };
        };
        /** Movement related setting labels */
        movement: {
          /** The enforcement and subtract setting for players */
          enforceAndSubtractApForPlayers: Setting;
          /** The enforcement setting for game masters */
          enforceApForGameMasters: Setting;
          /** The subtract setting for game masters */
          subtractApForGameMasters: Setting;
        };
        /** The Skill Points minimum bounds setting */
        skillPointsMinBounds: Setting;
        /** The SPECIAL Points minimum bounds setting */
        specialPointsMinBounds: Setting;
      };
      /** Labels relating to sheets */
      sheets: {
        /** Names for different sheets */
        names: {
          /** The label for the Actor sheet */
          actorSheet: string;
          /** The label for the Ammo sheet */
          ammoSheet: string;
          /** The label for the Apparel sheet */
          apparelSheet: string;
          /** The label for the Effect sheet */
          effectSheet: string;
          /** The label for the generic Item Sheet */
          itemSheet: string;
          /** The label for the Magic sheet */
          magicSheet: string;
          /** The label for the Race sheet */
          raceSheet: string;
          /** The label for the Weapon sheet */
          weaponSheet: string;
        };
      };
      spell: QuantityNames;
      /** The label for the Thaumaturgy special select */
      thaumSpecial: string;
      /** Labels for describing different values */
      values: {
        /** Label for an amount of something */
        amount: string;
        /** Label for a base value */
        base: string;
        /** Label for a cost */
        cost: string;
        /** Label for a previous value */
        previous: string;
        /** Label for a remaining value */
        remaining: string;
        /** Label for a total value */
        total: string;
      };
    };
  };
}

/** Names in long and short form */
interface ShortLongNames {
  /** The long name */
  long: string;
  /** The short name */
  short: string;
}

/** Names in singular and plural */
interface QuantityNames {
  /** The singular name */
  singular: string;
  /** The plural name */
  plural: string;
}

/** A schema for system settings */
interface Setting {
  /** The name of the setting */
  name: string;
  /** The hint for the setting */
  hint: string;
}

/** A schema for enforce AP settings */
interface EnforceApSetting extends Setting {
  /** The setting choice labels */
  choices: {
    /** The label for the disabled state */
    disabled: string;
    /** The label for only enforcing on players state */
    players: string;
    /** The label for enforcing on players and GM state */
    playersAndGameMaster: string;
  };
}

/** A schema for SPECIALs */
interface Special extends ShortLongNames {
  /**
   * @maxLength 3
   * @minLength 3
   */
  short: string;
}
