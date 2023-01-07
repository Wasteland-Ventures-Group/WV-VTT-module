import type { ActorDataProperties } from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/actorData";
import type WvItem from "../../../item/wvItem";
import { BaseItemProperties } from "../common/baseItem/properties";
import {
  LogicBranchSource,
  LogicLeafSource,
  LOGIC_BRANCH_SOURCE_SCHEMA,
  LOGIC_LEAF_SOURCE_SCHEMA,
  PerkDataSourceData,
  PerkRequirementSource,
  SkillRequirementSource,
  SpecialRequirementSource
} from "./source";

export type PerkDataPropertiesData = BaseItemProperties & {
  prerequisites: LogicBranchProperties;
};
export const PerkDataPropertiesData = {
  from(source: PerkDataSourceData, owningItem: WvItem): PerkDataPropertiesData {
    const baseProperties = BaseItemProperties.from(source, owningItem);
    const prerequisites = new LogicBranchProperties(source.prerequisites);
    return {
      ...source,
      ...baseProperties,
      prerequisites
    };
  }
};

type LogicNodeProperties = LogicBranchProperties | LogicLeafProperties;

export class LogicBranchProperties {
  /**
   * @param source - The source data for the logic branch
   */
  constructor(source: LogicBranchSource) {
    let sourceChildren;
    if ("any" in source) {
      this.kind = "or";
      sourceChildren = source.any;
    } else {
      this.kind = "and";
      sourceChildren = source.all;
    }

    this.children = sourceChildren.map((sourceChild) => {
      const asBranch = LOGIC_BRANCH_SOURCE_SCHEMA.safeParse(sourceChild);
      if (asBranch.success) return new LogicBranchProperties(asBranch.data);
      const asLeaf = LOGIC_LEAF_SOURCE_SCHEMA.safeParse(sourceChild);
      if (asLeaf.success) return LogicLeafProperties.from(asLeaf.data);

      throw Error(`Not a branch nor a leaf: ${sourceChild}`);
    });
  }

  /** This node's children */
  children: LogicNodeProperties[];

  /** The kind of reduction this node performs on its children */
  kind: "and" | "or";

  /**
   * Checks if the actor meets the prerequisites for a perk
   * @param actor The actor whose data to check
   * @returns true iff the actor satisfies all requirements
   */
  satisfies(actor: ActorDataProperties): boolean {
    const results = this.children.map((child) => child.satisfies(actor));
    if (this.kind == "and") {
      return results.reduce((a, b) => a && b, true);
    } else {
      return results.reduce((a, b) => a || b, false);
    }
  }
}

export const LogicLeafProperties = {
  /**
   * Creates a new logic (bottom-type requirement) leaf from source data
   * @param source - the source leaf
   * @returns the new leaf with properties
   */
  from(source: LogicLeafSource): LogicLeafProperties {
    if ("special" in source) return new SpecialRequirement(source);
    else if ("skill" in source) return new SkillRequirement(source);
    else return new PerkRequirement(source);
  }
};

/**
 * Basic, non-compound requirement
 */
interface LogicLeafProperties {
  /**
   * Checks if the actor meets the prerequisites for a perk
   * @param actor The actor whose data to check
   * @returns true iff the actor satisfies all requirements
   */
  satisfies(actor: ActorDataProperties): boolean;
}

/**
 * Requirement for SPECIALs
 */
class SpecialRequirement implements LogicLeafProperties {
  constructor(public source: SpecialRequirementSource) {}

  satisfies(actor: ActorDataProperties): boolean {
    const special = actor.data.specials[this.source.special];
    if ("min" in this.source) return this.source.min <= special.permTotal;
    else return special.permTotal < this.source.max;
  }
}

/**
 * Requirement for skills
 */
class SkillRequirement implements LogicLeafProperties {
  constructor(public source: SkillRequirementSource) {}

  satisfies(actor: ActorDataProperties): boolean {
    const skill = actor.data.skills[this.source.skill];
    if ("min" in this.source) return this.source.min <= skill.total;
    else return skill.total < this.source.max;
  }
}

/**
 * Requirement for other perks
 */
class PerkRequirement implements LogicLeafProperties {
  constructor(public source: PerkRequirementSource) {}

  satisfies(_actor: ActorDataProperties): boolean {
    throw new Error("Method not implemented.");
  }
}
