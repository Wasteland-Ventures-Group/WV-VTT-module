import type { I18nRaces, I18nSkills, I18nSpecials } from "./wvI18n.js";

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
        /** Label for the social contacts */
        socialContacts: string;
        /** Label for the special talent */
        specialTalent: string;
        /** Label for the virtue */
        virtue: string;
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
          calibers: {
            ".308cal": string;
            ".44cal": string;
            ".50cal": string;
            "5mm": string;
            "5.56mm": string;
            "9mm": string;
            "10mm": string;
            "12.7mm": string;
            "20mm": string;
            shotgunShell: string;
            alienGemPack: string;
            gemPack: string;
            magicFusionCell: string;
            energizedCrystalPack: string;
            flamerFuel: string;
            arrow: string;
            rifleGrenade: string;
            balefireEgg: string;
            missile: string;
            cloud: string;
            improvised: string;
          };
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
        };
        /** The name for the inventory */
        inventory: string;
        /** The name for equipment */
        name: string;
        /** Labels relating to rarity */
        rarity: {
          /** The name for the concept of rarity */
          name: string;
          /** Names for the rarity levels */
          names: {
            common: string;
            uncommon: string;
            rare: string;
            exotic: string;
          };
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
          strengthRequirement: string;
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
        /** The label for the healing rate */
        healingRate: string;
      };
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
        /** The name of "Magic" */
        magic: string;
        /** The label for the strain */
        strain: string;
      };
      race: QuantityNames & {
        names: I18nRaces;
      };
      /** Labels related to range */
      range: QuantityNames & {
        /** The name for a measured distance */
        distance: string;
        /** Names for different ranges */
        ranges: {
          /** The name for out of range */
          outOfRange: string;
          /** The name for long range */
          long: string;
          /** The name for medium range */
          medium: string;
          /** The name for short range */
          short: string;
        };
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
        create: string;
        delete: string;
        edit: string;
        execute: string;
        submit: string;
      };
      /** Labels related to Effect Items */
      effect: QuantityNames;
      /** Different system messages. */
      messages: {
        /**
         * The message when a specified attack could not be found on a weapon.
         *
         * Parameters:
         * - name: the name of the weapon
         * @pattern (?=.*\{name\})
         */
        attackNotFound: string;
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
        /** The label for a speaker alias */
        speakerAlias: string;
        /** A collective name for miscellaneous statistics */
        statistics: string;
      };
      /** Labels related to the prompt dialog */
      prompt: {
        /** Default labels for the prompt */
        defaults: {
          /** The default window title */
          title: string;
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
        /** An explanation for modifier keys used for roll buttons */
        modifierExplanation: string;
      };
      /** Labels related to the Rule Engine */
      ruleEngine: {
        /** Labels for different errors */
        errors: {
          /** Various logical errors */
          logical: {
            /**
             * An error message when the target is set to "actor", but the item
             * of the RuleElement has no actor.
             */
            noActor: string;
            /**
             * An error message when the selector does not match a property on
             * the target.
             *
             * Parameters
             * - name: the name of the target document
             * - path: the selector path
             * @pattern (?=.*\{name\})(?=.*\{path\})
             */
            notMatchingSelector: string;
            /**
             * An error message when the selected property on the target is of
             * the wrong type.
             *
             * Parameters:
             * - name: the name of the target
             * - path: the selector path
             * - type: the expected type of the rule element type
             * @pattern (?=.*\{name\})(?=.*\{path\})(?=.*\{type\})
             */
            wrongSelectedType: string;
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
            /** An error message for an unknown RuleElement hook. */
            unknownHook: string;
            /** An error message for an unknown RuleElement type. */
            unknownRuleElement: string;
            /** An error message for an unknown RuleElement target. */
            unknownTarget: string;
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
        /** Labels for different warnings */
        warnings: {
          /**
           * A warning, stating that the type of a property was changed.
           *
           * Parameters:
           * - name: the target name
           * - path: the path of the property on the target
           * - original: the original type of the property
           * - new: the new type of the property
           * @pattern (?=.*\{name\})(?=.*\{path\})(?=.*\{original\})(?=.*\{new\})
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
        /** The Skill Points minimum bounds setting */
        skillPointsMinBounds: Setting;
        /** The SPECIAL Points minimum bounds setting */
        specialPointsMinBounds: Setting;
        /** The enforce AP on drag and drop setting */
        enforceApDragDrop: EnforceApSetting;
        /** The enforce AP on ruler move setting */
        enforceApRuler: EnforceApSetting;
      };
      /** Labels relating to sheets */
      sheets: {
        /** Names for different sheets */
        names: {
          /** The label for the Actor sheet */
          actorSheet: string;
          /** The label for the Effect sheet */
          effectSheet: string;
          /** The label for the Weapon sheet */
          weaponSheet: string;
        };
      };
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
