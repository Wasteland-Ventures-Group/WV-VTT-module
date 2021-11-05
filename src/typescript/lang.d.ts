export interface LangSchema {
  /** The root element for the Wasteland Ventures system localization */
  wv: {
    /** Entries related to Foundry's concept of Items */
    fvttItems: {
      /** Labels for actions, related to managing Items */
      actions: {
        /** The action label for creating Items */
        create: string;
        /** The action label for deleting Items */
        delete: string;
        /** The action label for editing Items */
        edit: string;
      };
      /**
       * The placeholder name for a new Item, containing a reference to the item
       * name with `what`.
       * @pattern (?=.*\{what\})
       */
      newName: string;
      /** Labels for different types of system Items */
      types: {
        /** Labels related to Effect Items */
        effects: ItemType;
      };
    };
    /** Different system messages. */
    messages: {
      /** Messages related to movement */
      movement: {
        /**
         * The message when a Token does not have an Actor to get AP from.
         * @pattern (?=.*\{name\})
         */
        noActor: string;
        /**
         * The message when an actor does not have enough AP to move a specific
         * distance.
         * @pattern (?=.*\{needed\})(?=.*\{actual\})(?=.*\{name\})
         */
        notEnoughAp: string;
      };
    };
    /** Labels for migrations */
    migration: {
      /**
       * The notification text for completed migrations, containing references to
       * the system name with `systemName` and the system version with `version`
       * @pattern (?=.*\{systemName\})(?=.*\{version\})
       */
      completed: string;
      /**
       * The notification text for started migration, containing references to
       * the system name with `systemName` and the system version with `version`s
       * @pattern (?=.*\{systemName\})(?=.*\{version\})
       */
      started: string;
    };
    /** Labels related to the prompt dialog */
    prompt: {
      /** The label for the submit button */
      buttonText: string;
      /** Default labels for the prompt */
      defaults: {
        /** The default description */
        description: string;
        /** The default window title */
        title: string;
      };
      /** Different descriptions for different use cases */
      descriptions: {
        /** The label for a roll modifier dialog, when the target is not known */
        genericModifier: string;
        /**
         * The label for a roll modifier dialog, containing a reference to what
         * is modified with `what`
         * @pattern (?=.*\{what\})
         */
        modifier: string;
        /** The description for entering a range */
        range: string;
      };
    };
    /** Labels related to rolls */
    rolls: {
      /** The title (tooltip) for roll buttons */
      buttonTitle: string;
      /**
       * The flavor text for the chat messages, containing a reference to what
       * is rolled with `what`
       * @pattern (?=.*\{what\})
       */
      flavor: string;
      /**
       * The label for the roll/confirm button on a roll modifier dialog window
       */
      roll: string;
    };
    /** Labels related to the Rule Engine */
    ruleEngine: {
      /** Various labels related to RuleElements */
      ruleElement: {
        /** The label for creating a RuleElement */
        create: string;
        /** The label for deleting a RuleElement */
        delete: string;
        /** The default label for a new RuleElement */
        newName: string;
      };
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
           * An error message when the selected property on the target is of the
           * wrong type. It should contain a reference to the target name with
           * `name`, to the property with `path` and the expected type with
           * `type`.
           * @pattern (?=.*\{name\})(?=.*\{path\})(?=.*\{type\})
           */
          wrongSelectedType: string;
        };
        /** Various semantic errors */
        semantic: {
          /**
           * An error message for fields that are missing, containing a
           * reference to the instance path with `path` and the missing property
           * with `property`.
           * @pattern (?=.*\{path\})(?=.*\{property\})
           */
          missing: string;
          /** An error message for an unknown error. */
          unknown: string;
          /** An error message for an unknown RuleElement type. */
          unknownRuleElement: string;
          /** An error message for an unknown RuleElement target. */
          unknownTarget: string;
          /**
           * An error message for fields that are of the wrong type, containing
           * a reference to the instance path with `path` and to the name of the
           * expected type with `type`.
           * @pattern (?=.*\{path\})(?=.*\{type\})
           */
          wrongType: string;
        };
        /**
         * The description for the JSON syntax error, containing references to
         * the number of the rule element with `number` and the error message
         * with `message`
         * @pattern (?=.*\{number\})(?=.*\{message\})
         */
        syntax: string;
      };
    };
    /** Labels related to the measuring tool */
    ruler: {
      /** The unit for the AP cost for moving */
      apCostUnit: string;
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
    /** Labels related to sheets */
    sheets: {
      /** Labels for actor sheets */
      actor: {
        /** Labels for the background */
        background: {
          /** Label for the background text area */
          background: string;
          /** Label for the history text area */
          history: string;
          /** Label for the fears text area */
          fears: string;
          /** Label for the dreams text area */
          dreams: string;
          /** Label for the karma field */
          karma: string;
        };
        /** Labels related to the inventory */
        inventory: {
          /** Headings in the inventory */
          headings: {
            /** The weapons heading */
            weapons: string;
          };
        };
        /** Labels related to magic */
        magic: {
          /** The label for the thaumaturgy select */
          thaumSpecial: string;
        };
        /** Labels for secondary stats */
        secondary: {
          /** The label for the Action Points */
          actionPoints: string;
          /** Labels related to criticals */
          criticals: {
            /** The label for critical failures */
            failure: string;
            /** The label for critical successes */
            success: string;
            /** The title label for criticals */
            title: string;
          };
          /** The label for the experience */
          experience: string;
          /** The label for the healing rate */
          healingRate: string;
          /** The label for the health */
          health: string;
          /** The label for the initiative */
          initiative: string;
          /** The label for the level */
          level: string;
          /** The label for the strain */
          strain: string;
        };
        /** Labels related to the Skills table in the actor sheet */
        skills: {
          /** The label for the name column */
          name: string;
          /** The label for the ranks column */
          ranks: string;
          /** The label for the roll column */
          roll: string;
          /** The label for the SPECIAL column */
          special: string;
          /** The label for the total column */
          total: string;
        };
        /** Labels related to the SPECIALS table in the actor sheet */
        special: {
          /** The label for the name column */
          name: string;
          /** The label for the roll button column */
          roll: string;
          /** The label for the value column */
          value: string;
        };
      };
      /** Labels common for all sheets */
      common: {
        /** Names for different sheets */
        names: {
          /** The label for the Actor sheet */
          actorSheet: string;
          /** The label for the Effect sheet */
          effectSheet: string;
          /** The label for the Weapon sheet */
          weaponSheet: string;
        };
        /** Labels used as placeholders in inputs */
        placeholders: {
          /** The placeholder label for generic documents */
          documentName: string;
        };
        /** Labels for tabs */
        tabs: {
          /** The label for the background tab */
          background: string;
          /** The label for the effects tab */
          effects: string;
          /** The label for the inventory tab */
          inventory: string;
          /** The label for the magic tab */
          magic: string;
          /** The label for the rules tab */
          rules: string;
          /** The label for the stats tab */
          stats: string;
        };
      };
      /** Labels for Item sheets */
      item: {
        /** Common labels for Items */
        common: {
          /** The label user provided notes */
          notes: string;
        };
        /** Labels for Weapon sheets */
        weapon: {
          /** Labels related to attacks */
          attacks: {
            /** The label for the AP cost */
            ap: string;
            /** The label for the damage */
            damage: string;
            /** The label for the DT reduction */
            dtReduction: string;
            /** The label for the rounds */
            rounds: string;
            /** The heading for the attacks block */
            title: string;
          };
          /** The label for the holdout display */
          holdout: string;
          /** Labels related to ranges */
          ranges: {
            /** The name for the distance column */
            distance: string;
            /** The name for the long range */
            long: string;
            /** The name for the medium range */
            medium: string;
            /** The name for the modifier column */
            modifier: string;
            /** The name for the range column */
            range: string;
            /** The name for the short range */
            short: string;
            /** The heading for the ranges block */
            title: string;
          };
          /** Labels related to reloading */
          reload: {
            /** The label for the reload AP */
            ap: string;
            /** The label for the caliber */
            caliber: string;
            /** The label for the container type */
            containerType: string;
            /** The label for the reload size */
            size: string;
            /** The heading for the reload block */
            title: string;
          };
          /** The label for the skill display */
          skill: string;
          /** The label for the strength requirement display */
          strengthRequirement: string;
        };
      };
    };
    /** Labels related to Skills */
    skills: {
      /** Errors related to Skills */
      errors: {
        /** The label for an unknown Skill */
        unknownSkill: string;
      };
      /** Names for different Skills */
      names: {
        /** The name of the Barter Skill */
        barter: string;
        /** The name of the Diplomacy Skill */
        diplomacy: string;
        /** The name of the Explosives Skill */
        explosives: string;
        /** The name of the Firearms Skill */
        firearms: string;
        /** The name of the Intimidation Skill */
        intimidation: string;
        /** The name of the Lockpick Skill */
        lockpick: string;
        /** The name of the Magical Energy Weapons Skill */
        magicalEnergyWeapons: string;
        /** The name of the Mechanics Skill */
        mechanics: string;
        /** The name of the Medicine Skill */
        medicine: string;
        /** The name of the Melee Skill */
        melee: string;
        /** The name of the Science Skill */
        science: string;
        /** The name of the Sleight Skill */
        sleight: string;
        /** The name of the Sneak Skill */
        sneak: string;
        /** The name of the Survival Skill */
        survival: string;
        /** The name of the Thaumaturgy Skill */
        thaumaturgy: string;
        /** The name of the Unarmed Skill */
        unarmed: string;
      };
    };
    /** Labels related to SPECIALs */
    specials: {
      /** Errors related to SPECIALs */
      errors: {
        /** The label for an unknown SPECIAL */
        unknownSpecial: string;
      };
      /** Names for different SPECIALs */
      names: {
        /** Labels for the Agility SPECIAL */
        agility: Special & {
          long: string;
          short: string;
        };
        /** Labels for the Charisma SPECIAL */
        charisma: {
          long: string;
          short: string;
        };
        /** Labels for the Endurance SPECIAL */
        endurance: {
          long: string;
          short: string;
        };
        /** Labels for the Intelligence SPECIAL */
        intelligence: {
          long: string;
          short: string;
        };
        /** Labels for the Luck SPECIAL */
        luck: {
          long: string;
          short: string;
        };
        /** Labels for the Perception SPECIAL */
        perception: {
          long: string;
          short: string;
        };
        /** Labels for the Strength SPECIAL */
        strength: {
          long: string;
          short: string;
        };
      };
    };
    /** Labels related to Weapon Items */
    weapons: {
      /** Labels related to Weapon Attacks */
      attacks: {
        /** The label for the damage roll of an attack */
        damageRoll: string;
        /** The label for the details list of an attack */
        details: string;
        /** The label for the execute button */
        execute: string;
        /**
         * The message when the weapon owner does not have enough AP for the
         * attack
         */
        notEnoughAp: string;
        /** The message when the target is out of range for the weapon */
        outOfRange: string;
        /** The label for the ranges of a weapon */
        range: string;
        /** Result labels for the attack */
        results: {
          /** The label for a hit */
          hit: string;
          /** The label for a miss */
          miss: string;
          /** The label for a critical hit */
          criticalHit: string;
          /** The label for a critical miss */
          criticalMiss: string;
        };
      };
    };
  };
}

/** A schema for Item types */
interface ItemType {
  /** The name of the Item type */
  name: string;
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
interface Special {
  /** The long name of the SPECIAL */
  long: string;
  /**
   * The short name of the SPECIAL, should be three characters
   * @maxLength 3
   * @minLength 3
   */
  short: string;
}
