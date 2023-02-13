import type { JSONSchemaType } from "ajv";
import { SkillName, SkillNames, TYPES } from "../../../constants.js";
import {
  CompositeNumberSource,
  COMPOSITE_NUMBER_SOURCE_JSON_SCHEMA
} from "../../common.js";
import type { FoundryCompendiumData } from "../../foundryCommon.js";
import { COMPENDIUM_JSON_SCHEMA } from "../../foundryCommon.js";
import PhysicalItemSource, {
  PHYS_ITEM_SOURCE_JSON_SCHEMA
} from "../common/physicalItem/source.js";
import AttacksSource, { ATTACK_JSON_SCHEMA } from "./attack/source.js";
import type RangesSource from "./ranges/source.js";
import { RANGES_JSON_SCHEMA } from "./ranges/source.js";
import type ReloadSource from "./reload/source.js";
import { RELOAD_JSON_SCHEMA } from "./reload/source.js";

export default interface WeaponDataSource {
  type: typeof TYPES.ITEM.WEAPON;
  data: WeaponDataSourceData;
}

export class WeaponDataSourceData extends PhysicalItemSource {
  /** The attacks of the weapon */
  attacks: AttacksSource = new AttacksSource();

  /** Whether the weapon is a holdout weapon */
  holdout?: boolean = false;

  /** The ranges of the weapon */
  ranges: RangesSource = RANGES_JSON_SCHEMA.default;

  /** The reload of the weapon */
  reload: ReloadSource = RELOAD_JSON_SCHEMA.default;

  /** Critical damage multiplier */
  criticalDamageMultiplier: CompositeNumberSource = { source: 2 };

  /** The skill associated with the weapon attacks */
  skill: SkillName = "firearms";

  /** The strength requirement for this weapon to be equipped */
  strengthRequirement: CompositeNumberSource = { source: 0 };
}

const ATTACKS_DEFAULT = { sources: {} };

export const WEAPON_SOURCE_JSON_SCHEMA: JSONSchemaType<WeaponDataSourceData> = {
  description: "The system data for a weapon Item",
  type: "object",
  properties: {
    ...PHYS_ITEM_SOURCE_JSON_SCHEMA.properties,
    attacks: {
      description: "Attack definitions for the the weapon",
      type: "object",
      properties: {
        sources: {
          description:
            "Attack source structures for the weapon. It should consist of " +
            "attack identifying names unique per weapon, mapping to attack " +
            "definitions.",
          type: "object",
          additionalProperties: ATTACK_JSON_SCHEMA,
          default: {}
        }
      },
      required: ["sources"],
      additionalProperties: false,
      default: ATTACKS_DEFAULT
    },
    holdout: {
      description:
        "Whether this weapon is a holdout weapon. If this is not specified " +
        "it defaults to `false`.",
      type: "boolean",
      default: true
    },
    ranges: {
      ...RANGES_JSON_SCHEMA
    },
    reload: {
      ...RELOAD_JSON_SCHEMA,
      description: "The reload behavior of the weapon."
    },
    criticalDamageMultiplier: {
      description: "The weapon's damage multiplier for critical hits",
      ...COMPOSITE_NUMBER_SOURCE_JSON_SCHEMA,
      properties: {
        source: {
          ...COMPOSITE_NUMBER_SOURCE_JSON_SCHEMA.properties.source,
          type: "integer",
          default: 0
        }
      },
      default: {
        source: 2
      }
    },
    skill: {
      description: "The Skill used for all actions of the weapon",
      type: "string",
      enum: SkillNames,
      default: "firearms"
    },
    strengthRequirement: {
      ...COMPOSITE_NUMBER_SOURCE_JSON_SCHEMA,
      description: "The Strength requirement of the weapon",
      properties: {
        source: {
          ...COMPOSITE_NUMBER_SOURCE_JSON_SCHEMA.properties.source,
          type: "integer",
          default: 0
        }
      },
      default: {
        source: 0
      }
    }
  },
  required: [
    ...PHYS_ITEM_SOURCE_JSON_SCHEMA.required,
    "attacks",
    "ranges",
    "reload",
    "skill",
    "strengthRequirement"
  ],
  additionalProperties: false,
  default: {
    ...PHYS_ITEM_SOURCE_JSON_SCHEMA.default,
    attacks: ATTACKS_DEFAULT,
    ranges: RANGES_JSON_SCHEMA.default,
    reload: RELOAD_JSON_SCHEMA.default,
    skill: "firearms",
    strengthRequirement: {
      source: 0
    }
  }
};

export interface CompendiumWeapon
  extends FoundryCompendiumData<WeaponDataSourceData> {
  type: typeof TYPES.ITEM.WEAPON;
}

export const COMP_WEAPON_JSON_SCHEMA: JSONSchemaType<CompendiumWeapon> = {
  description: "The compendium data for a weapon Item",
  type: "object",
  properties: {
    ...COMPENDIUM_JSON_SCHEMA.properties,
    type: {
      description: COMPENDIUM_JSON_SCHEMA.properties.type.description,
      type: "string",
      const: TYPES.ITEM.WEAPON,
      default: TYPES.ITEM.WEAPON
    },
    data: WEAPON_SOURCE_JSON_SCHEMA
  },
  required: COMPENDIUM_JSON_SCHEMA.required,
  additionalProperties: false,
  default: {
    ...COMPENDIUM_JSON_SCHEMA.default,
    type: TYPES.ITEM.WEAPON,
    data: WEAPON_SOURCE_JSON_SCHEMA.default,
    img: "icons/weapons/guns/gun-pistol-flintlock-white.webp"
  }
};
