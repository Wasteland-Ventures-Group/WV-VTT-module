import type { JSONSchemaType } from "ajv";
import { SkillName, SkillNames, TYPES } from "../../../constants.js";
import type { FoundryCompendiumData } from "../../foundryCommon.js";
import { COMPENDIUM_JSON_SCHEMA } from "../../foundryCommon.js";
import PhysicalBaseItem, {
  JSON_SCHEMA as PHYS_BASE_ITEM_SCHEMA
} from "../physicalBaseItem.js";
import {
  AttacksSource,
  JSON_SCHEMA as ATTACK_JSON_SCHEMA
} from "./attack/source.js";
import type Ranges from "./ranges/source.js";
import { RANGES_JSON_SCHEMA } from "./ranges/source.js";
import type { Reload } from "./reload.js";
import { JSON_SCHEMA as RELOAD_JSON_SCHEMA } from "./reload.js";

/** The Weapon Item data-source */
export default interface WeaponDataSource {
  type: typeof TYPES.ITEM.WEAPON;
  data: WeaponDataSourceData;
}

/** The Weapon Item data-source data */
export class WeaponDataSourceData extends PhysicalBaseItem {
  /** The attacks of the weapon */
  attacks: AttacksSource = new AttacksSource();

  /** Whether the weapon is a holdout weapon. By default, this is `false`. */
  holdout?: boolean = false;

  /** The ranges of the weapon */
  ranges: Ranges = RANGES_JSON_SCHEMA.default;

  /**
   * The reload stats of the weapon. By default, the weapon does not support
   * reloading.
   */
  reload?: Reload;

  /** The skill associated with the weapon attacks */
  skill: SkillName = "firearms";

  /** The strength requirement for this weapon to be equipped */
  strengthRequirement: number = 0;

  override getTypeName(): string {
    return TYPES.ITEM.WEAPON;
  }
}

/** The default object for weapon attacks */
const ATTACKS_DEFAULT = { sources: {} };

/** A JSON schema for weapon source objects */
export const WEAPON_SOURCE_JSON_SCHEMA: JSONSchemaType<WeaponDataSourceData> = {
  description: "The system data for a weapon Item",
  type: "object",
  properties: {
    ...PHYS_BASE_ITEM_SCHEMA.properties,
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
      nullable: true,
      default: true
    },
    ranges: {
      ...RANGES_JSON_SCHEMA
    },
    reload: {
      ...RELOAD_JSON_SCHEMA,
      description:
        "The reload behavior of the weapon. If this is not specified the " +
        "weapon does not support reloading.",
      nullable: true
    },
    skill: {
      description: "The Skill used for all actions of the weapon",
      type: "string",
      enum: SkillNames,
      default: "firearms"
    },
    strengthRequirement: {
      description: "The Strength requirement of the weapon",
      type: "integer",
      default: 0
    }
  },
  required: [
    ...PHYS_BASE_ITEM_SCHEMA.required,
    "attacks",
    "ranges",
    "skill",
    "strengthRequirement"
  ],
  additionalProperties: false,
  default: {
    ...PHYS_BASE_ITEM_SCHEMA.default,
    attacks: ATTACKS_DEFAULT,
    ranges: RANGES_JSON_SCHEMA.default,
    skill: "firearms",
    strengthRequirement: 0
  }
};

export interface CompendiumWeapon
  extends FoundryCompendiumData<WeaponDataSourceData> {
  type: "weapon";
}

/** A JSON schema for compendium weapon objects */
export const COMP_WEAPON_JSON_SCHEMA: JSONSchemaType<CompendiumWeapon> = {
  description: "The compendium data for a weapon item",
  type: "object",
  properties: {
    ...COMPENDIUM_JSON_SCHEMA.properties,
    type: {
      description: COMPENDIUM_JSON_SCHEMA.properties.type.description,
      type: "string",
      const: "weapon",
      default: "weapon"
    },
    data: WEAPON_SOURCE_JSON_SCHEMA
  },
  required: COMPENDIUM_JSON_SCHEMA.required,
  additionalProperties: false,
  default: {
    ...COMPENDIUM_JSON_SCHEMA.default,
    type: "weapon",
    data: WEAPON_SOURCE_JSON_SCHEMA.default
  }
};
