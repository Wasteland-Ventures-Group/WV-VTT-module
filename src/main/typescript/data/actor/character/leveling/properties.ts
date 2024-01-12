import type { SkillName } from "../../../../constants.js";
import type { SkillInfo } from "../../common/skills/properties.js";
import LevelingSource from "./source.js";

export default class LevelingProperties
  extends LevelingSource
  implements SkillInfo
{
  constructor(source: LevelingSource) {
    super();
    foundry.utils.mergeObject(this, source);
  }

  getValue(skill: SkillName): number {
    return this.skillRanks[skill];
  }

  /** The current level of the character */
  get level(): number {
    return Math.floor((1 + Math.sqrt(this.experience / 12.5 + 1)) / 2);
  }

  /** The maximum skill points of the character */
  get maxSkillPoints(): number {
    return this.levelIntelligences.reduce(
      (skillPoints, intelligence) =>
        skillPoints + Math.floor(intelligence / 2) + 10,
      0
    );
  }

  get totalSpecialPoints(): number {
    return Object.values(this.specialPoints).reduce(
      (total, points) => total + points,
      0
    );
  }

  /**
   * The amount of experience needed for the character to advance to the next
   * level
   */
  get xpForNextLevel(): number {
    return 50 * (this.level + 1) * this.level;
  }
}
