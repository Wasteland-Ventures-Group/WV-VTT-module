import {
  SkillName,
  SpecialName,
  isSpecialName,
  isSkillName,
  Caliber,
  Rarity,
  ApparelSlot,
  ApparelType,
  EquipmentSlot,
  RadiationSicknessLevel,
  GeneralMagicSchool,
  MagicType,
  SchoolByMagicType
} from "./constants.js";
import type { DamageFallOffType } from "./data/item/weapon/attack/source.js";
import type { AmmoContainerType } from "./data/item/weapon/reload/source.js";
import { getGame } from "./foundryHelpers.js";

/** The internationalization structure of a single SPECIAL. */
export interface I18nSpecial {
  /** The long name of the SPECIAL stat. */
  long: string;

  /** The short name of the SPECIAL stat. */
  short: string;
}

/** The internationalization structure for apparel slots */
export type I18nApparelSlots = Record<ApparelSlot, string>;

/** The internationalization structure for apparel types */
export type I18nApparelTypes = Record<ApparelType, string>;

/** The internationalization structure for calibers */
export type I18nCalibers = Record<Caliber, string>;

/** The internationalisation structure of the magic types */
export type I18nMagicTypes = Record<MagicType, string>;

/** The internationalisation structure of the magic schools */
export type I18nMagicSchools = Record<GeneralMagicSchool, string>;

/** The internationalization structure for ammo container types */
export type I18nAmmoContainerTypes = Record<AmmoContainerType, string>;

/** The internationalization structure for damage fall-off types */
export type I18nDamageFallOffTypes = Record<DamageFallOffType, string>;

/** The internationalization structure for equipment slots */
export type I18nEquipmentSlots = Record<EquipmentSlot, string>;

/** The internationalization structure of radiation sickness levels. */
export type I18nRadSicknessLevels = Record<RadiationSicknessLevel, string>;

/** The internationalization structure for rarities */
export type I18nRarities = Record<Rarity, string>;

/** The internationalization structure of the SPECIALs */
export type I18nSpecials = Record<SpecialName, I18nSpecial>;

/** The internationalization structure of the Skills */
export type I18nSkills = Record<SkillName, string>;

/**
 * A helper class to serve Wasteland Ventures internationalization structures.
 */
export default class WvI18n {
  /** Get the internationalization of the apparel slots. */
  static get apparelSlots(): I18nApparelSlots {
    const slotNames = foundry.utils.getProperty(
      getGame().i18n.translations,
      "wv.rules.equipment.slots.names"
    ) as I18nEquipmentSlots;
    return {
      armor: slotNames.armor,
      clothing: slotNames.clothing,
      eyes: slotNames.eyes,
      mouth: slotNames.mouth,
      belt: slotNames.belt
    };
  }

  /** Get the internationalization of apparel types. */
  static get apparelTypes(): I18nApparelTypes {
    return foundry.utils.getProperty(
      getGame().i18n.translations,
      "wv.rules.equipment.apparel.types"
    ) as I18nApparelTypes;
  }

  /** Get the internationalization of the calibers. */
  static get calibers(): I18nCalibers {
    return foundry.utils.getProperty(
      getGame().i18n.translations,
      "wv.rules.equipment.ammo.calibers"
    ) as I18nCalibers;
  }

  /** Get the internationalisation of the magic schools of a certain type*/
  static getMagicSchools(type: MagicType): Partial<I18nMagicSchools> {
    const result: Partial<I18nMagicSchools> = {};
    const allSchools = WvI18n.magicSchools;
    SchoolByMagicType[type].forEach(
      (school) => (result[school] = allSchools[school])
    );
    return result;
  }

  /** Get the internationalisation of all the magic schools */
  static get magicSchools(): I18nMagicSchools {
    return foundry.utils.getProperty(
      getGame().i18n.translations,
      "wv.rules.magic.school.names"
    ) as I18nMagicSchools;
  }

  /** Get the internationalisation of the magic types */
  static get magicTypes(): I18nMagicTypes {
    return foundry.utils.getProperty(
      getGame().i18n.translations,
      "wv.rules.magic.type.names"
    ) as I18nMagicTypes;
  }

  /** Get the internationalization of the ammo container types. */
  static get ammoContainerTypes(): I18nAmmoContainerTypes {
    return foundry.utils.getProperty(
      getGame().i18n.translations,
      "wv.rules.equipment.weapon.reload.containerTypes"
    ) as I18nAmmoContainerTypes;
  }

  /** Get the internationalization of the damage fall-off types. */
  static get damageFallOffTypes(): I18nDamageFallOffTypes {
    return foundry.utils.getProperty(
      getGame().i18n.translations,
      "wv.rules.damage.fallOff.types"
    ) as I18nDamageFallOffTypes;
  }

  /** Get the internationalization of radiation sickness levels. */
  static get radiationSicknessLevels(): I18nRadSicknessLevels {
    return foundry.utils.getProperty(
      getGame().i18n.translations,
      "wv.rules.radiation.sicknessLevels"
    ) as I18nRadSicknessLevels;
  }

  /** Get the internationalization of the rarities. */
  static get rarities(): I18nRarities {
    return foundry.utils.getProperty(
      getGame().i18n.translations,
      "wv.rules.equipment.rarity.names"
    ) as I18nRarities;
  }

  /** Get the internationalization of the SPECIALs. */
  static get specials(): I18nSpecials {
    return foundry.utils.getProperty(
      getGame().i18n.translations,
      "wv.rules.special.names"
    ) as I18nSpecials;
  }

  /** Get the internationalization of the long names for SPECIALs. */
  static get longSpecials(): Record<SpecialName, string> {
    const specials = WvI18n.specials;
    return {
      strength: specials.strength.long,
      perception: specials.perception.long,
      endurance: specials.endurance.long,
      charisma: specials.charisma.long,
      intelligence: specials.intelligence.long,
      agility: specials.agility.long,
      luck: specials.luck.long
    };
  }

  /** Get the internationalization of the Skills. */
  static get skills(): I18nSkills {
    return foundry.utils.getProperty(
      getGame().i18n.translations,
      "wv.rules.skills.names"
    ) as I18nSkills;
  }

  /**
   * Get an internationalized SPECIAL roll flavor text.
   * @param name - the name of the SPECIAL
   * @returns the internationalized flavor text
   */
  static getSpecialRollFlavor(name: string): string {
    return getGame().i18n.format("wv.system.rolls.descriptive", {
      what: this.getSpecialLongName(name)
    });
  }

  /**
   * Get an internationalized SPECIAL roll modifier description.
   * @param name - the name of the SPECIAL
   * @returns the internationalized description
   */
  static getSpecialModifierDescription(name: string): string {
    return getGame().i18n.format("wv.system.misc.modifierFor", {
      what: this.getSpecialLongName(name)
    });
  }

  /**
   * Get an internationalized Skill roll flavor text.
   * @param name - the name of the Skill
   * @returns the internationalized flavor text
   */
  static getSkillRollFlavor(name: string): string {
    return getGame().i18n.format("wv.system.rolls.descriptive", {
      what: this.getSkillName(name)
    });
  }

  /**
   * Get an internationalized Skill roll modifier description.
   * @param name - the name of the Skill
   * @returns the internationalized description
   */
  static getSkillModifierDescription(name: string): string {
    return getGame().i18n.format("wv.system.misc.modifierFor", {
      what: this.getSkillName(name)
    });
  }

  /**
   * Get the long, internationalized name of a given SPECIAL name.
   * @param name - the name of the SPECIAL
   * @returns the internationalized, long SPECIAL name.
   */
  private static getSpecialLongName(name: string): string {
    return isSpecialName(name)
      ? this.specials[name].long
      : getGame().i18n.localize("wv.rules.special.unknown");
  }

  /**
   * Get the internationalized name of a given Skill name.
   * @param name - the name of the Skill
   * @returns the internationalized Skill name.
   */
  private static getSkillName(name: string): string {
    return isSkillName(name)
      ? this.skills[name]
      : getGame().i18n.localize("wv.rules.skills.unknown");
  }
}
