import { z } from "zod";
import { SkillNames, SpecialNames, TYPES } from "../../../constants";
import { ID_STRING } from "../../foundryCommon";
import { BASE_ITEM_SOURCE_SCHEMA } from "../common/baseItem/source";

export default interface PerkDataSource {
  type: typeof TYPES.ITEM.PERK;
  data: PerkDataSourceData;
}

export type PerkDataSourceData = z.infer<typeof PERK_SOURCE_SCHEMA>;

// due to some limitations, this cannot have its own defaults
export const LOGIC_BRANCH_SOURCE_SCHEMA: z.ZodType<LogicBranchSource> = z.lazy(
  () =>
    z.union([
      z.object({
        /** Satisfying any of these is enough*/
        any: LOGIC_NODE_SOURCE_SCHEMA.array()
      }),
      z.object({
        /** All of these must be satisfied */
        all: LOGIC_NODE_SOURCE_SCHEMA.array()
      })
    ])
);

export type LogicBranchSource =
  | { any: LogicNodeSource[] }
  | { all: LogicNodeSource[] };

/** Schema representing a minimum or maximum bound */
const BOUNDS_SCHEMA = z.union([
  z.object({ min: z.number() }),
  z.object({ max: z.number() })
]);

/**
 * SPECIAL requirement for a perk. Can be either a maximum (exclusive) or a
 * minimum (inclusive)
 */
export type SpecialRequirementSource = z.infer<
  typeof SPECIAL_REQ_SOURCE_SCHEMA
>;
export const SPECIAL_REQ_SOURCE_SCHEMA = z.intersection(
  z.object({
    special: z.enum(SpecialNames)
  }),
  BOUNDS_SCHEMA
);

/**
 * Skill requirement for a perk. Can be either a maximum (exclusive) or a
 * minimum (inclusive)
 */
export type SkillRequirementSource = z.infer<typeof SKILL_REQ_SOURCE_SCHEMA>;
export const SKILL_REQ_SOURCE_SCHEMA = z.intersection(
  z.object({
    skill: z.enum(SkillNames)
  }),
  BOUNDS_SCHEMA
);

/**
 * Perk requirement for a perk. Note that this can also be a trait.
 */
export type PerkRequirementSource = z.infer<typeof PERK_REQ_SOURCE_SCHEMA>;
export const PERK_REQ_SOURCE_SCHEMA = z.object({
  /** The required perk */
  perk: z.object({
    /** The NeDB id of the required perk or trait */
    id: ID_STRING,

    /** How many ranks of the requirement are needed */
    ranks: z.number().int().optional()
  })
});

export const LOGIC_LEAF_SOURCE_SCHEMA = z.union([
  SPECIAL_REQ_SOURCE_SCHEMA,
  SKILL_REQ_SOURCE_SCHEMA,
  PERK_REQ_SOURCE_SCHEMA
]);

export type LogicNodeSource = LogicBranchSource | LogicLeafSource;
export const LOGIC_NODE_SOURCE_SCHEMA: z.ZodType<LogicNodeSource> = z.union([
  LOGIC_BRANCH_SOURCE_SCHEMA,
  LOGIC_LEAF_SOURCE_SCHEMA
]);

export const PERK_SOURCE_SCHEMA = BASE_ITEM_SOURCE_SCHEMA.extend({
  prerequisites: LOGIC_BRANCH_SOURCE_SCHEMA.default({
    all: []
  })
});

export type LogicLeafSource = z.infer<typeof LOGIC_LEAF_SOURCE_SCHEMA>;
