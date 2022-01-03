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
  ranges: Ranges = {
    short: {
      distance: 20,
      modifier: 0
    }
  };

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

/** A JSON schema for weapon source objects */
export const WEAPON_SOURCE_JSON_SCHEMA: JSONSchemaType<WeaponDataSourceData> = {
  type: "object",
  properties: {
    ...PHYS_BASE_ITEM_SCHEMA.properties,
    attacks: {
      type: "object",
      properties: {
        sources: {
          type: "object",
          additionalProperties: ATTACK_JSON_SCHEMA
        }
      },
      required: ["sources"],
      additionalProperties: false
    },
    holdout: { type: "boolean", default: false, nullable: true },
    ranges: {
      ...RANGES_JSON_SCHEMA,
      default: { short: { distance: 20, modifier: 0 } }
    },
    reload: { ...RELOAD_JSON_SCHEMA, nullable: true },
    skill: { type: "string", enum: SkillNames, default: "firearms" },
    strengthRequirement: { type: "integer", default: 0 }
  },
  required: [
    ...PHYS_BASE_ITEM_SCHEMA.required,
    "attacks",
    "ranges",
    "skill",
    "strengthRequirement"
  ],
  additionalProperties: false
};

export interface CompendiumWeapon
  extends FoundryCompendiumData<WeaponDataSourceData> {
  type: "weapon";
}

/** A JSON schema for compendium weapon objects */
export const COMP_WEAPON_JSON_SCHEMA: JSONSchemaType<CompendiumWeapon> = {
  type: "object",
  properties: {
    ...COMPENDIUM_JSON_SCHEMA.properties,
    type: { type: "string", const: "weapon" },
    data: WEAPON_SOURCE_JSON_SCHEMA
  },
  required: COMPENDIUM_JSON_SCHEMA.required,
  additionalProperties: false
};
